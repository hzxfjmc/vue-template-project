<template lang="pug">
    .block__fund(
        :class="[code != 1 ? 'block__fund-ch' : 'block__fund-ch']")
        .block__fund-title.ellipse {{fundlist.masterTitle}}
        .block__fund--list.border-bottom(
            @click="goNext(item)"
            v-for="(item,index) in fundlist.data" 
            :key="index")
                .element--fund--content
                    .element--content-sub-content
                        .number(
                            v-if="Number(item.apy)>0" :class="[stockColorType == 1 ? 'color-red' : 'color-green',item.apy.length<5?'':'fontSize20']") +{{(item.apy*100).toFixed(2)}}%
                        .number(
                            v-if="Number(item.apy)<0" 
                            :class="[stockColorType == 1 ? 'color-green' : 'color-red',item.apy.length<5?'':'fontSize20']") -{{Math.abs(item.apy*100).toFixed(2)}}%
                        .number(
                            v-if="Number(item.apy) === 0") {{Number(item.apy).toFixed(2)}}%
                        .tag {{item.apyTypeName}}{{$t('day')}}
                    .element--content-bottom
                        .tag-title 
                            span.title.ellipse {{item.title}}
                        .tag-list--element
                            span(v-for="i of item.systemLabelsList") {{i}}
                        .tag-list--element
                            fund-tag(
                                v-for="key of item.definedLabels"
                                :title="key")
                        
                
</template>
<script>
import { gotoNewWebView } from '@/utils/js-bridge.js'
import { mapGetters } from 'vuex'
import fundTag from '@/biz-components/fund-tag/index.vue'
import { debounce } from '@/utils/tools.js'
import { getStockColorType } from '@/utils/html-utils.js'
// import dayjs from 'dayjs'
// import F2 from '@antv/f2'
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
    // updated() {
    //     this.$nextTick(() => {
    //         this.fundlist.data.forEach(item => {
    //             console.log(item.fundId)
    //             this.draw(
    //                 `chartId${item.fundId}`,
    //                 item.fundHomepagePointList,
    //                 item.apy
    //             )
    //         })
    //     })
    // },
    computed: {
        stockColorType() {
            return +getStockColorType()
        },
        ...mapGetters(['appType', 'lang']),
        h2Style() {
            // 名称字体变化策略
            let fundName = this.info.fundName || ''
            if (fundName.length > 5) {
                return {
                    fontSize: '20px'
                }
            }
            return {
                fontSize: '22px'
            }
        }
    },
    methods: {
        // draw(canvasId, data, apy) {
        //     console.log(canvasId)
        //     const chart = new F2.Chart({
        //         id: canvasId
        //     })
        //     data.map(item => {
        //         item.pointData = Number(item.pointData)
        //     })
        //     chart.source(data, {
        //         pointData: {
        //             formatter: function formatter(val) {
        //                 return Number(val).toFixed(2)
        //             }
        //         },
        //         belongDay: {
        //             type: 'timeCat',
        //             tickCount: 3000,
        //             formatter: function formatter(val) {
        //                 return dayjs(val).format('YYYY-MM-DD')
        //             }
        //         }
        //     })
        //     chart.tooltip({
        //         custom: true,
        //         showXTip: true,
        //         showYTip: true,
        //         snap: true,
        //         crosshairsType: 'xy',
        //         crosshairsStyle: {
        //             lineDash: [2]
        //         }
        //     })
        //     chart.axis(false)
        //     let stockColor
        //     if (this.stockColorType === 1) {
        //         stockColor = Number(apy) >= 0 ? '#ea3d3d' : '#04ba60'
        //     } else {
        //         stockColor = Number(apy) >= 0 ? '#04ba60' : '#ea3d3d'
        //     }
        //     chart
        //         .line()
        //         .position('belongDay*pointData')
        //         .color(`${stockColor}`)
        //         .style({
        //             lineWidth: 10
        //         })
        //     chart.render()
        // },
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
    margin: 10px 12px 0 12px;
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.05);
    border-radius: 6px;
    width: 351px;
    background: #fff;
    .block__fund-title {
        font-size: 18px;
        font-weight: bold;
        width: 100%;
        // line-height: 50px;
        // height: 50px;
        background: url('~@/assets/img/fund/fund-title-bg.png') no-repeat;
        background-size: 100% 100%;
        padding: 14px 0 14px 12px;
    }
    .block__fund--list {
        // width: 100%;
        // height: 80px;
        display: flex;
        // border: 1px solid red;
        padding: 14px 0;
        margin: 0 12px;
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
                padding: 0 12px 0 0;
                justify-content: center;
                .number {
                    font-size: 22px;
                    line-height: 23px;
                    font-family: yxFontDINPro-Medium;
                }
                .fontSize20 {
                    font-size: 20px;
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
                    max-width: 220px;
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
                    display: flex;
                    flex-direction: row;
                    span {
                        padding: 0 3px 0 3px;
                        font-size: 10px;
                        color: $text-color6;
                        display: inline-block;
                        position: relative;
                        // border-right: 1px solid #e1e1e1;
                    }
                    span::after {
                        content: '';
                        background: $text-color6;
                        height: 11px;
                        right: 0px;
                        top: 2px;
                        position: absolute;
                        width: 1px;
                    }
                    span:first-child {
                        padding: 0 3px 0 0;
                    }
                    span:last-child::after {
                        width: 0;
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
    // padding: 10px 12px;
}
</style>
