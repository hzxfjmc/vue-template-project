<template lang="pug">
    .full-height.flex-fixed.account-container
        .scroll-able.flex-fixed-container
            .form-wrapper
                h2.title {{pageText.title}}
                h3.sub-title {{$t('account.subTitle')}}
                van-cell-group()
                    van-field(
                    :label="$t('account.labelUserName')"
                    :placeholder="$t('account.placeholder1')"
                    v-model="form.userName"
                    disabled
                    )
                    van-field(
                    disabled
                    :placeholder="$t('account.placeholder2')"
                    v-model="form.bankName"
                    @click.native="showBankPopup"
                    )
                        i(class="icon-pull-down iconfont icon-pulldown_icon" slot="icon")
                        span(slot="label") {{$t('account.labelBankName')}}
                    van-field(
                    :placeholder="$t('account.placeholder3')"
                    v-model="form.otherBank"
                    v-if="isOtherBank"
                    )
                        span.other-bank(slot="label") {{$t('account.labelOtherBank')}}
                    van-field(
                    v-model="form.bankAccountView"
                    :label="$t('account.labelBankAccount')"
                    :placeholder="$t('account.placeholder4')"
                    @keyup="checkBankAccountView(form.bankAccountView)"
                    )
                    van-field(
                    :label="$t('account.labelAccountType')"
                    disabled
                    v-model="form.accountType"
                    :placeholder="$t('account.placeholder5')"
                    @click.native="showAccountTypePopup"
                    )
                        i(class="icon-pull-down iconfont icon-pulldown_icon" slot="icon")
        van-button(
        size="large"
        type="primary"
        class="bottom-button"
        :disabled="disabled"
        @click="submit"
        ) {{pageText.btn}}
        yx-popup(
        v-model="bankShow"
        position ="bottom")
            van-picker(
            :confirm-button-text="$t('account.buttonTextConfirm')"
            :cancel-button-text = "$t('account.buttonTextCancel')"
            class="picker"
            show-toolbar
            :columns="bankList"
            @cancel="onCancel"
            @confirm="onConfirm"
            )
        yx-popup(
        v-model="accountTypeShow"
        position ="bottom")
            .account-type-box
                ul
                    li.item(v-for="item in accountTypes" :class="{active:Number(item.value) === Number(accountTypeValue)}" @click="clickAccountType(item)") {{item.msg2}}
</template>

<script>
/**
 * 出金流程（门店开户）-添加/编辑香港银行卡账户
 * @ Author LINJIAJUN
 * @ Date 2019/04/10
 */
import { mapGetters } from 'vuex'
import { Popup, Picker } from 'vant'
import {
    editBankCardBinding,
    saveBankCardBinding,
    queryAccountTypes,
    queryBankCardBindingDetail
} from '@/service/stock-capital-server.js'
export default {
    components: {
        [Popup.name]: Popup,
        [Picker.name]: Picker
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
            accountTypeList: [],
            bankList: [
                {
                    values: [
                        this.$t('bank.minSheng'),
                        this.$t('bank.merchants'),
                        this.$t('bank.icbc'),
                        this.$t('bank.wingLung'),
                        this.$t('bank.otherBank')
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
                this.$toast(this.$t('validator.maxLength'))
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
            if (value[0] === this.$t('account.labelOtherBank')) {
                this.isOtherBank = true
            } else {
                this.isOtherBank = false
            }
            this.form.bankName = value[0]
        },
        showBankPopup() {
            this.bankShow = true
        },
        showAccountTypePopup() {
            this.accountTypeShow = true
        },
        clickAccountType(item) {
            this.form.accountType = item.msg
            this.accountTypeValue = item.value
            this.accountTypeShow = false
        },
        transAccountTypeToView(val) {
            if (val) {
                val += ''
                let msg = ''
                this.accountTypes.forEach(item => {
                    if (item.value === val) {
                        msg = item.msg
                    }
                })
                return msg
            }
        },
        async getUserName() {
            try {
                let data = await this.$accountService.getCustOpenAccountInfo()
                this.form.userName = data.lastName
                    ? `${data.realName || ''} ${data.lastName} ${
                          data.firstName
                      }`
                    : `${data.realName || ''} ${data.realNameEn || ''}`
            } catch (e) {
                this.$toast(e.msg || this.$t('netErrorTips'))
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
                    this.form.bankName = this.$t('bank.otherBank')
                }
                this.$close()
            } catch (e) {
                this.$toast(e.msg || this.$t('netErrorTips'))
            }
        },
        // 获取账户类型列表
        async queryAccountTypes() {
            try {
                let list = await queryAccountTypes()
                list.forEach(item => {
                    switch (item.value) {
                        case '1':
                            item.msg = this.$t('account.accountTypeHk1')
                            item.msg2 = this.$t('account.accountTypeHk2')
                            break
                        case '2':
                            item.msg = this.$t('account.accountTypeUs1')
                            item.msg2 = this.$t('account.accountTypeUs2')
                            break
                        case '9':
                            item.msg = this.$t('account.accountTypeAll1')
                            item.msg2 = this.$t('account.accountTypeAll2')
                            break
                    }
                })
                this.accountTypes = list
            } catch (e) {
                this.$toast(e.msg || this.$t('netErrorTips'))
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
                this.$loading()
                if (this.pageType === 'add') {
                    try {
                        await saveBankCardBinding(params)
                        this.$close()
                        this.$imgToast({
                            message: this.$t('account.tips1'),
                            cb: () => {
                                this.$router.replace({ name: this.fromPage })
                            }
                        })
                    } catch (e) {
                        this.$toast(this.$t('account.tips2'))
                    }
                } else {
                    try {
                        await editBankCardBinding(params)
                        this.$close()
                        this.$imgToast({
                            message: this.$t('account.tips3'),
                            cb: () => {
                                this.$router.replace({
                                    name: 'manage-account'
                                })
                            }
                        })
                    } catch (e) {
                        this.$toast(this.$t('account.tips4'))
                    }
                }
            }
        }
    },
    async created() {
        window.h5HistoryBack = () => {
            history.back()
            return true
        }
        let params = this.$route.query
        this.pageType = params.type
        this.fromPage = params.fromPage
        this.$loading()
        await this.getUserName()
        await this.queryAccountTypes()
        this.$close()
        if (this.pageType === 'edit') {
            this.pageText.title = this.$t('account.title2')
            this.pageText.btn = this.$t('account.btnModifyText')
            this.queryBankCardBindingDetail(params.bindingId)
        } else {
            this.pageText.title = this.$t('account.title1')
            this.pageText.btn = this.$t('account.btnAddText')
        }
    }
}
</script>
<style lang="scss">
.form-wrapper {
    .van-cell {
        padding: 20px 0;
        font-size: 16px;
        .van-cell__title {
            opacity: 0.5968;
            color: $hk-text-color;
        }
    }
    .van-hairline--top-bottom::after {
        border: none;
    }
    .van-cell:first-child::after {
        border-bottom: none;
    }
    .van-cell::after {
        content: ' ';
        position: absolute;
        pointer-events: none;
        box-sizing: border-box;
        left: 80px;
        right: 0;
        bottom: 0;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
        border-bottom: 1px solid #ebedf0;
    }
}
</style>
<style scoped lang="scss">
.form-wrapper {
    padding: 18px;
    font-size: 12px;
    .title {
        font-size: 28px;
        font-weight: 500;
    }
    .sub-title {
        opacity: 0.5;
    }
    .from {
        margin-top: 33px;
        .other-bank {
            visibility: hidden;
        }
    }
}
.icon-pull-down {
    padding-right: 10px;
    font-size: 10px;
}
.account-type-box {
    .item {
        font-size: 16px;
        opacity: 0.5;
        border-bottom: 1px solid rgba(121, 121, 121, 0.2);
        padding: 18px 0px;
        text-align: center;
        &:last-child {
            border-bottom: none;
        }
    }
    .item.active {
        opacity: 1;
        color: $hk-primary-color;
    }
}
.picker {
    padding: 10px;
}
</style>
