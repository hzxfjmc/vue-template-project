<template lang="pug">
    .transaction-wrapper
        transacntion-card
        .operate-btn 确认买入
</template>

<script>
import TransacntionCard from '@/pages/bond/index/biz-components/transaction-card/index.vue'
export default {
    name: 'TransanctionBuy',
    components: {
        TransacntionCard
    },
    data() {
        return {}
    }
}
</script>

<style lang="scss" scoped>
.transaction-wrapper {
    padding: 10px 10px 48px;
    .operate-btn {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        height: 48px;
        background-color: #497aff;
        color: #fff;
        font-size: 16px;
        text-align: center;
        line-height: 48px;
    }
}
</style>
