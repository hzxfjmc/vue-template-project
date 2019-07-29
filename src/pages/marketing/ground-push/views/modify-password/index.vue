<template lang="pug">
    yx-container.modify-password
        .main(slot="main")
            tel-verify-code.tel-input-field(
            v-model="formObj"
            :params="{ type: verifyCodeTypeMap.MODIFY_PWD }"
            )
            password-field(
            label="新密码："
            placeholder="请输入新密码"
            clearable
            v-model="formObj.newPwd"
            )
            password-field(
            label="确认新密码："
            placeholder="请再次输入新密码"
            v-model="formObj.confirmPwd"
            clearable
            )
            .btn-wrap
                van-button.btn(
                type="primary"
                size="large"
                @click="submit"
                :loading="loading"
                ) 确定
                van-button.btn(
                size="large"
                @click="back"
                ) 返回
</template>
<script>
import telVerifyCode from '../../components/tel-verify-code'
import passwordField from '../../components/password-field'
import { modifyPwdValidator, validatorCheck } from '../../util/validator'
import { modifyPassword } from '@/service/marketing-manage'
import md5 from '../../util/md5'
import mixins from '../../util/mixins'
import { verifyCodeTypeMap } from '../../util/map'
export default {
    mixins: [mixins],
    components: {
        telVerifyCode,
        passwordField
    },
    data() {
        return {
            formObj: {
                // 区号
                areaCode: '',
                // 确认密码
                confirmPwd: '',
                // 新密码
                newPwd: '',
                // 手机号
                phone: '',
                // 验证码
                verifyCode: ''
            },
            loading: false,
            verifyCodeTypeMap: verifyCodeTypeMap
        }
    },
    methods: {
        checkFormObj() {
            return validatorCheck.call(this, modifyPwdValidator, this.formObj)
        },
        async submit() {
            if (!this.checkFormObj()) {
                return
            }
            try {
                this.loading = true
                let { newPwd, confirmPwd } = this.formObj
                let param = {
                    companyId: this.companyId,
                    newPwd: md5(newPwd),
                    confirmPwd: md5(confirmPwd)
                }
                await modifyPassword(Object.assign({}, this.formObj, param))
                this.$router.push('/login')
            } catch (e) {
                this.$toast(e.msg || '网络开小差了,请稍后重试')
            } finally {
                this.loading = false
            }
        },
        back() {
            history.back(-1)
        }
    }
}
</script>
<style lang="scss" scoped>
#app {
    .modify-password {
        .btn-wrap {
            padding: 30px $global-padding;
            .btn {
                margin-bottom: 20px;
            }
        }
        /deep/ .van-cell__title {
            width: 90px;
        }
        .tel-input-field /deep/ .tel-input .van-field__control {
            padding-left: 28px;
        }
    }
}
</style>
