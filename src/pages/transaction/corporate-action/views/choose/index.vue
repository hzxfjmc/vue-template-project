<template lang="pug">
yx-container.corporate-action-home
    .header(slot="top")
        p(@click="goToTips") 选股选息是什么？有关选股选息的几点你要知道一下
    .main(slot="main")
        CellInfo(:conversionForm="conversionForm" :serviceCharge="serviceCharge" :fee="fee" :companyActionFee="companyActionFee")
            .cell-item.flex.speci.border-bottom
                .left 红股数量
                .right 
                    van-field(
                        placeholder="请输入红股数量",
                        v-model="dividendAmount",
                        @focus="focusHandle('amount')"
                        @blur="blurHandle('amount')"
                        @input="inputHandle1"
                        )
                    span.unit(v-show='textShow') 股
            .cell-item.flex
                .left 
                .right
                    span.color-gray 最大可选{{conversionForm.singleAmount}}股
                    span.color-blue(@click="allChooseAmount") 全部选股
            .cell-item.flex.speci.border-bottom
                .left 红利金额
                .right 
                    van-field(
                        placeholder="请输入红股金额",
                        v-model="dividendBalance",
                         @focus="focusHandle('balance')"
                        @blur="blurHandle('balance')"
                        @input="inputHandle"
                        )
                    span.unit(v-show='MoneyShow') 港元
            .cell-item.flex
                .left 
                .right 
                    span.color-gray 最大可选{{conversionForm.singleBalance}}港币
                    span.color-blue(@click="allChooseBalance") 全部选息
        VerticalStep(:data="verticalStepData" :title="title" ds=true)
    .bottom(slot="bottom")
        van-button(size="large" :disabled="disabled" type="primary" class="bottom-button" @click="onNextStep") 立即申请
</template>

<script>
import CellInfo from './choose-cell-info.vue'
import VerticalStep from '../../components/vertical-step.vue'
import {
    getAction,
    MoneyCanTake,
    caculate,
    apply
} from '@/service/stock-order-server.js'
import JSBridge from '@/utils/js-bridge'
import { isAndroid } from '@/utils/html-utils'
export default {
    components: {
        CellInfo,
        VerticalStep
    },
    data() {
        return {
            conversionForm: {},
            curName: '',
            dividendAmount: '', //红股数量
            dividendBalance: '', //红利金额
            orginAmount: '',
            orginBalance: '',
            RequestId: '',
            verticalStepData: [],
            serviceCharge: '', //手续费
            fee: '', //总费用
            companyActionFee: '', //公司行动费
            hsDividendAmount: '',
            hsdividendBalance: '',
            amountFocus: '',
            banlanceFocus: '',
            title: '分红流程',
            btnDisable: false, // 按钮是否可按的其中一个条件
            applyFlag: false //是否申请过标志
        }
    },
    created() {
        this.initData()
    },
    mounted() {
        if (isAndroid) {
            const originHeight =
                document.documentElement.clientHeight ||
                document.body.clientHeight
            window.addEventListener(
                'resize',
                () => {
                    const resizeHeight =
                        document.documentElement.clientHeight ||
                        document.body.clientHeight
                    if (resizeHeight < originHeight) {
                        // 键盘弹出所后所需的页面逻辑
                        console.log(222)
                    } else {
                        // 键盘收起所后所需的页面逻辑
                        //因为有两个input，判断哪个被focus，触发哪个的blur事件
                        if (this.amountFocus === true) {
                            this.blurHandle('amount')
                        }
                        if (this.banlanceFocus === true) {
                            this.blurHandle('balance')
                        }
                    }
                },
                false
            )
        }
    },
    computed: {
        rightsId() {
            return this.$route.params.rightsId
        },
        textShow() {
            if (this.dividendAmount === 0) {
                return true
            }
            return this.dividendAmount ? true : ''
        },
        MoneyShow() {
            if (this.dividendBalance === 0) {
                return true
            }
            return this.dividendBalance ? true : ''
        },
        disabled() {
            if (this.btnDisable) {
                return true
            }
            if (!this.conversionForm.trade) {
                //不能交易
                return true
            }
            //如果都为0,按钮不可按
            if (this.dividendBalance === 0 && this.dividendAmount === 0) {
                return true
            }
            return this.hsDividendAmount + this.hsdividendBalance ===
                this.conversionForm.registAmount &&
                this.dividendAmount <= this.conversionForm.singleAmount &&
                this.dividendBalance <= this.conversionForm.singleBalance
                ? false
                : true
        }
    },
    methods: {
        async initData() {
            this.$loading()
            try {
                //第一个接口
                let params = {
                    rightsId: this.rightsId
                }
                let res = await getAction(params)
                this.$close()
                this.conversionForm = res
                this.serviceCharge = res.serviceCharge
                this.fee = res.fee
                this.companyActionFee = res.companyActionFee
                this.verticalStepData = [
                    `申请开始日:${res.applyBeginDate}`,
                    `申请截止日:${res.applyEndDate}`,
                    `红股派送日:${res.dividendDate}`,
                    `红股上市日:${res.listingDate}`
                ]
                // 0 选股 1选息
                if (res.scripCash) {
                    this.dividendBalance = res.singleBalance
                } else {
                    this.dividendAmount = res.singleAmount
                }
                //申请过就直接跳到记录页面
                if (res.applyFlag) {
                    this.$router.push({
                        name: 'chooseRecord'
                    })
                } else {
                    //否则就要展示默认值
                    let params2 = {
                        rightsId: this.rightsId,
                        dividendBalance: this.dividendBalance,
                        dividendAmount: this.dividendAmount
                    }
                    let resC = await caculate(params2)
                    this.hsDividendAmount = resC.hsDividendAmount
                    this.hsdividendBalance = resC.hsdividendBalance
                    this.dividendBalance = resC.dividendBalance
                    this.dividendAmount = resC.dividendAmount
                    this.orginBalance = resC.dividendBalance
                    this.orginAmount = resC.dividendAmount
                }
            } catch (e) {
                await this.$toast(e.msg || '网络开小差了,请稍后重试')
            }
            let param = {
                moneyType: 2
            }
            MoneyCanTake(param)
                .then(res => {
                    this.conversionForm.banlance = res.withdrawBalance
                })
                .catch(res => {
                    this.$toast(res.msg || '网络开小差了,请稍后重试')
                })
        },
        onNextStep() {
            this.$confirm({
                title: '是否确认申请',
                confirmButtonText: '确认',
                cancelButtonText: '取消'
            })
                .then(() => {
                    this.successHander()
                })
                .catch(() => {})
        },
        async successHander() {
            //立即申请
            this.$loading()
            let params = {
                rightsId: this.rightsId,
                selectionQty: this.dividendAmount, //红股数量
                dividendBalance: this.dividendBalance, //红利金额
                hsDividendAmountQty: this.hsDividendAmount,
                hsDividendBalanceQty: this.hsdividendBalance
            }
            try {
                await apply(params)
                this.$close()
                this.$router.push({
                    name: 'chooseRecord'
                })
            } catch (e) {
                await this.$toast(e.msg || '网络开小差了,请稍后重试')
            }
        },
        focusHandle(evt) {
            this.btnDisable = true
            if (evt === 'amount') {
                this.amountFocus = true
                this.banlanceFocus = false
            } else {
                this.banlanceFocus = true
                this.amountFocus = false
            }
        },
        async blurHandle(evt) {
            this.btnDisable = false
            if (evt === 'amount') {
                let params = {
                    rightsId: this.rightsId,
                    dividendAmount: this.dividendAmount
                }
                //如果输入框的值没有变动就不用请求
                if (this.orginAmount != this.dividendAmount) {
                    try {
                        let res = await caculate(params)
                        this.dividendBalance = res.dividendBalance
                        this.dividendAmount = res.dividendAmount
                        this.orginBalance = res.dividendBalance
                        this.orginAmount = res.dividendAmount
                        this.hsDividendAmount = res.hsDividendAmount
                        this.hsdividendBalance = res.hsdividendBalance
                        this.fee = res.fee
                        this.serviceCharge = res.serviceCharge
                        this.companyActionFee = res.companyActionFee
                    } catch (e) {
                        await this.$toast(e.msg || '网络开小差了,请稍后重试')
                    }
                }
            }
            if (evt === 'balance') {
                let params2 = {
                    rightsId: this.rightsId,
                    dividendBalance: this.dividendBalance
                }
                if (this.orginBalance != this.dividendBalance) {
                    try {
                        let res = await caculate(params2)
                        this.dividendAmount = res.dividendAmount
                        this.dividendBalance = res.dividendBalance
                        this.orginBalance = res.dividendBalance
                        this.orginAmount = res.dividendAmount
                        this.hsDividendAmount = res.hsDividendAmount
                        this.hsdividendBalance = res.hsdividendBalance
                        this.fee = res.fee
                        this.serviceCharge = res.serviceCharge
                        this.companyActionFee = res.companyActionFee
                    } catch (e) {
                        await this.$toast(e.msg || '网络开小差了,请稍后重试')
                    }
                }
            }
        },
        inputHandle1() {
            let regs = [
                [/^0(\d+)$/, '$1'], //禁止录入整数部分两位以上，但首位为0
                [/[^\d]+$/, ''] //禁止录入任何非数字
            ]
            for (let i = 0; i < regs.length; i++) {
                let reg = regs[i][0]
                this.dividendAmount = String(this.dividendAmount).replace(
                    reg,
                    regs[i][1]
                )
            }
        },
        inputHandle() {
            let regs = [
                [/^0(\d+)$/, '$1'], //禁止录入整数部分两位以上，但首位为0
                [/[^\d.]+$/, ''], //禁止录入任何非数字和点
                [/\.(\d?)\.+/, '.$1'], //禁止录入两个以上的点
                [/^(\d+\.\d{2}).+/, '$1'] //禁止录入小数点后两位以上
            ]
            for (let i = 0; i < regs.length; i++) {
                let reg = regs[i][0]
                this.dividendBalance = String(this.dividendBalance).replace(
                    reg,
                    regs[i][1]
                )
            }
        },
        allChooseAmount() {
            //全部选股
            this.dividendAmount = this.conversionForm.singleAmount
            this.blurHandle('amount')
        },
        allChooseBalance() {
            //全部选息
            this.dividendBalance = this.conversionForm.singleBalance
            this.blurHandle('balance')
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
    .bottom {
        background-color: $disabled;
        height: 48px;
        line-height: 48px;
        font-size: 16px;
        text-align: center;
        color: #fff;
    }
}
</style>
