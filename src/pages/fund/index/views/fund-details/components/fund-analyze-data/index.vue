<template lang="pug">
    .fund-analyze-container.fund-container(:class="lang")
        .fund-info__header
            .header__top
                .title {{fundName}}
                .desc ISIN:{{isin}}
            .header__bottom
                .item
                    span.item__label {{$t('A13')}}({{$t('currency',analyzeData.currency,lang)}})：
                    span.item__value {{changeFundSizeLang(analyzeData.fundSize,analyzeData.currency,'') || '--'}}
                .item
                    span.item__label {{$t('A12')}}：
                    span.item__value {{analyzeData.updateTime || '--'}}    
        .fund-block
            .fund-block__header.notBox
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
                            ) {{riskMeasureApiVO[`sharpeRatio${item}Yr`] ? Number(riskMeasureApiVO[`sharpeRatio${item}Yr`]).toFixed(2):'--'}}                                                    
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
                            ) {{mptStatisticsPrimaryIndexApiVO[`beta${item}Yr`] ? Number(mptStatisticsPrimaryIndexApiVO[`beta${item}Yr`]).toFixed(2):'--'}}                           
        .fund-block
            .fund-block__header
                .title 
                    span {{$t('A36')}}
                img(class="tipLink" src="@/assets/img/fund/tip.png" @click="handleGoDetail('fixedIncomeStyleBox')")
            .time(v-if="updateTime")
                span {{$t('A12')}}（{{updateTime}}）
            .fund-block__content.style-box 
                div(v-if="fixedIncomeStyleBoxNum")
                    table.table-box
                        tr
                            td(colspan="5")
                                span.result {{equityStyleBoxApiVO.fixedIncomeStyleBox | fixedIncomeStyleBox}}
                        tr
                            td &nbsp;
                            td.value( 
                                v-for="item,index in keyList2" 
                                :key="`key_${index}`"
                                :class="{'bg-color-large': index+1 === fixedIncomeStyleBoxNum}"
                                )
                            td.label {{$t('A37')}}
                        tr
                            td &nbsp;
                            td.value( 
                                v-for="item,index in keyList3" 
                                :key="`key_${index}`"
                                :class="{'bg-color-large': index+4 === fixedIncomeStyleBoxNum}"
                                )
                            td.label {{$t('A38')}}
                        tr
                            td &nbsp;
                            td.value( 
                                v-for="item,index in keyList4" 
                                :key="`key_${index}`"
                                :class="{'bg-color-large': index+7 === fixedIncomeStyleBoxNum}"
                                )
                            td.label {{$t('A40')}}
                        tr
                            td &nbsp;
                            td.label {{$t('A40')}}
                            td.label {{$t('A38')}}
                            td.label {{$t('A37')}}
                            td &nbsp;
                    .label-title.x-title {{$t('A41')}}
                    .label-title.y-title {{$t('A42')}}
                yx-no-list(v-else)
        .fund-block
            .fund-block__header
                .title 
                    span {{$t('A26')}}
                img(class="tipLink" src="@/assets/img/fund/tip.png" @click="handleGoDetail('stylebox')")
            .time(v-if="updateTime")
                span {{$t('A12')}}（{{updateTime}}） 
            .fund-block__content.style-box 
                div(v-if="equityStyleBoxNum")
                    table.table-box
                        tr
                            td(colspan="5")
                                span.result {{equityStyleBoxApiVO.equityStyleBox | filterStyleBox}}
                        tr
                            td &nbsp;
                            td.value( 
                                v-for="item,index in keyList2" 
                                :key="`key_${index}`"
                                :class="{'bg-color-large': index+1 === equityStyleBoxNum}"
                                )
                            td.label {{$t('A31')}}
                        tr
                            td &nbsp;
                            td.value( 
                                v-for="item,index in keyList2" 
                                :key="`key_${index}`"
                                :class="{'bg-color-large': index+4 === equityStyleBoxNum}"
                                )
                            td.label {{$t('A30')}}
                        tr
                            td &nbsp;
                            td.value( 
                                v-for="item,index in keyList2" 
                                :key="`key_${index}`"
                                :class="{'bg-color-large': index+7 === equityStyleBoxNum}"
                                )
                            td.label {{$t('A29')}}
                        tr
                            td &nbsp;
                            td.label {{$t('A33')}}
                            td.label {{$t('A34')}}
                            td.label {{$t('A35')}}
                            td &nbsp;
                    .label-title.x-title {{$t('A32')}}
                    .label-title.y-title {{$t('A28')}}
                yx-no-list(v-else)        
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
                '*本页面资料来源于基金管理公司、晨星资讯（深圳）有限公司（“晨星”）、其他基金服务提供供应商。所有数据截至最新净值日期（除特殊标注外）,uSMART友信对基金的业绩表现计算是按该时期的资产净值、相关类别货币计算。如有未显示年度/时期的表现，则指该年度/时期未有足够资料计算。 ',
                '*本頁面資料來源於基金管理公司、晨星資訊（深圳）有限公司（“晨星”）和/或其他基金服務提供供應商。所有數據截至最新淨值日期（除特殊標註外）,uSMART友信對基金的業績表現計算是按該時期的資產淨值、相關類別貨幣計算。如有未顯示年度/時期的表現，則指該年度/時期未有足夠資料計算。',
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
        filterFundSize(val) {
            return val && val.slice(0, -4)
        },
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
        },
        fixedIncomeStyleBox(val) {
            const styleMap = {
                1: $t([
                    '低敏感高信贷质量',
                    '低敏感高信貸質量',
                    'Low Sensitivity High Quality'
                ]),
                2: $t([
                    '中敏感高信贷质量',
                    '中敏感高信貸質量',
                    'Medium Sensitivity High Quality'
                ]),
                3: $t([
                    '高敏感高信贷质量',
                    '高敏感高信貸質量',
                    'High Sensitivity High Quality'
                ]),
                4: $t([
                    '低敏感中信贷质量',
                    '低敏感中信貸質量',
                    'Low Sensitivity Medium Quality'
                ]),
                5: $t([
                    '中敏感中信贷质量',
                    '中敏感中信貸質量',
                    'Medium Sensitivity Medium Quality'
                ]),
                6: $t([
                    '高敏感中信贷质量',
                    '高敏感中信貸質量',
                    'High Sensitivity Medium Quality'
                ]),
                7: $t([
                    '低敏感低信贷质量',
                    '低敏感低信貸質量',
                    'Low Sensitivity Low Quality'
                ]),
                8: $t([
                    '中敏感低信贷质量',
                    '中敏感低信貸質量',
                    'Medium Sensitivity Low Quality'
                ]),
                9: $t([
                    '高敏感低信贷质量',
                    '高敏感低信貸質量',
                    'High Sensitivity Low Quality'
                ])
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
            equityStyleBoxApiVO: {},
            equityStyleBoxNum: 0, // 股票投资箱高亮的方块
            fixedIncomeStyleBoxNum: 0, // 债券投资箱高亮的方块
            updateTime: '' // 更新时间
        }
    },
    methods: {
        changeFundSizeLang(fundSize, currey, type) {
            if (!type) {
                type = 1
            }
            let fundEnSize = ''
            if (this.lang === 'en' && fundSize < 100000) {
                fundEnSize = `${Number(fundSize / 1000)
                    .toFixed(3)
                    .slice(0, -1)}K`
                return fundEnSize
            }
            if (
                this.lang === 'en' &&
                fundSize >= 100000 &&
                fundSize < 100000000
            ) {
                fundEnSize = `${Number(fundSize / 1000000)
                    .toFixed(3)
                    .slice(0, -1)}M`
                return fundEnSize
            }
            if (this.lang === 'en' && fundSize >= 100000000) {
                fundEnSize = `${Number(fundSize / 1000000000)
                    .toFixed(3)
                    .slice(0, -1)}B `
                return fundEnSize
            }
            if (fundSize < 100000000 && this.lang != 'en') {
                return this.$t([
                    `${Number(fundSize / 10000)
                        .toFixed(3)
                        .slice(0, -1)}万`,
                    `${Number(fundSize / 10000)
                        .toFixed(3)
                        .slice(0, -1)}萬`
                ])
            }
            if (fundSize >= 100000000 && this.lang != 'en') {
                return this.$t([
                    `${Number(fundSize / 100000000)
                        .toFixed(3)
                        .slice(0, -1)}亿`,
                    `${Number(fundSize / 100000000)
                        .toFixed(3)
                        .slice(0, -1)}億`
                ])
            }
        },
        handleGoDetail(type) {
            let url = 'https://m.yxzq.com/webapp/market/generator.html'
            let queryString = ''
            let idMap = {}
            if (type === 'fixedIncomeStyleBox') {
                idMap = {
                    en: 11043,
                    zhCHS: 11041,
                    zhCHT: 11042
                }
                queryString = `id=${idMap[this.lang]}`
            }
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
                this.equityStyleBoxNum = Number(
                    this.equityStyleBoxApiVO.equityStyleBox
                )
                this.fixedIncomeStyleBoxNum = Number(
                    this.equityStyleBoxApiVO.fixedIncomeStyleBox
                )
                this.updateTime = this.equityStyleBoxApiVO.portfolioDate
                console.log(this.equityStyleBoxNum, this.fixedIncomeStyleBoxNum)
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        async init() {
            let { fundName, isin } = this.$route.query
            this.fundName = fundName
            this.isin = isin
            await this.getFundAnalysisData()
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
    position: sticky;
    top: 0;
    background-color: $background-color;
    border-bottom: 1px solid $background-bottom-color;
    z-index: 9999;
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
.fund-container.en {
    .fund-block {
        .fund-block__header {
            .title {
                font-size: 14px;
            }
        }
    }
}
.fund-block {
    margin-top: 6px;
    background-color: $background-color;
    .fund-block__header.notBox {
        justify-content: space-between;
    }
    .fund-block__header {
        display: flex;
        align-items: center;
        padding: 14px 10px 0;
        .title {
            font-size: 16px;
            font-weight: 500;
        }
        .link {
            font-weight: 400;
            color: $primary-color-line;
        }
        .tipLink {
            width: 20px;
            height: 20px;
            padding: 2px;
        }
    }
    .time {
        padding: 0 10px;
        font-size: 10px;
        font-weight: 400;
        color: rgba(25, 25, 25, 0.3);
    }
    .fund-block__content.style-box {
        padding-bottom: 26px;
        position: relative;
        .label-title {
            position: absolute;
            font-size: 12px;
            font-weight: 500;
            color: #191919;
        }
        .x-title {
            left: 0;
            right: 0;
            bottom: 11px;
            margin: 0 auto;
            text-align: center;
        }
        .y-title {
            right: 7%;
            top: 50%;
            height: 100%;
            margin-top: -40%;
            text-align: center;
            writing-mode: tb-rl;
            letter-spacing: 1px;
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
                    text-align: center;
                }
            }
        }
        .table-box {
            width: 90%;
            margin: 0 auto;
            text-align: center;
            td {
                width: 60px;
                height: 30px;
                font-size: 12px;
                .result {
                    font-size: 16px;
                    font-weight: 500;
                    color: #191919;
                }
            }
            td.value {
                height: 60px;
                background-color: $primary-color-line-1;
            }
            td.bg-color-small {
                background-color: $primary-color-line-3;
            }
            td.bg-color-large {
                background-color: $primary-color-line;
            }
            td.bg-color-mid {
                background-color: $primary-color-line-6;
            }
            td.label {
                color: $text-color5;
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
