<template lang="pug">
    .news-share(v-if="show")
        p — {{ $t('shareTo') }} —
        ul
            // 大陆版
            template(v-if="$root.isMainland")
                li
                    img(src="../../0-images/share-wechat.png" @click="share('wechat_friend')")
                li
                    img(src="../../0-images/share-friend.png" @click="share('wechat_friends_circle')")
                li
                    img(src="../../0-images/share-qq.png" @click="share('qq')")
                <!--li-->
                    <!--img(src="../../0-images/share-weibo.png" @click="share('weibo')")-->
            // 港版
            template(v-else)
                li
                    img(src="../../0-images/share-whats.png" @click="share('whatsapp')")
                li
                    img(src="../../0-images/share-facebook.png" @click="share('facebook')")
                li
                    img(src="../../0-images/share-wechat.png" @click="share('wechat_friend')")
                li
                    img(src="../../0-images/share-twitter.png" @click="share('twitter')")
</template>

<script>
import JSBridge from '@/utils/js-bridge'
import { Toast } from 'vant'

export default {
    name: 'news-share',
    props: {
        shareData: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            show: JSBridge.isYouxinApp
        }
    },
    mounted() {
        // 注册app调用h5的分享方法
        JSBridge.registerFn('callShare', data => {
            this.share(data.shareType)
        })
        // this.initMetas()
    },
    methods: {
        // initMetas() {
        //     const createMeta = options => {
        //         const meta = document.createElement('meta')
        //         if (options.property) {
        //             meta.setAttribute('property', options.property)
        //         }
        //         if (options.name) {
        //             meta.name = options.name
        //         }
        //         if (options.content) {
        //             meta.content = options.content
        //         }
        //         document.head.appendChild(meta)
        //     }
        //     const image = `https://m.usmartsecurities.com/webapp/market/images/logo-hk.png`
        //     // facebook
        //     createMeta({ property: 'og:type', content: 'website' })
        //     createMeta({ property: 'og:title', content: this.shareData.title })
        //     createMeta({ property: 'og:image', content: image })
        //     createMeta({ property: 'og:image:type', content: 'image/png' })
        //     createMeta({
        //         property: 'og:description',
        //         content: this.shareData.description.substr(0, 100)
        //     })
        //     // twitter
        //     createMeta({ name: 'twitter:site', content: '@uSMART' })
        //     createMeta({ name: 'twitter:creator', content: '@uSMART' })
        //     createMeta({ name: 'twitter:card', content: 'summary' })
        //     createMeta({ name: 'twitter:title', content: this.shareData.title })
        //     createMeta({ name: 'twitter:image', content: image })
        //     createMeta({
        //         name: 'twitter:description',
        //         content: this.shareData.description.substr(0, 100)
        //     })
        // },
        async share(shareType) {
            // 调用app分享
            if (JSBridge.isYouxinApp) {
                try {
                    // 分享链接
                    const path =
                        location.pathname +
                        location.search +
                        `&appType=${this.$root.appType}&langType=${this.$root.langType}`
                    const origin = this.$root.isMainland
                        ? location.origin
                        : location.origin.replace(
                              /yxzq\.com$/,
                              'usmartsecurities.com'
                          )
                    const pageUrl = origin + path
                    // 调用分享
                    await JSBridge.callApp('command_share', {
                        shareType,
                        pageUrl,
                        ...this.shareData
                    })
                    Toast(this.$t('shareSuccess'))
                } catch (e) {
                    Toast(this.$t('sharingFailure'))
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.news-share {
    text-align: center;
    color: #aaaab4;
}
.news-share ul {
    display: flex;
    justify-content: space-between;
    margin: 20px 27px 30px;
    img {
        width: 57px;
        height: 57px;
    }
}
</style>
