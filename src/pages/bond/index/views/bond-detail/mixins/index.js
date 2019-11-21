import YxContainerBetter from '@/components/yx-container-better'
import { getBondDetail } from '@/service/finance-info-server.js'
import { getCurrentUser } from '@/service/user-server.js'
import jsBridge from '@/utils/js-bridge'
import { Panel, PullRefresh } from 'vant'
import { mapState, mapGetters } from 'vuex'
import { enumMarketName } from '@/utils/common/global-enum'
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
            bindStock: {}, // 绑定的股票
            extendStatusBit: 0, // 用户扩展状态

            isLoading: false, // 下拉刷新

            updateTimer: null // 定时更新行情数据计时器
        }
    },
    computed: {
        ...mapState(['user']),
        ...mapGetters(['appType']),
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
                    paymentInfo,
                    prices
                } = await getBondDetail(this.id)

                this.bondEditableInfo = bondEditableInfo || {}
                this.bondUneditableInfo = bondUneditableInfo || {}
                this.currentPrice = currentPrice || {}
                this.paymentInfo = paymentInfo || {}
                this.paymentAfterTaxPerYear =
                    this.paymentInfo.paymentAfterTaxPerYear || ''
                this.prices = prices || []
                this.bondName =
                    (this.bondEditableInfo.issuer &&
                        this.bondEditableInfo.issuer.name) ||
                    '--'

                // 是否有绑定股票，有则右上角展示查看股票
                this.bindStock =
                    (bondEditableInfo && bondEditableInfo.bindStock) || {}
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
                let { extendStatusBit } = await getCurrentUser()
                this.extendStatusBit = (extendStatusBit && extendStatusBit) || 0
                console.log('getCurrentUser:data:>>>', extendStatusBit)
            } catch (error) {
                console.log('getCurrentUser:error:>>>', error)
            }
        },
        // 买入、卖出
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
            let prev = ''
            if (this.appType.Hk) {
                prev = '/hk'
            }

            // 买入还是卖出
            let direction = 2,
                path = prev + '/transaction-sell'

            if (type === 'buy') {
                direction = 1
                path = prev + '/risk-appropriate-result'
            }
            // 未签名，跳转到签名页面
            if (!this.isSigned) {
                this.$router.push({
                    path: prev + '/risk-warning',
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
        },
        // 跳转债券常见问题
        jumpFaq() {
            this.setAppRightBar()

            window.location.href =
                window.location.origin +
                '/webapp/market/generator.html?key=bond01'
        },
        // 设置 app 右上角侧边栏为空
        setAppRightBar() {
            jsBridge.callApp('command_set_titlebar_button', {
                position: 2, //position取值1、2
                type: 'hide' //text、icon、custom_icon、hide
            })
        }
    },
    watch: {
        bindStock() {
            if (
                this.bindStock.stockCode &&
                this.bindStock.stockMarket &&
                this.bindStock.stockMarket.type
            ) {
                try {
                    if (this.appType.Hk) return
                    jsBridge.callApp('command_set_titlebar_button', {
                        position: 2, //position取值1、2
                        clickCallback: 'goToStockDetails',
                        type: 'text', //text、icon、custom_icon、hide
                        text: '查看股票' //自定义
                    })
                    window.goToStockDetails = () => {
                        jsBridge.gotoNativeModule(
                            `yxzq_goto://stock_quote?market=${
                                enumMarketName[this.bindStock.stockMarket.type]
                            }&code=${this.bindStock.stockCode}`
                        )
                    }
                    console.log('goToStockDetails>>>success :')
                } catch (error) {
                    console.log('goToStockDetails>>>error :', error)
                }
            }
        }
    },
    beforeDestroy() {
        this.setAppRightBar()
        clearInterval(this.updateTimer)
    }
}
