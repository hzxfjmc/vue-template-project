<template lang="pug">
.upload-img(@click='appUploadFile(method, isYouxinApp, uploadTitle)')
    input(
        name="image"
        accept="image/*"
        type='file'
        v-show="!isYouxinApp"
        ref='fileSelector'
        @change='webUploadFile'
        )
    slot
</template>

<script>
import uploadFileMx from './upload-file.js'
export default {
    mixins: [uploadFileMx],
    props: {
        value: {
            type: String,
            default: ''
        },
        method: {
            type: String,
            default: 'get_image_from_camera_or_album'
        },
        uploadTitle: {
            type: String,
            default: '请选择图片上传方式'
        }
    },
    created() {
        // alert(navigator.userAgent)
    },
    computed: {
        // 当是在盈立啊app中的时候
        isYouxinApp() {
            return this.$jsBridge.isYouxinApp
        },
        imgUrl: {
            get() {
                return this.value
            },
            set(val) {
                this.$emit('add-image', val)
                this.$emit('input', val)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.upload-img {
    position: relative;
    input {
        height: 100%;
        width: 100%;
        position: absolute;
        opacity: 0;
    }
}
</style>
