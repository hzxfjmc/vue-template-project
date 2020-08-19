<template lang="pug">
    .fund-income-container(:class="lang")
        .fund-income__body
            .body-item.body-item__left
                .item  
                    .title 
                        .text {{$t(['年化收益','年化收益','ANN RTN'])}} 
                        .iconfont.icon-warning(@click="showTips")          
                    .label {{$t(['本基金', '本基金', 'Fund'])}}          
                    .label {{$t(['同类平均', '同類平均', 'Category AVG'])}}
                    .label {{$t(['同类排名', '同類排名', 'Category Rank'])}}
            .body-item.body-item__right
                .item(v-for="item,index in keyList" :key="`key_${index}`")  
                    .title {{item.title}}           
                    .label(:class="getStockClass(thisFundReturn[item.key])") {{thisFundReturn[item.key] | filterRatio('+')}}         
                    .label(:class="getStockClass(categoryReturn[item.key])") {{categoryReturn[item.key] | filterRatio('+')}}           
                    .label.last 
                        span.first-num {{categoryRank[`${[item.key]}Rank`] ?`${categoryRank[`${[item.key]}Rank`]}%` : '--'}}
</template>
<script>
/**
 * @description 基金详情页年化收益模块
 * @author Aaron Lam
 * @date 2020/06/16
 */

import { mapGetters } from 'vuex'
import { getFundReturnV1 } from '@/service/finance-info-server.js'
import Vue from 'vue'
const $t = Vue.prototype.$t
export default {
    i18n: {},
    components: {},
    props: {
        fundId: {
            type: [String, Number],
            default: ''
        },
        fundHeaderInfoVO: {
            type: Object,
            default: () => {}
        }
    },
    computed: {
        ...mapGetters(['stockColorTypeClass', 'lang'])
    },
    filters: {
        filterRatio(val, symbol) {
            return val
                ? Number(val) > 0
                    ? `${symbol}${Number(val).toFixed(2)}%`
                    : `${Number(val).toFixed(2)}%`
                : '--'
        }
    },
    data() {
        return {
            keyList: [
                {
                    title: $t(['近一年', '近一年', 'Last 1-Year']),
                    key: 'nearYear'
                },
                {
                    title: $t(['近三年', '近三年', 'Last 3-Year']),
                    key: 'near3Year'
                },
                {
                    title: $t(['近五年', '近五年', 'Last 5-Year']),
                    key: 'near5Year'
                },
                {
                    title: $t(['近十年', '近十年', 'Last 10-Year']),
                    key: 'near10Year'
                }
            ],
            thisFundReturn: {},
            categoryReturn: {},
            categoryRank: {}
        }
    },
    methods: {
        showTips() {
            this.$confirm({
                title: this.$t(['年化收益', '年化收益', 'Annualized Return']),
                showCancelButton: false,
                message: this.$t([
                    '年化收益率是把当前收益率（日/月/年/持有期收益率）换算成年收益率，即让投资者大致了解到持有该产品每年能获得的收益。',
                    '年化收益率是把當前收益率（日/月/年/持有期收益率）換算整年收益率，即讓投資者大致瞭解到持有該產品每年能獲得的收益。',
                    'Annualized return is the calculation of changing current return (day/month/year/holding period return) to the yearly return for helping investors to figure out the estimated annual return on investing the product.'
                ]),
                confirmButtonText: this.$t(['我知道了', '我知道了', 'ok'])
            })
        },
        getStockClass(val) {
            return val > 0
                ? this.stockColorTypeClass.up
                : val < 0
                ? this.stockColorTypeClass.down
                : ''
        },
        async getFundReturn() {
            try {
                const params = {
                    fundId: this.fundId
                }
                let {
                    thisFundReturn = {},
                    categoryReturn = {},
                    categoryRank = {}
                } = await getFundReturnV1(params)
                this.thisFundReturn = thisFundReturn || {}
                this.categoryReturn = categoryReturn || {}
                this.categoryRank = categoryRank || {}
            } catch (e) {
                e.msg && this.$toast(e.msg)
            }
        },
        init() {
            this.getFundReturn()
        }
    },
    created() {
        this.init()
    }
}
</script>
<style lang="scss" scoped>
.fund-income-container {
    margin: 6px 0;
    background-color: $background-color;
}

.fund-income__body {
    display: flex;
    padding: 13px 0 13px 12px;
    .body-item {
        .item {
            .title {
                font-weight: 400;
            }
            .label {
                padding-top: 13px;
            }
        }
    }
    .body-item__left {
        width: 25%;
        text-align: left;
        .item {
            .title {
                display: flex;
                align-items: center;
                .iconfont {
                    font-size: 15px;
                    padding-left: 6px;
                }
            }
            .label {
                color: $text-color5;
            }
        }
    }
    .body-item__right {
        width: 75%;
        overflow-x: scroll;
        display: flex;
        text-align: center;
        .item {
            flex-shrink: 0;
            width: 76px;
            .title {
                color: $text-color5;
            }
            .label {
                font-family: yxFontDINPro-Medium;
            }
            .last {
                padding-top: 15px;
                font-size: 13px;
                font-weight: 400;
                .first-num {
                    font-weight: 500;
                }
                .last-num {
                    font-family: yxFontDINPro-Regular;
                    color: $text-color5;
                }
            }
        }
    }
}
.fund-income-container.en {
    .fund-income__body {
        .body-item {
            .title,
            .label {
                font-size: 12px;
            }
        }
    }
}
</style>
