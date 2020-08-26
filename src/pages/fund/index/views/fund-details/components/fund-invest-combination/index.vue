<template lang="pug">
    .fund-block-container.fund-container(:class="lang")
        .fund-info__header
            .header__top
                .title {{fundName}}
                .desc ISIN:{{isin}}
            .header__bottom
                .item
                    span.item__label {{$t(['规模','规模','FundSize'])}}({{$t('currency',investmentData.currency,lang)}})：
                    span.item__value(v-if="investmentData.fundSize") {{changeFundSizeLang(investmentData.fundSize,investmentData.currency,'') || '--'}}
                    span.item__value(v-else) {{$t(['基金公司暂未披露此信息','基金公司暫未披露此信息','The fund company has not disclosed this information'])}}
                .item(v-if="investmentData.fundSize")
                    span.item__label {{$t(['更新时间','更新時間','As of'])}}：
                    span.item__value {{investmentData.updateTime || '--'}}    
        .fund-block  
            .fund-block__content
                .content__item(v-if="assetAllocationBreakdownApiVOList.length")
                    .chart__title 
                        .title {{$t(['资产类型','資產類型','Asset Class'])}}
                        .iconfont.icon-warning(@click="showTips") 
                    ChartPie(
                        id="pie-chart-1"
                        :chartList="assetAllocationBreakdownApiVOList"
                        :updateTime="portfolioDate2"
                        )
                .content__item(v-if="globalStockSectorBreakdownApiVOList.length")    
                    .chart__title 
                        .title {{$t(['行业分布','行業分佈','Industrial Distribution'])}}
                        .iconfont.icon-warning(@click="showTips") 
                    ChartPie(
                        id="pie-chart-2"
                        :chartList="globalStockSectorBreakdownApiVOList"
                        :updateTime="portfolioDate1"
                        )
                .content__item(v-if="countryDataApiVOList.length")    
                    .chart__title 
                        .title {{$t(['投资地区','投資地區','Investment Region'])}}
                        .iconfont.icon-warning(@click="showTips") 
                    ChartPie(
                        id="pie-chart-3"
                        :chartList="countryDataApiVOList"
                        :updateTime="portfolioDate3"
                        )
                .content__item(v-if="globalBondSectorsRawApiVOList.length && !isStockType")    
                    .chart__title 
                        .title {{$t(['债券类型','債券類型','Bond Types'])}}
                        .iconfont.icon-warning(@click="showTips") 
                    ChartPie(
                        id="pie-chart-4"
                        :chartList="globalBondSectorsRawApiVOList"
                        :updateTime="portfolioDate4"
                        )
                .content__item(v-if="creditQualityBreakdownVOList.length && !isStockType")    
                    .chart__title 
                        .title {{$t(['评级分布','評級分佈','Credit Rating'])}}
                        .iconfont.icon-warning(@click="showTips") 
                    ChartPie(
                        id="pie-chart-5"
                        :chartList="creditQualityBreakdownVOList"
                        :updateTime="portfolioDate5"
                        )
        .fund-block  
            .fund-block__content
                TopTen(
                v-if="fundId"
                :fundId="fundId"
                className="fund-index"
                )                 
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
import { getFundInvestmentDataV1 } from '@/service/finance-info-server.js'
import ChartPie from './ChartPie'
import TopTen from './TopTen'
import mixin from './mixin'

export default {
    components: { ChartPie, TopTen },
    mixins: [mixin],
    props: {},
    computed: {
        isStockType() {
            // 股票类型
            return Number(this.$route.query.assetType) === 1
        },
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
            globalStockSectorBreakdownApiVOList: [],
            assetAllocationBreakdownApiVOList: [],
            countryDataApiVOList: [],
            creditQualityBreakdownVOList: [],
            globalBondSectorsRawApiVOList: [],
            portfolioDate1: '',
            portfolioDate2: '',
            portfolioDate3: '',
            portfolioDate4: '',
            portfolioDate5: ''
        }
    },
    methods: {
        sortList(dataList, type) {
            if (!dataList) return []
            let list = []
            if (type === 'object') {
                Object.keys(dataList).forEach(key => {
                    Number(dataList[key]) &&
                        list.push({
                            name: this.i18n[key],
                            percent: +Number(dataList[key] || 0).toFixed(2),
                            a: '1'
                        })
                })
            }
            if (type === 'countryDataApiVOList') {
                list = dataList.map(item => {
                    return {
                        name: item.country,
                        percent: +Number(item.value).toFixed(2),
                        a: '1'
                    }
                })
            }
            // 降序排序
            list = list
                .filter(item => Number(item.percent))
                .sort((a, b) => {
                    return b.percent - a.percent
                })
            console.log(list)
            return list
        },
        async getFundInvestmentData() {
            try {
                const params = {
                    fundId: this.fundId
                }
                this.investmentData = await getFundInvestmentDataV1(params)
                const item1 = this.investmentData
                    .globalStockSectorBreakdownApiVO
                const item2 = this.investmentData.assetAllocationBreakdownApiVO
                const item3 = this.investmentData.countryDataApiVOList
                const item4 = this.investmentData.globalBondSectorsRawApiVO
                const item5 = this.investmentData.creditQualityBreakdownVO

                this.portfolioDate1 = item1 && item1.portfolioDate
                this.portfolioDate2 = item2 && item2.portfolioDate
                this.portfolioDate3 =
                    this.investmentData &&
                    this.investmentData.countryPortfolioDate
                this.portfolioDate4 = item4 && item4.portfolioDate
                this.portfolioDate5 = item5 && item5.portfolioDate

                this.globalStockSectorBreakdownApiVOList = this.sortList(
                    item1,
                    'object'
                )
                this.assetAllocationBreakdownApiVOList = this.sortList(
                    item2,
                    'object'
                )
                this.countryDataApiVOList = this.sortList(
                    item3,
                    'countryDataApiVOList'
                )
                this.globalBondSectorsRawApiVOList = this.sortList(
                    item4,
                    'object'
                )
                this.creditQualityBreakdownVOList = this.sortList(
                    item5,
                    'object'
                )
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        async init() {
            let { fundName, isin, fundId } = this.$route.query
            this.fundName = fundName
            this.isin = isin
            this.fundId = fundId
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
    z-index: 999;
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
            display: flex;
            font-size: 16px;
            font-weight: 500;
            padding-top: 14px;
            .title {
                position: relative;
                &::before {
                    content: ' ';
                    position: absolute;
                    width: 4px;
                    left: -12px;
                    height: 100%;
                    background-color: $primary-color;
                }
            }
        }
    }
}
.yx-no-list {
    padding-bottom: 10px;
}
</style>
