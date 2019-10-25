import ColMsg from '@/biz-components/col-msg'
import F2 from '@antv/f2'
import dayjs from 'dayjs'
import { transNumToThousandMark } from '@/utils/tools.js'
import { mapGetters } from 'vuex'
const multLangMap = {
    buyPrice: {
        1: '买入价',
        2: '買入價'
    },
    sellPrice: {
        1: '卖出价',
        2: '賣出價'
    }
}
export default {
    name: 'BondPrice',
    components: {
        ColMsg
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
            maskData: {}, // 蒙版数据
            count: 0, // 计数使用
            xlabelLimitNum: 0 // x轴标签数量 0表示自动展示
        }
    },
    computed: {
        ...mapGetters(['appType']),
        appTypeNumber() {
            return this.appType.Ch ? 1 : 2
        },
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
                        type: multLangMap.buyPrice[this.appTypeNumber],
                        buyYtm: chartItem.buyYtm
                    },
                    {
                        date: dayjs(chartItem.updateTime).format('M.DD'),
                        time: dayjs(chartItem.updateTime).format(
                            'YYYY年MM月DD日'
                        ),
                        value: chartItem.sellPrice,
                        type: multLangMap.sellPrice[this.appTypeNumber],
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
                    desc: multLangMap.buyPrice[this.appTypeNumber]
                },
                {
                    title: this.buyYtm,
                    desc: '到期年化收益率'
                },
                {
                    title: transNumToThousandMark(this.sellPrice, 4),
                    desc: multLangMap.sellPrice[this.appTypeNumber]
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
                                desc: multLangMap.buyPrice[this.appTypeNumber]
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
                                desc: multLangMap.sellPrice[this.appTypeNumber]
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
                    if (value === multLangMap.buyPrice[this.appTypeNumber]) {
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
