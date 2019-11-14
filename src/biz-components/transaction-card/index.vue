<template lang="pug">
    yx-container-better
        van-pull-refresh(
            slot="main"
            v-model="isLoading"
            @refresh="onRefresh"
            success-text="刷新成功"
        )
            .transaction-card
                media-box.transaction-header(
                    :title="issuerName"
                    :desc="bondName"
                )
                .yx-cell(style="padding:0.4rem 0.28rem")
                    .yx-cell__header {{ direction === 1 ? '买入价格' : '卖出价格' }}
                    .yx-cell__primary {{ buyOrSellPrice }}

                .yx-cell
                    .yx-cell__header 份数
                    .yx-cell__primary
                        van-stepper(v-model="transactionNum" integer min="1" max="9999999")
                        .yx-cell__primary-tip ({{ minFaceValue | thousand-spilt }}{{ currencyName }}/份)
                .yx-cell(style="padding:0.4rem 0.28rem 0.26rem")
                    .yx-cell__header 金额
                    .yx-cell__primary {{ tradeMoney | thousand-spilt }}

                .yx-cell
                    .yx-cell__header {{ direction === 1 ? '应付利息' : '应得利息' }}
                        .yx-cell__header-tip
                            i.iconfont.icon-wenhao(@click="showTips('interest')")
                    .yx-cell__primary +{{ calcInterest | thousand-spilt }}

                .yx-cell(style="padding-top:0.2rem")
                    .yx-cell__header 手续费(预估)
                    .yx-cell__primary {{direction === 1 ? '+' : '-'}}{{ serviceCharge }}

                .divider-line

                .yx-cell.total-trade-money
                    .yx-cell__header 总额
                        .yx-cell__header-tip ({{ currencyName }})
                    .yx-cell__primary {{ totalTradeMoney | thousand-spilt }}

                .tips
                    i.iconfont.icon-wenhao(@click="showTips('total')")
                    span {{direction === 1 ? '债券可用资金' : '持仓可卖'}}
                    strong(v-if="direction === 1") {{ marketValue | thousand-spilt }}
                    strong(v-if="direction === 2") {{ marketValue }}
        van-button(
            type="info"
            slot="bottom"
            class="foot-button"
            :class="{ sell: btnText === '确认卖出' }"
            :text="btnText"
            @click="handleTradeToken"
        )
</template>

<script>
import mixin from './mixin'
export default {
    mixins: [mixin]
}
</script>

<style lang="scss" scoped>
.yx-container {
    overflow: hidden;
    padding-top: 10px;
    background: transparent;
}
.van-pull-refresh {
    height: 100%;
}
.transaction-card {
    margin: 0 10px;
    padding-bottom: 68px;
    background-color: #fff;
    border-radius: 4px;
}
.transaction-header {
    padding: 12px 14px;
    background-color: $primary-color-line;
}
.icon-wenhao {
    color: #9fb0ca;
}
.yx-cell {
    display: flex;
    padding: 0 14px;
    &.total-trade-money {
        .yx-cell__primary {
            font-size: 0.44rem;
            font-weight: bold;
            line-height: 28px;
        }
    }
    .yx-cell__header {
        font-size: 0.28rem;
        line-height: 20px;
        color: $text-color5;
    }
    .yx-cell__header-tip {
        display: inline-block;
        margin-left: 4px;
        font-size: 0.24rem;
        line-height: 17px;
        color: $text-color6;
    }
    .yx-cell__primary {
        flex: 1;
        text-align: right;
        color: $text-color;
        font-size: 0.36rem;
        line-height: 23px;
    }
    .yx-cell__primary-tip {
        margin-top: 6px;
        color: $text-color3;
        font-size: 0.2rem;
        line-height: 14px;
    }
}
.divider-line {
    margin: 25px 14px 16px;
    height: 1px;
    background-color: rgba($text-color, 0.06);
}
.tips {
    margin-top: 6px;
    padding-right: 15px;
    color: $text-color5;
    font-size: 0.24rem;
    line-height: 18px;
    text-align: right;
    i {
        margin-right: 4px;
    }
    span {
        margin-right: 4px;
    }
}
.foot-button.sell {
    background: #ffbf32;
    border-color: #ffbf32;
}
</style>
<style lang="scss">
// 组件库微调
.transaction-header {
    .media-box__desc {
        margin-top: 2px;
    }
}
.van-pull-refresh .van-pull-refresh__track {
    height: 100%;
}
.yx-container {
    .better-wrap,
    .slotWrapss {
        height: 100%;
    }
}
.transaction-card {
    .van-stepper {
        .van-stepper__minus,
        .van-stepper__plus {
            width: 28px;
            height: 28px;
            background: rgba(0, 0, 0, 0.04);
            border-radius: 2px;
            .van-stepper__minus::before,
            .van-stepper__plus::before {
                background-color: $text-color;
            }
        }
        .van-stepper__input {
            width: 77px;
            padding: 0 4px;
            background-color: #fff;
            color: $text-color;
            font-size: 0.36rem;
            box-sizing: border-box;
        }
    }
}
</style>
