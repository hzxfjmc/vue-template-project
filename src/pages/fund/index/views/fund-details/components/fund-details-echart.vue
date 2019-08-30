<template lang="pug">
.fund-details-echart
    span 基金净值走势
    .fund-echart-content
        canvas(id="myChart")
    .fund-date-list
        div.date-item(
            v-for="(item,index) of list" 
            @click="chooseMonth(item,index)"
            :class="[index == active ? 'active' :'']") {{item.date}}
</template>
<script>
import F2 from '@antv/f2'
export default {
    data() {
        return {
            active: 0,
            list: [
                { date: '1个月' },
                { date: '3个月' },
                { date: '6个月' },
                { date: '1年' },
                { date: '2年' },
                { date: '全部' }
            ],
            lists: [
                {
                    reportDateTimestamp: '2016-11-05',
                    value: 19
                },
                {
                    reportDateTimestamp: '2017-2-06',
                    value: 18
                },
                {
                    reportDateTimestamp: '2017-02-07',
                    value: 17
                },
                {
                    reportDateTimestamp: '2017-02-08',
                    value: 16
                },
                {
                    reportDateTimestamp: '2017-03-09',
                    value: 15
                },
                {
                    reportDateTimestamp: '2017-03-10',
                    value: 14
                },
                {
                    reportDateTimestamp: '2017-04-11',
                    value: 13
                },
                {
                    reportDateTimestamp: '2017-04-12',
                    value: 12
                },
                {
                    reportDateTimestamp: '2017-05-13',
                    value: 11
                },
                {
                    reportDateTimestamp: '2017-05-14',
                    value: 9
                },
                {
                    reportDateTimestamp: '2017-06-15',
                    value: 8
                },
                {
                    reportDateTimestamp: '2017-06-16',
                    value: 7
                },
                {
                    reportDateTimestamp: '2017-07-17',
                    value: 6
                },
                {
                    reportDateTimestamp: '2017-07-18',
                    value: 5
                },
                {
                    reportDateTimestamp: '2017-08-19',
                    value: 4
                },
                {
                    reportDateTimestamp: '2017-08-20',
                    value: 3
                },
                {
                    reportDateTimestamp: '2017-09-21',
                    value: 2
                },
                {
                    reportDateTimestamp: '2017-09-22',
                    value: 1
                },
                {
                    reportDateTimestamp: '2018-10-22',
                    value: 5
                }
            ]
        }
    },
    methods: {
        chooseMonth(item, index) {
            this.active = index
            this.lists.push({
                reportDateTimestamp: '2018-10-29',
                value: 5 + index
            })
            this.draw()
        },
        draw() {
            const chart = new F2.Chart({
                id: 'myChart',
                pixelRatio: window.devicePixelRatio
            })
            chart.source(this.lists, {
                reportDateTimestamp: {
                    type: 'timeCat',
                    tickCount: 6,
                    formatter: function(val) {
                        let date = new Date(val)
                        return `${date.getMonth() + 1}-${date.getDate()}`
                    }
                },
                value: {
                    alias: '涨幅',
                    tickCount: 5,
                    formatter: function(val) {
                        return val.toFixed(1)
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
                .position('reportDateTimestamp*value')
                .shape('smooth')
                .animate({
                    update: {
                        animation: 'lineUpdate'
                    }
                })
            chart.axis('reportDateTimestamp', {
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
    mounted() {
        this.draw()
    }
}
</script>
<style lang="scss" scoped>
.fund-details-echart {
    margin: 10px 0 0 0;
    height: 300px;
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
        //   display: flex;
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
