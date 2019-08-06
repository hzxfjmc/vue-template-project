<template lang="pug">
    .transaction-wrapper
        transacntion-card
        fixed-operate-btn(text="确认卖出")
</template>

<script>
import FixedOperateBtn from '@/pages/bond/index/biz-components/fix-operate-button/index.vue'
import TransacntionCard from '@/pages/bond/index/biz-components/transaction-card/index.vue'
export default {
    name: 'TransanctionBuy',
    components: {
        TransacntionCard,
        FixedOperateBtn
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
        background-color: #ffbf32;
        color: #fff;
        font-size: 16px;
        text-align: center;
        line-height: 48px;
    }
}
</style>
