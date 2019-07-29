import { Popup, Search } from 'vant'
export default {
    props: {
        value: {
            type: Boolean,
            default: false
        },
        placeholder: {
            type: String,
            default: ''
        },
        exchangeType: {
            type: Number,
            default: 0
        }
    },
    methods: {
        selectStocks(item) {
            this.$emit('select-stocks', item)
        }
    },
    data() {
        return {
            timer: '',
            searchKey: '',
            params: {
                q: '',
                mkts: '',
                type1: '',
                type2: '',
                type3: '',
                from: 0,
                size: 50
            },
            searchList: []
        }
    },
    components: {
        [Popup.name]: Popup,
        [Search.name]: Search
    },
    computed: {
        show: {
            get() {
                return this.value
            },
            set(val) {
                this.$emit('input', val)
            }
        }
    }
}
