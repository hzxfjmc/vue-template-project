<template lang="pug">
yx-container-better.id-card
    open-process(
        :process="10"
        slot="top"
    )
    .idcard-container(slot="main")
        .ic-title 请上传本人中国大陆身份证
        .ic-content.text-color5 身份证是开户的必要资料，您的身份信息仅用于开户，并受到严格加密保护
        .upload-idcard.flex
            yx-upload-img(v-model='idFrontPath' method="get_idcard_image_side_front")
                UploadIdcard(:upImg='basicInfo.frontPath')
            yx-upload-img(v-model='idBackPath' method="get_idcard_image_side_back")
                UploadIdcard(:upImg='basicInfo.backPath' text="国徽" src="/webapp/open-account/open-account/idcard/card-behind.png")
        .ic-tips.text-color5
            .ic-t 拍摄要求
            .ic-p 1、头像和文字清晰，无明显反光
            .ic-p 2、身份证的四角和边框都在拍摄区域内
        Example
    van-button(
        slot="bottom"
        size="large"
        :disabled="!(basicInfo.frontPath && basicInfo.backPath)"
        @click="submitHandler"
        type="primary"
        class="bottom-button"
    ) 下一步
</template>

<script>
import UploadIdcard from '@/pages/open-account/apply/biz-components/upload-idcard/Index.vue'
import Example from './Example.vue'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('apply')
export default {
    mixins: [require('../../mixins/mix-router.js').default],
    data() {
        return {
            idFrontPath: '',
            idBackPath: ''
        }
    },
    components: {
        UploadIdcard,
        Example
    },
    computed: {
        ...mapGetters(['basicInfo'])
    },
    methods: {
        async submitHandler() {
            try {
                await this.$accountService.finishedIdCardUpload()
                this.goApplyStep()
            } catch (e) {
                this.$toast(e.msg || '未知')
            }
        },
        async ocrIdCard(url, idSide) {
            try {
                this.$loading('识别中...')
                let idcard = await this.$accountService.ocrIdCard(url)
                if (idSide === idcard.idSide) {
                    this.setBasicInfo(idcard) // 刷新数据持久化
                } else {
                    this.$alert(
                        idSide === 0 ? '请上传身份证正面' : '请上传身份证反面'
                    )
                }
            } catch (e) {
                await this.$alert(e.msg || JSON.stringify(e))
            } finally {
                this.$close()
            }
        }
    },
    watch: {
        // 图片上传组件需要单独提出来 TODO
        async idFrontPath(val) {
            if (val) {
                try {
                    await this.ocrIdCard(val, 0)
                } catch (e) {
                    this.idFrontPath = ''
                    this.$alert({
                        message: e.msg || '网络开小差了,请稍后重试',
                        confirmButtonText: '我知道了'
                    })
                }
            }
        },
        async idBackPath(val) {
            if (val) {
                try {
                    await this.ocrIdCard(val, 1)
                } catch (e) {
                    this.idBackPath = ''
                    this.$alert({
                        message: e.msg || '网络开小差了,请稍后重试',
                        confirmButtonText: '我知道了'
                    })
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.idcard-container {
    padding: $global-padding;
    .upload-idcard {
        padding: 14px 0 40px;
    }
    .ic-title {
        font-size: 18px;
        font-weight: 500;
        padding-bottom: 6px;
    }
    .ic-tips {
        line-height: 26px;
        .ic-p {
            font-size: 12px;
        }
    }
}
</style>
