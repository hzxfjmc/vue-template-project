<template lang="pug">
    .block__fund(
        v-if="fundlist.masterTitle"
        :class="[appType.Hk ? 'block__fund-hk' : 'block__fund-ch']")
        .block__fund-title.ellipse {{fundlist.masterTitle}}
        .block__fund--list.border-bottom(
            @click="goNext(item)"
            v-for="(item,index) in fundlist.data" 
            :key="index")
                .element--fund--content
                    //- span.title.ellipse {{item.title}}
                    .element--right
                        img(:src="item.imgUrl")
                    .element--content-sub-content
                        .number(v-if="Number(item.apy)>0" :class="stockColorType === 1 ? 'color-red' : 'color-green'") + {{(item.apy*100).toFixed(2)}}%
                        .number(v-if="Number(item.apy)<0" :class="stockColorType === 1 ? 'color-green' : 'color-red'") - {{Math.abs(item.apy*100).toFixed(2)}}%
                        .number(v-if="Number(item.pay) === 0") {{item.apy}}
                        .tag {{item.apyTypeName}}{{$t('day')}}
                    .element--content-bottom
                        .tag-title 
                            span.title.ellipse {{item.title}}
                        .tag-list--element(v-if="appType.Hk")
                            span {{item.assetTypeName}}
                            span {{item.initialInvestAmount}} {{item.tradeCurrency}}起購
                            span {{item.fundSize}}億{{item.fundSizeCurrency}}
                        .tag-list(v-else)
                            fund-tag(:title="item.assetTypeName")
                            fund-tag(
                                :title="`${lang === 'en' ? $t('described') : ''}${item.initialInvestAmount}${item.tradeCurrency}${lang != 'en' ? $t('described'):''}`")
                            fund-tag(
                                :title="`${item.fundSize}${$t('unit')}${item.fundSizeCurrency}`")
                
</template>
<script>
import { gotoNewWebView } from '@/utils/js-bridge.js'
import { mapGetters } from 'vuex'
import fundTag from '@/biz-components/fund-tag/index.vue'
import { getStockColorType } from '@/utils/html-utils.js'
export default {
    props: {
        fundlist: {
            type: Object,
            default: () => {}
        }
    },
    i18n: {
        zhCHS: {
            described: '起购',
            unit: '亿',
            USD: '美元',
            CNY: '人民币',
            HKD: '港币',
            AUS: '澳元',
            KRW: '韩元',
            JPY: '日元',
            day: '收益率'
        },
        zhCHT: {
            described: '起購',
            unit: '亿',
            USD: '美元',
            CNY: '人民币',
            HKD: '港币',
            AUS: '澳元',
            KRW: '韩元',
            JPY: '日元',
            day: '表现'
        },
        en: {
            described: 'Initial Subs.',
            unit: 'M',
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
    computed: {
        stockColorType() {
            return +getStockColorType()
        },
        ...mapGetters(['appType', 'lang'])
    },
    methods: {
        goNext(item) {
            let url = `${window.location.origin}/wealth/fund/index.html#/fund-details?id=${item.fundId}`
            gotoNewWebView(url)
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
        height: 80px;
        display: flex;
        padding: 20px 0 20px 0;
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
            padding: 0 0 0 10px;
            .title {
                font-size: 16px;
                width: 100%;
            }
            .element--content-sub-content {
                display: flex;
                height: 100%;
                flex-direction: column;
                width: 100px;
                margin: 0 0 0 10px;
                .number {
                    font-size: 20px;
                    line-height: 23px;
                    // margin: 15px 0 0 0;
                    font-family: yxFontDINPro-Medium;
                }
                .tag {
                    font-size: 12px;
                    line-height: 25px;
                    // padding: 0 0 0 10px;
                    color: $text-color5; // 次标题颜色
                }
            }
            .element--content-bottom {
                width: 56%;
                .tag-title {
                    span {
                        width: 100%;
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
            }
        }
        .element--right {
            width: 40px;
            height: 40px;
            // margin: 15px 0;
            img {
                width: 40px;

                height: 40px;
            }
        }
    }
}
.block__fund-hk {
    padding: 10px 5%;
}
.block__fund-ch {
    padding: 10px 2%;
}
</style>
