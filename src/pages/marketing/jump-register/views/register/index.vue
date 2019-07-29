<template lang="pug">
.register
    img(src="@/assets/img/marketing/recruit-new-ch/logo2.png").logo
    .form
        van-field.bp-field(
            placeholder="请输入手机号"
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
            span(
                slot="button"
                :class="isSending || !isPhone ? '':'active'"
                @click="getVerifyCode") {{sendText}}
        van-field.bp-field(
            placeholder="请输入手机验证码"
            type="number"
            clearable
            v-model='form.captcha'
            label='验证码')
        .hint
            van-icon(
                :name="isChoose ? 'checked' :'passed'"
                color="#2F79FF"
                size="14px"
                class="chooseIcon"
                @click="isChoose = !isChoose")
            span.agree-text 同意并遵守
                a.base-color(:href="registerPolicy") 注册协议
                span 和
                a.base-color(:href="secretPolicy") 隐私权政策
        van-button.bp-btn(
            size='large'
            @click="submitHandler"
            :disabled="!registerBtnAct"
            :loading="loading"
            type='primary') 注册
    .footerInfo
        p 联系客服
            span.base-color 4006261888
        p 备案号：粤ICP备18145111号
        p “股市有风险，投资需谨慎”
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
import { mapGetters } from 'vuex'
import { getParameter } from '@/utils/tools'

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
                inviteCode: ''
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
            isChoose: true,
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
            isClickConfirm: false //验证码弹窗判断是否是点确定按钮关闭（点击确定按钮关闭则校验图形验证码）
        }
    },
    components: {
        [Icon.name]: Icon,
        [Popup.name]: Popup,
        [Picker.name]: Picker
    },
    computed: {
        ...mapGetters(['userInfo']),
        isPhone() {
            return this.$reg.mobile(this.form.phoneNumber)
        },
        registerBtnAct() {
            return this.form.captcha !== '' && this.isPhone && this.isChoose
        },
        // 注册协议地址
        registerPolicy() {
            return (
                window.location.origin +
                '/webapp/market/generator.html?key=AGR006'
            )
        },
        // 隐私权政策地址
        secretPolicy() {
            return (
                window.location.origin +
                '/webapp/market/generator.html?key=AGR007'
            )
        }
    },
    created() {
        this.form.inviteCode = getParameter('code')
        // 已登录状态下跳转首页
        if (this.userInfo.userToken) {
            this.$router.replace({
                name: 'index'
            })
        }
    },
    methods: {
        // 手机区号的选择与取消
        onCancel() {
            this.showAreaCode = false
        },
        onConfirm(val) {
            this.form.areaCode = val.id
            this.showAreaCode = false
        },
        // 点击获取验证码
        async getVerifyCode() {
            if (!this.isSending) {
                if (!this.isPhone) {
                    this.$toast('请填写正确的手机号')
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
                e.msg && this.$toast(e.msg)
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
        // 注册
        async submitHandler() {
            try {
                this.loading = true
                let res = await registerLogin(
                    this.form,
                    getParameter('register-cid'),
                    getParameter('register-ct'),
                    getParameter('id')
                )
                this.$store.dispatch('setUserInfo', {
                    userToken: res.token,
                    uuid: res.uuid
                })
                this.$receiveData &&
                    this.$receiveData('user_register', res.uuid)
                LS.put('userToken', res.token)
                setToken(res.token)
                this.$router.push({
                    name: 'index',
                    query: {
                        nickname: res.nickname
                    }
                })
            } catch (e) {
                e.msg && this.$toast(e.msg)
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
.register {
    padding: 7px 0;
    background: #fff;
    .logo {
        display: block;
        width: 180px;
        height: 53px;
        margin: 24px auto;
    }
    .base-color {
        color: $primary-color;
    }
    .form {
        .bp-field {
            line-height: 39px !important;
            span {
                color: $text-color5;
                font-size: 12px;
                &.active {
                    color: $primary-color;
                }
            }
            .label {
                font-size: 16px;
                color: #353547;
                .downIcon {
                    transform: rotate(90deg);
                    vertical-align: middle;
                    margin-left: 4px;
                    margin-top: -4px;
                }
            }
        }
        .hint {
            padding-left: 14px;
            padding-top: 5px;
            font-size: 12px;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: rgba(53, 53, 71, 0.5);
            line-height: 17px;
            .chooseIcon {
                // margin-top: 4px;
                vertical-align: middle;
            }
            .agree-text {
                margin-left: 4px;
                vertical-align: middle;
            }
        }
        .bp-btn {
            display: block;
            width: 343px;
            margin: 30px auto;
        }
    }
    .footerInfo {
        font-size: 0.24rem;
        color: rgba(53, 53, 71, 0.2);
        line-height: 17px;
        text-align: center;
        p {
            margin-bottom: 4px;
            &:nth-of-type(1) {
                font-size: 0.28rem;
                color: rgba(53, 53, 71, 0.5);
                line-height: 20px;
            }
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
