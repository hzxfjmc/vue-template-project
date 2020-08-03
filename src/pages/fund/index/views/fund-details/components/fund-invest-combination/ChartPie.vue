<template lang="pug">
    .chart-container
        canvas.canvas-pie(:id="id")
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
                    height: 230,
                    innerRadius: 0.7,
                    radius: 0.75
                }
            }
        }
    },
    data() {
        return {
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
                        fill: this.colorList[index],
                        radius: 3
                    }
                })
            })

            const chart = new F2.Chart({
                id: this.id,
                pixelRatio: window.devicePixelRatio,
                padding: [0, 150, 0, 0],
                appendPadding: [0, 0],
                height:
                    data.length > 8
                        ? data.length * 26
                        : this.chartOptions.height
            })
            chart.source(data, {
                percent: {
                    formatter: function formatter(val) {
                        return val + '%'
                    }
                }
            })
            chart.tooltip(false)
            chart.legend({
                position: 'right',
                custom: true,
                items: legendItems,
                nameStyle: {
                    textAlign: 'start',
                    fill: '#191919', // 文本的颜色
                    width: 130
                },
                joinString: '',
                valueStyle: {
                    textAlign: 'end',
                    fill: '#191919', // 文本的颜色
                    fontSize: '14',
                    fontWeight: '500',
                    width: 80
                }
            })
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
.canvas-pie {
    width: 100%;
}
</style>
