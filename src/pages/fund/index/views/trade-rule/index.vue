<template lang="pug">
.tarde-rule
    FundListItem(
        :title="tradeTitle"
        :cellList="tradeList"
        :subTitle="tradeSubTitle")
    .fund-redeem
        FundListItem(
            :title="redeemTitle"
            :cellList="redeemList"
            :subTitle="redeemSubtitle")
    
    .fund-management-list
        h3.fund-management-title 管理费
        FunCell(:cellList="managementList")
</template>
<script>
import FundListItem from './components/fund-list-item'
import FunCell from './components/common/fund-cell'
import { tradeList, redeemList, managementList } from './trade-rule'
export default {
    components: {
        FundListItem,
        FunCell
    },
    data() {
        return {
            tradeTitle: '申购',
            tradeSubTitle: '申购流程',
            tradeList: tradeList,
            redeemTitle: '赎回',
            redeemSubtitle: '赎回流程',
            redeemList: redeemList,
            managementList: managementList
        }
    },
    methods: {
        InitState() {
            let params = this.$route.query
            for (let key in this.tradeList) {
                this.tradeList[key].value =
                    key == 'tradeFrequency'
                        ? params[key]
                        : Number(params[key]).toFixed(2)
            }
            this.redeemList.lowestInvestAmount.value = Number(
                params.lowestInvestAmount
            ).toFixed(2)
            this.redeemList.subscriptionFee.value = Number(
                params.subscriptionFee
            ).toFixed(2)
        }
    },
    mounted() {
        this.InitState()
    }
}
</script>
<style lang="scss" scoped>
.fund-redeem {
    // display: flex;
    margin: 10px 0 0 0;
}
.fund-management-list {
    padding: 0 10px;
    margin: 10px 0 0 0;
    background: #fff;
    .fund-management-title {
        line-height: 50px;
        border-bottom: 1px solid #e1e1e1;
    }
}
</style>
