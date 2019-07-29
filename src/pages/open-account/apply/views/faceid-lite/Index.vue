<template lang="pug">
yx-container-better.faceid-lite
    open-process(:process="70" slot="top")
    .faceid-main(slot="main")
        .faceid-lite-container.flex-fixed-container
            .fl-title 开户即将完成，确认开户有效性
            .fl-content
                img(src="/webapp/open-account/open-account/face.png")
                p 请跟随完成指定动作
            p.re-face(@click="faceHandler" v-if="submited") 重新识别
    .face-lite-bottom(slot="bottom")
        .yx-company-provide(v-if="appType.Ch") 证券开户、交易服务由友信证券有限公司提供
        van-button(
            size="large"
            @click="submitHandler"
            type="primary"
            class="bottom-button" ) {{submitText}}
</template>

<script>
const ERROR_CODE = {
    BIZ_TOKEN_DENIED: '',
    ILLEGAL_PARAMETER: '传入的 biz_token 不符合要求',
    AUTHENTICATION_FAIL: '鉴权失败',
    MOBILE_PHONE_NOT_SUPPORT: '手机在不支持列表里',
    INVALID_BUNDLE_ID: '信息验证失败，请重启程序或设备后重试',
    NETWORK_ERROR: '连不上互联网，请连接上互联网后重试',
    USER_CANCEL: '操作取消',
    NO_CAMERA_PERMISSION: '没有打开相机的权限，请开启权限后重试',
    DEVICE_NOT_SUPPORT: '无法启动相机，请确认摄像头功能完好',
    FACE_INIT_FAIL: '无法启动人脸识别，请稍后重试',
    NO_WRITE_EXTERNAL_STORAGE_PERMISSION:
        '无法读取写SD卡的权限，请开启权限后重试',
    LIVENESS_FAILURE: '活体失败',
    LIVENESS_TIME_OUT: '操作超时'
}
import { appType } from '@/utils/html-utils.js'
import jsBridge from '@/utils/js-bridge.js'
import { getFaceIdLitToken } from '@/service/user-account-server-hk.js'
import { webViewClick, faceverify } from '@/utils/burying-point/index.js'
export default {
    mixins: [require('../../mixins/mix-router.js').default],
    data() {
        return {
            appType: appType
        }
    },
    computed: {
        submitText() {
            return this.submited ? '已完成，下一步' : '开始人脸识别'
        }
    },
    methods: {
        async faceHandler() {
            //uat 环境
            // if (this.$DOMAIN.IS_UAT) {
            //     try {
            //         await jsBridge.callApp('get_meglive_data', {
            //             idcard_name: '谢俊',
            //             idcard_number: '360721198910317217'
            //         })
            //     } finally {
            //         await this.$accountService.getFaceIdVerifyResultV2(
            //             1,
            //             2,
            //             3,
            //             4
            //         )
            //         this.goApplyStep('push')
            //     }
            //     return
            // }
            webViewClick('openverify6', 'verify', '点击活体识别')
            try {
                this.$loading('加载中...')
                let { token } = await getFaceIdLitToken()
                let data = await jsBridge.callApp('get_meglive_data', {
                    idcard_name: this.basicInfo.realName,
                    idcard_number: this.basicInfo.identifyCode,
                    biz_token: token
                })
                faceverify(true)
                let {
                    sign,
                    sign_version: signVersion,
                    biz_token: bizToken,
                    meglive_data: megliveData
                } = data
                await this.$accountService.getFaceIdVerifyResultV2(
                    bizToken,
                    megliveData,
                    sign,
                    signVersion
                )
                this.goApplyStep('push')
                this.$close()
            } catch (e) {
                faceverify(false)
                this.$close()
                e &&
                    e.msg &&
                    (await this.$alert(
                        '抱歉，验证未通过，请确保是开户<br>本人，并在光线良好的环境识别<br><br>如有疑问，请联系客服'
                    ))
                if (e && e.desc) {
                    if (typeof e.desc === 'string') {
                        this.$toast(e.desc)
                    } else {
                        e.desc.errorMessage &&
                            this.$toast(
                                ERROR_CODE[e.desc.errorMessage] || '认证失败'
                            )
                    }
                }
            }
        },
        async submitHandler() {
            if (!this.submited) {
                await this.faceHandler()
            } else {
                this.goApplyStep('push')
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.faceid-lite-container {
    padding: $global-padding;
    .fl-title {
        font-size: 18px;
        font-weight: 500;
        line-height: 22px;
    }
    .fl-content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding-top: 60px;
        img {
            width: 224px;
            height: 225px;
        }
        p {
            font-weight: 400;
            color: $text-color2;
            line-height: 22px;
            margin-top: 20px;
        }
    }
}
.re-face {
    padding-top: 85px;
    text-align: center;
    color: $text-color5;
    padding-bottom: 10px;
}
</style>
