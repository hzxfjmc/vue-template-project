<template lang="pug">
    .funds-container
        .account-box
            .flex-box.account-item
                .label 收款账户
                .ctn {{bankName}} 尾号 {{bankAccount && bankAccount.slice(-4)}}
            .flex-box.account-item
                .label 账户姓名
                .ctn {{userName}}
        .gap
        .content-box
            .flex-box.item
                .label 选择币种
                .ctn.flex-box
                    .currency(@click="switchMoneyType('2')" v-bind:class="{active:moneyType==='2',disabled:accountType==='2'}")
                        span.icon.icon-HK 港币
                    .currency(@click="switchMoneyType('1')" v-bind:class="{active:moneyType==='1',disabled:accountType==='1'}")
                        span.icon.icon-USA 美元

            .flex-box.item
                .label 最大可取
                .ctn {{withdrawBalanceStr}}{{moneyUnit}}
        .form-box.flex-box.center(:class="{'bd-error':errorFlag}")
            .label 金额
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
                    span(slot="button" @click="extraAll" class="extra-all") 全部提取
        .error-tips(v-show="errorFlag") 超出最大可取金额
        .account-box
            .flex-box.account-item
                .label 手续费
                .ctn 友信智投不收取任何费用
            .flex-box.account-item
                .label 到账时间
                .ctn 预计2～3个工作日（仅供参考，以银行实际处理时间为准）
        .btn-area
            a(href="javascript:;" v-bind:class="{active:submitFlag}" @click="submit") 提交
        van-dialog(
        v-model="show"
        show-confirm-button
        confirm-button-text="我知道了"
        )
            .confirm-text-box
                p {{alertTips}}
                p 如有疑问，请联系客服！
</template>

<script>
/**
 * 出金流程-提取资金
 * @ Author LINJAIJUN
 * @ Date 2019/01/02
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
            bankAccount: '',
            accountType: '', // 出金银行账户类型1-港币账户，2-美元账户，9-综合账户（全部币种）
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
            if (val.includes(',')) {
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
        },
        accountType(val) {
            switch (val + '') {
                case '1':
                case '9':
                    this.switchMoneyTypeData('2')
                    break
                case '2':
                    this.switchMoneyTypeData('1')
                    break
            }
        }
    },
    computed: {
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
                let data = await this.$accountService.getOpenAccountBasicInfo()
                this.userName = `${data.realName || data.realNameEn} ${
                    data.lastName
                } ${data.firstName}`
            } catch (e) {
                this.$toast('网络开小差了,请稍后重试')
            }
        },
        switchMoneyType(val) {
            if (this.accountType === '9') {
                this.moneyType = val
                this.switchMoneyTypeData(val)
            }
        },
        switchMoneyTypeData(val) {
            switch (val + '') {
                case '2':
                    this.moneyType = '2'
                    this.moneyUnit = '港币'
                    this.placeholder = '请输入提取金额（港币）'
                    this.applyAmount = ''
                    this.queryHSFundAccountInfo()
                    break
                case '1':
                    this.moneyType = '1'
                    this.moneyUnit = '美元'
                    this.applyAmount = ''
                    this.placeholder = '请输入提取金额（美元）'
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
                this.$toast(e.msg)
            }
        },
        async submit() {
            if (!this.submitFlag) return false

            let formatApplyAmount = this.applyAmount.includes(',')
                ? this.decodeThousands(this.applyAmount)
                : this.applyAmount

            let params = {
                acceptAccount: this.bankAccount,
                acceptBank: this.bankName,
                accountType: this.accountType, // 出金银行账户类型1-港币账户，2-美元账户，9-综合账户（全部币种）
                applyAmount: formatApplyAmount,
                accountingOption: '1', //  1-普通入账
                applyType: '1', // 发起类型1-客户前端申请,2-中台发起
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
                    message: '申请提交成功',
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
                    this.alertTips = '抱歉，现在暂停处理出金业务'
                    this.show = true
                } else if (e.desc) {
                    if ([300102, 301004, 301005].includes(e.desc.errorCode)) {
                        this.alertTips = '证券账户状态异常，无法完成操作'
                        this.show = true
                    }
                } else {
                    this.$toast(e.msg || '提交失败')
                }
            }
        }
    },
    created() {
        delete window.h5HistoryBack
        this.getUserName()
        this.RequestId = this.$guid()
        this.accountType = this.$route.query.accountType
            ? this.$route.query.accountType + ''
            : ''
        this.accountTypeName = this.$route.query.accountTypeName
            ? this.$route.query.accountTypeName + ''
            : ''
        this.bankName = this.$route.query.bankName
        this.bankAccount = this.$route.query.bankAccount
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
            color: $primary-color-line;
        }
    }
}
.alert-box {
    .van-dialog__message {
        line-height: 2.5;
    }
}
.confirm-text-box {
    padding: 20px;
    text-align: center;
    font-size: 14px;
    font-weight: normal;
    p:last-child {
        margin-top: 10px;
    }
}
</style>
<style scoped lang="scss">
.dn {
    display: none;
}
.disabled {
    opacity: 0.5;
}
.op5 {
    opacity: 0.5;
}
.error {
    display: flex;
    align-items: center;
}
.flex-box {
    display: flex;
    justify-content: flex-start;
    justify-items: center;
}
.align-center {
    align-items: center;
}
.center {
    align-items: center;
}
.gap {
    height: 10px;
    background-color: $background-bottom-color;
}

.account-box {
    padding: 14px;
    .account-item {
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
    .btn {
        a {
            color: $primary-color-line;
        }
        line-height: 27px;
    }
    .extra-all {
        color: $text-link-color;
    }
}
.bd-error {
    border-bottom: 1px solid rgba(255, 56, 84, 1);
}
.error-tips {
    padding: 3px 14px 14px;
    color: rgba(255, 56, 84, 1);
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
