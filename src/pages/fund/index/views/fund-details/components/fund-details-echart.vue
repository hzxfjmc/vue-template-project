<template lang="pug">
.fund-details-echart
    span {{$t('fundTrade')}}
    .fund-echart-content
        .fund-echart-header(v-if="masterShow")
            .header-left  {{$t('time')}}：{{masterData.belongDay}}
            .header-right
                span.number.number-red(v-if="masterData.pointData>0 && fundHeaderInfoVO.assetType === 4") +{{Number(masterData.pointData)| sliceFixedTwo(4)}}%
                span.number.number-red(v-if="masterData.pointData>0 && fundHeaderInfoVO.assetType !== 4") +{{Number(masterData.pointData)| sliceFixedTwo(2)}}%
                span.number.number-green(v-if="masterData.pointData<0 && fundHeaderInfoVO.assetType === 4") {{Number(masterData.pointData)| sliceFixedTwo(4)}}%
                span.number.number-green(v-if="masterData.pointData<0 && fundHeaderInfoVO.assetType !== 4") {{Number(masterData.pointData)| sliceFixedTwo(2)}}%
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
import dayjs from 'dayjs'
export default {
    i18n: {
        zhCHS: {
            fundTrade: '基金业绩走势',
            nav: '涨幅',
            time: '日期',
            yieldInLast7d: '近七日年化',
            list: {
                0: { date: '近1月' },
                1: { date: '近3月' },
                2: { date: '近6月' },
                3: { date: '近1年' },
                4: { date: '近3年' },
                5: { date: '全部' }
            }
        },
        zhCHT: {
            fundTrade: '基金業績走勢',
            nav: '漲幅',
            time: '日期',
            yieldInLast7d: '近七日年化',
            list: {
                0: { date: '近1月' },
                1: { date: '近3月' },
                2: { date: '近6月' },
                3: { date: '近1年' },
                4: { date: '近3年' },
                5: { date: '全部' }
            }
        },
        en: {
            fundTrade: 'Trend Charts',
            time: 'Time',
            nav: 'Chg%',
            yieldInLast7d: 'Yield in Last 7d',
            list: {
                0: { date: '1 Month' },
                1: { date: '3 Months' },
                2: { date: '6 Months' },
                3: { date: '1 Year' },
                4: { date: '3 Years' },
                5: { date: 'All' }
            }
        }
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
        }
    },
    data() {
        return {
            active: 0,
            list: {
                0: { date: '1个月', key: 1, show: false },
                1: { date: '3个月', key: 2, show: false },
                2: { date: '6个月', key: 3, show: false },
                3: { date: '1年', key: 4, show: false },
                4: { date: '3年', key: 5, show: false },
                5: { date: '全部', key: 6, show: false }
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
            }
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
.fund-echart-header {
    background: rgba(244, 248, 255, 1);
    z-index: 99999;
    padding: 0 10px;
    width: 100%;
    left: 0;
    top: 0;
    float: left;
    height: 40px;
    font-size: 12px;
    line-height: 40px;
    position: absolute;
    .header-left,
    .header-right {
        width: 50%;
        float: left;
    }
    .header-right {
        text-align: right;
        span {
            display: inline-block;
        }
        .day {
            width: 90px;
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
.fund-details-echart {
    margin: 6px 0 0 0;
    width: 100%;
    float: left;
    position: relative;
    padding: 10px;
    background: $background-color;
    span {
        columns: 14px;
        color: $text-color;
        line-height: 20px;
    }
    .fund-echart-content {
        #myChart {
            width: 100% !important;
        }
    }
    .fund-date-list {
        width: 100%;
        margin: 0 0 10px 0;
        display: flex;
        justify-content: center;
        border-right: none;
        .date-item {
            border: 1px solid rgba(235, 235, 235, 1);
            border-left: none;
            // display: inline-block;
            width: 16.65%;
            text-align: center;
            line-height: 30px;
            height: 30px;
            // border-radius: 2px;
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
