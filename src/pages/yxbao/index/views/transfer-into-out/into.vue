<template lang="pug">
.block__element-wrapper
    .block__out--header
        p.title {{$t('C27')}}   
        NumberKeyboard(
            :placeholder="placeholder"
            :withdrawBalance="accountInfo.withdrawBalance"
            @handlerAmount="handlerAmount"
            :openTips="true"
        )
        p.desc {{desc}}
    
    .block__out--title.common-flex-space-between.common-marge-top
        p.title {{$t('C30')}} 
        .tips 
            p.tips--top {{$t('C31')}}
            p.tips--bottom {{$t('C32')}}：{{Number(accountInfo.withdrawBalance).toFixed(2)}}{{$t('hkd')}}
    van-button.btn(
        @click="getBaoCapitalTrade") {{$t('C9')}}

</template>
<script>
import NumberKeyboard from './number-keyboard'
import { getBaoCapitalTrade } from '@/service/finance-server.js'
import { getFundDetail } from '@/service/finance-info-server.js'
import { generateUUID, transNumToThousandMark } from '@/utils/tools.js'
import jsBridge from '@/utils/js-bridge.js'
import { hsAccountInfo } from '@/service/stock-capital-server.js'
export default {
    components: {
        NumberKeyboard
    },
    data() {
        return {
            amount: '',
            placeholder: '',
            chargeType: 1,
            accountInfo: {
                withdrawBalance: ''
            },
            fundTradeInfoVO: {},
            currencyType: 0,
            desc: ''
        }
    },
    async created() {
        await this.getFundDetail()
        this.handleHsAccountInfo()
    },
    methods: {
        handlerAmount(amount) {
            this.amount = amount
        },
        //获取基金详情
        async getFundDetail() {
            try {
                this.fundCorrelationFileList = []
                const { fundTradeInfoVO } = await getFundDetail({
                    displayLocation: 3,
                    fundId: this.$route.query.id || this.id,
                    isin: this.$route.query.isin
                })
                this.fundTradeInfoVO = fundTradeInfoVO
                let placeholder = this.$t([
                    `最低转入金额${transNumToThousandMark(
                        fundTradeInfoVO.initialInvestAmount
                    )}`,
                    `最低轉入金額${transNumToThousandMark(
                        fundTradeInfoVO.initialInvestAmount
                    )}`,
                    `Mini. Subs Amounts${transNumToThousandMark(
                        fundTradeInfoVO.initialInvestAmount
                    )}`
                ])
                this.placeholder = placeholder
                let desc = this.$t([
                    `预计${fundTradeInfoVO.buyProfitLoss}查看收益`,
                    `預計${fundTradeInfoVO.buyProfitLoss}開始查看收益`,
                    `Check Return on ${fundTradeInfoVO.buyProfitLoss}（Estimated）`
                ])
                this.desc = desc
                this.currencyType = fundTradeInfoVO.currency.type
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        // 获取用户恒生资金账户信息
        async handleHsAccountInfo() {
            try {
                let data = await hsAccountInfo(this.currencyType)
                this.accountInfo = data || {}
            } catch (error) {
                this.$toast(error.msg, 'middle')
                console.log('hsAccountInfo:error:>>>', error)
            }
        },
        async getBaoCapitalTrade() {
            try {
                if (this.amount == 0 || this.amount === this.placeholder)
                    return this.$toast('请输入金额', 'middle')
                if (this.amount <= this.fundTradeInfoVO.initialInvestAmount)
                    return this.$toast(
                        this.$t([
                            `最低转入${Number(
                                this.fundTradeInfoVO.initialInvestAmount
                            ).toFixed(2)}港币`,
                            `最低轉入${Number(
                                this.fundTradeInfoVO.initialInvestAmount
                            ).toFixed(2)}港幣`,
                            `Mini. Subs HKD ${Number(
                                this.fundTradeInfoVO.initialInvestAmount
                            ).toFixed(2)}`
                        ]),
                        'middle'
                    )

                let data = await jsBridge.callApp('command_trade_login', {
                    needToken: true
                })
                if (!data && !data.token) {
                    this.getBaoCapitalTrade()
                    return
                }
                this.$loading()
                const res = await getBaoCapitalTrade({
                    amount: this.amount,
                    chargeType: this.chargeType,
                    fundId: this.$route.query.id,
                    recordType: 1,
                    requestId: generateUUID(),
                    tradeToken: data.token
                })
                this.$close()
                this.$router.push({
                    name: 'order-details',
                    params: { data: res }
                })
            } catch (error) {
                this.$close()
                if (error.desc && error.desc.errorMessage)
                    return this.$toast(error.desc.errorMessage, 'middle')
                if (error.msg) return this.$toast(error.msg, 'middle')
                console.log('申购页面-tradeErrorMsg :', error)
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.btn {
    background: #0d50d8;
    color: #fff;
    width: 343px;
    height: 48px;
    font-size: 16px;
    margin: 20px 16px;
    border-radius: 6px;
}
.title {
    font-size: 16px;
}
.block__out--header {
    padding: 20px 12px 0 12px;
    background: #fff;
    .desc {
        font-size: 12px;
        padding: 9px 0;
        color: $text-color6;
    }
}
.block__out--title {
    background: #fff;
    padding: 15px 12px 14px 12px;
    .tips {
        text-align: right;
        .tips--top {
            font-size: 16px;
            color: $text-color;
        }
        .tips--bottom {
            color: $text-color6;
            font-size: 12px;
            padding: 6px 0 0 0;
        }
    }
}
</style>
