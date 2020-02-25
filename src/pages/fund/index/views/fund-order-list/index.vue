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
                .block__footer--left {{item.discribe}}
                .block__footer--right
                    van-button(
                        class="btn" 
                        :disabled="item.actionInfo.action.rule_detail.most_user === item.actionInfo.group.order_count" 
                        @click="handlerShareBtn(item)") 邀请拼团
            .block__footer-hk(v-if="item.actionInfo && code != 1")
                .block__footer--left 
                    p {{item.discribe}}
                .block__footer--right
                    van-button(
                        class="btn"
                        :disabled="item.actionInfo.action.rule_detail.most_user === item.actionInfo.group.order_count"  
                        @click="handlerShareBtn(item)") {{$t('shareActive')}}
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
    getGroupOrders
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
            shareActive: '分享活动',
            fundName: '基金名称',
            amountMoney: '金额',
            share: '份额',
            time: '时间',
            nomore: '暂无订单记录',
            nomore1: '无更多内容'
        },
        zhCHT: {
            shareActive: '分享活動',
            fundName: '基金名稱',
            amountMoney: '金額',
            share: '份額',
            time: '時間',
            nomore: '暫無訂單記錄',
            nomore1: '無更多內容'
        },
        en: {
            shareActive: 'Share',
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
            maxNumberPeople: null,
            shareTitle: '',
            groupRestUsers: 5,
            orderNo: '',
            fundName: '',
            appType: null
        }
    },
    methods: {
        //查询拼团订单
        async getGroupOrders() {},
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
        async handlerShareBtn(item) {
            this.bizId = item.actionInfo.action.biz_id
            this.groupId = item.actionInfo.group.group_id
            this.orderNo = item.orderNo
            this.fundName = item.fundBaseInfoVO.fundName
            this.maxNumberPeople =
                item.actionInfo.action.rule_detail.most_user - item.countNumber
            try {
                let mostNum
                let restNum
                this.appType = item.actionInfo.action.app_type
                if (
                    item.actionInfo.action &&
                    item.actionInfo.action.rule_detail
                ) {
                    mostNum = item.actionInfo.action.rule_detail.most_user

                    this.discount =
                        item.actionInfo.action.rule_detail.rule_list[
                            item.actionInfo.action.rule_detail.rule_list
                                .length - 1
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
                if (
                    item.actionInfo.action &&
                    item.actionInfo.action.rule_detail
                ) {
                    restNum =
                        item.actionInfo.action.rule_detail.rule_list[0]
                            .start_user_count - orderList.length
                }

                this.shareTitle = this.$t([
                    `<p>申购申请已提交</p>`,
                    `<p>認購申請已提交</p>`,
                    `<p>Subscription submitted</p>`
                ])
                if (orderList.length === mostNum) {
                    this.shareTitle += this.$t([
                        `<p>同行认购成功，团队已满员</p>`,
                        `<p>同行認購成功，團隊已滿</p>`,
                        `<p>Your group is full, you have got the Group Discount offer. </p>`
                    ])
                } else {
                    let mostRest = mostNum - orderList.length

                    // 未成团
                    if (restNum > 0) {
                        this.shareTitle += this.$t([
                            `<p>还差 ${restNum} 人成团，赶快邀请好友来拼团吧</p>`,
                            `<p>還差${restNum}人，趕緊邀請好友一同參與「同行優惠」</p>`,
                            `<p>${restNum} people needed to get the ${mostRest}% discount on subscription fee.</p>`
                        ])
                    } else {
                        this.shareTitle += this.$t([
                            `<p>团队已达到标，还可以邀请 ${mostRest} 人</p>`,
                            `<p>「同行優惠」已達成目標，還可以再多${mostRest}人一同參與</p>`,
                            `<p>You have entitled Group Discount, you can have ${mostRest} more people to join your group.</p>`
                        ])
                    }
                }

                if (
                    item.actionInfo.action &&
                    item.actionInfo.action.rule_detail
                ) {
                    this.groupRestUsers = this.discount =
                        item.actionInfo.action.rule_detail.rule_list[0]
                            .start_user_count - orderList.length
                }
                this.showShare = true
            } catch (e) {
                console.log('getGroupOrders:error:>>>', e)
            }
        },

        async handleShare(_index) {
            // webViewClick('Invitefriend', 'shareurl', '分享链接')
            let shareTypeMap = appType.Hk
                ? [
                      'whatsapp',
                      'wechat_friends_circle',
                      'wechat_friend',
                      'twitter'
                  ]
                : ['wechat_friend', 'wechat_friends_circle', 'qq', 'weibo']

            let shareType = shareTypeMap[_index]
            try {
                let lt =
                    (langType.Ch && 1) ||
                    (langType.Hk && 2) ||
                    (langType.En && 3) ||
                    1

                let link = `${this.$appOrigin}/hqzx/marketing/group.html?appType=${this.appType}&langType=${lt}&biz_type=0&biz_id=${this.bizId}&group_id=${this.groupId}&invitationCode=${this.userInfo.invitationCode}&order_id=${this.orderNo}#/invite`
                let pageUrl = `${window.location.origin}/hqzx/marketing/group.html?appType=${this.appType}&langType=${lt}&biz_type=0&biz_id=${this.bizId}&group_id=${this.groupId}&invitationCode=${this.userInfo.invitationCode}&order_id=${this.orderNo}#/invite`
                let shortUrl = await getShortUrl({
                    long: encodeURIComponent(link)
                })
                let shortPageUrl = await getShortUrl({
                    long: encodeURIComponent(pageUrl)
                })
                let title =
                    this.code === 1
                        ? this.$t([
                              `我已申购${this.fundName}，老司机开团，就差你上车啦！`,
                              `我已申購${this.fundName}，就差你一個了！`,
                              `I am subscribing${this.fundName}， join me now!`
                          ])
                        : this.$t([
                              `我已认购${this.fundName}，老司机开团，就差你上车啦！`,
                              `我已認購${this.fundName}，就差你一個了！`,
                              `I am subscribing${this.fundName}， join me now!`
                          ])
                let description =
                    this.code === 1
                        ? this.$t([
                              '和我一起拼团买，尊享申购费折扣返还！点击了解详情>>>',
                              '一同購買更享「同行優惠」，尊享申購費折扣！點擊了解詳情>>>',
                              'Subscribe together to get the Group Discount on the subscription fee. Click here for details >>>'
                          ])
                        : this.$t([
                              '和我一起拼团买，尊享认购费折扣返还！点击了解详情>>>',
                              '一同購買更享「同行優惠」，尊享認購費折扣！點擊了解詳情>>>',
                              'Subscribe together to get the Group Discount on the subscription fee. Click here for details >>>'
                          ])
                await jsBridge.callApp('command_share', {
                    shareType: shareType,
                    title: title,
                    description: description,
                    pageUrl: `${window.location.origin}/${shortPageUrl.url}`,
                    shortUrl: `${this.$appOrigin}/${shortUrl.url}`,
                    overseaPageUrl: `${this.$appOrigin}/${shortUrl.url}`,
                    thumbUrl: `${window.location.origin}/webapp/marketing/images/mgmChSharev2.png`
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
                let list
                if (order_list.length > 0) {
                    list = this.list.map(orderItem => {
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
                                        item.action.rule_detail.rule_list[0].discount
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
                                if (orderItem.countNumber > 0) {
                                    orderItem.discribe = this.$t([
                                        `再邀请${
                                            orderItem.countNumber
                                        }人可享${100 -
                                            orderItem.actionInfo.action
                                                .discountNum}%申购费返还`,
                                        `再多${
                                            orderItem.countNumber
                                        }人參與「同行優惠」可享申購費${100 -
                                            orderItem.actionInfo.action
                                                .discountNum}%`,
                                        `${
                                            orderItem.countNumber
                                        } people needed to get the ${100 -
                                            orderItem.actionInfo.action
                                                .discountNum}% discount on subscription fee.`
                                    ])
                                } else {
                                    if (
                                        orderItem.actionInfo.action.rule_detail
                                            .most_user -
                                            item.group.order_count ===
                                        0
                                    ) {
                                        orderItem.discribe = this.$t([
                                            `同行认购成功，团队已满`,
                                            `同行認購成功，團隊已滿`,
                                            `Your group is full, you have got the Group Discount offer.`
                                        ])
                                    } else {
                                        orderItem.discribe = this.$t([
                                            `已成团，还可以邀请${orderItem
                                                .actionInfo.action.rule_detail
                                                .most_user -
                                                item.group.order_count}人`,
                                            `「同行優惠」已達成目標，還可以再多${orderItem
                                                .actionInfo.action.rule_detail
                                                .most_user -
                                                item.group
                                                    .order_count}人一同參與`,
                                            `You have entitled Group Discount, you can have ${orderItem
                                                .actionInfo.action.rule_detail
                                                .most_user -
                                                item.group
                                                    .order_count} more people to join your group.`
                                        ])
                                    }
                                }
                            }
                        })
                        return orderItem
                    })
                    this.list = list
                    console.log(this.list)
                }
            } catch (e) {
                console.log(e.msg)
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
            // line-height: 40px;
            .block__footer--left {
                color: #191919;
                display: flex;
                align-items: center;
                width: 70%;
                p {
                    line-height: 20px;
                }
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
            // line-height: 40px;
            .block__footer--left {
                color: #ff7127;
                width: 70%;
                margin: 0 4px 0 0;
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
