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
            van-tab(title="转入规则" :name="0")
                .block__tab-one
                    p.title 普通转入
                    .block__step
                        FundSteps( 
                            :curStep="3"
                            :stepNames="[buySubmit.label,'',buyProfitLoss.label ]"
                            :stepTimes="[buySubmit.value,'',buyProfitLoss.value ]")
                    p.desc.border-bottom 普通转入，可立即进行股票交易。T+1(1.20)可以买入其他基金、出金等。
                    .block__list
                        .block__list--item
                            p.label 交易频率
                            p.value 每日
                        .block__list--item
                            p.label 起投金额
                            p.value HKD {{fundTradeInfoVO.initialInvestAmount | transNumToThousandMark}}
                        .block__list--item
                            p.label 续投金额
                            p.value HKD {{fundTradeInfoVO.continueInvestAmount | transNumToThousandMark}}
                        .block__list--item
                            p.label 申购费用
                            p.value {{fundTradeInfoVO.redemptionFee | transNumToThousandMark}}%
                hr.hr-border
                .block__tab-one.block__tab-table
                    p.title 基金节假日
                .block__table--content
                    .block__table--header
                        .left 日期
                        .right 说明
                    .block__table--container.border-bottom(v-for="(item,index) in list")
                        .left {{item.date}}
                        .right {{item.explanation}}
            van-tab(title="转出规则" :name="1")
                    .block__tab-one
                        p.title 普通转入
                        .block__step
                            FundSteps( 
                                :curStep="3"
                                :stepNames="[sellSubmit.label,'' ,sellProfitLoss.label ]"
                                :stepTimes="[sellSubmit.value,'',sellProfitLoss.value ]")
                        p.desc.border-bottom 普通转入，可立即进行股票交易。T+1(1.20)可以买入其他基金、出金等。
                        .block__list
                            .block__list--item
                                p.label 转出费用
                                p.value 0.0%
                    hr.hr-border
                    .block__tab-one
                        p.title 快速转出
                        .block__step
                            FundSteps( 
                                :curStep="3"
                                :stepNames="[fastSellSubmit.label,'',fastSellProfitLoss.label ]"
                                :stepTimes="[fastSellSubmit.value,'' ,fastSellProfitLoss.value ]")
                        p.desc.border-bottom 快速转出，资金立即到达证券账户。
                        .block__list
                            .block__list--item
                                p.label 转出费用
                                p.value {{(fundTradeInfoVO.fastRedemptionFee*100)|transNumToThousandMark}}% 
                                    em (原{{(fundTradeInfoVO.fastRedemptionFee*100+0.5)|transNumToThousandMark}}%)
                    hr.hr-border
                    .block__tab-one.block__tab-table
                        p.title 基金节假日
                    .block__table--content
                        .block__table--header
                            .left 日期
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
export default {
    components: {
        [Tab.name]: Tab,
        [Tabs.name]: Tabs,
        FundSteps
    },
    filters: {
        transNumToThousandMark(value) {
            return transNumToThousandMark(value)
        }
    },
    data() {
        return {
            active: 0,
            buySubmit: {
                label: '买入提交',
                value: '此刻'
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
            fastSellSubmit: {
                label: '买入提交',
                value: '此刻'
            },
            fastSellProfitLoss: {
                label: '查看盈亏',
                value: '2小时内'
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
                    fundId: 58
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
                    fundId: 58
                })
                this.fundTradeInfoVO = fundTradeInfoVO
                this.buyProfitLoss.value = this.fundTradeInfoVO.buyConfirm
                this.sellProfitLoss.value = this.fundTradeInfoVO.sellProfitLoss
            } catch (e) {
                this.$toast(e.msg)
            }
        }
    }
}
</script>
<style lang="scss" scoped></style>
