<template lang="pug">
yx-container
    .main(slot="main")
        .withdraw-rmb
            .form-wrapper
                h2.title 您正在将{{itemData.couponName}} {{itemData.offerAmount|offerAmountFilter}}元提现至银行卡
                h3.sub-title 为保证您顺利收到资金，请正确填写收款银行卡信息
                    van-cell-group()
                        van-field(
                        label="持卡人"
                        placeholder="请填写您的姓名"
                        v-model="form.customerName"
                        disabled
                        )
                        van-field(
                        placeholder="大陆银行借记卡号"
                        v-model="form.bankCardNo"
                        @input="changeBankHandle"
                        )
                            span(slot="label") 银行卡号
                        van-field(
                        v-model="form.bankReserveMobile"
                        label="手机号码"
                        placeholder="请输入银行卡预留手机号码"
                        type="number"
                        @input="changephoneHandle($event,'phone')"
                        )
                            van-icon(name="info-o" size="20px" slot="icon" @click="bankAlert")
                        van-field(
                        v-model="form.openingBankName"
                        label="开户银行"
                        placeholder="例如：中国建设银行"
                        @input="changephoneHandle($event,'bank')"
                        )
                        van-field(
                        label="开户支行"
                        v-model="form.openingBankBranch"
                        placeholder="例如：深圳科苑支行"
                       @input="changephoneHandle($event,'bankBranch')"
                        )
                            van-icon(name="info-o" size="20px" slot="icon" @click="bankSubAlert")
                        van-field(
                        label="开户支行所在省市"
                        disabled
                        v-model="form.openingBankProvincity"
                        placeholder="开户支行所在省市"
                        @click.native="showAccountTypePopup"
                        )
                            van-icon(name="arrow-down" size="20px" slot="icon")
                h3.sub-title 温馨提示：            
                h3.sub-title 1、对于币种为人民币的现金券提现，目前仅支持提现至开户本人的大陆银行卡，如遇困难请联系客服；  
                h3.sub-title 2、提现预计3~5个工作日到账，如遇节假日则顺延；
                h3.sub-title 3、提交银行卡信息后无法修改，请您确保填写信息的正确无误，如因信息填写错误造成的损失将由用户个人承担。
    .footer(slot='bottom')
            .btn-area-withdraw
                van-button(
                    size="large"
                    type="primary"
                    :disabled="disabled"
                    @click="submit"
                ) 下一步
            van-popup(
                v-model="accountTypeShow"
                position ="bottom"
                )
                van-area(
                :area-list="areaList" 
                :columns-num="2"
                :value="value"
                title="标题"
                @cancel="onAccountTypeCancel"
                @confirm="onAccountTypeConfirm")
            van-dialog.dialog-consult(v-model="showConsult" 
                show-cancel-button
                @confirm="confirmHandle"
                cancelButtonText='返回' 
                confirmButtonText="确定并提交")
                .cell-box
                    h2.title.align-center 请确认以下信息确认无误
                    .cell-item.flex
                        .left 提现金额
                        .right 友信證券（香港）有限公司
                    .cell-item.flex
                        .left 持卡人
                        .right {{origincustomerName}}
                    .cell-item.flex
                        .left 银行卡号
                        .right {{parseBankAccountToView(submitBankCardNo)}}
                    .cell-item.flex
                        .left 开户银行
                        .right {{form.openingBankName}}
                    .cell-item.flex
                        .left 开户支行
                        .right {{form.openingBankBranch}}
                    .cell-item.flex
                        .left 开户所在省市
                        .right {{form.openingBankProvincity}}
                    .cell-item.flex
                        .left 到账时间
                        .right 预计3-5个工作日到账
</template>

<script>
import { Icon, Popup, Picker, Toast, Area } from 'vant'
import areaList from './area.js'
// import areaListCht from './area-cht.js'
import {
    bankCardVerification,
    submitWithdrawRecord,
    getOpenAccountBasicInfo,
    getWithdrawRecord
} from '@/service/product-server.js'
import jsBridge from '@/utils/js-bridge.js'
export default {
    components: {
        [Icon.name]: Icon,
        [Popup.name]: Popup,
        [Picker.name]: Picker,
        [Toast.name]: Toast,
        [Area.name]: Area
    },
    i18n: {
        zhCHS: {
            確認: '确认'
        },
        zhCHT: {
            確認: '確認'
        }
    },
    data() {
        return {
            accountTypeShow: false,
            form: {
                customerName: '',
                bankCardNo: '',
                bankReserveMobile: '',
                openingBankName: '',
                openingBankBranch: '',
                openingBankProvincity: '',
                openingBankProvince: '',
                openingBankCity: ''
            },
            //rules不动
            rules: {
                customerName: '',
                bankCardNo: '',
                bankReserveMobile: '',
                openingBankName: '',
                openingBankBranch: '',
                openingBankProvincity: '',
                openingBankProvince: '',
                openingBankCity: ''
            },
            clicked: false,
            areaList,
            showConsult: false,
            origincustomerName: '',
            orginBankCardNo: '',
            hasDealBankCardNo: '',
            submitBankCardNo: '',
            itemData: {},
            value: '110000'
        }
    },
    methods: {
        onAccountTypeCancel() {
            this.accountTypeShow = false
        },
        onAccountTypeConfirm(value) {
            this.form.openingBankProvince = value[0]['name']
            this.form.openingBankCity = value[1]['name']
            this.form.openingBankProvincity =
                this.form.openingBankProvince === this.form.openingBankCity
                    ? this.form.openingBankProvince
                    : this.form.openingBankProvince + this.form.openingBankCity
            this.accountTypeShow = false
        },
        showBankPopup() {
            this.bankShow = true
        },
        showAccountTypePopup() {
            this.accountTypeShow = true
        },
        async getUserName() {
            try {
                let data = await getOpenAccountBasicInfo()
                this.orginBankCardNo = data.bankCard
                this.origincustomerName = data.realName
                this.form.bankReserveMobile = data.bankMobile
                this.form.customerName = this.dealName(data.realName)
                this.form.bankCardNo = this.dealIdcard(data.bankCard)
                this.hasDealBankCardNo = this.dealIdcard(data.bankCard)
            } catch (e) {
                this.$toast(e.msg || '网络开小差了,请稍后重试')
            }
        },
        async getWithdrawRecord() {
            try {
                let data = await getWithdrawRecord()
                if (data.customerName) {
                    this.form = data
                    this.form.customerName = this.dealName(data.customerName)
                    this.form.bankCardNo = this.dealIdcard(data.bankCardNo)
                    this.form.openingBankProvincity =
                        data.openingBankProvince + data.openingBankCity
                }
            } catch (e) {
                this.$toast(e.msg || '网络开小差了,请稍后重试')
            }
        },
        dealName(strName) {
            if (strName) {
                let starStr = ''
                for (let i = 0; i < strName.length - 1; i++) {
                    starStr = starStr + '*'
                }
                strName = strName.substr(0, 1) + starStr
            }
            return strName
        },
        dealIdcard(num) {
            if (num) {
                let lastNum = num.substr(-4)
                let starStr = ''
                for (let i = 0; i < num.length - 4; i++) {
                    starStr = starStr + '*'
                }
                return starStr + lastNum
            }
        },
        parseBankAccountToView(value) {
            return (value + '')
                .replace(/\s/g, '')
                .replace(/(\d{4})(?=\d)/g, '$1 ')
        },
        bankAlert() {
            this.$alert({
                className: 'alert-box',
                message: `银行预留手机号是在银行办卡时填写的手机号,若遗忘、换号可以联系银行客服电话处理`,
                confirmButtonText: '我知道了'
            }).then(() => {})
        },
        bankSubAlert() {
            this.$alert({
                className: 'alert-box',
                message: `你所办理的银行卡开户的分支银行，如果您忘记了自己的银行支行名称，可以通过拨打银行的客服电话详细咨询`,
                confirmButtonText: '我知道了'
            }).then(() => {})
        },
        changeBankHandle(val) {
            if (val.length > 19) {
                this.form.bankCardNo = val.slice(0, 19)
            }
            let regs = [
                [/[^\d]+$/, ''] //禁止录入任何非数字
            ]
            for (let i = 0; i < regs.length; i++) {
                let reg = regs[i][0]
                this.$nextTick(() => {
                    this.$set(
                        this.form,
                        'bankCardNo',
                        this.form.bankCardNo.replace(reg, regs[i][1])
                    )
                })
            }
        },
        changephoneHandle(val, type) {
            if (type === 'phone') {
                if (val.length > 11) {
                    this.form.bankReserveMobile = val.slice(0, 11)
                }
            }
            if (type === 'bank') {
                if (val.length > 12) {
                    this.form.openingBankName = val.slice(0, 12)
                }
            }
            if (type === 'bankBranch') {
                if (val.length > 12) {
                    this.form.openingBankBranch = val.slice(0, 12)
                }
            }
        },
        async submit() {
            //如果没有有改动就传原始值
            if (this.hasDealBankCardNo === this.form.bankCardNo) {
                this.submitBankCardNo = this.orginBankCardNo
            } else {
                this.submitBankCardNo = this.form.bankCardNo
            }
            try {
                let params = {
                    bankCardNo: this.submitBankCardNo,
                    bankReserveMobile: this.form.bankReserveMobile
                }
                this.$loading('校验中...')
                let data = await bankCardVerification(params)
                if (data.code === 0) {
                    this.showConsult = true
                } else {
                    this.$alert({
                        message: data.msg,
                        confirmButtonText: '知道了'
                    })
                }
                this.$close()
            } catch (e) {
                this.$toast(e.msg || '网络开小差了,请稍后重试')
            }
        },
        async confirmHandle() {
            try {
                let params = {
                    customerName: this.origincustomerName,
                    bankCardNo: this.submitBankCardNo,
                    bankReserveMobile: this.form.bankReserveMobile,
                    openingBankName: this.form.openingBankName,
                    openingBankBranch: this.form.openingBankBranch,
                    openingBankProvince: this.form.openingBankProvince,
                    openingBankCity: this.form.openingBankCity,
                    businessId: this.$route.query.couponBusinessId
                }
                await jsBridge.callApp('command_trade_login')
                await submitWithdrawRecord(params)
                this.$alert({
                    title: '提交成功',
                    message: '预计3-5个工作日到账',
                    confirmButtonText: '我知道了'
                }).then(() => {
                    this.$router.push({ name: 'ch' })
                })
            } catch (e) {
                this.$toast(e.msg || '网络开小差了,请稍后重试')
            }
        }
    },
    async created() {
        this.$loading()
        this.itemData.couponName = this.$route.query.couponName
        this.itemData.offerAmount = this.$route.query.offerAmount
        await this.getUserName()
        await this.getWithdrawRecord()
        this.$close()
    },
    computed: {
        disabled() {
            return Object.keys(this.rules).some(item => !this.form[item])
        }
    },
    filters: {
        offerAmountFilter(value) {
            return value / 100
        }
    }
}
</script>
<style lang="scss">
#app {
    background: #fff;
    .withdraw-rmb {
        .van-cell__title {
            width: 120px;
        }
    }
    .btn-area-withdraw {
        .van-button {
            border-radius: 0;
        }
    }
}
.withdraw-rmb {
    .van-cell {
        padding-left: 0;
    }

    .van-cell:not(:last-child)::after {
        content: ' ';
        position: absolute;
        pointer-events: none;
        box-sizing: border-box;
        left: 0;
        right: 0;
        bottom: 0;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
        border-bottom: 1px solid #ebedf0;
    }
    .isOtherBank {
        .van-cell:nth-child(2)::after {
            left: 80px;
        }
        .van-cell:nth-child(3)::after {
            left: 80px;
        }
    }
    .van-picker__cancel {
        color: rgba(53, 53, 71, 1);
    }
}
</style>
<style scoped lang="scss">
.form-wrapper {
    padding: 14px;
    font-size: 12px;

    .title {
        font-size: 18px;
        font-weight: 500;
    }

    .sub-title {
        font-size: 12px;
        opacity: 0.5;
    }

    .from {
        margin-top: 33px;
        .other-bank {
            visibility: hidden;
        }
    }
}

.btn-area-withdraw {
    a {
        display: block;
        height: 47px;
        line-height: 47px;
        text-align: center;
        background: rgba(218, 218, 218, 1);
        font-size: 16px;
        color: #fff;
    }

    a.active {
        background: rgba(40, 90, 200, 1);
    }
}
.dialog-consult {
    .cell-item {
        padding-top: 10px;
        word-break: keep-all;
        .left {
            color: $text-color5;
            font-size: 14px;
            padding-left: 10px;
        }
    }
    .cell-box {
        padding: $global-padding;
        font-size: 14px;
    }
    .cell-box:last-child {
        border: 0;
    }
}
.align-center {
    text-align: center;
}
</style>
