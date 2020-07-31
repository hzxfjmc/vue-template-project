<template lang="pug">
    .fund-block-container.fund-container(:class="lang")
        .fund-info__header
            .header__top
                .title {{fundName}}
                .desc ISIN:{{isin}}
            .header__bottom
                .item
                    span.item__label 更新时间：
                    span.item__value {{investmentData.updateTime || '--'}}    
                .item
                    span.item__label 规模({{$t('currency',investmentData.currency,lang)}})：
                    span.item__value {{changeFundSizeLang(investmentData.fundSize,investmentData.currency,'') || '--'}}
        .fund-block  
            .fund-block__content
                .content__item
                    .chart__title 资产类型
                    ChartPie(
                        id="pie-chart-1"
                        v-if="globalStockSectorBreakdownList.length"
                        :chartList="globalStockSectorBreakdownList")
                .content__item    
                    .chart__title 行业分布
                    ChartPie(
                        id="pie-chart-2"
                        v-if="globalStockSectorBreakdownList.length"
                        :chartList="globalStockSectorBreakdownList")
                .content__item    
                    .chart__title 投资地区
                    ChartPie(
                        id="pie-chart-3"
                        v-if="globalStockSectorBreakdownList.length"
                        :chartList="globalStockSectorBreakdownList")
                .content__item    
                    .chart__title 债券类型
                    ChartPie(
                        id="pie-chart-4"
                        v-if="globalStockSectorBreakdownList.length"
                        :chartList="globalStockSectorBreakdownList")
                .content__item    
                    .chart__title 评级分布
                    ChartPie(
                        id="pie-chart-5"
                        v-if="globalStockSectorBreakdownList.length"
                        :chartList="globalStockSectorBreakdownList")
                .content__item    
                    .chart__title 国家地区
                    ChartPie(
                        id="pie-chart-6"
                        v-if="globalStockSectorBreakdownList.length"
                        :chartList="globalStockSectorBreakdownList")
        .fund-block
             .fund-block__content
                p.text {{text1}}                               
                p.text {{text2}}                        
</template>
<script>
/**
 * @description 基金详情页投资组合
 * @author Aaron Lam
 * @date 2020/07/31
 */

import { mapGetters } from 'vuex'
import {
    getFundTop10HoldingsV1,
    getFundInvestmentDataV1
} from '@/service/finance-info-server.js'
import { CURRENCY_NAME } from '@/pages/fund/index/map'
import ChartPie from './chart-pie'
import mixin from './mixin'

const getCurrencyName = (val, lang) => {
    return CURRENCY_NAME[lang][val]
}

export default {
    i18n: {
        en: {
            currency: getCurrencyName
        },
        zhCHS: {
            currency: getCurrencyName
        },
        zhCHT: {
            currency: getCurrencyName
        }
    },
    components: { ChartPie },
    mixins: [mixin],
    props: {},
    computed: {
        ...mapGetters(['lang']),
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

    data() {
        return {
            fundName: '',
            isin: '',
            fundId: '',
            investmentData: {},
            globalStockSectorBreakdownList: []
        }
    },
    methods: {
        async getFundTop10Holdings() {
            try {
                const params = {
                    fundId: this.fundId
                }
                const list = (await getFundTop10HoldingsV1(params)) || []
                list.forEach((item, index) => {
                    if (index === 0) {
                        item.width = 100
                    } else {
                        item.width = Number(
                            (list[index].weighting / list[0].weighting) * 100
                        ).toFixed(2)
                    }
                })
                this.holdingsList = list
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        async getFundInvestmentData() {
            try {
                const params = {
                    fundId: this.fundId
                }
                this.investmentData = await getFundInvestmentDataV1(params)
                const item = this.investmentData.globalStockSectorBreakdownApiVO
                let dataList = []
                Object.keys(item).forEach(key => {
                    dataList.push({
                        name: this.i18n[key],
                        percent: +Number(item[key]).toFixed(2),
                        a: '1'
                    })
                })
                // 降序排序
                dataList = dataList.sort((a, b) => {
                    return b.percent - a.percent
                })
                this.globalStockSectorBreakdownList = dataList
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        async init() {
            let { fundName, isin, fundId } = this.$route.query
            this.fundName = fundName
            this.isin = isin
            this.fundId = fundId
            this.getFundTop10Holdings()
            this.getFundInvestmentData()
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
        .text {
            font-size: 12px;
            padding: 12px 0;
            color: $text-color5;
        }
        .chart__title {
            font-size: 16px;
            font-weight: 500;
            padding-top: 14px;
        }
    }
}
</style>
