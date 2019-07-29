<template lang="pug">
    #app(v-if="data")
        .main(ref="scrollEl")
            general-news(v-if="newsType === 'general'" :data="data" :share-data="shareData")
            required-news(v-if="newsType === 'required'" :data="data" :share-data="shareData")
        download-item
</template>

<script>
import { Toast } from 'vant'
import { getUrlParam } from '../0-utils'
import { getNewsDetail } from '../0-service/market'
import { buringNewsToEnd } from './utils/burying-point'
import GeneralNews from './components/general-news'
import RequiredNews from './components/required-news'
import NewsShare from './components/news-share'
import DownloadItem from './components/download-item'
import { wechatShare } from '@/utils/share/wechat.js'
import config from '../0-config'

export default {
    name: 'App',
    components: {
        GeneralNews,
        RequiredNews,
        NewsShare,
        DownloadItem
    },
    data() {
        return {
            data: null, // 文章数据
            shareData: null, // 分享数据
            newsType: null // general-普通资讯，required-必读资讯
        }
    },
    async mounted() {
        await this.init()
        buringNewsToEnd.call(this, this.$refs.scrollEl)
    },
    methods: {
        // 获取文章详情
        async init() {
            // 注册方法给app
            window.getPublishTime = function() {
                return ''
            }
            try {
                const data = await getNewsDetail({
                    newsid: getUrlParam('newsid')
                })
                // 注册方法返回发布时间给app
                window.getPublishTime = function() {
                    return data.release_time
                }
                this.data = data
                let contentKey
                if ([1, 2, 3, 4].includes(data.daily_type)) {
                    this.newsType = 'required'
                    contentKey = 'html_content'
                } else {
                    this.newsType = 'general'
                    contentKey = 'content'
                }
                const description = data[contentKey]
                    .replace(/<[^>]+>/g, '')
                    .replace(/\s/g, '')
                    .substr(0, 80)

                // 分享数据
                this.shareData = {
                    title: data.title,
                    description: description,
                    thumbUrl: this.$root.logoUrl
                }

                // 微信内部分享
                if (config.isWechat) {
                    wechatShare({
                        title: data.title,
                        desc: description,
                        link: location.href,
                        imgUrl: this.$root.logoUrl
                    })
                }
            } catch (e) {
                Toast(e.msg || this.$t('errorTips'))
            }
        }
    }
}
</script>

<style lang="scss" scoped>
#app {
    display: flex;
    flex-direction: column;
    letter-spacing: 0.5px;
}
.main {
    flex: 1;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
}
</style>
