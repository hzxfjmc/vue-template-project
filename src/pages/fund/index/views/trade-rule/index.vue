<template lang="pug">
.tarde-rule
    FundListItem(
        :title="$t('tradeTitle')"
        :cellList="tradeList"
        :subtitle="$t('tradeSubTitle')")
        FundStep(
            slot="fundStep"
            :oneStep="buySubmit"
            :twoStep="buyConfirm"
            :threeStep="buyProfitLoss")
    .fund-redeem
        FundListItem(
            :title="$t('redeemTitle')"
            :cellList="redeemList"
            :subtitle="$t('redeemSubtitle')")
            FundStep(
              slot="fundStep"
              :oneStep="sellSubmit"
              :twoStep="sellConfirm"
              :threeStep="sellProfitLoss")

    
    .fund-management-list
        h3.fund-management-title(class="border-bottom") 管理费
        FunCell(:cellList="managementList")
</template>
<script>
import FundListItem from './components/fund-list-item'
import FunCell from './components/common/fund-cell'
import { transNumToThousandMark } from '@/utils/tools.js'
import FundStep from './components/common/fund-step'
import {
    tradeList,
    redeemList,
    managementList,
    i18nTrudeRuleData
} from './trade-rule'
export default {
    i18n: i18nTrudeRuleData,
    components: {
        FundListItem,
        FunCell,
        FundStep
    },
    data() {
        return {
            tradeList: tradeList,
            redeemList: redeemList,
            tradeSubTitle: '423432423',
            managementList: managementList,
            buySubmit: {
                label: '买入提交',
                value: ''
            },
            buyConfirm: {
                label: '确认份额423',
                value: ''
            },
            buyProfitLoss: {
                label: '查看盈亏4234',
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
        InitI18nState() {
            for (let key in this.tradeList) {
                this.tradeList[key].label = this.$t('tradeList')[key].label
            }
            for (let key in this.redeemList) {
                this.redeemList[key].label = this.$t('redeemList')[key].label
            }
            for (let key in this.managementList) {
                this.managementList[key].label = this.$t('managementList')[
                    key
                ].label
            }
            this.sellProfitLoss.label = this.$t('sellProfitLoss.label')
            this.sellConfirm.label = this.$t('sellConfirm.label')
            this.buySubmit.label = this.$t('buySubmit.label')
            this.buyConfirm.label = this.$t('buyConfirm.label')
            this.sellSubmit.label = this.$t('sellSubmit.label')
            this.buyProfitLoss.label = this.$t('buyProfitLoss.label')
        },
        InitState() {
            let params = this.$route.query
            this.tradeList['tradeFrequency'].value = params.tradeFrequency
            this.tradeList['dividend'].value = Number(
                params['dividend']
            ).toFixed(2)
            this.tradeList[
                'initialInvestAmount'
            ].value = transNumToThousandMark(params['initialInvestAmount'])
            this.tradeList[
                'continueInvestAmount'
            ].value = transNumToThousandMark(params['continueInvestAmount'])
            this.tradeList['redemptionFee'].value = transNumToThousandMark(
                params['redemptionFee']
            )
            this.redeemList.lowestInvestAmount.value = transNumToThousandMark(
                params.lowestInvestAmount
            )
            this.redeemList.subscriptionFee.value = transNumToThousandMark(
                params.subscriptionFee
            )
            this.buySubmit.value = params.buySubmit
            this.buyConfirm.value = params.buyConfirm
            this.buyProfitLoss.value = params.buyProfitLoss
            this.sellSubmit.value = params.sellSubmit
            this.sellConfirm.value = params.sellConfirm
            this.sellProfitLoss.value = params.sellProfitLoss
            this.managementList.managementFee.value = transNumToThousandMark(
                params.managementFee
            )
            this.managementList.platformManagementFee.value = transNumToThousandMark(
                params.platformManagementFee
            )
        }
    },
    mounted() {
        this.InitState()
        this.InitI18nState()
    }
}
</script>
<style lang="scss" scoped>
.fund-redeem {
    margin: 10px 0 0 0;
}
.fund-management-list {
    padding: 0 10px;
    margin: 10px 0 0 0;
    background: #fff;
    .fund-management-title {
        line-height: 50px;
    }
}
</style>
