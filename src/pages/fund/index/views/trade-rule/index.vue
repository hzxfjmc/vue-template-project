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
import { getFundDetail } from '@/service/finance-info-server.js'
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
        async InitState() {
            try {
                const { fundTradeInfoVO } = await getFundDetail({
                    displayLocation: 1,
                    fundId: this.$route.query.id
                })
                this.currency = fundTradeInfoVO.currency.name

                // this.tradeList['tradeFrequency'].value =
                //     fundTradeInfoVO.tradeFrequency.name
                this.tradeList['dividend'].value = Number(
                    fundTradeInfoVO['dividend']
                ).toFixed(2)
                this.tradeList['tradeFrequencyName'].value =
                    fundTradeInfoVO.tradeFrequencyName
                this.tradeList[
                    'initialInvestAmount'
                ].value = transNumToThousandMark(
                    fundTradeInfoVO['initialInvestAmount']
                )
                this.tradeList[
                    'continueInvestAmount'
                ].value = transNumToThousandMark(
                    fundTradeInfoVO['continueInvestAmount']
                )
                this.tradeList[
                    'redemptionFee'
                ].value = `${transNumToThousandMark(
                    fundTradeInfoVO['redemptionFee']
                ) * 100}%`
                this.redeemList.lowestInvestAmount.value = transNumToThousandMark(
                    fundTradeInfoVO.lowestInvestAmount
                )
                this.redeemList.subscriptionFee.value = `${transNumToThousandMark(
                    fundTradeInfoVO.subscriptionFee
                ) * 100}%`
                this.buySubmit.value = fundTradeInfoVO.buySubmit
                this.buyConfirm.value = fundTradeInfoVO.buyConfirm
                this.buyProfitLoss.value = fundTradeInfoVO.buyProfitLoss
                this.sellSubmit.value = fundTradeInfoVO.sellSubmit
                this.sellConfirm.value = fundTradeInfoVO.sellConfirm
                this.sellProfitLoss.value = fundTradeInfoVO.sellProfitLoss
                this.managementList.managementFee.value = `${Number(
                    fundTradeInfoVO.managementFee
                ).toFixed(4) * 100}%`
                this.managementList.platformManagementFee.value = `${Number(
                    fundTradeInfoVO.platformManagementFee
                ).toFixed(4) * 100}%`
            } catch (e) {
                console.log('getFundDetail:error:>>>', e)
            }
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
