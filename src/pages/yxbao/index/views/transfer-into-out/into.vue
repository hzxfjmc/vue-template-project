<template lang="pug">
.block__element-wrapper
    .block__out--header
        p.title {{$t('C27')}}   
        NumberKeyboard(
            :placeholder="placeholder"
            @handlerAmount="handlerAmount"
        )
        p.desc 预计{{fundTradeInfoVO.buyProfitLoss}}开始收益
    
    .block__out--title.common-flex-space-between.common-marge-top
        p.title {{$t('C37')}} 
        .tips 
            p.tips--top {{$t('C31')}}
            p.tips--bottom {{$t('C32')}}：{{Number(this.accountInfo.withdrawBalance).toFixed(2)}}港币
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
            accountInfo: {},
            fundTradeInfoVO: {}
        }
    },
    created() {
        this.handleHsAccountInfo()
        this.getFundDetail()
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
                this.placeholder = `最低转入金额${transNumToThousandMark(
                    fundTradeInfoVO.initialInvestAmount
                )}`
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        // 获取用户恒生资金账户信息
        async handleHsAccountInfo() {
            try {
                let data = await hsAccountInfo(1)
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
                if (this.amount < this.fundTradeInfoVO.initialInvestAmount)
                    return this.$toast(
                        [
                            `最低转出${this.fundTradeInfoVO.initialInvestAmount}港币`,
                            `最低轉出${this.fundTradeInfoVO.initialInvestAmount}港幣`,
                            `Mini. Redemption HKD ${this.fundTradeInfoVO.initialInvestAmount}`
                        ],
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
