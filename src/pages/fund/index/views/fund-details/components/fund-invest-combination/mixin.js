export default {
    data() {
        return {
            i18n: {
                basicMaterials: this.$t([
                    '基础材料',
                    '基础材料',
                    'Basic Materials'
                ]),
                communicationServices: this.$t([
                    '通信服务',
                    '通信服务',
                    'Communication Services'
                ]),
                consumerCyclical: this.$t([
                    '周期性消费',
                    '周期性消费',
                    'Consumer Cyclical'
                ]),
                consumerDefensive: this.$t([
                    '非周期性消费',
                    '非周期性消费',
                    'Consumer Defensive'
                ]),
                healthCare: this.$t(['医疗保健', '医疗保健', 'Healthcare']),
                industry: this.$t(['工业', '工业', 'Industrials']),
                energy: this.$t(['能源', '能源', 'Energy']),
                financialServices: this.$t([
                    '金融服务',
                    '金融服务',
                    'Financial Services'
                ]),
                realEstate: this.$t(['房地产', '房地产', 'Real Estate']),
                technology: this.$t(['科技', '科技', 'Technology']),
                utilities: this.$t(['公用事业', '公用事业', 'Utilities'])
            }
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
        }
    }
}
