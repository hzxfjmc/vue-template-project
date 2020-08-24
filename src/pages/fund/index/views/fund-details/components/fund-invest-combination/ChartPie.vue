<template lang="pug">
    .chart-container
        canvas.canvas-pie(:id="id")
        .legend-container
            .pie-legend__item(v-for="item,index in legendItems" :key="item.name" :class="`maker-${index>=7?7:index}`")
                .item__label {{item.name}}
                .item__value {{item.value}}
</template>
<script>
import F2 from '@antv/f2'
export default {
    props: {
        id: {
            type: String,
            default: 'pie-container'
        },
        chartList: {
            type: Array,
            default: () => []
        },
        chartOptions: {
            type: Object,
            default: () => {
                return {
                    height: 220,
                    innerRadius: 0.7,
                    radius: 0.75
                }
            }
        }
    },
    data() {
        return {
            legendItems: [],
            colorList: [
                '#1D41A5',
                '#0D50D8',
                '#2F79FF',
                '#369BEE',
                '#45BDBE',
                '#54D3D4',
                '#F7B500',
                '#FFD154',
                '#FFD154',
                '#FFD154',
                '#FFD154'
            ]
        }
    },
    methods: {
        initChart() {
            const data = this.chartList
            const map = {}
            const legendItems = []
            data.forEach((obj, index) => {
                map[obj.name] = obj.percent + '%'
                legendItems.push({
                    name: obj.name,
                    value: Number(obj.percent).toFixed(2) + '%',
                    marker: {
                        symbol: 'circle',
                        fill: this.colorList[index] || '#FFD154',
                        radius: 3
                    }
                })
            })
            this.legendItems = legendItems
            console.log(this.legendItems)
            const chart = new F2.Chart({
                id: this.id,
                pixelRatio: window.devicePixelRatio,
                padding: [0, 0, 0, 0],
                appendPadding: [0, 0],
                height: this.chartOptions.height
            })
            const drawData = data.filter(item => Number(item.percent) > 0)
            chart.source(drawData, {
                percent: {
                    formatter: function formatter(val) {
                        return val + '%'
                    }
                }
            })
            chart.tooltip(false)
            chart.legend(false)
            // chart.legend({
            //     position: 'right',
            //     custom: true,
            //     items: legendItems,
            //     nameStyle: {
            //         textAlign: 'start',
            //         fill: '#191919', // 文本的颜色
            //         width: 150
            //     },
            //     joinString: '',
            //     valueStyle: {
            //         textAlign: 'end',
            //         fill: '#191919', // 文本的颜色
            //         fontSize: '14',
            //         fontWeight: '500',
            //         width: 80
            //     }
            // })
            chart.coord('polar', {
                transposed: true,
                innerRadius: 0.7,
                radius: 0.7
            })
            chart.axis(false)
            chart
                .interval()
                .position('a*percent')
                .color('name', this.colorList)
                .adjust('stack')
            chart.guide()
            chart.render()
        }
    },
    mounted() {
        this.initChart()
    }
}
</script>
<style lang="scss" scoped>
.chart-container {
    display: flex;
    align-items: center;
}
.legend-container {
    width: 50%;
    max-height: 126px;
    overflow: auto;
    background: linear-gradient(
        360deg,
        rgba(255, 255, 255, 1) 0%,
        rgba(255, 255, 255, 0) 100%
    );
}
.pie-legend__item {
    display: flex;
    justify-content: space-between;
    position: relative;
    padding-left: 10px;
    align-items: center;
    &::before {
        content: ' ';
        height: 6px;
        width: 6px;
        border-radius: 50%;
        position: absolute;
        left: 0px;
        top: 6px;
    }
    &.maker-0::before {
        background-color: #1d41a5;
    }
    &.maker-1::before {
        background-color: #0d50d8;
    }
    &.maker-2::before {
        background-color: #2f79ff;
    }
    &.maker-3::before {
        background-color: #369bee;
    }
    &.maker-4::before {
        background-color: #45bdbe;
    }
    &.maker-5::before {
        background-color: #54d3d4;
    }
    &.maker-6::before {
        background-color: #f7b500;
    }
    &.maker-7::before {
        background-color: #ffd154;
    }
    .item__label {
        font-size: 12px;
        max-width: 150px;
        overflow: hidden;
    }
    .item__value {
        font-weight: 500;
    }
}
.canvas-pie {
    width: 50%;
}
</style>
