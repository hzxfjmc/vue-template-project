import { Step, Steps } from 'vant'
// import { dateFormat } from '@/utils/tool.js'
export default {
    name: 'PurchasingProcess',
    components: {
        [Step.name]: Step,
        [Steps.name]: Steps
    },
    props: {
        bondUneditableInfo: {
            type: Object,
            default: () => {}
        }
    },
    computed: {
        // 付息日
        paymentDate() {
            let d =
                this.bondUneditableInfo && this.bondUneditableInfo.paymentDate
            d = d ? d.split('|') : ''
            let suffix = d.length > 2 ? '等' : ''
            return d ? d.slice(0, 2).join('、') + suffix : '--'
        },
        enumDelivery() {
            return (
                (this.bondUneditableInfo &&
                    this.bondUneditableInfo.enumDelivery &&
                    this.bondUneditableInfo.enumDelivery.name) ||
                '--'
            )
        }
    }
}
