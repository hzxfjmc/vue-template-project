<template lang="pug">
    .transaction-card
        media-box.transaction-header(
            :title="issuerName"
            :desc="bondName"
        )
        .yx-cell(style="padding:0.4rem 0.28rem")
            .yx-cell__header 买入价格
                .yx-cell__header-tip ({{ currency }})
            .yx-cell__primary {{ buyPrice }}

        .yx-cell
            .yx-cell__header 份数
            .yx-cell__primary
                van-stepper(v-model="transactionNum" integer min="1" max="9999")
                .yx-cell__primary-tip ({{ minFaceValue }}{{ currency }}/份)
        .yx-cell(style="padding:0.4rem 0.28rem 0.26rem")
            .yx-cell__header 金额
            .yx-cell__primary {{ tradeMoney }}

        .yx-cell
            .yx-cell__header {{ direction === 1 ? '应付利息' : '应得利息' }}
                .yx-cell__header-tip
                    i.iconfont.icon-wenhao(@click="showTips('interest')")
            .yx-cell__primary +{{ calcInterest }}

        .yx-cell(style="padding-top:0.2rem")
            .yx-cell__header 手续费(预估)
            .yx-cell__primary {{direction === 1 ? '+' : '-'}}{{ serviceCharge }}

        .divider-line

        .yx-cell.total-trade-money
            .yx-cell__header 总额
                .yx-cell__header-tip ({{ currency }})
            .yx-cell__primary {{ totalTradeMoney }}

        .tips
            i.iconfont.icon-wenhao(@click="showTips('total')")
            span {{direction === 1 ? '债券可用资金' : '持仓可卖'}}
            strong {{ marketValue }}{{ currency }}
        fixed-operate-btn(
            :text="btnText"
            :style="{backgroundColor: btnText === '确认买入' ? '#2f79ff' : '#ffbf32'}"
            @click="getTradeToken"
        )
</template>

<script>
import MediaBox from '@/pages/bond/index/biz-components/media-box/index.vue'
import FixedOperateBtn from '@/pages/bond/index/biz-components/fix-operate-button/index.vue'
import { feePackageCurr } from '@/service/product-server.js'
import { getBondDetail } from '@/service/finance-info-server.js'
// import { getTradePasswordToken } from '@/service/user-server.js'
import {
    bondOrder,
    getBondInterestCalculate
} from '@/service/finance-server.js'
import { generateUUID } from '@/utils/tools.js'
import jsBridge from '@/utils/js-bridge.js'
import { Stepper } from 'vant'
export default {
    name: 'TransacntionCard',
    components: {
        [Stepper.name]: Stepper,
        MediaBox,
        FixedOperateBtn
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
    },
    data() {
        return {
            transactionNum: 1, // 交易份数
            bondEditableInfo: {},
            bondUneditableInfo: {},
            id: 0, // 债券id
            interestDays: 0, // 应计利息天数
            currentPrice: {}, // 当前价格
            feeData: [] // 当前用户套餐费用
        }
    },
    computed: {
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
                (this.bondEditableInfo && this.bondEditableInfo.nameCn) || '--'
            )
        },
        // 货币单位
        currency() {
            return (
                (this.bondUneditableInfo &&
                    this.bondUneditableInfo.enumCurrency &&
                    this.bondUneditableInfo.enumCurrency.name) ||
                '--'
            )
        },
        // 当前债券售卖单价
        buyPrice() {
            return (
                (this.currentPrice.buyPrice &&
                    (this.currentPrice.buyPrice - 0).toFixed(4)) ||
                '0.0000'
            )
        },
        // 最小交易额
        minFaceValue() {
            return this.bondUneditableInfo.minFaceValue || 0
        },
        // 交易金额
        tradeMoney() {
            let t = this.minFaceValue * this.transactionNum * this.buyPrice
            return t ? t.toFixed(3) : 0
        },
        // 计算应计利息
        // 票面利率应该是除过100的小数
        // 应计利息 = 票面利率 / 360 * 已计息天数 * 交易数量 * 最小交易额
        calcInterest() {
            let res =
                (this.bondUneditableInfo.couponRate / 360) *
                this.interestDays *
                this.tradeMoney
            res = res ? res.toFixed(3) : 0
            return res
        },
        // 计算手续费
        serviceCharge() {
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
            let tradeMethodMap = {
                1: feeLadder => {
                    let feePercent = feeLadder.feePercent
                        ? feeLadder.feePercent / 100
                        : 0
                    let fee =
                        this.minFaceValue * this.transactionNum * feePercent
                    console.log('yongjinfee :', fee)
                    return fee > feeLadder.minFeeAmount
                        ? fee
                        : feeLadder.minFeeAmount
                },
                2: feeLadder => {
                    console.log('pingtaifee :', feeLadder.feeAmount)
                    return feeLadder.feeAmount
                },
                7: feeLadder => {
                    let fee =
                        feeLadder.feeAmount *
                        this.minFaceValue *
                        this.transactionNum
                    console.log('huodongfee :', fee)
                    return fee > feeLadder.maxFeeAmount
                        ? feeLadder.maxFeeAmount
                        : fee
                }
            }
            let yongjin =
                this.feeData.filter(
                    feeItem => feeItem.feeCategory === 1 // 表示佣金
                ) || []
            let yongjinFeeLadders =
                (yongjin[0] &&
                    yongjin[0].feeLadders &&
                    yongjin[0].feeLadders[0]) ||
                {}
            let yongjinfei =
                tradeMethodMap[yongjinFeeLadders.feeMethod] &&
                tradeMethodMap[yongjinFeeLadders.feeMethod](
                    yongjinFeeLadders || {}
                )

            let pingtai =
                this.feeData.filter(
                    feeItem => feeItem.feeCategory === 2 // 表示平台服务费
                ) || []
            let pingtaiFeeLadders =
                (pingtai[0] &&
                    pingtai[0].feeLadders &&
                    pingtai[0].feeLadders[0]) ||
                {}
            let pingtaifei =
                tradeMethodMap[pingtaiFeeLadders.feeMethod] &&
                tradeMethodMap[pingtaiFeeLadders.feeMethod](
                    pingtaiFeeLadders || {}
                )

            let huodong =
                this.feeData.filter(
                    feeItem => feeItem.feeCategory === 4 // 表示活动费
                ) || []
            let huodongFeeLadders =
                (huodong[0] &&
                    huodong[0].feeLadders &&
                    huodong[0].feeLadders[0]) ||
                {}
            let huodongfei =
                tradeMethodMap[huodongFeeLadders.feeMethod] &&
                tradeMethodMap[huodongFeeLadders.feeMethod](
                    huodongFeeLadders || {}
                )

            console.log('object :>>>>>>>', yongjinfei, pingtaifei, huodongfei)
            let res
            if (this.direction === 1) {
                // 买入
                res = yongjinfei + pingtaifei
            } else {
                res = yongjinfei + pingtaifei + huodongfei
            }
            console.log('res', res)
            return res ? res.toFixed(3) : 0
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
            return totalMoney ? totalMoney.toFixed(3) : 0
        },
        // 持仓可用资金
        marketValue() {
            if (this.direction === 1) {
                return this.accountInfo.withdrawBalance || '0.000'
            }
            return this.positionData.marketValue
                ? this.positionData.marketValue
                : '0.000'
        }
    },
    methods: {
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
                    stockBusinessType: 1,
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
        // 获取交易token
        async getTradeToken() {
            try {
                let { tradeToken } = await jsBridge.callApp(
                    'command_trade_login',
                    { needToken: true }
                )
                console.log('tradeMsg :', tradeToken)
                // let requestToken = await getTradePasswordToken()
                // console.log('requestToken :', requestToken)
                if (tradeToken) {
                    this.handleBondOrder(tradeToken)
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
                    entrustPrice: this.currentPrice.buyPrice - 0,
                    entrustQuantity: this.transactionNum,
                    requestId: generateUUID(),
                    tradeToken: tradeToken
                })
                await this.$dialog.alert({
                    message: '提交成功'
                })
                // 跳转到今日订单页
                jsBridge.gotoNativeModule('yxzq_goto://today_order?market=us')
                console.log('bondOrder:data:>>> ', data)
            } catch (e) {
                console.log('bondOrder:error:>>> ', e)
                if (e.code === 800018) {
                    if (e.data) {
                        // 价格发生变化
                        this.$dialog
                            .confirm({
                                title: '提交失败',
                                message: e.msg
                            })
                            .then(async () => {
                                this.currentPrice.buyPrice = e.data
                                this.getTradeToken()
                            })
                            .catch(() => {
                                this.currentPrice.buyPrice = e.data
                            })
                    } else {
                        this.$dialog.alert({
                            title: '提交失败',
                            message: e.msg
                        })
                    }
                } else {
                    this.$dialog.alert({
                        message: '提交失败'
                    })
                }
            }
        },
        // 提示弹窗
        showTips(tipsType) {
            let tipText = ''
            if (tipsType === 'interest') {
                // 应付利息/应得利息提示弹窗
                tipText = `应计利息是债券自上一次付息后至债券交收时之间的累计未付利息，由买方向卖方支付，即对于买方是“应付”，对于卖方是“应得”。\n
对于卖方，多持有的这段时间的利息，会在交易时得到补偿，即应计利息。\n
对于买方，应计利息并不会额外增加成本，会在付息日或卖出时得到补偿。`
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
    },
    watch: {
        transactionNum() {
            if (this.transactionNum > 9999) {
                this.transactionNum = 9999
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.transaction-card {
    overflow: hidden;
    padding-bottom: 20px;
    background-color: #fff;
    border-radius: 4px;
}
.transaction-header {
    padding: 12px 14px;
    background-color: #2f79ff;
    .media-box .media-box__content .media-box__desc {
        margin-top: 2px;
    }
}
.icon-wenhao {
    color: #9fb0ca;
}
.yx-cell {
    display: flex;
    padding: 0 14px;
    &.total-trade-money {
        .yx-cell__primary {
            font-size: 0.44rem;
            font-weight: bold;
            line-height: 28px;
        }
    }
    .yx-cell__header {
        font-size: 0.28rem;
        line-height: 20px;
        opacity: 0.6;
    }
    .yx-cell__header-tip {
        display: inline-block;
        margin-left: 4px;
        font-size: 0.24rem;
        line-height: 17px;
        opacity: 0.6;
    }
    .yx-cell__primary {
        flex: 1;
        text-align: right;
        font-size: 0.36rem;
        line-height: 23px;
    }
    .yx-cell__primary-tip {
        margin-top: 6px;
        color: rgba(25, 25, 25, 0.3);
        font-size: 0.2rem;
        line-height: 14px;
    }
}

.divider-line {
    margin: 25px 14px 16px;
    height: 1px;
    background-color: #393939;
    opacity: 0.0565;
}
.tips {
    margin-top: 6px;
    padding-right: 15px;
    text-align: right;
    i {
        margin-right: 4px;
        font-size: 0.24rem;
    }
    span {
        margin-right: 4px;
        color: rgba(25, 25, 25, 0.5);
        font-size: 0.24rem;
        line-height: 18px;
    }
    strong {
        color: rgba(25, 25, 25, 0.5);
        font-size: 0.24rem;
        line-height: 18px;
    }
}
</style>
<style lang="scss">
.transaction-header {
    .media-box__desc {
        margin-top: 2px;
    }
}
.transaction-card {
    .van-stepper {
        .van-stepper__minus,
        .van-stepper__plus {
            width: 28px;
            height: 28px;
            background: rgba(0, 0, 0, 0.04);
            border-radius: 2px;
            .van-stepper__minus::before,
            .van-stepper__plus::before {
                background-color: #191919;
            }
        }
        .van-stepper__input {
            width: 77px;
            padding: 0 4px;
            background-color: #fff;
            box-sizing: border-box;
        }
    }
}
</style>
