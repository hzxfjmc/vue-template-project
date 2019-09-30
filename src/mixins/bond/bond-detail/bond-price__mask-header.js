import { Panel } from 'vant'
import ColMsg from '@/biz-components/col-msg'
export default {
    name: 'MaskHeader',
    components: {
        [Panel.name]: Panel,
        ColMsg
    },
    props: {
        maskData: {
            type: Object,
            defatult: () => {}
        }
    },
    data() {
        return {
            descStyle: {}
        }
    },
    computed: {
        title() {
            return this.maskData && this.maskData.title
        },
        colData() {
            return this.maskData && this.maskData.colData
        }
    }
}
