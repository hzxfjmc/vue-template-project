<template lang="pug">
    van-nav-bar(
       :title='title',
       class='yx-nav'
    )  
        span(slot='left' class="colorBlack")  
           van-icon(name="arrow-left" @click='backHandler')
        span(slot='right' v-if='rightShow')
            slot(name="icon") 
 </template>

<script>
import { NavBar, Icon } from 'vant'
import jsBridge from '@/utils/js-bridge.js'
export default {
    props: {
        rightShow: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ''
        },
        yRouter: {
            type: String,
            default: ''
        }
    },
    components: {
        [NavBar.name]: NavBar,
        [Icon.name]: Icon
    },
    created() {
        console.log('this.yRouter' + this.yRouter)
    },
    methods: {
        backHandler() {
            if (this.yRouter === 'command_close_webview') {
                jsBridge.callApp('command_close_webview')
            } else {
                jsBridge.callApp('command_go_back')
            }
        }
    }
}
</script>

<style scoped lang="scss">
.yx-nav {
    background: #000;
    color: #eee;
}
.colorBlack .van-icon {
    color: #eeeeee;
    font-size: 0.3rem;
    margin-right: 10px;
}
.yx-nav .van-nav-bar__title {
    color: #eee;
}
</style>
