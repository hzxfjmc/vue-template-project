<template lang="pug">
    yx-container-better.submit-record.hk-open-account
        .submit-record-main(slot="main")
            .submit-record-main-title.container-title {{title}}
            yx-hk-field.base-input(
                ref="bankNameInput"
                v-model="form.custBankName"
                :placeholder="$t('bankNameInfo')"
                :readonly="bankReadOnly"
                :arrow="form.custBankCode === 'OTHER'"
                @click.native="showBankPopupHandler"
                )
            yx-hk-field.base-input(
                v-if="bankAccReadOnly"
                v-model="form.custBankAcctView"
                :placeholder="$t('bankCodeInfo')"
                :readonly="bankAccReadOnly"
                )
            yx-hk-field.base-input(
                v-if="!bankAccReadOnly"
                v-model="form.custBankAcct"
                :placeholder="$t('bankCodeInfo')"
                @input="checkBankAcctInput"
            )
            yx-hk-field.base-input(
                :value="moneyTypeName"
                :placeholder="$t('depositCurrency')"
                @click.native="showPopupHandler"
                readonly
                :arrow="!isLog && supportAccountType === 9"
                )
            yx-hk-field.base-input(
                v-model="form.applyAmount"
                :placeholder="$t('depositAmount')"
                :readonly="readonly"
                @input="checkInput"
                )
            .img-list
                UploadFile.img-item(
                    v-if="!isLog"
                    :value="exampleImg"
                    :example="true"
                    :exampleCls="$t('exampleCls')"
                )
                yx-upload-img.img-item(
                    v-for="item, index in form.voucherUrls"
                    :key="index"
                )
                    UploadFile(
                        :value="item"
                        :index="index"
                        :isLog="isLog"
                        @delete-img="deleteImgHandler"
                    )
                yx-upload-img.img-item(
                        v-if="!isLog && form.voucherUrls && form.voucherUrls.length === 0"
                        @add-image="addImageHandler"
                    )
                    UploadFile(value="" :isLog="isLog")
            yx-upload-img.img-item(
                v-if="!isLog && form.voucherUrls && form.voucherUrls.length > 0 && form.voucherUrls.length < 5"
                @add-image="addImageHandler"
            )
                p.add-more(
                    v-if="!isLog && form.voucherUrls && form.voucherUrls.length > 0 && form.voucherUrls.length < 5"
                )
                    | +{{$t('continueAddPro')}}
            .img
                .tip {{$t('onlineRecord')}}
        van-button(
            v-if="!isLog"
            size="large"
            slot="bottom"
            type="primary"
            :disabled="disabled"
            @click="preSubmitHandler"
            class="bottom-button" ) {{$t('submitInfo')}}
        yx-popup(
            v-model="showPopup"
            slot="bottom"
            position ="bottom")
            van-picker(
                ref="picker"
                class="picker"
                :confirm-button-text="$t('sureInfo')"
                :cancel-button-text = "$t('cancelInfo')"
                :columns="moneyTypeList"
                @confirm="confirmTypeInfo"
                @cancel="cancelHandler"
                show-toolbar)
        yx-popup(
            v-model="showBankPopup"
            slot="bottom"
            position ="bottom")
            van-picker(
                class="picker"
                :confirm-button-text="$t('sureInfo')"
                :cancel-button-text = "$t('cancelInfo')"
                show-toolbar
                :columns="bankList"
                @cancel="onCancelBank"
                @confirm="onConfirmBank"
            )
        recharge(v-if="showRecharge" @closeDialogHandle="closeDialogHandle" @notFirstCallback="notFirstCallback"  slot="bottom")
</template>

<script>
import {
    echargeOpenacctLastinfo,
    echargeOpenacctApply,
    rechargeHkApply,
    queryBankAll
} from '@/service/stock-capital-server.js'
import { updateCustIdentifyStatus } from '@/service/user-account-server-hk'
import { getLotteryStatus } from '@/service/customer-relationship-server.js'
import depositService from '@/service/depositService'
import { Icon, Popup, Picker } from 'vant'
import UploadFile from './upload-file.vue'
import LS from '@/utils/local-storage.js'
import recharge from '@/biz-components/recharge'
export default {
    i18n: {
        zhCHS: {
            bankNameInfo: '银行名称',
            bankCodeInfo: '银行账号',
            depositCurrency: '存入货币',
            depositAmount: '存入金额',
            continueAddPro: '继续添加凭证',
            onlineRecord:
                '网上银行截图、ATM记录等等(请包含您的银行账户号码、收款人账号，支持5张以内照片)',
            submitInfo: '提交',
            sureInfo: '确认',
            cancelInfo: '取消',
            hkd: '港币',
            usd: '美元',
            depositRecord: '转账提交记录',
            submitDepositPro: '提交转账凭证',
            forbidden: '禁止',
            sorryTip: '抱歉，现在暂停处理入金业务，您的入金申请可能延迟处理',
            connectCustom: '如有问题，请联系客服',
            okToKnow: '我知道了',
            allowInfo: '允许',
            qurentFormat: '请输入正确格式',
            enterBankAccount: '请输入银行账号',
            applicationSub: '申请提交成功',
            uploadText: '点击上传',
            netErrorTips: '网络开小差了，请稍后重试',
            exampleCls: 'example-s'
        },
        zhCHT: {
            bankNameInfo: '銀行名稱',
            bankCodeInfo: '銀行賬號',
            depositCurrency: '存入貨幣',
            depositAmount: '存入金額',
            continueAddPro: '繼續添加憑證',
            onlineRecord:
                '網上銀行截圖、ATM記錄等等(請包含您的銀行賬戶號碼、收款人賬號，支持5張以內照片)',
            submitInfo: '提交',
            sureInfo: '確認',
            cancelInfo: '取消',
            hkd: '港幣',
            usd: '美元',
            depositRecord: '轉賬提交紀錄',
            submitDepositPro: '提交轉賬憑證',
            forbidden: '禁止',
            sorryTip: '抱歉，現在暫停處理入金業務，您的入金申請可能延遲處理',
            connectCustom: '如有問題，請聯繫客服',
            okToKnow: '我知道了',
            allowInfo: '允许',
            qurentFormat: '請輸入正確格式',
            enterBankAccount: '請輸入銀行賬號',
            applicationSub: '申請提交成功',
            uploadText: '點擊上傳',
            netErrorTips: '網絡開小差了，請稍後重試',
            exampleCls: 'example-hk'
        },
        en: {
            bankNameInfo: 'Bank Name',
            bankCodeInfo: 'Bank Account',
            depositCurrency: 'Deposit Currency',
            depositAmount: 'Deposit Amount',
            continueAddPro: 'Add',
            onlineRecord:
                'ATM receipt, Online Banking Screen, etc.  Example >(Include your bank account and receiver account, Max. 5 pics)',
            submitInfo: 'Submit',
            sureInfo: 'Confirm',
            cancelInfo: 'Cancel',
            hkd: 'HKD',
            usd: 'USD',
            depositRecord: 'Deposit Records',
            submitDepositPro: 'Submit Deposit Proof',
            forbidden: 'Prohibit',
            sorryTip: 'Sorry, Deposit Service Ssuspended.',
            connectCustom: 'Please contact CS if you have any question',
            okToKnow: 'OK',
            allowInfo: 'Allow ',
            qurentFormat: 'Please enter the correct format',
            enterBankAccount: 'Please Enter Bank Account',
            applicationSub: 'Application Submitted',
            uploadText: 'Click and Upload',
            netErrorTips: 'The network is off. Please try again later',
            exampleCls: 'example-us'
        }
    },
    components: {
        UploadFile,
        [Icon.name]: Icon,
        [Popup.name]: Popup,
        [Picker.name]: Picker,
        recharge
    },
    data() {
        return {
            showRecharge: false,
            img: '',
            exampleImg:
                '/webapp/open-account/open-account/deposit/deposit-certificate-1.png',
            showPopup: false,
            showBankPopup: false,
            showAdd: true,
            bankReadOnly: false,
            bankAccReadOnly: false,
            submitClicked: false,
            isRecharge: false, // 是否首次入金 false-首次入金 true-已入金非首次
            supportAccountType: '', //支持的账户类型1-港币账户，2-美元账户 9-综合账户
            accountNoHk: '',
            accountNoUs: '',
            applyType: '',
            collectionsInfoList: [], // 上一页对应公司收款银行账号信息
            bankList: [],
            bankListSource: [],
            formValidateKeys: ['applyAmount', 'custBankAcct', 'moneyType'],
            form: {
                applyAmount: '', // 申请金额 手动录入
                bankAcct: '', // 友信银行账户 上一步带入，随机一条记录即可
                custBankAcct: '', // 客户汇出银行账户 手动录入
                custBankAcctView: '', // 展示用
                custBankAcctType: '', // 客户汇出银行账户类型	1-港币账户，2-美元账户 根据币种判断
                custBankName: '', // 客户汇出银行名称 上一步带入
                custBankCode: 'OTHER',
                custBankRtgs: '', // 无
                custBankSwift: '', // 无
                moneyType: '', // 币种类型(0-人民币，1-美元，2-港币)
                remark: '',
                transferMode: 1, // 转账类型 入金方式1-香港银行；2-大陆银行；3-子账户 ；9-银证转账 默认香港银行
                voucherUrls: [] // 银行凭证地址
            }
        }
    },
    created() {
        let {
            applyType,
            custBankName,
            custBankCode,
            custBankAcct
        } = this.$route.query
        this.applyType = applyType
        this.form.custBankName = custBankCode === 'OTHER' ? '' : custBankName
        this.form.custBankCode = custBankCode
        this.form.custBankAcctView = custBankAcct
            ? `${custBankAcct.slice(0, 3)}****${custBankAcct.slice(-4)}`
            : ''
        this.form.custBankAcct = custBankAcct || ''
        this.bankReadOnly = !!custBankName || this.isLog
        this.bankAccReadOnly = !!custBankAcct || this.isLog
        this.checkMoneyType()
        this.checkCertificateImg(custBankCode)
        this.getLotteryStatus()
        !this.form.custBankName && this.queryBankAll()
        this.isLog && this.echargeOpenacctLastinfo()
        this.$close()
    },
    watch: {
        'form.custBankAcct'(val) {
            if (val.length > 30) {
                this.form.custBankAcct = val.slice(0, 30)
            }
        },
        'form.custBankName'(val) {
            if (val.length > 50) {
                this.form.custBankName = val.slice(0, 50)
            }
        }
    },
    computed: {
        moneyTypeList() {
            return [this.$t('hkd'), this.$t('usd')]
        },
        readonly() {
            return this.isLog
        },
        isLog() {
            return !!this.$route.params.log
        },
        title() {
            return this.isLog
                ? this.$t('depositRecord')
                : this.$t('submitDepositPro')
        },
        moneyTypeName() {
            if (this.form.moneyType) {
                return this.form.moneyType === 1
                    ? this.$t('usd')
                    : this.$t('hkd')
            } else {
                return ''
            }
        },
        disabled() {
            return (
                this.formValidateKeys.some(key => !this.form[key]) ||
                this.form.voucherUrls.length === 0 ||
                !this.$reg.numberic(this.form.custBankAcct)
            )
        }
    },
    methods: {
        notFirstCallback() {
            this.goNext()
        },
        closeDialogHandle() {
            this.goNext()
        },
        async getLotteryStatus() {
            try {
                let res = await getLotteryStatus()
                this.isRecharge = res.recharge || ''
            } catch (e) {
                this.isRecharge = true
            }
        },
        checkCertificateImg(bankCode) {
            if (['BKCH', 'BKCHHKHH'].includes(bankCode)) {
                this.exampleImg =
                    '/webapp/open-account/open-account/deposit/deposit-certificate-2.png'
            }
        },
        // 检查公司银行账户类型确定币种支持类型
        checkMoneyType() {
            this.collectionsInfoList = LS.get('collectionsInfoList')
            this.collectionsInfoList.some(item => {
                if (item.accountNoHk && item.accountNoUs) {
                    this.supportAccountType = 9
                    this.accountNoHk = item.accountNoHk
                    this.accountNoUs = item.accountNoUs
                    return true
                }
                if (item.accountNoHk && !item.accountNoUs) {
                    this.accountNoHk = item.accountNoHk
                    this.supportAccountType = this.accountNoUs ? 9 : 1
                }
                if (!item.accountNoHk && item.accountNoUs) {
                    this.accountNoUs = item.accountNoUs
                    this.supportAccountType = this.accountNoHk ? 9 : 2
                }
            })
            switch (this.supportAccountType) {
                case 1:
                    this.form.moneyType = 2
                    this.form.bankAcct = this.accountNoHk
                    break
                case 2:
                    this.form.moneyType = 1
                    this.form.bankAcct = this.accountNoUs
                    break
            }
            this.setBankAccountType(this.form.moneyType)
        },
        async getAppSystem(cb) {
            try {
                let params = {
                    serviceIdList: ['RJKG']
                }
                this.$loading()
                let data = await depositService.getAppSystem(params)
                if (data.list && data.list.length) {
                    if (
                        data.list[0].content === this.$t('forbidden') ||
                        data.list[0].content === '禁止'
                    ) {
                        this.$alert({
                            className: 'alert-box',
                            title: this.$t('sorryTip'),
                            message: this.$t('connectCustom'),
                            confirmButtonText: this.$t('okToKnow')
                        }).then(() => {
                            cb && cb(true)
                        })
                    } else if (
                        data.list[0].content === this.$t('allowInfo') ||
                        data.list[0].content === '允许'
                    ) {
                        cb()
                    }
                } else {
                    cb && cb()
                }
            } catch (e) {
                this.submitClicked = false
                this.$close()
                this.$toast(e.msg || this.$t('netErrorTips'))
            }
        },
        checkInput(val) {
            let regs = [
                ['^0(\\d+)$', '$1'], //禁止录入整数部分两位以上，但首位为0
                ['[^\\d\\.]+$', ''], //禁止录入任何非数字和点
                ['\\.(\\d?)\\.+', '.$1'], //禁止录入两个以上的点
                ['^(\\d+\\.\\d{2}).+', '$1'] //禁止录入小数点后两位以上
            ]
            for (let i = 0; i < regs.length; i++) {
                let reg = new RegExp(regs[i][0])
                this.form.applyAmount = this.form.applyAmount.replace(
                    reg,
                    regs[i][1]
                )
            }
            if (val.includes('.')) {
                let fNum = val.split('.')[0]
                let lNum = val.split('.')[1]
                if (fNum.length > 17) {
                    this.form.applyAmount = fNum.slice(0, 17) + '.' + lNum
                }
            } else {
                if (val.length > 20) {
                    this.form.applyAmount = val.slice(0, 20)
                }
            }
        },
        checkBankAcctInput(val) {
            if (val) {
                this.$reg.numberic(val, true, this.$t('qurentFormat'))
            } else {
                this.$reg.numberic(val, true, this.$t('enterBankAccount'))
            }
        },
        async showBankPopupHandler() {
            this.showBankPopup = this.$route.query.custBankCode === 'OTHER'
        },
        onCancelBank() {
            this.showBankPopup = false
        },
        onConfirmBank(val, index) {
            this.showBankPopup = false
            let item = this.bankListSource[index]
            this.form.custBankName = item.bankName
            this.form.custBankCode = item.bankCode
        },
        showPopupHandler() {
            this.showPopup =
                this.isLog || this.supportAccountType !== 9 ? false : true
        },
        confirmTypeInfo(val) {
            let moneyType = val === this.$t('hkd') ? 2 : 1
            this.showPopup = false
            this.form.moneyType = moneyType
            this.setBankAccountType(moneyType)
        },
        async queryBankAll() {
            try {
                this.$loading()
                let data = await queryBankAll()
                this.bankListSource = data
                this.bankList = data.map(item => {
                    return item.bankName
                })
                this.$close()
            } catch (e) {
                this.$close()
                this.$toast(e.msg || this.$t('netErrorTips'))
            }
        },
        setBankAccountType(moneyType) {
            // moneyType 币种类型(0-人民币，1-美元，2-港币)
            // custBankAcctType 客户汇出银行账户类型	1-港币账户，2-美元账户
            switch (moneyType) {
                case 1:
                    this.form.custBankAcctType = 2
                    this.form.bankAcct = this.accountNoUs
                    break
                case 2:
                    this.form.custBankAcctType = 1
                    this.form.bankAcct = this.accountNoHk
                    break
            }
        },
        cancelHandler() {
            this.showPopup = false
        },
        deleteImgHandler(index) {
            this.form.voucherUrls.splice(index, 1)
        },
        async echargeOpenacctLastinfo() {
            try {
                this.$loading()
                this.form = await echargeOpenacctLastinfo()
                this.form.custBankAcctView = this.form.custBankAcct
                this.form.voucherUrls = this.form.atts.map(item => {
                    return item.attachmentLink
                })
                this.$close()
            } catch (e) {
                this.$close()
                this.$toast(e.msg || this.$t('netErrorTips'))
            }
        },
        addImageHandler(url) {
            this.showAdd = false
            this.form.voucherUrls.push(url)
        },
        async preSubmitHandler() {
            if (this.submitClicked) return false
            this.submitClicked = true
            this.getAppSystem(this.submitHandler)
        },
        goNext() {
            if (this.applyType === 'normal') {
                // 跳转历史记录页面后调用关闭，点返回则到入口页面
                this.$jsBridge.gotoNativeModule(
                    'yxzq_goto://fund_history_record'
                )
                this.$jsBridge.callApp('command_close_webview')
            } else {
                this.$jsBridge.callApp('command_close_webview')
            }
        },
        async submitHandler(flag) {
            try {
                if (this.applyType === 'normal') {
                    await rechargeHkApply(this.form)
                } else {
                    await echargeOpenacctApply(this.form)
                    let params = { customerIdentifyStatus: 2 }
                    await updateCustIdentifyStatus(params)
                }
                this.$close()
                if (!flag) {
                    // 正常流程
                    this.$imgToast({
                        message: this.$t('applicationSub'),
                        cb: () => {
                            if (this.isRecharge) {
                                this.goNext()
                            } else {
                                this.showRecharge = true
                            }
                        }
                    })
                } else {
                    // 冻结
                    this.goNext()
                }
            } catch (e) {
                this.submitClicked = false
                this.$close()
                if (e.code === 450000) {
                    this.$toast(this.$t('netErrorTips'))
                } else {
                    this.$toast(e.msg || this.$t('netErrorTips'))
                }
            }
        }
    }
}
</script>
<style lang="scss">
.alert-box.van-dialog {
    border-radius: 14px !important;
    .van-dialog__header {
        font-size: 20px;
        font-weight: 400;
        padding-right: 20px;
        padding-left: 20px;
    }
    .van-dialog__message {
        font-size: 16px;
        line-height: 22px;
    }
}
</style>
<style lang="scss" scoped>
.submit-record {
    .submit-record-main {
        padding: $global-padding;
        .img-list {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            flex-wrap: wrap;
            padding: 10px 0 24px;
            .img-item {
                width: 48%;
                padding-top: $global-padding;
            }
        }
        .add-more {
            text-align: center;
            color: $hk-primary-color;
            padding-bottom: 10px;
        }
        .base-input {
            width: 100%;
        }
        .img {
            img {
                width: 100%;
                height: 93px;
                margin: 24px 0 10px;
            }
            .tip {
                color: $text-color3;
            }
        }
    }
    .picker {
        padding: 10px;
    }
}
</style>
