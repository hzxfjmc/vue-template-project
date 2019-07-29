<template lang="pug">
    yx-container.login
        .top(slot="top")
            .title 登录
        .main(slot="main")
            van-field(
            placeholder="手机号"
            label="账号："
            clearable
            v-model="formObj.phone"
            )
            password-field(
            label="密码："
            placeholder="登录密码"
            v-model="formObj.pwd"
            )
            van-button.submit-btn(
            size="large"
            type="primary"
            @click="login"
            :loading="loading"
            ) 登录
            .modify-password(@click="modifyPassword") 修改密码
</template>
<script>
import passwordField from '../../components/password-field'
import { login } from '@/service/marketing-manage'
import md5 from '../../util/md5'
import mixins from '../../util/mixins'
import LS from '@/utils/local-storage.js'
import { setToken } from '@/utils/http-request'
export default {
    mixins: [mixins],
    components: {
        passwordField
    },
    data() {
        return {
            formObj: {
                phone: '',
                pwd: ''
            },
            loading: false
        }
    },
    methods: {
        async login() {
            if (!this.$reg.empty(this.formObj.phone)) {
                this.$toast('账号不能为空')
                return
            }
            if (!this.$reg.empty(this.formObj.pwd)) {
                this.$toast('密码不能为空')
                return
            }
            try {
                this.loading = true
                let token = await login(
                    Object.assign({}, this.formObj, {
                        // md5加密
                        pwd: md5(this.formObj.pwd),
                        companyId: this.companyId
                    })
                )
                LS.put('userToken', token)
                // 为啥要手动触发下setToken
                setToken(token)
                this.$router.push('/mission')
            } catch (e) {
                this.$toast(e.msg || '网络开小差了,请稍后重试')
            } finally {
                this.loading = false
            }
        },
        modifyPassword() {
            this.$router.push('/modify-password')
        }
    }
}
</script>
<style lang="scss" scoped>
.login {
    padding: 30px $global-padding;
    .top {
        padding: 30px 14px;
        .title {
            font-size: 24px;
            padding-bottom: 14px;
        }
    }
    .submit-btn {
        margin-top: 30px;
    }
    .modify-password {
        padding-top: 14px;
        text-align: center;
        color: $primary-color;
    }
}
</style>
