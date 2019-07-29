<template lang="pug">
.formWrap
    .form
        van-field.bp-field(
            placeholder="请输入手机号码"
            type='tel'
            clearable
            v-model='form.phoneNumber')
            p(
                slot="label" 
                class="label" 
                @click="showAreaCode = true")  +{{form.areaCode}}
                van-icon(
                    name="play" 
                    class="downIcon" 
                    color="#353547" 
                    size="14px")
        .captcha
            van-field.bp-field(
                placeholder="请输入短信验证码"
                type="number"
                clearable
                v-model='form.captcha')
            span.sendCaptchaBtn( 
                @click="getVerifyCode") {{sendText}}
        van-button.bp-btn(
            size='large'
            @click="submitHandler" 
            :loading="loading"
            type='primary') 注册登录
    van-popup(
        v-model="showAreaCode" 
        position="bottom")
        van-picker(
            show-toolbar 
            :columns="columns"  
            value-key="name"
            :default-index="0"
            @cancel="onCancel"
            @confirm="onConfirm")
    van-dialog.verify-code-box.base-dialog(
        v-model="showVerifyCodeImg"
        :close-on-click-overlay="true"
        title="请输入验证码"
        confirmButtonText="提交"
        :before-close="checkVerifyCode"
        @confirm="isClickConfirm = true")
        .content
            van-field.input-code(
                placeholder="输入验证码"
                v-model="verifyCode")
            img(
                :src="`${jyUrl}/verification-code-server/api/getCode/v1?key=${verifyCodeKey}`"
                @click="changeVerifyKey")
    van-dialog.base-dialog(
        v-model="showSuccess"
        :close-on-click-overlay="true"
        confirmButtonText="前往APP"
        @confirm="goApp")
        .success-text 您的手机号已完成注册
            br
            span 请前往APP领取奖励
</template>
<script>
import { Icon, Popup, Picker } from 'vant'
import {
    sendPhoneCaptchaV2,
    checkPhoneV2,
    registerLogin
} from '@/service/user-server.js'
import { API_BASE_URL } from '@/utils/DOMAIN.js'
import { getVerifyCodeKey } from '@/utils/tools'
import LS from '@/utils/local-storage.js'
import { setToken } from '@/utils/http-request'
// 生成图形验证码key的模块名称
const moduleKey = 'marketing_register'

export default {
    data() {
        return {
            form: {
                areaCode: '86',
                captcha: '',
                phoneNumber: '',
                source: 11,
                inviteCode: this.inviteCode
            },
            time: 60,
            sendText: '获取验证码',
            columns: [
                { id: '86', name: '+86 中国' },
                { id: '852', name: '+852 中国香港' },
                { id: '853', name: '+853 中国澳门' },
                { id: '886', name: '+886 中国台湾' },
                { id: '65', name: '+65 新加坡' }
            ],
            showAreaCode: false,
            isSending: false,
            verifyCodeKey: getVerifyCodeKey(moduleKey),
            // 是否展示验证码图片
            showVerifyCodeImg: false,
            // 输入的验证码
            verifyCode: '',
            // 是否展示注册成功弹窗
            showSuccess: false,
            // 注册按钮的loading
            loading: false,
            jyUrl: API_BASE_URL.JY,
            isClickConfirm: false //输入验证码时判断的是点击蒙层还是确认按钮
        }
    },
    props: {
        activityId: {
            type: String,
            default: ''
        },
        channel: {
            type: String,
            default: ''
        },
        channelId: {
            type: String,
            default: ''
        },
        inviteCode: {
            type: String,
            default: ''
        }
    },
    components: {
        [Icon.name]: Icon,
        [Popup.name]: Popup,
        [Picker.name]: Picker
    },
    computed: {
        isPhone() {
            return this.$reg.mobile(this.form.phoneNumber)
        },
        registerBtnAct() {
            return this.form.captcha !== '' && this.isPhone
        }
    },
    methods: {
        //  手机区号的选择与取消
        onCancel() {
            this.showAreaCode = false
        },
        onConfirm(val) {
            this.form.areaCode = val.id
            this.showAreaCode = false
        },
        async getVerifyCode() {
            if (!this.isSending) {
                if (!this.isPhone) {
                    this.$toast('请输入正确的手机号码')
                    return
                }
                let isRegisterPhone = await this.checkPhone()
                if (isRegisterPhone) {
                    return
                }
                this.changeVerifyKey()
                this.verifyCode = ''
                this.showVerifyCodeImg = true
            }
        },
        // 更换验证码
        changeVerifyKey() {
            this.verifyCodeKey = getVerifyCodeKey(moduleKey)
        },
        // 校验手机号是否已注册
        async checkPhone() {
            try {
                let { registered } = await checkPhoneV2({
                    areaCode: this.form.areaCode,
                    phoneNumber: this.form.phoneNumber
                })
                if (registered) {
                    this.showSuccess = true
                    return true
                }
            } catch (e) {
                this.$toast(e.msg || '网络开小差了,请稍后重试')
                return true
            }
            return false
        },
        // 校验图形验证码
        async checkVerifyCode(action, done) {
            if (this.isClickConfirm) {
                this.isClickConfirm = false
                if (!this.verifyCode) {
                    this.$toast('请输入短信验证码')
                    done(false)
                    return
                }
                let isSuccess = await this.sendCaptcha()
                done(isSuccess)
                isSuccess && (await this.$toast('短信发送成功'))
            } else {
                done(true)
            }
        },
        // 发送短信验证码
        async sendCaptcha() {
            try {
                await sendPhoneCaptchaV2({
                    phoneNumber: this.form.phoneNumber,
                    areaCode: this.form.areaCode,
                    type: 101,
                    key: this.verifyCodeKey,
                    graphCaptcha: this.verifyCode
                })
                // this.form.captcha = captcha.captcha
                let timer = setInterval(() => {
                    if (this.time > 1) {
                        this.sendText = --this.time + '秒后重新获取'
                        this.isSending = true
                    } else {
                        this.time = 60
                        clearInterval(timer)
                        this.sendText = '重新发送'
                        this.isSending = false
                    }
                }, 1000)
                return true
            } catch (e) {
                e.msg && this.$toast(e.msg)
                return false
            }
        },
        // 注册或登录
        async submitHandler() {
            if (!this.form.phoneNumber) {
                this.$toast('请输入手机号码')
                return
            }
            if (!this.form.captcha) {
                this.$toast('请输入短信验证码')
                return
            }
            try {
                this.loading = true
                let res = await registerLogin(
                    this.form,
                    this.channelId,
                    this.channel,
                    this.activityId
                )
                LS.put('userToken', res.token)
                setToken(res.token)
                this.$emit('registerSuccess', res)
                this.$receiveData &&
                    this.$receiveData('user_register', res.uuid)
            } catch (e) {
                this.$toast(e.msg || '网络开小差了,请稍后重试')
            } finally {
                this.loading = false
            }
        },
        // 前往app
        goApp() {
            this.$goAppDownLoad()
        }
    }
}
</script>

<style lang="scss" scoped>
.formWrap {
    width: 336px;
    background: rgba(206, 32, 6, 0.4);
    padding: 14px;
    border-radius: 8px;
    margin: 10px auto 20px;
    .form {
        .bp-field {
            line-height: 27px !important;
            border-radius: 6px;
            margin-bottom: 10px;
            .label {
                font-size: 0.32rem;
                color: #353547;
                .downIcon {
                    transform: rotate(90deg);
                    vertical-align: middle;
                    margin-left: 4px;
                    margin-top: -4px;
                }
            }
        }
        .captcha {
            display: flex;
            justify-content: space-between;
            .bp-field {
                width: 190px;
            }
            .sendCaptchaBtn {
                width: 108px;
                height: 47px;
                background: rgba(255, 102, 52, 1);
                border-radius: 6px;
                line-height: 47px;
                font-size: 0.28rem;
                color: #fff;
                text-align: center;
            }
        }
        .bp-btn {
            width: 100%;
            background: linear-gradient(
                180deg,
                rgba(255, 231, 130, 1) 0%,
                rgba(255, 208, 6, 1) 100%
            );
            border: none;
            font-size: 0.36rem;
            font-weight: 500;
            color: #e04040;
        }
    }
    .base-dialog {
        border-radius: 20px;
    }
    .verify-code-box {
        width: 323px !important;
        .content {
            margin-top: 20px;
            padding: 0 20px 20px;
            display: flex;
            justify-content: space-between;
            .input-code {
                width: 181px;
                height: 50px;
                border: 1px solid $hk-text-color2;
            }
            img {
                width: 92px;
                height: 50px;
            }
        }
    }
    .success-text {
        text-align: center;
        padding: 24px 0;
    }
}
</style>
