<template lang="pug">
    .transaction-box
        van-pull-refresh(
            v-model="isLoading"
            @refresh="onRefresh"
            :pulling-text="$t('pullingText')"
            :loosing-text="$t('loosingText')"
            :loading-text="$t('loadingText')"
            :success-text="$t('successText')"
        )
            .transaction-card
                //- 债券信息
                .card-header
                    .card-header__title {{ issuerName }}
                    .card-header__sub-title {{ bondName }}

                //- 买入卖出价
                van-cell
                    template(slot="title")
                        span {{ direction === 1 ? $t('buyPrice') : $t('sellPrice') }}
                    template(slot="default")
                        span {{ buyOrSellPrice }}
                        i {{ i18nCurrencyName }}

                //- 交易数量
                van-cell(:title="$t('transactionNum')" style="margin-top:0.3rem")
                    template(slot="default")
                        van-stepper(v-model="transactionNum" integer min="1" max="9999999")
                .van-cell__default-tips {{ $t('bondValue') }}{{ minFaceValue | thousand-spilt }}{{ i18nCurrencyName }}{{ $t('transaction_contracts') }}，{{ $t('tradingAmount') }}{{ minFaceValue | thousand-spilt }}{{ i18nCurrencyName }}{{ $t('bondPrice') }}


                //- 交易金额
                van-cell.no-line.amount-money(:title="$t('amountMoney')")
                    template(slot="default")
                        span {{ tradeMoney | thousand-spilt }}
                        i {{ i18nCurrencyName }}

                //- 应付、应得利息
                van-cell.no-line.interest
                    template(slot="title")
                        span {{ direction === 1 ? $t('payableInterest') : $t('accruedInterest') }}
                        i.iconfont.icon-wenhao(@click="showTips('interest')")
                    template(slot="default")
                        span +{{ calcInterest | thousand-spilt }}

                //- 手续费
                van-cell.service-charge(:title="$t('serviceCharge')")
                    template(slot="default")
                        span {{ direction === 1 ? '+' : '-' }}{{ serviceCharge | thousand-spilt }}

                //- 当次交易总额
                van-cell.no-line.total-money(:title="$t('totalMoney')")
                    template(slot="default")
                        span {{ totalTradeMoney | thousand-spilt }}
                        i {{ i18nCurrencyName }}
                .van-cell__total-tips
                    i.iconfont.icon-wenhao(@click="showTips('total')" v-if="direction === 1")
                    span {{direction === 1 ? $t('availableMoney') : $t('positionsCanBeSold')}}
                    strong(v-if="direction === 1")  {{ marketValue | thousand-spilt }} {{ i18nCurrencyName }}
                    strong(v-if="direction === 2") {{ marketValue }}

        .operate-btn-box
            van-button(
                type="info"
                class="foot-button"
                :disabled="btnDisabled"
                :class="{ sell: direction === 2 }"
                :text="btnText"
                @click="handleTradeToken"
            )
</template>

<script>
import mixin from './mixin'
import { Cell } from 'vant'
export default {
    mixins: [mixin],
    components: {
        [Cell.name]: Cell
    }
}
</script>

<style lang="scss" scoped>
.transaction-box {
    height: 100%;
    font-family: DINPro-Regular, DINPro, PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    .van-pull-refresh {
        height: 100%;
    }
}
.transaction-card {
    padding: 22px $hk-global-padding 70px;
    background-color: #fff;
    font-family: DINPro-Regular, DINPro, PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    border-radius: 4px;
    .card-header {
        margin-bottom: 25px;
        padding: 16px 0 18px;
        text-align: center;
        color: $hk-text-color;
        box-shadow: 0px 2px 4px 0px $hk-text-color1;
        border-radius: 10px;
        .card-header__title {
            font-size: 28px;
            line-height: 40px;
        }
        .card-header__sub-title {
            color: $hk-text-color6;
            font-size: 16px;
            line-height: 22px;
        }
    }
    .van-cell__default-tips {
        padding: 6px 0 18px;
        color: $hk-text-color4;
        font-size: 12px;
        line-height: 15px;
        text-align: right;
    }
    .van-cell__total-tips {
        color: $hk-text-color4;
        font-size: 14px;
        line-height: 20px;
        text-align: right;
        .icon-wenhao {
            margin-right: 6px;
        }
    }
    .icon-wenhao {
        margin-left: 6px;
        color: $hk-text-color4;
        font-size: 15px;
    }
    .hack-input {
        position: absolute;
        top: 0;
        width: 56px;
        right: 23px;
        background-color: transparent;
        border: 0;
        outline: none;
        z-index: 1;
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
// 组件库微调
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
    .van-cell {
        padding: 15px 0;
        &:after {
            left: 115px;
            border: 1px solid rgba($hk-text-color, 0.0765);
        }
        &.no-line:after {
            display: none;
        }
        .van-cell__title {
            display: flex;
            align-items: center;
            font-size: 16px;
            line-height: 22px;
        }
        .van-cell__value {
            position: relative;
            font-size: 24px;
            line-height: 30px;
            i {
                margin-left: 7px;
                font-size: 14px;
                font-style: normal;
                font-weight: normal;
                line-height: 20px;
            }
        }
        &.amount-money,
        &.total-money {
            .van-cell__value {
                font-size: 30px;
                font-weight: bold;
                line-height: 37px;
            }
        }
        &.service-charge,
        &.interest {
            padding: 5px 0;
            .van-cell__title,
            .van-cell__value {
                color: $hk-text-color4 !important;
                font-size: 14px;
                line-height: 20px;
            }
        }
        &.interest {
            margin-top: 8px;
        }
        &.service-charge {
            padding-bottom: 20px;
            &:after {
                left: 0;
            }
        }
        &.total-money {
            margin-top: 5px;
            padding-bottom: 10px;
        }
    }
    .van-stepper {
        text-align: right;
        .van-stepper__minus,
        .van-stepper__plus {
            width: 22px;
            height: 22px;
            &:before,
            &:after {
                display: none;
            }
        }
        .van-stepper__minus {
            background: url('~@/assets/img/bond-hk/icon-less.png') center
                no-repeat;
            background-size: 100%;
        }
        .van-stepper__plus {
            background: url('~@/assets/img/bond-hk/icon-add.png') center
                no-repeat;
            background-size: 100%;
        }
        .van-stepper__input {
            width: 53px;
            padding: 0 4px;
            background-color: #fff;
            color: $hk-text-color;
            font-size: 24px;
            line-height: 30px;
            box-sizing: border-box;
        }
    }
}
</style>
