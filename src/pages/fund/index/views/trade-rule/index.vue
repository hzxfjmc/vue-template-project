<template lang="pug">
.tarde-rule
    FundListItem(
        :title="code === 1 ? $t('tradeTitle') : $t('tradeTitleHk')"
        :cellList="tradeList"
        :currency = "currency"
        :subtitle="code ===1 ? $t('tradeSubTitle') : $t('tradeSubTitleHk')")
        FundSteps(
            slot="fundStep"
            style="margin-top: -5px;"
            :title="$t('balanceRule')"
            :curStep="3"
            :stepNames="[buySubmit.label,buyConfirm.label ,buyProfitLoss.label ]"
            :stepTimes="[buySubmit.value,buyConfirm.value ,buyProfitLoss.value ]")
    .fund-management-list(v-if="showPositionInfo")
        h3.fund-management-title(class="border-bottom") {{$t('tradeTitleExplain')}}
        table.trade-table(cellspacing="0" cellpadding="0")
            tr
                td {{$t('tradeMoneyLable')}}{{`（${currency}）`}}
                td {{$t('feeLable')}}
            template(v-for="item in subscribeFeeVO.fundFeeLevelVOList")
                tr(v-if="subscribeFeeVO.fundFeeLevelVOList.length && (Number(subscribeFeeVO.fundFeeLevelVOList[0].feeRate)<Number(subscribeFeeVO.defaultFeeRate))")
                    td 
                        span {{`${item.minAmount/10000}`}}{{$t('million')}}
                        span {{` ≤ ${$t('tradeDefaultPeriod')}`}}
                        span(v-if="item.maxAmount") {{` < ${item.maxAmount/10000}`}}{{$t('million')}}
                    td
                        span {{`${discountRate(item.feeRate)}（`}}
                        s {{`${subscribeFeeVO.defaultFeeRate}%`}}
                        span ） 
                tr(v-else)
                    td {{`0 ≤ ${$t('tradeDefaultPeriod')}`}}
                    td {{`${subscribeFeeVO.defaultFeeRate}%`}}  
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
    .fund-management-list
        h3.fund-management-title(class="border-bottom") {{$t('holiday')}}
        table.trade-table(cellspacing="0" cellpadding="0")
            tr
                td {{$t('time')}}
                td {{$t('Description')}}
            tr(v-for="item in holidayList")
                td {{item.date}}
                td {{item.explanation}}
</template>
<script>
import dayjs from 'dayjs'
import FundListItem from './components/fund-list-item'
import FunCell from './components/common/fund-cell'
import { transNumToThousandMark } from '@/utils/tools.js'
import { getSource } from '@/service/customer-relationship-server'
import { mapGetters } from 'vuex'
import FundSteps from '@/biz-components/fond-steps'
import {
    tradeList,
    redeemList,
    managementList,
    i18nTrudeRuleData
} from './trade-rule'
import {
    getFundDetail,
    getFundFeeConfigV1,
    getFundHoliday
} from '@/service/finance-info-server.js'
export default {
    i18n: i18nTrudeRuleData,
    components: {
        FundListItem,
        FunCell,
        FundSteps
    },
    computed: {
        ...mapGetters(['isLogin', 'appType', 'openedAccount', 'lang']),
        showPositionInfo() {
            // 登陆且已开户才展示持仓信息
            return this.isLogin && this.openedAccount
        },
        unitName() {
            return this.lang
        }
    },
    data() {
        return {
            tradeList: tradeList,
            redeemList: redeemList,
            currency: '',
            code: null,
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
            },
            subscribeFeeVO: {
                defaultFeeRate: 0,
                fundFeeLevelVOList: []
            },
            holidayList: []
        }
    },
    methods: {
        discountRate(val) {
            return `${(val * 100).toFixed(2)}%`
        },
        async getFundFeeConfig() {
            try {
                let params = {
                    fundId: this.$route.query.id
                }
                let { subscribeFeeVO, redeemFeeVO } = await getFundFeeConfigV1(
                    params
                )
                this.redeemList.redemptionFee.value =
                    redeemFeeVO.fundFeeLevelVOList.length &&
                    Number(redeemFeeVO.fundFeeLevelVOList[0].feeRate) <
                        Number(redeemFeeVO.defaultFeeRate)
                        ? `${(
                              redeemFeeVO.fundFeeLevelVOList[0].feeRate * 100
                          ).toFixed(2)}%（<s>${(
                              redeemFeeVO.defaultFeeRate * 100
                          ).toFixed(2)}%</s>）`
                        : `${redeemFeeVO.defaultFeeRate}%`
                this.subscribeFeeVO.defaultFeeRate = `${(
                    subscribeFeeVO.defaultFeeRate * 100
                ).toFixed(2)}`
                this.subscribeFeeVO.fundFeeLevelVOList =
                    subscribeFeeVO.fundFeeLevelVOList
            } catch (e) {
                console.log('getFundFeeConfigV1: ', e)
            }
        },
        InitI18nState() {
            for (let key in this.tradeList) {
                if (key != 'subscriptionFee') {
                    this.tradeList[key].label = this.$t('tradeList')[key].label
                } else {
                    this.tradeList[key].label =
                        this.code === 1
                            ? this.$t('tradeList')[key].label
                            : this.$t('tradeList')[key].labelHk
                }
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
                    displayLocation: this.$route.query.displayLocation || 1,
                    fundId: this.$route.query.id
                })

                this.currency = fundTradeInfoVO.currency.name
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

                this.tradeList['subscriptionFee'].value = `${Math.floor(
                    Number(fundTradeInfoVO['subscriptionFee'] * 10000)
                ) / 100}%`
                this.redeemList.minPositionShare.value = transNumToThousandMark(
                    fundTradeInfoVO.minPositionShare,
                    4
                )
                // this.redeemList.redemptionFee.value = `${Math.floor(
                //     Number(fundTradeInfoVO.redemptionFee * 10000)
                // ) / 100}%`
                this.buySubmit.value = fundTradeInfoVO.buySubmit
                this.buyConfirm.value = fundTradeInfoVO.buyConfirm
                this.buyProfitLoss.value = fundTradeInfoVO.buyProfitLoss
                this.sellSubmit.value = fundTradeInfoVO.sellSubmit
                this.sellConfirm.value = fundTradeInfoVO.sellConfirm
                this.sellProfitLoss.value = fundTradeInfoVO.sellProfitLoss
                this.managementList.managementFee.value = `${Math.floor(
                    Number(fundTradeInfoVO.managementFee * 10000)
                ) / 100}%`
                this.managementList.platformManagementFee.value = `${Math.floor(
                    Number(fundTradeInfoVO.platformManagementFee * 10000)
                ) / 100}%`
            } catch (e) {
                console.log('getFundDetail:error:>>>', e)
            }
        },
        //获取用户归属 1大陆 2香港
        async getSource() {
            try {
                const { code } = await getSource()
                this.code = code
                if (!this.isLogin) {
                    this.code = this.appType.Hk ? 2 : 1
                }
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        //获取基金节假日
        async getFundHoliday() {
            try {
                const res = await getFundHoliday({
                    fundId: this.$route.query.id
                })
                this.holidayList = res
                this.holidayList.map(item => {
                    item.date = dayjs(item.date).format('YYYY-MM-DD')
                })
            } catch (e) {
                this.$toast(e.msg)
            }
        }
    },
    created() {
        this.InitState()
        this.InitI18nState()
        this.getFundFeeConfig()
        this.getFundHoliday()
    }
}
</script>
<style lang="scss" scoped>
.tarde-rule {
    padding-bottom: 20px;
    .fund-redeem {
        margin: 6px 0 0 0;
    }
    .fund-management-list {
        padding: 0 10px 10px;
        margin: 6px 0 0 0;
        background: #fff;
        .fund-management-title {
            line-height: 50px;
        }
        .trade-table {
            width: 100%;
            border-collapse: collapse;
            tr:first-child {
                td {
                    color: rgba(25, 25, 25, 0.65);
                }
            }
            tr {
                td {
                    color: #191919;
                    display: table-cell;
                    border: 1px solid #191919;
                    padding: 10px 5px;
                    min-width: 0;
                    -webkit-box-sizing: border-box;
                    box-sizing: border-box;
                    text-overflow: ellipsis;
                    vertical-align: middle;
                    text-align: center;
                }
            }
        }
    }
}
</style>
