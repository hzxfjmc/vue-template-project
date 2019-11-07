import { Tag } from 'vant'
export default {
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
        }
    }
}
