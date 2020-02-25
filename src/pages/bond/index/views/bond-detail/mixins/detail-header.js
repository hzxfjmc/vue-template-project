import { Row, Col } from 'vant'
import MediaBox from '@/biz-components/media-box/index.vue'
import ColMsg from '@/biz-components/col-msg/index.vue'
import { transNumToThousandMark } from '@/utils/tools.js'
export default {
    i18n: {
        zhCHS: {
            yieldToMaturity: '到期年化收益率',
            yieldToMaturityTips:
                '到期收益率指按买入价格买入债券并持有到期，获得的全部利息和本金计算而来的年平均收益率。\n\n' +
                '到期收益率综合考虑了购买价格、持有期限、票面利率等因素，是非常重要的参考要素。',
            refAmountContract: '参考申购金额/份',
            annualInterestContract: '年派息/份',
            viewStocks: '查看股票',
            ok: '我知道了'
        },
        zhCHT: {
            yieldToMaturity: '到期年化收益率',
            yieldToMaturityTips:
                '到期收益率指按買入價格買入債券並持有到期，獲得的全部利息和本金計算而來的年平均收益率。\n\n' +
                '到期收益率綜合考慮了購買價格、持有期限、票面利率等因素，是非常重要的參考要素。',
            refAmountContract: '參考認購金額/份',
            annualInterestContract: '年派息/份',
            ok: '我知道了',
            viewStocks: '查看股票'
        },
        en: {
            yieldToMaturity: 'Yield-to-Maturity',
            yieldToMaturityTips:
                'Yield to Maturity is the estimated annual average rate of return investors can expect to set aside to make this bond investment at the current market price (or the target price you entered). ',
            refAmountContract: 'Ref. Amount / Contract',
            annualInterestContract: 'Annual Interest / Contract',
            ok: 'OK',
            viewStocks: 'View Stocks'
        }
    },
    name: 'DetailHeader',
    components: {
        [Row.name]: Row,
        [Col.name]: Col,
        MediaBox,
        ColMsg
    },
    props: {
        paymentAfterTaxPerYear: {
            type: String,
            default: ''
        },
        bondEditableInfo: {
            type: Object,
            default: () => {}
        },
        bondUneditableInfo: {
            type: Object,
            default: () => {}
        },
        currentPrice: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            wrapperStyle: {
                flex: this.$i18n.lang === 'en' ? 'unset' : '0 0 auto'
            }
        }
    },
    computed: {
        // 发行人
        headerTitle() {
            return (
                (this.bondEditableInfo &&
                    this.bondEditableInfo.issuer &&
                    this.bondEditableInfo.issuer.name) ||
                '--'
            )
        },
        // 债券名称
        headerDesc() {
            return (
                (this.bondEditableInfo && this.bondEditableInfo.bondName) ||
                '--'
            )
        },
        // 到期年化利率
        buyYtm() {
            return (
                (this.currentPrice &&
                    this.currentPrice.buyYtm &&
                    (this.currentPrice.buyYtm - 0).toFixed(3) + '%') ||
                '--'
            )
        },
        // 到期年化利率/參考認購金額/年稅後派息
        colData() {
            let obj = [
                {
                    title: this.buyYtm,
                    desc: this.$t('yieldToMaturity'),
                    click: () => {
                        this.$dialog.alert({
                            message: this.$t('yieldToMaturityTips'),
                            messageAlign: 'left',
                            confirmButtonText: this.$t('ok')
                        })
                    },
                    class: 'icon-wenhao'
                },
                {
                    title: transNumToThousandMark(
                        this.subscriptionAmount.toString(),
                        3
                    ),
                    desc: this.$t('refAmountContract')
                },
                {
                    title: transNumToThousandMark(
                        this.solvePaymentAfterTaxPerYear.toString(),
                        3
                    ),
                    desc: this.$t('annualInterestContract')
                }
            ]
            return obj
        },
        // 參考認購金額
        subscriptionAmount() {
            return (
                (this.minFaceValue * this.buyPrice &&
                    `${(this.minFaceValue * this.buyPrice).toFixed(2)}`) ||
                ''
            )
        },
        // 最小面额
        minFaceValue() {
            return (
                (this.bondUneditableInfo &&
                    this.bondUneditableInfo.minFaceValue - 0) ||
                0
            )
        },
        // 购买价格
        buyPrice() {
            return (
                (this.currentPrice &&
                    this.currentPrice.buyPrice &&
                    this.currentPrice.buyPrice - 0) ||
                0
            )
        },
        // 年稅後派息
        solvePaymentAfterTaxPerYear() {
            return (
                (this.paymentAfterTaxPerYear &&
                    `${(this.paymentAfterTaxPerYear - 0).toFixed(2)}`) ||
                ''
            )
        },
        // 债券特性列表
        bondTitleInfo() {
            return (
                (this.bondEditableInfo &&
                    this.bondEditableInfo.bondTitleInfo) ||
                []
            )
        }
    }
}
