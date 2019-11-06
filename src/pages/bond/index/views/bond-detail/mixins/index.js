import YxContainerBetter from '@/components/yx-container-better'
import { getBondDetail } from '@/service/finance-info-server.js'
import { getCurrentUser } from '@/service/user-server.js'
import jsBridge from '@/utils/js-bridge'
import { Panel, PullRefresh } from 'vant'
import { mapState } from 'vuex'
export default {
    name: 'BondList',
    components: {
        [Panel.name]: Panel,
        [PullRefresh.name]: PullRefresh,
        YxContainerBetter
    },
    created() {
        this.id = this.$route.query.id - 0

        // 获取债券详情
        this.handleGetBondDetail()

        // 获取用户信息--主要拿签名状态
        this.handleGetCurrentUser()

        // 定时更新行情数据
        this.handleUpdateBondDetail()
    },
    data() {
        return {
            bondEditableInfo: {},
            bondUneditableInfo: {},
            currentPrice: {},
            paymentAfterTaxPerYear: '',
            paymentInfo: {},
            prices: [],
            id: 0,
            bondName: '',
            extendStatusBit: 0, // 用户扩展状态

            isLoading: false, // 下拉刷新

            updateTimer: null // 定时更新行情数据计时器
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
        // 定时更新行情数据
        handleUpdateBondDetail() {
            clearInterval(this.updateTimer)
            this.updateTimer = setInterval(() => {
                this.handleGetBondDetail()
            }, 30 * 1000)
        },
        // 下拉刷新
        onRefresh() {
            Promise.all([
                this.handleGetBondDetail(),
                this.handleGetCurrentUser()
            ])
                .then(() => {
                    this.isLoading = false
                })
                .finally(() => {
                    this.isLoading = false
                })
        },
        // 获取债券详情
        async handleGetBondDetail() {
            try {
                let {
                    bondEditableInfo,
                    bondUneditableInfo,
                    currentPrice,
                    paymentAfterTaxPerYear,
                    paymentInfo,
                    prices
                } = await getBondDetail(this.id)

                this.bondEditableInfo = bondEditableInfo || {}
                this.bondUneditableInfo = bondUneditableInfo || {}
                this.currentPrice = currentPrice || {}
                this.paymentAfterTaxPerYear = paymentAfterTaxPerYear || ''
                this.paymentInfo = paymentInfo || {}
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
                console.log('getCurrentUser:data:>>>', extendStatusBit)
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
            let direction = 2,
                path = '/transaction-sell'
            if (type === 'buy') {
                direction = 1
                path = '/risk-appropriate-result'
            }
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
                path,
                query: {
                    id: this.id,
                    bondName: this.bondName,
                    direction
                }
            })
        }
    }
}
