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
                    .order-item.flex(v-if="!isDividendOrder")
                        span.itemName {{$t('orderTime')}}
                        span.block-right {{orderTimeValue}}
                    .order-item.flex
                        span.itemName {{$t('orderNum')}}
                        span {{orderNumValue}}
                    .order-item.flex
                        span.itemName {{$t('orderName')}}
                        span.type {{orderType}}
                    .order-item.flex(v-if="!orderFlag")
                        span.itemName {{$t('orderFinish')}}
                        span {{orderFinishValue}}
                    .order-item.flex(v-if="orderStatusSuccess && !isDividendOrder")
                        span.itemName {{$t('orderNetWorth')}}
                        span {{netPrice|transNumToThousandMark(4)}}{{currency}}
                    template(v-if="(isSubscribeOrder || isFixedInvest)")
                        .order-item.flex
                            span.itemName {{$t('amount')}}
                            span.type-text {{moneyNum|transNumToThousandMark}}{{currency}}
                        .order-item.flex
                            span.itemName {{$t('fee')}}
                            span.type-text {{orderFee|transNumToThousandMark}}{{currency}}
                        .order-item.flex(v-if="orderStatusSuccess")
                            span.itemName {{$t('confirmOrderShares')}}
                            span {{orderShare|transNumToThousandMark(4)}}
                        .order-item.flex(v-if="isFixedInvest && orderStatusSuccess")
                            span.itemName {{$t('returnAmount')}}
                                img(src="@/assets/img/fund/fund-order-detail/icon.png" @click="showRemind")
                            span.type-text {{fixedReFundFee|transNumToThousandMark}}{{currency}}
                    template(v-else-if="isDividendOrder")
                        .order-item.flex
                            span.itemName {{$t('dividendWay')}}
                            span.type-text
                        .order-item.flex(v-if="orderStatusSuccess")
                            span.itemName {{$t('dividendAmount')}}
                            span.type-text {{moneyNum|transNumToThousandMark}}{{currency}}
                        .order-item.flex(v-if="orderStatusSuccess")
                            span.itemName {{$t('dividendUnits')}}
                            span.type-text {{orderShare|transNumToThousandMark}}{{currency}}
                    template(v-else)
                        .order-item.flex
                            span.itemName {{$t('redemptionUnits')}}
                            span.type-text {{orderShare|transNumToThousandMark}}
                        .order-item.flex(v-if="orderStatusSuccess")
                            span.itemName {{$t('fee')}}
                            span.type-text {{orderFee|transNumToThousandMark}}{{currency}}
                van-cell(class="order-time" v-if="isSubscribeOrder || isFixedInvest")
                    .order-item.flex
                        span.itemName {{$t('debitWay')}}
                        span.type {{accountTypeFilter(accountType)}}
                    .order-item.flex
                        span.itemName {{$t('orderAmount')}}
                        span.type {{((+moneyNum || 0) + (+orderFee || 0))|transNumToThousandMark}}{{currency}}
                    .order-item.flex(v-if="isFixedInvest")
                        span.itemName {{$t('autoExchange')}}
                        span.type {{exchangeFlag ? this.$t('yes') : this.$t('no')}}
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
            ORDER_STATUS,
            // 是否换汇
            exchangeFlag: false,
            // 定投返还费用
            fixedReFundFee: ''
        }
    },
    computed: {
        orderFlag() {
            return [ORDER_STATUS.CONFIRMING, ORDER_STATUS.DEALING].includes(
                this.orderStatus
            )
        },
        // 是否订单成功
        orderStatusSuccess() {
            return ORDER_STATUS.SUCCEED === this.orderStatus
        },
        // 是否申购
        isSubscribeOrder() {
            return this.tradeType === TRADE_TYPES.SUBSCRIBE
        },
        // 是否定投
        isFixedInvest() {
            return this.fixedInvest
        },
        // 分紅單
        isDividendOrder() {
            return this.tradeType === TRADE_TYPES.DIVIDEND
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
        // 處理起止時間格式
        formatTime(time) {
            if (!time) {
                return '--'
            }
            time = dayjs(time)
            // 星期
            let day = time.day()
            let mapDay = {
                1: this.$t(['星期一', '星期一', 'Mon.']),
                2: this.$t(['星期二', '星期二', 'Tues.']),
                3: this.$t(['星期三', '星期三', 'Wed.']),
                4: this.$t(['星期四', '星期四', 'Thur.']),
                5: this.$t(['星期五', '星期五', 'Fri.']),
                6: this.$t(['星期六', '星期六', 'Sat.']),
                0: this.$t(['星期天', '星期天', 'Sun.'])
            }
            let dayStr = mapDay[day]
            let result = ''
            if (this.$i18n.lang === 'en') {
                result = `${time.format('DD MMM')}(${dayStr})`
                let map = {
                    1: 'st',
                    2: 'nd',
                    3: 'rd'
                }
                result = result.replace(/^\d+\S/, function($1) {
                    return $1 + (map[+$1] || 'th')
                })
            } else {
                result = `${time.format('MM-DD')}(${dayStr})`
            }
            return result
        },
        // 處理起止時間
        dealTime(res) {
            this.beginTime = this.formatTime(res.confirmDate)
            this.endTime = this.formatTime(res.deliveryDate)
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
                // 是否换汇
                this.exchangeFlag = res.exchangeFlag
                // 定投返回费用
                this.fixedReFundFee = res.fixedReFundFee
                if (this.orderStatus === 1 && this.allowRevoke) {
                    this.setTitleBarBOButton()
                }
                this.dealTime(res)
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
                this.orderType =
                    res.fixedInvest === 1 ? this.$t('A2') : res.tradeTypeName
                this.currency = this.$t(res.currency.name)
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
                                    ? this.orderResult.fixedInvest == 1
                                        ? '/fixed-investment'
                                        : '/fund-subscribe'
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
                        ? this.orderResult.fixedInvest == 1
                            ? '/fixed-investment'
                            : '/fund-subscribe'
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
            return (
                (v === accountTypeMap.CASH &&
                    this.$t('cashAccount', this.currency)) ||
                (v === accountTypeMap.FINANCING &&
                    this.$t('financingAccount', this.currency)) ||
                ''
            )
        },
        showRemind() {
            this.$confirm({
                message: this.$t('returnRemind'),
                confirmButtonText: this.$t('iKnow'),
                showCancelButton: false
            })
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
                img {
                    width: 14px;
                    height: 14px;
                    margin-left: 3px;
                    vertical-align: middle;
                }
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
