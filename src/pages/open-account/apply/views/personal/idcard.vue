<template lang="pug">
.idcard-c
    .idcard-exist(@click="imgPreview(showImg)")
        .back-img(:style="`background-image: url(${showImg});`")
        .ip-tips 仅供友信智投开户使用
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
    watch: {
        upImg: {
            handler: 'initImg',
            immediate: true
        }
    },
    data() {
        return {
            showImg: ''
        }
    },
    methods: {
        async initImg(val) {
            this.showImg = await getCosUrl(val)
        },
        imgPreview(url) {
            imgPreview(url)
        }
    }
}
</script>

<style lang="scss" scoped>
.idcard-c {
    .idcard-exist {
        width: 167px;
        height: 90px;
        position: relative;
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
}
</style>
