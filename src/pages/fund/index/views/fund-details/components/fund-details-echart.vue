<template lang="pug">
.fund-details-echart
    span {{$t('fundTrade')}}
    .fund-echart-content
        canvas(id="myChart")
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
                one: { date: '1个月' },
                two: { date: '3个月' },
                three: { date: '6个月' },
                four: { date: '1年' },
                five: { date: '3年' },
                all: { date: '全部' }
            }
        },
        zhCHT: {
            fundTrade: '基金淨值走勢',
            list: {
                one: { date: '1個月' },
                two: { date: '3個月' },
                three: { date: '6個月' },
                four: { date: '1年' },
                five: { date: '3年' },
                all: { date: '全部' }
            }
        },
        en: {
            fundTrade: 'Fund NAV Performance',
            list: {
                one: { date: '1 Month' },
                two: { date: '3 Months' },
                three: { date: '6 Months' },
                four: { date: '1 Year' },
                five: { date: '3 Years' },
                all: { date: 'All' }
            }
        }
    },
    props: {
        initEchartList: {
            type: Array,
            default: () => {}
        }
    },
    data() {
        return {
            active: 'one',
            list: {
                one: { date: '1个月', key: 1, show: false },
                two: { date: '3个月', key: 2, show: false },
                three: { date: '6个月', key: 3, show: false },
                four: { date: '1年', key: 4, show: false },
                five: { date: '3年', key: 5, show: false },
                all: { date: '全部', key: 6, show: false }
            }
        }
    },
    methods: {
        chooseMonth(item, index) {
            this.active = index
            this.$emit('chooseTime', item.key)
        },
        draw() {
            let arr = []
            for (let item of this.initEchartList) {
                arr.push(item.netPrice)
            }
            let chart = new F2.Chart({
                id: 'myChart',
                pixelRatio: window.devicePixelRatio,
                padding: [45, 'auto', 'auto']
            })
            chart.source(this.initEchartList, {
                netPrice: {
                    alias: '今日净值',
                    tickCount: 5,
                    min: Math.min.apply(null, arr) * 0.9,
                    max: Math.max.apply(null, arr) * 1.1,
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
            chart.axis('netPrice', {
                labelOffset: 20 // 坐标轴文本距离轴线的距离
            })
            chart.axis('belongDay', {
                line: null,
                labelOffset: 15 // 坐标轴文本距离轴线的距离
            })
            chart.tooltip({
                alwaysShow: false,
                triggerOn: ['touchstart'], // tooltip 出现的触发行为，可自定义，用法同 legend 的 triggerOn
                triggerOff: ['touchmove', 'touchend'] // 消失的触发行为，可自定义
            })
            // chart.tooltip(false)
            chart
                .line()
                .position('belongDay*netPrice')
                .color('#518DFE')
            chart.render()
        },
        initI18nState() {
            this.active = 'one'
            for (let key in this.list) {
                this.list[key].date = this.$t('list')[key].date
            }
        },
        tabShow() {
            for (let key in this.list) {
                this.list[key].show = false
            }
            let point = this.initEchartList.length
            if (point >= 0 && point <= 22) {
                this.list.one.show = true
            } else if (point > 22 && point <= 66) {
                this.list.one.show = true
                this.list.two.show = true
            } else if (point > 66 && point <= 132) {
                this.list.one.show = true
                this.list.two.show = true
                this.list.three.show = true
            } else if (point > 132 && point <= 245) {
                this.list.one.show = true
                this.list.two.show = true
                this.list.three.show = true
                this.list.four.show = true
            } else {
                for (let key in this.list) {
                    this.list[key].show = true
                }
            }
        }
    },
    watch: {
        initEchartList() {
            this.draw()
            this.tabShow()
        },
        $route(to, from) {
            if (from.path == '/') {
                this.active = 'one'
            }
        }
    },
    mounted() {
        this.initI18nState()
        this.draw()
    }
}
</script>
<style lang="scss" scoped>
.fund-details-echart {
    margin: 10px 0 0 0;
    width: 100%;
    float: left;
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
            // transform: scale(1.09);
        }
    }
    .fund-date-list {
        width: 100%;
        margin: 0 0 10px 0;
        // border: 1px solid rgba(235, 235, 235, 1);
        border-right: none;
        .date-item {
            border-right: 1px solid rgba(235, 235, 235, 1);
            // display: inline-block;
            width: 16.65%;
            text-align: center;
            line-height: 30px;
            height: 30px;
            border-radius: 2px;
            font-size: 0.24rem;
            color: $text-color;
            margin: auto;
        }
        .active {
            background: rgba(25, 25, 25, 0.03);
        }
    }
}
</style>
