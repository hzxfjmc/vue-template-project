<template lang="pug">
    .bond-detail-wrapper
        detail-header
        van-panel(title="购买流程")
            purchasing-process
        van-panel(title="债券价格")
            BondPrice
        van-panel(title="债券资料")
            BondInfo
</template>
<script>
// import { getBondList } from '@/service/finance-server.js'
import { Panel } from 'vant'
import DetailHeader from './components/detail-header/index.vue'
import PurchasingProcess from './components/purchasing-process/index.vue'
import BondPrice from './components/bond-price/index.vue'
import BondInfo from './components/bond-info/index.vue'
export default {
    name: 'BondList',
    components: {
        [Panel.name]: Panel,
        DetailHeader,
        PurchasingProcess,
        BondPrice,
        BondInfo
    },
    async created() {},
    data() {
        return {}
    }
}
</script>
<style lang="scss" scoped>
.bond-detail-wrapper {
    padding: 10px;
    color: #393939;
}
// 微调 vant panel 样式
.van-panel {
    margin-top: 10px;
    border-radius: 4px;
    .van-panel__header {
        padding: 14px;
        &:after {
            display: none;
        }
    }
    .van-cell__title {
        color: #393939;
        font-size: 0.28rem;
        line-height: 20px;
    }
}
</style>
