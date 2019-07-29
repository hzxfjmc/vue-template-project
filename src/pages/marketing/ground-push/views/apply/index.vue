<template lang="pug">
    yx-container.apply
        .main(slot="main")
            van-field(
            placeholder="请输入姓名"
            clearable
            label='姓名：'
            v-model="formObj.name"
            )
            van-field(
            placeholder="请输入邮箱"
            clearable
            v-model="formObj.email"
            label='联系邮箱：')
            van-field(
            disabled
            :value="companyName"
            label='所属公司：')
            tel-verify-code(
            v-model="formObj"
            :params="{ type: verifyCodeTypeMap.APPLY }"
            )
            upload-field(
            v-model="formObj.photoUrl"
            label="个人图片："
            sub-label="点击上传个人图片"
            )
            upload-field(
            v-model="formObj.idCardInfoUrl"
            label="身份证明信息："
            sub-label="点击上传身份证明信息"
            )
        .footer(slot="bottom")
            van-button(
            size='large'
            type='primary'
            @click="submit"
            :loading="loading"
            ) 下一步
</template>
<script>
import uploadField from '../../components/upload-field'
import telVerifyCode from '../../components/tel-verify-code'
import { add } from '@/service/marketing-manage'
import { applyValidator, validatorCheck } from '../../util/validator'
import mixins from '../../util/mixins'
import { verifyCodeTypeMap } from '../../util/map'
export default {
    components: {
        uploadField,
        telVerifyCode
    },
    mixins: [mixins],
    data: () => ({
        formObj: {
            name: '',
            // 所属公司ID
            companyId: '',
            // 邮箱
            email: '',
            // 身份证图片
            idCardInfoUrl: '',
            // 手机号
            phone: '',
            // 验证码
            verifyCode: '',
            // 个人图片
            photoUrl: '',
            // 区号
            areaCode: ''
        },
        loading: false,
        verifyCodeTypeMap: verifyCodeTypeMap
    }),
    methods: {
        checkFormObj() {
            return validatorCheck.call(this, applyValidator, this.formObj)
        },
        async submit() {
            if (!this.checkFormObj()) {
                return
            }
            try {
                this.loading = true
                await add(
                    Object.assign(this.formObj, { companyId: this.companyId })
                )
                this.$router.push('/result')
            } catch (e) {
                this.$toast(e.msg || '网络开小差了,请稍后重试')
            } finally {
                this.loading = false
            }
        }
    }
}
</script>
