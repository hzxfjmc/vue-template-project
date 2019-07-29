<template lang="pug">
    .upload-img-box
        .img-label {{label}}
        yx-upload-img.img-content(v-model="file")
            .img-wrap
                span(v-if="!file") {{subLabel}}
                img(
                :src="url"
                v-else
                alt=""
                )
</template>
<script>
import { getCosUrl } from '@/utils/cos-utils.js'
export default {
    data: () => ({
        url: ''
    }),
    props: {
        value: {
            required: true
        },
        label: {
            type: String,
            default: '请上传'
        },
        subLabel: {
            type: String,
            default: '点击上传'
        }
    },
    computed: {
        file: {
            get() {
                return this.value
            },
            set(val) {
                this.initUrl(val)
                this.$emit('input', val)
            }
        }
    },
    methods: {
        async initUrl(url) {
            this.url = await getCosUrl(url)
        }
    }
}
</script>
<style lang="scss" scoped>
.upload-img-box {
    padding: 10px 15px;
    .img-label {
        color: rgba(53, 53, 71, 0.7);
    }
    .img-content {
        $height: 120px;
        $width: 200px;
        width: $width;
        .img-wrap {
            margin-top: 10px;
            width: $width;
            text-align: center;
            height: $height;
            line-height: $height;
            border: 1px dashed $border-color;
            img {
                height: $height - 2px;
                width: $width - 2px;
            }
            span {
                color: $sub-title;
            }
        }
    }
}
</style>
