<template lang="pug">
.verification-code
    .bp-title 请输入验证码、设置密码
    .bp-tips 验证码已通过短信发送至 +86 {{phone}}
    van-field.bp-field(
        placeholder="请输入验证码"
        type='tel'
        clearable
        :maxlength="6"
        v-model='captcha'
        label='验证码')
        span(slot="button" :class="{active: time === 60}" @click='sendCodeHandler') {{sendText}}
    van-field.bp-field(
        placeholder="请输入密码"
        :type="pType"
        clearable
        v-model='pwd'
        label='登录密码')
        .vc-btn(slot="button" @click="showCodeHandler")
            img(src="@/assets/img/open-account/bind-phone/view.png" v-if="pType === 'password'")
            img(src="@/assets/img/open-account/bind-phone/hide.png" v-else)
    van-button.bp-btn(
        disable size='large'
        :disabled="!canSubmit"
        @click="submitHandler"
        type='primary') 提交
    .v-kf(@click='confirmHandler') 无法接收验证码？
</template>
<script>
export default {
    data() {
        return {
            pType: 'password',
            pwd: '',
            captcha: '',
            timer: 0,
            time: 60,
            sendText: '重新获取'
        }
    },
    created() {
        // 从上个页面进来的时候请求发送短信 刷新时不请求
        this.pre && this.sendCodeHandler()
    },
    methods: {
        async confirmHandler() {
            try {
                await this.$confirm({
                    title: '无法接收验证码',
                    confirmButtonText: '联系客服',
                    cancelButtonText: '确定',
                    message:
                        '客服专人将在2分钟内为您提供帮助，请保持手机号码通信通畅'
                })
                await this.$confirm({
                    title: '联系客服',
                    confirmButtonText: '呼叫',
                    cancelButtonText: '取消',
                    message: '400-870-0000'
                })
                window.location.href = 'tel:400-870-0000'
            } catch (e) {
                console.log(e)
            }
        },
        showCodeHandler() {
            this.pType = this.pType === 'text' ? 'password' : 'text'
        },
        async submitHandler() {
            try {
                await this.$userService.register(
                    this.phone,
                    this.pwd,
                    this.captcha
                )
                await this.$store.dispatch('getUserInfoAction')
                this.$router.push({
                    name: 'idcard'
                })
            } catch (e) {
                this.$toast(e.msg || '网络开小差了,请稍后重试')
            }
        },
        async sendCodeHandler() {
            // 不可重复点击
            if (this.time < 60) {
                return
            }
            try {
                await this.$userService.sendPhoneCapcha(this.phone)
                await this.$toast('短信发送成功')
                this.timer = setInterval(() => {
                    if (this.time > 1) {
                        this.time--
                        this.sendText = this.time + '秒后重新获取'
                    } else {
                        this.time = 60
                        clearInterval(this.timer)
                        this.sendText = '重新获取'
                    }
                }, 1000)
            } catch (e) {
                this.$toast(e.msg || '网络开小差了,请稍后重试')
            }
        }
    },
    computed: {
        // 判断是否来自上个页面
        pre() {
            return this.$route.params.pre
        },
        phone() {
            return this.$route.params.phone
        },
        canSubmit() {
            return this.$reg.captcha(this.captcha) && this.$reg.empty(this.pwd)
        }
    }
}
</script>

<style lang="scss" scoped>
.verification-code {
    padding: 30px $global-padding;
    .bp-title {
        font-size: 24px;
        padding-bottom: 14px;
    }
    .bp-tips {
        margin-bottom: 60px;
        font-size: 14px;
        color: $text-color5;
    }
    .bp-field {
        span {
            color: $text-color5;
            font-size: 12px;
            &.active {
                color: $primary-color;
            }
        }
    }
    .bp-btn {
        margin-top: 39px;
    }
    .v-kf {
        padding-top: 14px;
        text-align: center;
        color: $primary-color;
    }
    .vc-btn {
        display: flex;
        height: 12px;
        width: 17px;
    }
}
</style>
