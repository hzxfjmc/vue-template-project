<template lang="pug">
    .fund-analyze-container.fund-container
        .fund-info__header
            .header__top
                .title {{fundName}}
                .desc ISIN:{{isin}}
            .header__bottom
                .item
                    span.item__label {{$t('A13')}}({{$t('currency',analyzeData.currency,lang)}})：
                    span.item__value {{(analyzeData.fundSize/100000000).toFixed(2)}} {{$t('unit')}}
                .item
                    span.item__label {{$t('A12')}}：
                    span.item__value {{analyzeData.updateTime}}    
        .fund-block
            .fund-block__header
                .title {{$t('A14')}}
                .link(@click="handleGoDetail('risk')") {{$t('A15')}} 
            .fund-block__content
                table.table
                    tr
                        th {{$t('A16')}}                             
                        th {{$t('A23')}}                           
                        th {{$t('A24')}}                           
                        th {{$t('A25')}}                              
                    tr
                        td {{$t('A17')}}                            
                        td(
                            v-for="item,index in keyList1" 
                            :key="`key_${index}`"
                            ) {{riskMeasureApiVO[`sharpeRatio${item}Yr`] | filterRatio}}                                                    
                    tr
                        td {{$t('A18')}}  
                        td(
                            v-for="item,index in keyList1" 
                            :key="`key_${index}`"
                            ) {{riskMeasureApiVO[`maxDrawDown${item}Yr`] | filterRatio}}                                                        
                    tr
                        td {{$t('A19')}}   
                        td(
                            v-for="item,index in keyList1" 
                            :key="`key_${index}`"
                            ) {{relativeRiskMeasureCategoryApiVO[`captureRatioUpside${item}Yr`] | filterRatio}}                                                       
                    tr
                        td {{$t('A20')}}     
                        td(
                            v-for="item,index in keyList1" 
                            :key="`key_${index}`"
                            ) {{relativeRiskMeasureCategoryApiVO[`captureRatioDownside${item}Yr`] | filterRatio}}                                                     
                    tr
                        td {{$t('A21')}}        
                        td(
                            v-for="item,index in keyList1" 
                            :key="`key_${index}`"
                            ) {{mptStatisticsPrimaryIndexApiVO[`alpha${item}Yr`] | filterRatio}}                                                 
                    tr
                        td {{$t('A22')}}    
                        td(
                            v-for="item,index in keyList1" 
                            :key="`key_${index}`"
                            ) {{mptStatisticsPrimaryIndexApiVO[`beta${item}Yr`] | filterRatio}}                           
        .fund-block
            .fund-block__header
                .title {{$t('A26')}}（{{equityStyleBoxApiVO.equityStyleBox | filterStyleBox}}）
                .link(@click="handleGoDetail('stylebox')") {{$t('A27')}} 
            .fund-block__content 
                table.table-box
                    tr
                        td &nbsp;
                        td &nbsp;
                        td &nbsp;
                        td &nbsp;
                        td.label-title （{{$t('A28')}}）
                    tr
                        td &nbsp;
                        td.value( 
                            v-for="item,index in keyList2" 
                            :key="`key_${index}`"
                            :class="`td-col-${index+1}`"
                            ) {{styleBoxBreakDown[item] | filterRatio}}
                        td.label {{$t('A31')}}
                    tr
                        td &nbsp;
                        td.value( 
                            v-for="item,index in keyList3" 
                            :key="`key_${index}`"
                            ) {{styleBoxBreakDown[item] | filterRatio}}
                        td.label {{$t('A30')}}
                    tr
                        td &nbsp;
                        td.value( 
                            v-for="item,index in keyList3" 
                            :key="`key_${index}`"
                            ) {{styleBoxBreakDown[item] | filterRatio}}
                        td.label {{$t('A29')}}
                    tr
                        td.label-title （{{$t('A32')}}）
                        td.label {{$t('A33')}}
                        td.label {{$t('A34')}}
                        td.label {{$t('A35')}}
                        td &nbsp;
        .fund-block
             .fund-block__content
                p.text {{text1}}                               
                p.text {{text2}}                        
</template>
<script>
/**
 * @description 基金详情页分析数据模块
 * @author Aaron Lam
 * @date 2020/06/08
 */

import Vue from 'vue'
import { mapGetters } from 'vuex'
import { getFundAnalysisDataV1 } from '@/service/finance-info-server.js'
import { CURRENCY_NAME } from '@/pages/fund/index/map'
import i18n from './i18n'
import { jumpUrl } from '@/utils/tools.js'

const $t = Vue.prototype.$t

const getCurrencyName = (val, lang) => {
    return CURRENCY_NAME[lang][val]
}

export default {
    i18n: {
        en: {
            ...i18n.en,
            currency: getCurrencyName
        },
        zhCHS: {
            ...i18n.zhCHS,
            currency: getCurrencyName
        },
        zhCHT: {
            ...i18n.zhCHT,
            currency: getCurrencyName
        }
    },
    props: {
        fundId: {
            type: [String, Number],
            default: ''
        }
    },
    computed: {
        ...mapGetters(['lang']),
        styleBoxBreakDown() {
            return this.equityStyleBoxApiVO.styleBoxBreakDown || {}
        },
        text1() {
            return this.$t([
                '*本页面资料来源于基金管理公司、晨星资讯（深圳）有限公司（“晨星”）、其他基金服务提供供应商。所有数据截至最新净值日期（除特殊标注外）,友信对基金的业绩表现计算是按该时期的资产净值、相关类别货币计算。如有未显示年度/时期的表现，则指该年度/时期未有足够资料计算。 ',
                '*本頁面資料來源於基金管理公司、晨星資訊（深圳）有限公司（“晨星”）和/或其他基金服務提供供應商。所有數據截至最新淨值日期（除特殊標註外）,友信對基金的業績表現計算是按該時期的資產淨值、相關類別貨幣計算。如有未顯示年度/時期的表現，則指該年度/時期未有足夠資料計算。',
                "* The information on this page comes from fund management companies, Morningstar ShenZhen Limited（“Morningstar”）and/or fund service providers. All data are up to the date of the latest net worth (unless otherwise specified). uSMART calculates the fund's performance on a NAV-to-NAV basis in the relevant share class currency. Whenever there is no past performance shown, no sufficient data available in that year to calculate performance."
            ])
        },
        text2() {
            return this.$t([
                '相关数据仅供参考，本页面非任何法律文件，投资前请阅读基金合同，招募说明书。基金过往业绩不预示未来表现，不构成投资建议，市场有风险,投资需谨慎。',
                '相關數據僅供參考，本頁面非任何法律文件，投資前請閱讀基金合同，招募說明書。基金過往業績不預示未來表現，不構成投資建議，市場有風險,投資需謹慎。',
                'The relevant data is for reference only. This page is not a legal document. Please carefully read the fund’s prospectus before investing. Past performance is not an indicator of future performance. All investments involve risk. Investors should consider all available information before making any investment decisions.'
            ])
        }
    },
    filters: {
        filterRatio(val) {
            return val ? `${Number(val).toFixed(2)}%` : `--`
        },
        filterStyleBox(val) {
            const styleMap = {
                1: $t(['大盘价值型', '大盤價值型', 'Large Value']),
                2: $t(['大盘平衡型', '大盤平衡型', 'Large Blend']),
                3: $t(['大盘成长型', '大盤成長型', 'Large Growth']),
                4: $t(['中盘价值型', '中盤價值型', 'Mid Value']),
                5: $t(['中盘平衡型', '中盤平衡型', 'Mid Blend']),
                6: $t(['中盘成长型', '中盤成長型', 'Mid Growth']),
                7: $t(['小盘价值型', '小盤價值型', 'Small Value']),
                8: $t(['小盘平衡型', '小盤平衡型', 'Small Blend']),
                9: $t(['小盘成长型', '小盤成長型', 'Small Growth'])
            }
            return styleMap[val]
        }
    },
    data() {
        return {
            keyList1: [1, 3, 5],
            keyList2: ['largeValue', 'largeBlend', 'largeGrowth'],
            keyList3: ['midValue', 'midBlend', 'midGrowth'],
            keyList4: ['smallValue', 'smallBlend', 'smallGrowth'],
            fundName: '',
            isin: '',
            analyzeData: {},
            mptStatisticsPrimaryIndexApiVO: {},
            relativeRiskMeasureCategoryApiVO: {},
            riskMeasureApiVO: {},
            equityStyleBoxApiVO: {}
        }
    },
    methods: {
        handleGoDetail(type) {
            let url = 'https://m.yxzq.com/webapp/market/generator.html'
            let queryString = ''
            let idMap = {}
            if (type === 'stylebox') {
                idMap = {
                    en: 10879,
                    zhCHS: 10872,
                    zhCHT: 10800
                }
                queryString = `id=${idMap[this.lang]}`
            }
            if (type === 'risk') {
                idMap = {
                    en: 10878,
                    zhCHS: 10875,
                    zhCHT: 10877
                }
                queryString = `id=${idMap[this.lang]}`
            }
            jumpUrl('', `${url}?${queryString}`)
        },
        async getFundAnalysisData() {
            try {
                const params = {
                    fundId: this.$route.query.fundId
                }
                this.analyzeData = await getFundAnalysisDataV1(params)
                ;[
                    'mptStatisticsPrimaryIndexApiVO',
                    'relativeRiskMeasureCategoryApiVO',
                    'riskMeasureApiVO',
                    'equityStyleBoxApiVO'
                ].forEach(key => {
                    this[key] = this.analyzeData[key] || {}
                })
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        init() {
            let { fundName, isin } = this.$route.query
            this.fundName = fundName
            this.isin = isin
            this.getFundAnalysisData()
        }
    },
    created() {
        this.init()
    }
}
</script>
<style lang="scss" scoped>
.fund-container {
    background-color: $background-bottom-color;
}
.fund-info__header {
    background-color: $background-color;
    .header__top {
        padding: 20px 12px 14px;
        border-bottom: 1px solid $text-color8;
        .title {
            font-size: 16px;
            font-weight: 400;
            line-height: 22px;
            color: $text-color;
        }
        .desc {
            font-size: 12px;
            font-weight: 400;
            color: $text-color5;
            line-height: 18px;
        }
    }
    .header__bottom {
        padding: 10px 12px;
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        .item__label {
            color: $text-color5;
        }
    }
}
.fund-block {
    margin-top: 6px;
    background-color: $background-color;
    .fund-block__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 10px;
        .title {
            font-size: 16px;
            font-weight: 500;
        }
        .link {
            font-weight: 400;
            color: $primary-color-line;
        }
    }
    .fund-block__content {
        padding: 0 12px;
        .table {
            width: 100%;
            text-align: center;

            th {
                color: $text-color5;
                font-size: 12px;
            }
            th,
            td {
                padding: 10px 0;
                border-bottom: 1px solid $text-color8;
                &:first-child {
                    width: 30%;
                    text-align: left;
                }
                &:last-child {
                    text-align: right;
                }
            }
        }
        .table-box {
            width: 90%;
            margin: 0 auto;
            text-align: center;
            padding-bottom: 15px;
            td {
                width: 60px;
                height: 30px;
                font-size: 12px;
            }
            td.value {
                height: 60px;
                background-color: $primary-color-line-1;
            }
            td.td-col-1 {
                background-color: $primary-color-line-3;
            }
            td.td-col-2 {
                background-color: $primary-color-line;
            }
            td.td-col-3 {
                background-color: $primary-color-line-6;
            }
            td.label {
                color: $text-color5;
            }
            td.label-title {
                color: $text-color2;
            }
        }
        .text {
            font-size: 12px;
            padding: 12px 0;
            color: $text-color5;
        }
    }
}
</style>
