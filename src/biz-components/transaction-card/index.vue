<template lang="pug">
    .transaction-box
        van-pull-refresh(
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
                        van-stepper(
                            ref="vantstepper"
                            type="number",
                            :min="1"
                            :max="9999999"
                            v-model="transactionNum"
                        )
                        .yx-cell__primary-tip ({{ minFaceValue | thousand-spilt }}{{ currencyShortSymbol }}/份)
                .yx-cell(style="padding:0.4rem 0.28rem 0.26rem")
                    .yx-cell__header 金额
                    .yx-cell__primary {{ tradeMoney | thousand-spilt }}

                .yx-cell.sp
                    .yx-cell__header {{ direction === 1 ? '应付利息' : '应得利息' }}
                        .yx-cell__header-tip
                            i.iconfont.icon-wenhao(@click="showTips('interest')")
                    .yx-cell__primary +{{ calcInterest | thousand-spilt }}

                .yx-cell.sp(style="padding-top:0.2rem")
                    .yx-cell__header 手续费(预估)
                    .yx-cell__primary {{direction === 1 ? '+' : '-'}}{{ serviceCharge }}

                .divider-line

                .yx-cell.total-trade-money
                    .yx-cell__header 总额
                        .yx-cell__header-tip ({{ currencyShortSymbol }})
                    .yx-cell__primary {{ totalTradeMoney | thousand-spilt }}

                .tips
                    i.iconfont.icon-wenhao(
                        v-if="direction === 1"
                        @click="showTips('total')"
                    )
                    span {{direction === 1 ? '债券可用资金' : '持仓可卖'}}
                    strong(v-if="direction === 1") {{ marketValue | thousand-spilt }}
                    strong(v-if="direction === 2") {{ marketValue }}
        .operate-btn-box
            van-button(
                type="info"
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
.transaction-box {
    height: 100%;
    padding-top: 10px;
    background-color: $background-bottom-color;
    font-family: DINPro-Regular, DINPro, PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    .van-pull-refresh {
        min-height: 100%;
    }
}
.transaction-card {
    overflow: hidden;
    margin: 0 10px 50px;
    padding-bottom: 20px;
    background-color: #fff;
    border-radius: 4px;
    .transaction-header {
        padding: 12px 14px;
        background-color: $primary-color-line;
        border-radius: 4px 4px 0px 0px;
    }
    .icon-wenhao {
        font-size: 14px;
    }
    .yx-cell {
        display: flex;
        padding: 0 14px;
        &.sp {
            .yx-cell__header {
                font-size: 12px;
                line-height: 18px;
                color: $text-color5;
            }
            .yx-cell__primary {
                font-size: 14px;
                line-height: 18px;
            }
        }
        &.total-trade-money {
            .yx-cell__primary {
                font-size: 22px;
                font-weight: 500;
                line-height: 28px;
            }
        }
        .yx-cell__header {
            font-size: 14px;
            line-height: 20px;
            color: $text-color6;
        }
        .yx-cell__header-tip {
            display: inline-block;
            margin-left: 4px;
            font-size: 12px;
            line-height: 17px;
            color: $text-color6;
        }
        .yx-cell__primary {
            flex: 1;
            text-align: right;
            color: $text-color;
            font-size: 18px;
            line-height: 23px;
        }
        .yx-cell__primary-tip {
            margin-top: 6px;
            color: $text-color3;
            font-size: 10px;
            line-height: 14px;
        }
    }
    .divider-line {
        margin: 25px 14px 17px;
        height: 1px;
        background-color: $text-color8;
    }
    .tips {
        margin-top: 6px;
        padding-right: 16px;
        color: $text-color5;
        font-size: 12px;
        line-height: 18px;
        text-align: right;
        i {
            margin-right: 4px;
        }
        span {
            margin-right: 4px;
        }
        strong {
            font-size: 14px;
            font-weight: normal;
            line-height: 18px;
        }
    }
}
.operate-btn-box {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    .foot-button {
        height: 48px;
        margin: 0;
        margin-bottom: constant(safe-area-inset-bottom);
        margin-bottom: env(safe-area-inset-bottom);
        &.sell {
            background: #ffbf32;
            border-color: #ffbf32;
        }
    }
}
</style>
<style lang="scss">
.transaction-card {
    // 组件库微调
    .transaction-header {
        .media-box__desc {
            margin-top: 2px;
        }
    }
    .van-stepper {
        .van-stepper__minus,
        .van-stepper__plus {
            width: 28px;
            height: 28px;
            margin: 0;
            background: rgba(0, 0, 0, 0.04);
            border-radius: 2px;
            &:before,
            &:after {
                background-color: $text-color;
            }
        }
        .van-stepper__input {
            width: 77px;
            padding: 0 4px;
            background-color: #fff;
            color: $text-color;
            font-size: 18px;
            box-sizing: border-box;
        }
    }
}
</style>
