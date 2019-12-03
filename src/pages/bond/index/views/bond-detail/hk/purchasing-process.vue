<template lang="pug">
    .detail-purchasing-process-wrapper
        van-steps(direction="vertical" :active="-1")
            van-step
                <h3>{{ $t('purchased') }}</h3>
            van-step
                <h3>T{{ $t('startEarningInterest') }}</h3>
            van-step
                <h3>{{ paymentDate }}{{ $t('interestPaymentDate') }}</h3>
                <p>・{{ $t('receiveInterest') }}</p>
                <p>・{{ $t('remainingInterest1') }}{{ paymentTime }}{{ $t('time') }}，{{ $t('remainingInterest2') }} {{ paymentAfterTaxPerTime | thousand-spilt }}{{ i18nCurrencyName }} /{{ $t('process_contract') }}</p>
                <p>・{{ $t('totalRemainingInterest') }}: {{ totalPayment | thousand-spilt }}{{ i18nCurrencyName }}/{{ $t('process_contract') }}</p>
            van-step
                <h3>{{ $t('maturity') }}</h3>
                <p>・{{ dueTime | date-format('YYYY.MM.DD') }}</p>
                <p>・{{ $t('receiveLastInterest') }}</p>
                <p>・{{ $t('receiveNominalValue') }}: {{ minFaceValue | thousand-spilt }}{{ i18nCurrencyName }}/{{ $t('process_contract') }}</p>
</template>
<script>
import purchasingProcessMixin from '../mixins/purchasing-process.js'
import { calcPaymentDates } from '@/pages/bond/index/tools.js'
export default {
    i18n: {
        zhCHS: {
            purchased: '成功买入',
            startEarningInterest: '日开始计息',
            interestPaymentDate: '付息日为',
            receiveInterest: '派息日派息，持有中途可卖出',
            remainingInterest1: '到期前剩余派息次数为',
            remainingInterest2: '每次派息为: ',
            time: '次',
            USD: '美元',
            totalRemainingInterest: '到期前总派息为',
            maturity: '到期退出',
            receiveLastInterest: '派发最后一期利息',
            receiveNominalValue: '返还票面值',
            process_contract: '份'
        },
        zhCHT: {
            purchased: '成功買入',
            startEarningInterest: '日開始計息',
            interestPaymentDate: '付息日為',
            receiveInterest: '派息日派息，持有中途可賣出',
            remainingInterest1: '到期前剩餘派息次數為',
            remainingInterest2: '每次派息為: ',
            time: '次',
            USD: '美元',
            totalRemainingInterest: '到期前總派息為',
            maturity: '到期退出',
            receiveLastInterest: '派發最後一期利息',
            receiveNominalValue: '返還票面值',
            process_contract: '份'
        },
        en: {
            purchased: 'Purchased',
            startEarningInterest: ' start earning interest',
            interestPaymentDate: ' Interest Payment Date',
            receiveInterest: 'Receive interest on each interest payment date',
            remainingInterest: 'Total Remaining Interest',
            remainingInterest1: 'Remaining Interest ',
            remainingInterest2: '',
            time: ' time',
            USD: 'USD',
            totalRemainingInterest: 'Total Remaining Interest',
            maturity: 'Maturity',
            receiveLastInterest: 'Receive the last round of interest',
            receiveNominalValue: 'Receive nominal value',
            process_contract: ' contract'
        }
    },
    mixins: [purchasingProcessMixin],
    props: {
        paymentInfo: {
            type: Object,
            default: () => {}
        }
    },
    computed: {
        // 付息日
        paymentDate() {
            return calcPaymentDates(
                this.bondUneditableInfo && this.bondUneditableInfo.paymentDate,
                true
            )
        },
        // 现在到持有到期派息次数
        paymentTime() {
            return (this.paymentInfo && this.paymentInfo.paymentTime) || 0
        },
        // 每次收息税后收多少利息
        paymentAfterTaxPerTime() {
            return (
                (this.paymentInfo &&
                    this.paymentInfo.paymentAfterTaxPerTime &&
                    (this.paymentInfo.paymentAfterTaxPerTime - 0).toFixed(3)) ||
                0
            )
        },
        // 合共收息
        totalPayment() {
            let t = this.paymentTime * this.paymentAfterTaxPerTime
            return (t && t.toFixed(3)) || 0
        },
        // 本金份额
        minFaceValue() {
            return (
                (this.bondUneditableInfo &&
                    this.bondUneditableInfo.minFaceValue) ||
                '--'
            )
        },
        i18nCurrencyName() {
            return this.$t(this.currencyName)
        },
        // 货币单位 USD
        currencyName() {
            return (
                (this.bondUneditableInfo &&
                    this.bondUneditableInfo.enumCurrency &&
                    this.bondUneditableInfo.enumCurrency.name) ||
                ''
            )
        }
    }
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
