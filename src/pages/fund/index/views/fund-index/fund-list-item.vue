<template lang="pug">
    .block__fund(
        v-if="fundlist.masterTitle"
        :class="[appType.Hk ? 'block__fund-hk' : 'block__fund-ch']")
        .block__fund-title.ellipse(:style="{background:bgColor}") {{title}}
        .block__fund--list.border-bottom(
            @click="goNext(item)"
            v-for="(item,index) in fundlist.data" 
            :key="index")
                .element--right
                    img(:src="item.imgUrl")
                .element--fund--content
                    span.title.ellipse {{item.title}}
                    .element--content-sub-content
                        .number(
                            v-if="Number(item.apy)>0" 
                            :class="stockColorType === 1 ? 'color-red' : 'color-green'") + {{(item.apy*100).toFixed(2)}}%
                        .number(
                            v-if="Number(item.apy)<0" 
                            :class="stockColorType === 1 ? 'color-green' : 'color-red'") - {{Math.abs(item.apy*100).toFixed(2)}}%
                        .number(v-if="Number(item.pay) === 0") {{item.apy}}
                        .tag {{item.apyTypeName}}{{$t('day')}}
                    .element--content-bottom
                        span(v-if="appType.Hk") {{item.assetTypeName}}
                        span(v-if="appType.Hk") {{lang === 'en' ? $t('described'):''}}{{item.initialInvestAmount}}{{item.tradeCurrency}}{{lang != 'en' ? $t('described'):''}}
                        span(v-if="appType.Hk") {{item.fundSize}}{{$t('unit')}}{{item.fundSizeCurrency}}
                        fund-tag(
                            v-if="!appType.Hk"
                            :title="item.assetTypeName")
                        fund-tag(
                            v-if="!appType.Hk"
                            :title="`${item.initialInvestAmount}${item.tradeCurrency}起购`")
                        fund-tag(
                            v-if="!appType.Hk"
                            :title="`${item.fundSize}亿${item.fundSizeCurrency}`")
                
</template>
<script>
import { gotoNewWebView } from '@/utils/js-bridge.js'
import { mapGetters } from 'vuex'
import fundTag from '@/biz-components/fund-tag/index.vue'
import { getStockColorType } from '@/utils/html-utils.js'
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
    i18n: {
        zhCHS: {
            described: '起购',
            unit: '亿',
            day: '收益率'
        },
        zhCHT: {
            described: '起購',
            unit: '亿',
            day: '表现'
        },
        en: {
            described: 'Initial Subs.',
            unit: 'M',
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
        }
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
.block__fund {
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    .block__fund-title {
        width: 100%;
        height: 57px;
        padding: 0 14px;
        border-top-left-radius: 5px;
        color: #fff;
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
            margin: 0 0 0 30px;
            width: 75%;
            .title {
                font-size: 16px;
                width: 100%;
            }
            .element--content-sub-content {
                display: flex;
                flex-direction: row;
                .number {
                    font-size: 18px;
                    color: rgba(0, 197, 141, 1);
                    line-height: 23px;
                }
                .tag {
                    font-size: 10px;
                    line-height: 25px;
                    padding: 0 0 0 10px;
                    color: $text-color5; // 次标题颜色
                }
            }
            .element--content-bottom {
                display: flex;
                flex-direction: row;
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
        .element--right {
            width: 70px;
            height: 65px;
            img {
                width: 70px;
                height: 65px;
            }
        }
    }
}
.block__fund-hk {
    width: 90%;
    margin: 20px 5% 0 5%;
}
.block__fund-ch {
    width: 96%;
    margin: 20px 2% 0 2%;
}
</style>
