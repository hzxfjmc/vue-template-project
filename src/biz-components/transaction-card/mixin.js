import MediaBox from '@/biz-components/media-box/index.vue'
import YxContainerBetter from '@/components/yx-container-better'
import { feePackageCurr, feePackageAgent } from '@/service/product-server.js'
import { getBondDetail } from '@/service/finance-info-server.js'
import {
    bondOrder,
    getBondInterestCalculate
} from '@/service/finance-server.js'
import { generateUUID, debounce } from '@/utils/tools.js'
import { LongPress } from '@/utils/long-press'
import jsBridge from '@/utils/js-bridge.js'
import { Stepper, PullRefresh } from 'vant'
import { caclFinalFee } from './calc-fee'
import { mapGetters } from 'vuex'
export default {
    name: 'TransactionCard',
    i18n: {
        zhCHS: {
            buyPrice: '买入价格',
            sellPrice: '卖出价格',
            transactionNum: '份数',
            unit: '份',
            amountMoney: '金额',
            payableInterest: '应付利息',
            accruedInterest: '应得利息',
            serviceCharge: '手续费(预估)',
            totalMoney: '总额',
            availableMoney: '债券可用资金',
            positionsCanBeSold: '持仓可卖'
        },
        zhCHT: {
            buyPrice: '買入價格',
            sellPrice: '賣出價格',
            transactionNum: '份数',
            unit: '份數',
            amountMoney: '金額',
            payableInterest: '應付利息',
            accruedInterest: '應得利息',
            serviceCharge: '手續費（預估）',
            totalMoney: '總額',
            availableMoney: '債券可用資金',
            positionsCanBeSold: '持倉可賣'
        },
        en: {
            buyPrice: '买入价格',
            sellPrice: '卖出价格',
            transactionNum: '份数',
            unit: '份',
            amountMoney: '金额',
            payableInterest: '应付利息',
            accruedInterest: '应得利息',
            serviceCharge: '手续费(预估)',
            totalMoney: '总额',
            availableMoney: '债券可用资金',
            positionsCanBeSold: '持仓可卖'
        }
    },
    components: {
        [Stepper.name]: Stepper,
        [PullRefresh.name]: PullRefresh,
        MediaBox,
        YxContainerBetter
    },
    props: {
        btnText: {
            type: String,
            default: ''
        },
        // 交易方向
        direction: {
            type: Number,
            default: 1
        },
        // 用户当前债券持仓
        positionData: {
            type: Object,
            default: () => {}
        },
        // 用户恒生资金账户信息
        accountInfo: {
            type: Object,
            default: () => {}
        }
    },
    created() {
        this.id = this.$route.query.id - 0 || 0

        // 获取债券信息
        this.handleGetBondDetail()

        // 获取债券应计利息计算天数
        this.handleGetBondInterestCalculate()

        // 获取套餐费用
        this.handleFeePackageCurr()
        // 获取活动费用
        this.handleFeePackageAgent()

        this.debounceTradeToken = debounce(this.getTradeToken, 350)
    },
    mounted() {
        setTimeout(() => {
            // 长按递增/递减
            new LongPress('.van-stepper__minus', () => {
                this.transactionNum--
                if (this.transactionNum <= 1) {
                    this.transactionNum = 1
                }
            })
            new LongPress('.van-stepper__plus', () => {
                this.transactionNum++
                if (this.transactionNum >= 9999999) {
                    this.transactionNum = 9999999
                }
            })
        }, 500)
    },
    data() {
        return {
            transactionNum: 1, // 交易份数
            bondEditableInfo: {},
            bondUneditableInfo: {},
            id: 0, // 债券id
            debounceTradeToken: () => {}, // 交易防抖函数
            interestDays: 0, // 应计利息天数
            currentPrice: {}, // 当前价格
            feeData: [], // 当前用户套餐费用
            activityFee: [], // 活动费用

            isLoading: false // 下拉刷新
        }
    },
    computed: {
        ...mapGetters(['appType']),
        // 发行人
        issuerName() {
            return (
                (this.bondEditableInfo &&
                    this.bondEditableInfo.issuer &&
                    this.bondEditableInfo.issuer.name) ||
                '--'
            )
        },
        // 债券名称
        bondName() {
            return (
                (this.bondEditableInfo && this.bondEditableInfo.bondName) ||
                '--'
            )
        },
        // 货币单位 美元
        currencyShortSymbol() {
            return (
                (this.bondUneditableInfo &&
                    this.bondUneditableInfo.enumCurrency &&
                    this.bondUneditableInfo.enumCurrency.shortSymbol) ||
                ''
            )
        },
        // 当前债券售卖单价/交易单价
        buyOrSellPrice() {
            if (this.direction === 1) {
                return (
                    (this.currentPrice.buyPrice &&
                        (this.currentPrice.buyPrice - 0).toFixed(4)) ||
                    '0.0000'
                )
            }
            return (
                (this.currentPrice.sellPrice &&
                    (this.currentPrice.sellPrice - 0).toFixed(4)) ||
                '0.0000'
            )
        },
        // 最小交易额
        minFaceValue() {
            return this.bondUneditableInfo.minFaceValue || 0
        },
        // 交易金额
        tradeMoney() {
            let t =
                this.minFaceValue *
                this.transactionNum *
                (this.buyOrSellPrice - 0)
            return t ? t.toFixed(2) : '0.00'
        },
        // 计算应计利息
        // 票面利率应该是除过100的小数
        // 应计利息 = 票面利率 / 360 * 已计息天数 * 交易数量 * 最小交易额
        calcInterest() {
            let res =
                (this.bondUneditableInfo.couponRate / 360) *
                this.interestDays *
                (this.minFaceValue * this.transactionNum)
            res = res ? res.toFixed(2) : '0.00'
            return res
        },
        // 计算手续费
        serviceCharge() {
            if (this.tradeMoney <= 0) return '0.00'
            // 计算手续费
            // 买入： 手续费 = 佣金 + 平台服务费
            // 卖出： 手续费 = 佣金 + 平台服务费 + 活动费

            // 佣金 = 交易额（最小交易额 * 交易数量） * 百分比， 佣金有最低金额(minFeeAmount)，无最高金额(maxFeeAmount)
            // 平台服务费 = feeAmount
            // 活动费 = feeAmount * 交易额（最小交易额 * 交易数量），有最高金额（maxFeeAmount），卖出时收取

            // feeMethod表示收费计算方式，佣金是1，平台服务费是2，活动费是7
            // 1 交易额 * feePercent
            // 2 直接取 feeAmount
            // 7 feeAmount * 交易额（最小交易额 * 交易数量）
            let yongjin = {},
                pingtai = {}

            this.feeData.forEach(feeItem => {
                if (feeItem.feeCategory === 1) {
                    // 表示佣金
                    yongjin = feeItem
                } else if (feeItem.feeCategory === 2) {
                    // 表示平台服务费
                    pingtai = feeItem
                }
            })
            // 佣金费
            let yongjinFeeLadders =
                (yongjin.feeLadders && yongjin.feeLadders[0]) || {}
            let yongjinfei = caclFinalFee(
                yongjinFeeLadders,
                this.tradeMoney,
                this.transactionNum
            )

            // 平台费
            let pingtaiFeeLadders =
                (pingtai.feeLadders && pingtai.feeLadders[0]) || {}
            let pingtaifei = caclFinalFee(
                pingtaiFeeLadders,
                this.tradeMoney,
                this.transactionNum
            )

            // 活动费
            let huodongFeeLadders =
                (this.activityFee && this.activityFee[0]) || []
            let huodongfei = caclFinalFee(
                huodongFeeLadders,
                this.tradeMoney,
                this.transactionNum
            )

            console.log('this.tradeMoney :>>>>>>>', this.tradeMoney)
            console.log('this.transactionNum :>>>>>>>', this.transactionNum)

            console.log('yongjinfei :>>>>>>>', yongjinfei)
            console.log('pingtaifei :>>>>>>>', pingtaifei)
            console.log('huodongfei :>>>>>>>', huodongfei, '\n\n')
            let res
            if (this.direction === 1) {
                // 买入
                res = yongjinfei + pingtaifei
            } else {
                res = yongjinfei + pingtaifei + huodongfei
            }
            return res ? res.toFixed(2) : '0.00'
        },
        // 交易总额(包含利息和手续费计算)
        totalTradeMoney() {
            // 买入= 交易额 + 应付利息 + 手续费
            // 卖出= 交易额 + 应得利息 - 手续费
            let prevPrice = this.tradeMoney - 0 + (this.calcInterest - 0)
            let totalMoney =
                this.direction === 1
                    ? prevPrice + (this.serviceCharge - 0)
                    : prevPrice - (this.serviceCharge - 0)
            return totalMoney ? totalMoney.toFixed(2) : 0
        },
        // 卖：债券持仓可用数量 / 买：可用资金
        marketValue() {
            if (this.direction === 1) {
                return (
                    (this.accountInfo.withdrawBalance &&
                        (this.accountInfo.withdrawBalance - 0).toFixed(2)) ||
                    '0.00'
                )
            }
            let mv = this.positionData.availableQuantity
                ? (this.positionData.availableQuantity - 0).toFixed(2)
                : '0.00'
            let count = Math.floor(mv / this.minFaceValue)
            this.transactionNum = count

            return mv === '0.00' ? '0' : mv + '(' + count + '份)'
        },
        btnDisabled() {
            return this.transactionNum <= 0 ? true : false
        }
    },
    methods: {
        // 下拉刷新
        onRefresh() {
            Promise.all([
                this.handleGetBondDetail(),
                this.handleGetBondInterestCalculate(),
                this.handleFeePackageCurr()
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
        // 执行交易防抖函数
        handleTradeToken() {
            this.debounceTradeToken()
        },
        // 获取交易token
        async getTradeToken() {
            try {
                let data = await jsBridge.callApp('command_trade_login', {
                    needToken: true
                })
                console.log('tradeMsg :', data)
                if (data && data.token) {
                    this.handleBondOrder(data.token)
                }
            } catch (error) {
                console.log('tradeMsg:error :', error)
            }
        },
        // 下单/买卖
        async handleBondOrder(tradeToken = '') {
            console.log('requestToken :', tradeToken)
            try {
                let data = await bondOrder({
                    bondId: this.id,
                    direction: this.direction,
                    entrustPrice: this.buyOrSellPrice - 0,
                    entrustQuantity: this.transactionNum,
                    requestId: generateUUID(),
                    tradeToken: tradeToken
                })
                await this.$toast('提交成功')

                // 交易完成，挑战订单页，关闭当前 Webview ，防止返回按钮回到交易页
                setTimeout(() => {
                    jsBridge.callApp('command_close_webview')
                }, 1000)
                if (this.appType && this.appType.Hk) {
                    // 港版跳转到全部订单页
                    jsBridge.gotoNativeModule(
                        'yxzq_goto://order_record?market=us&type=2'
                    )
                } else {
                    // 跳转到今日订单页
                    jsBridge.gotoNativeModule(
                        'yxzq_goto://today_order?market=us'
                    )
                }
                console.log('bondOrder:data:>>> ', data)
            } catch (e) {
                console.log('bondOrder:error:>>> ', e)
                // 800001, "系统异常，请稍后重试" 1
                // 800008, "账户被冻结，无法完成操作，如有疑问，请联系客服" 1
                // 800010, "抱歉，该产品暂不销售" 1
                // 800011, "当前时间段不可操作" 1
                // 800013, "债券可用资金不足" 1
                // 800014, "债券已到期，无法交易，如有持仓本息将尽快返回到您账户" 1
                // 800018, "抱歉，价格发生变化，是否按最新价格（%s）提交订单？或者取消后重新下单" 1
                // 800020, "债券数量不足" 1
                // 800027, "下单数量不正确" 1
                // 特殊重要错误，需要弹窗提示，其他使用toast
                let specialCode = [
                    800001,
                    800008,
                    800010,
                    800011,
                    800013,
                    800014,
                    800020,
                    800027
                ]
                if (e.code === 800018) {
                    if (e.data) {
                        // 价格发生变化
                        this.$dialog
                            .confirm({
                                title: '提交失败',
                                message: e.msg
                            })
                            .then(async () => {
                                this.direction === 1
                                    ? (this.currentPrice.buyPrice = e.data)
                                    : (this.currentPrice.sellPrice = e.data)
                                this.handleBondOrder(tradeToken)
                            })
                            .catch(() => {
                                this.buyOrSellPrice = e.data
                            })
                    } else {
                        this.$dialog.alert({
                            title: '提交失败',
                            message: e.msg
                        })
                    }
                } else if (specialCode.includes(e.code)) {
                    this.$dialog.alert({
                        title: '提交失败',
                        message: e.msg
                    })
                } else {
                    this.$toast('提交失败')
                }
            }
        },
        handleChange(value) {
            console.log('value :', value)
            if (value > 9999999) {
                this.transactionNum = 9999999
            }
        },
        // 提示弹窗
        showTips(tipsType) {
            let tipText = ''
            if (tipsType === 'interest') {
                // 应付利息/应得利息提示弹窗
                tipText =
                    '应计利息是债券自上一次付息后至债券交收时之间的累计未付利息，由买方向卖方支付，即对于买方是“应付”，对于卖方是“应得”。\n\n' +
                    '对于卖方，多持有的这段时间的利息，会在交易时得到补偿，即应计利息。\n\n' +
                    '对于买方，应计利息并不会额外增加成本，会在付息日或卖出时得到补偿。'
            } else {
                // 可用资金提示弹窗
                tipText = '可以用于购买债券的资金，等于您资产中的“可取现金”'
            }
            this.$dialog.alert({
                message: tipText,
                messageAlign: 'left',
                confirmButtonText: '我知道了'
            })
        }
    }
}
