<template lang="pug">
.fund-details-echart
    span {{$t('fundTrade')}}
    .fund-echart-content
        .fund-echart-header(v-if="masterShow")
            .header-left  日期：{{masterData.belongDay}}
            .header-right 
                span.number {{Number(masterData.netPrice)| sliceFixedTwo(4)}}
                p.day 今日净值： 
        .fund-echart-render(ref="renderEchart")
            canvas(:id="chartId")
    .fund-date-list
        div.date-item(
            v-for="(item,index) of list" 
            :key="index"
            v-if="item.show"
            @click="chooseMonth(item,index)"
            :class="[index == active ? 'active' :'']") {{item.date}}
</template>
<script>
import F2 from '@antv/f2'
import dayjs from 'dayjs'
export default {
    i18n: {
        zhCHS: {
            fundTrade: '基金净值走势',
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
                netPrice: '-'
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
            let arr = []
            let timer = false
            for (let item of this.initEchartList) {
                arr.push(item.netPrice)
            }
            this.chart = new F2.Chart({
                id: data,
                pixelRatio: window.devicePixelRatio
                // padding: [45, 'auto', 'auto']
            })
            this.chart.source(this.initEchartList, {
                netPrice: {
                    alias: '今日净值',
                    tickCount: 5,
                    min: Math.min.apply(null, arr) * 0.9,
                    max: Math.max.apply(null, arr) * 1.1,
                    // min: 0,
                    formatter: function formatter(val) {
                        return val.toFixed(2)
                    }
                },
                belongDay: {
                    type: 'timeCat',
                    range: [0, 1],
                    tickCount: 2,
                    formatter: function formatter(val) {
                        return dayjs(val).format('MM-DD')
                    }
                }
            })
            this.chart.axis('netPrice', {
                labelOffset: 20, // 坐标轴文本距离轴线的距离
                label: function label(text, index, total) {
                    var textCfg = {}
                    if (index === 0) {
                        textCfg.textBaseline = 'bottom'
                    } else if (index === total - 1) {
                        textCfg.textBaseline = 'top'
                    }
                    return textCfg
                }
            })
            this.chart.axis('belongDay', {
                line: null,
                labelOffset: 15 // 坐标轴文本距离轴线的距离
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
                    clearTimeout(timer) // 清除未执行的代码，重置回初始化状态
                    timer = setTimeout(() => {
                        this.masterShow = false
                    }, 3000)
                }
            })
            this.chart
                .line()
                .position('belongDay*netPrice')
                .color('#518DFE')
            this.chart.render()
        },
        initI18nState() {
            this.active = 0
            for (let key in this.list) {
                this.list[key].date = this.$t('list')[key].date
            }
        },
        tabShow() {
            for (let i = 0; i <= this.step; i++) {
                this.list[i].show = true
            }
        }
    },
    watch: {
        initEchartList() {
            let cavas = document.createElement('canvas')
            this.$refs.renderEchart.innerHTML = ''
            cavas.id = this.chartId
            this.$refs.renderEchart.appendChild(cavas)
            let canvaStyle = document.querySelector('#myChart')
            canvaStyle.style.width = '100%'
            canvaStyle.style.height = '200px'
            canvaStyle.margin = '-20px 0 0 0'
            canvaStyle.transform = 'translateX(-3%)'
            this.draw(this.chartId)
            this.chart.render()
            this.active = this.step
            this.tabShow()
        },
        $route(to, from) {
            if (from.path == '/') {
                this.active = this.step
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
.fund-echart-header {
    background: rgba(244, 248, 255, 1);
    z-index: 99999;
    padding: 0 10px;
    width: 100%;
    left: 0;
    top: 0;
    float: left;
    height: 50px;
    line-height: 50px;
    position: absolute;
    .header-left,
    .header-right {
        width: 50%;
        // line-height: 40px;
        float: left;
    }
    .header-right {
        text-align: right;
        span {
            display: inline-block;
        }
        .day {
            width: 120px;
            float: right;
        }
        .number {
            line-height: 50px;
            float: right;
        }
    }
}
.fund-details-echart {
    margin: 10px 0 0 0;
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
            height: 200px !important;
            margin: -20px 0 0 0;
            transform: translateX(-3%);
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
