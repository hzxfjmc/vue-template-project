<template lang="pug">
    .tel-verify-code
        van-field.tel-input(
        clearable
        type="tel"
        v-model="formObj[telKey]"
        @input="onInput"
        placeholder="请输入手机号码")
            yx-select-pop(
            slot="left-icon"
            :options="districtList"
            v-model="formObj[areaCodeKey]"
            @input="onInput"
            :marginLeft="40"
            )
        van-field(
        label="验证码："
        placeholder="请输入验证码"
        v-model="formObj[verifyCodeKey]"
        @input="onInput"
        type="number"
        )
            van-button.code-btn(
            slot="button"
            @click="getVerifyCode"
            :loading="loading"
            :disabled="disabledBtn"
            ) {{text}}

</template>
<script>
import YxSelectPop from '@/components/yx-select-pop'
import { districtList } from './list'

import { getPhoneCaptcha } from '@/service/marketing-manage'

/*
 * 获取验证码状态
 * 1：初始状态
 * 2：获取中
 * 3：获取完成
 * */
// const verifyCodeStatus = {
//     INIT: 1,
//     FETCHING: 2,
//     DONE: 3
// }

export default {
    components: {
        YxSelectPop
    },
    data() {
        return {
            // 区号列表
            districtList: districtList,
            formObj: {},
            // 默认倒数60秒
            timeoutCount: 60,
            isInit: true,
            loading: false
        }
    },
    props: {
        value: {},
        telKey: {
            type: String,
            default: 'phone'
        },
        verifyCodeKey: {
            type: String,
            default: 'verifyCode'
        },
        areaCodeKey: {
            type: String,
            default: 'areaCode'
        },
        params: {
            type: Object,
            default: () => {}
        }
    },
    computed: {
        disabledBtn() {
            return this.timeoutCount > 1 && this.timeoutCount < 60
        },
        text() {
            if (this.isInit) {
                return '获取验证码'
            } else {
                if (this.disabledBtn) {
                    return `${this.timeoutCount}秒后重新获取`
                } else {
                    return '重新获取验证码'
                }
            }
        }
    },
    created() {
        this.$set(this.formObj, this.telKey, '')
        this.$set(this.formObj, this.verifyCodeKey, '')
        this.$set(this.formObj, this.areaCodeKey, '852')
    },
    methods: {
        onInput() {
            this.$emit('input', Object.assign(this.value, this.formObj))
        },
        loadTimeout() {
            this.timeoutCount = 59
            let timeout = setInterval(() => {
                this.timeoutCount--
                if (this.timeoutCount === 0) {
                    clearInterval(timeout)
                }
            }, 1000)
        },
        async getVerifyCode() {
            if (!this.$reg.empty(this.formObj[this.telKey])) {
                this.$toast('手机号不能为空')
                return
            }
            if (!this.$reg.mobile(this.formObj[this.telKey])) {
                this.$toast('手机号格式不正确')
                return
            }
            this.loading = true
            try {
                await getPhoneCaptcha(
                    Object.assign(
                        {},
                        {
                            areaCode: this.formObj[this.areaCodeKey],
                            phone: this.formObj[this.telKey]
                        },
                        this.params
                    )
                )
                this.$toast('验证码已发送至您的手机，请注意查收')
                this.loadTimeout()
                this.isInit = false
            } catch (e) {
                this.$toast(e.msg || '网络开小差了,请稍后重试')
            } finally {
                this.loading = false
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.tel-verify-code {
    .tel-input {
        padding-left: 20px;
        /deep/ .van-field__control {
            padding-left: 18px;
        }
    }
    .code-btn {
        width: 136px;
        height: 34px !important;
        line-height: 34px;
        background-color: $primary-color-line;
        color: #fff;
        text-align: center;
        border-radius: 4px !important;
        border: none;
    }
}
</style>
