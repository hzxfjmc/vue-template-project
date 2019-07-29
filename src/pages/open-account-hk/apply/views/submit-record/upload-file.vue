<template lang="pug">
    .upload-certification-wrap
        .upload-image-wrap.no-border(v-if="idCardImage" :class="[example?'example':'',exampleCls]")
            .iconfont.icon-error(
                v-if="!example && !isLog"
                @click.stop="deleteHandler"
            )
            .identify-img(@click.stop="imgPreview(showImg)")
                .uploaded-image(:style="`background-image: url(${showImg});`" )
        .upload-operate-warp(v-else )
             .upload-operate-icon
                van-icon.icon-plus(name="plus" color="rgba(1,33,220,1)")
             .upload-operate-click {{uploadText || $t('uploadText')}}
</template>

<script>
import { Icon, ImagePreview } from 'vant'
import { getCosUrl } from '@/utils/cos-utils'
export default {
    i18n: {
        zhCHS: {
            uploadText: '点击上传'
        },
        zhCHT: {
            uploadText: '點擊上傳'
        },
        en: {
            uploadText: 'Click to Upload'
        }
    },
    inheritAttrs: false,
    props: {
        isLog: {
            type: Boolean,
            default: false
        },
        example: {
            type: Boolean,
            default: false
        },
        exampleCls: {
            type: String,
            default: ''
        },
        index: {
            type: Number,
            default: 0
        },
        value: {
            type: String,
            default: ''
        },
        uploadText: {
            type: String,
            default: ''
        }
    },
    computed: {
        idCardImage: {
            get() {
                return this.value
            },
            set(val) {
                this.$emit('input', val)
            }
        }
    },
    data() {
        return {
            showImg: ''
        }
    },
    async created() {
        this.showImg =
            (this.idCardImage + '').indexOf('deposit-certificate') !== -1
                ? this.idCardImage
                : await getCosUrl(this.idCardImage)
    },
    components: { [Icon.name]: Icon },
    methods: {
        deleteHandler() {
            this.$emit('delete-img', this.index)
        },
        imgPreview(url) {
            ImagePreview([url])
        }
    }
}
</script>

<style scoped lang="scss">
.upload-certification-wrap {
    .upload-operate-warp,
    .upload-image-wrap {
        border-radius: 12px;
        height: 99px;
        border: 1px dashed rgba(1, 33, 220, 1);
    }
    .example {
        position: relative;
        overflow: hidden;
    }
    .example:before {
        width: 100px;
        height: 100px;
        font-size: 12px;
        padding-top: 3px;
        text-align: center;
        position: absolute;
        background-color: #fff;
        transform: rotate(-45deg);
        right: -60px;
        bottom: -60px;
        color: $hk-primary-color;
    }
    .example-s:before {
        content: '范本';
    }
    .example-hk:before {
        content: '範本';
    }
    .example-us:before {
        content: 'example';
    }
    .upload-operate-warp {
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
        position: relative;
        .iconfont.icon-error {
            position: absolute;
            font-size: 0.4rem;
            right: -10px;
            top: -15px;
            color: $hk-primary-color;
            z-index: 999;
        }
        .iconfont.icon-error::before {
            background-color: #fff;
            height: 10px;
            width: 10px;
            border-radius: 10px;
        }
        .identify-img {
            height: 99px;
            .uploaded-image {
                height: 99px;
                width: 100%;
                border-radius: 12px;
                z-index: 1;
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
    .no-border {
        border: none;
    }
}
</style>
