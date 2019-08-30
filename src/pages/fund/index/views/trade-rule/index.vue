<template lang="pug">
.tarde-rule
    FundListItem(
        :title="tradeTitle"
        :cellList="tradeList"
        :subTitle="tradeSubTitle")
        FundStep(
            slot="fundStep"
            :oneStep="buySubmit"
            :twoStep="buyConfirm"
            :threeStep="buyProfitLoss")
    .fund-redeem
        FundListItem(
            :title="redeemTitle"
            :cellList="redeemList"
            :subTitle="redeemSubtitle")
            FundStep(
              slot="fundStep"
              :oneStep="sellSubmit"
              :twoStep="sellConfirm"
              :threeStep="sellProfitLoss")

    
    .fund-management-list
        h3.fund-management-title 管理费
        FunCell(:cellList="managementList")
</template>
<script>
import FundListItem from './components/fund-list-item'
import FunCell from './components/common/fund-cell'
import FundStep from './components/common/fund-step'
import { tradeList, redeemList, managementList } from './trade-rule'
export default {
    components: {
        FundListItem,
        FunCell,
        FundStep
    },
    data() {
        return {
            tradeTitle: '申购',
            tradeSubTitle: '申购流程',
            tradeList: tradeList,
            redeemTitle: '赎回',
            redeemSubtitle: '赎回流程',
            redeemList: redeemList,
            managementList: managementList,
            buySubmit: {
                label: '买入提交',
                value: ''
            },
            buyConfirm: {
                label: '确认份额',
                value: ''
            },
            buyProfitLoss: {
                label: '查看盈亏',
                value: ''
            },
            sellSubmit: {
                label: '提交赎回申请',
                value: ''
            },
            sellConfirm: {
                label: '确认份额',
                value: ''
            },
            sellProfitLoss: {
                label: '查看盈亏',
                value: ''
            }
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
            this.buySubmit.value = params.buySubmit
            this.buyConfirm.value = params.buyConfirm
            this.buyProfitLoss.value = params.buyProfitLoss
            this.sellSubmit.value = params.sellSubmit
            this.sellConfirm.value = params.sellConfirm
            this.sellProfitLoss.value = params.sellProfitLoss

            console.log(params)
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
