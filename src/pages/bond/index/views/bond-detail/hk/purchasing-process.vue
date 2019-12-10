<template lang="pug">
    .detail-purchasing-process-wrapper
        van-steps(direction="vertical" :active="-1")
            van-step
                h3 {{ $t('purchased') }}
            van-step
                h3 T{{ $t('startEarningInterest') }}
            van-step
                h3 {{ paymentDate }}{{ $t('interestPaymentDate') }}
                p ・{{ $t('receiveInterest') }}
                p ・{{ $t('remainingInterest1') }}{{ paymentTime }}{{ $t('time') }}，{{ $t('remainingInterest2') }} {{ paymentAfterTaxPerTime | thousand-spilt }}{{ i18nCurrencyName }} /{{ $t('process_contract') }}
                p ・{{ $t('totalRemainingInterest') }}: {{ totalPayment | thousand-spilt }}{{ i18nCurrencyName }}/{{ $t('process_contract') }}
            van-step
                h3 {{ $t('maturity') }}
                p ・{{ dueTime | date-format('YYYY.MM.DD') }}
                p ・{{ $t('receiveNominalValue') }}: {{ minFaceValue | thousand-spilt }}{{ i18nCurrencyName }}/{{ $t('process_contract') }}
</template>
<script>
import purchasingProcessMixin from '../mixins/purchasing-process.js'
export default {
    mixins: [purchasingProcessMixin]
}
</script>
<style lang="scss" scoped></style>
<style lang="scss">
.detail-purchasing-process-wrapper {
    .van-steps--vertical {
        padding: 6px 0 12px 35px;
    }
    .van-step--vertical {
        padding: 7px 10px 8px 0;
        .van-step__circle-container {
            & > .van-step__circle {
                top: 10px;
                left: -20px;
                width: 12px;
                height: 12px;
                background-color: $hk-primary-color;
            }
        }
        .van-step__line {
            width: 0;
            border-left: 1px dashed rgba($color: $hk-text-color, $alpha: 0.2);
        }
        &:not(:last-child)::after {
            display: none;
        }
    }
    .van-step {
        .van-step__title {
            font-size: 0.24rem;
            line-height: 17px;
            h3 {
                color: $hk-text-color;
            }
            p {
                margin-top: 5px;
                color: $hk-primary-color;
                font-family: PingFangHK-Regular, PingFangHK;
            }
        }
        &:last-child {
            .van-step__line {
                border-left: none;
            }
        }
    }
}
</style>
