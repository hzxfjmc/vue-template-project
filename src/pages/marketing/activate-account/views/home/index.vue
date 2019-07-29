<template lang="pug">
    .activate-account-container
        .header
            .title 激活賬號
        .form-container
            .form-item
                van-field(class="area-code" v-model="form.areaCode" readonly @click="showAreaCodeList")
                    i(class="icon-pull-down iconfont icon-pulldown_icon" slot="icon" @click="showAreaCodeList")
                van-field(placeholder="请输入手机号码" v-model="form.phoneNumber")
            .form-item
                van-field(label="驗證碼" placeholder="请输入驗證碼" v-model="form.captcha")
                    div(class="send-captcha" :class="{disabled:isSent || areaCodeDisabled}" slot="icon" @click="sendCaptcha") {{sentText}}
            .form-item
                van-field(label="證件號碼" placeholder="请输入證件號碼" v-model="form.identifyCode")
        .protocol-container
            p 我已經閱讀並同意
            p
                a.link(@click="gotoProtocol('AGR008')") 《產品使用許可協議》和
                a.link(@click="gotoProtocol('AGR009')") 《私隱政策聲明》
        .btn-container
            van-button(
                size="large"
                slot="bottom"
                type="primary"
                :disabled="disabled"
                @click="submit"
                class="bottom-button" ) 立即激活
        yx-popup(
            v-model="areaCodeShow"
            position ="bottom")
            .area-code-container
                ul
                    li.item(v-for="item in areaCodeList" :class="{active: form.areaCode === item.value}" @click="handleAreaCode(item.value)") {{item.label}}
</template>

<script>
import {
    sendPhoneCaptcha,
    phoneCaptchaActivateLogin
} from '@/service/user-server'
export default {
    data() {
        return {
            areaCodeShow: false,
            isSent: false,
            areaCodeList: [
                { label: '香港 +852', value: '+852' },
                { label: '中國內地 +86', value: '+86' },
                { label: '澳門 +853', value: '+853' },
                { label: '臺灣 +886', value: '+886' },
                { label: '新加坡 +65', value: '+65' }
            ],
            sentText: '發送驗證碼',
            form: {
                areaCode: '+86',
                captcha: '',
                identifyCode: '',
                phoneNumber: '',
                source: 12
            }
        }
    },
    computed: {
        disabled() {
            return Object.keys(this.form).some(key => !this.form[key])
        },
        areaCodeDisabled() {
            return !this.form.areaCode || !this.form.phoneNumber
        }
    },
    methods: {
        gotoProtocol(key) {
            location.href = `/webapp/market/generator.html?key=${key}`
        },
        parseAreaCode(code) {
            return code ? code.replace(/\+/, '') : ''
        },
        handleAreaCode(areaCode) {
            this.form.areaCode = areaCode
            this.areaCodeShow = false
        },
        showAreaCodeList() {
            this.areaCodeShow = true
        },
        // 发送验证码
        sendCaptcha() {
            if (this.isSent || this.areaCodeDisabled) return false
            this.isSent = true
            this.sendPhoneCaptcha().then(
                () => {
                    let duration = 60
                    this.sentText = `重新獲取${duration}s`
                    let timer = setInterval(() => {
                        duration--
                        this.sentText = `重新獲取${duration}s`
                        if (duration <= 0) {
                            clearInterval(timer)
                            this.sentText = `重新獲取`
                            this.isSent = false
                        }
                    }, 1000)
                },
                () => {
                    this.isSent = false
                }
            )
        },
        // 发送验证码接口请求
        sendPhoneCaptcha() {
            return new Promise(async (resolve, reject) => {
                try {
                    let params = {
                        areaCode: this.parseAreaCode(this.form.areaCode),
                        phoneNumber: this.form.phoneNumber,
                        type: 106 // 验证码类型 101注册 102重置密码 103更换手机号 104绑定手机号 105新设备登录校验 106短信登录
                    }
                    let data = await sendPhoneCaptcha(
                        params.phoneNumber,
                        params.areaCode,
                        params.type
                    )
                    this.$toast('驗證碼发送成功')
                    resolve(data)
                } catch (e) {
                    this.$toast(e.msg)
                    reject(e)
                }
            })
        },
        // 立即激活提交
        async submit() {
            try {
                this.$loading()
                let params = Object.assign({}, this.form)
                params.areaCode = this.parseAreaCode(params.areaCode)
                await phoneCaptchaActivateLogin(params)
                this.$close()
                this.$router.replace({ name: 'result' })
            } catch (e) {
                this.$toast(e.msg)
            }
        }
    }
}
</script>

<style lang="scss">
.activate-account-container {
    .form-item {
        .van-field {
            font-size: 18px;
            padding-left: 2px;
            padding-right: 2px;
            font-family: PingFangHK-Light;
            font-weight: 300;
            border-bottom: 1px solid rgba(57, 57, 57, 0.0547);
        }
        .area-code {
            width: 89px;
            margin-right: 10px;
        }
    }
}
</style>
<style lang="scss" scoped>
.icon-pull-down {
    font-size: 10px;
}
.send-captcha {
    width: 100px;
    height: 34px;
    line-height: 34px;
    background: rgba(0, 85, 255, 1);
    border-radius: 4px;
    font-size: 14px;
    font-family: PingFangHK-Regular;
    font-weight: 400;
    text-align: center;
    color: rgba(255, 255, 255, 1);
}
.protocol-container {
    padding-top: 40px;
    text-align: center;
    font-size: 16px;
    font-family: PingFangHK-Regular;
    font-weight: 400;
    .link {
        color: #0055ff;
        line-height: 22px;
    }
}
.activate-account-container {
    padding: 0 16px 16px;
    background: #fff;
    .header {
        padding-top: 124px;
        .title {
            font-size: 36px;
            font-family: PingFangHK-Medium;
            font-weight: 500;
            color: rgba(57, 57, 57, 1);
            line-height: 50px;
        }
    }
    .form-container {
        padding-top: 46px;
        .form-item {
            display: flex;
        }
    }
    .btn-container {
        padding-top: 66px;
        .bottom-button {
            background: rgba(0, 85, 255, 1);
            border-radius: 4px !important;
        }
    }
    .send-captcha.disabled {
        background: #a0a2a7;
    }
    .area-code-container {
        .item {
            font-size: 16px;
            opacity: 0.5;
            padding: 15px 0px;
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
}
</style>
