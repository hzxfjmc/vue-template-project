<template lang="pug">
.block__trade-rule
    van-tabs(
        v-model="active" 
        color="#2F79FF" 
        swipeable
        :sticky="true"
        :offset-top="0"
        :line-width="28"
        title-inactive-color="rgba(25,25,25,0.5)"
        title-active-color="#2F79FF")
            van-tab(:title="$t('C43')" :name="0")
                .block__tab-one
                    p.title {{$t('C60')}}
                    .block__step
                        FundSteps( 
                            :curStep="3"
                            :stepNames="[buySubmit.label,buyConfirm.label,buyProfitLoss.label ]"
                            :stepTimes="[buySubmit.value,buyConfirm.value,buyProfitLoss.value ]")
                    p.desc {{$t('C47')}}
                    p.desc.border-bottom.color {{$t('C48')}}
                    .block__list
                        .block__list--item
                            p.label {{$t('C49')}}
                            p.value HKD {{fundTradeInfoVO.initialInvestAmount | transNumToThousandMark}}
                        .block__list--item
                            p.label {{$t('C50')}}
                            p.value {{fundTradeInfoVO.redemptionFee | transNumToThousandMark}}%
                hr.hr-border
                .block__tab-one.block__tab-table
                    p.title {{$t('C51')}}
                .block__table--content
                    .block__table--header
                        .left {{$t('time')}}
                        .right 说明
                    .block__table--container.border-bottom(v-for="(item,index) in list")
                        .left {{item.date}}
                        .right {{item.explanation}}
            van-tab(title="转出规则" :name="1")
                    .block__tab-one
                        p.title {{$t('C18')}}
                        .block__step
                            FundSteps( 
                                :curStep="3"
                                :stepNames="[sellSubmit.label,sellConfirm.label ,sellProfitLoss.label ]"
                                :stepTimes="[sellSubmit.value,sellConfirm.value,sellProfitLoss.value ]")
                        p.desc {{$t('C53')}}
                        p.desc.border-bottom.color {{$t('C48')}}
                        .block__list
                            .block__list--item
                                p.label {{$t('C55')}}
                                p.value 0.0%
                            .block__list--item
                                p.label {{$t('C86')}}
                                p.value {{Number(fundTradeInfoVO.minTradeAmount).toFixed(2)}} HKD
                    hr.hr-border
                    .block__tab-one(v-if="fundTradeInfoVO.fastRedemptionFee != 0")
                        p.title {{$t('C19')}}
                        .block__step
                            FundSteps( 
                                :curStep="3"
                                :stepNames="[fastSellSubmit.label,'',fastSellProfitLoss.label ]"
                                :stepTimes="[fastSellSubmit.value,'' ,fastSellProfitLoss.value ]")
                        p.desc {{$t('C56')}}
                        p.desc.border-bottom.color {{$t('C48')}}
                        .block__list
                            .block__list--item
                                p.label {{$t('C55')}}
                                p.value {{(fundTradeInfoVO.fastRedemptionFee*100).toFixed(2)}}% 
                                    //- em (原{{(fundTradeInfoVO.fastRedemptionFee*100+0.5)|transNumToThousandMark}}%)
                            .block__list--item
                                p.label {{$t('C86')}}
                                p.value {{Number(fundTradeInfoVO.minFastRedemptionAmount).toFixed(2)}} HKD
                    hr.hr-border(v-if="fundTradeInfoVO.fastRedemptionFee != 0")
                    .block__tab-one.block__tab-table
                        p.title {{$t('C51')}}
                    .block__table--content
                        .block__table--header
                            .left {{$t('time')}}
                            .right 说明
                        .block__table--container.border-bottom(v-for="(item,index) in list")
                            .left {{item.date}}
                            .right {{item.explanation}}
    
</template>
<script>
import { Tab, Tabs } from 'vant'
import './index.scss'
import dayjs from 'dayjs'
import { getFundDetail, getFundHoliday } from '@/service/finance-info-server.js'
import FundSteps from '@/biz-components/fond-steps'
import { transNumToThousandMark } from '@/utils/tools.js'
import { trudeRuleNume } from './map'
export default {
    components: {
        [Tab.name]: Tab,
        [Tabs.name]: Tabs,
        FundSteps
    },
    i18n: trudeRuleNume,
    filters: {
        transNumToThousandMark(value) {
            return transNumToThousandMark(value)
        }
    },
    data() {
        return {
            active: 0,
            buySubmit: {
                label: '转入',
                value: '此刻'
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
                label: '买入提交',
                value: '此刻'
            },
            sellProfitLoss: {
                label: '查看盈亏',
                value: ''
            },
            sellConfirm: {
                label: '确认份额',
                value: ''
            },
            fastSellSubmit: {
                label: '买入提交',
                value: '此刻'
            },
            fastSellProfitLoss: {
                label: '查看盈亏',
                value: '立刻'
            },
            fundTradeInfoVO: {},
            list: []
        }
    },
    created() {
        this.getFundDetail()
        this.getFundHoliday()
    },
    methods: {
        //获取基金节假日
        async getFundHoliday() {
            try {
                const res = await getFundHoliday({
                    fundId: this.$route.query.id
                })
                this.list = res
                this.list.map(item => {
                    item.date = dayjs(item.date).format('YYYY-MM-DD')
                })
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        //获取基金详情
        async getFundDetail() {
            try {
                const { fundTradeInfoVO } = await getFundDetail({
                    displayLocation: this.$route.query.displayLocation || 3,
                    fundId: this.$route.query.id
                })
                this.fundTradeInfoVO = fundTradeInfoVO
                this.buyProfitLoss.value = this.fundTradeInfoVO.buyProfitLoss
                this.buyConfirm.value = this.fundTradeInfoVO.buyConfirm
                this.sellProfitLoss.value = this.fundTradeInfoVO.sellProfitLoss
                this.sellConfirm.value = this.fundTradeInfoVO.sellConfirm
                //多语言转换
                this.sellProfitLoss.label = this.$t('sellProfitLoss.label')
                this.sellConfirm.label = this.$t('sellConfirm.label')
                this.buySubmit.label = this.$t('buySubmit.label')
                this.buyConfirm.label = this.$t('buyConfirm.label')
                this.sellSubmit.label = this.$t('sellSubmit.label')
                this.buyProfitLoss.label = this.$t('buyProfitLoss.label')
                this.fastSellSubmit.label = this.$t('sellSubmit.label')
                this.fastSellProfitLoss.label = this.$t('sellProfitLoss.label')
            } catch (e) {
                this.$toast(e.msg)
            }
        }
    }
}
</script>
<style lang="scss" scoped></style>
