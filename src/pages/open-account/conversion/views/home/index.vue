<template lang="pug">
.conversion-home-container.full-height.flex-fixed
    .margin-bar
    van-popup(position="bottom" v-model="showPopup")
            van-picker(
                ref="picker"
                :columns="columns[type]" 
                @confirm="confirmTypeInfo"
                @cancel="cancelHandler" 
                show-toolbar)
    .home-container.scroll-able.flex-fixed-container 
        .ic-title 转出方信息
        van-field.bp-field(
            type='text'
            @click.native="selectTypeInfo('exchangeType')"
            disabled="true"
            v-model='exchangeType'
            label='所属市场')
            .button.text-color2(slot="button")
                van-icon(name="arrow-down" size="20px")
        van-field.bp-field(
            type='text'
            @click.native="selectTypeInfo('brokerName')"
            disabled
            maxlength=255
            placeholder="请选择"
            v-model="brokerName"
            label='转出券商')
            .button.text-color2(slot="button")
                van-icon(name="arrow-down" size="20px")
        van-field.bp-field(
            type='text'
            v-if="showOtherBroker"
            clearable
            maxlength=15
            placeholder="输入券商名称"
            v-model="form.brokerName"
            label='券商名称')
        van-field.bp-field(
            placeholder="转出券商账户号码"
            type='text'
            maxlength=25
            clearable
            v-model='form.transferAccount'
            label='账户号码')
        van-field.bp-field(
            placeholder="请输入账户姓名"
            disabled
            maxlength=255
            :value="curName || ''"
            label='账户姓名')
        template(v-if="showOtherBroker")
            van-field.bp-field(
                :placeholder="placeholderText"
                type='tel'
                v-model="form.settlementCode"
                clearable
                maxlength=25
                :label="labelText")
            van-field.bp-field(
                placeholder="转出券商联系人"
                type='text'
                v-model="form.contact"
                maxlength=50
                clearable
                label='联系人')
            van-field.bp-field(
                placeholder="转出券商联系人电话"
                type='tel'
                clearable
                maxlength=11
                v-model="form.telephone"
                label='联系人电话')
        .p-tips.text-color5 
            p.a-tips
                span.iconfont.icon-warning.text-color2
                span 账户姓名需与友信账户同名，暂不支持非同名账户转入股票，转入股票友信证券不收取任何费用
        .ic-title.relation 接收方信息
        van-field.bp-field(
            disabled
            value="友信证券有限公司"
            label="接收券商"
            )
        //- van-field.bp-field(
        //-     type='text'
        //-     disabled
        //-     :value="userFundAccount"
        //-     label='接收账户')
        .margin-bar
            van-cell-group.guide-container(:border="false")
                van-cell(is-link @click="guideClick")
                    template(slot="title")
                        span.custom-text.stock-guide 转入股票流程指引
                van-cell(is-link @click="toCustomService")
                    template(slot="title")
                        span.custom-text.custom-guide 遇到问题联系客服
    van-button(
        size="large" 
        :disabled="disabled" 
        type="primary" 
        @click="submitHandler"
        class="bottom-button" ) 下一步
</template>

<script>
import { Icon, Popup, Picker } from 'vant'
import yxStep from '@/components/yx-step'
import { mapGetters } from 'vuex'
import { usStockTradeClose } from '@/utils/html-utils.js'
export default {
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
            this.exchangeType = '美股'
        }
        if (usStockTradeClose) {
            this.$set(this.columns, 'exchangeType', [{ text: '港股', id: 0 }])
        }
    },
    data() {
        return {
            stepData: ['填写信息', '添加股票', '确认信息'],
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
                    { text: '港股', id: 0 },
                    { text: '美股', id: 5 }
                ],
                brokerName: []
            },
            timer: 0,
            emailError: false,
            type: 'jobStatus',
            emailFocus: false,
            brokerName: '',
            transferModeName: '',
            exchangeType: '港股',
            form: {
                brokerId: -1,
                brokerName: '',
                settlementCode: '',
                contact: '',
                exchangeType: 0,
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
            // 首次进来的时候和频繁切换的市场时节流
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.appAddBrokerInfo(val)
            }, 300)
        },
        async appAddBrokerInfo(val) {
            this.columns.brokerName = []
            this.brokerName = ''
            this.brokerId = -1
            let { list } = await this.$stockTransferService.appAddBrokerInfo({
                exchangeType: val,
                pageSizeZero: true,
                orderDirection: 0
            })
            list.push({ brokerName: '其他证券', brokerId: 0 })
            this.columns.brokerName = list.map(item => {
                item.text = item.brokerName
                return item
            })
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
            } else {
                this.$set(this.form, 'brokerId', val.brokerId)
                if (val.brokerId !== 0) {
                    this.$set(this.form, 'brokerName', val.brokerName)
                    this.$set(this.form, 'telephone', val.telephone)
                    this.$set(this.form, 'settlementCode', val.settlementCode)
                    this.$set(this.form, 'contact', val.contact)
                } else {
                    this.$set(this.form, 'brokerName', '')
                    this.$set(this.form, 'telephone', '')
                    this.$set(this.form, 'settlementCode', '')
                    this.$set(this.form, 'contact', '')
                }
            }
        },
        guideClick() {
            let url = `${location.origin}/webapp/market/generator.html?key=XY022`
            this.$jsBridge.gotoNewWebview(url)
        },
        toCustomService() {
            this.$jsBridge.gotoCustomerService()
        }
    },
    computed: {
        ...mapGetters([`user`]),
        accountTypeName() {
            return this.user.accountType === 1 ? '现金账户' : '保证金账户'
        },
        userFundAccount() {
            if (!this.user.fundAccount) {
                return '暂未开户'
            }
            return this.formExchangeType === 0
                ? `港股${this.accountTypeName}${this.user.fundAccount.substr(
                      -4
                  )}`
                : `美股${this.accountTypeName}${this.user.fundAccount.substr(
                      -4
                  )}`
        },
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
                ? '转出券商DTC代码'
                : '转出券商CCASS代码'
        },
        labelText() {
            return this.exchangeType === '美股' ? 'DTC代码' : 'CCASS代码'
        }
    }
}
</script>

<style lang="scss">
.conversion-home-container {
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
            flex: 1;
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
.conversion-home-container {
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
