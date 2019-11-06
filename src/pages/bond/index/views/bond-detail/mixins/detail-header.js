import { Row, Col } from 'vant'
import MediaBox from '@/biz-components/media-box/index.vue'
import ColMsg from '@/biz-components/col-msg/index.vue'
export default {
    name: 'DetailHeader',
    components: {
        [Row.name]: Row,
        [Col.name]: Col,
        MediaBox,
        ColMsg
    },
    props: {
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
                flex: '0 0 auto'
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
        // 债券特性列表
        bondTitleInfo() {
            return (
                (this.bondEditableInfo &&
                    this.bondEditableInfo.bondTitleInfo) ||
                []
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
        // 起购金额/最小面额
        minFaceValue() {
            return (
                (this.bondUneditableInfo &&
                    this.bondUneditableInfo.minFaceValue &&
                    (this.bondUneditableInfo.minFaceValue - 0).toFixed(3)) ||
                '--'
            )
        }
    }
}
