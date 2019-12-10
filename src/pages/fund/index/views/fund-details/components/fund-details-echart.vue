<template lang="pug">
.fund-details-echart
    span {{$t('fundTrade')}}
    .fund-echart-content
        .fund-echart-header(v-if="masterShow")
            .header-left  {{$t('time')}}：{{masterData.belongDay}}
            .header-right
                span.number {{Number(masterData.pointData)| sliceFixedTwo(4)}}
                p.day {{$t('nav')}}：
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
            nav: '今日净值',
            time: '日期',
            list: {
                0: { date: '1个月' },
                1: { date: '3个月' },
                2: { date: '6个月' },
                3: { date: '1年' },
                4: { date: '3年' },
                5: { date: '全部' }
            }
        },
        zhCHT: {
            fundTrade: '基金淨值走勢',
            nav: '今日淨值',
            time: '日期',
            list: {
                0: { date: '1個月' },
                1: { date: '3個月' },
                2: { date: '6個月' },
                3: { date: '1年' },
                4: { date: '3年' },
                5: { date: '全部' }
            }
        },
        en: {
            fundTrade: 'Fund NAV Performance',
            time: 'Time',
            nav: 'NAV',
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
            chartId: 'myChart',
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
            console.log(3)
            this.chart = new F2.Chart({
                id: data,
                padding: [20, 0, 33, 45],
                pixelRatio: window.devicePixelRatio
            })
            if (this.initEchartList.length === 0) return
            console.log(4)
            this.chart.source(this.initEchartList, {
                pointData: {
                    alias: '今日净值',
                    tickCount: 5,
                    formatter: function formatter(val) {
                        return Number(val).toFixed(2) + '%'
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
            // this.chart.render()
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
            console.log(2)
            let cavas = document.createElement('canvas')
            this.$refs.renderEchart.innerHTML = ''
            cavas.id = this.chartId + Math.floor(Math.random(2) * 10000000)
            this.$refs.renderEchart.appendChild(cavas)
            let canvaStyle = document.querySelector('#myChart')
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
            color: #ea3d3d;
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
