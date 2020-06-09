<template lang="pug">
    .fund-analyze-container.fund-container
        .fund-info__header
            .header__top
                .title {{fundName}}
                .desc ISIN:{{isin}}
            .header__bottom
                .item
                    span.item__label 基金规模({{$t('currency',analyzeData.currency,lang)}})：
                    span.item__value {{analyzeData.fundSize}}
                .item
                    span.item__label 数据更新时间：
                    span.item__value {{analyzeData.updateTime}}    
        .fund-block
            .fund-block__header
                .title 风险指标
                .link 指标说明 
            .fund-block__content
                table.table
                    tr
                        th 指标                             
                        th 1年                           
                        th 3年                           
                        th 5年   
                    tr
                        td 夏普比率                            
                        td {{riskMeasureApiVO.sharpeRatio1Yr}}                           
                        td {{riskMeasureApiVO.sharpeRatio3Yr}}                           
                        td {{riskMeasureApiVO.sharpeRatio5Yr}}                            
                    tr
                        td 最大回撤                            
                        td {{riskMeasureApiVO.maxDrawDown1Yr}}                           
                        td {{riskMeasureApiVO.maxDrawDown3Yr}}                            
                        td {{riskMeasureApiVO.maxDrawDown5Yr}}                            
                    tr
                        td 上行捕获比                            
                        td {{relativeRiskMeasureCategoryApiVO.captureRatioUpside1Yr}}                            
                        td {{relativeRiskMeasureCategoryApiVO.captureRatioUpside3Yr}}                            
                        td {{relativeRiskMeasureCategoryApiVO.captureRatioUpside5Yr}}                            
                    tr
                        td 下行捕获比                            
                        td {{relativeRiskMeasureCategoryApiVO.captureRatioDownside1Yr}}                            
                        td {{relativeRiskMeasureCategoryApiVO.captureRatioDownside3Yr}}                            
                        td {{relativeRiskMeasureCategoryApiVO.captureRatioDownside5Yr}}                            
                    tr
                        td Alpha                            
                        td {{mptStatisticsPrimaryIndexApiVO.alpha1Yr}}                            
                        td {{mptStatisticsPrimaryIndexApiVO.alpha3Yr}}                            
                        td {{mptStatisticsPrimaryIndexApiVO.alpha5Yr}}                            
                    tr
                        td Beta                            
                        td {{mptStatisticsPrimaryIndexApiVO.beta1Yr}}                            
                        td {{mptStatisticsPrimaryIndexApiVO.beta3Yr}}                            
                        td {{mptStatisticsPrimaryIndexApiVO.beta5Yr}}                             
        .fund-block
            .fund-block__header
                .title 投资风格箱（大盘平衡型）
                .link 风格箱说明 
            .fund-block__content 
                table.table-box
                    tr
                        td &nbsp;
                        td &nbsp;
                        td &nbsp;
                        td &nbsp;
                        td.label-title （规模）
                    tr
                        td &nbsp;
                        td.value.td-col-1 2
                        td.value.td-col-2 1
                        td.value.td-col-3 1
                        td.label 大盘
                    tr
                        td &nbsp;
                        td.value 1
                        td.value 1
                        td.value 1
                        td.label 中盘
                    tr
                        td &nbsp;
                        td.value 1
                        td.value 1
                        td.value 1
                        td.label 小盘
                    tr
                        td.label-title （风格）
                        td.label 价值型
                        td.label 平衡型
                        td.label 成长型
                        td &nbsp;
        .fund-block
             .fund-block__content
                p.text *本页面资料来源于基金管理公司、晨星资讯（深圳）有限公司（“晨星”）、其他基金服务提供供应商。所有数据截至最新净值日期（除特殊标注外）,友信对基金的业绩表现计算是按该时期的资产净值、相关类别货币计算。如有未显示年度/时期的表现，则指该年度/时期未有足够资料计算。                                
                p.text 相关数据仅供参考，本页面非任何法律文件，投资前请阅读基金合同，招募说明书。基金过往业绩不预示未来表现，不构成投资建议，市场有风险,投资需谨慎。                               
</template>
<script>
/**
 * @description 基金详情页分析数据模块
 * @author Aaron Lam
 * @date 2020/06/08
 */
import { mapGetters } from 'vuex'
import { getFundAnalysisDataV1 } from '@/service/finance-info-server.js'
import { CURRENCY_NAME } from '@/pages/fund/index/map'

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
    components: {},
    props: {
        fundId: {
            type: [String, Number],
            default: ''
        }
    },
    computed: {
        ...mapGetters(['lang'])
    },
    data() {
        return {
            fundName: '',
            isin: '',
            analyzeData: {},
            mptStatisticsPrimaryIndexApiVO: {},
            relativeRiskMeasureCategoryApiVO: {},
            riskMeasureApiVO: {}
        }
    },
    methods: {
        async getFundAnalysisData() {
            try {
                const params = {
                    fundId: this.$route.query.fundId
                }
                this.analyzeData = await getFundAnalysisDataV1(params)
                this.mptStatisticsPrimaryIndexApiVO =
                    this.analyzeData.mptStatisticsPrimaryIndexApiVO || {}
                this.relativeRiskMeasureCategoryApiVO =
                    this.analyzeData.relativeRiskMeasureCategoryApiVO || {}
                this.riskMeasureApiVO = this.analyzeData.riskMeasureApiVO || {}
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
