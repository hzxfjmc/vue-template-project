<template lang="pug">
    yx-container.prize-draw
        .draw-main(slot='main')
            .draw-top
                .left-logo
                img.share-icon(src="/webapp/marketing/lucky-draw/share.png" v-if='isShare' @click='shareHandle')
            .draw-title()
                img.title(src="/webapp/marketing/lucky-draw/group-top.png")
            .lucky
                img.detail-lucky(src="/webapp/marketing/lucky-draw/detail_1.png" @click='luckyHandle')
                img.now-join-btn(src="/webapp/marketing/lucky-draw/btn_1.png" @click='joinHandle("joinLucky")')
                img.or-text(src="/webapp/marketing/lucky-draw/or.png")
            .stock
                img.detail-stock(src="/webapp/marketing/lucky-draw/detail_2.png" @click='stockHandle')
                img.now-join-btn(src="/webapp/marketing/lucky-draw/btn_2.png" @click='joinHandle("joinStock")')
                //- recharge-dialog(v-model='isShowDialog')
</template>

<script>
// import { getLotteryStatus } from '@/service/customer-relationship-server.js'
import { isDownLoadApp } from '../../../components/utils/downLoadApp.js'
import { mapGetters } from 'vuex'
import { webViewClick } from '@/utils/burying-point'
export default {
    data() {
        return {
            isShare: false,
            isShowDialog: false
        }
    },
    components: {},
    computed: {
        ...mapGetters(['user'])
    },
    created() {
        if (this.$jsBridge.isYouxinApp) {
            this.isShare = true
        } else {
            this.isShare = false
        }
    },
    methods: {
        // 跳转到活动详情页面
        luckyHandle() {
            this.$router.push({ path: '/lucky' })
        },
        stockHandle() {
            this.$router.push({ path: '/stock' })
        },
        // 点击立即参加活动
        joinHandle(type) {
            if (type == 'joinLucky') {
                webViewClick('LuckyDraw', 'joinLucky', '参与抽奖')
            } else if (type == 'joinStock') {
                webViewClick('LuckyDraw', 'joinStock', '参与送股')
            }

            if (this.$jsBridge.isYouxinApp) {
                // this.$jsBridge.gotoNewWebview(
                //     `${window.location.origin}/webapp/marketing/lucky-draw.html#/middle`
                // )
                this.$router.replace({ path: '/middle' })
            } else {
                this.isDownLoadApp()
            }
        },
        // 是否下载app
        isDownLoadApp() {
            isDownLoadApp.call(
                this,
                true,
                `${window.location.origin}/webapp/marketing/lucky-draw.html#/middle`,
                `${window.location.origin}/webapp/marketing/lucky-draw.html#/middle`
            )
        },
        // 点击分享
        async shareHandle() {
            try {
                let link = `${this.$appOrigin}/webapp/marketing/lucky-draw.html#/`
                await this.$jsBridge.callApp('command_share', {
                    shareType: 'freedom',
                    title: '【uSMART迎新獎賞 首次存款即刻送港美股票俾你】',
                    description:
                        '由即日至9月30日, 當你嘅首次存款/轉倉等值為港幣$20,000或以上，即可參加幸運大抽獎或即時拎走指定股票',
                    pageUrl: unescape(link),
                    thumbUrl: `${this.$appOrigin}/webapp/marketing/lucky-draw/sharetowx.png`
                })
                this.$toast('分享成功')
            } catch (e) {
                e.msg && this.$toast(e.msg)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.prize-draw {
    .draw-main {
        padding: 18px 18px 0;
        .draw-top {
            display: flex;
            .left-logo {
                width: 105px;
                height: 20px;
                background-image: url(/webapp/marketing/lucky-draw/logo.png);
                background-position: center;
                background-size: cover;
            }
            .share-icon {
                width: 17px;
                height: 19px;
                margin-left: 216px;
            }
        }
        .draw-title {
            .title {
                display: flex;
                justify-content: center;
                width: 245px;
                height: 79px;
                margin: 24px auto 20px;
            }
        }
        .lucky {
            width: 100%;
            height: 339px;
            background-image: url(/webapp/marketing/lucky-draw/top.png);
            background-position: center;
            background-size: cover;
            margin-bottom: 15px;
            position: relative;
            .or-text {
                width: 56px;
                height: 50px;
                position: absolute;
                bottom: -33px;
                left: 50%;
                transform: translate(-50%);
                z-index: 99;
            }
        }
        .detail-lucky,
        .detail-stock {
            width: 57px;
            height: 28px;
            position: absolute;
            top: 95px;
            right: 5px;
        }
        .now-join-btn {
            cursor: pointer;
            width: 258px;
            height: 34px;
            position: absolute;
            bottom: 21px;
            left: 50%;
            transform: translate(-50%);
        }
        .stock {
            @extend .lucky;
            background-image: url(/webapp/marketing/lucky-draw/bottom.png);
        }
    }
}
</style>
