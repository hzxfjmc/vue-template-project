<template lang="pug">
.block__trade-rule
    .block__tab
        van-tabs(
            v-model="active" 
            color="#2F79FF" 
            swipeable
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
                    .block__tab-one
                        p.title 基金节假日
                van-tab(title="转出规则" :name="1")
                    span 2
    
</template>
<script>
import { Tab, Tabs } from 'vant'
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
    }
}
</script>
<style lang="scss" scoped>
.block__tab {
    background: #fff;
}
.block__tab-one {
    margin: 0 12px;
    .title {
        font-size: 16px;
        font-weight: 500;
        margin: 14px 0 0 0;
        line-height: 22px;
    }
    .desc {
        padding: 14px 0;
    }
    .block__step {
        width: 355px;
        // height: 104px;
        margin: 10px 0 0 0;
        background: rgba(47, 121, 255, 0.05);
        border-radius: 4px;
    }
    .fund-steps {
        padding: 10px 14px;
    }
}
.block__list {
    display: flex;
    flex-direction: column;
    .block__list--item {
        display: flex;
        margin: 14px 0 0 0;
        flex-direction: row;
        justify-content: space-between;
        .label {
            color: $text-color6;
        }
    }
}
.hr-border {
    margin: 20px 0;
    height: 10px;
    background: rgba(25, 25, 25, 0.05);
    border: none;
}
</style>
