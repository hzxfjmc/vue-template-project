<template lang="pug">
    .bond-index-wrapper
        van-swipe.banner(v-show="bannerUrl.length !== 0" :autoplay="10000" :show-indicators="bannerUrl.length !== 1")
            van-swipe-item(v-for="(bannerItem, index) in bannerUrl" :key="index")
                a(:href="bannerItem.jump_url" title="")
                    img(:src="bannerItem.picture_url" :alt="bannerItem.banner_title")
        .bond-list
            router-link(
                v-for="(item, index) in list"
                :key="index"
                :to="{path: `fund-details?id=${item.fondId}`}"
                title=""
            )
                Card(:info="item")
            .no-data 没有更多基金
        .no-bond-box(v-if="list.length === 0")
            .no-bond 暂无基金
</template>
<script>
import { Swipe, SwipeItem } from 'vant'
import { getFundList } from '@/service/finance-info-server.js'
// import { bannerAdvertisement } from '@/service/news-configserver.js'
import Card from './components/fund-card/index.vue'
export default {
    name: 'index',
    components: {
        [Swipe.name]: Swipe,
        [SwipeItem.name]: SwipeItem,
        Card
    },
    created() {
        // this.handleGetFundBanner()
        this.getListFundInfo()
    },
    data() {
        return {
            bannerUrl: [],
            list: []
        }
    },
    methods: {
        // // 拉取债券banner
        // async handleGetFundBanner() {
        //     try {
        //         // 基金暂时没有
        //         let data = await bannerAdvertisement(21)
        //         this.bannerUrl = (data && data.banner_list) || []
        //     } catch (error) {
        //         console.log('getBondBanner:error:>>>', error)
        //     }
        // },
        // 获取基金列表
        async getListFundInfo() {
            try {
                this.list = await getFundList()
            } catch (e) {
                console.log('getListFundInfo:error:>>>', e)
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.bond-index-wrapper {
    min-height: 100%;
    padding-bottom: 77px;
    .banner {
        width: 375px;
        height: 150px;
        a {
            display: block;
            height: 100%;
            img {
                height: 100%;
                width: 100%;
            }
        }
    }
    .bond-list {
        padding: 0 10px;
    }
    .no-data {
        padding: 10px 0 7px;
        color: $text-color3;
        font-size: 0.24rem;
        line-height: 17px;
        text-align: center;
    }
    .no-bond-box {
        padding-top: 150px;
        .no-bond {
            width: 130px;
            height: 120px;
            margin: 0 auto;
            padding-top: 100px;
            background: url('~@/assets/img/bond/icon-nobond.png') center 15px
                no-repeat;
            background-size: 110px;
            color: $text-color3;
            font-size: 0.28rem;
            line-height: 20px;
            text-align: center;
            box-sizing: border-box;
        }
    }
}
</style>
