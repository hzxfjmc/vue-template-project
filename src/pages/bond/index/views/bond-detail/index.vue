<template lang="pug">
    .bond-detail-wrapper
        detail-header
        van-panel(title="购买流程")
            purchasing-process
        van-panel(title="债券价格")
            BondPrice
        van-panel(title="债券资料")
            BondInfo
        van-panel(title="交易规则")
            TransactionRules
        .faq
            router-link(to="####") 债券常见问题
        .operate-btn-box
            div(@click="handleBuyOrSell('buy')") 买入
            div(@click="handleBuyOrSell('sell')") 卖出

</template>
<script>
// import { getBondList } from '@/service/finance-server.js'
import { Panel } from 'vant'
import DetailHeader from './components/detail-header/index.vue'
import PurchasingProcess from './components/purchasing-process/index.vue'
import BondPrice from './components/bond-price/index.vue'
import BondInfo from './components/bond-info/index.vue'
import TransactionRules from './components/transaction-rules/index.vue'
export default {
    name: 'BondList',
    components: {
        [Panel.name]: Panel,
        DetailHeader,
        PurchasingProcess,
        BondPrice,
        BondInfo,
        TransactionRules
    },
    async created() {},
    data() {
        return {}
    },
    methods: {
        handleBuyOrSell(type) {
            if (type === 'buy') {
                console.log('buy')
                this.$router.push('/transanction-buy')
            } else {
                console.log('sell')
                this.$router.push('/transanction-sell')
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.bond-detail-wrapper {
    padding: 10px 10px 48px;
    color: #393939;
    // 常见问题
    .faq {
        text-align: center;
        margin: 10px auto 12px;
        a {
            color: #2f79ff;
            font-size: 0.24rem;
            line-height: 17px;
        }
    }
    // 买入卖出按钮
    .operate-btn-box {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 48px;
        display: flex;
        div {
            display: flex;
            align-items: center;
            justify-content: center;
            flex: 1;
            height: 100%;
            background-color: #497aff;
            color: #fff;
            font-size: 0.32rem;
            &:last-child {
                background-color: #ffbf32;
            }
        }
    }
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
