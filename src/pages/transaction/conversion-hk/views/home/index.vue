<template lang="pug">
#conversion-home-container.full-height.flex-fixed
    van-popup(position="bottom" v-model="showPopup")
        van-picker(
            ref="picker"
            :columns="columns[type]" 
            @confirm="confirmTypeInfo"
            @cancel="cancelHandler"
            :confirm-button-text="$t('confirm')"
            :cancel-button-text=`$t('cancel')`
            show-toolbar)
    .scroll-able.flex-fixed-container 
        .margin-bar
        .home-container
            .ic-title {{$t('transferFrom')}}
            van-field.bp-field(
                type='text'
                @click.native="selectTypeInfo('exchangeType')"
                disabled="true"
                v-model='exchangeType'
                :label=`$t('marketInfo')`)
                .button.text-color2(slot="button")
                    span.iconfont.icon-pulldown_icon.text-color2
            van-field.bp-field(
                type='text'
                @click.native="selectTypeInfo('brokerName')"
                disabled
                maxlength=255
                :placeholder="$t('pleaseSelect')"
                v-model="brokerName"
                :label="$t('brokerNameInfo')")
                .button.text-color2(slot="button")
                    span.iconfont.icon-pulldown_icon.text-color2
            van-field.bp-field(
                type='text'
                v-if="showOtherBroker"
                clearable
                maxlength=15
                :placeholder="$t('enterBroName')"
                v-model="form.brokerName"
                :label="$t('broNameInfo')")
            van-field.bp-field(
                :placeholder="$t('accountOut')"
                type='text'
                maxlength=25
                clearable
                v-model='form.transferAccount'
                :label="$t('accountNumber')")
            van-field.bp-field(
                :placeholder="$t('enterAccountName')"
                disabled
                maxlength=255
                :value="curName || ''"
                :label="$t('accountName')")
            template(v-if="showOtherBroker")
                van-field.bp-field(
                    :placeholder="placeholderText"
                    type='tel'
                    v-model="form.settlementCode"
                    clearable
                    maxlength=25
                    :label="labelText")
                van-field.bp-field(
                    :placeholder="$t('contacnPeoOut')"
                    type='text'
                    v-model="form.contact"
                    maxlength=50
                    clearable
                    :label="$t('contackPerson')")
                van-field.bp-field(
                    :placeholder="$t('contactPeOutPho')"
                    type='tel'
                    clearable
                    maxlength=11
                    v-model="form.telephone"
                    :label="$t('contackPhone')")
            .p-tips.text-color5 
                p.a-tips
                    span.iconfont.icon-warning.text-color2
                    span {{$t('sameName')}}
            .ic-title.relation {{$t('selfMsg')}}
            van-field.bp-field(
                disabled
                :value="$t('youxin')"
                :label="$t('transferPep')"
                )
            //- van-field.bp-field(
            //-     type='text'
            //-     disabled
            //-     :value="userFundAccount"
            //-     :label="$t('accountIn')")
        .margin-bar
        van-cell-group.guide-container(:border="false")
            van-cell(is-link @click="guideClick")
                template(slot="title")
                    span.custom-text.stock-guide {{$t('guideline')}}
            van-cell(is-link @click="toCustomService")
                template(slot="title")
                    span.custom-text.custom-guide {{$t('contactUs')}}
    van-button(
        size="large" 
        :disabled="disabled" 
        type="primary" 
        @click="submitHandler"
        class="bottom-button" ) {{$t('nextInfo')}}
</template>

<script>
import { Icon, Popup, Picker } from 'vant'
import yxStep from '@/components/yx-step'
import { mapGetters } from 'vuex'
import { setTimeout, clearTimeout } from 'timers'
import { lang, usStockTradeClose } from '@/utils/html-utils'
export default {
    i18n: {
        zhCHT: {
            transferFrom: '轉出方信息',
            marketInfo: '所屬市場',
            pleaseSelect: '請選择',
            brokerNameInfo: '轉出券商',
            enterBroName: '输入券商名稱',
            broNameInfo: '券商名稱',
            accountOut: '轉出券商账户號碼',
            accountNumber: '賬戶號碼',
            accountName: '賬戶姓名',
            enterAccountName: '請输入賬戶姓名',
            sameName:
                '賬戶姓名需与友信賬戶同名，暂不支持非同名賬戶轉入股票，轉入股票友信證券不收取任何費用',
            ccassCodeOut: '轉出券商CCASS代碼',
            ccassCode: 'CCASS代碼',
            dtcCodeOut: '轉出券商DTC代碼',
            dtcCode: 'DTC代碼',
            contacnPeoOut: '轉出券商聯繫人',
            contackPerson: '聯繫人',
            contactPeOutPho: '轉出券商聯繫人電話',
            contackPhone: '聯繫人電話',
            transferPep: '接收券商',
            selfMsg: '接收方信息',
            accountIn: '接收賬戶',
            nextInfo: '下一步',
            youxin: '友信證劵有限公司',
            cashAccount: '現金賬戶',
            promiseAccount: '保证金账户',
            notOpenAccount: '暂未开户',
            hkStock: '港股',
            usStock: '美股',
            otherStock: '其他證券',
            stepArr: ['填写信息', '添加股票', '確認信息'],
            confirm: '確認',
            cancel: '取消',
            guideline: '轉入股票流程指引',
            contactUs: '遇到問題聯繫客服'
        },
        zhCHS: {
            transferFrom: '转出方信息',
            marketInfo: '所属市场',
            pleaseSelect: '请选择',
            brokerNameInfo: '转出券商',
            enterBroName: '输入券商名称',
            broNameInfo: '券商名称',
            accountOut: '转出券商账户号码',
            accountNumber: '账户号码',
            accountName: '账户姓名',
            enterAccountName: '请输入账户姓名',
            sameName:
                '账户姓名需与友信账户同名，暂不支持非同名账户转入股票，转入股票友信证券不收取任何费用',
            ccassCodeOut: '输出券商CCASS代码',
            ccassCode: 'CCASS代码',
            dtcCodeOut: '转出券商DTC代码',
            dtcCode: 'DTC代码',
            contacnPeoOut: '转出券商联系人',
            contackPerson: '联系人',
            contactPeOutPho: '转出券商联系人电话',
            contackPhone: '联系人电话',
            transferPep: '接收券商',
            selfMsg: '接收方信息',
            accountIn: '接收账户',
            nextInfo: '下一步',
            youxin: '友信证券有限公司',
            cashAccount: '现金账户',
            promiseAccount: '保证金账户',
            notOpenAccount: '暂未开户',
            hkStock: '港股',
            usStock: '美股',
            otherStock: '其他证券',
            stepArr: ['填写信息', '添加股票', '确认信息'],
            confirm: '确认',
            cancel: '取消',
            guideline: '转入股票流程指引',
            contactUs: '遇到问题联系客服'
        },
        en: {
            transferFrom: 'Transfer From',
            marketInfo: 'Market',
            pleaseSelect: 'Select',
            brokerNameInfo: 'Broker Name',
            enterBroName: 'Please Enter Broker Name',
            broNameInfo: 'Broker',
            accountOut: 'Account No. at Counterparty',
            accountNumber: 'Account No.',
            accountName: 'Account Name',
            enterAccountName: 'Please Enter Account Name',
            sameName:
                'Your account name on both side should match, uSMART do not charge any fee for transferring stocks',
            ccassCodeOut: 'CCASS No. of Counterparty',
            ccassCode: 'CCASS No.',
            dtcCodeOut: 'DTC No. of Counterparty',
            dtcCode: 'DTC No.',
            contacnPeoOut: 'Contact Person of Counterparty',
            contackPerson: 'Contact Person',
            contactPeOutPho: 'Contact Number of Counterparty',
            contackPhone: 'Contact No.',
            transferPep: 'Transfer To',
            selfMsg: 'Receiver information',
            accountIn: 'Account',
            nextInfo: 'Next',
            youxin: 'uSMART Securities Limited',
            cashAccount: 'Cash account',
            promiseAccount: 'Margin Account',
            notOpenAccount: 'Have not opened an account yet',
            hkStock: 'HK Stock',
            usStock: 'US Stock',
            otherStock: 'Others',
            stepArr: ['Broker Information', 'Stock', 'confirmation'],
            confirm: 'Confirm',
            cancel: 'Cancel',
            guideline: 'Transfers Guideline',
            contactUs: 'Contact CS'
        }
    },
    keepalive: true,
    mixins: [require('../../mixins/common-mx.js').default],
    components: {
        [Icon.name]: Icon,
        [Popup.name]: Popup,
        [Picker.name]: Picker,
        yxStep
    },
    created() {
        if (this.$route.query.market !== 'hk') {
            this.form.exchangeType = 5
            this.exchangeType = this.$t('usStock')
        }
        if (usStockTradeClose) {
            this.$set(this.columns, 'exchangeType', [
                { text: this.$t('hkStock'), id: 0 }
            ])
        }
    },
    data() {
        return {
            stepData: this.$t('stepArr'),
            emails: [
                '@qq.com',
                '@126.com',
                '@163.com',
                '@gmail.com',
                '@139.com'
            ],
            showPopup: false,
            columns: {
                exchangeType: [
                    { text: this.$t('hkStock'), id: 0 },
                    { text: this.$t('usStock'), id: 5 }
                ],
                brokerName: []
            },
            emailError: false,
            type: 'jobStatus',
            emailFocus: false,
            brokerName: '',
            transferModeName: '',
            exchangeType: this.$t('hkStock'),
            timer: 0,
            form: {
                brokerId: -1,
                brokerName: '',
                contact: '',
                exchangeType: 0,
                settlementCode: '',
                telephone: '',
                transferAccount: '',
                transferMode: 0,
                transferType: 1
            },
            ifChange: ''
        }
    },
    watch: {
        formExchangeType: {
            handler: 'throttleBrokerInfo',
            immediate: true
        }
    },
    methods: {
        throttleBrokerInfo(val) {
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.appAddBrokerInfo(val)
            }, 300)
        },
        async appAddBrokerInfo(val) {
            this.$set(this.columns, 'brokerName', [])
            this.brokerName = ''
            this.brokerId = -1
            let { list } = await this.$stockTransferService.appAddBrokerInfo({
                exchangeType: val,
                pageSizeZero: true,
                orderDirection: 0
            })
            list.push({ brokerName: this.$t('otherStock'), brokerId: 0 })
            let brokerName = list.map(item => {
                item.text = item.brokerName
                return item
            })
            this.$set(this.columns, 'brokerName', brokerName)
        },
        emailBlurHandler() {
            if (!this.$reg.email(this.form.email)) {
                this.emailError = true
            } else {
                this.emailError = false
            }
            this.emailFocus = false
        },
        emailInputHandler() {
            if (this.form.email && this.form.email.indexOf('@') < 0) {
                this.emailFocus = true
                this.emailError = false
            } else if (!this.form.email) {
                this.emailFocus = false
                this.emailError = false
            }
        },
        selectEmailHandler(item) {
            this.form.email &&
                this.$set(
                    this.form,
                    'email',
                    this.form.email.split('@')[0] + item
                )
            this.emailBlurHandler()
        },
        async submitHandler() {
            if (!this.$reg.mobile(this.form.telephone, true)) {
                return
            }
            //判断是否市场改变
            if (this.form.exchangeType === this.conversionForm.exchangeType) {
                this.ifChange = false
            } else {
                this.ifChange = true
            }
            this.updateForm(this.form)
            try {
                this.$router.push({
                    name: 'add-shares',
                    params: {
                        step: 1,
                        ifChange: this.ifChange
                    }
                })
            } catch (e) {
                e.msg && this.$toast(e.msg)
            }
        },
        selectTypeInfo(type) {
            this.type = type
            this.showPopup = !this.showPopup
            this.$nextTick(() => {
                this.$refs.picker.setColumnIndex(
                    0,
                    this.columns[this.type].indexOf(this[this.type])
                )
            })
        },
        cancelHandler() {
            this.showPopup = false
        },
        confirmTypeInfo(val) {
            this.showPopup = false
            this[this.type] = val.text
            if (this.type === 'exchangeType') {
                this.form[this.type] = val.id
                this.$set(this.form, 'brokerId', -1)
            } else {
                console.log(val)
                this.$set(this.form, 'brokerId', val.brokerId)
                if (val.brokerId !== 0) {
                    this.$set(this.form, 'brokerName', val.brokerName)
                    this.$set(this.form, 'telephone', val.telephone)
                    this.$set(this.form, 'settlementCode', val.settlementCode)
                    this.$set(this.form, 'contact', val.contact)
                    console.log(this.form)
                } else {
                    this.$set(this.form, 'brokerName', '')
                    this.$set(this.form, 'telephone', '')
                    this.$set(this.form, 'settlementCode', '')
                    this.$set(this.form, 'contact', '')
                }
            }
        },
        guideClick() {
            let url = `${location.origin}/webapp/market/generator.html?key=XY0231`
            this.$jsBridge.gotoNewWebview(url)
        },
        toCustomService() {
            this.$jsBridge.gotoCustomerService()
        }
    },
    computed: {
        accountTypeName() {
            return this.user.accountType === 1
                ? this.$t('cashAccount')
                : this.$t('promiseAccount')
        },
        userFundAccount() {
            if (!this.user.fundAccount) {
                return this.$t('notOpenAccount')
            }
            //英文加空格，这里写的不好，按理应该把这两个属性合为一个属性，i18n里直接拼
            if (lang === 'en') {
                return this.formExchangeType === 0
                    ? `${this.$t('hkStock')} ${
                          this.accountTypeName
                      } ${this.user.fundAccount.substr(-4)}`
                    : `${this.$t('usStock')} ${
                          this.accountTypeName
                      } ${this.user.fundAccount.substr(-4)}`
            } else {
                return this.formExchangeType === 0
                    ? `${this.$t('hkStock')}${
                          this.accountTypeName
                      }${this.user.fundAccount.substr(-4)}`
                    : `${this.$t('usStock')}${
                          this.accountTypeName
                      }${this.user.fundAccount.substr(-4)}`
            }
        },
        ...mapGetters([`user`]),
        formExchangeType() {
            return this.form.exchangeType
        },
        showOtherBroker() {
            return this.form.brokerId === 0
        },
        // 按钮是否可用
        disabled() {
            let form = { ...this.form }
            if (this.form.brokerId) {
                delete form.settlementCode
            }
            return Object.values(form).some(
                item => item === '' || item === undefined || !this.brokerName
            ) // 为空 可以为0 不能为undefined
        },
        placeholderText() {
            return this.exchangeType === '美股'
                ? this.$t('dtcCodeOut')
                : this.$t('ccassCodeOut')
        },
        labelText() {
            return this.exchangeType === '美股'
                ? this.$t('dtcCode')
                : this.$t('ccassCode')
        }
    }
}
</script>

<style lang="scss">
#conversion-home-container {
    .margin-bar {
        height: 8px;
        width: 100%;
        background-color: $background-bottom-color;
    }
    .home-container {
        .inputing.van-cell:after,
        .attention-line.van-cell:after {
            content: ' ';
            position: absolute;
            pointer-events: none;
            box-sizing: border-box;
            left: 0;
            right: 0;
            bottom: 0;
            -webkit-transform: scaleY(0.5);
            transform: scaleY(0.5);
            border-bottom: 1px solid rgba(255, 56, 84, 0.9);
        }
        .a-tips {
            display: flex;
            align-items: center;
            height: 32px;
            .text-color2 {
                font-size: 12px;
                margin-right: 5px;
            }
        }
        .inputing.van-cell:after {
            border-bottom: 1px solid $primary-color;
        }
        .van-cell {
            color: $text-color7;
        }
        .van-picker__cancel {
            color: $text-color5;
        }
        .pingyin {
            .flex {
                .van-field__body {
                    padding-right: 15px;
                }
            }
        }
        .address {
            textarea {
                line-height: 24px;
            }
        }
        .van-cell {
            line-height: 29px;
        }
        .van-cell__title {
            max-width: 100%;
            width: 90px;
        }
        .van-cell__title,
        .van-cell__value {
            flex: inherit;
        }
        .van-cell__value {
            flex: 1;
        }
        .van-field__body input {
            color: $text-color;
        }
        .van-cell:after {
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
    }
}
</style>

<style lang="scss" scoped>
$attention-color: rgba(255, 56, 84, 0.9);
#conversion-home-container {
    .home-container {
        padding: $global-padding;
        .p-tips {
            font-size: 12px;
            padding-top: 10px;
            position: relative;
            ul {
                display: flex;
                width: 100%;
                overflow: scroll;
                li span {
                    display: inline-block;
                    color: $primary-color;
                    height: 30px;
                    padding: 0 10px;
                    line-height: 30px;
                    font-size: 12px;
                    text-align: center;
                    margin-left: 14px;
                    border: 1px solid rgba(60, 120, 250, 0.2);
                }
            }
        }
        .van-cell {
            padding: 10px 15px 10px 0;
        }
        .attention {
            display: flex;
            align-items: center;
            font-size: 12px;
            color: $attention-color;
            .icon-attention {
                margin-right: 3px;
            }
        }
        .address,
        .pingyin {
            .van-field {
                padding: 0;
            }
            .van-field:active {
                border-bottom: 0;
            }
            .label {
                span {
                    opacity: 0;
                }
            }
            .van-cell:after {
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
        }
    }
    .guide-container {
        padding: $global-padding $global-padding 0;
        .van-cell {
            padding: 10px 15px 10px 0;
            .stock-guide {
                padding-left: 33px;
                background: url('~@/assets/img/transaction/guide@2x.png')
                    no-repeat center left;
                background-size: contain;
            }
            .custom-guide {
                padding-left: 33px;
                background: url('~@/assets/img/transaction/kefu@2x.png')
                    no-repeat center left;
                background-size: contain;
            }
        }
        .van-cell:not(:last-child)::after {
            left: 0;
        }
    }
    .upload-idcard {
        padding: 14px 0 20px;
    }
    .ic-title {
        font-size: 18px;
        font-weight: 500;
        padding-bottom: 6px;
    }
    .relation {
        margin-top: 30px;
    }
    .p-tips {
        font-size: 12px;
    }
}
</style>
