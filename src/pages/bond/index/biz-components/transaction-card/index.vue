<template lang="pug">
    .transaction-card
        media-box.transanction-header(
            :title="bondEditableInfo && bondEditableInfo.issuer && bondEditableInfo.issuer.name || '--'"
            :desc="bondEditableInfo && bondEditableInfo.nameCn || '--'"
        )
        .yx-cell
            .yx-cell__header 买入价格
                .yx-cell__header-tip (美元)
            .yx-cell__primary {{ currentPrice.buyPrice || '--' }}

        .yx-cell
            .yx-cell__header 份数
            .yx-cell__primary
                van-stepper(v-model="transactionNum" integer)
                .yx-cell__primary-tip ({{ bondUneditableInfo.minFaceValue || '--' }}美元/份)
        .yx-cell
            .yx-cell__header 金额
            .yx-cell__primary {{ transactionNum * currentPrice.buyPrice }}

        .yx-cell
            .yx-cell__header {{ direction === 1 ? '应付利息' : '应得利息' }}
                .yx-cell__header-tip
                    i.iconfont.icon-wenhao(@click="showTips('interest')")
            .yx-cell__primary {{direction === 1 ? '-' : '+'}}{{ calcInterest }}

        .yx-cell
            .yx-cell__header 手续费(预估)
            .yx-cell__primary +{{ calcServiceCharge }}

        .divider-line

        .yx-cell
            .yx-cell__header 总额
                .yx-cell__header-tip (美元)
            .yx-cell__primary {{ direction === 1 ? (transactionNum * currentPrice.buyPrice - calcServiceCharge - calcInterest) : (transactionNum * currentPrice.buyPrice - calcServiceCharge + calcInterest) }}

        .tips
            i.iconfont.icon-wenhao(@click="showTips('total')")
            span 债券可用资金
            strong {{ positionData.marketValue }}美元
        fixed-operate-btn(
            :text="btnText"
            :style="{backgroundColor: btnText === '确认买入' ? '#2f79ff' : '#ffbf32'}"
            @click="handleBondOrder"
        )
</template>

<script>
import MediaBox from '@/pages/bond/index/biz-components/media-box/index.vue'
import FixedOperateBtn from '@/pages/bond/index/biz-components/fix-operate-button/index.vue'
import { feePackageCurr } from '@/service/product-server.js'
import { getBondDetail } from '@/service/finance-info-server.js'
import {
    bondOrder,
    getBondInterestCalculate,
    getBondPosition
} from '@/service/finance-server.js'
import { riskAssessResult } from '@/service/user-server.js'
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
        }
    },
    async created() {
        this.direction = this.$route.query.direction - 0 || 1
        this.id = this.$route.query.id - 0 || 0

        try {
            // 获取债券信息
            let {
                bondEditableInfo,
                bondUneditableInfo,
                currentPrice
            } = await getBondDetail(this.id)
            this.bondEditableInfo = bondEditableInfo || {}
            this.bondUneditableInfo = bondUneditableInfo || {}
            this.currentPrice = currentPrice || {}
            this.bondRiskLevel =
                (bondEditableInfo &&
                    bondEditableInfo.riskLevel &&
                    bondEditableInfo.riskLevel.type) ||
                0
            console.log(
                'getBondDetail:data:>>> ',
                bondEditableInfo,
                bondUneditableInfo
            )

            // **************************************
            // 获取当前用户债券持仓
            let { bondPositionList } = await getBondPosition(2)
            this.positionData =
                (bondPositionList &&
                    bondPositionList.filter(
                        positionItem => positionItem.bondId === this.id
                    )) ||
                []
            this.positionData =
                (this.positionData[0] && this.positionData[0]) || {}
            console.log('getBondPosition:data:>>> ', bondPositionList)

            // ************************************
            // 获取用户风险测评结果
            let { assessResult } = await riskAssessResult()
            this.userRiskLevel = assessResult || 0
            console.log('riskAssessResult:data:>>> ', assessResult)

            // *************************************
            // 获取债券应计利息计算天数
            let { interestDays } = await getBondInterestCalculate(this.id)
            this.interestDays = interestDays || 0
            console.log('getBondInterestCalculate:data:>>> ', interestDays)

            // ***************************************
            // 获取套餐费用
            let feeData = await feePackageCurr({
                stockBusinessType: 1,
                userId: this.$store.state.userId - 0
            })
            console.log('feePackageCurr:data:>>> ', feeData)
            // 当前为手机委托，过滤除手机委托外的其他套餐数据
            this.feeData =
                (feeData &&
                    feeData.filter(feeItem => feeItem.entrustType === 2)) ||
                {}
        } catch (e) {
            console.log('created:error:>>>', e)
            // console.log('riskAssessResult:error:>>>', e)
            // console.log('getBondInterestCalculate:error:>>>', e)
        }
    },
    data() {
        return {
            transactionNum: 1, // 交易份数
            bondEditableInfo: {},
            bondUneditableInfo: {},
            userRiskLevel: 0, // 用户风险等级
            bondRiskLevel: 0, // 债券风险等级
            direction: 1, // 1 买 2卖
            id: 0, // 债券id
            interestDays: 0, // 应计利息天数
            minFaceValue: 0, // 最低起购金额
            currentPrice: {}, // 当前价格
            positionData: {}, // 用户当前债券持仓
            feeData: [] // 当前用户套餐费用
        }
    },
    computed: {
        // 计算应计利息
        // 票面利率应该是除过100的小数
        // 应计利息=票面利率/360*已计息天数*数量；
        calcInterest() {
            return (
                (this.bondUneditableInfo.couponRate / 360) *
                this.interestDays *
                this.transactionNum
            ).toFixed(2)
        },
        calcServiceCharge() {
            return this.calcFee()
        }
    },
    methods: {
        calcFee() {
            // 计算手续费
            // 买入： 手续费 = 佣金 + 平台服务费
            // 卖出： 手续费 = 佣金 + 平台服务费 + 活动费

            // 佣金 = 交易额（当前价格 * 交易数量） * 百分比， 佣金有最低金额(minFeeAmount)，无最高金额(maxFeeAmount)
            // 平台服务费 = feeAmount
            // 活动费 = feeAmount * 卖出数量，有最高金额（maxFeeAmount），卖出时收取

            // feeMethod表示收费计算方式，佣金是1，平台服务费是2，活动费是7
            // 1 交易额 * feePercent
            // 2 直接取 feeAmount
            // 7 feeAmount * 卖出数量
            let tradeMethodMap = {
                1: feeLadder => {
                    let fee =
                        feeLadder.feePercent *
                        this.transactionNum *
                        this.currentPrice.buyPrice
                    return fee > feeLadder.minFeeAmount
                        ? fee
                        : feeLadder.minFeeAmount
                },
                2: feeLadder => {
                    return feeLadder.feeAmount
                },
                7: feeLadder => {
                    return feeLadder.feeAmount * this.transactionNum
                }
            }
            let yongjin = this.feeData.filter(
                feeItem => feeItem.feeCategory === 1 // 表示佣金
            )
            let youjinfei = tradeMethodMap[
                (yongjin[0] && yongjin[0].feeLadders.feeMethod) || 1
            ]((yongjin[0] && yongjin[0].feeLadders[0]) || {})
            let pingtai = this.feeData.filter(
                feeItem => feeItem.feeCategory === 2 // 表示平台服务费
            )
            let pingtaifei = tradeMethodMap[
                (pingtai[0] && pingtai[0].feeLadders.feeMethod) || 1
            ]((pingtai[0] && pingtai[0].feeLadders[0]) || {})
            let huodong = this.feeData.filter(
                feeItem => feeItem.feeCategory === 4 // 表示活动费
            )
            let huodongfei = tradeMethodMap[
                (huodong[0] && huodong[0].feeLadders.feeMethod) || 1
            ]((huodong[0] && huodong[0].feeLadders[0]) || {})

            if (this.direction === 1) {
                // 买入
                return youjinfei + pingtaifei
            }
            return youjinfei + pingtaifei + huodongfei
        },
        // 判断用户风险等级是否可交易
        isUserTrade() {
            if (this.userRiskLevel === 0) {
                this.$router.push('/risk-warning?id=' + this.id)
                return
            } else if (this.userRiskLevel < this.bondRiskLevel) {
                this.$router.push('/risk-assessment-result')
                return
            }
            return true
        },
        // 获取交易token
        async getTradeToken() {
            if (!this.isUserTrade()) return

            try {
                let {
                    data: { requestToken: requestToken }
                } = await jsBridge.callApp('command_trade_login')
                console.log('tradeMsg :', requestToken)
                if (requestToken) {
                    this.handleBondOrder(requestToken)
                }
            } catch (error) {
                console.log('tradeMsg:error :', error)
            }
        },
        // 下单/买卖
        async handleBondOrder(requestToken = '') {
            try {
                let data = await bondOrder({
                    bondId: this.id,
                    direction: this.direction,
                    entrustPrice: 1,
                    entrustQuantity: 1,
                    requestId: generateUUID(),
                    tradeToken: requestToken
                })
                console.log('bondOrder:data:>>> ', data)
            } catch (e) {
                console.log('bondOrder:error:>>> ', e)
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
.transanction-header {
    background-color: #2f79ff;
}
.icon-wenhao {
    color: #9fb0ca;
}
.yx-cell {
    display: flex;
    padding: 14px;
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
    padding-right: 15px;
    text-align: right;
    i {
        margin-right: 4px;
        font-size: 0.24rem;
    }
    span {
        margin-right: 4px;
        font-size: 0.24rem;
        line-height: 18px;
    }
    strong {
        font-size: 0.28rem;
        line-height: 18px;
    }
}
</style>
