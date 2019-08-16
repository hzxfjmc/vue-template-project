<template lang="pug">
    .detail-bond-price-wrapper
        mask-header(v-show="isShowMask" :maskData="maskData")
        col-msg(
            :colData="colData"
            :descStyle="descStyle"
        )
        .chart-wrapper
            canvas#mountNode
</template>
<script>
import ColMsg from '@/pages/bond/index/biz-components/col-msg'
import MaskHeader from './mask-header'
import F2 from '@antv/f2'
import dayjs from 'dayjs'
export default {
    name: 'BondPrice',
    components: {
        ColMsg,
        MaskHeader
    },
    props: {
        chartData: {
            type: Array,
            default: () => {}
        },
        currentPrice: {
            type: Object,
            default: () => {}
        }
    },
    mounted() {
        this.draw()
    },
    data() {
        return {
            isShowMask: false,
            descStyle: {
                color: 'rgba(25, 25, 25, 0.5)'
            },
            maskData: {}, // 蒙版数据
            count: 0, // 计数使用
            xlabelLimitNum: 0 // x轴标签数量 0表示自动展示
        }
    },
    computed: {
        // 构造好的地图数据
        resolveData() {
            let obj = []
            this.chartData.forEach(chartItem => {
                obj.push(
                    {
                        date: dayjs(chartItem.updateTime).format('M.DD'),
                        time: dayjs(chartItem.updateTime).format(
                            'YYYY年MM月DD日'
                        ),
                        value: chartItem.buyPrice,
                        type: '买入价',
                        buyYtm: chartItem.buyYtm
                    },
                    {
                        date: dayjs(chartItem.updateTime).format('M.DD'),
                        time: dayjs(chartItem.updateTime).format(
                            'YYYY年MM月DD日'
                        ),
                        value: chartItem.sellPrice,
                        type: '卖出价',
                        buyYtm: chartItem.buyYtm
                    }
                )
            })
            return obj || []
        },
        colData() {
            let data = [
                {
                    title: this.currentPrice.buyPrice,
                    desc: '买入价'
                },
                {
                    title: this.currentPrice.buyYtm,
                    desc: '到期年化收益率'
                },
                {
                    title: this.currentPrice.sellPrice,
                    desc: '卖出价'
                }
            ]
            return data
        }
    },
    methods: {
        draw() {
            let chart = new F2.Chart({
                id: 'mountNode',
                pixelRatio: window.devicePixelRatio
                // padding: [0, 0, 0, 0]
            })
            chart.source(this.resolveData)
            chart.scale('date', {
                tickCount: 5,
                type: 'cat'
            })
            chart.scale('value', {
                tickCount: 3
            })
            chart.tooltip({
                custom: true, // 自定义 tooltip 内容框
                onChange: obj => {
                    this.isShowMask = true

                    // var legend = chart.get('legendController').legends.top[0]
                    // console.log('obj', obj)
                    this.maskData = {
                        title: obj.items[0].origin.time,
                        colData: [
                            {
                                title: obj.items[0].value,
                                desc: '买入价'
                            },
                            {
                                title: obj.items[0].origin.buyYtm + '%',
                                desc: '到期年化收益率'
                            },
                            {
                                title: obj.items[1].value,
                                desc: '卖出价'
                            }
                        ]
                    }
                }
            })
            chart.legend('type', {
                position: 'bottom',
                align: 'center',
                itemWidth: '0.84rem'
            })
            chart
                .line()
                .position('date*value')
                .color('type', value => {
                    if (value === '买入价') {
                        return '#497AFF'
                    }
                    return '#FFBF32'
                })
            chart.render()
        }
    },
    watch: {
        resolveData() {
            this.draw()
        }
    }
}
</script>
<style lang="scss" scoped>
.detail-bond-price-wrapper {
    user-select: none;
    .col-column {
        padding: 0 12px 0 12px;
        margin-top: -2px;
    }
    .chart-wrapper {
        margin-top: 14px;
        #mountNode {
            position: relative;
            height: 226px;
            width: 100%;
        }
    }
}
</style>
