<template lang="pug">
.bind-phone 
    .bp-title 请输入手机号码
    .bp-tips 绑定手机后，即可有效提升你的账号安全
    van-field.bp-field(
        placeholder="请输入手机号"
        :maxlength="11" 
        type='tel'
        clearable
        v-model='phone'
        label='+86')
    van-button.bp-btn(
        disable size='large'
        :disabled="!isPhone"
        @click="getCaptcha"
        type='primary') 获取验证码
</template>
<script>
export default {
    data() {
        return {
            phone: ''
        }
    },
    computed: {
        isPhone() {
            return this.$reg.mobile(this.phone)
        }
    },
    methods: {
        async getCaptcha() {
            this.$router.push({
                name: 'captcha',
                params: {
                    phone: this.phone,
                    pre: true
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.bind-phone {
    padding: 30px $global-padding;
    .bp-title {
        font-size: 24px;
        padding-bottom: 14px;
    }
    .bp-field {
        margin-top: 60px;
    }
    .bp-tips {
        font-size: 14px;
        color: $text-color5;
    }
    .bp-btn {
        margin-top: 39px;
    }
}
</style>
