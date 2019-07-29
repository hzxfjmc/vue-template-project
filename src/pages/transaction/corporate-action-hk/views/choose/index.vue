<template lang="pug">
yx-container.corporate-action-home
    .header(slot="top")
        p(@click="goToTips") {{$t('chooseTip')}}
    .main(slot="main")
        CellInfo(:conversionForm="conversionForm" :serviceCharge="serviceCharge" :fee="fee" :companyActionFee="companyActionFee")
            .cell-item.flex.speci.border-bottom
                .left {{$t('紅股數量')}}
                .right 
                    van-field(
                        :placeholder=`$t('請输入紅股數量')`,
                        v-model="dividendAmount",
                        @focus="focusHandle('amount')"
                        @blur="blurHandle('amount')"
                        @input="inputHandle1"
                        )
                    span.unit(v-show='textShow') {{$t('shares')}}
            .cell-item.flex
                .left 
                .right
                    span.color-gray {{$t('最大可選股',conversionForm.singleAmount)}}
                    span.color-blue(@click="allChooseAmount") {{$t('全部選股')}}
            .cell-item.flex.speci.border-bottom
                .left {{$t('紅利金额')}}
                .right 
                    van-field(
                        :placeholder=`$t('請输入紅股金额')`,
                        v-model="dividendBalance",
                        @focus="focusHandle('balance')"
                        @blur="blurHandle('balance')"
                        @input="inputHandle"
                        )
                    span.unit(v-show='MoneyShow') {{$t('HKD')}}
            .cell-item.flex
                .left 
                .right 
                    span.color-gray  {{$t('最大可選息',conversionForm.singleBalance)}}
                    span.color-blue(@click="allChooseBalance") {{$t('全部選息')}}
        VerticalStep(:data="verticalStepData" :title="title" ds=true)
    .bottom(slot="bottom")
        van-button(size="large" :disabled="disabled" type="primary" class="bottom-button" @click="onNextStep") {{$t('立即申請')}}
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
    i18n: {
        //简体
        zhCHS: {
            紅股數量: '红股数量',
            紅利金额: '红利金额',
            請输入紅股數量: '请输入红股数量',
            最大可選股: res => {
                return `最大可选${res}股`
            },
            最大可選息: res => {
                return `最大可选${res}港币`
            },
            全部選股: '全部选股',
            全部選息: '全部选息',
            立即申請: '立即申请',
            請输入紅股金额: '请输入红股金额',
            申請開始日: '申请开始日',
            申請截止日: '申请截止日',
            紅股派送日: '红股派送日',
            紅股上市日: '红股上市日',
            是否確認申請: '是否确认申请'
        },
        zhCHT: {
            紅股數量: '紅股數量',
            紅利金额: '紅利金额',
            請输入紅股數量: '請输入紅股數量',
            最大可選股: res => {
                return `最大可選${res}股`
            },
            最大可選息: res => {
                return `最大可選${res}港幣`
            },
            全部選股: '全部選股',
            全部選息: '全部選息',
            立即申請: '立即申請',
            請输入紅股金额: '請输入紅股金额',
            申請開始日: '申請開始日',
            申請截止日: '申請截止日',
            紅股派送日: '紅股派送日',
            紅股上市日: '紅股上市日',
            是否確認申請: '是否確認申請'
        },
        en: {
            紅股數量: 'Number of bonus shares',
            紅利金额: 'Bonus amount',
            請输入紅股數量: 'Please enter the number of bonus shares',
            最大可選股: res => {
                return `Maximum optional ${res} shares`
            },
            最大可選息: res => {
                return `Maximum optional ${res} HKD`
            },
            全部選股: 'All stock picking',
            全部選息: 'All interest rates',
            立即申請: 'confirm',
            請输入紅股金额: 'Please enter the amount of bonus shares',
            申請開始日: 'Election Start',
            申請截止日: 'Election Cut-off',
            紅股派送日: 'Cash Payable',
            紅股上市日: 'Scrip Payable',
            是否確認申請: 'Whether to confirm the application'
        }
    },
    data() {
        return {
            conversionForm: {},
            curName: '',
            dividendAmount: '', //紅股數量
            dividendBalance: '', //紅利金额
            orginAmount: '',
            orginBalance: '',
            RequestId: '',
            verticalStepData: [],
            serviceCharge: '', //手續費
            fee: '', //总费用
            companyActionFee: '', //公司行动费
            hsDividendAmount: '',
            hsdividendBalance: '',
            amountFocus: '',
            banlanceFocus: '',
            btnDisable: false, // 按钮是否可按的其中一个条件
            applyFlag: false //是否申請过标志
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
            if (!this.conversionForm.trade) {
                //不能交易
                return true
            }
            if (this.btnDisable) {
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
        },
        title() {
            return this.$t('dividendProcess')
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
                    `${this.$t('申請開始日')}:${res.applyBeginDate}`,
                    `${this.$t('申請截止日')}:${res.applyEndDate}`,
                    `${this.$t('紅股派送日')}:${res.dividendDate}`,
                    `${this.$t('紅股上市日')}:${res.listingDate}`
                ]
                // 0 選股 1選息
                if (res.scripCash) {
                    this.dividendBalance = res.singleBalance
                } else {
                    this.dividendAmount = res.singleAmount
                }
                //申請过就直接跳到记录页面
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
                await this.$toast(e.msg || this.$t('netError'))
            }
            let param = {
                moneyType: 2
            }
            MoneyCanTake(param)
                .then(res => {
                    this.conversionForm.banlance = res.withdrawBalance
                })
                .catch(res => {
                    this.$toast(res.msg || this.$t('netError'))
                })
        },
        onNextStep() {
            this.$confirm({
                title: this.$t('是否確認申請'),
                confirmButtonText: this.$t('confirmed'),
                cancelButtonText: this.$t('cancelled')
            })
                .then(() => {
                    this.successHander()
                })
                .catch(() => {})
        },
        async successHander() {
            //立即申請
            this.$loading()
            let params = {
                rightsId: this.rightsId,
                selectionQty: this.dividendAmount, //紅股數量
                dividendBalance: this.dividendBalance, //紅利金额
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
                await this.$toast(e.msg || this.$t('netError'))
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
                        await this.$toast(e.msg || this.$t('netError'))
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
                        await this.$toast(e.msg || this.$t('netError'))
                    }
                }
            }
        },
        inputHandle1() {
            let regs = [
                [/^0(\d+)$/, '$1'], //禁止录入整數部分两位以上，但首位为0
                [/[^\d]+$/, ''] //禁止录入任何非數字
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
                [/^0(\d+)$/, '$1'], //禁止录入整數部分两位以上，但首位为0
                [/[^\d.]+$/, ''], //禁止录入任何非數字和点
                [/\.(\d?)\.+/, '.$1'], //禁止录入两个以上的点
                [/^(\d+\.\d{2}).+/, '$1'] //禁止录入小數点后两位以上
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
            //全部選股
            this.dividendAmount = this.conversionForm.singleAmount
            this.blurHandle('amount')
        },
        allChooseBalance() {
            //全部選息
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
