import { hsAccountInfo } from '@/service/stock-capital-server.js'
import { feePackageCurr, feePackageAgent } from '@/service/product-server.js'
import { getBondDetail } from '@/service/finance-info-server.js'
import { getBondInterestCalculate } from '@/service/finance-server.js'
import { PullRefresh } from 'vant'
export default {
    name: 'TransactionBuy',
    components: {
        [PullRefresh.name]: PullRefresh
    },
    beforeRouteEnter(to, from, next) {
        // 获取s数据，在 dom 渲染之前获取数据，防止页面数据从空到有
        // 造成页面加载时间变长，但是这是产品要求的
        Promise.all([
            getBondDetail(to.query.id),
            getBondInterestCalculate(to.query.id),
            // feePackageCurr({
            //     stockBusinessType: 6,
            //     userId: this.$store.state.user.userId - 0
            // })
            feePackageAgent({
                feeType: 8,
                marketType: 6
            }),
            hsAccountInfo(1)
        ])
            .then(res => {
                console.log('beforeRouterEnter>>>then :', res)
                next(vm => {
                    // vm.setBondDetail(res, vm)
                    let [
                        bondData,
                        getBondInterestCalculateData,
                        feePackageAgentData,
                        hsAccountInfoData
                    ] = res

                    let {
                        bondEditableInfo,
                        bondUneditableInfo,
                        currentPrice
                    } = bondData
                    let { interestDays } = getBondInterestCalculateData

                    vm.bondEditableInfo = bondEditableInfo
                    vm.bondUneditableInfo = bondUneditableInfo
                    vm.currentPrice = currentPrice
                    vm.interestDays = interestDays
                    vm.activityFee = feePackageAgentData
                    vm.accountInfo = hsAccountInfoData
                })
            })
            .catch(e => {
                console.log('beforeRouterEnter>>>error :', e)
            })
    },
    created() {
        // this.handleHsAccountInfo()
        // this.onRefresh()
        this.handleFeePackageCurr()
    },
    data() {
        return {
            isLoading: false, // 下拉刷新

            bondEditableInfo: {},
            bondUneditableInfo: {},
            interestDays: 0, // 应计利息天数
            activityFee: [], // 活动费用
            feeData: [], // 当前用户套餐费用
            currentPrice: {}, // 当前价格

            accountInfo: {} // 用户恒生资金账户信息
        }
    },
    methods: {
        // 执行交易防抖函数
        handleTradeToken() {
            // bondOrderCalculate({
            //     bondId: this.id,
            //     direction: this.direction,
            //     entrustPrice: this.buyOrSellPrice - 0,
            //     entrustQuantity: this.transactionNum
            // })
            this.$refs.transactionCard.debounceTradeToken()
        },
        // 下拉刷新
        onRefresh() {
            Promise.all([
                this.handleGetBondDetail(),
                this.handleGetBondInterestCalculate(),
                this.handleFeePackageCurr(),
                this.handleFeePackageAgent()
            ])
                .then(() => {
                    this.isLoading = false
                })
                .finally(() => {
                    this.isLoading = false
                })
        },
        // 获取债券信息
        async handleGetBondDetail() {
            try {
                let {
                    bondEditableInfo,
                    bondUneditableInfo,
                    currentPrice
                } = await getBondDetail(this.id)
                this.bondEditableInfo = bondEditableInfo || {}
                this.bondUneditableInfo = bondUneditableInfo || {}
                this.currentPrice = currentPrice || {}
                console.log(
                    'getBondDetail:data:>>> ',
                    bondEditableInfo,
                    bondUneditableInfo
                )
            } catch (error) {
                console.log('getBondDetail:error:>>> ', error)
            }
        },
        // 获取债券应计利息计算天数
        async handleGetBondInterestCalculate() {
            try {
                let { interestDays } = await getBondInterestCalculate(this.id)
                this.interestDays = interestDays || 0
                console.log('getBondInterestCalculate:data:>>> ', interestDays)
            } catch (error) {
                console.log('getBondInterestCalculate:error:>>> ', error)
            }
        },
        // 获取套餐费用
        async handleFeePackageCurr() {
            try {
                let feeData = await feePackageCurr({
                    stockBusinessType: 6,
                    userId: this.$store.state.user.userId - 0
                })
                console.log('feePackageCurr:data:>>> ', feeData)
                // 当前为手机委托，过滤除手机委托外的其他套餐数据
                this.feeData =
                    (feeData &&
                        feeData.filter(feeItem => feeItem.entrustType === 2)) ||
                    {}
            } catch (error) {
                console.log('feePackageCurr:error:>>> ', error)
            }
        },
        // 获取活动费用
        async handleFeePackageAgent() {
            try {
                let activityFee = await feePackageAgent({
                    feeType: 8,
                    marketType: 6
                })
                this.activityFee = activityFee
                console.log('feePackageAgent:data:>>> ', activityFee)
                // 当前为手机委托，过滤除手机委托外的其他套餐数据
                // this.feeData =
                //     (feeData &&
                //         feeData.filter(feeItem => feeItem.entrustType === 2)) ||
                //     {}
            } catch (error) {
                console.log('feePackageAgent:error:>>> ', error)
            }
        },
        // 获取用户恒生资金账户信息
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
