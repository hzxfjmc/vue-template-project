<template lang="pug">
  yx-container#app
    van-notice-bar(
        slot="top"
        v-if="tip"
        :scrollable="false" 
        mode="closeable"
        wrapable
    ) {{tip}}
    keep-alive(slot="main")
        router-view
</template>

<script>
import { NoticeBar } from 'vant'
export default {
    data() {
        return {
            tip: ''
        }
    },
    components: {
        [NoticeBar.name]: NoticeBar
    },
    created() {
        this.$bus.$on('add-tip', tip => {
            this.tip = tip
        })
    }
}
</script>

<style lang="scss">
@import '../../../../src/assets/styles/global.scss';
@import '../../../../src/assets/styles/common.scss';
@import '../../../../src/assets/styles/vant-reset.scss';
body {
    font-family: PingFangSC-Regular;
    .van-notice-bar {
        color: #fff;
        background-color: rgba(1, 33, 220, 0.4);
    }
}
</style>
