<template lang="pug">
.idcard-upload-container
    .idcard-exist(v-if='upImg')
        .back-img(@click.stop="imgPreview(showImg)")
            .exist-img(:style="`background-image: url(${showImg});`" )
        .bottom-text.text-color 点击重新上传
    .idcard-upload(v-else)
        .back-img(:style="`background-image: url(${src});`")
            img(src="/webapp/open-account/open-account/idcard/add.png")
        .bottom-text.text-color7 点击上传身份证-{{text}}面
</template>

<script>
import imgPreview from '@/components/img-preview/'
import { getCosUrl } from '@/utils/cos-utils'
export default {
    props: {
        upImg: {
            type: String,
            default: ''
        },
        src: {
            type: String,
            default: '/webapp/open-account/open-account/idcard/card-front.png'
        },
        text: {
            type: String,
            default: '人像'
        }
    },
    data() {
        return {
            showImg: ''
        }
    },
    watch: {
        upImg: {
            handler: 'initImg',
            immediate: true
        }
    },
    methods: {
        async initImg(val) {
            this.showImg = await getCosUrl(val)
        },
        getCosUrl(url) {
            return getCosUrl(url)
        },
        imgPreview(url) {
            imgPreview(url)
        }
    }
}
</script>

<style lang="scss" scoped>
.idcard-upload-container {
    .idcard-exist {
        width: 167px;
        height: 117px;
        .exist-img {
            position: absolute;
            z-index: 100;
        }
        .exist-img,
        .back-img {
            width: 167px;
            height: 90px;
            background-position: center;
            background-size: cover;
            background-repeat: no-repeat;
        }
        .bottom-text {
            background-color: #d5e5fd;
            text-align: center;
            height: 27px;
            font-size: 12px;
            line-height: 27px;
            z-index: 100;
        }
        .ip-tips {
            position: absolute;
            transform: rotate(-15deg);
            color: #fff;
            height: 24px;
            width: 150px;
            border: 1px solid #fff;
            line-height: 24px;
            top: 40px;
            font-size: 0.28rem;
            left: 10px;
        }
    }
    .idcard-upload {
        background-color: #f1f3f8;
        width: 167px;
        height: 117px;
        padding: 9px 19px 0;
        .back-img {
            background-position: center;
            background-size: contain;
            background-repeat: no-repeat;
            width: 100%;
            height: 79px;
            display: flex;
            justify-content: center;
            align-items: center;
            img {
                width: 34px;
            }
        }
        .bottom-text {
            font-size: 0.2rem;
            line-height: 0.6rem;
            text-align: center;
        }
    }
}
</style>
