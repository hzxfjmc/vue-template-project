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
                            :stepNames="[sellSubmit.label,sellConfirm.label ,sellProfitLoss.label ]"
                            :stepTimes="[sellSubmit.value,sellConfirm.value ,sellProfitLoss.value ]")
                    p.desc.border-bottom 普通转入，可立即进行股票交易。T+1(1.20)可以买入其他基金、出金等。
                    .block__list
                        .block__list--item
                            p.label 交易频率
                            p.value 每日
                        .block__list--item
                            p.label 起投金额
                            p.value HKD 0.2499599600
                        .block__list--item
                            p.label 续投金额
                            p.value HKD 0.2499599600
                        .block__list--item
                            p.label 申购费用
                            p.value 0.43%
                hr.hr-border
                .block__tab-one.block__tab-table
                    p.title 基金节假日
                .block__table--content
                    .block__table--header
                        .left 日期
                        .right 说明
                    .block__table--container
                        .left 2020/4/30-5/2
                        .right 明说明说明说说明说明说明说明说说明说明说明说明
            van-tab(title="转出规则" :name="1")
                    .block__tab-one
                        p.title 普通转入
                        .block__step
                            FundSteps( 
                                :curStep="3"
                                :stepNames="[sellSubmit.label,sellConfirm.label ,sellProfitLoss.label ]"
                                :stepTimes="[sellSubmit.value,sellConfirm.value ,sellProfitLoss.value ]")
                        p.desc.border-bottom 普通转入，可立即进行股票交易。T+1(1.20)可以买入其他基金、出金等。
                        .block__list
                            .block__list--item
                                p.label 转出费用
                                p.value 每日
                    hr.hr-border
                    .block__tab-one
                        p.title 快速转出
                        .block__step
                            FundSteps( 
                                :curStep="3"
                                :stepNames="[sellSubmit.label,sellConfirm.label ,sellProfitLoss.label ]"
                                :stepTimes="[sellSubmit.value,sellConfirm.value ,sellProfitLoss.value ]")
                        p.desc.border-bottom 快速转出，资金立即到达证券账户。
                        .block__list
                            .block__list--item
                                p.label 转出费用
                                p.value 每日
                    hr.hr-border
                    .block__tab-one.block__tab-table
                        p.title 基金节假日
                    .block__table--content
                        .block__table--header
                            .left 日期
                            .right 说明
                        .block__table--container
                            .left 2020/4/30-5/2
                            .right 明说明说明说说明说明说明说明说说明说明说明说明
    
</template>
<script>
import { Tab, Tabs } from 'vant'
import './index.scss'
import { getFundDetail } from '@/service/finance-info-server.js'
import FundSteps from '@/biz-components/fond-steps'
export default {
    components: {
        [Tab.name]: Tab,
        [Tabs.name]: Tabs,
        FundSteps
    },
    data() {
        return {
            active: 0,
            sellSubmit: {
                label: '买入提交',
                value: '此刻'
            },
            sellConfirm: {
                label: '',
                value: ''
            },
            sellProfitLoss: {
                label: '查看盈亏',
                value: ''
            }
        }
    },
    created() {
        this.getFundDetail()
    },
    methods: {
        async getFundDetail() {
            try {
                const res = await getFundDetail({
                    displayLocation: this.$route.query.displayLocation || 3,
                    fundId: 58
                })
                console.log(res)
            } catch (e) {
                this.$toast(e.msg)
            }
        }
    }
}
</script>
<style lang="scss" scoped></style>
