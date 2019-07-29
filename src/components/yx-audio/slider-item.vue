<template lang="pug">
    .slider-item(ref="progress")
        p(:style="{width: value * 100 + '%'}")
            span(@touchstart="pullStart" @touchmove="pull" @touchend="pullend")
</template>

<script>
export default {
    name: 'yxSlider',

    model: {
        prop: 'value',
        event: 'pull'
    },

    props: {
        value: { default: 0 }
    },

    data() {
        return {
            start: 0,
            end: 0
        }
    },

    methods: {
        pullStart() {
            this.start = this.$refs.progress.offsetLeft
            this.end =
                this.$refs.progress.offsetLeft + this.$refs.progress.offsetWidth
            this.$emit('pullstart')
        },
        pull(ev) {
            const rate = this.getRate(ev)
            this.$emit('pull', rate)
        },
        pullend(ev) {
            const rate = this.getRate(ev)
            this.$emit('pull', rate)
            this.$emit('pullend', rate)
        },
        getRate(ev) {
            let rate =
                (ev.changedTouches[0].pageX - this.start) /
                (this.end - this.start)
            rate = rate > 1 ? 1 : rate
            rate = rate < 0 ? 0 : rate
            return rate
        }
    }
}
</script>

<style lang="less" scoped>
.slider-item {
    height: 3px;
    border-radius: 1.5px;
    background: #e1e1e1;
    p {
        position: relative;
        height: 100%;
        background: linear-gradient(#6b9cde, #93c1f0);
        border-radius: 3px;
        span {
            position: absolute;
            right: -4.5px;
            top: -3px;
            background: #6b9cde;
            border-radius: 50%;
            width: 9px;
            height: 9px;
        }
    }
}
</style>
