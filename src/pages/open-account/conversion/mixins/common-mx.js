import { createNamespacedHelpers } from 'vuex'
const {
    mapActions,
    mapMutations,
    mapState,
    mapGetters
} = createNamespacedHelpers('conversion')
export default {
    computed: {
        ...mapState(['conversionForm']),
        ...mapGetters(['curName'])
    },
    created() {
        this.initState()
    },
    methods: {
        ...mapActions(['initState']),
        ...mapMutations(['updateForm'])
    }
}
