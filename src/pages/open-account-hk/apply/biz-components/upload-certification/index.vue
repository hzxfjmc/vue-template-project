<template lang="pug">
    .upload-certification-wrap
        .upload-image-wrap(v-if="idCardImage")
            .identify-img(@click.stop="imgPreview(showUrl)" :style="`height:${imageHeight}px`")
                .uploaded-image(:style="`background-image: url(${showUrl});height:${imageHeight}px`" )
                .only-open-account
                    .box {{$t('soleForOpenAccount')}}
            .again-upload-text {{$t('uploadAgain')}}
        .upload-operate-warp(v-else :style="`height: ${wrapHeight}px`")
             .upload-operate-icon
                van-icon.icon-plus(name="plus" color="rgba(1,33,220,1)")
             .upload-operate-click {{uploadText || $t('uploadText')}}
</template>

<script>
import imgPreview from '@/components/img-preview/'
import { getCosUrl } from '@/utils/cos-utils'
import { Icon } from 'vant'
export default {
    i18n: {
        zhCHS: {
            soleForOpenAccount: '仅供开户使用',
            uploadAgain: '重新上传',
            uploadText: '点击上传'
        },
        zhCHT: {
            soleForOpenAccount: '僅供開戶使用',
            uploadAgain: '重新上傳',
            uploadText: '點擊上傳'
        },
        en: {
            soleForOpenAccount: 'Solely for account opening',
            uploadAgain: 'Upload Again',
            uploadText: 'Click to Upload'
        }
    },
    inheritAttrs: false,
    props: {
        idCardImage: {
            type: String,
            default: ''
        },
        uploadText: {
            type: String,
            default: ''
        },
        wrapHeight: {
            type: Number,
            default: 163
        },
        imageHeight: {
            type: Number,
            default: 163
        }
    },
    data() {
        return {
            showUrl: ''
        }
    },
    components: { [Icon.name]: Icon },
    watch: {
        idCardImage: {
            async handler(val) {
                this.showUrl = await getCosUrl(val)
            },
            immediate: true
        }
    },
    methods: {
        imgPreview(url) {
            imgPreview(url)
        }
    }
}
</script>

<style scoped lang="scss">
.upload-certification-wrap {
    .upload-operate-warp {
        border-radius: 12px;
        border: 1px dashed rgba(1, 33, 220, 1);
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        .upload-operate-icon {
            font-size: 17px;
            width: 34px;
            height: 34px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 1);
            border: 1px solid rgba(1, 33, 220, 1);
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .upload-operate-click {
            padding-top: 10px;
            height: 20px;
            font-size: 14px;
            font-weight: 400;
            color: rgba(1, 33, 220, 1);
            font-family: PingFangHK-Regular;
            line-height: 20px;
            text-align: center;
        }
    }
    .upload-image-wrap {
        border-radius: 12px 12px 0px 0px;
        .identify-img {
            position: relative;
            .only-open-account {
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                .box {
                    line-height: 18px;
                    padding: 4px;
                    text-align: center;
                    font-size: 14px;
                    color: #fff;
                    border: 1px solid #fff;
                    z-index: 1000;
                    transform: rotate(-15deg);
                }
            }
            .uploaded-image {
                width: 100%;
                position: absolute;
                z-index: 100;
                background-position: center;
                background-size: cover;
                background-repeat: no-repeat;
            }
        }
        .again-upload-text {
            font-size: 14px;
            text-align: center;
            line-height: 35px;
            height: 35px;
            color: rgba(255, 255, 255, 1);
            background-color: rgba(1, 33, 220, 0.4546);
            border-radius: 0px 0px 10px 10px;
        }
    }
}
</style>
