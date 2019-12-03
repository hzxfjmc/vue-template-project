import { hsAccountInfo } from '@/service/stock-capital-server.js'
import { feePackageCurr, feePackageAgent } from '@/service/product-server.js'
import { getBondDetail } from '@/service/finance-info-server.js'
import { getBondInterestCalculate } from '@/service/finance-server.js'
import { getBondPosition } from '@/service/finance-server.js'
import { PullRefresh } from 'vant'
import { loadingModule, closeModule } from '@/utils/common/plugins/vant'
// 交易类型
const TRADE_TYPE = {
    BUY: 1,
    SELL: 2
}
export default {
    name: 'TransactionBuy',
    components: {
        [PullRefresh.name]: PullRefresh
    },
    beforeRouteEnter(to, from, next) {
        // 获取数据，在 dom 渲染之前获取数据，防止页面数据从空到有
        // 造成页面加载时间变长，但是这是产品要求的
        let pArr = [
            getBondDetail(to.query.id),
            getBondInterestCalculate(to.query.id),
            feePackageAgent({
                feeType: 8,
                marketType: 6 // 表示债券市场
            })
        ]
        if (to.query.direction - 0 === TRADE_TYPE.BUY) {
            // 获取用户恒生资金账户信息
            pArr.push(hsAccountInfo(1))
        } else {
            // 获取当前用户债券持仓
            pArr.push(getBondPosition(2))
        }
        loadingModule()
        Promise.all(pArr)
            .then(resArray => {
                console.log('beforeRouterEnter>>>then :', resArray)
                next(vm => {
                    let [
                        bondObject,
                        getBondInterestCalculateObject,
                        feePackageAgentArray,
                        hsAccountInfo_Or_BondPositionObject
                    ] = resArray

                    let {
                        bondEditableInfo,
                        bondUneditableInfo,
                        currentPrice
                    } = bondObject

                    let { interestDays } = getBondInterestCalculateObject

                    vm.bondEditableInfo = bondEditableInfo || {}
                    vm.bondUneditableInfo = bondUneditableInfo || {}
                    vm.currentPrice = currentPrice || {}
                    vm.interestDays = interestDays || 0
                    vm.activityFee = feePackageAgentArray || []

                    if (to.query.direction - 0 === TRADE_TYPE.BUY) {
                        // 设置用户恒生资金账户信息
                        vm.accountInfo =
                            hsAccountInfo_Or_BondPositionObject || {}
                    } else {
                        // 设置当前用户债券持仓
                        let {
                            bondPositionList
                        } = hsAccountInfo_Or_BondPositionObject
                        let tempPositionData =
                            (bondPositionList &&
                                bondPositionList.filter(
                                    positionItem =>
                                        positionItem.bondId === to.query.id - 0
                                )) ||
                            []
                        vm.positionData = tempPositionData[0] || {}
                    }
                })
            })
            .catch(e => {
                console.log('beforeRouterEnter>>>error :', e)
            })
            .finally(() => {
                closeModule()
            })
    },
    created() {
        this.id = this.$route.query.id - 0 || 0

        this.handleFeePackageCurr()
    },
    data() {
        return {
            id: 0, // 债券id
            isLoading: false, // 下拉刷新

            positionData: {}, // 当前用户债券持仓

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
            let direction = this.$route.query.direction - 0
            let pArr = [
                this.handleGetBondDetail(),
                this.handleGetBondInterestCalculate(),
                this.handleFeePackageCurr(),
                this.handleFeePackageAgent()
            ]
            if (direction === TRADE_TYPE.BUY) {
                pArr.push(this.handleHsAccountInfo())
            } else {
                pArr.push(this.handleGetBondPosition())
            }
            Promise.all(pArr)
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
        },
        // 获取当前用户债券持仓
        async handleGetBondPosition() {
            try {
                let { bondPositionList } = await getBondPosition(2)
                let tempPositionData =
                    (bondPositionList &&
                        bondPositionList.filter(
                            positionItem =>
                                positionItem.bondId === this.$route.query.id - 0
                        )) ||
                    []
                this.positionData = tempPositionData[0] || {}
                console.log('getBondPosition:data:>>> ', bondPositionList)
            } catch (error) {
                console.log('getBondPosition:error:>>> ', error)
            }
        }
    }
}
