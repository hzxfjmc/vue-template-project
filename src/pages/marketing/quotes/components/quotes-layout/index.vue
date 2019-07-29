<template lang="pug">
    yx-container.quotes-layout
        <!--header.header(slot="top")-->
            <!--i.iconfont.icon-back_ios(@click="back")-->
            <!--span {{title}}-->
        header.header(slot="top")
        slot(name="main" slot="main")
        slot(name="bottom" slot="bottom")
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: ''
        }
    },
    methods: {
        back() {
            this.$jsBridge.callApp('command_go_back')
        }
    }
}
</script>

<style lang="scss" scoped>
.quotes-layout {
    .header {
        height: 15px;
    }
    /*.header {
        position: relative;
        height: 45px;
        line-height: 45px;
        background-color: #fff;
        padding: 0 $global-padding;
        i {
            font-size: 20px;
            position: absolute;
            left: 5px;
        }
        font-size: 16px;
        text-align: center;
        color: #0a0f19;
    }*/
}
</style>
