<template lang="pug">
    .subscribe-wrapper
        .fond-des
            .fond-name Pimco 亚洲投资级债券基金-A2
            .ISIN ISIN:IE00B0MD9M11

        .fond-buy
            .buy-row
                .left 币种
                .right HKD
            .buy-row
                .left 可用余额
                .right 2,000.000.00
            .buy-row
                .left 购买金额
                .right.buy-monny 2,000.000.00
            hr
            a.submit 同意协议并提交
            .buy-row(style="justify-content: space-between;")
                
                a.left {{'《基金购买协议》'}}
                
                .right 预计07.01日完成

        FundSteps(
            style="margin-top: 22px;"
            title="申购规则"
            :curStep="0"
            :stepNames="['买入提交', '确认份额', '查看盈亏']"
            :stepTimes="['今日15点前', '06.28(星期五)', '06.28(星期五)']"
        )

</template>
<script>
import FundSteps from '@/biz-components/fond-steps'
export default {
    name: 'subscribe',
    components: {
        FundSteps
    }
}
</script>
<style lang="scss" scoped>
.subscribe-wrapper {
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
        .buy-row {
            display: flex;
            justify-content: flex-start;
            margin: 0.24rem 0;

            .left {
                width: 127px;
                font-size: 0.28rem;
                color: $text-color5;
                line-height: 0.48rem;
            }
            .right {
                font-size: 0.28rem;
                line-height: 0.48rem;
            }
            .buy-monny {
                font-size: 0.48rem;
                font-weight: bold;
            }
            a.left {
                color: $primary-color;
            }
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
