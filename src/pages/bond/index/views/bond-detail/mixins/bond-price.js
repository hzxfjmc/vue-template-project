import ColMsg from '@/biz-components/col-msg'
import F2 from '@antv/f2'
import dayjs from 'dayjs'
import { transNumToThousandMark } from '@/utils/tools.js'
export default {
    name: 'BondPrice',
    i18n: {
        zhCHS: {
            bondValue: '此债券面值为',
            USD: '美元',
            tradingAmount: '买卖金额为',
            spBondPrice: '*买卖价',
            contract: '/份',
            price_年: '年',
            price_月: '月',
            price_日: '日',
            buyPrice: '买入价',
            sellPrice: '卖出价',
            yieldToMaturity: '到期年化收益率'
        },
        zhCHT: {
            bondValue: '此債券面值為',
            USD: '美元',
            tradingAmount: '買賣金額為',
            spBondPrice: '*買賣價',
            contract: '/份',
            price_年: '年',
            price_月: '月',
            price_日: '日',
            buyPrice: '買入價',
            sellPrice: '賣出價',
            yieldToMaturity: '到期年化收益率'
        },
        en: {
            bondValue: 'Nominal value of this bond is ',
            USD: ' USD',
            tradingAmount: 'trading amount is ',
            spBondPrice: ' * bond price',
            contract: '',
            price_年: '-',
            price_月: '-',
            price_日: '',
            buyPrice: 'Bid Price',
            sellPrice: 'Ask Price',
            yieldToMaturity: 'Yield-to-Maturity'
        }
    },
    components: {
        ColMsg
    },
    props: {
        bondUneditableInfo: {
            type: Object,
            default: () => {}
        },
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
            let tempChartData = (this.chartData || []).map(item => item)
            tempChartData = tempChartData.reverse()
            tempChartData.forEach(chartItem => {
                obj.push(
                    {
                        date: dayjs(chartItem.belongDay).format('YYYY.M.DD'),
                        time: dayjs(chartItem.belongDay).format(
                            `YYYY${this.$t('price_年')}MM${this.$t(
                                'price_月'
                            )}DD${this.$t('price_日')}`
                        ),
                        value: chartItem.buyPrice - 0,
                        type: this.$t('buyPrice'),
                        buyYtm: chartItem.buyYtm
                    },
                    {
                        date: dayjs(chartItem.belongDay).format('YYYY.M.DD'),
                        time: dayjs(chartItem.belongDay).format(
                            `YYYY${this.$t('price_年')}MM${this.$t(
                                'price_月'
                            )}DD${this.$t('price_日')}`
                        ),
                        value: chartItem.sellPrice - 0,
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
                    desc: this.$t('yieldToMaturity')
                },
                {
                    title: transNumToThousandMark(this.sellPrice, 4),
                    desc: this.$t('sellPrice')
                }
            ]
            return data
        },
        // 购买价格
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
        },
        // 最小面额
        minFaceValue() {
            return (
                (this.bondUneditableInfo &&
                    this.bondUneditableInfo.minFaceValue &&
                    this.bondUneditableInfo.minFaceValue - 0) ||
                0
            )
        },
        i18nCurrencyName() {
            return this.$t(this.currencyName)
        },
        // 货币单位
        currencyName() {
            return (
                (this.bondUneditableInfo &&
                    this.bondUneditableInfo.enumCurrency &&
                    this.bondUneditableInfo.enumCurrency.name) ||
                ''
            )
        }
    },
    methods: {
        draw() {
            // F2 的坑，第一次 resolveData数据为空，第二次有数据之后渲染，这时候在图表上
            // 进行手势滑动，会造成图表闪烁，这里进行拦截，有数据才进行渲染
            if (this.resolveData.length === 0) return

            let chart = new F2.Chart({
                id: 'mountNode',
                pixelRatio: window.devicePixelRatio
                // padding: [0, 0, 0, 0]
            })

            chart.source(this.resolveData, {
                // 有个巨坑的地方，F2渲染图表，如果类型值一样，会进行值的叠加
                // 比如 scale 为 date， date 中的数值 作为 key 来渲染占位
                // 如果 date 数据为： [ { date: 12, x: 1}, { date: 12, x: 2 }], 此时
                // 在图表中，这两个对象的数据会进行叠加，在一条竖线上标志数据，而不是两条线
                date: {
                    tickCount: 3,
                    type: 'cat',
                    formatter: function(x) {
                        return x.slice(5)
                    }
                },
                value: {
                    tickCount: 3,
                    formatter: function(x) {
                        return x.toFixed(4)
                    }
                }
            })
            chart.tooltip({
                custom: true, // 自定义 tooltip 内容框
                onChange: obj => {
                    // console.log('obj', obj)
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
                                desc: this.$t('yieldToMaturity')
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
                triggerOn: ['touchstart', 'touchmove'],
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
                itemWidth: '0.84rem',
                clickable: false
            })
            chart
                .line()
                .shape('smooth')
                .style({
                    lineWidth: 1.5
                })
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
