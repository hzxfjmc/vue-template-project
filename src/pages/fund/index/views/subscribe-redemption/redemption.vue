<template lang="pug">
    .redemption
        .succed.border-bottom(v-if="step === 2")
            img(src="@/assets/img/fund/succed.svg")
            div.text {{ $t('sellSuccess') }}
        .fond-des
            .fond-name {{ fundName }}
            .ISIN ISIN:{{ isin }}
        
        template(v-if="step === 1")
            .fond-buy
                .buy-row
                    .left {{ $t('positionShare') }}
                    .right {{ positionShare | formatCurrency }}
                .buy-row
                    .left {{ $t('positionMarketValue') }}
                    .right {{ positionMarketValue | formatCurrency }}
                .buy-row
                    .left {{ $t('redeemShares') }}
                    .right.placeHolder.text-color3(v-show="!buyMonnyBlur" @click="handleClickBuyPlaceHolder")
                        span {{ $t('minSellBalance') }}{{ lowestInvestAmount | formatCurrency}}
                    .right.buy-monny(v-show="buyMonnyBlur" )
                        van-field.input(type="number" ref="buy-monny" @blur="handleOnblurBuyInput" v-model="redemptionShare")
                hr.border-bottom
                .buy-row(style="justify-content: space-between; margin-top: 0px")
                    .left.text-color3(style="width: 50%") {{ $t('redemption') }}： {{ subscriptionFee * 100  }}%
                    .right.text-color3(style="text-align: right;") {{ $t('predict') }}：{{ +redemptionShare * subscriptionFee | formatCurrency }}
                a.submit.gray(v-if="redemptionShare === null || redemptionShare === ''") {{ $t('submiButtonText') }}
                a.submit(v-else @click="handleSubmit") {{ $t('submiButtonText') }}
                .buy-row(style="justify-content: space-between;")
                    a.left(:href="sellProtocol" style="width: 65%") 《{{ sellProtocolFileName }}》
                    .right(style="text-align: right;  width: 35%") {{ predictDay }}

            FundSteps(
                style="margin-top: 22px;"
                :title="$t('balanceRule')"
                :curStep="0"
                :stepNames="[$t('stepOne'), $t('stepTwo'), $t('stepThree')]"
                :stepTimes="[sellSubmit, sellConfirm, sellProfitLoss]"
            )
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
                    span.text-color5 {{ $t('monnyToAcc') }}
            .fond-buy.fond-bug-monny.border-bottom(style="margin-top: 0")
                .buy-row
                    .left.line-height-8 {{ $t('monny') }}
                    .right.buy-monny.line-height-8(style="text-align: right;") {{ redemptionShare | formatCurrency }}
            .fond-buy(style="margin-top: 0")
                a.submit(style="margin: 41px 0 28px 0" @click="gotoOrderRecordDetail(orderNo, $route.query.currencyType)") {{ $t('done') }}

</template>
<script>
import { getCosUrl } from '@/utils/cos-utils'
import { getTradePasswordToken } from '@/service/user-server.js'
import { fundRedemption, getFundPosition } from '@/service/finance-server.js'
import { getFundDetail } from '@/service/finance-info-server.js'
// import { hsAccountInfo } from '@/service/stock-capital-server.js'
import jsBridge from '@/utils/js-bridge.js'
import FundSteps from '@/biz-components/fond-steps'
import { generateUUID } from '@/utils/tools.js'

import './index.scss'
export default {
    name: 'subscribe',
    components: {
        FundSteps
    },
    data() {
        return {
            // 1: 购买 2:成功
            step: 1,
            orderNo: null,
            buyMonnyBlur: false,
            positionShare: 0, // 持有份额
            positionMarketValue: 0, // 持仓市值
            lowestInvestAmount: 0, // 最低持有金额
            redemptionShare: null, // 赎回份额
            fundName: '',
            isin: '',
            subscriptionFee: null,
            sellProtocolFileName: '',
            sellProtocol: '', // 基金卖出协议
            sellSubmit: '',
            sellConfirm: '',
            sellProfitLoss: ''
        }
    },
    async created() {
        this.getFundPositionInfo()
        this.getFundDetailInfo()
    },
    computed: {
        // 预计完成时间多语言配置
        predictDay() {
            return {
                zhCHS: `预计${this.sellProfitLoss.slice(0, 5)}日完成`,
                zhCHT: `預計${this.sellProfitLoss.slice(0, 5)}日完成`,
                en: `EST. ${this.sellProfitLoss.slice(0, 5).replace('.', '/')}`
            }[this.$i18n.lang]
        }
    },
    watch: {
        redemptionShare(val) {
            if (val > +this.positionShare) {
                this.redemptionShare = +this.positionShare
            }
        }
    },
    methods: {
        gotoOrderRecordDetail(orderNo, currencyType) {
            this.$router.push({
                path: '/order-record-detail',
                query: {
                    orderNo,
                    currencyType
                }
            })
        },
        // 获取基金信息
        async getFundDetailInfo() {
            try {
                const fundDetail = await getFundDetail({
                    displayLocation: 1,
                    fundId: this.$route.query.id
                })
                this.fundName = fundDetail.fundHeaderInfoVO.fundName
                this.isin = fundDetail.fundOverviewInfoVO.isin
                this.lowestInvestAmount =
                    fundDetail.fundTradeInfoVO.lowestInvestAmount
                this.subscriptionFee =
                    fundDetail.fundTradeInfoVO.subscriptionFee
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
            } catch (e) {
                console.log('赎回页面-getFundDetailInfo:error:>>>', e)
            }
        },
        async getFundPositionInfo() {
            try {
                const fundPos = await getFundPosition({
                    fundId: this.$route.query.id
                })
                this.positionShare = fundPos.availableShare
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
            this.buyMonnyBlur = true
            this.$nextTick(() => {
                this.$refs['buy-monny'].focus()
            })
        },
        handleOnblurBuyInput() {
            if (this.redemptionShare === null || this.redemptionShare === '') {
                this.buyMonnyBlur = false
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
            submitStep = 1
            try {
                if (submitStep === 1) {
                    this.$loading()
                    let t = await getTradePasswordToken({
                        password:
                            'J2vefyUMeLg27ePqHMYQi2JS_SyBVF5aZPDGi2DrrSHudsf1TBS5oLlqF3_lh41hnBzsMixr_SVIXgTAp_9iCd8f624dNRw1L2ez0-g27vwqPlACZDuinmRAtTsdrnri7RWMBAsao1dtTci8KX7hdEDn3BZ-Fm755uhBpXnEV0k='
                    })
                    let re = await fundRedemption({
                        displayLocation: 1,
                        fundId: this.$route.query.id,
                        redemptionShare: this.redemptionShare,
                        requestId: generateUUID(),
                        tradeToken: token || t.token
                    })
                    submitStep = 2
                    this.orderNo = re.orderNo
                    console.log('fundRedemptionData:', re)
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
            positionShare: '持有份额',
            positionMarketValue: '基金市值',
            redeemShares: '赎回份额',
            minSellBalance: '最小持有金额',
            continueBalance: '续投金额',
            redemption: '赎回费',
            predict: '预计',
            submiButtonText: '同意协议并提交',
            dayDone: '日完成',
            balanceRule: '赎回规则',
            day: '日',
            stepOne: '提交赎回申请',
            stepTwo: '确认份额',
            stepThree: '资金到账',
            confirmTheShare: '确认份额',
            earnings: '查看收益',
            monny: '金额',
            done: '完成',
            iKnow: '我知道了',
            monnyToAcc: '资金到达证券账户'
        },
        zhCHT: {
            sellSuccess: '贖回成功',
            positionShare: '持有份額',
            positionMarketValue: '基金市值',
            redeemShares: '贖回份額',
            minSellBalance: '最小持有金額',
            continueBalance: '續投金額',
            redemption: '贖回費',
            predict: '預計',
            submiButtonText: '同意協議並提交',
            dayDone: '日完成',
            balanceRule: '贖回規則',
            day: '日',
            stepOne: '提交贖回申請',
            stepTwo: '確認份額',
            stepThree: '資金到賬',
            confirmTheShare: '确认份额',
            earnings: '查看收益',
            monny: '金額',
            done: '完成',
            iKnow: '我知道了',
            monnyToAcc: '資金到達證券賬戶'
        },
        en: {
            sellSuccess: 'Redemption Successful',
            positionShare: 'Holding Units',
            positionMarketValue: 'Fund Value',
            redeemShares: 'Units of Redemption',
            minSellBalance: 'Min. Holding Amount',
            continueBalance: 'Redemption Rules',
            redemption: 'Redemption Fee',
            predict: 'Predict',
            submiButtonText: 'Agree to agreement and submit',
            dayDone: 'Complete in X days',
            balanceRule: 'Redemption Rules',
            day: 'days',
            stepOne: 'Submit Redemption Application',
            stepTwo: 'Fund Units Allocation',
            stepThree: 'Funds Credited',
            confirmTheShare: 'Fund Units Allocation',
            earnings: 'Check Earnings',
            monny: 'Amount',
            done: 'Completed',
            iKnow: 'Got it',
            monnyToAcc: 'Funds Credited to Securities Account'
        }
    }
}
</script>
