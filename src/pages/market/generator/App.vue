<template lang="pug">
    #app
        template(v-for="item in list")
            video-item(v-if="item.type === '1'" :src="item.videoUrl" :poster="item.poster")
            rich-text(v-if="item.type === '2'" :html-text="item.htmlContent")
            kindly-reminder(v-if="item.type === '3'" :html-text="item.noticeContent")
            feedback-item(v-if="item.type === '4'")
</template>

<script>
import FeedbackItem from './components/feedback-item'
import VideoItem from './components/video-item'
import KindlyReminder from './components/kindly-reminder'
import RichText from './components/rich-text'
import { setTitle } from '@/utils/html-utils'
import { getGenerator } from '../0-service/market'
import { getUrlParam } from '../0-utils'
import { Toast } from 'vant'

export default {
    name: 'App',
    components: {
        FeedbackItem,
        VideoItem,
        KindlyReminder,
        RichText
    },
    data() {
        return {
            list: []
        }
    },
    created() {
        this.init()
    },
    methods: {
        async init() {
            try {
                const data = await getGenerator({
                    id: getUrlParam('id') || '',
                    key: getUrlParam('key') || '' // 有则优先查key
                })
                setTitle(data.title)
                this.list = JSON.parse(data.content)
            } catch (e) {
                Toast(e.msg || this.$t('errorTips'))
            }
        }
    }
}
</script>

<style lang="scss" scoped>
#app {
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    padding-top: 1px;
    transition: all 2s;
}
</style>
