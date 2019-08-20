<template lang="pug">
    .transaction-wrapper
        transaction-card(
            btnText="确认卖出"
            :direction="2"
            :positionData="positionData"
        )
</template>

<script>
import TransactionCard from '@/pages/bond/index/biz-components/transaction-card/index.vue'
import { getBondPosition } from '@/service/finance-server.js'
export default {
    name: 'TransactionSell',
    components: {
        TransactionCard
    },
    async created() {
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
                this.positionData =
                    (bondPositionList &&
                        bondPositionList.filter(
                            positionItem => positionItem.bondId === this.id
                        )) ||
                    []
                this.positionData =
                    (this.positionData[0] && this.positionData[0]) || {}
                console.log('getBondPosition:data:>>> ', bondPositionList)
            } catch (error) {
                console.log('getBondPosition:error:>>> ', error)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.transaction-wrapper {
    padding: 10px 10px 48px;
}
</style>
