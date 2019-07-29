<template lang="pug">
    .yx-audio(v-show="show")
        .audio-button(:class="{cue: !paused}" @click="toggle")
        .audio-progress-wrap
            slider-item(v-model="rate" @pullstart="isPulling = true" @pull="currTime = duration * $event" @pullend="seek")
            p.audio-time
                span {{ currTime | formatTime }}
                span {{ duration | formatTime }}
        audio(
            ref="audio"
            :src="src"
            @loadeddata="onLoadeddata"
            @play="paused = false"
            @pause="paused = true"
            @timeupdate="onTimeupdate"
            @ended="$refs.audio.currentTime = 0"
        )
</template>

<script>
import sliderItem from './slider-item'

// 音频组件
export default {
    name: 'yxAudio',

    props: {
        // 音频链接
        src: String
    },

    data() {
        return {
            show: false,
            paused: true,
            currTime: 0,
            duration: 0,
            rate: 0,
            isPulling: false
        }
    },

    methods: {
        toggle() {
            if (this.$refs.audio.paused) {
                this.$refs.audio.play()
            } else {
                this.$refs.audio.pause()
            }
        },
        onLoadeddata(ev) {
            this.duration = ev.target.duration
            this.show = true
        },
        onTimeupdate(ev) {
            if (!this.isPulling) {
                this.currTime =
                    ev.target.currentTime > this.duration
                        ? this.duration
                        : ev.target.currentTime
                let rate = this.duration ? this.currTime / this.duration : 0
                this.rate = rate > 1 ? 1 : rate
            }
        },
        seek(rate) {
            this.isPulling = false
            this.currTime = this.duration * rate
            this.$refs.audio.currentTime = this.currTime
            if (rate === 1) {
                this.$refs.audio.pause()
            } else {
                this.$refs.audio.play()
            }
        }
    },

    filters: {
        // 格式化时间
        formatTime(time) {
            time = Math.floor(time)
            let m = Math.floor(time / 60)
            let s = time % 60
            if (m >= 60) {
                const h = Math.floor(m / 60)
                m = m % 60
                m = m >= 10 ? m : '0' + m
                m = h + ':' + m
            } else {
                m = m >= 10 ? m : '0' + m
            }
            s = s >= 10 ? s : '0' + s
            return m + ':' + s
        }
    },
    components: {
        sliderItem
    }
}
</script>

<style lang="less" scoped>
.yx-audio {
    position: relative;
    padding: 21px 17px 0 67px;
    border: 1px solid #c3c5ca;
    height: 54px;
    box-sizing: border-box;
    border-radius: 27px;
}
.audio-button {
    position: absolute;
    left: 13px;
    top: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 42px;
    height: 42px;
    background: linear-gradient(#6b9cde, #93c1f0);
    border-radius: 50%;
    &:after {
        content: '';
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 8px 0 8px 14px;
        border-color: transparent transparent transparent #fff;
        margin-left: 5px;
    }
    &.cue:after {
        width: 15px;
        height: 15px;
        border: none;
        background: #fff;
        border-radius: 2px;
        margin-left: 0;
    }
}
.audio-time {
    display: flex;
    justify-content: space-between;
    margin-top: 6px;
    span {
        color: #aaaab4;
        font-size: 12px;
    }
}
</style>
