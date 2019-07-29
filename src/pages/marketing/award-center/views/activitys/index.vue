<template lang="pug">
    yx-container.activity-center(style="background-color:#f8f8f8")
        .main(slot="main")
            van-list(v-if="imgList.length" v-model="loading" :finished="finished" :finished-text="$t('noMore')" @load="onLoad")
                van-cell
                    div.imgStyle(v-for="item in imgList" :key="item.ad_id" :style="`background:url(${item.picture_url}) center no-repeat;background-size:cover;`" @click="goAdUrl(item)" :class="isHk?'hk-source':'other-source'")
            yx-no-list(v-else :imgSrc="imgSrc" :text="text")
</template>
<script>
import { getAdList } from '@/service/product-server.js'
import JSBridge from '@/utils/js-bridge'
import emptyGift from '@/assets/img/marketing/award-center/gift@2x.png'
import { List, Cell } from 'vant'
import { webAdClick } from '@/utils/burying-point'
export default {
    components: {
        [List.name]: List,
        [Cell.name]: Cell
    },
    data() {
        return {
            imgList: [],
            imgSrc: emptyGift,
            text: this.$t('noActivity'),
            loading: false,
            finished: false,
            isHk: false
        }
    },
    created() {
        this.onLoad()
    },
    methods: {
        async onLoad() {
            try {
                let params = {
                    show_page: 1 // 活动中心
                }
                let { ad_list, area } = await getAdList(params)
                // 置顶活动优先显示在上面
                if (ad_list && ad_list.length) {
                    let index = ad_list.findIndex(item => item.topping)
                    if (index > -1) {
                        ad_list = [
                            ad_list[index],
                            ...ad_list.slice(0, index),
                            ...ad_list.slice(index + 1)
                        ]
                    }
                    this.imgList = ad_list
                    this.finished = true
                }
                this.isHk = area === 'HK'
                this.loading = false
            } catch (e) {
                this.$toast(e.msg || this.$t('netError'))
            }
        },
        goAdUrl(item) {
            let url = item.jump_url
            webAdClick('activitycenter', item.ad_id, item.ad_type)
            if (JSBridge.isYouxinApp) {
                JSBridge.gotoNewWebview(url)
            } else {
                location.href = url
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.activity-center {
    .main {
        width: 100%;
        height: 100%;
        .van-cell {
            padding: $global-padding 18px;
            background: rgba(255, 255, 255, 1);
            .imgStyle {
                max-width: 100%;
                margin-bottom: 10px;
                // height: 136px;
                box-shadow: 0px 0px 10px 1px rgba(161, 161, 161, 0.5);
                border-radius: 4px;
            }
            .hk-source {
                height: 85px;
            }
            .other-source {
                height: 136px;
            }
        }
        .van-cell:not(:last-child)::after {
            border-bottom: none;
        }
    }
}
</style>
