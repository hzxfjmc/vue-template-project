<template lang="pug">
    .full-height.flex-fixed.funds-container
        .scroll-able.flex-fixed-container
            .field-box
                .flex-box.field-item
                    .label {{$t('funds.labelAccount')}}
                    .ctn {{bankName}} {{$t('funds.labelLastNum')}} {{bankAccount && bankAccount.slice(-4)}}
                .flex-box.field-item
                    .label {{$t('funds.labelName')}}
                    .ctn {{userName}}
            .gap
            .content-box
                .flex-box.item
                    .label {{$t('funds.labelCurrency')}}
                    .ctn.flex-box
                        .currency(@click="switchMoneyType(2)" :class="{active:moneyType === 2,disabled: pageType==='offline' && accountType === 2}")
                            span.icon.icon-HK {{$t('funds.currencyHk')}}
                        .currency(@click="switchMoneyType(1)" :class="{active:moneyType === 1,disabled: pageType==='offline' && accountType === 1}")
                            span.icon.icon-USA {{$t('funds.currencyUs')}}

                .flex-box.item
                    .label {{$t('funds.labelMaxDesirable')}}
                    .ctn {{withdrawBalanceStr}}{{moneyUnit}}
            .form-box.flex-box.center(:class="{'bd-error':errorFlag}")
                .label {{$t('funds.labelMoney')}}
                .ctn.flex-box
                    van-field(
                    v-model="applyAmount"
                    :placeholder="placeholder"
                    @input="checkInput"
                    @blur="checkInputNum"
                    @focus="decodeInputNum"
                    )
                        span(slot="icon" @click="cleanInput" v-if="applyAmount")
                            img(src="/webapp/open-account/open-account/deposit/icon_closed.png" class="icon-cls")
                        span.btn-extra(slot="button" @click="extraAll") {{$t('funds.btnText1')}}
            .error-tips(v-show="errorFlag")
                span.iconfont.icon-warning
                span {{$t('funds.tips1')}}
            .field-box
                .flex-box.field-item
                    .label {{$t('funds.labelFee')}}
                    .ctn {{$t('funds.tips2')}}
                .flex-box.field-item
                    .label {{$t('funds.labelTime')}}
                    .ctn {{$t('funds.tips3')}}
        van-button(
        size="large"
        type="primary"
        class="bottom-button"
        :disabled="!submitFlag"
        @click="preSubmit"
        ) {{$t('funds.btnText2')}}
        van-dialog(
        v-model="show"
        show-confirm-button
        :confirm-button-text="confirmBtnText"
        )
            .confirm-text-box
                p.content {{alertTips}}
                p.service {{$t('funds.tips4')}}
</template>

<script>
/**
 * 出金流程-提取资金
 * @ Author LINJAIJUN
 * @ Date 2019/04/10
 */
import { mapGetters } from 'vuex'
import { Toast, Dialog } from 'vant'
import jsBridge from '@/utils/js-bridge.js'
import {
    withdrawApply,
    queryHSFundAccountInfo
} from '@/service/stock-capital-server.js'
export default {
    components: {
        [Toast.name]: Toast,
        [Dialog.name]: Dialog
    },
    data() {
        return {
            show: false,
            alertTips: '',
            RequestId: '',
            userName: '',
            bankName: '',
            bankCode: '',
            bankAccount: '',
            accountType: '', // 出金银行账户类型1-港币账户，2-美元账户，9-综合账户（全部币种）
            selectAccountType: '',
            accountTypeName: '', // 出金银行账户类型1-港币账户，2-美元账户，9-综合账户（全部币种）
            moneyType: '', // 币种类型0-人民币，1-美元，2-港币
            moneyUnit: '',
            applyAmount: '',
            withdrawBalance: '',
            withdrawBalanceStr: '',
            placeholder: '',
            submitFlag: false,
            errorFlag: false,
            clicked: false
        }
    },
    watch: {
        applyAmount(val) {
            if (String(val).includes(',')) {
                val = this.decodeThousands(val)
            }
            if (val.length > 17) {
                this.applyAmount = val.slice(0, 17)
            }
            if (Number(val)) {
                this.submitFlag = true
                this.errorFlag = Number(val) > this.withdrawBalance
                this.submitFlag = !this.errorFlag
            } else {
                this.submitFlag = false
                this.errorFlag = false
            }
        }
    },
    computed: {
        confirmBtnText() {
            return this.$t('funds.btnText3')
        },
        ...mapGetters([`user`])
    },
    methods: {
        checkInput() {
            let regs = [
                ['^0(\\d+)$', '$1'], //禁止录入整数部分两位以上，但首位为0
                ['[^\\d\\.]+$', ''], //禁止录入任何非数字和点
                ['\\.(\\d?)\\.+', '.$1'] //禁止录入两个以上的点
            ]
            for (let i = 0; i < regs.length; i++) {
                let reg = new RegExp(regs[i][0])
                if (this.applyAmount.includes(',')) {
                    this.applyAmount = this.decodeThousands(this.applyAmount)
                }
                this.applyAmount = this.applyAmount.replace(reg, regs[i][1])
            }
        },
        decodeInputNum() {
            if (this.applyAmount) {
                this.applyAmount = this.decodeThousands(this.applyAmount)
            }
        },
        checkInputNum() {
            this.applyAmount = Number(this.applyAmount)
                ? Number(this.applyAmount).toFixed(2)
                : ''
            this.applyAmount = this.parseThousands(this.applyAmount)
        },
        cleanInput() {
            this.applyAmount = ''
        },
        parseThousands(priceVal) {
            if (priceVal) {
                priceVal = priceVal + ''
                if (priceVal.indexOf('.') > -1) {
                    let numberInt = priceVal.substr(0, priceVal.indexOf('.'))
                    numberInt = numberInt.replace(
                        /(\d{1,3})(?=(\d{3})+(?:$|\.))/g,
                        '$1,'
                    )
                    numberInt =
                        numberInt + priceVal.substr(priceVal.indexOf('.'))
                    return numberInt
                } else {
                    return priceVal.replace(
                        /(\d{1,3})(?=(\d{3})+(?:$|\.))/g,
                        '$1,'
                    )
                }
            } else if (priceVal === '0') {
                return '0'
            } else {
                return ''
            }
        },
        decodeThousands(priceVal) {
            return Number(((priceVal || '') + '').replace(/,/g, ''))
        },
        async getUserName() {
            try {
                let data = await this.$accountService.getCustOpenAccountInfo()
                this.userName = data.lastName
                    ? `${data.realName} ${data.lastName} ${data.firstName}`
                    : `${data.realName || ''} ${data.realNameEn || ''}`
            } catch (e) {
                this.$toast(e.msg || this.$t('netErrorTips'))
            }
        },
        checkAccountType(accountType) {
            accountType = Number(accountType)
            switch (accountType) {
                case 1:
                case 3:
                case 9:
                    this.switchMoneyTypeData(2)
                    break
                case 2:
                    this.switchMoneyTypeData(1)
                    break
            }
        },
        switchMoneyType(val) {
            if (this.pageType === 'online' || this.accountType === 9) {
                this.moneyType = val
                this.switchMoneyTypeData(val)
            }
        },
        switchMoneyTypeData(moneyType) {
            switch (moneyType) {
                case 2:
                    this.moneyType = 2
                    this.selectAccountType =
                        this.accountType === 9 ? this.accountType : 1
                    this.moneyUnit = this.$t('funds.currencyHk')
                    this.placeholder = this.$t('funds.placeHolderHk')
                    this.applyAmount = ''
                    this.queryHSFundAccountInfo()
                    break
                case 1:
                    this.moneyType = 1
                    this.selectAccountType =
                        this.accountType === 9 ? this.accountType : 2
                    this.moneyUnit = this.$t('funds.currencyUs')
                    this.applyAmount = ''
                    this.placeholder = this.$t('funds.placeHolderUs')
                    this.queryHSFundAccountInfo()
                    break
            }
        },
        extraAll() {
            this.applyAmount =
                Number(this.withdrawBalance) > 0
                    ? this.parseThousands(this.withdrawBalance)
                    : ''
        },
        async queryHSFundAccountInfo() {
            try {
                let params = {
                    moneyType: this.moneyType,
                    userId: this.user.userId || this.$constant.userId
                }
                let res = await queryHSFundAccountInfo(params)
                this.withdrawBalanceStr = this.parseThousands(
                    (res.withdrawBalance + '').replace(/(\d+\.\d{2}).+/, '$1')
                )
                this.withdrawBalance = Number(res.withdrawBalance).toFixed(2)
            } catch (e) {
                this.$toast(e.msg || this.$t('netErrorTips'))
            }
        },
        preSubmit() {
            if (!this.submitFlag) return false
            if (
                ![3, 9].includes(Number(this.accountType)) &&
                this.selectAccountType !== Number(this.accountType)
            ) {
                this.$confirm({
                    message: `${this.$t('funds.confirmTips1')}${
                        this.moneyUnit
                    }<br>${this.$t('funds.confirmTips2')}<br>${this.$t(
                        'funds.confirmTips3'
                    )}`,
                    confirmButtonText: this.$t('funds.btnTextConfirm'),
                    cancelButtonText: this.$t('funds.btnTextCancel')
                })
                    .then(async () => {
                        this.submit()
                    })
                    .catch(() => {})
            } else {
                this.submit()
            }
        },
        async submit() {
            let formatApplyAmount = this.applyAmount.includes(',')
                ? this.decodeThousands(this.applyAmount)
                : this.applyAmount

            let params = {
                acceptAccount: this.bankAccount,
                acceptBank: this.bankName,
                acceptBankCode: this.bankCode,
                accountType: this.selectAccountType, // 出金银行账户类型1-港币账户，2-美元账户，9-综合账户（全部币种）
                applyAmount: formatApplyAmount,
                accountingOption: '1', //  1-普通入账
                applyType: '1', // 发起类型1-客户前端申请,2-中台发起
                appType: '1', // 应用端1uSmart 2友信智投(默认)
                moneyType: this.moneyType, // 币种类型0-人民币，1-美元，2-港币
                transferMode: '2', // 出金方式1-大陆银行出金；2-香港银行出金；9-银证转账出金
                userId: this.user.userId || this.$constant.userId,
                withdrawMode: '1' // 出金类型1-电汇 ；2-支票
            }
            try {
                // 验证交易密码
                await jsBridge.callApp('command_trade_login')
                let headers = {
                    RequestId: this.RequestId,
                    'X-Request-Id': this.RequestId
                }
                this.$loading()
                await withdrawApply(params, {
                    headers: headers
                })
                this.$close()
                this.$imgToast({
                    message: this.$t('funds.alertTips1'),
                    cb: () => {
                        jsBridge.gotoNativeModule(
                            'yxzq_goto://fund_history_record'
                        )
                        jsBridge.callApp('command_close_webview') // 跳转历史记录页面后调用关闭，点返回则到入口页面
                    }
                })
            } catch (e) {
                this.$close()
                if (e.code === 408970) {
                    this.alertTips = this.$t('funds.alertTips2')
                    this.show = true
                } else if (e.desc) {
                    if ([300102, 301004, 301005].includes(e.desc.errorCode)) {
                        this.alertTips = this.$t('funds.alertTips3')
                        this.show = true
                    }
                } else {
                    this.$toast(e.msg || this.$t('netErrorTips'))
                }
            }
        }
    },
    created() {
        window.h5HistoryBack = () => {
            history.back()
            return true
        }
        this.getUserName()
        this.RequestId = this.$guid()
        let {
            pageType,
            accountType,
            accountTypeName,
            bankName,
            bankCode,
            bankAccount
        } = this.$route.query
        this.accountType = accountType
        this.accountTypeName = accountTypeName
        this.bankName = bankName
        this.bankCode = bankCode
        this.bankAccount = bankAccount
        this.pageType = pageType
        this.checkAccountType(accountType)
    }
}
</script>
<style lang="scss">
.funds-container {
    .van-field {
        padding-right: 0;
        padding-left: 0;
        .van-field__control {
            font-size: 18px;
        }
        .van-field__icon {
            color: #285ac8;
        }
    }
}
.confirm-text-box {
    padding: 20px;
    text-align: center;
    font-size: 14px;
    font-weight: normal;
    .content {
        font-size: 20px;
    }
    .service {
        margin-top: 10px;
        opacity: 0.5;
    }
}
</style>
<style scoped lang="scss">
.disabled {
    opacity: 0.5;
}
.flex-box {
    display: flex;
    justify-content: flex-start;
    justify-items: center;
}
.gap {
    height: 10px;
    background-color: $background-bottom-color;
}

.field-box {
    padding: 14px;
    .field-item {
        line-height: 20px;
        padding: 5px 0;
    }
    .label {
        flex: 1;
        color: rgba(53, 53, 71, 0.5);
    }
    .ctn {
        flex: 4;
    }
}
.content-box {
    padding: 14px 14px 0;
    .item {
        padding: 10px 0;
        line-height: 40px;
    }
    .label {
        flex: 1;
        justify-items: center;
        color: rgba(53, 53, 71, 0.5);
    }
    .ctn {
        flex: 4;
    }
}
.icon {
    padding-left: 25px;
}
.icon-cls {
    width: 19px;
    height: 19px;
    margin: 5px 5px 0 0;
}
.icon-HK {
    background: url('/webapp/open-account/open-account/deposit/flag_HK.png')
        no-repeat center left;
    background-size: 21px 13px;
}
.icon-USA {
    background: url('/webapp/open-account/open-account/deposit/flag_USA.png')
        no-repeat center left;
    background-size: 21px 13px;
}
.currency {
    width: 92px;
    height: 40px;
    line-height: 40px;
    margin-right: 21px;
    border-radius: 2px;
    text-align: center;
    border: 1px solid rgba(225, 225, 225, 0.5);
    img {
        margin: 14px 5px 0 0;
        width: 21px;
        height: 12px;
    }
}
.currency.active {
    background: rgba(60, 120, 250, 0.05);
    border: 1px solid rgba(60, 120, 250, 1);
}
.form-box {
    margin: 0 14px;
    border-bottom: 1px solid rgba(225, 225, 225, 0.5);
    align-items: center;
    .label {
        flex: 1;
        font-size: 18px;
        line-height: 27px;
    }
    .ctn {
        flex: 4;
    }
    .input-box {
        width: 76%;
        input {
            width: 100%;
            font-size: 18px;
            line-height: 27px;
            border: none;
        }
        img {
            margin: 3px 0 0 3px;
        }
    }
    .btn-extra {
        color: $hk-primary-color;
    }
}
.bd-error {
    border-bottom: 1px solid #fa6112;
}
.error-tips {
    padding: 3px 14px 14px;
    color: #fa6112;
}
</style>
