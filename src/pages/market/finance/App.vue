<template lang="pug">
    #app.finance
        van-tabs(v-model="tabIndex" color="#2f79ff" :line-width="36" :sticky="true" class="black-vant-tabs" @change="init({isforward: 0, index: $event, isall: 1})")
            van-tab(v-for="(item, index) in map" :title="item.name" :key="item.name")
                stock-info(
                    :data="list[index].data"
                    :currency.sync="list[index].currency"
                    :compare.sync="list[index].compare"
                    @change-prev="prevDate(true)"
                    @change-next="nextDate(true)"
                    :type="item.type"
                )
                .info-block
                    template(v-for="citem in item.children")
                        p.title(v-if="citem.title") {{ citem.title }}
                        ul
                            info-item(
                                v-for="item in citem.children"
                                :data="list[index].data"
                                :compare="list[index].compare"
                                :currency="list[index].currency"
                                :key="item.key"
                                :key-name="item.key"
                                :font-size="item.fontSize || undefined"
                                :is-sub-item="item.isSubItem"
                            ) {{ item.name }}
        .bottom-tabs-wrap(@touchmove.prevent)
            .bottom-tabs
                span(
                    v-for="(item, index) in ['全部', '年报', '中报', '一季报', '三季报']"
                    :class="{cue: list[tabIndex].searchType===index}"
                    @click="selectSearchType(index)"
                ) {{ item }}
</template>

<script>
import { Tab, Tabs, Toast } from 'vant'
import { getIncome, getBalance, getCashflow } from '../0-service/market'
import StockInfo from './components/stock-info'
import InfoItem from './components/info-item'
import { getUrlParam } from '../0-utils'

const tabIndex =
    {
        income: 0,
        balance: 1,
        cashflow: 2
    }[getUrlParam('type')] || 0

export default {
    name: 'App',
    data() {
        return {
            tabIndex,
            list: Array.from({ length: 3 }).map(() => ({
                data: null, // 数据
                currency: '1', // 1-本位币，2-港币，3-美元，4-人民币
                compare: 'yoy', // yoy - 同比，yoy2 - 2年复合，yoy3 - 3年复合，yoy5 - 5年复合
                searchType: 0, // 查询类型（底部tab）
                year: '', // 查询参数，年份
                quarter: '', // 查询参数，季度(1,2,3,4)
                periodtype: '' // 查询参数：财务类型(年度1,季度2,半年10)
            })),
            isTabSearched: [false, false, false], // 是否点击tab时已经搜索过
            map: [
                {
                    name: '利润表',
                    type: 'income',
                    children: [
                        {
                            children: [
                                {
                                    name: '营业收入',
                                    key: 'revenues',
                                    fontSize: 13
                                },
                                {
                                    name: '其他营业收入',
                                    key: 'other_revenues_total'
                                },
                                {
                                    name: '总营业收入',
                                    key: 'total_revenues'
                                },
                                {
                                    name: '营业成本',
                                    key: 'cost_of_revenues'
                                },
                                {
                                    name: '毛利润',
                                    key: 'gross_profit'
                                },
                                {
                                    name: '其他营业费用合计',
                                    key: 'ooe_total'
                                },
                                {
                                    name: '销售、行政及一般费用',
                                    key: 'saa_expenses',
                                    fontSize: 11,
                                    isSubItem: true
                                },
                                {
                                    name: '研发费用',
                                    key: 'rad_expenses',
                                    isSubItem: true
                                },
                                {
                                    name: '折旧及摊销',
                                    key: 'daa_total',
                                    isSubItem: true
                                },
                                {
                                    name: '其他营业费用',
                                    key: 'ooe',
                                    isSubItem: true
                                },
                                {
                                    name: '总营业支出',
                                    key: 'total_operating_expenses'
                                },
                                {
                                    name: '营业利润',
                                    key: 'operating_income'
                                },
                                {
                                    name: '净利息费用',
                                    key: 'net_interest_expenses'
                                },
                                {
                                    name: '利息费用',
                                    key: 'interest_expense',
                                    isSubItem: true
                                },
                                {
                                    name: '利息及投资收益',
                                    key: 'iai_income'
                                },
                                {
                                    name: '其他非经营性损益',
                                    key: 'other_non_oe_total'
                                },
                                {
                                    name: '非经营性项目前利润',
                                    key: 'ebt_excl_unusual_items',
                                    fontSize: 13
                                },
                                {
                                    name: '非经常项目损益',
                                    key: 'total_unusual_items'
                                },
                                {
                                    name: '并购重组费用',
                                    key: 'mar_expenses',
                                    isSubItem: true
                                },
                                {
                                    name: '商誉减值',
                                    key: 'impairment_of_goodwill',
                                    isSubItem: true
                                },
                                {
                                    name: '投资损益',
                                    key: 'gain_or_loss_on_soi',
                                    isSubItem: true
                                },
                                {
                                    name: '出售资产损益',
                                    key: 'gain_or_loss_on_soa',
                                    isSubItem: true
                                },
                                {
                                    name: '其他非经常项目',
                                    key: 'oui_total',
                                    isSubItem: true
                                },
                                {
                                    name: '除税前利润',
                                    key: 'ebt_incl_unusual_items'
                                },
                                {
                                    name: '所得税费用',
                                    key: 'income_tax_expense'
                                },
                                {
                                    name: '持续经营净利润',
                                    key: 'earnings_from_co'
                                },
                                {
                                    name: '终止经营项目收益',
                                    key: 'earning_of_do'
                                },
                                {
                                    name: '特殊项目及会计更变',
                                    key: 'ei_and_ac',
                                    fontSize: 13
                                },
                                {
                                    name: '归属于母公司的净利润',
                                    key: 'net_income_to_company',
                                    fontSize: 12
                                },
                                {
                                    name: '少数股东损益',
                                    key: 'mi_in_earnings'
                                },
                                {
                                    name: '净利润',
                                    key: 'net_income'
                                },
                                {
                                    name: '优先股股息和其他调整',
                                    key: 'pd_and_oa',
                                    fontSize: 12
                                },
                                {
                                    name: '归属于普通股东的净利润',
                                    key: 'nitc_incl_extra_items',
                                    fontSize: 11
                                }
                            ]
                        }
                    ]
                },
                {
                    name: '资产负债表',
                    type: 'balance',
                    children: [
                        {
                            title: '流动资产',
                            children: [
                                {
                                    name: '现金和短期投资总额',
                                    key: 'cash_and_short_invest',
                                    fontSize: 13
                                },
                                {
                                    name: '现金及现金等价物',
                                    key: 'cash_and_equ',
                                    isSubItem: true
                                },
                                {
                                    name: '短期投资',
                                    key: 'short_term_invest',
                                    isSubItem: true
                                },
                                {
                                    name: '交易性金融资产',
                                    key: 'tradeing_asset_secu',
                                    isSubItem: true
                                },
                                {
                                    name: '应收款项总额',
                                    key: 'total_receivalble'
                                },
                                {
                                    name: '应收账款',
                                    key: 'accounts_receivable',
                                    isSubItem: true
                                },
                                {
                                    name: '其他应收款项',
                                    key: 'other_receivable',
                                    isSubItem: true
                                },
                                {
                                    name: '应收票据',
                                    key: 'notes_receivable',
                                    isSubItem: true
                                },
                                {
                                    name: '存货',
                                    key: 'inventory'
                                },
                                {
                                    name: '预付费用',
                                    key: 'prepaid_expenses'
                                },
                                {
                                    name: '其他流动资产',
                                    key: 'other_current_assets_total'
                                },
                                {
                                    name: '流动资产总额',
                                    key: 'total_current_assets'
                                }
                            ]
                        },
                        {
                            title: '非流动资产',
                            children: [
                                {
                                    name: '物业、厂房及设备净额',
                                    key: 'net_ppe',
                                    fontSize: 12
                                },
                                {
                                    name: '物业、厂房及设备总额',
                                    key: 'gross_ppe',
                                    fontSize: 11,
                                    isSubItem: true
                                },
                                {
                                    name: '累计折旧',
                                    key: 'accumulated_depreciation',
                                    isSubItem: true
                                },
                                {
                                    name: '长期投资',
                                    key: 'long_term_investments'
                                },
                                { name: '商誉', key: 'goodwill' },
                                {
                                    name: '其他无形资产',
                                    key: 'other_intangibles'
                                },
                                {
                                    name: '其他资产',
                                    key: 'other_assets_total'
                                },
                                {
                                    name: '总资产',
                                    key: 'total_assets'
                                }
                            ]
                        },
                        {
                            title: '流动负债',
                            children: [
                                {
                                    name: '应付账款',
                                    key: 'accounts_payable'
                                },
                                {
                                    name: '短期借贷',
                                    key: 'short_term_borrowings'
                                },
                                {
                                    name: '应计费用',
                                    key: 'accrued_expenses'
                                },
                                {
                                    name: '长期债务当期到期部分',
                                    key: 'long_term_debt_or_capital_leases',
                                    fontSize: 12
                                },
                                {
                                    name: '其他流动负债',
                                    key: 'other_current_liabilities_total'
                                },
                                {
                                    name: '流动负债总额',
                                    key: 'total_current_liabilities'
                                }
                            ]
                        },
                        {
                            title: '非流动负债',
                            children: [
                                {
                                    name: '长期债务',
                                    key: 'long_term_debt'
                                },
                                {
                                    name: '资本租赁',
                                    key: 'capital_leases'
                                },
                                {
                                    name: '其他负债总额',
                                    key: 'other_liabilities_total'
                                },
                                {
                                    name: '总负债',
                                    key: 'total_liabilities'
                                }
                            ]
                        },
                        {
                            title: '股东权益',
                            children: [
                                {
                                    name: '优先股',
                                    key: 'total_preferred_equity'
                                },
                                {
                                    name: '普通股和资本公积金',
                                    key: 'common_stock_apic',
                                    fontSize: 13
                                },
                                {
                                    name: '留存收益',
                                    key: 'retained_earnings'
                                },
                                {
                                    name: '库存股票及其他',
                                    key: 'treasury_stock_other'
                                },
                                {
                                    name: '总普通股东权益',
                                    key: 'total_common_equity'
                                },
                                {
                                    name: '少数股东权益',
                                    key: 'minority_interest'
                                },
                                {
                                    name: '股东权益总额',
                                    key: 'total_equity'
                                },
                                {
                                    name: '总负债及权益总额',
                                    key: 'total_liabilities_and_equity'
                                }
                            ]
                        }
                    ]
                },
                {
                    name: '现金流量表',
                    type: 'cashflow',
                    children: [
                        {
                            title: '净利润调整为经营活动现金流量',
                            children: [
                                {
                                    name: '净利润',
                                    key: 'net_income'
                                },
                                {
                                    name: '折旧及摊销',
                                    key: 'dda_total'
                                },
                                {
                                    name: '其他摊销',
                                    key: 'other_amortization'
                                },
                                {
                                    name: '其他非现金项目总计',
                                    key: 'onci_total',
                                    fontSize: 13
                                },
                                {
                                    name: '经营净资产的变化',
                                    key: 'change_in_noa'
                                },
                                {
                                    name: '经营活动现金流量净额',
                                    key: 'cash_from_operations',
                                    fontSize: 12
                                }
                            ]
                        },
                        {
                            title: '投资活动现金流量',
                            children: [
                                {
                                    name: '资本支出',
                                    key: 'capital_expenditure'
                                },
                                {
                                    name: '出售物业、厂房和设备',
                                    key: 'sale_of_ppae',
                                    fontSize: 12
                                },
                                {
                                    name: '现金收购',
                                    key: 'cash_acquisitions'
                                },
                                {
                                    name: '资产剥离',
                                    key: 'divestitures'
                                },
                                {
                                    name: '其他投资活动',
                                    key: 'oia_total'
                                },
                                {
                                    name: '投资活动现金流量净额',
                                    key: 'cash_from_investing',
                                    fontSize: 12
                                }
                            ]
                        },
                        {
                            title: '融资活动现金流量',
                            children: [
                                {
                                    name: '已发行债务总额',
                                    key: 'total_debet_issued'
                                },
                                {
                                    name: '已发行短期债务',
                                    key: 'short_term_debt_issued'
                                },
                                {
                                    name: '已发行长期债务',
                                    key: 'long_term_debt_issued'
                                },
                                {
                                    name: '已偿还债务总额',
                                    key: 'total_debet_repaid'
                                },
                                {
                                    name: '已偿还短期债务',
                                    key: 'short_term_debt_repaid',
                                    isSubItem: true
                                },
                                {
                                    name: '已偿还长期债务',
                                    key: 'long_term_debt_repaid',
                                    isSubItem: true
                                },
                                {
                                    name: '发行普通股',
                                    key: 'issuance_of_cs'
                                },
                                {
                                    name: '回购普通股',
                                    key: 'repurchase_of_cs'
                                },
                                {
                                    name: '发行优先股',
                                    key: 'issuance_of_ps'
                                },
                                {
                                    name: '回购优先股',
                                    key: 'repurchase_of_ps'
                                },
                                {
                                    name: '分红总额',
                                    key: 'total_dividends_paid'
                                },
                                {
                                    name: '其他融资活动合计',
                                    key: 'ofa_total'
                                },
                                {
                                    name: '融资活动现金流量',
                                    key: 'cash_from_financing'
                                }
                            ]
                        },
                        {
                            title: '净现金流量',
                            children: [
                                {
                                    name: '外汇汇率调整',
                                    key: 'fer_adjustments'
                                },
                                {
                                    name: '其他现金流量的调整',
                                    key: 'mcf_adjustments',
                                    fontSize: 13
                                },
                                {
                                    name: '现金净流量',
                                    key: 'net_change_in_cash'
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    },
    mounted() {
        // document.documentElement.addEventListener('touchmove', function(e) {
        //     e.preventDefault()
        // })
        this.init({
            isforward: 0,
            index: 0,
            isall: 1
        })
    },
    methods: {
        async init(options = {}) {
            options.isforward = options.isforward || 0
            // 优化tab切换时的搜索
            if (this.isTabSearched[options.index]) {
                return
            }
            if (typeof index === 'number') {
                this.$set(this.isTabSearched, options.index, true)
            }

            // 数据加载异常时，需要回退日期
            const backDate = options => {
                if (options.changeDate) {
                    options.isforward
                        ? this.nextDate(false)
                        : this.prevDate(false)
                }
            }

            // 请求接口
            try {
                const data = await [getIncome, getBalance, getCashflow][
                    this.tabIndex
                ]({
                    stock: getUrlParam('symbol'),
                    year: options.notYear
                        ? null
                        : this.list[this.tabIndex].year,
                    quarter: this.list[this.tabIndex].quarter,
                    periodtype: this.list[this.tabIndex].periodtype,
                    isall: options.isall ? 1 : 0,
                    isforward: options.isforward
                })
                if (!data) {
                    Toast('暂无更多数据')
                    backDate(options)
                    return
                }
                this.$set(this.list[this.tabIndex], 'data', data)
                // 更新查询数据
                this.setDate(
                    data.list.fiscal_year,
                    data.list.fiscal_quarter,
                    data.list.period_type_id
                )
                // 更新底部选中tab
                if (typeof options.bottomIndex === 'number') {
                    this.$set(
                        this.list[this.tabIndex],
                        'searchType',
                        options.bottomIndex
                    )
                }
            } catch (e) {
                backDate(options)
                if (e.code === 810406) {
                    Toast('暂无更多数据')
                } else if (e.code === 810407) {
                    Toast('暂无财报数据')
                } else {
                    Toast(e.msg || '服务器开小差了')
                }
            }
        },
        // 设置查询日期数据
        setDate(year, quarter, periodtype) {
            if (year !== null) this.$set(this.list[this.tabIndex], 'year', year)
            if (quarter !== null)
                this.$set(this.list[this.tabIndex], 'quarter', quarter)
            if (periodtype !== null)
                this.$set(this.list[this.tabIndex], 'periodtype', periodtype)
        },
        // 选择季度
        async selectSearchType(bottomIndex) {
            const updateData = () => {
                this.init({
                    isforward: 0,
                    index: null,
                    notYear: true,
                    bottomIndex
                })
            }
            switch (bottomIndex) {
                // 全部
                case 0:
                    this.setDate(
                        null,
                        this.list[this.tabIndex].data.list.fiscal_quarter,
                        this.list[this.tabIndex].data.list.period_type_id
                    )
                    this.$set(
                        this.list[this.tabIndex],
                        'searchType',
                        bottomIndex
                    )
                    break
                // 年报
                case 1:
                    this.setDate(null, 4, 1)
                    updateData()
                    break
                // 中报
                case 2:
                    this.setDate(null, 2, 10)
                    updateData()
                    break
                // 一季报
                case 3:
                    this.setDate(null, 1, 2)
                    updateData()
                    break
                // 三季报
                case 4:
                    this.setDate(null, 3, 2)
                    updateData()
                    break
            }
        },
        // 日期切换
        prevDate(loadData = true) {
            if (this.list[this.tabIndex].searchType === 0) {
                switch (this.list[this.tabIndex].quarter) {
                    case 1:
                        this.setDate(this.list[this.tabIndex].year - 1, 4, 1)
                        break
                    case 2:
                        this.setDate(null, 1, 2)
                        break
                    case 3:
                        this.setDate(null, 2, 10)
                        break
                    case 4:
                        this.setDate(null, 3, 2)
                        break
                }
            } else {
                this.setDate(this.list[this.tabIndex].year - 1, null, null)
            }
            if (loadData) {
                this.init({
                    isforward: 1,
                    changeDate: true
                })
            }
        },
        // 日期切换
        nextDate(loadData = true) {
            if (this.list[this.tabIndex].searchType === 0) {
                switch (this.list[this.tabIndex].quarter) {
                    case 1:
                        this.setDate(null, 2, 10)
                        break
                    case 2:
                        this.setDate(null, 3, 2)
                        break
                    case 3:
                        this.setDate(null, 4, 1)
                        break
                    case 4:
                        this.setDate(this.list[this.tabIndex].year + 1, 1, 2)
                        break
                }
            } else {
                this.setDate(this.list[this.tabIndex].year + 1, null, null)
            }
            if (loadData) {
                this.init({
                    isforward: 0,
                    changeDate: true
                })
            }
        }
    },
    filters: {
        formatRate(data, typeKey, key) {
            return data ? (data[typeKey][key] * 100).toFixed(2) + '%' : ''
        },
        formatSum(data, key) {
            if (data) {
                if (Math.abs(data.list[key]) > 100) {
                    return (Math.floor(data.list[key]) / 100).toFixed(2) + '亿'
                } else if (Math.abs(data.list[key]) < 0.01) {
                    return (data.list[key] * 10e6).toFixed(2) + '元'
                } else {
                    return (data.list[key] * 100).toFixed(2) + '万'
                }
            } else {
                return ''
            }
        }
    },
    components: {
        [Tab.name]: Tab,
        [Tabs.name]: Tabs,
        StockInfo,
        InfoItem
    }
}
</script>

<style lang="scss">
html,
body {
    background: #0b121f;
}
#app {
    color: #9fb0ca;
    background: #0b121f;
    height: auto;
}

/* 重置顶部vant-tabs样式 */
.black-vant-tabs {
    .van-tabs__content {
        padding-bottom: 40px;
    }
    .van-tab {
        color: #9fb0ca;
        background: #0b121f;
        line-height: 38px;
        &.van-tab--active {
            color: #2f79ff;
        }
    }
    .van-hairline--top-bottom::after {
        border-color: #070b14;
    }
    .van-tabs__nav {
        background: #0b121f;
    }
    &.van-tabs--line {
        padding-top: 38px;
        .van-tabs__wrap {
            height: 38px;
        }
    }
}

/*重置底部vant-tabs样式*/
.bottom-tabs-wrap {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 3px;
    .bottom-tabs {
        margin: 0 13px;
        display: flex;
        justify-content: space-between;
        border: 1px solid #39424f;
        border-radius: 4px;
        color: #9fb0ca;
        line-height: 20px;
        overflow: hidden;
        span {
            width: 20%;
            padding: 5px 0;
            text-align: center;
            background: #0b121f;
            + span {
                border-left: 1px solid #39424f;
            }
            &.cue {
                color: #ebebeb;
                background: #1f2631;
            }
        }
    }
}

.finance {
    .info-block {
        padding: 0 14px;
        font-size: 14px;
        line-height: 20px;
        .title {
            position: relative;
            color: #fff;
            padding-left: 9px;
            &:before {
                content: '';
                position: absolute;
                top: 50%;
                margin-top: -6.5px;
                left: -1px;
                width: 2px;
                height: 13px;
                background-color: #2f79ff;
            }
        }
        ul {
            margin: 8px 0 20px;
        }
        li {
            display: flex;
            justify-content: space-between;
            span {
                display: inline-block;
                &.name {
                    width: 43%;
                }
                &.rate {
                    width: 15%;
                    margin-left: 2%;
                }
                &.value {
                    width: 40%;
                    text-align: right;
                }
            }
            &.sub {
                span.name {
                    color: #58687f;
                    padding-left: 10px;
                }
            }
            + li {
                margin-top: 8px;
            }
        }
    }
}
</style>
