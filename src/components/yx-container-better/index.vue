<template lang="pug">
.yx-container
    .yx-top
        slot(name="top")
    .yx-main(ref="yxWrapper")
        .better-wrap
            .slotWrapss
                slot(name="main")
            .yx-company-provide(v-if="isApplyActive") 证券开户、交易服务由友信证券有限公司提供
    .yx-bottom
        slot(name="bottom")
</template>

<style lang="scss" scoped>
.yx-container {
    display: flex;
    flex-direction: column;
    background-color: #fff;
    height: 100%;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    .yx-main {
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        flex: 1;
        height: 100%;
        .better-wrap {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
    }
}
</style>

<script>
import { isIOS, appType } from '@/utils/html-utils.js'
const projectPath = window.location.pathname
export default {
    async mounted() {
        this.isShowTip =
            projectPath.indexOf('apply') !== -1 &&
            this.$route.name !== 'faceid-lite' &&
            this.$route.name !== 'select-bank'
        // ios 才做滚动优化  安卓不需要这个
        if (isIOS) {
            let BScroll = await import('better-scroll')
            this.$nextTick(() => {
                new BScroll.default(this.$refs.yxWrapper, {
                    scrollY: true,
                    click: true
                })
            })
        }
    },
    data() {
        return {
            isShowTip: false,
            appType: appType
        }
    },
    computed: {
        isApplyActive() {
            return this.appType.Ch && this.isShowTip
        }
    }
}
</script>
