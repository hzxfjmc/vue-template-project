<template lang="pug">
    .chart-container
        canvas.canvas-pie(id="pie-container")
</template>
<script>
import F2 from '@antv/f2'
export default {
    props: {
        chartList: {
            type: Array,
            default: () => []
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
            console.log(data)
            const map = {}
            data.forEach(function(obj) {
                map[obj.name] = obj.percent + '%'
            })

            const chart = new F2.Chart({
                id: 'pie-container',
                pixelRatio: window.devicePixelRatio,
                padding: [0, 'auto'],
                appendPadding: [0, 10],
                height: 270
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
                itemFormatter: function itemFormatter(val) {
                    return val + ' ' + map[val]
                }
            })
            chart.coord('polar', {
                transposed: true,
                innerRadius: 0.7,
                radius: 0.85
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
