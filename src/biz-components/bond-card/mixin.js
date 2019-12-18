import { Tag } from 'vant'
import { getStockColorType } from '@/utils/html-utils'
const stockColorType = getStockColorType()
// 1 表示 红涨绿跌， 2 表示 绿涨红跌
const stockColorClass = {
    1: {
        up: 'red',
        down: 'green'
    },
    2: {
        up: 'green',
        down: 'red'
    }
}
export default {
    i18n: {
        zhCHS: {
            yieldToMaturity: '到期年化收益率',
            refAmountContract: '参考认购金额/份',
            annualInterestContract: '年派息/份'
        },
        zhCHT: {
            yieldToMaturity: '到期年化收益率',
            refAmountContract: '參考認購金額/份',
            annualInterestContract: '年派息/份'
        },
        en: {
            yieldToMaturity: 'Yield-to-Maturity',
            refAmountContract: 'Ref. Amount / Contract',
            annualInterestContract: 'Annual Interest / Contract'
        }
    },
    name: 'BondCard',
    components: {
        [Tag.name]: Tag
    },
    props: {
        bondInfo: {
            type: Object,
            default: () => {}
        }
    },
    computed: {
        // 股票上涨类名
        up() {
            return stockColorClass[stockColorType].up
        },
        // 股票下跌类名
        down() {
            return stockColorClass[stockColorType].down
        },
        // 发行人
        issuerName() {
            // 发行人名称长度最长展示18个字符
            return (
                (this.bondInfo &&
                    this.bondInfo.issuerName &&
                    this.bondInfo.issuerName.slice(0, 18)) ||
                '--'
            )
        },
        h2Style() {
            // 发行人名称字体变化策略
            let issuerName = this.bondInfo.issuerName || ''
            let tags = (this.bondInfo && this.bondInfo.tags) || []
            let tagLen = 0
            tags.forEach(tag => {
                tagLen += tag.toString().length
            })
            // 极限条件 issuerName 发行人名称超过 13 个字符
            // 标签有三个，每个三个字符，共 9 个字符
            // 此时按设计稿看，刚好充满一个整行
            // 这里统一设置一个模糊边界策略，只要大于 13 + 9 = 20 就缩小字体
            if (issuerName.length + tagLen >= 19) {
                return {
                    flex: 1,
                    fontSize: '0.32rem',
                    lineHeight: '0.44rem'
                }
            }
            return {}
        },
        // 标签
        limitTags() {
            // 最多只取三个标签
            let filterTag =
                (this.bondInfo &&
                    this.bondInfo.tags &&
                    this.bondInfo.tags.slice(0, 3)) ||
                []
            return filterTag
        },
        // 到期年化收益率
        buyYtm() {
            return (
                (this.bondInfo &&
                    this.bondInfo.price &&
                    this.bondInfo.price.buyYtm &&
                    (this.bondInfo.price.buyYtm - 0).toFixed(3) + '%') ||
                '--'
            )
        },
        // 參考認購金額
        subscriptionAmount() {
            return (
                (this.minFaceValue * this.buyPrice &&
                    `${this.currency}${(
                        this.minFaceValue * this.buyPrice
                    ).toFixed(2)}`) ||
                '--'
            )
        },
        // 最小面额
        minFaceValue() {
            return (this.bondInfo && this.bondInfo.minFaceValue - 0) || 0
        },
        // 购买价格
        buyPrice() {
            return (
                (this.bondInfo &&
                    this.bondInfo.price &&
                    this.bondInfo.price.buyPrice &&
                    this.bondInfo.price.buyPrice - 0) ||
                0
            )
        },
        // 货币单位
        currency() {
            return (
                (this.bondInfo &&
                    this.bondInfo.enumCurrency &&
                    this.bondInfo.enumCurrency.symbol) ||
                ''
            )
        },
        // 年稅後派息
        paymentAfterTaxPerYear() {
            return (
                (this.bondInfo &&
                    this.bondInfo.paymentAfterTaxPerYear &&
                    `${this.currency}${(
                        this.bondInfo.paymentAfterTaxPerYear - 0
                    ).toFixed(2)}`) ||
                '--'
            )
        }
    }
}
