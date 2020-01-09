<template lang="pug">
.fund-details--echart
    .block__fund--echart.border-bottom
        .block__fund--item(
            :class="activeTab==1?'activeItem':''"
            @click="handlerActiveTab(1)") {{$t('trendCharts')}}
        .block__fund--item(
            :class="activeTab==2?'activeItem':''"
            @click="handlerActiveTab(2)") {{$t('historicalRTN')}}
        .block__fund--item(
            :class="activeTab==3?'activeItem':''"
            @click="handlerActiveTab(3)") {{$t('NAVHistory')}}
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
                p.list__right(v-else) --
            .block__list--more(@click="toFundHistorylist")
                span {{$t('more1')}}
    .fund-echart-content2(v-show ="activeTab ==3")
        .block__fund--yj
            .block__list--item.fund__list--headerjy.fund__list--content
                p.list__left {{$t('time')}}
                p.list__content {{$t('navChg')}}
                p.list__right {{$t('dayChg')}}
            .block__list--item.border-bottom(
                v-for="(item,index) in historyList" 
                :key="index")
                p.list__left {{item.belongDay}}
                p.list__content {{item.netPrice}}
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
        .block__fund--title(v-if="fundHeaderInfoVO.assetType != 4") 
            span {{tabObj.label}}{{$t('incomeRate')}}：
            span(
                :class="stockColorType === 1 ? 'number-red' : 'number-green'"
                v-if="tabObj.value>0") +{{tabObj.value}}%
            span(
                :class="stockColorType === 1 ? 'number-green' : 'number-red'"
                v-else-if="tabObj.value<0") {{tabObj.value}}%
            span(v-else) {{tabObj.value}}%
        .fund-echart-header(v-if="masterShow")
            .header-left  {{$t('time')}}：{{masterData.belongDay}}
            .header-right
                span.number(
                    :class="stockColorType === 1 ? 'number-red' : 'number-green'"
                    v-if="masterData.pointData>0 && fundHeaderInfoVO.assetType === 4") +{{Number(masterData.pointData)| sliceFixedTwo(4)}}%
                span.number(
                    :class="stockColorType === 1 ? 'number-red' : 'number-green'"
                    v-if="masterData.pointData>0 && fundHeaderInfoVO.assetType !== 4") +{{Number(masterData.pointData)| sliceFixedTwo(2)}}%
                span.number(
                    :class="stockColorType === 1 ? 'number-green' : 'number-red'"
                    v-if="masterData.pointData<0 && fundHeaderInfoVO.assetType === 4") {{Number(masterData.pointData)| sliceFixedTwo(4)}}%
                span.number(
                    :class="stockColorType === 1 ? 'number-green' : 'number-red'"
                    v-if="masterData.pointData<0 && fundHeaderInfoVO.assetType !== 4") {{Number(masterData.pointData)| sliceFixedTwo(2)}}%
                span.number(v-if="masterData.pointData==0 && fundHeaderInfoVO.assetType === 4") {{Number(masterData.pointData)| sliceFixedTwo(4)}}%
                span.number(v-if="masterData.pointData===0 && fundHeaderInfoVO.assetType !== 4") {{Number(masterData.pointData)| sliceFixedTwo(2)}}%
                p.day {{fundHeaderInfoVO.assetType === 4 ? $t('yieldInLast7d'):$t('nav')}}：
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
export default {
    i18n: {
        zhCHS: {
            fundTrade: '基金业绩走势',
            nav: '涨跌幅',
            time: '日期',
            dayChg: '日涨幅',
            timeMore: '时间区间',
            navChg: '单位净值',
            incomeRate: '收益率',
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
            NAVHistory: '净值历史'
        },
        zhCHT: {
            fundTrade: '基金業績走勢',
            incomeRate: '收益率',
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
            NAVHistory: '淨值歷史'
        },
        en: {
            dayChg: 'Day%Chg',
            navChg: 'NAV',
            timeMore: 'Period',
            more1: 'More',
            incomeRate: ' Return',
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
                9: { date: 'All' }
            },
            trendCharts: 'Trend Charts',
            historicalRTN: 'Historical RTN',
            NAVHistory: 'NAV History'
        }
    },
    filters: {
        transNumToThousandMark: transNumToThousandMark
    },
    props: {
        fundHeaderInfoVO: {
            type: Object,
            default: () => {}
        },
        initEchartList: {
            type: Array,
            default: () => {}
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
            masterShow: false,
            masterData: {
                belongDay: '-',
                pointData: '-'
            },
            flag: true
        }
    },
    methods: {
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
                padding: [20, 0, 33, 45],
                pixelRatio: window.devicePixelRatio
            }
            params.padding =
                this.fundHeaderInfoVO.assetType === 4
                    ? [20, 0, 33, 52]
                    : [20, 0, 33, 45]
            this.chart = new F2.Chart(params)
            if (this.initEchartList.length === 0) return
            this.chart.source(this.initEchartList, {
                pointData: {
                    alias: '今日净值',
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
                    tickCount: 3,
                    formatter: function formatter(val) {
                        return dayjs(val).format('YYYY-MM-DD')
                    }
                }
            })
            this.chart.axis('pointData', {
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
            this.chart.tooltip({
                showCrosshairs: true,
                custom: true, // 自定义 tooltip 内容框
                onChange: obj => {
                    this.masterData = obj.items[0].origin
                    this.masterData.belongDay = dayjs(
                        this.masterData.belongDay
                    ).format('YYYY-MM-DD')
                    this.masterShow = true
                    this.flag = true
                },
                onHide: () => {
                    setTimeout(() => {
                        this.masterShow = false
                    }, 2000)
                }
            })
            this.chart
                .line()
                .position('belongDay*pointData')
                .color('#518DFE')
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
                console.log(this.$t('list')[key].date)
            }
            console.log(this.list)
        }
    },
    computed: {
        stockColorType() {
            return +getStockColorType()
        }
    },
    watch: {
        initEchartList() {
            let cavas = document.createElement('canvas')
            this.$refs.renderEchart.innerHTML = ''
            cavas.id = this.chartId
            this.$refs.renderEchart.appendChild(cavas)
            let canvaStyle = document.querySelector(`#${this.chartId}`)
            canvaStyle.style.width = '100%'
            this.draw(this.chartId)
            this.chart.render()
        }
    },
    mounted() {
        this.initI18nState()
        this.draw(this.chartId)
    }
}
</script>
<style lang="scss" scoped>
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
        padding: 10px;
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
