<template lang="pug">
    .scroll-container
        .load-more-tip(v-show="topLoading") 正在加载...
        slot
        .load-more-tip(v-show="bottomLoading") {{bottomText}}
</template>

<script>
/**
 * 页面滚动监听器
 */
let scrollHandler = (vm, delay = 600) => {
    let timer
    let old_scroll_top = 0
    const opts = {}
    const el = document.documentElement
    const scrollCenter = () => {
        el.scrollTop = (el.scrollHeight - el.offsetHeight) / 2
    }
    const fn = () => {
        clearTimeout(timer)
        opts.scrollTop = el.scrollTop
        opts.scrollCenter = scrollCenter
        vm.$emit('should-load-more', opts)
        timer = setTimeout(() => {
            opts.scrollTop = el.scrollTop

            if (opts.direction === 'bottom') {
                // 向下滚动
                vm.$emit('scroll-bottom', opts)
            } else if (opts.direction === 'top') {
                // 向上滚动
                vm.$emit('scroll-top', opts)
            }
        }, delay)
    }

    return () => {
        const load_refer_bottom = 0.8 * el.scrollHeight // 底部开始加载距离
        const load_refer_top = el.scrollHeight - load_refer_bottom // 顶部开始加载距离

        if (
            el.scrollTop > old_scroll_top &&
            el.scrollTop + el.offsetHeight > load_refer_bottom
        ) {
            // 向下滚动
            opts.direction = 'bottom'
            fn()
        } else if (el.scrollTop < load_refer_top) {
            // 向上滚动
            opts.direction = 'top'
            fn()
        }
        old_scroll_top = el.scrollTop
    }
}

export default {
    name: 'scroll-container',
    props: {
        topLoading: {
            type: Boolean,
            default: false
        },
        bottomLoading: {
            type: Boolean,
            default: false
        },
        bottomText: {
            type: String,
            default: '正在加载...'
        }
    },
    mounted() {
        scrollHandler = scrollHandler(this, 600)
        document.addEventListener('scroll', scrollHandler)
    },
    destroyed() {
        document.removeEventListener('scroll', scrollHandler)
    }
}
</script>

<style scoped lang="scss">
.load-more-tip {
    line-height: 40px;
    font-size: 12px;
    color: rgba(57, 57, 57, 0.6);
    background: #f8f8f8;
    text-align: center;
}
</style>
