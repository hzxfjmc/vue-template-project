<template lang="pug">
.income-details-content
    .block__master
        span {{list}}
    van-list.order-record-list(v-model="loading" :finished="finished" :finished-text="finishedText" @load="onLoad")
        .block-list(
            class="border-bottom" 
            v-for="(item,index) in list" :key="index" 
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
            .block__footer(v-if="item.actionInfo")
                .block__footer--left 再邀请{{item.countNumber}}人即可享受{{item.actionInfo.action.discountNum/1000}}折申购费
                .block__footer--right
                    van-button(class="btn" @click="handlerShareBtn(item)") 邀请拼团
            share-way(
                v-model="showShare"
                overlay-class="activity-invited"
                @handleShare="handleShare"
                :title="content"
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
import { getCurrentUser } from '@/service/user-server.js'
export default {
    components: {
        [List.name]: List,
        shareWay
    },
    i18n: {
        zhCHS: {
            fundName: '基金名称',
            amountMoney: '金额',
            share: '份额',
            time: '时间',
            nomore: '暂无订单记录',
            nomore1: '无更多内容'
        },
        zhCHT: {
            fundName: '基金名稱',
            amountMoney: '金額',
            share: '份額',
            time: '時間',
            nomore: '暫無訂單記錄',
            nomore1: '無更多內容'
        },
        en: {
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
            groupRestUsers: 5
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
                let grdersData = await getGroupOrders({
                    group_id: this.groupId
                })
                let orderList = grdersData.order_list || []
                this.groupRestUsers =
                    JSON.parse(data.action.rule_detail).most_user -
                    orderList.length
                this.content = `还差${this.groupRestUsers}人，赶快邀请好友来拼团把`
            } catch (e) {
                this.$toast(e.msg)
                console.log('getGroupOrders:error:>>>', e)
            }
        },
        //获取用户信息
        async getCurrentUser() {
            try {
                const res = await getCurrentUser()
                this.userInfo = res
            } catch (e) {
                this.$toast(e.msg)
                console.log('getCurrentUser:error:>>>', e)
            }
        },
        handlerShareBtn(item) {
            this.bizId = item.actionInfo.action.biz_id
            this.groupId = item.actionInfo.group.group_id
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
                let link = `${this.$appOrigin}/hqzx/marketing/group.html?appType=${at}&langType=${lt}&biz_type=0&biz_id=${this.$route.query.id}&group_id=${this.$route.query.groupId}&&invitationCode=${this.userInfo.invitationCode}#/invite`
                let shortUrl = await getShortUrl({
                    long: encodeURIComponent(link)
                })
                await jsBridge.callApp('command_share', {
                    shareType: shareType,
                    title: `还差${this.groupRestUsers}人，赶快邀请好友来拼团吧`,
                    description: '',
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
            this.$router.push({
                name: 'order-record-detail',
                query: {
                    orderNo: item.orderNo,
                    orderStatus: item.externalStatus,
                    currencyType: this.$route.query.currency
                }
            })
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
                if (order_list.length != 0) {
                    order_list.map(item => {
                        item.action.rule_detail = JSON.parse(
                            item.action.rule_detail
                        )
                        item.action.discountNum =
                            item.action.rule_detail.rule_list[1].discount
                        this.list.map(items => {
                            if (item.group_order.order_id == items.orderNo) {
                                items.actionInfo = item
                                items.countNumber =
                                    item.action.rule_detail.most_user -
                                    item.group.order_count
                            }
                        })
                    })
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
        }
    },
    async created() {
        this.getCurrentUser()
        this.fundOrderList()
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
