<template lang="pug">
    yx-container.order-record-detail-container
        .order-record-detail(slot='main')
            .fund-introduce
                .fund-name {{fundIntro}}
                .fund-detail(v-if="fundDetail") ISIN: {{fundDetail}}
            order-status-about(
                :orderStatus='orderStatus' 
                :orderStatusValue='orderStatusValue' 
                :beginTime='beginTime' 
                :endTime='endTime' 
                :tradeType='tradeType' 
                v-if="orderFlag")
            van-cell-group(class="order-group")
                van-cell(class="order-time")
                    .order-item.flex(v-if="!orderFlag")
                        span.itemName {{$t('orderStatus')}}
                        span(:class='differenceColor') {{orderStatusValue}}
                    .order-item.flex(v-if="orderStatus===ORDER_STATUS.FAILED")
                        span.itemName {{$t('failedRemark')}}
                        span.block-right {{failedRemarkValue}}
                    .order-item.flex
                        span.itemName {{$t('orderTime')}}
                        span.block-right {{orderTimeValue}}
                    .order-item.flex(v-if="!orderFlag")
                        span.itemName {{$t('orderFinish')}}
                        span {{orderFinishValue}}
                    .order-item.flex
                        span.itemName {{$t('orderNum')}}
                        span {{orderNumValue}}
                    .order-item.flex(v-if="orderFlag")
                            span.itemName {{$t('orderName')}}
                            span.type {{orderType}}
                    .order-item.flex(v-if="orderShare != 0 && orderFlag")
                        span.itemName {{$t('orderShares')}}
                        span {{orderShare|transNumToThousandMark(4)}}
                    .order-item.flex(v-if="(tradeType === TRADE_TYPES.SUBSCRIBE || fixedInvest) && ORDER_STATUS.SUCCEED === orderStatus")
                        span.itemName {{$t('confirmOrderShares')}}
                        span {{orderShare|transNumToThousandMark(4)}}
                    .order-item.flex(v-if="netPrice && orderFlag")
                        span.itemName {{$t('orderNetWorth')}}
                        span {{netPrice|transNumToThousandMark(4)}}
                    .order-item.flex(v-if="moneyNum != 0 && orderFlag")
                            span.itemName {{$t('amount')}}
                            span.type-text {{currency}} {{moneyNum|transNumToThousandMark}}
                    .order-item.flex(v-if="tradeType === TRADE_TYPES.SUBSCRIBE")
                        span.itemName {{$t('fee')}}
                        span.type-text {{orderFee|transNumToThousandMark}}
                van-cell(class="order-time" v-if="!orderFlag")
                    .order-item.flex()
                        span.itemName {{$t('orderName')}}
                        span.type {{orderType}}
                    .order-item.flex(v-if="orderShare != 0")
                        span.itemName {{$t('orderShares')}}
                        span {{orderShare|transNumToThousandMark(4)}} 
                    .order-item.flex(v-if="netPrice")
                        span.itemName {{$t('orderNetWorth')}}
                        span {{netPrice|transNumToThousandMark(4)}}
                    .order-item.flex(v-if="moneyNum != 0")
                            span.itemName {{$t('amount')}}
                            span.type-text {{currency}} {{moneyNum|transNumToThousandMark}}
                    .order-item.flex(v-if="orderFee")
                            span.itemName {{$t('orderFree')}}
                            span.type {{orderFee|transNumToThousandMark}}
                    .order-item.flex(v-if="tradeType === TRADE_TYPES.SUBSCRIBE || fixedInvest")
                        span.itemName {{$t('debitWay')}}
                        span.type {{accountTypeFilter(accountType)}}
                    .order-item.flex(v-if="tradeType === TRADE_TYPES.SUBSCRIBE || fixedInvest")
                        span.itemName {{$t('orderAmount')}}
                        span.type {{(moneyNum + orderFee)|transNumToThousandMark}}
            .btn-buy-more
                van-button(type="info" round  size="large" @click="buyMoreHandle") {{$t('againBuy')}}
            van-dialog(v-model='isShowBackout' :message="$t('dialogMsg')" showCancelButton=true :cancelButtonText="$t('cancelButtonText')"  :confirmButtonText="$t('confirmButtonText')" @confirm='confirmBackoutHandle')
    
</template>

<script>
import { fundOrderDetail, cancelFundOrder } from '@/service/finance-server.js'
import { getFundDetail } from '@/service/finance-info-server.js'
// import { getTradePasswordToken } from '@/service/user-server.js'
import orderStatusAbout from './components/order-status-about'
import { transNumToThousandMark } from '@/utils/tools.js'
import { isYouxinApp } from '@/utils/html-utils.js'
import jsBridge from '@/utils/js-bridge'
import dayjs from 'dayjs'
import { i18nOrderStatusData } from './order-status-detail-i18n'
import { getFundUserInfo } from '@/service/user-server.js'
import { differColor } from '../order-record/differColor.js'
import { TRADE_TYPES, accountTypeMap, ORDER_STATUS } from './map'

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
            fundId: '',
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
            beginTime: '',
            endTime: '',
            moneyNum: '',
            differenceColor: '',
            detailMsg: {},
            title: '订单',
            isShowBackout: false,
            orderFee: '',
            tradeType: '',
            failedRemarkValue: '',
            currency: '',
            userInfo: {},
            fundRiskType: '',
            fundTradeInfoVO: {},
            fundHeaderInfoVO: {},
            fundOverviewInfoVO: {},
            TRADE_TYPES,
            accountType: '',
            fixedInvest: false,
            ORDER_STATUS
        }
    },
    computed: {
        orderFlag() {
            return [ORDER_STATUS.CONFIRMING, ORDER_STATUS.DEALING].includes(
                this.orderStatus
            )
        }
    },
    filters: {
        transNumToThousandMark
    },
    created() {
        if (this.$route.query.orderNo) {
            this.fundOrderDetailFun()
        }
        this.getFundUserInfo()
        this.$route.query.orderStatus === 1
            ? this.setTitleBarBOButton()
            : this.clearTitleBarBOButton()
    },
    methods: {
        //获取基金详情
        async getFundDetail(fundId, isin) {
            try {
                const {
                    fundTradeInfoVO,
                    fundHeaderInfoVO,
                    fundOverviewInfoVO
                } = await getFundDetail({
                    displayLocation: this.$route.query.displayLocation || 1,
                    fundId: fundId,
                    isin: isin
                })
                this.fundRiskType = fundOverviewInfoVO.fundRiskType
                this.fundOverviewInfoVO = fundOverviewInfoVO
                this.fundTradeInfoVO = fundTradeInfoVO
                this.fundHeaderInfoVO = fundHeaderInfoVO
            } catch (e) {
                this.$toast(e.msg)
                console.log('getFundDetail:error:>>>', e)
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
        // 获取详情
        async fundOrderDetailFun() {
            try {
                let params = {
                    orderNo: this.$route.query.orderNo
                }
                let res = await fundOrderDetail(params)
                this.fundId = res.fundBaseInfoVO.fundId
                this.orderResult = res
                this.differenceColor = differColor(res.externalStatus)
                this.getFundDetail(this.fundId, res.fundBaseInfoVO.isin)
                this.orderStatusValue = res.externalName
                this.orderStatus = res.externalStatus
                this.failedRemarkValue = res.rejectReason || '--'
                this.allowRevoke = res.allowRevoke
                this.orderFee = res.orderFee
                this.accountType = res.accountType
                this.fixedInvest = res.fixedInvest
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
                this.orderShare = res.orderShare
                this.netPrice = res.netPrice
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
                this.currency = res.currency.name
                this.moneyNum = res.orderAmount
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
            if (
                !this.userInfo.assessResult ||
                new Date().getTime() >
                    new Date(this.userInfo.validTime).getTime()
            ) {
                return this.$router.push({
                    path: '/risk-assessment-result',
                    query: {
                        id: this.fundId,
                        extendStatusBit: this.userInfo.extendStatusBit,
                        fundRiskType: this.fundRiskType,
                        currencyType: this.fundTradeInfoVO.currency.type
                    }
                })
            }
            if (
                this.userInfo.assessResult < this.fundHeaderInfoVO.fundRiskType
            ) {
                if (this.userInfo.damagedStatus === 1) {
                    return this.$router.push({
                        path: '/risk-appropriate-result',
                        query: {
                            id: this.fundId,
                            fundRiskType: this.fundRiskType
                        }
                    })
                }
                if (this.fundOverviewInfoVO.derivativeType != 1) {
                    return this.$router.push({
                        path: '/risk-appropriate-result',
                        query: {
                            id: this.fundId,
                            fundRiskType: this.fundRiskType
                        }
                    })
                } else {
                    let riskTipContent = this.$t([
                        `该产品为${this.fundHeaderInfoVO.fundRisk}（R${
                            this.fundHeaderInfoVO.fundRiskType
                        }），超出您当前的风险承受能力${
                            this.$t('resultList')[this.userInfo.assessResult]
                                .riskStyle
                        }（A${
                            this.userInfo.assessResult
                        }）。点击继续操作视为您确认自愿承担该产品风险，且友信并未主动向您推荐该产品`,
                        `該產品為${this.fundHeaderInfoVO.fundRisk}（R${
                            this.fundHeaderInfoVO.fundRiskType
                        }），超出您當前的風險承受能力${
                            this.$t('resultList')[this.userInfo.assessResult]
                                .riskStyle
                        }（A${
                            this.userInfo.assessResult
                        }）。點擊繼續操作視為您確認自願承擔該產品風險，且友信並未主動向您推薦該產品`,
                        `The risk level of this product is R${
                            this.fundHeaderInfoVO.fundRiskType
                        }(${
                            this.fundHeaderInfoVO.fundRisk
                        }), which exceeds your current risk tolerance is A${
                            this.userInfo.assessResult
                        }(${
                            this.$t('resultList')[this.userInfo.assessResult]
                                .riskStyle
                        }). Click Continue to operate as if you confirm that you voluntarily bear the risk of this product, and uSMART does not actively recommend this product to you.`
                    ])
                    this.$dialog
                        .confirm({
                            title: this.$t('riskTip'),
                            message: riskTipContent,
                            confirmButtonText: this.$t('continueButton'),
                            cancelButtonText: this.$t('cancelButton'),
                            confirmButtonColor: '#0D50D8',
                            cancelButtonColor: '#D1D1D1'
                        })
                        .then(() => {
                            let data = {
                                query: {
                                    id: this.fundId,
                                    assessResult: this.userInfo.assessResult,
                                    currencyType: this.fundTradeInfoVO.currency
                                        .type,
                                    fundCode: this.fundCode
                                }
                            }
                            if (this.$route.query.groupId) {
                                data.query.groupId = 0
                            }
                            data.path =
                                // eslint-disable-next-line no-constant-condition
                                (this.userInfo.extendStatusBit & 16) > 0
                                    ? '/fund-subscribe'
                                    : '/open-permissions'
                            this.$router.push(data)
                            // on confirm
                        })
                        .catch(() => {
                            return
                            // on cancel
                        })
                }
            } else {
                let data = {
                    query: {
                        id: this.fundId,
                        assessResult: this.userInfo.assessResult,
                        currencyType: this.fundTradeInfoVO.currency.type,
                        fundCode: this.fundCode
                    }
                }
                data.path =
                    // eslint-disable-next-line no-constant-condition
                    (this.userInfo.extendStatusBit & 16) > 0
                        ? '/fund-subscribe'
                        : '/open-permissions'
                if (this.$route.query.groupId) {
                    data.query.groupId = 0
                }
                this.$router.push(data)
            }
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
                                id: this.fundId
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
        },
        accountTypeFilter(v) {
            let accountStr =
                (v === accountTypeMap.CASH && this.$t('cashAccount')) ||
                (v === accountTypeMap.FINANCING &&
                    this.$t('financingAccount')) ||
                ''
            return this.currency + accountStr
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
            height: 6px;
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
                text-align: left;
            }
            .block-right {
                width: 70%;
                text-align: right;
            }
            .hr {
                margin: 20px 0;
                display: block;
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
