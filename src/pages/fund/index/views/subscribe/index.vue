<template lang="pug">
    .subscribe-wrapper
        .succed.border-bottom(v-if="step === 2")
            img(src="@/assets/img/fund/succed.svg")
            div.text 申购成功
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
                    .left 购买金额
                    .right.placeHolder.text-color3(v-show="!buyMonnyBlur" @click="handleClickBuyPlaceHolder")
                        p {{ $t('minBugBalance') }}{{ initialInvestAmount | formatCurrency }}
                        p {{ $t('continueBalance') }}{{ continueInvestAmount | formatCurrency }}
                    .right.buy-monny(v-show="buyMonnyBlur" )
                        van-field.input(type="tel" ref="buy-monny" @blur="handleOnblurBuyInput" v-model="buyMonny")
                hr
                .buy-row(style="justify-content: space-between; margin-top: 0px")
                    .left.text-color3 {{ $t('redemption') }}： {{ subscriptionFee * 100  }}%
                    .right.text-color3(style="text-align: right;") {{ $t('predict') }}：{{ +buyMonny * subscriptionFee | formatCurrency }}
                a.submit(@click="handleSubmit") {{ $t('submiButtonText') }}
                .buy-row(style="justify-content: space-between;")
                    a.left(:href="buyProtocol") {{'《基金购买协议》'}}
                    .right(style="text-align: right;") {{ `${$t('predict')}${buyProfitLoss.slice(0, 5)}${$t('dayDone')}` }}

            FundSteps(
                style="margin-top: 22px;"
                title="申购规则"
                :curStep="0"
                :stepNames="['买入提交', '确认份额', '查看盈亏']"
                :stepTimes="['今日15点前', buyConfirm, buyProfitLoss]"
            )
        template(v-else-if="step === 2")
            .fond-buy
                .buy-row
                    .icon
                        img(src="@/assets/img/fund/clock.svg")
                    span.text-color5 预计 
                    span(style="margin: 0 3px;") {{ buyConfirm.slice(0, 5) }}日
                    span.text-color5 确认份额
                .line
                .buy-row
                    .icon
                        .point
                    span.text-color5 预计 
                    span(style="margin: 0 3px;") {{ buyProfitLoss.slice(0, 5) }}日
                    span.text-color5 查看收益
            .fond-buy.fond-bug-monny(style="margin-top: 0")
                .buy-row
                    .left.line-height-8 金额
                    .right.buy-monny.line-height-8(style="text-align: right;") {{ buyMonny | formatCurrency }}
            .fond-buy(style="margin-top: 0")
                a.submit(style="margin: 41px 0 28px 0") 完成
       

</template>
<script>
import { fundPurchase } from '@/service/finance-server.js'
import { getFundDetail } from '@/service/finance-info-server.js'
import { hsAccountInfo } from '@/service/stock-capital-server.js'
import jsBridge from '@/utils/js-bridge.js'
import FundSteps from '@/biz-components/fond-steps'
import { generateUUID } from '@/utils/tools.js'

import './subs-redm.scss'
export default {
    i18n: {
        zhCHS: {
            currency: '币种',
            availableBalance: '可用余额',
            bugBalance: '购买金额',
            minBugBalance: '最小申购金额',
            continueBalance: '续投金额',
            redemption: '赎回费',
            predict: '预计',
            submiButtonText: '同意协议并提交',
            dayDone: '日完成',
            balanceRule: '申购规则'
        },
        zhCHT: {
            currency: '币种',
            availableBalance: '可用余额',
            bugBalance: '购买金额',
            minBugBalance: '最小申购金额',
            continueBalance: '续投金额',
            redemption: '赎回费',
            predict: '预计',
            submiButtonText: '同意协议并提交',
            dayDone: '日完成',
            balanceRule: '申购规则'
        },
        en: {
            currency: '币种',
            availableBalance: '可用余额',
            bugBalance: '购买金额',
            minBugBalance: '最小申购金额',
            continueBalance: '续投金额',
            redemption: '赎回费',
            predict: '预计',
            submiButtonText: '同意协议并提交',
            dayDone: '日完成',
            balanceRule: '申购规则'
        }
    },
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
            currencyType: '',
            currency: '',
            withdrawBalance: 0,
            subscriptionFee: null,
            initialInvestAmount: 0, // 起投金额
            continueInvestAmount: 0, // 续投金额
            buyProtocol: '', // 基金购买协议
            buyConfirm: '', // 买入确认份额时间
            buyProfitLoss: '' // 买入查看盈亏时间
        }
    },
    async created() {
        try {
            const fundDetail = await getFundDetail({
                displayLocation: 1,
                fundId: this.$route.query.id
            })
            this.fundName = fundDetail.fundHeaderInfoVO.fundName
            this.isin = fundDetail.fundOverviewInfoVO.isin
            this.currency = fundDetail.fundHeaderInfoVO.currency.name
            this.currencyType = fundDetail.fundHeaderInfoVO.currency.type
            this.subscriptionFee = fundDetail.fundTradeInfoVO.subscriptionFee
            this.initialInvestAmount =
                fundDetail.fundTradeInfoVO.initialInvestAmount
            this.continueInvestAmount =
                fundDetail.fundTradeInfoVO.continueInvestAmount
            this.buyProtocol = fundDetail.fundTradeInfoVO.buyProtocol
            this.buyConfirm = fundDetail.fundTradeInfoVO.buyConfirm
            this.buyProfitLoss = fundDetail.fundTradeInfoVO.buyProfitLoss
            const hsInfo = await hsAccountInfo(this.currencyType)
            this.withdrawBalance = hsInfo.withdrawBalance
            console.log(hsInfo)
        } catch (e) {
            console.log(e)
        }
    },
    methods: {
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
                    let re = await fundPurchase({
                        fundId: this.$route.query.id,
                        purchaseAmount: this.buyMonny,
                        requestId: generateUUID(),
                        tradeToken: token || 'a3df74a04572403fb1960ee5592d6147'
                    })
                    submitStep = 2
                    console.log('fundPurchaseData:', re)
                }
            } catch (error) {
                this.$alert({
                    message: error.msg,
                    confirmButtonText: '我知道了'
                })
            }

            if (submitStep === 2) {
                this.step = 2
            }
        }
    }
}
</script>
