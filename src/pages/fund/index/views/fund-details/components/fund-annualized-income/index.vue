<template lang="pug">
    .fund-income-container(:class="lang")
        .fund-income__body
            .body-item.body-item__left
                .item  
                    .title 年化收益           
                    .label 本基金          
                    .label 同类平均          
                    .label 同类排名          
            .body-item.body-item__right
                .item(v-for="item,index in keyList" :key="`key_${index}`")  
                    .title {{item.title}}           
                    .label(:class="getStockClass(thisFundReturn[item.key])") {{thisFundReturn[item.key] | filterRatio}}         
                    .label(:class="getStockClass(categoryReturn[item.key])") {{categoryReturn[item.key] | filterRatio}}           
                    .label {{categoryRank[`${[item.key]}Rank`]}}/{{categoryRank[`${[item.key]}Total`]}}
</template>
<script>
/**
 * @description 基金详情页年化收益模块
 * @author Aaron Lam
 * @date 2020/06/16
 */

import { mapGetters } from 'vuex'
import { getFundReturnV1 } from '@/service/finance-info-server.js'
export default {
    i18n: {},
    components: {},
    props: {
        fundId: {
            type: [String, Number],
            default: ''
        }
    },
    computed: {
        ...mapGetters(['stockColorTypeClass', 'lang'])
    },
    filters: {
        filterRatio(val) {
            return val
                ? Number(val) > 0
                    ? `+${Number(val).toFixed(2)}%`
                    : `${Number(val).toFixed(2)}%`
                : '--'
        }
    },

    data() {
        return {
            keyList: [
                { title: '近一年', key: 'nearYear' },
                { title: '近三年', key: 'near3Year' },
                { title: '近五年', key: 'near5Year' },
                { title: '近十年', key: 'near10Year' },
                { title: '今年来', key: 'toYear' }
            ],
            thisFundReturn: {},
            categoryReturn: {},
            categoryRank: {}
        }
    },
    methods: {
        getStockClass(val) {
            return val > 0
                ? this.stockColorTypeClass.up
                : val < 0
                ? this.stockColorTypeClass.down
                : ''
        },
        async getFundReturn() {
            const params = {
                fundId: this.fundId
            }
            let {
                thisFundReturn = {},
                categoryReturn = {},
                categoryRank = {}
            } = await getFundReturnV1(params)
            this.thisFundReturn = thisFundReturn
            this.categoryReturn = categoryReturn
            this.categoryRank = categoryRank
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
        }
    }
}
</style>
