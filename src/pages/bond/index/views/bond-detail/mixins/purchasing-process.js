import { Step, Steps } from 'vant'
// import { dateFormat } from '@/utils/tool.js'
import { calcPaymentDates } from '@/pages/bond/index/tools.js'
export default {
    i18n: {
        zhCHS: {
            purchased: '成功买入',
            startEarningInterest: '日开始计息',
            interestPaymentDate: '为付息日',
            receiveInterest: '派息日派息，持有中途可卖出',
            remainingInterest1: '到期前剩余派息次数为',
            remainingInterest2: '每次派息为: ',
            time: '次',
            USD: '美元',
            totalRemainingInterest: '到期前总派息为',
            maturity: '到期退出',
            receiveNominalValue: '返还票面值',
            process_contract: '份'
        },
        zhCHT: {
            purchased: '成功買入',
            startEarningInterest: '日開始計息',
            interestPaymentDate: '為付息日',
            receiveInterest: '派息日派息，持有中途可賣出',
            remainingInterest1: '到期前剩餘派息次數為',
            remainingInterest2: '每次派息為: ',
            time: '次',
            USD: '美元',
            totalRemainingInterest: '到期前總派息為',
            maturity: '到期退出',
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
            receiveNominalValue: 'Receive nominal value',
            process_contract: ' contract'
        }
    },
    name: 'PurchasingProcess',
    components: {
        [Step.name]: Step,
        [Steps.name]: Steps
    },
    props: {
        paymentInfo: {
            type: Object,
            default: () => {}
        },
        bondUneditableInfo: {
            type: Object,
            default: () => {}
        }
    },
    computed: {
        dueTime() {
            return (
                (this.bondUneditableInfo && this.bondUneditableInfo.dueTime) ||
                0
            )
        },
        // 货币单位
        currency() {
            return (
                (this.bondUneditableInfo &&
                    this.bondUneditableInfo.enumCurrency &&
                    this.bondUneditableInfo.enumCurrency.shortSymbol) ||
                ''
            )
        },
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
                    (this.paymentInfo.paymentAfterTaxPerTime - 0).toFixed(2)) ||
                0
            )
        },
        // 合共收息
        totalPayment() {
            let t = this.paymentTime * this.paymentAfterTaxPerTime
            return (t && t.toFixed(2)) || 0
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
