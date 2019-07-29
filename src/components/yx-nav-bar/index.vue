<template lang="pug">
    .van-nav-bar-wrap
        van-nav-bar(
           :title='title',
           class='yx-nav'
        )
            .bar-letf-icon(
                slot='left'
                class="colorBlack"
                )
                van-icon(
                    v-if="back"
                    name="arrow-left"
                    @click='backHandler')
                van-icon(
                    v-if="close"
                    name="cross"
                    @click='completeHandler')
            .bar-right-slot(slot='right')
                slot(name="icon")
 </template>

<script>
import { NavBar, Icon } from 'vant'
import jsBridge from '@/utils/js-bridge.js'
export default {
    props: {
        title: {
            type: String,
            default: ''
        },
        close: {
            type: Boolean,
            default: true
        },
        back: {
            type: Boolean,
            default: true
        },
        backClickHandler: {
            type: Function,
            default: null
        },
        closeClickHandler: {
            type: Function,
            default: null
        }
    },
    data() {
        return {
            showExit: false
        }
    },
    components: {
        [NavBar.name]: NavBar,
        [Icon.name]: Icon
    },
    methods: {
        completeHandler() {
            if (this.closeClickHandler) {
                this.closeClickHandler()
            } else {
                jsBridge.callApp('command_close_webview')
            }
        },
        backHandler() {
            if (this.backClickHandler) {
                this.backClickHandler()
            } else {
                jsBridge.callApp('command_go_back')
            }
        }
    }
}
</script>

<style lang="less">
.yx-nav.van-hairline--bottom::after {
    border-bottom-width: 0;
}
</style>

<style scoped lang="scss">
.yx-nav {
    background: #fff;
    color: $hk-text-color;
}
.colorBlack .van-icon {
    color: $hk-text-color;
    font-size: 0.4rem;
    margin-right: 10px;
}
.yx-nav .van-nav-bar__title {
    color: $hk-text-color;
}
</style>
