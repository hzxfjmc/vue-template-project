import { getBondDetail } from '@/service/finance-info-server.js'
import { getCurrentUser } from '@/service/user-server.js'
import jsBridge from '@/utils/js-bridge'
import { Panel } from 'vant'
import { mapState } from 'vuex'
export default {
    name: 'BondList',
    components: {
        [Panel.name]: Panel
    },
    created() {
        this.id = this.$route.query.id - 0

        // 获取债券详情
        this.handleGetBondDetail()

        // 获取用户信息--主要拿签名状态
        this.handleGetCurrentUser()
    },
    data() {
        return {
            bondEditableInfo: {},
            bondUneditableInfo: {},
            currentPrice: {},
            prices: [],
            id: 0,
            bondName: '',
            extendStatusBit: 0 // 用户扩展状态
        }
    },
    computed: {
        ...mapState(['user']),
        isSigned() {
            // 转成 2 进制
            let bit = this.extendStatusBit.toString(2)
            // 取值，从右往左数第四位，既是签名的状态
            return bit.slice(-4, -3) - 0
        }
    },
    methods: {
        // 获取债券详情
        async handleGetBondDetail() {
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
        // 获取用户信息--主要拿签名状态
        async handleGetCurrentUser() {
            try {
                let { extendStatusBit } = getCurrentUser()
                this.extendStatusBit = (extendStatusBit && extendStatusBit) || 0
                console.log('getCurrentUser:error:>>>', extendStatusBit)
            } catch (error) {
                console.log('getCurrentUser:error:>>>', error)
            }
        },
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
            // 买入还是卖出
            let direction = type === 'buy' ? 1 : 2
            // 未签名，跳转到签名页面
            if (!this.isSigned) {
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
