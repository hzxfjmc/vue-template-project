import ColMsg from '@/biz-components/col-msg'
import F2 from '@antv/f2'
import dayjs from 'dayjs'
import { transNumToThousandMark } from '@/utils/tools.js'
export default {
    name: 'BondPrice',
    i18n: {
        zhCHS: {
            buyPrice: '买入价',
            sellPrice: '卖出价'
        },
        zhCHT: {
            buyPrice: '買入價',
            sellPrice: '賣出價'
        },
        en: {
            buyPrice: '买入价',
            sellPrice: '卖出价'
        }
    },
    components: {
        ColMsg
    },
    props: {
        chartData: {
            type: Array,
            default: () => []
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
            maskData: {}, // 蒙版数据
            count: 0, // 计数使用
            xlabelLimitNum: 0 // x轴标签数量 0表示自动展示
        }
    },
    computed: {
        // 构造好的地图数据
        resolveData() {
            let obj = []
            let tempChartData = (this.chartData || []).reverse()
            tempChartData.forEach(chartItem => {
                obj.push(
                    {
                        date: dayjs(chartItem.belongDay).format('M.DD'),
                        time: dayjs(chartItem.belongDay).format(
                            'YYYY年MM月DD日'
                        ),
                        value: chartItem.buyPrice,
                        type: this.$t('buyPrice'),
                        buyYtm: chartItem.buyYtm
                    },
                    {
                        date: dayjs(chartItem.belongDay).format('M.DD'),
                        time: dayjs(chartItem.belongDay).format(
                            'YYYY年MM月DD日'
                        ),
                        value: chartItem.sellPrice,
                        type: this.$t('sellPrice'),
                        buyYtm: chartItem.buyYtm
                    }
                )
            })
            return obj || []
        },
        colData() {
            let data = [
                {
                    title: transNumToThousandMark(this.buyPrice, 4),
                    desc: this.$t('buyPrice')
                },
                {
                    title: this.buyYtm,
                    desc: '到期年化收益率'
                },
                {
                    title: transNumToThousandMark(this.sellPrice, 4),
                    desc: this.$t('sellPrice')
                }
            ]
            return data
        },
        buyPrice() {
            return (
                (this.currentPrice.buyPrice &&
                    (this.currentPrice.buyPrice - 0).toFixed(4)) ||
                ''
            )
        },
        sellPrice() {
            return (
                (this.currentPrice.sellPrice &&
                    (this.currentPrice.sellPrice - 0).toFixed(4)) ||
                ''
            )
        },
        buyYtm() {
            return (
                (this.currentPrice.buyYtm &&
                    (this.currentPrice.buyYtm - 0).toFixed(3) + '%') ||
                '--'
            )
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
                    // var legend = chart.get('legendController').legends.top[0]
                    // console.log('obj', obj)
                    // transNumToThousandMark
                    let buyPriceTitle =
                        (obj.items[0].value &&
                            (obj.items[0].value - 0).toFixed(4)) ||
                        ''
                    let sellPriceTitle =
                        (obj.items[1].value &&
                            (obj.items[1].value - 0).toFixed(4)) ||
                        ''
                    this.maskData = {
                        title: obj.items[0].origin.time,
                        colData: [
                            {
                                title: transNumToThousandMark(buyPriceTitle, 4),
                                desc: this.$t('buyPrice')
                            },
                            {
                                title:
                                    (obj.items[0].origin.buyYtm &&
                                        (
                                            obj.items[0].origin.buyYtm - 0
                                        ).toFixed(3) + '%') ||
                                    '--',
                                desc: '到期年化收益率'
                            },
                            {
                                title: transNumToThousandMark(
                                    sellPriceTitle,
                                    4
                                ),
                                desc: this.$t('sellPrice')
                            }
                        ]
                    }
                },
                triggerOn: ['touchstart'],
                triggerOff: 'touchend',
                onShow: () => {
                    this.isShowMask = true
                },
                onHide: () => {
                    this.isShowMask = false
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
                    if (value === this.$t('buyPrice')) {
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