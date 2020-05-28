import { mapGetters } from 'vuex'
export default {
    name: 'fund-common-methods',
    ...mapGetters(['lang']),
    methods: {
        changeFundSizeLang(fundSize, currey, type) {
            if (!type) {
                type = 1
            }
            let fundEnSize = ''
            let curreyEunm = {
                1: this.$t([`美元`, `美元`, `USD`]),
                2: this.$t([`港币`, `港幣`, `HKD`])
            }
            const curreyType = curreyEunm[currey]
            if (this.lang === 'en' && fundSize < 100000) {
                fundEnSize = `AUM ${Number(fundSize / 1000).toFixed(
                    2
                )}K ${curreyType}`
                return fundEnSize
            }
            if (
                this.lang === 'en' &&
                fundSize >= 100000 &&
                fundSize < 100000000
            ) {
                fundEnSize = `AUM ${Number(fundSize / 1000000).toFixed(
                    2
                )}M ${curreyType}`
                return fundEnSize
            }
            if (this.lang === 'en' && fundSize >= 100000000) {
                fundEnSize = `AUM ${Number(fundSize / 1000000000).toFixed(
                    2
                )}B ${curreyType}`
                return fundEnSize
            }
            if (fundSize < 10000000 && this.lang != 'en') {
                return this.$t([
                    `${Number(fundSize / 10000).toFixed(2)}万${curreyType}${
                        type === 1 ? '规模' : ''
                    }`,
                    `${Number(fundSize / 10000).toFixed(2)}万${curreyType}${
                        type === 1 ? '规模' : ''
                    }`
                ])
            }
            if (fundSize > 10000000 && this.lang != 'en') {
                return this.$t([
                    `${Number(fundSize / 100000000).toFixed(2)}亿${curreyType}${
                        type === 1 ? '规模' : ''
                    }`,
                    `${Number(fundSize / 100000000).toFixed(2)}億${curreyType}${
                        type === 1 ? '规模' : ''
                    }`
                ])
            }
        }
    }
}
