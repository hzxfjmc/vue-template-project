<template lang="pug">
    .subscribe-wrapper
        .succed.border-bottom(v-if="step === 2")
            img(src="@/assets/img/fund/succed.svg")
            div.text {{ $t('buySuccess') }}
        .fond-des
            .fond-name {{ fundName }}
            .ISIN ISIN:{{ isin }}
        
        template(v-if="step === 1")
            .fond-buy
                .buy-row
                    .left {{ $t('currency') }}
                    .right {{ currency }}
                .buy-row
                    .left {{ $t('availableBalance') }}
                    .right {{ withdrawBalance | formatCurrency }}
                .buy-row
                    .left {{ $t('buyMonny') }}
                    .right.placeHolder.text-color3(v-show="!buyMonnyBlur" @click="handleClickBuyPlaceHolder")
                        p {{ $t('minBugBalance') }}{{ initialInvestAmount | formatCurrency }}
                        p {{ $t('continueBalance') }}{{ continueInvestAmount | formatCurrency }}
                    .right.buy-monny(v-show="buyMonnyBlur" )
                        van-field.input(type="number" ref="buy-monny" @blur="handleOnblurBuyInput" v-model="buyMonny")
                hr.border-bottom
                .buy-row(style="justify-content: space-between; margin-top: 0px")
                    .left.text-color3(style="width: 50%") {{ $t('redemption') }}： {{ subscriptionFee * 100  }}%
                    .right.text-color3(style="text-align: right;") {{ $t('predict') }}：{{ +buyMonny * subscriptionFee | formatCurrency }}
                a.submit.gray(v-if="buyMonny === null || buyMonny === ''") {{ $t('submiButtonText') }}
                a.submit(v-else @click="handleSubmit") {{ $t('submiButtonText') }}
                .buy-row(style="justify-content: space-between;")
                    a.left(:href="buyProtocol" style="width: 65%") 《{{ buyProtocolFileName }}》
                    .right(style="text-align: right; width: 35%") {{ predictDay }}

            FundSteps(
                style="margin-top: 22px;"
                :title="$t('buyRule')"
                :curStep="0"
                :stepNames="[$t('stepOne'), $t('stepTwo'), $t('stepThree')]"
                :stepTimes="[buySubmit, buyConfirm, buyProfitLoss]"
            )
        template(v-else-if="step === 2")
            .fond-buy.border-bottom
                .buy-row
                    .icon
                        img(src="@/assets/img/fund/clock.svg")
                    span.text-color5 {{ $t('predict') }} 
                    span(style="margin: 0 3px;") {{ buyConfirm.slice(0, 5) }}{{ $t('day') }}
                    span.text-color5 {{ $t('confirmTheShare') }}
                .line
                .buy-row
                    .icon
                        .point
                    span.text-color5 {{ $t('predict') }}
                    span(style="margin: 0 3px;") {{ buyProfitLoss.slice(0, 5) }}{{ $t('day') }}
                    span.text-color5 {{ $t('earnings') }}
            .fond-buy.fond-bug-monny.border-bottom(style="margin-top: 0")
                .buy-row
                    .left.line-height-8 {{ $t('monny') }}
                    .right.buy-monny.line-height-8(style="text-align: right;") {{ buyMonny | formatCurrency }}
            .fond-buy(style="margin-top: 0")
                a.submit(style="margin: 41px 0 28px 0" @click="gotoResultPage") {{ $t('done') }}
       

</template>
<script>
import { getCosUrl } from '@/utils/cos-utils'
import { getTradePasswordToken } from '@/service/user-server.js'
import { fundPurchase } from '@/service/finance-server.js'
import { getFundDetail } from '@/service/finance-info-server.js'
import { hsAccountInfo } from '@/service/stock-capital-server.js'
import { riskAssessResult } from '@/service/user-server.js'
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
            buyMonnyBlur: false,
            buyMonny: null,
            fundName: '',
            isin: '',
            currency: '',
            withdrawBalance: 0,
            subscriptionFee: null,
            initialInvestAmount: 0, // 起投金额
            continueInvestAmount: 0, // 续投金额
            buyProtocolFileName: '',
            buyProtocol: '', // 基金购买协议
            buySubmit: '',
            buyConfirm: '', // 买入确认份额时间
            buyProfitLoss: '' // 买入查看盈亏时间
        }
    },
    async created() {
        this.getFundDetailInfo()
        this.getWithdrawBalance()
        console.log('2323232', this.$i18n.lang)
    },
    computed: {
        // 预计完成时间多语言配置
        predictDay() {
            return {
                zhCHS: `预计${this.buyProfitLoss.slice(0, 5)}日完成`,
                zhCHT: `預計${this.buyProfitLoss.slice(0, 5)}日完成`,
                en: `EST. ${this.buyProfitLoss.slice(0, 5).replace('.', '/')}`
            }[this.$i18n.lang]
        }
    },
    watch: {
        buyMonny(val) {
            if (val > +this.withdrawBalance) {
                this.buyMonny = +this.withdrawBalance
            }
        }
    },
    methods: {
        gotoResultPage() {
            this.$router.push({
                path: '/risk-appropriate-result',
                query: {
                    id: this.$route.query.id
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
                this.currency = fundDetail.fundTradeInfoVO.currency.name
                this.subscriptionFee =
                    fundDetail.fundTradeInfoVO.subscriptionFee
                this.initialInvestAmount =
                    fundDetail.fundTradeInfoVO.initialInvestAmount
                this.continueInvestAmount =
                    fundDetail.fundTradeInfoVO.continueInvestAmount
                this.setCosUrl(
                    'buyProtocol',
                    fundDetail.fundTradeInfoVO.buyProtocol
                )
                this.buySubmit = fundDetail.fundTradeInfoVO.buySubmit
                this.buyConfirm = fundDetail.fundTradeInfoVO.buyConfirm
                this.buyProfitLoss = fundDetail.fundTradeInfoVO.buyProfitLoss
                this.buyProtocolFileName = (
                    fundDetail.fundTradeInfoVO.buyProtocol || ''
                )
                    .split('/')
                    .pop()
            } catch (e) {
                console.log('申购页面-getFundDetail:error:>>>', e)
            }
        },
        async setCosUrl(dataKey, url) {
            try {
                this[dataKey] = await getCosUrl(url)
            } catch (e) {
                console.log('申购页面-getCosUrl:error:>>>', e)
            }
        },
        // 获取可用余额
        async getWithdrawBalance() {
            try {
                const hsInfo = await hsAccountInfo(
                    this.$route.query.currencyType
                )
                this.withdrawBalance = hsInfo.withdrawBalance
            } catch (e) {
                console.log('申购页面-getWithdrawBalance:error:>>>', e)
            }
        },
        handleClickBuyPlaceHolder() {
            this.buyMonnyBlur = true
            this.$nextTick(() => {
                this.$refs['buy-monny'].focus()
            })
        },
        handleOnblurBuyInput() {
            if (this.buyMonny === null || this.buyMonny === '') {
                this.buyMonnyBlur = false
            }
        },
        async handleSubmit() {
            try {
                let { validTime } = await riskAssessResult()
                if (validTime && new Date() > new Date(validTime)) {
                    // 当前时间大于测评有效时间，测评过期
                    this.$router.push({
                        path: '/risk-appropriate-result',
                        query: {
                            id: this.$route.query.id
                        }
                    })
                    return
                }
            } catch (error) {
                console.log('申购页面-riskAssessResult:error:>>>', error)
            }
            let submitStep = 0 // 0: 开始 1: 获取token成功 2: 申购成功
            let token = null
            try {
                let data = await jsBridge.callApp('command_trade_login', {
                    needToken: true
                })
                token = data && data.token
                submitStep = 1
            } catch (error) {
                console.log('申购页面-tradeErrorMsg :', error)
            }

            // test:
            // submitStep = 1
            if (submitStep === 1) {
                try {
                    this.$loading()
                    let t = await getTradePasswordToken({
                        password:
                            'J2vefyUMeLg27ePqHMYQi2JS_SyBVF5aZPDGi2DrrSHudsf1TBS5oLlqF3_lh41hnBzsMixr_SVIXgTAp_9iCd8f624dNRw1L2ez0-g27vwqPlACZDuinmRAtTsdrnri7RWMBAsao1dtTci8KX7hdEDn3BZ-Fm755uhBpXnEV0k='
                    })
                    let re = await fundPurchase({
                        displayLocation: 1,
                        fundId: this.$route.query.id,
                        purchaseAmount: this.buyMonny,
                        requestId: generateUUID(),
                        tradeToken: token || t.token
                    })
                    submitStep = 2
                    console.log('申购页面-fundPurchaseData:', re)
                    this.$close()
                } catch (error) {
                    this.$alert({
                        message: error.msg,
                        confirmButtonText: this.$t('iKnow')
                    })
                    this.$close()
                }
            }

            if (submitStep === 2) {
                this.step = 2
            }
        }
    },
    i18n: {
        zhCHS: {
            buySuccess: '申购成功',
            buyMonny: '购买金额',
            buyFile: '基金购买协议',
            buyRule: '申购规则',
            currency: '币种',
            availableBalance: '可用余额',
            bugBalance: '购买金额',
            minBugBalance: '最小申购金额',
            continueBalance: '续投金额',
            redemption: '赎回费',
            predict: '预计',
            submiButtonText: '同意协议并提交',
            dayDone: '日完成',
            day: '日',
            balanceRule: '申购规则',
            stepOne: '买入提交',
            stepTwo: '确认份额',
            stepThree: '查看盈亏',
            confirmTheShare: '确认份额',
            earnings: '查看收益',
            monny: '金额',
            done: '完成',
            iKnow: '我知道了'
        },
        zhCHT: {
            buySuccess: '申購成功',
            buyMonny: '購買金額',
            buyFile: '基金購買協議',
            buyRule: '申購規則',
            currency: '幣種',
            availableBalance: '可用餘額',
            bugBalance: '购买金额',
            minBugBalance: '最小申購金額',
            continueBalance: '續投金額',
            redemption: '贖回費',
            predict: '預計',
            submiButtonText: '同意協議並提交',
            dayDone: '日完成',
            day: '日',
            balanceRule: '申購規則',
            stepOne: '買入提交',
            stepTwo: '確認份額',
            stepThree: '查看盈虧',
            confirmTheShare: '確認份額',
            earnings: '查看收益',
            monny: '金額',
            done: '完成',
            iKnow: '我知道了'
        },
        en: {
            buySuccess: 'Subscription Successful',
            buyMonny: 'Investment Amount',
            buyFile: 'Fund Investment Agreement',
            buyRule: 'Subscription Rules',
            currency: 'Currency',
            availableBalance: 'Available Balance',
            bugBalance: 'Investment Amount',
            minBugBalance: 'Initial',
            continueBalance: 'Subsequent',
            redemption: 'Redemption Fee',
            predict: 'Estimated',
            submiButtonText: 'Agree to agreement and submit',
            dayDone: 'Complete in X days',
            day: 'Days',
            balanceRule: 'Subscription Rules',
            stepOne: 'Submit',
            stepTwo: 'Fund Units Allocation',
            stepThree: 'Check P/L',
            confirmTheShare: 'Fund Units Allocation',
            earnings: 'Check P/L',
            monny: 'Amount',
            done: 'Completed',
            iKnow: 'Got it'
        }
    }
}
</script>
