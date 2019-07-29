<template lang="pug">
    yx-container-better.add-addr-prove
        .add-addr-prove-content(slot="main")
            h1.title {{$t('adressInfo')}}
            yx-hk-field.field-name(
                v-model="address"
                maxlength=255
                :placeholder="$t('adressInfo')"
                clearable
            )
            h2.address-prove-title {{$t('adressProve')}}
            p.address-prove-content {{$t('addressMsg')}}
                span.check-example(@click="imgPreview(exampleImage)") 查看示例
            yx-upload-img.upload-padding(v-model="addressImage")
                uploadCertification(
                :idCardImage="addressImage"
                :uploadText="$t('uploadMsg')"
                :wrapHeight="163"
                :imageWidth="347"
                :imageHeight="163"
                )
        van-button.bottom-button(
            slot="bottom"
            size="large"
            :disabled="disabled"
            type="primary"
            @click="submitHandle") {{$t('submitAddress')}}
</template>

<script>
import imgPreview from '@/components/img-preview/'
import uploadCertification from '@/pages/open-account-hk/apply/biz-components/upload-certification/index.vue'
import {
    addHkProofOfAddress,
    getHKIdentifyInfo
} from '@/service/user-account-server-hk.js'
import { Button } from 'vant'
import { isYouxinApp } from '@/utils/html-utils.js'
export default {
    name: 'add-addr-prove',
    i18n: {
        zhCHS: {
            adressInfo: '通讯地址',
            adressProve: '补充该地址的证明',
            addressMsg:
                '通讯地址的有效证明，例如水电费账单、手机账单、银行月结单等，需要包含姓名、地址和日期',
            uploadMsg: '点击上传通讯地址',
            submitAddress: '提交'
        },
        zhCHT: {
            adressInfo: '通訊地址',
            adressProve: '補充該地址的證明',
            addressMsg:
                '通訊地址的有效證明，例如水電費賬單、手機賬單、銀行月結單等，需要包含姓名、地址和日期',
            uploadMsg: '點擊上傳通訊地址',
            submitAddress: '提交'
        },
        en: {
            adressInfo: 'Home Address',
            adressProve: 'Residential Address Proof',
            addressMsg:
                'Proof of Residential Address with name, address and date. Such as utility bill, phone statement...',
            uploadMsg: 'Upload Residential Address Proof',
            submitAddress: 'Submit'
        }
    },
    components: {
        uploadCertification,
        [Button.name]: Button
    },
    computed: {
        disabled() {
            return [this.address, this.addressImage].some(item => !item)
        }
    },
    data() {
        return {
            address: '',
            addressImage: '',
            exampleImage: `${window.location.origin}/webapp/open-account-hk/apply/example.png`
        }
    },
    async created() {
        try {
            let { contactAddress, proofOfAddress } = await getHKIdentifyInfo()
            this.address = contactAddress || ''
            this.addressImage = proofOfAddress || ''
        } catch (e) {
            this.$toast(e.msg || '网络开小差了,请稍后重试')
        }
    },
    methods: {
        imgPreview(url) {
            imgPreview(url)
        },
        async submitHandle() {
            let { address, addressImage } = this
            let params = {
                contactAddress: address,
                proofOfAddress: addressImage
            }
            try {
                await addHkProofOfAddress(params)
                if (isYouxinApp) {
                    this.$jsBridge.callApp('command_close_webview')
                } else {
                    this.$router.push({ name: 'home' })
                }
            } catch (e) {
                this.$toast(e.msg || '网络开小差了,请稍后重试')
            }
        }
    }
}
</script>

<style scoped lang="scss">
.add-addr-prove {
    .add-addr-prove-content {
        padding: $global-padding;
        font-family: PingFangHK-Regular;
        .title {
            padding-top: 46px;
            font-size: 28px;
            font-family: PingFangHK-Medium;
            font-weight: 500;
            color: rgba(57, 57, 57, 1);
            line-height: 40px;
        }
        .field-name {
            font-size: 16px;
            font-weight: 400;
            color: rgba(57, 57, 57, 1);
            line-height: 22px;
        }
        .address-prove-title {
            padding-top: 14px;
            font-size: 20px;
            font-weight: 400;
            color: rgba(57, 57, 57, 1);
            line-height: 28px;
        }
        .address-prove-content {
            padding-top: 6px;
            font-size: 14px;
            font-weight: 400;
            color: rgba(57, 57, 57, 0.4);
            line-height: 20px;
            .check-example {
                padding-left: 5px;
                color: $hk-primary-color;
            }
        }
        .upload-padding {
            padding-top: 14px;
        }
    }
}
</style>
