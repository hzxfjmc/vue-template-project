import { hsAccountInfo } from '@/service/stock-capital-server.js'
export default {
    name: 'TransactionBuy',
    created() {
        this.handleHsAccountInfo()
    },
    data() {
        return {
            accountInfo: {} // 用户恒生资金账户信息
        }
    },
    methods: {
        async handleHsAccountInfo() {
            try {
                let data = await hsAccountInfo(1)
                this.accountInfo = data || {}
                console.log('hsAccountInfo:data:>>>', data)
            } catch (error) {
                console.log('hsAccountInfo:error:>>>', error)
            }
        }
    }
}
