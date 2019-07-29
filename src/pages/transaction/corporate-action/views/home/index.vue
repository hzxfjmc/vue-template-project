<template lang="pug">
yx-container.corporate-action-home
    .header(slot="top")
        p(@click="goToTips") 供股是什么？有关供股的几点你要知道一下
    .main(slot="main")
        CellInfo(:conversionForm="conversionForm" 
         :serviceCharge="serviceCharge" 
         :selectionQty="selectionQty" 
         :withdrawBalance="withdrawBalance"
         :fee="fee"
         )
            .cell-item.flex.speci
                .left 供股数
                .right 
                    van-field(
                        placeholder="请输入供股数",
                        @input="inputHandle"
                        v-model="selectionQty"
                        @blur="changeHandle($event)"
                        )
                    span(v-show='textShow') 股
        VerticalStep(:data="verticalStepData" :title="title")
    .bottom(slot="bottom")
        van-button(size="large" :disabled="disabled" type="primary" class="bottom-button" @click="onNextStep") 立即申请
</template>

<script>
import CellInfo from './cell-info.vue'
import VerticalStep from '../../components/vertical-step.vue'
import {
    getAction,
    MoneyCanTake,
    caculate,
    apply,
    applyModify
} from '@/service/stock-order-server.js'
import JSBridge from '@/utils/js-bridge'
export default {
    components: {
        CellInfo,
        VerticalStep
    },
    data() {
        return {
            conversionForm: {},
            verticalStepData: [],
            curName: '',
            selectionQty: '',
            serviceCharge: '', //手续费
            fee: '',
            withdrawBalance: '',
            applyId: '',
            title: '供股流程',
            applyFlag: false //是否申请过标志
        }
    },
    created() {
        this.initData()
    },
    methods: {
        initData() {
            this.$loading()
            let param = {
                moneyType: 2
            }
            MoneyCanTake(param)
                .then(res => {
                    this.$close()
                    this.withdrawBalance = res.withdrawBalance
                })
                .catch(res => {
                    this.$toast(res.msg || '网络开小差了,请稍后重试')
                })
            let params = {
                rightsId: this.rightsId
            }
            getAction(params)
                .then(res => {
                    this.$close()
                    this.conversionForm = res
                    this.verticalStepData = [
                        `供股申请开始日:${res.applyBeginDate}`,
                        `供股申请截止日:${res.applyEndDate}`,
                        `正股派送日:${res.dividendDate}`,
                        `正股上市日:${res.listingDate}`
                    ]
                    this.applyId = res.applyId
                    this.serviceCharge = res.serviceCharge
                    this.fee = res.fee
                    //可交易
                    if (!res.tradeFlag) {
                        this.verticalStepData.splice(
                            1,
                            0,
                            `股权最后交易日:${res.tradingPeriodTo}`
                        )
                    }
                    if (res.applyFlag) {
                        //是否申请过
                        this.selectionQty = res.bonusAmount
                        this.applyFlag = true
                        //申请过需要回显数据
                        this.changeHandle()
                    } else {
                        this.selectionQty = res.registAmount
                    }
                })
                .catch(res => {
                    this.$toast(res.msg || '网络开小差了,请稍后重试')
                })
        },
        inputHandle() {
            let regs = [
                [/^0(\d+)$/, '$1'], //禁止录入整数部分两位以上，但首位为0
                [/[^\d]+$/, ''] //禁止录入任何非数字
            ]
            for (let i = 0; i < regs.length; i++) {
                let reg = regs[i][0]
                this.selectionQty = String(this.selectionQty).replace(
                    reg,
                    regs[i][1]
                )
            }
        },
        onNextStep() {
            this.$confirm({
                title: `是否确认${this.conversionForm.stockName}的供股申请`,
                confirmButtonText: '确认',
                cancelButtonText: '取消'
            })
                .then(() => {
                    this.successHander()
                })
                .catch(() => {
                    console.log('error')
                })
        },
        async successHander() {
            this.$loading()
            if (this.applyFlag) {
                //修改
                let params = {
                    action: 0,
                    activityType: 0,
                    applyId: this.applyId,
                    selectionQty: this.selectionQty
                }
                try {
                    await applyModify(params)
                    this.$close()
                    this.$router.push({
                        name: 'record'
                    })
                } catch (e) {
                    await this.$toast(e.msg || '网络开小差了,请稍后重试')
                }
            } else {
                //第一次申请
                let params = {
                    rightsId: this.rightsId,
                    selectionQty: this.selectionQty
                }
                try {
                    await apply(params)
                    this.$close()
                    this.$router.push({
                        name: 'record'
                    })
                } catch (e) {
                    await this.$toast(e.msg || '网络开小差了,请稍后重试')
                }
            }
        },
        async changeHandle(val) {
            if (val) {
                let params = {
                    rightsId: this.rightsId,
                    dividendAmount: val.target.value
                }
                try {
                    let { serviceCharge } = await caculate(params)
                    let { fee } = await caculate(params)
                    this.serviceCharge = Number(serviceCharge)
                    this.fee = Number(fee)
                } catch (e) {
                    await this.$toast(e.msg || '网络开小差了,请稍后重试')
                }
            } else {
                let params = {
                    rightsId: this.rightsId,
                    dividendAmount: this.selectionQty
                }
                try {
                    let { serviceCharge } = await caculate(params)
                    let { fee } = await caculate(params)
                    this.serviceCharge = Number(serviceCharge)
                    this.fee = Number(fee)
                } catch (e) {
                    await this.$toast(e.msg || '网络开小差了,请稍后重试')
                }
            }
        },
        goToTips() {
            const url =
                location.origin + '/webapp/market/generator.html?id=10081'
            if (JSBridge.isYouxinApp) {
                JSBridge.gotoNewWebview(url)
            } else {
                location.href = url
            }
        }
    },
    computed: {
        rightsId() {
            return this.$route.params.rightsId
        },
        disabled() {
            if (!this.conversionForm.trade) {
                //不能交易
                return true
            }
            //不存在或为0
            if (!this.selectionQty) {
                return true
            } else {
                //特殊化
                if (this.selectionQty == 0) {
                    return true
                }
                return this.selectionQty <= this.conversionForm.registAmount
                    ? false
                    : true
            }
        },
        textShow() {
            return this.selectionQty ? true : ''
        }
    }
}
</script>

<style lang="scss" scoped>
.corporate-action-home {
    $disabled: #dadada;
    .header {
        background-color: $primary-color;
        width: 100%;
        color: rgba(235, 235, 235, 1);
        line-height: 32px;
        height: 32px;
        padding: 0 $global-padding;
    }
    .main {
        background-color: $background-color;
        padding: 0 $global-padding;
    }
    .active {
        background: rgba(40, 90, 200, 1);
    }
}
</style>
