<template lang="pug">
    .redemption
        .succed.border-bottom(v-if="step === 2")
            img(src="@/assets/img/fund/succed.svg")
            div.text {{ $t('sellSuccess') }}
        .fond-des
            .fond-name {{ fundName }}
            .ISIN ISIN:{{ isin }}
        
        template(v-if="step === 1")
            .fund-content
                .fond-buy
                    .buy-row
                        .left {{ $t('positionShare') }}
                        .right {{ positionShare |  parseThousands}}
                    .buy-row
                        .left {{ $t('positionMarketValue') }}
                        .right {{ positionMarketValue | sliceFixedTwo | parseThousands }}
                    .buy-row
                        .left {{ $t('minPositionShare') }}
                        .right {{ minPositionShare | sliceFixedTwo(4)| parseThousands }}
                    .buy-row.block-row
                        .left {{ $t('redeemShares') }}
                        .right.buy-money.border-bottom
                            input(v-model="redemptionShare" type="number" :placeHolder="$t('entryUnit')" :disabled="positionShare === 0")
                            span(@click="HandlerAllSell") {{$t('sellAll')}}
                    .buy-row
                        .left  {{$t('predictSellAmount')}}
                        .right {{ predictSellAmount | sliceFixedTwo | parseThousands }}
                    .buy-row
                        .left
                            span {{ $t('redemption') }}
                            span ( {{ $t('predict') }}) :
                        .right
                            span {{ times(+redemptionShare, +redemptionFee) | sliceFixedTwo | parseThousands }}
                            span ({{ redemptionFeeScale  }}%)
                FundSteps(
                    style="margin-top: 22px;"
                    :title="$t('balanceRule')"
                    :curStep="0"
                    :stepNames="[$t('stepOne'), $t('stepTwo'), $t('stepThree')]"
                    :stepTimes="[sellSubmit, sellConfirm, sellProfitLoss]"
                )
            .fund-footer-content
                .protocol
                    .protocol__checkbox.iconfont.icon-selected(:class="isCheckedProtocol ?'checked':'un-checked'" @click="checkProtocol")
                    .protocol__text(@click="checkProtocol") {{$t('protocolTips')}}
                    .protocol__button.iconfont.icon-iconshouqi(@click="showProtocol")
                van-button(:disabled="disabled" @click="handleSubmit") {{$t('submitButtonText')}}
        template(v-else-if="step === 2")
            .fond-buy.border-bottom
                .buy-row
                    .icon
                        img(src="@/assets/img/fund/clock.svg")
                    span.text-color5 {{ $t('predict') }}
                    span(style="margin: 0 3px;") {{ sellConfirm.slice(0, 5) }}{{ $t('day') }}
                    span.text-color5 {{ $t('confirmTheShare') }}
                .line
                .buy-row
                    .icon
                        .point
                    span.text-color5 {{ $t('predict') }}
                    span(style="margin: 0 3px;") {{ sellProfitLoss.slice(0, 5) }}{{ $t('day') }}
                    span.text-color5 {{ $t('moneyToAcc') }}
            .fond-buy.fond-bug-money.border-bottom(style="margin-top: 0")
                .buy-row
                    .left.line-height-8 {{ $t('money') }}
                    .right.buy-money.line-height-8(style="text-align: right;") {{ redemptionShare | sliceFixedTwo | formatCurrency }}
            .fond-buy(style="margin-top: 0")
                a.submit(style="margin: 41px 0 28px 0" @click="goNext(orderNo, $route.query.currencyType)") {{ $t('done') }}
        protocol-popup(
            v-model="protocolVisible"
            class="protocolVisible"
            :protocolFileList="sellProtocolFileList"
        )
</template>
<script>
import NP from 'number-precision'
import { getCosUrl } from '@/utils/cos-utils'
import { fundRedemption, getFundPosition } from '@/service/finance-server.js'
import { getFundDetail } from '@/service/finance-info-server.js'
import jsBridge from '@/utils/js-bridge.js'
import FundSteps from '@/biz-components/fond-steps'
import { generateUUID } from '@/utils/tools.js'
import { parseThousands } from '@/utils/tools.js'
import protocolPopup from './components/protocol-popup'
import './index.scss'
export default {
    name: 'subscribe',
    components: {
        FundSteps,
        protocolPopup
    },
    data() {
        return {
            // 1: 购买 2:成功
            step: 1,
            orderNo: null,
            buyMoneyBlur: false,
            positionShare: 0, // 持有份额
            positionMarketValue: 0, // 持仓市值
            lowestInvestAmount: 0, // 最低持有金额
            minPositionShare: 0, // 最低持有份额
            redemptionShare: null, // 赎回份额
            fundName: '',
            isin: '',
            redemptionFee: null,
            sellProtocolFileName: '',
            sellProtocol: '', // 基金卖出协议
            sellSubmit: '',
            sellConfirm: '',
            sellProfitLoss: '',
            predictSellAmount: '',
            netPrice: 0,
            protocolVisible: false,
            isCheckedProtocol: true,
            sellProtocolFileList: []
        }
    },
    async created() {
        this.getFundPositionInfo()
        this.getFundDetailInfo()
    },
    filters: {
        parseThousands
    },
    computed: {
        // 预计完成时间多语言配置
        predictDay() {
            return {
                zhCHS: `预计${this.sellProfitLoss.slice(0, 5)}日完成`,
                zhCHT: `預計${this.sellProfitLoss.slice(0, 5)}日完成`,
                en: `EST. ${this.sellProfitLoss.slice(0, 5).replace('.', '/')}`
            }[this.$i18n.lang]
        },
        redemptionFeeScale() {
            return NP.times(+this.redemptionFee, 100)
        },
        disabled() {
            return (
                !this.isCheckedProtocol ||
                !this.redemptionShare ||
                !this.positionShare
            )
        }
    },
    watch: {
        redemptionShare(val) {
            if (val > +this.positionShare) {
                this.redemptionShare = this.sliceDeci(this.positionShare, 4)
            }
            this.predictSellAmount = this.redemptionShare * this.netPrice
        }
    },
    methods: {
        sliceDeci(s, l) {
            let deci = s.split('.')[1].slice(0, l)
            return s.split('.')[0] + '.' + deci
        },
        //全部卖出
        HandlerAllSell() {
            this.redemptionShare = this.positionShare
        },
        async openProtocol(url) {
            url = await getCosUrl(url)
            if (jsBridge.isYouxinApp) {
                jsBridge.gotoNewWebview(url)
            } else {
                location.href = url
            }
        },
        checkProtocol() {
            this.isCheckedProtocol = !this.isCheckedProtocol
        },
        showProtocol() {
            this.protocolVisible = true
        },
        hideProtocol() {
            this.protocolVisible = false
        },
        times: NP.times,
        goNext(orderNo, currencyType) {
            if (jsBridge.isYouxinApp) {
                jsBridge.callApp('command_close_webview')
            } else {
                this.$router.push({
                    path: '/order-record-detail',
                    query: {
                        orderNo,
                        currencyType
                    }
                })
            }
        },
        // 获取基金信息
        async getFundDetailInfo() {
            try {
                const fundDetail = await getFundDetail({
                    displayLocation: 1,
                    fundId: this.$route.query.id
                })
                this.fundName = fundDetail.fundHeaderInfoVO.fundName
                this.netPrice = fundDetail.fundHeaderInfoVO.netPrice
                this.isin = fundDetail.fundOverviewInfoVO.isin
                this.lowestInvestAmount =
                    fundDetail.fundTradeInfoVO.lowestInvestAmount
                this.minPositionShare =
                    fundDetail.fundTradeInfoVO.minPositionShare
                this.redemptionFee = fundDetail.fundTradeInfoVO.redemptionFee
                this.setCosUrl(
                    'sellProtocol',
                    fundDetail.fundTradeInfoVO.sellProtocol
                )
                this.sellSubmit = fundDetail.fundTradeInfoVO.sellSubmit
                this.sellConfirm = fundDetail.fundTradeInfoVO.sellConfirm
                this.sellProfitLoss = fundDetail.fundTradeInfoVO.sellProfitLoss
                this.sellProtocolFileName = (
                    fundDetail.fundTradeInfoVO.sellProtocol || ''
                )
                    .split('/')
                    .pop()
                this.sellProtocolFileList = fundDetail.sellProtocolFileList
            } catch (e) {
                console.log('赎回页面-getFundDetailInfo:error:>>>', e)
            }
        },
        async getFundPositionInfo() {
            try {
                const fundPos = await getFundPosition({
                    fundId: this.$route.query.id
                })
                this.positionShare = this.sliceDeci(fundPos.availableShare, 4)
                this.positionMarketValue = fundPos.positionMarketValue
            } catch (e) {
                console.log('赎回页面-getFundPositionInfo:error:>>>', e)
            }
        },
        async setCosUrl(dataKey, url) {
            try {
                this[dataKey] = await getCosUrl(url)
            } catch (e) {
                console.log('赎回页面-getCosUrl:error:>>>', e)
            }
        },
        handleClickBuyPlaceHolder() {
            this.buyMoneyBlur = true
            this.$nextTick(() => {
                this.$refs['buy-money'].focus()
            })
        },
        handleOnblurBuyInput() {
            if (this.redemptionShare === null || this.redemptionShare === '') {
                this.buyMoneyBlur = false
            }
        },
        async handleSubmit() {
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
            // submitStep = 1
            try {
                if (submitStep === 1) {
                    this.$loading()
                    let params = {
                        displayLocation: 1,
                        fundId: this.$route.query.id,
                        redemptionShare: this.redemptionShare,
                        requestId: generateUUID(),
                        tradeToken: token,
                        emptyPosition:
                            +this.redemptionShare === +this.positionShare
                                ? true
                                : false
                    }
                    let re = await fundRedemption(params)
                    submitStep = 2
                    this.orderNo = re.orderNo
                    this.$close()
                }
            } catch (error) {
                this.$alert({
                    message: error.msg,
                    confirmButtonText: this.$t('iKnow')
                })
                this.$close()
            }

            if (submitStep === 2) {
                this.step = 2
            }
        }
    },
    i18n: {
        zhCHS: {
            sellSuccess: '赎回成功',
            positionShare: '可赎份额',
            positionMarketValue: '基金市值',
            redeemShares: '赎回份额',
            minSellBalance: '最小持有金额',
            minPositionShare: '最小持有份额',
            continueBalance: '续投金额',
            redemption: '赎回费',
            predict: '预计',
            submitButtonText: '同意协议并提交',
            dayDone: '日完成',
            balanceRule: '赎回规则',
            day: '日',
            stepOne: '提交赎回申请',
            stepTwo: '确认净值',
            stepThree: '资金到达证券账户',
            confirmTheShare: '确认净值',
            earnings: '查看收益',
            money: '赎回份额',
            done: '完成',
            iKnow: '我知道了',
            moneyToAcc: '资金到达证券账户',
            protocolTips: '已阅读并同意服务协议及风险提示，并查阅相关信息',
            sellAll: '全部卖出',
            entryUnit: '输入卖出份额',
            predictSellAmount: '订单总金额'
        },
        zhCHT: {
            sellSuccess: '贖回成功',
            positionShare: '可贖回份額',
            positionMarketValue: '基金市值',
            redeemShares: '贖回份額',
            minSellBalance: '最小持有金額',
            minPositionShare: '最小持有份额',
            continueBalance: '續投金額',
            redemption: '贖回費',
            predict: '預計',
            submitButtonText: '同意協議並提交',
            dayDone: '日完成',
            balanceRule: '贖回規則',
            day: '日',
            stepOne: '提交贖回申請',
            stepTwo: '確認凈值',
            stepThree: '資金到達證券賬戶',
            confirmTheShare: '確認凈值',
            earnings: '查看收益',
            money: '贖回份額',
            done: '完成',
            iKnow: '我知道了',
            moneyToAcc: '資金到達證券賬戶',
            protocolTips: '已閱讀並同意服務協議及風險提示，並查閱相關信息',
            sellAll: '全部賣出',
            entryUnit: '輸入賣出份額',
            predictSellAmount: '訂單總金額'
        },
        en: {
            sellSuccess: 'Redemption Successful',
            positionShare: 'Redeemable',
            positionMarketValue: 'Fund Value',
            redeemShares: 'Units of Redemption',
            minSellBalance: 'Min. Holding Amount',
            minPositionShare: 'Min. Holding Share',
            continueBalance: 'Redemption Rules',
            redemption: 'Redemption Fee',
            predict: 'Predict',
            submitButtonText: 'Agree to agreement and submit',
            dayDone: 'Complete in X days',
            balanceRule: 'Redemption Rules',
            day: 'days',
            stepOne: 'Submit Redemption Application',
            stepTwo: 'CFMD NAV',
            stepThree: 'Funds Credited to Securities Account',
            confirmTheShare: 'CFMD NAV',
            earnings: 'Check Earnings',
            money: 'Redemption Unit',
            done: 'Completed',
            iKnow: 'Got it',
            moneyToAcc: 'Funds Credited to Securities Account',
            protocolTips:
                'I have read and agree to the service agreement and risk warning, and consult relevant information',
            sellAll: 'Sell All',
            entryUnit: 'Entry Unit',
            predictSellAmount: 'Total Amount of Orders'
        }
    }
}
</script>
