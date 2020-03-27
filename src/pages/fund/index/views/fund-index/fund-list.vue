<template lang="pug">
    .block__fund(
        :class="[code != 1 ? 'block__fund-hk' : 'block__fund-ch']")
        .block__fund-title.ellipse {{fundlist.masterTitle}}
        .block__fund--list.border-bottom(
            @click="goNext(item)"
            v-for="(item,index) in fundlist.data" 
            :key="index")
                .element--fund--content
                    .canvas-element--right
                        canvas(
                            :id="'chartId'+item.fundId" 
                        )
                    //- span.title.ellipse {{item.title}}
                    .element--content-sub-content
                        .number(v-if="Number(item.apy)>0" :class="stockColorType == 1 ? 'color-red' : 'color-green'") +{{(item.apy*100).toFixed(2)}}%
                        .number(v-if="Number(item.apy)<0" :class="stockColorType == 1 ? 'color-green' : 'color-red'") -{{Math.abs(item.apy*100).toFixed(2)}}%
                        .number(v-if="Number(item.apy) === 0") {{Number(item.apy).toFixed(2)}}
                        .tag {{item.apyTypeName}}{{$t('day')}}
                    .element--content-bottom
                        .tag-title 
                            span.title.ellipse {{item.title}}
                        .tag-list--element(v-if="code !== 1")
                            span(v-if="lang != 'en'") {{item.assetTypeName}}
                            span {{lang === 'en' ? $t('described') : ''}}{{item.initialInvestAmount}}{{item.tradeCurrency}}{{lang != 'en' ? $t('described'):''}}
                            span(v-if="item.fundSize != 0") {{lang === 'en' ? $t('fundSizeIndex'):''}}{{item.fundSize}}{{$t('unit')}}{{item.fundSizeCurrency}}{{lang === 'en' ?'':$t('fundSizeIndex')}}
                        .tag-list--element(v-else)
                            span {{item.assetTypeName}}
                            span {{`${item.initialInvestAmount}${item.tradeCurrency}${$t('described1')}`}}
                            span(v-if="item.fundSize != 0") {{lang === 'en' ? $t('fundSizeIndex'):''}}{{item.fundSize}}{{$t('unit')}}{{item.fundSizeCurrency}}
                            //- fund-tag(:title="item.assetTypeName")
                            //- fund-tag(
                            //-     :title="`${item.initialInvestAmount}${item.tradeCurrency}起购`")
                            //- fund-tag(
                            //-     v-if="item.fundSize != 0"
                            //-     :title="`${item.fundSize}亿${item.fundSizeCurrency}`")
                
</template>
<script>
import { gotoNewWebView } from '@/utils/js-bridge.js'
import { mapGetters } from 'vuex'
import fundTag from '@/biz-components/fund-tag/index.vue'
import { getStockColorType } from '@/utils/html-utils.js'
import { debounce } from '@/utils/tools.js'
import dayjs from 'dayjs'
import F2 from '@antv/f2'
export default {
    props: {
        fundlist: {
            type: Object,
            default: () => {}
        },
        code: {
            type: Number
        }
    },
    i18n: {
        zhCHS: {
            described: '起',
            described1: '起',
            fundSizeIndex: '规模',
            unit: '亿',
            USD: '美元',
            CNY: '人民币',
            HKD: '港币',
            AUS: '澳元',
            KRW: '韩元',
            JPY: '日元',
            day: '涨跌幅'
        },
        zhCHT: {
            described: '起',
            described1: '起',
            fundSizeIndex: '規模',
            unit: '億',
            USD: '美元',
            CNY: '人民币',
            HKD: '港币',
            AUS: '澳元',
            KRW: '韩元',
            JPY: '日元',
            day: '漲跌幅'
        },
        en: {
            described: 'Min. ',
            described1: '',
            fundSizeIndex: 'AUM ',
            unit: 'B ',
            USD: '美元',
            CNY: '人民币',
            HKD: '港币',
            AUS: '澳元',
            KRW: '韩元',
            JPY: '日元',
            day: ''
        }
    },
    components: {
        'fund-tag': fundTag
    },
    updated() {
        this.$nextTick(() => {
            this.fundlist.data.forEach(item => {
                this.draw(`chartId${item.fundId}`, item.fundHomepagePointList)
            })
        })
    },
    computed: {
        stockColorType() {
            console.log(getStockColorType())
            return +getStockColorType()
        },
        ...mapGetters(['appType', 'lang'])
    },
    methods: {
        draw(canvasId, data) {
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
                    tickCount: 3000,
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
            chart
                .line()
                .position('belongDay*pointData')
                .color(`${this.stockColorType === 1 ? '#ea3d3d' : '#04ba60'}`)
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
    width: 100%;
    margin: 20px 0 0 0;

    background: #fff;
    .block__fund-title {
        font-size: 20px;
    }
    .block__fund--list {
        width: 100%;
        // height: 80px;
        display: flex;
        // border: 1px solid red;
        padding: 20px 0 10px 0;
        flex-direction: row;
        .element--left--img {
            width: 20px;
            height: 20px;
            margin: 4px 0 0 0;
        }
        .element--fund--content {
            display: flex;
            flex-direction: row;
            width: 100%;
            // padding: 0 0 0 10px;
            .title {
                font-size: 16px;
                width: 100%;
            }
            .element--content-sub-content {
                display: flex;
                height: 100%;
                flex-direction: column;
                width: 105px;
                padding: 0 10px;
                .number {
                    font-size: 0.4rem;
                    line-height: 23px;
                    font-family: yxFontDINPro-Medium;
                }
                .tag {
                    font-size: 0.24rem;
                    line-height: 25px;
                    color: $text-color5; // 次标题颜色
                }
            }
            .element--content-bottom {
                flex: 1;
                .tag-title {
                    max-width: 180px;
                    span {
                        height: 22px;
                        // margin: 10px 0 0 0;
                        display: inline-block;
                        line-height: 22px;
                        font-size: 16px;
                    }
                }
                .tag-list {
                    display: flex;
                    flex-direction: row;
                }
                .tag-list--element {
                    span {
                        padding: 0 3px 0 3px;
                        font-size: 12px;
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
            }
        }
    }
}
.canvas-element--right {
    width: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    canvas {
        width: 700px;
        zoom: 0.1;
    }
}
.block__fund-hk {
    padding: 10px 0;
}
.block__fund-ch {
    padding: 10px 2%;
}
</style>
