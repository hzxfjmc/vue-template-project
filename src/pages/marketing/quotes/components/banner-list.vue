<template lang="pug">
    .banner-list(v-if="!isInit")
        van-swipe(
        :autoplay="3000"
        indicator-color="white"
        v-if="bannerList.length > 1"
        )
            van-swipe-item(v-for="(ba, index) in bannerList" :key="index")
                a(:href="ba.url" v-if="ba.url")
                    img.banner(:src="ba.img")
                img.banner(:src="ba.img" v-else)
        template(v-else)
            a(@click="$jsBridge.gotoNewWebview(bannerList[0].url)" v-if="bannerList[0].url")
                img.banner(:src="bannerList[0].img")
            img.banner(:src="bannerList[0].img" v-else)
</template>
<script>
import { usStockTradeClose } from '@/utils/html-utils'
export default {
    data: () => ({
        banner: {
            ch: [
                {
                    img: require('@/assets/img/marketing/quotes/banner-ch.png')
                }
            ],
            hk: usStockTradeClose
                ? []
                : [
                      {
                          img: require('@/assets/img/marketing/quotes/banner-hk.jpg'),
                          url:
                              'https://usmartsecurities.com/hk/zh-hk/services#stock-quotes'
                      }
                  ]
        }
    }),
    computed: {
        isChUser() {
            return this.$store.getters.isChUser
        },
        bannerList() {
            return this.isChUser ? this.banner.ch : this.banner.hk
        },
        isInit() {
            return this.$store.getters.isInit
        }
    }
}
</script>
<style lang="scss" scoped>
.banner-list {
    .banner {
        /*height: 120px;*/
        width: 100%;
        border-radius: 4px;
    }
}
</style>
