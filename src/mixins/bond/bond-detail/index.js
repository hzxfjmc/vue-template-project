import { getBondDetail } from '@/service/finance-info-server.js'
import jsBridge from '@/utils/js-bridge'
import { Panel } from 'vant'
import { mapState } from 'vuex'
export default {
    name: 'BondList',
    components: {
        [Panel.name]: Panel
    },
    async created() {
        this.id = this.$route.query.id - 0
        try {
            let {
                bondEditableInfo,
                bondUneditableInfo,
                currentPrice,
                prices
            } = await getBondDetail(this.id)

            this.bondEditableInfo = bondEditableInfo || {}
            this.bondUneditableInfo = bondUneditableInfo || {}
            this.currentPrice = currentPrice || {}
            this.prices = prices || []
            this.bondName =
                (this.bondEditableInfo.issuer &&
                    this.bondEditableInfo.issuer.name) ||
                '--'
            console.log(
                'getBondDetail:data:>>> ',
                bondEditableInfo,
                bondUneditableInfo,
                currentPrice,
                prices
            )
        } catch (e) {
            console.log('getBondDetail:error:>>>', e)
        }
    },
    data() {
        return {
            bondEditableInfo: {},
            bondUneditableInfo: {},
            currentPrice: {},
            prices: [],
            id: 0,
            bondName: ''
        }
    },
    computed: {
        ...mapState(['user'])
    },
    methods: {
        async handleBuyOrSell(type) {
            // 未登录或未开户
            if (!this.user) {
                await this.$dialog.alert({
                    message: '用户信息丢失，请登陆'
                })
                jsBridge.gotoNativeModule('yxzq_goto://user_login')
                return
            }
            if (!this.user.openedAccount) {
                // 跳转到开户页面
                await this.$dialog.alert({
                    message: '未开户，请先去开户'
                })
                jsBridge.gotoNativeModule('yxzq_goto://main_trade')
                return
            }
            // 未签名，跳转到签名页面
            if (!this.user.bondSigned && !localStorage.isSigned) {
                this.$router.push({
                    path: '/risk-warning',
                    query: {
                        id: this.id,
                        bondName: this.bondName,
                        direction
                    }
                })
                return
            }

            // 买入还是卖出
            let direction = type === 'buy' ? 1 : 2
            this.$router.push({
                path: '/risk-appropriate-result',
                query: {
                    id: this.id,
                    bondName: this.bondName,
                    direction
                }
            })
        }
    }
}
