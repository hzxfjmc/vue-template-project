import { Step, Steps } from 'vant'
// import { dateFormat } from '@/utils/tool.js'
import { calcPaymentDates } from '@/pages/bond/index/tools.js'
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
        dueTime() {
            return (
                (this.bondUneditableInfo && this.bondUneditableInfo.dueTime) ||
                0
            )
        },
        // 付息日
        paymentDate() {
            return calcPaymentDates(
                this.bondUneditableInfo && this.bondUneditableInfo.paymentDate,
                true
            )
        },
        // 计息日
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
