<template lang="pug">
.tarde-rule
    FundListItem(
        :title="$t('tradeTitle')"
        :cellList="tradeList"
        :currency = "currency"
        :subtitle="$t('tradeSubTitle')")
        FundSteps(
            slot="fundStep"
            style="margin-top: -5px;"
            :title="$t('balanceRule')"
            :curStep="3"
            :stepNames="[buySubmit.label,buyConfirm.label ,buyProfitLoss.label ]"
            :stepTimes="[buySubmit.value,buyConfirm.value ,buyProfitLoss.value ]")
    .fund-redeem
        FundListItem(
            slot="fundStep"
            :title="$t('redeemTitle')"
            :currency="currency"
            :cellList="redeemList"
            :subtitle="$t('redeemSubtitle')")
            FundSteps(
                slot="fundStep"
                style="margin-top: -5px;"
                :title="$t('balanceRule')"
                :curStep="3"
                :stepNames="[sellSubmit.label,sellConfirm.label ,sellProfitLoss.label ]"
                :stepTimes="[sellSubmit.value,sellConfirm.value ,sellProfitLoss.value ]")

    
    .fund-management-list
        h3.fund-management-title(class="border-bottom") {{$t('managermentLabel')}}
        FunCell(:cellList="managementList")
</template>
<script>
import FundListItem from './components/fund-list-item'
import FunCell from './components/common/fund-cell'

import { transNumToThousandMark } from '@/utils/tools.js'
// import FundStep from './components/common/fund-step'
import FundSteps from '@/biz-components/fond-steps'
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
        FundSteps
    },
    data() {
        return {
            tradeList: tradeList,
            redeemList: redeemList,
            currency: '',
            tradeSubTitle: '423432423',
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
            this.currency = params.currency
            console.log(params)
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
            this.managementList.managementFee.value = `${transNumToThousandMark(
                params.managementFee
            ) * 100}%`
            this.managementList.platformManagementFee.value = `${transNumToThousandMark(
                params.platformManagementFee
            ) * 100}%`
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
