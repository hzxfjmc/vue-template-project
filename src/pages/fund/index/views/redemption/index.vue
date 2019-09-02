<template lang="pug">
    .redemption
        .fond-des
            .fond-name Pimco 亚洲投资级债券基金-A2
            .ISIN ISIN:IE00B0MD9M11
        
        template(v-if="step === 1")
            .fond-buy
                .buy-row
                    .left 持用份额
                    .right 2,000.33
                .buy-row
                    .left 基金市值
                    .right 2,000.00
                .buy-row
                    .left 购买金额
                    .right.placeHolder.text-color3(v-if="!buyMonnyBlur" @click="handleClickBuyPlaceHolder")
                        span 最小申购金额5000.00 
                    .right.buy-monny(v-if="buyMonnyBlur" )
                        van-field.input(ref="buy-monny" @blur="handleOnblurBuyInput" v-model="buyMonny")
                hr
                .buy-row(style="justify-content: space-between; margin-top: 0px")
                    .left.text-color3 {{'赎回率：0.3%'}}
                    .right.text-color3(style="text-align: right;") 预计：600.00
                a.submit(@click="getTradeToken") 同意协议并提交
                .buy-row(style="justify-content: space-between;")
                    a.left {{'《基金购买协议》'}}
                    .right(style="text-align: right;") 预计07.01日完成

            FundSteps(
                style="margin-top: 22px;"
                title="赎回规则"
                :curStep="0"
                :stepNames="['提交赎回申请', '确认份额', '资金到账']"
                :stepTimes="['今日15点前', '06.28(星期五)', '06.28(星期五)']"
            )
        template(v-else-if="step === 2")
            .fond-buy(style="padding-top: 5px;")
                .buy-row
                    .icon
                        img(src="@/assets/img/fund/clock.svg")
                    span.text-color5 预计 
                    span(style="margin: 0 3px;") 07.01日  
                    span.text-color5 确认份额
                .line
                .buy-row
                    .icon
                        .point
                    span.text-color5 预计 
                    span(style="margin: 0 3px;") 07.01日  
                    span.text-color5 确认份额
                .buy-row
                    .left 购买金额
                    .right.buy-monny 2,000,000.00
                a.submit(@click="getTradeToken") 完成

</template>
<script>
import jsBridge from '@/utils/js-bridge.js'
import FundSteps from '@/biz-components/fond-steps'
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
            buyMonny: null
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
        // 获取交易token
        async getTradeToken() {
            try {
                let data = await jsBridge.callApp('command_trade_login', {
                    needToken: true
                })
                console.log('tradeMsg :', data)
                // if (data && data.token) {
                //     this.handleBondOrder(data.token)
                // }
            } catch (error) {
                console.log('tradeMsg:error :', error)
            }
        }
    }
}
</script>
<style lang="scss">
.redemption {
    .m-b28 {
        margin-bottom: 28px;
    }
    .fond-des {
        background: $background-color;
        display: flex;
        flex-direction: column;
        font-size: 0.32rem;
        padding: 14px 12px;
        .ISIN {
            font-size: 0.28rem;
            color: $text-color5;
        }
    }

    .fond-buy {
        background: $background-color;
        margin-top: 10px;
        // padding-top: 24px;
        display: flex;
        flex-direction: column;
        padding: 0 12px;
        padding-bottom: 10px;

        .text-color3 {
            color: $text-color3 !important;
        }
        .text-color5 {
            color: $text-color5 !important;
        }
        .buy-row {
            display: flex;
            justify-content: flex-start;
            margin: 0.24rem 0;

            .left {
                width: 35%;
                font-size: 0.28rem;
                color: $text-color5;
                line-height: 0.48rem;
            }
            .right {
                width: 65%;
                font-size: 0.28rem;
                line-height: 0.48rem;
                .van-field {
                    padding: 0;
                    // height: 0.48rem;
                    width: 100%;
                    .van-field__control {
                        font-weight: bold !important;
                        font-size: 0.48rem !important;
                    }
                }
            }

            .buy-monny {
                height: 40px;
                font-size: 0.48rem;
            }

            a.left {
                color: $primary-color;
            }
            span {
                font-size: 0.28rem;
            }

            .icon {
                width: 0.48rem;
                height: 0.48rem;
                margin-right: 5px;
                img {
                    width: 0.32rem;
                    height: 0.32rem;
                    margin-top: 0.07rem;
                }
                .point {
                    width: 6px;
                    height: 6px;
                    background: $text-color3;
                    border-radius: 50%;
                    margin-top: 0.16rem;
                    margin-left: 0.1rem;
                }
            }
            .placeHolder {
                width: 139px;
                height: 40px;
            }
        }
        .line {
            height: 56px;
            border-left: 1px solid $text-color2;
            margin-left: 0.14rem;
            margin-top: -13px;
            margin-bottom: -15px;
        }
        hr {
            height: 1px;
            border: none;
            border-top: 1px solid $primary-color;
            width: 100%;
            opacity: 0.05;
        }
        .submit {
            margin-top: 20px;
            background: $primary-color;
            color: #fff;
            text-align: center;
            height: 0.96rem;
            line-height: 0.96rem;
            border-radius: 6px;
            font-size: 0.32rem;
        }
    }
}
</style>
