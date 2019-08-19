<template lang="pug">
    .transaction-wrapper
        transaction-card(
            btnText="确认买入"
            :direction="1"
            :accountInfo="accountInfo"
        )
</template>

<script>
import TransactionCard from '@/pages/bond/index/biz-components/transaction-card/index.vue'
import { hsAccountInfo } from '@/service/stock-capital-server.js'
export default {
    name: 'TransactionBuy',
    components: {
        TransactionCard
    },
    created() {
        this.handleHsAccountInfo()
    },
    data() {
        return {
            accountInfo: {} // 用户恒生资金账户信息
        }
    },
    methods: {
        async handleHsAccountInfo() {
            try {
                let data = await hsAccountInfo(0)
                this.accountInfo = data || {}
                console.log('hsAccountInfo:data:>>>', data)
            } catch (error) {
                console.log('hsAccountInfo:error:>>>', error)
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
