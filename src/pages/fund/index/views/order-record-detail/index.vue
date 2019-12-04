<template lang="pug">
    yx-container.order-record-detail-container
        .order-record-detail(slot='main')
            .fund-introduce
                .fund-name {{fundIntro}}
                .fund-detail(v-if="fundDetail") ISIN: {{fundDetail}}
            order-status-about(:orderStatus='orderStatus' :orderStatusValue='orderStatusValue' :beginTime='beginTime' :endTime='endTime' :tradeType='tradeType' v-if="[1,2].includes(orderStatus)")
            van-cell-group(class="order-group")
                van-cell(class="order-time" )
                    .order-item.flex(v-if="![1,2].includes(orderStatus)")
                        span.itemName {{$t('orderStatus')}}
                        span(:class='differenceColor') {{orderStatusValue}}
                    .order-item.flex
                        span.itemName {{$t('orderTime')}}
                        span {{orderTimeValue}}
                    .order-item.flex(v-if="![1,2].includes(orderStatus)")
                        span.itemName {{$t('orderFinish')}}
                        span {{orderFinishValue}}
                    .order-item.flex
                        span.itemName {{$t('orderNum')}}
                        span {{orderNumValue}}
                    .order-item.flex(v-if="orderStatus===2")
                        span.itemName {{$t('orderNetWorth')}}
                        span {{netPrice}}
                    .order-item.flex(v-if="orderStatus===2")
                        span.itemName {{$t('orderShares')}}
                        span {{orderShare}} 
                    .order-item.flex(v-if="[1,2].includes(orderStatus)")
                            span.itemName {{$t('amount')}}
                            span.type-text {{moneyNum}}
                    .order-item.flex(v-if="[1,2].includes(orderStatus)")
                            span.itemName {{$t('orderName')}}
                            span.type {{orderType}}
                    .order-item.flex(v-if="[1,2].includes(orderStatus)")
                            span.itemName {{$t('orderFree')}}
                            span.type {{orderFee}}
                van-cell(class="order-time" v-if="![1,2].includes(orderStatus)")
                    .order-item.flex
                        span.itemName {{$t('orderNetWorth')}}
                        span {{netPrice}}
                    .order-item.flex
                        span.itemName {{$t('orderShares')}}
                        span {{orderShare}}
                    .order-item.flex(v-if="![1,2].includes(orderStatus)")
                            span.itemName {{$t('amount')}}
                            span.type-text {{moneyNum}}
                    .order-item.flex(v-if="![1,2].includes(orderStatus)")
                            span.itemName {{$t('orderName')}}
                            span.type {{orderType}}
                    .order-item.flex(v-if="![1,2].includes(orderStatus)")
                            span.itemName {{$t('orderFree')}}
                            span.type {{orderFee}}
            .btn-buy-more
                van-button(type="info" round  size="large" @click="buyMoreHandle") {{$t('againBuy')}}
            van-dialog(v-model='isShowBackout' :message="$t('dialogMsg')" showCancelButton=true :cancelButtonText="$t('cancelButtonText')"  :confirmButtonText="$t('confirmButtonText')" @confirm='confirmBackoutHandle')
    
</template>

<script>
import { fundOrderDetail, cancelFundOrder } from '@/service/finance-server.js'
// import { getTradePasswordToken } from '@/service/user-server.js'
import orderStatusAbout from './components/order-status-about'
import { transNumToThousandMark } from '@/utils/tools.js'
import { isYouxinApp } from '@/utils/html-utils.js'
import jsBridge from '@/utils/js-bridge'
import dayjs from 'dayjs'
import { i18nOrderStatusData } from './order-status-detail-i18n'
import { differColor } from '../order-record/differColor.js'

export default {
    i18n: i18nOrderStatusData,
    components: {
        orderStatusAbout
    },
    watch: {
        $route(to, from) {
            if (from.path === '/order-record' && this.$route.query.orderNo) {
                this.fundOrderDetailFun()
            }
            if (
                from.path === '/fund-subscribe' &&
                this.orderStatus === 1 &&
                this.allowRevoke
            ) {
                this.setTitleBarBOButton()
            }
        },
        orderStatus(val) {
            if (val) {
                this.orderStatus = val
            }
        }
    },
    data() {
        return {
            fundIntro: '',
            fundName: '',
            fondId: '',
            fundDetail: '',
            orderAboutList: [
                { name: '订单生成时间', value: '2019-07-12 15:06:44' },
                { name: '订单号', value: '01907120540425132220050' }
            ],
            orderTimeValue: '',
            orderNumValue: '',
            orderType: '',
            orderNo: this.$route.query.orderNo,
            orderStatus: '',
            orderStatusValue: '',
            orderFinishValue: '',
            netPrice: '',
            orderShare: '',
            allowRevoke: false,
            beginTime: '07.01日',
            endTime: '07.19日',
            moneyNum: '2,000.000.00',
            differenceColor: '',
            detailMsg: {},
            title: '订单',
            isShowBackout: false,
            orderFee: '',
            tradeType: ''
        }
    },
    created() {
        if (this.$route.query.orderNo) {
            this.fundOrderDetailFun()
        }
        this.$route.query.orderStatus === 1
            ? this.setTitleBarBOButton()
            : this.clearTitleBarBOButton()
    },
    methods: {
        // 获取详情
        async fundOrderDetailFun() {
            try {
                let params = {
                    orderNo: this.$route.query.orderNo
                }
                let res = await fundOrderDetail(params)
                this.fondId = res.fundBaseInfoVO.fondId
                this.orderResult = res
                this.differenceColor = differColor(res.externalStatus)
                this.orderStatusValue = res.externalName
                this.orderStatus = res.externalStatus
                this.allowRevoke = res.allowRevoke
                if (
                    res.orderFee === null ||
                    ([1, 2].includes(res.externalStatus) &&
                        res.orderFee * 1 === 0)
                ) {
                    this.orderFee = this.$t('beConfirmed')
                } else {
                    this.orderFee = transNumToThousandMark(
                        (res.orderFee * 1).toFixed(2)
                    )
                }
                if (this.orderStatus === 1 && this.allowRevoke) {
                    this.setTitleBarBOButton()
                }
                this.beginTime =
                    (res.confirmDate &&
                        dayjs(res.confirmDate).format('MM.DD')) ||
                    '--'
                this.endTime =
                    (res.deliveryDate &&
                        dayjs(res.deliveryDate).format('MM.DD')) ||
                    '--'
                if (
                    res.orderShare === null ||
                    ([1, 2].includes(res.externalStatus) &&
                        res.orderShare * 1 === 0)
                ) {
                    this.orderShare = this.$t('beConfirmed')
                } else {
                    this.orderShare = transNumToThousandMark(res.orderShare, 4)
                }
                if (
                    res.netPrice === null ||
                    ([1, 2].includes(res.externalStatus) &&
                        res.netPrice * 1 === 0)
                ) {
                    this.netPrice = this.$t('beConfirmed')
                } else {
                    this.netPrice = transNumToThousandMark(
                        (res.netPrice * 1).toFixed(2)
                    )
                }
                this.orderFinishValue =
                    (res.finishTime &&
                        dayjs(res.finishTime).format('YYYY-MM-DD HH:mm:ss')) ||
                    '--'
                this.fundIntro = `${res.fundBaseInfoVO.fundName}`
                this.fundDetail = res.fundBaseInfoVO.isin
                this.orderTimeValue =
                    (res.orderTime &&
                        dayjs(res.orderTime).format('YYYY-MM-DD HH:mm:ss')) ||
                    '--'
                this.orderNumValue = res.orderNo
                this.tradeType = res.tradeType
                this.orderType = res.tradeTypeName
                if (
                    res.orderAmount === null ||
                    ([1, 2].includes(res.externalStatus) &&
                        res.orderAmount * 1 === 0)
                ) {
                    this.moneyNum = this.$t('beConfirmed')
                } else {
                    this.moneyNum =
                        res.currency.name +
                        transNumToThousandMark((res.orderAmount * 1).toFixed(2))
                }
            } catch (e) {
                if (e.msg) {
                    this.$alert({
                        message: e.msg
                    })
                }
            }
        },
        // 再买一笔
        buyMoreHandle() {
            this.$router.push({
                path: '/fund-subscribe',
                query: {
                    id: this.fondId,
                    currencyType: this.$route.query.currencyType
                }
            })
        },
        // 撤销
        showBackOutHandle() {
            this.isShowBackout = true
        },
        // 确认撤销
        async confirmBackoutHandle() {
            let submitStep = 0 // 0: 开始 1: 获取token成功 2: 申购成功
            let token = null
            try {
                let data = await jsBridge.callApp('command_trade_login', {
                    needToken: true
                })
                token = data && data.token
                submitStep = 1
            } catch (error) {
                console.log('tradeErrorMsg :', error)
            }
            // test:
            submitStep = 1
            try {
                if (submitStep === 1) {
                    let params = {
                        orderNo: this.$route.query.orderNo,
                        tradeToken: token
                    }
                    if (params.orderNo && params.tradeToken) {
                        await cancelFundOrder(params)
                        // 跳转到订单列表
                        this.$router.replace({
                            name: 'order-record',
                            query: {
                                isRefresh: true,
                                id: this.fondId
                            }
                        })
                        submitStep = 2
                    }
                }
            } catch (e) {
                if (e.msg) {
                    this.$alert({
                        message: e.msg
                    })
                }
            }
        },
        // 设置撤销按钮
        setTitleBarBOButton() {
            const _this = this
            if (isYouxinApp) {
                jsBridge.registerFn('showBackOut', function() {
                    _this.showBackOutHandle()
                })
                jsBridge.callApp('command_set_titlebar_button', {
                    position: 2,
                    type: 'text',
                    text: this.$t('backoutBtnText'),
                    clickCallback: 'showBackOut'
                })
            }
        },
        // 清除撤销按钮
        clearTitleBarBOButton() {
            if (isYouxinApp) {
                jsBridge.callApp('command_set_titlebar_button', {
                    type: 'hide',
                    position: 2,
                    text: '',
                    clickCallback: ''
                })
            }
        }
    },
    beforeRouteLeave(to, from, next) {
        this.clearTitleBarBOButton()
        next()
    }
}
</script>

<style lang="scss" scoped>
.order-record-detail-container {
    height: 100%;
    background-color: $background-color;
    font-family: '';
    .fund-introduce {
        background-color: $background-color;
        &::after {
            width: 100%;
            content: '';
            display: block;
            height: 10px;
            background-color: $background-bottom-color;
        }
        .fund-name {
            font-size: 16px;
            line-height: 22px;
            padding-top: 15px;
            margin-bottom: 6px;
            padding-left: 12px;
        }
        .fund-detail {
            font-size: 14px;
            color: $text-color5;
            padding: 0 0 12px 12px;
        }
    }
    .order-group {
        margin-bottom: 41px;
        .order-time {
            .itemName {
                color: $text-color5;
                margin-bottom: 10px;
            }
        }
        .order-money-cell {
            border-bottom: 1px solid rgba($color: $text-color, $alpha: 0.05);
            .order-money {
                .left-title {
                    flex-direction: column;
                    .type {
                        color: $text-color5;
                        font-size: 16px;
                        line-height: 22px;
                    }
                    .type-text {
                        @extend .type;
                        color: $text-color5;
                    }
                }
                .right-value {
                    // @extend .left-title;
                    flex-direction: column;
                    align-items: flex-end;
                    .type {
                        font-size: 16px;
                        line-height: 22px;
                    }
                    .type-text {
                        font-size: 24px;
                        line-height: 34px;
                    }
                }
            }
        }
    }
    .btn-buy-more {
        padding: 0 16px;
    }
}
.yellow-style {
    color: $cell-right-color !important;
}
.blue-style {
    color: $hk-text-line-color !important;
}
.grey-style {
    color: $text-color3 !important;
}
.green-style {
    color: $green-text-color !important;
}
.van-cell:not(:last-child)::after {
    left: 0;
}
</style>
