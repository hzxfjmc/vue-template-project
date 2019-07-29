<template lang="pug">
yx-container.corporate-action-home
    .header(slot="top")
        p(@click="goToTips") {{$t('rightsTip')}}
    .main(slot="main")
        CellInfo(:conversionForm="conversionForm" 
         :serviceCharge="serviceCharge" 
         :selectionQty="selectionQty" 
         :withdrawBalance="withdrawBalance"
         :fee="fee"
         )
            .cell-item.flex.speci
                .left {{$t('供股數')}}
                .right 
                    van-field(
                       :placeholder=`$t('請输入供股數')`,
                        @input="inputHandle"
                        v-model="selectionQty"
                        @blur="changeHandle($event)"
                        )
                    span(v-show='textShow') {{$t('share')}}
        VerticalStep(:data="verticalStepData" :title="title")
    .bottom(slot="bottom")
        van-button(size="large" :disabled="disabled" type="primary" class="bottom-button" @click="onNextStep") {{$t('confirm')}}
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
    i18n: {
        zhCHS: {
            供股數: '供股数',
            請输入供股數: '请输入供股数',
            供股申請開始日: '供股申请开始日',
            供股申請截止日: '供股申请截止日',
            正股派送日: '正股派送日',
            正股上市日: '正股上市日',
            ifConfirm: res => {
                return `是否确认${res}的供股申請`
            },
            finalDay: '股权最后交易日'
        },
        zhCHT: {
            供股數: '供股數',
            請输入供股數: '請输入供股數',
            供股申請開始日: '供股申請開始日',
            供股申請截止日: '供股申請截止日',
            正股派送日: '正股派送日',
            正股上市日: '正股上市日',
            ifConfirm: res => {
                return `是否確認${res}的供股申請`
            },
            finalDay: '股權最后交易日'
        },
        en: {
            供股數: 'Accepted',
            請输入供股數: 'Please enter the number of shares offered',
            供股申請開始日: 'Rights issue start date',
            供股申請截止日: 'Rights issue application deadline',
            正股派送日: 'Stock delivery day',
            正股上市日: 'Stock listing day',
            ifConfirm: res => {
                return `Whether to confirm the ${res} rights issue application`
            },
            finalDay: 'Final trading day of equity'
        }
    },
    data() {
        return {
            conversionForm: {},
            verticalStepData: [],
            curName: '',
            selectionQty: '',
            serviceCharge: '', //手續費
            fee: '',
            withdrawBalance: '',
            applyId: '',
            applyFlag: false //是否申請过标志
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
                    this.$toast(res.msg || this.$t('netError'))
                })
            let params = {
                rightsId: this.rightsId
            }
            getAction(params)
                .then(res => {
                    this.$close()
                    this.conversionForm = res
                    this.verticalStepData = [
                        `${this.$t('供股申請開始日')}:${res.applyBeginDate}`,
                        `${this.$t('供股申請截止日')}:${res.applyEndDate}`,
                        `${this.$t('正股派送日')}:${res.dividendDate}`,
                        `${this.$t('正股上市日')}:${res.listingDate}`
                    ]
                    this.applyId = res.applyId
                    this.serviceCharge = res.serviceCharge
                    this.fee = res.fee
                    //可交易
                    if (!res.tradeFlag) {
                        this.verticalStepData.splice(
                            1,
                            0,
                            `${this.$t('finalDay')}:${res.tradingPeriodTo}`
                        )
                    }
                    if (res.applyFlag) {
                        //是否申請过
                        this.selectionQty = res.bonusAmount
                        this.applyFlag = true
                        //申請过需要回显數据
                        this.changeHandle()
                    } else {
                        this.selectionQty = res.registAmount
                    }
                })
                .catch(res => {
                    this.$toast(res.msg || this.$t('netError'))
                })
        },
        inputHandle() {
            let regs = [
                [/^0(\d+)$/, '$1'], //禁止录入整數部分两位以上，但首位为0
                [/[^\d]+$/, ''] //禁止录入任何非數字
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
                title: this.$t('ifConfirm', this.conversionForm.stockName),
                confirmButtonText: this.$t('confirmed'),
                cancelButtonText: this.$t('cancelled')
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
                    await this.$toast(e.msg || this.$t('netError'))
                }
            } else {
                //第一次申請
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
                    await this.$toast(e.msg || this.$t('netError'))
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
                    await this.$toast(e.msg || this.$t('netError'))
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
                    await this.$toast(e.msg || this.$t('netError'))
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
        },
        title() {
            return this.$t('process')
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
