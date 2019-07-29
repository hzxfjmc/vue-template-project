<template lang="pug">
    .video-wrap
        p.title {{$t('index.videoTitle')}}
        video(
        src="https://hq-prod-news-server-1257884527.cos.ap-chengdu.myqcloud.com/video/%E7%AC%AC3%E9%9B%86%E6%9C%80%E7%BB%88%E7%89%88%E5%B0%8F.mp4"
        controls="controls"
        poster="@/assets/img/marketing/quotes/video-poster.jpg"
        controlslist="nodownload nofullscreen"
        @playing="viewVideo"
        )
</template>
<script>
import { webViewClick } from '@/utils/burying-point'
export default {
    methods: {
        viewVideo() {
            webViewClick('myquote', 'video', '点击视频')
        }
    }
}
</script>
<style lang="scss" scoped>
.video-wrap {
    margin-top: 30px;
    .title {
        text-align: center;
        margin-bottom: 10px;
        font-size: 16px;
        color: $hk-text-color;
    }
    video {
        width: 100%;
        height: 160px;
    }
}
</style>
