<template lang="pug">
    .block__fund(
        :class="[code != 1 ? 'block__fund-hk' : 'block__fund-ch']")
        //- .block__fund-title.ellipse(:style="{background:bgColor}") {{title}}
        .block__fund-title.ellipse() {{title}}
        .block__fund--list.border-bottom(
            @click="goNext(item)"
            v-for="(item,index) in fundlist.data" 
            :key="index")
                .canvas-element--right
                    canvas(
                        :id="'chartId'+item.fundId" 
                        :ref="item.fundId"
                    )
                .element--fund--content
                    span.title.ellipse {{item.title}}
                    .element--content-sub-content
                        .number(v-if="Number(item.apy)>0" :class="stockColorType === 1 ? 'color-red' : 'color-green'") + {{(item.apy*100).toFixed(2)}}%
                        .number(v-if="Number(item.apy)<0" :class="stockColorType === 1 ? 'color-green' : 'color-red'") - {{Math.abs(item.apy*100).toFixed(2)}}% 
                        .number(v-if="Number(item.apy) === 0") {{Number(item.apy).toFixed(2)}}%
                        .tag {{item.apyTypeName}}{{$t('day')}}
                    .element--content-bottom(v-if="code != 1")
                        //- span(v-if="lang != 'en'") {{item.assetTypeName}} 
                        span {{lang === 'en' ? $t('described'):''}}{{item.initialInvestAmount}}{{item.tradeCurrency}}{{lang != 'en' ? $t('described'):''}}
                        span(v-if="item.fundSize != 0") {{lang === 'en' ? $t('fundSizeIndex'):''}}{{item.fundSize}}{{$t('unit')}}{{item.fundSizeCurrency}}{{lang === 'en' ?'':$t('fundSizeIndex')}}
                    .element--content-bottom-ch(v-else)
                        fund-tag(
                            :title="`${lang === 'en' ? $t('described') : ''}${item.initialInvestAmount}${item.tradeCurrency}${lang != 'en' ? $t('described1'):''}`")
                        fund-tag(
                            v-if="item.fundSize != 0"
                            :title="`${lang === 'en' ? $t('fundSizeIndex'):''}${item.fundSize}${$t('unit')}${item.fundSizeCurrency}${lang === 'en' ?'':$t('fundSizeIndex')}`")
                
</template>
<script>
import { gotoNewWebView } from '@/utils/js-bridge.js'
import { getStockColorType } from '@/utils/html-utils.js'
import { mapGetters } from 'vuex'
import fundTag from '@/biz-components/fund-tag/index.vue'
import { debounce } from '@/utils/tools.js'
import dayjs from 'dayjs'
import F2 from '@antv/f2'
export default {
    computed: {
        stockColorType() {
            return +getStockColorType()
        },
        ...mapGetters(['appType', 'lang'])
    },
    components: {
        'fund-tag': fundTag
    },
    updated() {
        this.$nextTick(() => {
            this.fundlist.data.forEach(item => {
                this.draw(
                    `chartId${item.fundId}`,
                    item.fundHomepagePointList,
                    item.apy
                )
            })
        })
    },
    i18n: {
        zhCHS: {
            described: '起',
            described1: '起',
            unit: '亿',
            fundSizeIndex: '规模',
            day: '涨跌幅'
        },
        zhCHT: {
            described: '起',
            described1: '起購',
            unit: '億',
            fundSizeIndex: '規模',
            day: '漲跌幅'
        },
        en: {
            described: 'Min. ',
            described1: '',
            unit: 'B ',
            fundSizeIndex: 'AUM ',
            day: ''
        }
    },
    props: {
        bgColor: {
            type: String,
            default: ''
        },
        title: {
            type: String,
            default: ''
        },
        fundlist: {
            type: Object,
            default: () => {}
        },
        code: {
            type: Number
        }
    },
    methods: {
        draw(canvasId, data, apy) {
            const chart = new F2.Chart({
                id: canvasId
            })
            data.map(item => {
                item.pointData = Number(item.pointData)
            })
            chart.source(data, {
                pointData: {
                    formatter: function formatter(val) {
                        return Number(val).toFixed(2)
                    }
                },
                belongDay: {
                    type: 'timeCat',
                    formatter: function formatter(val) {
                        return dayjs(val).format('YYYY-MM-DD')
                    }
                }
            })
            chart.tooltip({
                custom: true,
                showXTip: true,
                showYTip: true,
                snap: true,
                crosshairsType: 'xy',
                crosshairsStyle: {
                    lineDash: [2]
                }
            })
            chart.axis(false)
            let stockColor
            if (this.stockColorType === 1) {
                stockColor = Number(apy) >= 0 ? '#ea3d3d' : '#04ba60'
            } else {
                stockColor = Number(apy) >= 0 ? '#04ba60' : '#ea3d3d'
            }
            chart
                .line()
                .position('belongDay*pointData')
                .color(`${stockColor}`)
                .shape('smooth')
                .style({
                    lineWidth: 10
                })
            chart.render()
        },
        goNext(item) {
            let url = `${window.location.origin}/wealth/fund/index.html#/fund-details?id=${item.fundId}`
            debounce(gotoNewWebView(url), 300)
        }
    }
}
</script>
<style lang="scss" scoped>
.color-green {
    color: #04ba60;
}
.color-red {
    color: #ea3d3d;
}
.block__fund {
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    margin: 10px 0 0 0;
    background: #fff;
    .block__fund-title {
        width: 100%;
        height: 57px;
        padding: 0 14px;
        border-top-left-radius: 5px;
        // color: #fff;
        line-height: 57px;
        border-top-right-radius: 5px;
        font-size: 20px;
    }
    .block__fund--list {
        width: 100%;
        display: flex;
        // margin: 20px 0 0 0;
        padding: 16px 14px;
        flex-direction: row;
        .element--fund--content {
            display: flex;
            flex-direction: column;
            margin: 0 0 0 25px;
            flex: 1;
            .title {
                font-size: 16px;
                max-width: 230px;
            }
            .element--content-sub-content {
                display: flex;
                flex-direction: row;
                .number {
                    font-size: 18px;
                    line-height: 23px;
                    font-family: yxFontDINPro-Medium;
                }
                .tag {
                    font-size: 10px;
                    line-height: 25px;
                    padding: 0 0 0 10px;
                    color: $text-color5; // 次标题颜色
                }
            }
            .element--content-bottom {
                span {
                    padding: 0 3px 0 3px;
                    font-size: 10px;
                    color: $text-color6;
                    border-right: 1px solid #e1e1e1;
                }
                span:first-child {
                    padding: 0 3px 0 0;
                }
                span:last-child {
                    border: none;
                }
            }
            .element--content-bottom-ch {
                display: flex;
                flex-direction: row;
            }
        }
        .canvas-element--right {
            width: 80px;
            display: flex;
            align-items: center;
            canvas {
                width: 1000px;
                zoom: 0.1;
            }
        }
    }
}
.block__fund-hk {
    width: 90%;
    margin: 10px 5% 0 5%;
}
.block__fund-ch {
    width: 351px;
    margin: 10px 12px 0 12px;
}
</style>
