<template lang="pug">
yx-container-better.personal-container
    open-process(:process="25" slot="top")
    .idcard-container(slot="main")
        .ic-title(@click="imgPreview(idBackPath)") 身份验证
        .upload-idcard.flex
            idcard(:upImg='idFrontPath')
            idcard(:upImg='idBackPath' text="国徽" src="/webapp/open-account/open-account/idcard/card-behind.png")
        .p-tips.text-color5 请确认您的身份信息，如有错误请手动修改
        van-field.bp-field(
            placeholder="请输入中文姓名"
            type='text'
            clearable
            maxlength=50
            v-model='form.realName'
            label='中文姓名')
        van-cell.pingyin
            .label(slot="title") 姓名拼音
            .flex
                van-field.bp-field.english(
                    placeholder="输入姓拼音"
                    type='text'
                    clearable
                    maxlength=50
                    :border="false"
                    label="姓"
                    v-model='form.lastName')
                van-field.bp-field.english(
                    type='text'
                    clearable
                    placeholder="输入名拼音"
                    :border="false"
                    maxlength=50
                    label="名"
                    v-model='form.firstName')
        van-field.bp-field.num(
            placeholder="请输入证件号码"
            maxlength=18
            clearable
            @input="identifyCodeInput"
            v-model='form.identifyCode'
            label='证件号码')
        van-cell.address
            .label(slot="title") 住
                span 隐藏
                | 址
            van-field.bp-field(
                placeholder="请输入住址"
                type='textarea'
                clearable
                maxlength=255
                :border="false"
                v-model='form.identifyAddress')
        van-field.bp-field.num(
            placeholder="本人大陆银行卡"
            type='tel'
            id="reftest"
            clearable
            maxlength=23
            ref="bankCardRef"
            v-model='bankCard'
            label='银行卡号')
            yx-upload-img(slot="button" v-model='bankCardPath' uploadTitle="请选择识别银行卡号的方式")
                span.iconfont.icon-camera.text-color3
        van-field.bp-field.num(
            placeholder="请输入银行卡预留手机号码"
            type='tel'
            v-show="errorPhone"
            clearable
            maxlength=11
            v-model='form.bankMobile'
            label='手机号码')
        p.p-tips.text-color5 银行卡号限大陆银联借记卡，仅用于身份验证，与出入金无关，友信智投将对您的信息严格加密
    van-button(
        size="large"
        :disabled="disabled"
        @click="submitHandler"
        type="primary"
        class="bottom-button"
        slot="bottom"
    ) 下一步:职业信息
</template>

<script>
import idcard from './idcard.vue'
import { mapGetters, createNamespacedHelpers } from 'vuex'
const { mapMutations, mapActions } = createNamespacedHelpers('apply')
import imgPreview from '@/components/img-preview/'
export default {
    mixins: [require('../../mixins/mix-router.js').default],
    data() {
        return {
            idFrontPath: '',
            idBackPath: '',
            bankCardPath: '',
            errorPhone: false,
            submitTime: 0,
            form: {
                bankCard: '',
                bankMobile: '',
                firstName: '',
                identifyAddress: '',
                identifyCode: '',
                lastName: '',
                realName: ''
            }
        }
    },
    created() {
        this.initData()
    },
    beforeDestroy() {
        imgPreview('', false)
    },
    methods: {
        ...mapMutations(['initMutation']),
        ...mapActions(['getOpenAccountBasicInfo']),
        pinyinInput() {
            this.$set(
                this.form,
                'lastName',
                this.form.lastName.replace(/[^a-zA-Z]/g, '')
            )
            this.$set(
                this.form,
                'firstName',
                this.form.firstName.replace(/[^a-zA-Z]/g, '')
            )
        },
        imgPreview(url) {
            imgPreview(url)
        },
        identifyCodeInput() {
            let identifyCode = this.form.identifyCode.replace(
                /[\u4e00-\u9fa5a-wyzA-WYZ]/g,
                ''
            )
            identifyCode = identifyCode.replace(/x/g, 'X')
            this.$set(this.form, 'identifyCode', identifyCode)
        },
        async initData() {
            try {
                this.errorPhone = !!this.$LS.get(`${this.userId}-errorPhone`)
                this.form.bankMobile = this.user.phoneNumber
                this.idFrontPath = this['apply/basicInfo'].frontPath
                this.idBackPath = this['apply/basicInfo'].backPath
                for (let key in this.form) {
                    this['apply/basicInfo'][key] &&
                        this.$set(this.form, key, this['apply/basicInfo'][key])
                }
            } catch (e) {
                this.$toast(e.msg || '网络开小差了,请稍后重试')
            }
        },
        async submitHandler() {
            try {
                let bankCard = this.form.bankCard.replace(/ /g, '')
                if (
                    !this.$reg.idcard(this.form.identifyCode, true) ||
                    !this.$reg.bankcode(bankCard, true) ||
                    !this.$reg.letter(
                        this.form.lastName,
                        true,
                        '输入的姓拼音格式错误'
                    ) ||
                    !this.$reg.letter(
                        this.form.firstName,
                        true,
                        '输入的名拼音格式错误'
                    ) ||
                    !this.$reg.mobile(this.form.bankMobile, true)
                ) {
                    return
                }
                this.form.bankCard = bankCard
                this.$loading('信息校验中···')
                await this.$accountService.checkfourElement(this.form)
                await this.getOpenAccountBasicInfo()
                this.goApplyStep()
                this.$close()
            } catch (e) {
                if (e.code === 310406 && this.submitTime === 0) {
                    this.submitTime++
                    this.$set(this.form, 'bankMobile', '')
                }
                this.errorPhone = true
                this.$LS.put(`${this.userId}-errorPhone`, true)
                await this.$alert({
                    message: e.msg || '网络开小差了,请稍后重试',
                    confirmButtonText: '我知道了'
                })
                this.$close()
            }
        }
    },
    watch: {
        bankCard() {
            this.$nextTick(() => {
                let input = document.getElementById('reftest')
                input.focus()
                setTimeout(() => {
                    input.setSelectionRange(
                        this.bankCard.length,
                        this.bankCard.length
                    ) // 选择特定部分
                }, 0)
            })
        },
        async bankCardPath(val) {
            if (val) {
                try {
                    this.$loading('识别中···')
                    let { bankCard } = await this.$accountService.ocrBankCard(
                        val
                    )
                    this.$set(this.form, 'bankCard', bankCard)
                    this.$close()
                } catch (e) {
                    await this.$toast(e.msg || '网络开小差了,请稍后重试')
                }
            }
        }
    },
    computed: {
        bankCard: {
            get() {
                const bankCard =
                    this.form.bankCard &&
                    this.form.bankCard
                        .replace(/\D/g, '')
                        .match(/\d{1,4}/g)
                        .join(' ')
                return bankCard
            },
            set(val) {
                this.$set(this.form, 'bankCard', val.replace(/ /g, ''))
            }
        },
        ...mapGetters(['apply/init', 'user', 'apply/basicInfo']),
        idcard() {
            return (this['apply/init'] && this['apply/init'].idcard) || {}
        },
        // 按钮是否可用
        disabled() {
            return Object.values(this.form).some(item => !item)
        }
    },
    components: {
        idcard
    }
}
</script>

<style lang="scss">
.personal-container {
    .idcard-container {
        .pingyin {
            .flex {
                .van-cell__title {
                    width: 20px !important;
                    padding-left: 3px;
                    padding-right: 20px;
                }
                .van-field__body {
                    padding-right: 15px;
                }
                .bp-field.english {
                    input.van-field__control {
                        font-size: 16px;
                    }
                }
            }
        }
        .bp-field.num {
            input.van-field__control {
                font-size: 16px;
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
.personal-container {
    .idcard-container {
        padding: $global-padding;
        .p-tips {
            font-size: 12px;
            padding-top: 10px;
        }
        .van-cell {
            padding: 10px 15px 10px 0;
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
    .p-tips {
        font-size: 12px;
    }
}
</style>
