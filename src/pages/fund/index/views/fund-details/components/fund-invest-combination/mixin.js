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
    data() {
        return {
            i18n: {
                basicMaterials: this.$t([
                    '基础材料',
                    '基礎材料',
                    'Basic Materials'
                ]),
                communicationServices: this.$t([
                    '通信服务',
                    '通信服務',
                    'Communication Services'
                ]),
                consumerCyclical: this.$t([
                    '周期性消费',
                    '週期性消費',
                    'Consumer Cyclical'
                ]),
                consumerDefensive: this.$t([
                    '非周期性消费',
                    '非週期性消費',
                    'Consumer Defensive'
                ]),
                healthCare: this.$t(['医疗保健', '醫療保健', 'Healthcare']),
                industry: this.$t(['工业', '工業', 'Industrials']),
                energy: this.$t(['能源', '能源', 'Energy']),
                financialServices: this.$t([
                    '金融服务',
                    '金融服務',
                    'Financial Services'
                ]),
                realEstate: this.$t(['房地产', '房地產', 'Real Estate']),
                technology: this.$t(['科技', '科技', 'Technology']),
                utilities: this.$t(['公用事业', '公用事業', 'Utilities']),
                bondNet: this.$t(['债券', '債券', 'BondNet']),
                cashNet: this.$t(['现金', '現金', 'CashNet']),
                convertibleNet: this.$t(['可转债', '可轉債', 'ConvertibleNet']),
                otherNet: this.$t(['其他', '其他', 'OtherNet']),
                preferredNet: this.$t(['优先股', '優先股', 'PreferredNet']),
                stockNet: this.$t(['股票', '股票', 'StockNet']),
                superSectorCashandEquivalentsNet: this.$t([
                    '现金及现金等价物',
                    '現金及現金價物',
                    'Cash & Equivalents'
                ]),
                superSectorCorporateNet: this.$t([
                    '公司债',
                    '公司債',
                    'Corporate'
                ]),
                superSectorDerivativeNet: this.$t([
                    '衍生品',
                    '衍生品',
                    'Derivative'
                ]),
                superSectorGovernmentNet: this.$t([
                    '政府债',
                    '政府債',
                    'Government'
                ]),
                superSectorMunicipalNet: this.$t([
                    '地方债',
                    '地方債',
                    'Municipal'
                ]),
                superSectorSecuritizedNet: this.$t([
                    '资产支持证券',
                    '資產支持證券',
                    'Securitized'
                ]),
                a: this.$t(['A', 'A', 'A']),
                aa: this.$t(['AA', 'AA', 'AA']),
                aaa: this.$t(['AAA', 'AAA', 'AAA']),
                b: this.$t(['B', 'B', 'B']),
                bb: this.$t(['BB', 'BB', 'BB']),
                bbb: this.$t(['BBB', 'BBB', 'BBB']),
                belowB: this.$t(['低于B', '低於B', 'BelowB']),
                notRated: this.$t(['无评级', '無評級', 'NotRated'])
            }
        }
    },
    methods: {
        showTips() {
            this.$confirm({
                // title: this.$t(['年化收益', '年化收益', 'Annualized Return']),
                showCancelButton: false,
                message: this.$t([
                    '展示数据取前两位小数，饼图由精确数据进行绘制，出现数据为0、数据累加不等于100%均为正常情况，数据仅供参考，不构成投资建议。',
                    '展示數據取前兩位小數，餅圖由精確數據進行繪製，出現數據爲0、數據累加不等於100%均爲正常情況，數據僅供參考，不構成投資建議。',
                    'The first two decimals of the display data are taken, and the pie chart is drawn with accurate data. It is normal that the data is 0 and the data accumulation is not equal to 100%. The data are for reference only and do not constitute investment advice.'
                ]),
                confirmButtonText: this.$t(['我知道了', '我知道了', 'ok'])
            })
        },
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
        }
    }
}
