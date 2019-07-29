<template lang="pug">
yx-container-better.essential-container
    .essential-container-top(slot="top")
        open-process(:process="40")
        van-popup(position="bottom" v-model="showPopup")
                van-picker(
                    ref="picker"
                    :columns="columns[type]"
                    @confirm="confirmTypeInfo"
                    @cancel="cancelHandler"
                    show-toolbar)
    .idcard-container(slot="main")
        .ic-title 职业信息
        van-field.bp-field(
            placeholder="请选择职业状态"
            type='text'
            @click.native="selectTypeInfo('jobStatus')"
            disabled="true"
            v-model='form.jobStatus'
            label='职业状态')
            .button.text-color2(slot="button")
                van-icon(name="arrow-down" size="20px")
        template(v-if="inJob")
            van-field.bp-field(
                placeholder="请输入工作单位名称"
                type='text'
                clearable
                maxlength=255
                v-model='form.companyName'
                label='公司名称')
            van-field.bp-field(
                placeholder="请选择职业状态"
                type='text'
                @click.native="selectTypeInfo('companyBusiness')"
                disabled
                v-model='form.companyBusiness'
                label='所属行业')
                .button.text-color2(slot="button")
                    van-icon(name="arrow-down" size="20px" )
            van-cell.address
                .label(slot="title") 职
                    span 隐藏
                    | 位
                van-field.bp-field(
                    placeholder="选择职位"
                    disabled
                    @click.native="selectTypeInfo('jobPosition')"
                    :border="false"
                    v-model='form.jobPosition')
                    .button.text-color2(slot="button")
                        van-icon(name="arrow-down" size="20px")
        .ic-title.relation 联系信息
        van-cell.address(:class="{'attention-line': emailError, 'inputing': emailFocus}")
            .label(slot="title") 邮
                span 隐藏
                | 箱
            van-field.bp-field.en-font-size(
                placeholder="请输入电子邮箱"
                clearable
                @input="emailInputHandler"
                @focus="emailFocusHandler"
                @blur="emailBlurHandler"
                :border="false"
                maxlength=50
                v-model='form.email')
        .attention(v-if='emailError')
            span.iconfont.icon-attention
            span 请输入有效的电子邮箱
        .p-tips.text-color5(ref="emailTips")
            p(v-if="!emailFocus") 邮箱将用于接收交易结单，账号安全提醒等重要文件和通知
            ul(v-else)
                li(v-for="item,index in emails" :key="index")
                    span(@click="selectEmailHandler(item)") {{item}}
        van-field.bp-field(
            placeholder="请输入现居住地址"
            type='text'
            maxlength=255
            clearable
            v-model='form.contactAddress'
            label='通讯地址')
    van-button(
        slot="bottom"
        size="large"
        :disabled="disabled"
        type="primary"
        @click="submitHandler"
        class="bottom-button" ) 下一步:投资信息
</template>

<script>
import { Icon, Popup, Picker } from 'vant'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('apply')
const JOB_STATUS_MAP = {
    受雇: '1001',
    创业: '1002',
    自由职业: '1003',
    学生: '1004',
    退休: '1005'
}
export default {
    mixins: [require('../../mixins/mix-router.js').default],
    components: {
        [Icon.name]: Icon,
        [Popup.name]: Popup,
        [Picker.name]: Picker
    },
    data() {
        return {
            emails: [
                '@qq.com',
                '@126.com',
                '@163.com',
                '@gmail.com',
                '@139.com'
            ],
            showPopup: false,
            columns: {
                jobStatus: ['受雇', '创业', '自由职业', '学生', '退休'],
                companyBusiness: [],
                jobPosition: []
            },
            emailError: false,
            type: 'jobStatus',
            emailFocus: false,
            form: {
                companyName: '',
                email: '',
                contactAddress: '',
                companyBusiness: '',
                jobPosition: '',
                jobStatus: '受雇',
                jobStatusCode: '1001'
            }
        }
    },
    async created() {
        await this.getAppSystem()
        const data = await this.$accountService.getUserJobAndContact()
        this.$set(this.form, 'contactAddress', this.basicInfo.identifyAddress)
        for (let key in this.form) {
            data[key] && this.$set(this.form, key, data[key])
        }
    },
    methods: {
        async getAppSystem() {
            let { list: data } = await this.$configService.getAppSystem([
                'KHHY',
                'KHZW'
            ])
            this.$set(
                this.columns,
                'companyBusiness',
                JSON.parse(data[0].content).map(item => item.content)
            )
            this.$set(this.form, 'companyBusiness', data[0].defaultValue)
            this.$set(
                this.columns,
                'jobPosition',
                JSON.parse(data[1].content).map(item => item.content)
            )
            this.$set(this.form, 'jobPosition', data[1].defaultValue)
        },
        emailBlurHandler() {
            setTimeout(() => {
                if (!this.$reg.email(this.form.email)) {
                    this.emailError = true
                } else {
                    this.emailError = false
                }
                this.emailFocus = false
            }, 300)
        },
        emailFocusHandler() {
            if (!/(ipad)|(iphone)/i.test(navigator.userAgent)) {
                setTimeout(() => {
                    this.$refs.emailTips.scrollIntoView()
                }, 300)
            }
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
            try {
                if (!this.$reg.email(this.form.email)) {
                    this.emailError = true
                    return
                }
                await this.$confirm({
                    message: `邮箱用于接收交易结单、找回密码等操作，对您非常重要，请再次确认：<br/><p style="padding-top: 20px;font-size: 20px;" class="primary-color">${this.form.email}</p>`,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                })
                if (!this.inJob) {
                    this.form = {
                        ...this.form,
                        companyName: '',
                        companyBusiness: '',
                        jobPosition: ''
                    }
                }
                this.$set(
                    this.form,
                    'jobStatusCode',
                    JOB_STATUS_MAP[this.form.jobStatus]
                )
                await this.$accountService.setUserJobAndContact(this.form)
                this.goApplyStep()
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
                    this.columns[this.type].indexOf(this.form[this.type])
                )
            })
        },
        cancelHandler() {
            this.showPopup = false
        },
        confirmTypeInfo(val) {
            this.showPopup = false
            this.form[this.type] = val
        }
    },
    computed: {
        ...mapGetters(['basicInfo']),
        inJob() {
            return ['受雇', '创业'].indexOf(this.form.jobStatus) > -1
        },
        // 按钮是否可用
        disabled() {
            if (this.inJob) {
                return Object.values(this.form).some(item => {
                    if (typeof item === 'string' || typeof item === 'number') {
                        return !(item + '').trim()
                    } else {
                        return !item
                    }
                })
            } else {
                return !this.form.contactAddress || !this.form.email
            }
        }
    }
}
</script>

<style lang="scss">
.essential-container {
    .idcard-container {
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
.essential-container {
    .idcard-container {
        padding: $global-padding;
        .p-tips {
            font-size: 12px;
            padding-top: 10px;
            position: relative;
            z-index: 100;
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
                    border-radius: 3px;
                    border: 1px solid $primary-color;
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
        padding-bottom: 30px;
    }
}
</style>
