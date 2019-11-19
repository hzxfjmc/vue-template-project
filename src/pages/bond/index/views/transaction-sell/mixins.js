import YxContainerBetter from '@/components/yx-container-better'
import TransactionCard from '@/biz-components/transaction-card/index.vue'
import { getBondPosition } from '@/service/finance-server.js'
export default {
    name: 'TransactionSell',
    components: {
        TransactionCard,
        YxContainerBetter
    },
    created() {
        this.handleGetBondPosition()
    },
    data() {
        return {
            positionData: {} // 当前用户债券持仓
        }
    },
    methods: {
        // 获取当前用户债券持仓
        async handleGetBondPosition() {
            try {
                let { bondPositionList } = await getBondPosition(2)
                let tempPositionData =
                    (bondPositionList &&
                        bondPositionList.filter(
                            positionItem =>
                                positionItem.bondId === this.$route.query.id - 0
                        )) ||
                    []
                this.positionData = tempPositionData[0] || {}
                console.log('getBondPosition:data:>>> ', bondPositionList)
            } catch (error) {
                console.log('getBondPosition:error:>>> ', error)
            }
        }
    }
}