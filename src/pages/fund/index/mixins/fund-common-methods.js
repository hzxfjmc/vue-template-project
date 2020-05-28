import { mapGetters } from 'vuex'
import { CURRENCY_NAME } from '@/pages/fund/index/map'
export default {
    name: 'fund-common-methods',
    ...mapGetters(['lang']),
    methods: {
        changeFundSizeLang(fundSize, currey, type) {
            if (!type) {
                type = 1
            }
            let fundEnSize = ''
            const curreyType = CURRENCY_NAME[this.lang][currey]
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
            if (fundSize < 100000000 && this.lang != 'en') {
                return this.$t([
                    `${Number(fundSize / 10000).toFixed(2)}万${curreyType}${
                        type === 1 ? '规模' : ''
                    }`,
                    `${Number(fundSize / 10000).toFixed(2)}万${curreyType}${
                        type === 1 ? '规模' : ''
                    }`
                ])
            }
            if (fundSize >= 100000000 && this.lang != 'en') {
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
