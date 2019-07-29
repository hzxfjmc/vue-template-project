<template lang="pug">
    .download-item(v-if="show")
        img.logo(:src="$root.logoUrl")
        p {{ $t('uSmart') }}
        p {{ $t('slogan') }}
        button(type="button" @click="download") {{ $t('download') }}
</template>

<script>
import JSBridge from '@/utils/js-bridge'

export default {
    name: 'yxDownload',

    data() {
        return {
            show: !JSBridge.isYouxinApp
        }
    },

    methods: {
        download() {
            location.href = `http://www.yxzq.com/download.html?appType=${this.$root.appType}`
        }
    }
}
</script>

<style lang="less" scoped>
.download-item {
    position: relative;
    border-radius: 6px 6px 0 0;
    background: #ebeef7;
    padding: 17px 100px 17px 79px;
    .logo {
        position: absolute;
        left: 20px;
        top: 17px;
        width: 46px;
        height: 46px;
        background: #f5f5f5;
    }
    > p {
        line-height: 23px;
    }
    button {
        position: absolute;
        right: 15px;
        top: 19px;
        width: 96px;
        height: 42px;
        font-size: 16px;
        background: #3c78fa;
        border-radius: 4px;
        outline: none;
        border: none;
        color: #fff;
    }
}
</style>
