<template lang="pug">
.fund-details-echart
    span {{$t('fundTrade')}}
    .fund-echart-content
        canvas(id="myChart")
    .fund-date-list
        div.date-item(
            v-for="(item,index) of list" 
            :key="index"
            @click="chooseMonth(item,index)"
            :class="[index == active ? 'active' :'']") {{item.date}}
</template>
<script>
import F2 from '@antv/f2'
export default {
    i18n: {
        zhCHS: {
            fundTrade: '基金净值走势',
            list: {
                one: { date: '1个月' },
                two: { date: '3个月' },
                three: { date: '6个月' },
                four: { date: '1年' },
                five: { date: '2年' },
                all: { date: '全部' }
            }
        },
        zhCHT: {
            fundTrade: '基金净值走势',
            list: {
                one: { date: '1个月' },
                two: { date: '3个月' },
                three: { date: '6个月' },
                four: { date: '1年' },
                five: { date: '2年' },
                all: { date: '全部' }
            }
        },
        en: {
            fundTrade: '基金净值走势',
            list: {
                one: { date: '1个月1' },
                two: { date: '3个月2' },
                three: { date: '6个月2' },
                four: { date: '1年' },
                five: { date: '2年' },
                all: { date: '全部' }
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
            active: 0,
            list: {
                one: { date: '1个月', key: 1 },
                two: { date: '3个月', key: 2 },
                three: { date: '6个月', key: 3 },
                four: { date: '1年', key: 4 },
                five: { date: '2年', key: 5 },
                all: { date: '全部', key: 6 }
            }
        }
    },
    methods: {
        chooseMonth(item, index) {
            this.active = index
            this.$emit('chooseTime', item.key)
        },
        draw() {
            const chart = new F2.Chart({
                id: 'myChart',
                pixelRatio: window.devicePixelRatio
            })
            chart.source(this.initEchartList, {
                belongDay: {
                    type: 'timeCat',
                    tickCount: 6,
                    formatter: function(val) {
                        let date = new Date(val)
                        return `${date.getMonth() + 1}-${date.getDate()}`
                    }
                },
                netPrice: {
                    alias: '涨幅',
                    tickCount: 5,
                    formatter: function(val) {
                        return `${Number(val).toFixed(2)}%`
                    }
                }
            })
            chart.tooltip({
                showCrosshairs: true
            })
            chart
                .line({
                    sortable: false
                })
                .position('belongDay*netPrice')
                .shape('smooth')
                .animate({
                    update: {
                        animation: 'lineUpdate'
                    }
                })
            chart.axis('belongDay', {
                line: {
                    lineWidth: 1,
                    stroke: 'rgba(0,0,0,0)',
                    top: true // 展示在最上层
                },
                label: function label(text, index, total) {
                    var cfg = {
                        textAlign: 'center'
                    }
                    // 第一个点左对齐，最后一个点右对齐，其余居中，只有一个点时左对齐
                    if (index === 0) {
                        cfg.textAlign = 'start'
                    }
                    if (index > 0 && index === total - 1) {
                        cfg.textAlign = 'end'
                    }
                    return cfg
                }
            })
            chart.render()
        }
    },
    watch: {
        initEchartList() {
            this.draw()
        }
    },
    mounted() {
        this.list = this.$t('list')
        this.draw()
    }
}
</script>
<style lang="scss" scoped>
.fund-details-echart {
    margin: 10px 0 0 0;
    // height: 300px;
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
            transform: translateX(-3%);
            transform: scale(1.09);
        }
    }
    .fund-date-list {
        width: 100%;
        margin: 10px 0;
        border: 1px solid rgba(235, 235, 235, 1);
        border-right: none;
        .date-item {
            border-right: 1px solid rgba(235, 235, 235, 1);
            display: inline-block;
            width: 16.65%;
            text-align: center;
            line-height: 30px;
            height: 30px;
            border-radius: 2px;
            font-size: 0.24rem;
            color: $text-color;
        }
        .active {
            background: rgba(25, 25, 25, 0.03);
        }
    }
}
</style>
