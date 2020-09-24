<template lang="pug">
.fund-details--echart
    .block__fund--echart.border-bottom
        .block__fund--item(
            :class="activeTab==1?'activeItem':''"
            @click="handlerActiveTab(1)") {{isMmf?$t('yieldInLast7d'):$t('trendCharts')}}
        .block__fund--item(
            :class="activeTab==2?'activeItem':''"
            @click="handlerActiveTab(2)") {{$t('historicalRTN')}}
        .block__fund--item(
            :class="activeTab==3?'activeItem':''"
            @click="handlerActiveTab(3)") {{isMmf?$t('tenKRTN'):$t('NAVHistory')}}
    .fund-echart-content2(v-show ="activeTab ==2")
        .block__fund--yj
            .block__list--item.fund__list--headerjy
                p.list__left {{$t('timeMore')}}
                p.list__right {{$t('nav')}}
            .block__list--item.border-bottom(
                v-for="(item,index) in timeList" 
                :key="index")
                p.list__left {{item.label}}
                p.list__right(
                    :class="stockColorType === 1 ? 'number-red' : 'number-green'"
                    v-if="item.value>0") +{{item.value|transNumToThousandMark(2)}}%
                p.list__right(
                    :class="stockColorType === 1 ? 'number-green' : 'number-red'"
                    v-else-if="item.value<0") {{item.value|transNumToThousandMark(2)}}%
                p.list__right(v-if="item.value==='--'") {{item.value}}
                p.list__right(v-if="item.value==0") {{item.value}}%
            .block__list--more(@click="toFundHistorylist")
                span {{$t('more1')}}
    .fund-echart-content2(v-show ="activeTab ==3")
        .block__fund--yj
            .block__list--item.fund__list--headerjy.fund__list--content
                p.list__left {{$t('time')}}
                p.list__content {{$t('navChg')}}
                p.list__right {{isMmf?$t('RTNDetail'):$t('dayChg')}}
            .block__list--item.border-bottom(
                v-for="(item,index) in historyList" 
                :key="index")
                p.list__left {{item.belongDay}}
                p.list__content {{item.netPrice}}
                template(v-if="isMmf")
                    p.list__right(
                        :class="stockColorType === 1 ? 'number-red' : 'number-green'"
                        v-if="item.revenue>0") +{{item.revenue}}
                    p.list__right(
                        :class="stockColorType === 1 ? 'number-green' : 'number-red'"
                        v-else-if="item.revenue<0") {{item.revenue}}
                    p.list__right(v-else) {{item.revenue}}
                template(v-else)
                    p.list__right(
                        :class="stockColorType === 1 ? 'number-red' : 'number-green'"
                        v-if="item.price>0") +{{item.price}}%
                    p.list__right(
                        :class="stockColorType === 1 ? 'number-green' : 'number-red'"
                        v-else-if="item.price<0") {{item.price}}%
                    p.list__right(v-else) {{item.price}}%
            .block__list--more(@click="toFundHistory")
                span {{$t('more1')}}
    .fund-echart-content(v-show="activeTab == 1")
        .chart-custom-legend(v-if="!isMmf" :class="!displayCategory && !displayBenchmark ? 'one-item':''")
            .legend__category.maker-1(@click="showToast(thisFundName)") 
                .legend__title {{ thisFundName }}
                .legend__value(:class="getStockClass(lengendData.thisFundPointData)") {{lengendData.thisFundPointData | filterRatio}}
            .legend__category.maker-2(v-if="displayCategory" @click="showToast(categoryName)") 
                .legend__title {{ categoryName }}
                .legend__value(:class="getStockClass(lengendData.categoryPointData)") {{lengendData.categoryPointData | filterRatio}}
            .legend__category.maker-3(v-if="displayBenchmark" @click="showToast(benchmarkName)") 
                .legend__title {{ benchmarkName }}
                .legend__value(:class="getStockClass(lengendData.benchmarkPointData)") {{lengendData.benchmarkPointData | filterRatio}}   
        .chart-header-tips(v-if="showTopTips")
            template(v-if="isMmf")
                .tips__body.mmf-tips__body
                    .header__item  
                        .item__label {{$t('time')}}：
                        .item__value {{lengendData.belongDay}}
                    .header__item
                        .item__label {{$t('yieldInLast7d')}}：
                        .item__value(
                            :class="getStockClass(mmfData.pointData)"
                        ) {{mmfData.pointData| filterRatio(4)}}
            template(v-else)
                .tips__body.notmmf-tips__body
                    .header__item 
                        .item__value {{mmfData.belongDay}}
                    .header__item
                        .item__label
                            .text.maker-1 {{thisFundName}}：
                        .item__value(
                            :class="getStockClass(lengendData.thisFundPointData )"
                        ) {{lengendData.thisFundPointData | filterRatio}}
                    .header__item(v-if="displayBenchmark")
                        .item__label
                            .text.maker-3 {{benchmarkName}}：
                        .item__value(
                            :class="getStockClass(lengendData.benchmarkPointData)"
                        ) {{lengendData.benchmarkPointData | filterRatio}}  
                    .header__item(v-if="!displayBenchmark && displayCategory")
                        .item__label
                            .text.maker-2 {{categoryName}}：
                        .item__value(
                            :class="getStockClass(lengendData.categoryPointData)"
                        ) {{lengendData.categoryPointData| filterRatio}}            
        .fund-echart-render(ref="renderEchart")
            canvas(:id="chartId")
        .fund-date-list
            div.date-item(
                v-for="(item,index) of list" 
                :key="index"
                @click="chooseMonth(item,index)"
                :class="[index == active ? 'active' :'']") {{item.date}}
</template>
<script>
import F2 from '@antv/f2'
import { transNumToThousandMark, jumpUrl } from '@/utils/tools.js'
import { getStockColorType } from '@/utils/html-utils.js'
import dayjs from 'dayjs'
import { FUND_ASSET_TYPE } from '@/pages/fund/index/map'
import { mapGetters } from 'vuex'
export default {
    i18n: {
        zhCHS: {
            fundTrade: '基金业绩走势',
            nav: '涨跌幅',
            time: '日期',
            dayChg: '日涨幅',
            timeMore: '时间区间',
            navChg: '单位净值',
            incomeRate: '涨跌幅',
            more1: '查看更多',
            yieldInLast7d: '近七日年化',
            list: {
                0: { date: '近1月' },
                1: { date: '近3月' },
                2: { date: '近6月' },
                3: { date: '近1年' },
                4: { date: '近3年' },
                9: { date: '全部' }
            },
            trendCharts: '业绩走势',
            historicalRTN: '历史业绩',
            NAVHistory: '净值历史',
            tenKRTN: '万元收益',
            RTNDetail: '收益详情'
        },
        zhCHT: {
            fundTrade: '基金業績走勢',
            incomeRate: '漲跌幅',
            timeMore: '時間區間',
            more1: '查看更多',
            dayChg: '日漲幅',
            navChg: '單位淨值',
            nav: '漲跌幅',
            time: '日期',
            yieldInLast7d: '近七日年化',
            list: {
                0: { date: '近1月' },
                1: { date: '近3月' },
                2: { date: '近6月' },
                3: { date: '近1年' },
                4: { date: '近3年' },
                9: { date: '全部' }
            },
            trendCharts: '業績走勢',
            historicalRTN: '歷史業績',
            NAVHistory: '淨值歷史',
            tenKRTN: '萬元收益',
            RTNDetail: '收益詳情'
        },
        en: {
            dayChg: 'Day%Chg',
            navChg: 'NAV',
            timeMore: 'Period',
            more1: 'More',
            incomeRate: ' Rtn(Cum)',
            fundTrade: 'Trend Charts',
            time: 'Time',
            nav: 'Chg%',
            yieldInLast7d: 'Yield in Last 7d',
            list: {
                0: { date: '1M' },
                1: { date: '3M' },
                2: { date: '6M' },
                3: { date: '1Y' },
                4: { date: '3Y' },
                9: { date: 'Max' }
            },
            trendCharts: 'Trend Charts',
            historicalRTN: 'Historical Rtn',
            NAVHistory: 'NAV History',
            tenKRTN: '10K Rtn',
            RTNDetail: 'Rtn Details'
        }
    },
    filters: {
        transNumToThousandMark,
        filterRatio(val, fixCount) {
            fixCount = fixCount || 2
            val = (val + '').indexOf('%') !== -1 ? (val + '').slice(0, -1) : val
            return Number(val) > 0
                ? `+${Number(val).toFixed(fixCount)}%`
                : `${Number(val).toFixed(fixCount)}%`
        }
    },
    props: {
        fundHeaderInfoVO: {
            type: Object,
            default: () => {}
        },
        benchmarkNameObj: {
            type: Object,
            default: () => {}
        },
        initEchartList: {
            type: Array,
            default: () => []
        },
        originChartList: {
            type: Array,
            default: () => []
        },
        step: {
            type: Number,
            default: 0
        },
        timeList: {
            type: Object,
            default: () => {}
        },
        historyList: {
            type: Array,
            default: () => {}
        },
        tabObj: {
            type: Object,
            default: () => {}
        },
        displayCategory: {
            type: Boolean,
            default: false
        },
        displayBenchmark: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            activeTab: 1,
            active: 0,
            list: {
                0: { date: '1个月', key: 1, show: false },
                1: { date: '3个月', key: 2, show: false },
                2: { date: '6个月', key: 3, show: false },
                3: { date: '1年', key: 4, show: false },
                4: { date: '3年', key: 5, show: false },
                9: { date: '全部', key: 9, show: false }
            },
            initChooseList: [],
            initList: [],
            chart: null,
            chartId: 'myChart_master',
            flag: true,
            lengendData: {
                belongDay: '',
                thisFundPointData: '',
                categoryPointData: '',
                benchmarkPointData: '',
                thisFundPointDataDefault: '',
                categoryPointDataDefault: '',
                benchmarkPointDataDefault: ''
            },
            mmfData: {},
            showTopTips: false
        }
    },
    methods: {
        showToast(msg) {
            msg && this.$toast(msg, 'center')
        },
        getStockClass(val) {
            val = (val + '').indexOf('%') !== -1 ? (val + '').slice(0, -1) : val
            return val > 0
                ? this.stockColorTypeClass.up
                : val < 0
                ? this.stockColorTypeClass.down
                : ''
        },
        toFundHistorylist() {
            let url = `${window.location.origin}/wealth/fund/index.html#/fund-historical-list?id=${this.fundHeaderInfoVO.fundId}`
            jumpUrl(3, url)
        },
        toFundHistory() {
            let url = `${window.location.origin}/wealth/fund/index.html#/fund-historical?id=${this.fundHeaderInfoVO.fundId}&assetType=${this.fundHeaderInfoVO.assetType}`
            jumpUrl(3, url)
        },
        handlerActiveTab(activeTab) {
            this.activeTab = activeTab
        },
        chooseMonth(item, index) {
            this.active = index
            this.$emit('chooseTime', item.key)
        },
        draw(data) {
            let params = {
                id: data,
                padding: [],
                pixelRatio: window.devicePixelRatio
            }
            params.padding =
                this.fundHeaderInfoVO.assetType === 4
                    ? [20, 5, 33, 52]
                    : [10, 5, 33, 45]
            this.chart = new F2.Chart(params)
            if (this.initEchartList.length === 0) return
            this.chart.source(this.initEchartList, {
                pointData: {
                    tickCount: 5,
                    formatter: val => {
                        if (this.fundHeaderInfoVO.assetType === 4) {
                            return Number(val).toFixed(4) + '%'
                        } else {
                            return Number(val).toFixed(2) + '%'
                        }
                    }
                },
                belongDay: {
                    type: 'timeCat',
                    range: [0, 1],
                    tickCount: 3,
                    formatter: function formatter(val) {
                        return dayjs(val).format('YYYY-MM-DD')
                    }
                }
            })
            this.chart.axis('pointData', {
                grid: {
                    lineWidth: 0.5,
                    lineDash: []
                },
                labelOffset: 5 // 坐标轴文本距离轴线的距离
            })
            this.chart.axis('belongDay', {
                line: null,
                labelOffset: 15, // 坐标轴文本距离轴线的距离
                label: function label(text, index, total) {
                    // 只显示每一年的第一天
                    const textCfg = {}
                    if (index === 0) {
                        textCfg.textAlign = 'left'
                    } else if (index === total - 1) {
                        textCfg.textAlign = 'right'
                    }
                    return textCfg
                }
            })
            this.chart.legend(false)
            this.chart.tooltip({
                alwaysShow: true,
                triggerOn: ['touchmove'],
                triggerOff: 'touchend', // 消失的触发行为，可自定义
                showCrosshairs: true,
                crosshairsStyle: {
                    // 配置辅助线的样式
                    stroke: '#2F79FF',
                    lineWidth: 0.3
                },
                custom: true,
                onChange: obj => {
                    const tooltipItems = obj.items
                    tooltipItems.forEach(item => {
                        if (item.name === this.thisFundName) {
                            this.lengendData.thisFundPointData = item.value
                            this.showTopTips = true
                            this.mmfData = item.origin
                            this.mmfData.belongDay = dayjs(
                                this.mmfData.belongDay
                            ).format('YYYY-MM-DD')
                            this.lengendData.belongDay = this.mmfData.belongDay
                        }
                        if (item.name === this.categoryName) {
                            this.lengendData.categoryPointData = item.value
                        }
                        if (item.name === this.benchmarkName) {
                            this.lengendData.benchmarkPointData = item.value
                        }
                    })
                },
                onHide: () => {
                    setTimeout(() => {
                        this.showTopTips = false
                        this.lengendData.thisFundPointData = this.lengendData.thisFundPointDataDefault
                        this.lengendData.categoryPointData = this.lengendData.categoryPointDataDefault
                        this.lengendData.benchmarkPointData = this.lengendData.benchmarkPointDataDefault
                    }, 500)
                }
            })
            this.chart
                .line()
                .position('belongDay*pointData')
                .size('type', type => {
                    if (type === this.thisFundName) {
                        return 1.5
                    } else {
                        return 0.8
                    }
                })
                .color('type', type => {
                    if (type === this.thisFundName) {
                        return '#2F79FF'
                    }
                    if (type === this.categoryName) {
                        return '#00BA60'
                    }
                    if (type === this.benchmarkName) {
                        return '#FFD984'
                    }
                    return '#2F79FF'
                })
                .animate({
                    update: {
                        animation: 'lineUpdate'
                    }
                })
        },
        initI18nState() {
            this.active = 0
            for (let key in this.list) {
                this.list[key].date = this.$t('list')[key].date
            }
        }
    },
    computed: {
        ...mapGetters(['stockColorTypeClass', 'lang']),
        stockColorType() {
            return +getStockColorType()
        },
        isMmf() {
            // 货币基金
            return FUND_ASSET_TYPE.MMF.value === this.fundHeaderInfoVO.assetType
        },
        benchmarkName() {
            return (
                this.benchmarkNameObj &&
                this.$t([
                    this.benchmarkNameObj.zhCn,
                    this.benchmarkNameObj.zhHk,
                    this.benchmarkNameObj.en
                ])
            )
        },
        thisFundName() {
            return this.$t(['本基金', '本基金', 'Fund'])
        },
        categoryName() {
            return this.$t(['同类平均', '同類平均', 'Category AVG'])
        }
    },
    watch: {
        initEchartList(val) {
            let cavas = document.createElement('canvas')
            this.$refs.renderEchart.innerHTML = ''
            cavas.id = this.chartId
            this.$refs.renderEchart.appendChild(cavas)
            let canvaStyle = document.querySelector(`#${this.chartId}`)
            canvaStyle.style.width = '100%'
            if (val.length === 0) return
            this.draw(this.chartId)
            this.chart.render()
        },
        originChartList(val) {
            if (val.length) {
                let {
                    thisFundPointData,
                    categoryPointData,
                    benchmarkPointData
                } = val[val.length - 1]
                thisFundPointData = thisFundPointData * 100
                categoryPointData = categoryPointData * 100
                benchmarkPointData = benchmarkPointData * 100
                this.lengendData.thisFundPointData = thisFundPointData
                this.lengendData.categoryPointData = categoryPointData
                this.lengendData.benchmarkPointData = benchmarkPointData
                this.lengendData.thisFundPointDataDefault = thisFundPointData
                this.lengendData.categoryPointDataDefault = categoryPointData
                this.lengendData.benchmarkPointDataDefault = benchmarkPointData
            } else {
                this.lengendData = this.$options.data().lengendData
            }
        }
    },
    mounted() {
        this.initI18nState()
        this.draw(this.chartId)
    }
}
</script>
<style lang="scss" scoped>
.chart-header-tips {
    background: rgba(244, 248, 255, 1);
    z-index: 99999;
    width: 100%;
    left: 0;
    top: 0;
    height: 42px;
    font-size: 12px;
    line-height: 42px;
    position: absolute;
    .tips__body {
        display: flex;
        justify-content: space-between;
        padding: 0 10px;
        .header__item {
            display: flex;
            flex: 1;
            .item__value {
                text-align: right;
            }
            &:last-child {
                justify-content: flex-end;
                .item__label {
                    .text {
                        max-width: 85px;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                }
            }
            .item__label {
                position: relative;
                .text {
                    &::before {
                        content: ' ';
                        height: 6px;
                        width: 6px;
                        border-radius: 50%;
                        position: absolute;
                        left: -8px;
                        top: 17px;
                    }
                    &.maker-1::before {
                        background-color: #2f79ff;
                    }
                    &.maker-2::before {
                        background-color: rgba(0, 186, 96, 0.4);
                    }
                    &.maker-3::before {
                        background-color: rgba(255, 191, 50, 0.6);
                    }
                }
            }
        }
    }
    .notmmf-tips__body {
        justify-content: flex-start;
    }
}
.chart-custom-legend {
    display: flex;
    font-size: 12px;
    font-weight: 400;
    justify-content: space-evenly;
    height: 42px;
    align-items: center;
    .legend__category {
        position: relative;
        display: flex;
        &::before {
            content: ' ';
            height: 6px;
            width: 6px;
            border-radius: 50%;
            position: absolute;
            left: -6px;
            top: 6px;
        }
        &.maker-1::before {
            background-color: #2f79ff;
        }
        &.maker-2::before {
            background-color: rgba(0, 186, 96, 0.4);
        }
        &.maker-3::before {
            background-color: rgba(255, 191, 50, 0.6);
        }
        .legend__title {
            padding: 0 6px;
            max-width: 70px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        .legend__value {
            padding-right: 6px;
        }
    }
}
.chart-custom-legend.one-item {
    justify-content: flex-start;
    padding-left: 10px;
}
.fund-echart-content2 {
    .block__list--more {
        width: 100%;
        // line-height: 30px;
        padding: 14px 0;
        text-align: center;
        span {
            font-size: 12px;
            color: #999999;
        }
    }
    .block__list--item {
        display: flex;
        flex-direction: row;
        line-height: 40px;
        .list__left,
        .list__right {
            font-size: 14px;
            width: 50%;
        }
        .list__left {
            padding-left: 10px;
        }
        .list__right {
            padding-right: 10px;
            text-align: right;
        }
    }
    .fund__list--content {
        .list__left,
        .list__content,
        .list__right {
            font-size: 14px;
            width: 33.33%;
        }
        .list__content {
            text-align: center;
        }
    }
    .fund__list--headerjy {
        background: rgba(47, 121, 255, 0.05);
        position: relative;
        width: 100%;
        line-height: 40px;
    }
}

.fund-echart-header {
    background: rgba(244, 248, 255, 1);
    z-index: 99999;
    padding: 0 10px;
    width: 100%;
    left: 0;
    top: 0;
    height: 40px;
    font-size: 12px;
    line-height: 40px;
    position: absolute;
    .header-left,
    .header-right {
        width: 60%;
        float: left;
    }
    .header-left {
        width: 40%;
    }
    .header-right {
        text-align: right;
        span {
            display: inline-block;
        }
        .day {
            // width: 90px;
            float: right;
        }
        .number {
            line-height: 40px;
            float: right;
        }
        .number-red {
            color: #ea3d3d;
        }
        .number-green {
            color: #04ba60;
        }
    }
}
.number-red {
    color: #ea3d3d;
}
.number-green {
    color: #04ba60;
}
.fund-details--echart {
    margin: 6px 0 0 0;
    width: 100%;
    background: $background-color;
    .number-red {
        color: #ea3d3d;
    }
    .number-green {
        color: #04ba60;
    }
    .block__fund--echart {
        display: flex;
        flex-direction: row;
        height: 40px;
        .block__fund--item {
            width: 33.33%;
            font-size: 16px;
            display: flex;
            color: #666666;
            justify-content: center;
            align-items: center;
        }
        .activeItem {
            color: #2f79ff;
            position: relative;
            &::after {
                position: absolute;
                box-sizing: border-box;
                content: ' ';
                pointer-events: none;
                right: 0;
                bottom: 0px;
                width: 20%;
                left: 40%;
                border-bottom: 4px solid #2f79ff;
                @media only screen and (min-resolution: 2dppx) {
                    // 非标准的
                    -webkit-transform: scaleY(0.5);
                    transform: scaleY(0.5);
                }
            }
        }
    }
    .block__fund--title {
        display: flex;
        flex-direction: row;
        font-size: 12px;
        width: 100%;
        span {
            display: flex;
        }
    }

    span {
        columns: 14px;
        color: $text-color;
        line-height: 20px;
    }
    .fund-echart-content {
        position: relative;
        padding: 0 10px 10px;
        #myChart {
            width: 100% !important;
        }
    }
    .fund-date-list {
        width: 100%;
        margin: 10px 0 10px 0;
        display: flex;
        justify-content: center;
        border-right: none;
        .date-item {
            border: 1px solid rgba(235, 235, 235, 1);
            border-left: none;
            width: 16.65%;
            text-align: center;
            line-height: 30px;
            height: 30px;
            font-size: 0.24rem;
            color: $text-color;
            margin: 0;
        }
        .date-item:first-child {
            border-left: 1px solid rgba(235, 235, 235, 1);
            border-top-left-radius: 2px;
            border-bottom-left-radius: 2px;
        }
        .date-item:last-child {
            // border-left: 1px solid rgba(235, 235, 235, 1);
            border-top-right-radius: 2px;
            border-bottom-right-radius: 2px;
        }
        .active {
            background: rgba(25, 25, 25, 0.03);
        }
    }
}
</style>
