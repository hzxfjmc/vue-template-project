import YxContainerBetter from '@/components/yx-container-better'
import { getBondDetail } from '@/service/finance-info-server.js'
import { riskAssessResult, getCurrentUser } from '@/service/user-server.js'
import jsBridge from '@/utils/js-bridge'
import { Panel, PullRefresh } from 'vant'
import { mapState } from 'vuex'
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
            try {
                let { validTime } = await riskAssessResult()
                if (new Date().getTime() > new Date(validTime).getTime()) {
                    await this.$confirm({
                        title: '提示',
                        message:
                            '您的风险测评已过期，如果要继续操作，请先去测评！'
                    })
                    this.$router.push({
                        name: 'risk-assessment',
                        query: {
                            id: this.id
                        }
                    })
                }
                console.log('riskAssessResult :', validTime)
            } catch (e) {
                console.log('riskAssessResult>>>error :', e)
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
    },
    watch: {
        bindStock() {
            if (
                this.bindStock.stockCode &&
                this.bindStock.stockMarket &&
                this.bindStock.stockMarket.type
            ) {
                try {
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
        jsBridge.callApp('command_set_titlebar_button', {
            position: 2, //position取值1、2
            type: 'hide' //text、icon、custom_icon、hide
        })
        clearInterval(this.updateTimer)
    }
}
