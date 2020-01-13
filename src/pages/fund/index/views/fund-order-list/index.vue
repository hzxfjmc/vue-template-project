<template lang="pug">
.income-details-content
    van-list.order-record-list(v-model="loading" :finished="finished" :finished-text="finishedText" @load="onLoad")
        .block-list(
            class="border-bottom" 
            v-for="(item,index) in list" 
            :key="item.orderNo" 
            )
            .block__list--item(@click="toDetailHandle(item)")
                .block-left 
                    span.element-fund-name {{item.tradeTypeName}}
                    span.element-fund-name1 {{$t('fundName')}}
                    template(v-if="item.tradeType === 1")
                        span.element-price {{$t('amountMoney')}}
                    template(v-else)
                        span.element-price {{$t('share')}}
                    span.element-time {{$t('time')}}
                .block-right 
                    span.msg(class="element-fund-name")(v-if="item.externalStatus == 1") {{item.externalName}}
                    span.msg(class="element-fund-color")(v-if="item.externalStatus == 2") {{item.externalName}}
                    span.msg(class="element-fund-color1")(v-if="item.externalStatus == 3") {{item.externalName}}
                    span.msg(class="element-fund-color2")(v-if="item.externalStatus == 4") {{item.externalName}}
                    span.msg(class="element-fund-color3")(v-if="item.externalStatus == 5") {{item.externalName}}
                    span.element-time.fund-name {{item.fundBaseInfoVO.fundName}}
                    template(v-if="item.tradeType === 1")
                        span.element-price {{item.currency && item.currency.name}} {{item.orderAmount}}
                    template(v-else)
                        span.element-price {{item.orderShare |sliceFixedTwo(4)}}
                    span.element-time {{item.orderTime}}
            .block__footer(v-if="item.actionInfo && code != 2")
                .block__footer--left(v-if="item.countNumber > 0") 再邀请{{item.countNumber}}人即可享受{{item.actionInfo.action.discountNum/10}}折申购费
                .block__footer--left(v-else) 已成团，还可以邀请{{item.actionInfo.action.rule_detail.most_user - item.countNumber}}人
                .block__footer--right
                    van-button(
                        class="btn" 
                        :disabled="item.actionInfo.action.rule_detail.most_user === item.countNumber" 
                        @click="handlerShareBtn(item)") 邀请拼团
            .block__footer-hk(v-if="item.actionInfo && code != 1")
                .block__footer--left(v-if="item.countNumber>0") 再邀请{{item.countNumber}}人即可享受{{item.actionInfo.action.discountNum/10}}折申购费
                .block__footer--left(v-else) 已成团，还可以邀请{{item.actionInfo.action.rule_detail.most_user - item.countNumber}}人
                .block__footer--right
                    van-button(
                        class="btn"
                        :disabled="item.actionInfo.action.rule_detail.most_user === item.countNumber"  
                        @click="handlerShareBtn(item)") 分享活动
            share-way(
                v-model="showShare"
                @handleShare="handleShare"
                :title="shareTitle"
                )
    .block-element-nomore(v-if="noMoreShow")
        img.img(src="@/assets/img/fund/icon-norecord.png") 
        .no-record-box {{$t('nomore')}}
            
</template>
<script>
import { fundOrderList } from '@/service/finance-server.js'
import dayjs from 'dayjs'
import { transNumToThousandMark } from '@/utils/tools.js'
import {
    handlerBatchgetUserGroupOrder,
    getGroupOrders,
    getGroupAction
} from '@/service/zt-group-apiserver.js'
import { List } from 'vant'
import shareWay from '@/biz-components/share-way/index'
import { getShortUrl } from '@/service/news-shorturl.js'
import jsBridge from '@/utils/js-bridge'
import { appType, langType } from '@/utils/html-utils.js'
import { getFundUserInfo } from '@/service/user-server.js'
import { getSource } from '@/service/customer-relationship-server'
export default {
    components: {
        [List.name]: List,
        shareWay
    },
    i18n: {
        zhCHS: {
            invitation: '再邀请1人即可享受9折申购费',
            group: '已成团，还可以邀请453432人',
            shareActive: '分享活动',
            fundName: '基金名称',
            amountMoney: '金额',
            share: '份额',
            time: '时间',
            nomore: '暂无订单记录',
            nomore1: '无更多内容'
        },
        zhCHT: {
            invitation: '再邀请1人即可享受9折申购费',
            group: '已成团，还可以邀请453432人',
            shareActive: '分享活动',
            fundName: '基金名稱',
            amountMoney: '金額',
            share: '份額',
            time: '時間',
            nomore: '暫無訂單記錄',
            nomore1: '無更多內容'
        },
        en: {
            invitation: '再邀请1人即可享受9折申购费',
            group: '已成团，还可以邀请453432人',
            shareActive: '分享活动',
            fundName: 'Fund Name',
            amountMoney: 'Amount',
            share: 'Unit',
            time: 'Time',
            nomore: 'No Order Record',
            nomore1: 'No More Content'
        }
    },
    data() {
        return {
            content: '还差人，赶快邀请好友来拼团把',
            showShare: false,
            list: [],
            code: null,
            noMoreShow: false,
            pageSize: 20,
            pageNum: 1,
            total: 0,
            loading: false,
            finished: false,
            finishedText: '无更多内容',
            currency: this.$route.query.currency,
            orderList: [],
            bizId: '',
            groupId: '',
            userInfo: {},
            shareTitle: '',
            groupRestUsers: 5,
            orderNo: '',
            fundName: ''
        }
    },
    methods: {
        //查询拼团订单
        async getGroupOrders() {
            try {
                let data = await getGroupAction({
                    biz_id: this.bizId,
                    biz_type: 0,
                    action_status: 2
                })
                let mostNum
                let restNum
                if (data.action && data.action.rule_detail) {
                    mostNum = JSON.parse(data.action.rule_detail).most_user

                    this.discount = JSON.parse(
                        data.action.rule_detail
                    ).rule_list[
                        JSON.parse(data.action.rule_detail).rule_list.length - 1
                    ].discount
                }
                if (!this.groupId && this.groupId === 0) {
                    this.discountShow = true
                    return
                }
                if (!this.groupId) return
                let grdersData = await getGroupOrders({
                    group_id: +this.groupId
                })
                let orderList = grdersData.order_list || []
                if (data.action && data.action.rule_detail) {
                    restNum =
                        JSON.parse(data.action.rule_detail).rule_list[0]
                            .start_user_count - orderList.length
                }

                this.shareTitle = `<p>认购申请已提交</p>`
                if (orderList.length === mostNum) {
                    this.shareTitle += `<p>同行认购成功，团队已满员</p>`
                } else {
                    let mostRest = mostNum - orderList.length
                    // 未成团
                    if (restNum > 0) {
                        this.shareTitle += `<p>还差 ${restNum} 人，赶快邀请好友来拼团吧</p>`
                    } else {
                        this.shareTitle += `<p>团队已达到标，还可以邀请 ${mostRest} 人</p>`
                    }
                }

                if (data.action && data.action.rule_detail) {
                    this.groupRestUsers = this.discount =
                        JSON.parse(data.action.rule_detail).rule_list[0]
                            .start_user_count - orderList.length
                }
            } catch (e) {
                this.$toast(e.msg)
                console.log('getGroupOrders:error:>>>', e)
            }
        },
        //获取用户信息
        async getFundUserInfo() {
            try {
                const res = await getFundUserInfo()
                this.userInfo = res
            } catch (e) {
                this.$toast(e.msg)
                console.log('getFundUserInfo:error:>>>', e)
            }
        },
        handlerShareBtn(item) {
            this.bizId = item.actionInfo.action.biz_id
            this.groupId = item.actionInfo.group.group_id
            this.orderNo = item.orderNo
            this.fundName = item.fundBaseInfoVO.fundName
            this.getGroupOrders()
            this.showShare = true
        },

        async handleShare(_index) {
            // webViewClick('Invitefriend', 'shareurl', '分享链接')
            let shareTypeMap = [
                'wechat_friend',
                'wechat_friends_circle',
                'qq',
                'weibo'
            ]

            let shareType = shareTypeMap[_index]
            try {
                let lt =
                    (langType.Ch && 1) ||
                    (langType.Hk && 2) ||
                    (langType.En && 3) ||
                    1

                let at = appType.Hk ? 2 : 1
                let link = `${this.$appOrigin}/hqzx/marketing/group.html?appType=${at}&langType=${lt}&biz_type=0&biz_id=${this.bizId}&group_id=${this.groupId}&invitationCode=${this.userInfo.invitationCode}&order_id=${this.orderNo}#/invite`
                let shortUrl = await getShortUrl({
                    long: encodeURIComponent(link)
                })
                await jsBridge.callApp('command_share', {
                    shareType: shareType,
                    title: `我正在申购${this.fundName}，老司机开团，就差你上车啦！`,
                    description:
                        '和我一起拼团买，尊享申购费折扣返还！点击了解详情>>>',
                    pageUrl: unescape(link),
                    shortUrl: `${this.$appOrigin}/${shortUrl.url}`,
                    thumbUrl: `${this.$appOrigin}/webapp/marketing/images/mgmChSharev2.png`
                })
                this.$toast('分享成功')
            } catch (e) {
                e.msg && this.$toast(e.msg)
            }
            // }
        },
        // 跳转到详情
        toDetailHandle(item) {
            let data = {
                name: 'order-record-detail',
                query: {
                    orderNo: item.orderNo,
                    orderStatus: item.externalStatus,
                    currencyType: this.$route.query.currency
                }
            }
            if (item.actionInfo) {
                data.query.groupId = item.actionInfo.group.group_id
            }
            this.$router.push(data)
        },
        //上拉加载更多
        onLoad() {
            if (this.list.length < this.total) {
                this.pageNum = this.pageNum + 1
                this.fundOrderList()
            }
        },
        async handlerBatchgetUserGroupOrder() {
            try {
                let arr = []
                this.list.map(item => {
                    let obj = {
                        biz_id: item.fundBaseInfoVO.fundId,
                        order_id: item.orderNo,
                        biz_type: 0
                    }
                    arr.push(obj)
                })
                const { order_list } = await handlerBatchgetUserGroupOrder({
                    biz_order_list: arr
                })
                if (order_list.length > 0) {
                    let list = this.list.map(orderItem => {
                        order_list.map(item => {
                            try {
                                if (
                                    item.action &&
                                    item.action.rule_detail &&
                                    typeof item.action.rule_detail == 'string'
                                ) {
                                    item.action.rule_detail = JSON.parse(
                                        item.action.rule_detail
                                    )
                                    item.action.discountNum =
                                        item.action.rule_detail.rule_list[
                                            item.action.rule_detail.rule_list
                                                .length - 1
                                        ].discount
                                }
                            } catch (e) {
                                console.log(e)
                            }
                            if (
                                item.group_order.str_order_id ==
                                    orderItem.orderNo &&
                                item.action.status === 3
                            ) {
                                orderItem.actionInfo = item
                                orderItem.countNumber =
                                    item.action.rule_detail.rule_list[0]
                                        .start_user_count -
                                    item.group.order_count
                            }
                        })
                        return orderItem
                    })
                    this.list = list
                    console.log(this.list)
                }
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        async fundOrderList() {
            try {
                const { list, pageSize, pageNum, total } = await fundOrderList({
                    pageNum: this.pageNum,
                    pageSize: this.pageSize
                })
                let arr = []
                list.map(item => {
                    item.orderAmount = transNumToThousandMark(item.orderAmount)
                    item.orderTime = dayjs(item.orderTime).format(
                        'YYYY-MM-DD HH:mm:ss'
                    )
                    let obj = {
                        biz_id: item.fundBaseInfoVO.fundId,
                        order_id: item.orderNo,
                        biz_type: 0
                    }
                    arr.push(obj)
                })

                this.loading = false
                this.list = this.list.concat(list)
                this.pageNum = pageNum
                this.total = total
                this.pageSize = pageSize

                this.noMoreShow = this.total == 0
                if (this.list.length >= this.total) {
                    this.finished = true
                }
                this.finishedText = this.$t('nomore1')
                this.finishedText = this.total == 0 ? '' : this.finishedText
                this.handlerBatchgetUserGroupOrder()
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        //获取用户归属 1大陆 2香港
        async getSource() {
            try {
                const { code } = await getSource()
                this.code = code
                if (!this.isLogin) {
                    this.code = this.appType.Hk ? 2 : 1
                }
            } catch (e) {
                this.$toast(e.msg)
            }
        }
    },
    async created() {
        this.getFundUserInfo()
        this.fundOrderList()
        this.getSource()
    }
}
</script>
<style lang="scss" scoped>
.income-details-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    -webkit-overflow-scrolling: touch;
    background: #fff;
    overflow: hidden;
    overflow-y: auto;
    .block-list {
        width: 100%;
        padding: 10px 2%;
        // display: flex;
        align-items: center;
        .block__list--item {
            display: flex;
            flex-direction: row;
        }
        .block-left {
            display: flex;
            width: 30%;
            flex-direction: column;
            span {
                display: inline-block;
                line-height: 25px;
                color: $text-color5;
            }
            .element-fund-name {
                font-size: 16px;
                font-weight: 400;
                line-height: 30px;
                color: $text-color;
            }
        }
        .block-right {
            display: flex;
            width: 70%;
            justify-content: flex-end;
            flex-direction: column;
            align-items: flex-end;
            span {
                display: inline-block;
                line-height: 25px;
            }
            .element-fund-name {
                line-height: 30px;
                color: #2177ff;
            }
            .element-fund-color {
                color: #ffba00;
            }
            .element-fund-color1 {
                color: #191919;
            }
            .element-fund-color2 {
                color: #ff7127;
            }
            .element-fund-color3 {
                color: #41ca1e;
            }
            .element-time {
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;
                overflow: hidden;
            }
            .fund-name {
                width: 100%;
                text-align: right;
                text-overflow: ellipsis;
                overflow: hidden;
                display: block;
                white-space: nowrap;
                line-height: 25px;
            }
        }
        .block__footer {
            width: 100%;
            padding: 0 12px;
            margin: 5px 0 0 0;
            display: flex;
            flex-direction: row;
            height: 60px;
            background: rgba(234, 61, 61, 0.05);
            border-radius: 4px;
            align-items: center;
            line-height: 40px;
            .block__footer--left {
                color: #191919;
                width: 70%;
            }
            .block__footer--right {
                // height: 36px;
                .btn {
                    width: 104px;
                    line-height: 32px;
                    height: 36px !important;
                    background: #ea3d3d;
                    color: #fff;
                }
            }
        }
        .block__footer-hk {
            width: 100%;
            padding: 0 12px;
            margin: 5px 0 0 0;
            display: flex;
            flex-direction: row;
            height: 60px;
            border-radius: 4px;
            align-items: center;
            line-height: 40px;
            .block__footer--left {
                color: #ff7127;
                width: 70%;
            }
            .block__footer--right {
                // height: 36px;
                .btn {
                    width: 104px;
                    line-height: 32px;
                    height: 36px !important;
                    background: #1e93f3;
                    color: #fff;
                }
            }
        }
    }
}
.block-element-nomore {
    width: 100%;
    text-align: center;
    margin: 150px 0 0 0;
    img {
        width: 130px;
    }
    .no-record-box {
        color: rgba(25, 25, 25, 0.5);
        margin: 10px 0 0 0;
    }
}
</style>
