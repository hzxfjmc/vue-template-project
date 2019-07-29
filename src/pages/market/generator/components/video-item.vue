<template lang="pug">
    .video-item
        .video(ref="video")
</template>
<script>
import ChimeeMobilePlayer from 'chimee-mobile-player'
import 'chimee-mobile-player/lib/chimee-mobile-player.browser.css'

export default {
    name: 'video-item',
    props: {
        src: {
            type: String,
            required: true
        },
        poster: {
            type: String,
            default: ''
        }
    },
    mounted() {
        new ChimeeMobilePlayer({
            wrapper: this.$refs.video,
            src: this.src,
            poster: this.poster,
            preload: true,
            controls: true,
            playsInline: true, // IOS微信浏览器支持小窗内播放
            x5VideoPlayerFullscreen: true, // 全屏设置，设置为 true 是防止横屏
            xWebkitAirplay: true // 支持ios的AirPlay功能
        })
        // 移动端的video需要用户的真实操作才会加载
        // player.on('loadeddata', ev => {
        //     // 获取封面图片
        //     const video = ev.target
        //     const scale = 0.8
        //     let canvas = document.createElement('canvas')
        //     canvas.width = video.videoWidth * scale
        //     canvas.height = video.videoHeight * scale
        //     canvas
        //         .getContext('2d')
        //         .drawImage(video, 0, 0, canvas.width, canvas.height)
        //     // const src = canvas.toDataURL('image/png')
        //     document.body.appendChild(canvas)
        // })
    }
}
</script>

<style lang="scss" scoped>
.video {
    position: relative;
    background: #000;
    height: 211px;
}
</style>

<style>
/*进度条颜色*/
:root {
    --barColor: #fd2140;
}
</style>
