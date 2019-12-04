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
        dueTime() {
            return (
                (this.bondUneditableInfo && this.bondUneditableInfo.dueTime) ||
                0
            )
        },
        // 计息日
        // enumDelivery() {
        //     return (
        //         (this.bondUneditableInfo &&
        //             this.bondUneditableInfo.enumDelivery &&
        //             this.bondUneditableInfo.enumDelivery.name) ||
        //         '--'
        //     )
        // },
        // 货币单位
        currency() {
            return (
                (this.bondUneditableInfo &&
                    this.bondUneditableInfo.enumCurrency &&
                    this.bondUneditableInfo.enumCurrency.shortSymbol) ||
                ''
            )
        }
    }
}
