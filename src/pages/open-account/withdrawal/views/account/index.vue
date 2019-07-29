<template lang="pug">
    .account-container
        .form-wrapper
            h2.title {{pageText.title}}
            h3.sub-title 为了资金安全，请使用本人同名银行账户出金
            .from(:class="{isOtherBank:isOtherBank}")
                van-cell-group()
                    van-field(
                    label="账户姓名"
                    placeholder="请填写您的姓名"
                    v-model="form.userName"
                    disabled
                    )
                    van-field(
                    disabled
                    placeholder="请选择银行"
                    v-model="form.bankName"
                    @click.native="showBankPopup"
                    )
                        van-icon(name="arrow-down" size="20px" slot="icon")
                        span(slot="label") 银行名称
                    van-field(
                    placeholder="请输入银行名称"
                    v-model="form.otherBank"
                    v-if="isOtherBank"
                    )
                        a.other-bank(href="javascript:;" slot="label") 其他银行
                    van-field(
                    v-model="form.bankAccountView"
                    label="银行账号"
                    placeholder="请填写银行账号"
                    @keyup="checkBankAccountView(form.bankAccountView)"
                    )
                    van-field(
                    label="账户类型"
                    disabled
                    v-model="form.accountType"
                    placeholder="请选择账户类型"
                    @click.native="showAccountTypePopup"
                    )
                        van-icon(name="arrow-down" size="20px" slot="icon")
        .btn-area
            van-button(
                size="large"
                type="primary"
                :disabled="disabled"
                @click="submit"
            ) {{pageText.btn}}
        van-popup(
        v-model="bankShow"
        position ="bottom")
            van-picker(
            show-toolbar
            :columns="bankList"
            @cancel="onCancel"
            @confirm="onConfirm"
            )
        van-popup(
        v-model="accountTypeShow"
        position ="bottom")
            van-picker(
            show-toolbar
            :columns="accountTypeList"
            @cancel="onAccountTypeCancel"
            @confirm="onAccountTypeConfirm"
            )
</template>

<script>
/**
 * 出金流程-添加/编辑香港银行卡账户
 * @ Author LINJAIJUN
 * @ Date 2019/01/02
 */
import { mapGetters } from 'vuex'
import { Icon, Popup, Picker, Toast } from 'vant'
import {
    editBankCardBinding,
    saveBankCardBinding,
    queryAccountTypes,
    queryBankCardBindingDetail
} from '@/service/stock-capital-server.js'
export default {
    components: {
        [Icon.name]: Icon,
        [Popup.name]: Popup,
        [Picker.name]: Picker,
        [Toast.name]: Toast
    },
    data() {
        return {
            pageText: {
                title: '',
                btn: ''
            },
            fromPage: '',
            submitFlag: false,
            isOtherBank: false,
            bankShow: false,
            accountTypeShow: false,
            accountTypeValue: '',
            pageType: '',
            accountTypes: [],
            accountTypeList: [
                {
                    values: []
                }
            ],
            bankList: [
                {
                    values: [
                        '民生银行香港分行',
                        '招商银行香港分行',
                        '工银亚洲（香港）',
                        '永隆银行',
                        '其他银行'
                    ]
                }
            ],
            rules: {
                userName: '',
                bankName: '',
                bankAccountView: '',
                accountType: ''
            },
            form: {
                userName: '',
                bankName: '',
                bankAccount: '',
                bankAccountView: '',
                otherBank: '',
                accountType: ''
            },
            accountTypeListData: [
                {
                    name: 'MAINLAND_BANK',
                    value: '1',
                    msg: '港币账户',
                    msg2: '港币账户（接收港币）'
                },
                {
                    name: 'HONGkONG_BANK',
                    value: '2',
                    msg: '美元账户',
                    msg2: '美元账户（接收美元）'
                },
                {
                    name: 'BANK_TRANSFER',
                    value: '9',
                    msg: '综合账户',
                    msg2: '综合账户（接收港币和美元）'
                }
            ],
            clicked: false
        }
    },
    computed: {
        ...mapGetters([`user`]),
        disabled() {
            return (
                Object.keys(this.rules).some(item => !this.form[item]) ||
                (this.isOtherBank && !this.form.otherBank)
            )
        }
    },
    watch: {
        'form.bankAccountView'(val) {
            if (val.length > 30) {
                this.form.bankAccountView = val.slice(0, 30)
            }
        },
        'form.otherBank'(val) {
            if (val.length > 50) {
                this.form.otherBank = val.slice(0, 50)
            }
        }
    },
    methods: {
        checkBankAccountView(value) {
            this.form.bankAccountView = value.replace(/\D/g, '')
            if (this.form.bankAccountView.length === 30) {
                this.$toast('最多30个字符长度')
                return false
            }
            this.form.bankAccountView = this.parseBankAccountToView(
                this.form.bankAccountView
            )
        },
        parseBankAccountToView(value) {
            return (value + '')
                .replace(/\s/g, '')
                .replace(/(\d{4})(?=\d)/g, '$1 ')
        },
        parseBankAccountToValue(value) {
            return (value + '').replace(/\s/g, '')
        },
        onCancel() {
            this.bankShow = false
        },
        onConfirm(value) {
            this.bankShow = false
            if (value[0] === '其他银行') {
                this.isOtherBank = true
            } else {
                this.isOtherBank = false
            }
            this.form.bankName = value[0]
        },
        onAccountTypeCancel() {
            this.accountTypeShow = false
        },
        onAccountTypeConfirm(value, index) {
            this.accountTypeShow = false
            this.form.accountType = this.accountTypeListData[index].msg
            this.accountTypeValue = this.accountTypes[index].value
        },
        showBankPopup() {
            this.bankShow = true
        },
        showAccountTypePopup() {
            this.accountTypeShow = true
        },
        transAccountTypeToView(val) {
            if (val) {
                val += ''
                let msg = ''
                this.accountTypeListData.forEach(item => {
                    if (item.value === val) {
                        msg = item.msg
                    }
                })
                return msg
            }
        },
        async getUserName() {
            try {
                let data = await this.$accountService.getOpenAccountBasicInfo()
                this.form.userName = `${data.realName || data.realNameEn} ${
                    data.lastName
                } ${data.firstName}`
            } catch (e) {
                this.$toast(e.msg || '网络开小差了,请稍后重试')
            }
        },
        async queryBankCardBindingDetail(id) {
            try {
                let params = {
                    id: id
                }
                this.$loading()
                let data = await queryBankCardBindingDetail(params)
                this.form = Object.assign(this.form, data)
                this.accountTypeValue = this.form.accountType
                this.form.bankAccountView = this.parseBankAccountToView(
                    this.form.bankAccount
                )
                this.form.accountType = this.transAccountTypeToView(
                    this.form.accountType
                )
                if (!this.bankList[0].values.includes(this.form.bankName)) {
                    this.isOtherBank = true
                    this.form.otherBank = this.form.bankName
                    this.form.bankName = '其他银行'
                }
                this.$close()
            } catch (e) {
                this.$close()
                this.$toast(e.msg || '网络开小差了,请稍后重试')
            }
        },
        async queryAccountTypes() {
            try {
                this.accountTypes = await queryAccountTypes()
                let list = []
                this.accountTypeListData.forEach(item => {
                    list.push(item.msg2)
                })
                this.accountTypeList[0].values = list
            } catch (e) {
                this.$toast(e.msg || '网络开小差了,请稍后重试')
            }
        },
        async submit() {
            this.form.bankAccount = this.parseBankAccountToValue(
                this.form.bankAccountView
            )
            let params = Object.assign({}, this.form, {
                accountType: this.accountTypeValue,
                bankAscription: '2', // 银行归属  1-大陆  2-香港
                userId: this.user.userId || this.$constant.userId
            })
            if (this.isOtherBank) {
                params.bankName = this.form.otherBank
            }
            if (!this.clicked) {
                this.clicked = true
                if (this.pageType === 'add') {
                    try {
                        await saveBankCardBinding(params)
                        this.$imgToast({
                            message: '添加成功',
                            cb: () => {
                                this.$router.replace({ name: this.fromPage })
                            }
                        })
                    } catch (e) {
                        this.$toast('添加失败')
                    }
                } else {
                    try {
                        await editBankCardBinding(params)
                        this.$imgToast({
                            message: '修改成功',
                            cb: () => {
                                this.$router.replace({
                                    name: 'manageAccount'
                                })
                            }
                        })
                    } catch (e) {
                        this.$toast('修改失败')
                    }
                }
            }
        }
    },
    async created() {
        delete window.h5HistoryBack
        let param = this.$route.query
        this.pageType = param.type
        this.fromPage = param.fromPage
        this.$loading()
        await this.getUserName()
        await this.queryAccountTypes()
        if (this.pageType === 'edit') {
            this.pageText.title = '修改香港银行卡账户'
            this.pageText.btn = '确认修改'
            this.queryBankCardBindingDetail(param.bindingId)
        } else {
            this.pageText.title = '添加香港银行卡账户'
            this.pageText.btn = '添加'
            this.$close()
        }
    }
}
</script>
<style lang="scss">
#app {
    background: #fff;
}
.account-container {
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
    .from .van-hairline--top-bottom::after {
        border-top: none;
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

.btn-area {
    padding: 16px;

    a {
        display: block;
        height: 47px;
        line-height: 47px;
        text-align: center;
        background: rgba(218, 218, 218, 1);
        border-radius: 4px;
        font-size: 16px;
        color: #fff;
    }

    a.active {
        background: rgba(40, 90, 200, 1);
    }
}
</style>
