<template lang="pug">
    .bond-index-wrapper
        van-swipe.banner(v-show="bannerUrl.length !== 0" :autoplay="10000" :show-indicators="bannerUrl.length !== 1")
            van-swipe-item(v-for="(bannerItem, index) in bannerUrl" :key="index")
                a(href="####" title="")
                    img(src="@/assets/img/bond/banner-demo.png" alt="")
        .bond-list
            router-link(
                v-for="(item, index) in bondList"
                :key="index"
                :to="{path: 'bond-detail?id=' + item.id}"
                title=""
            )
                bond-card(:bondInfo="item")
            .no-data(v-show="!hasData") 没有更多债券
</template>
<script>
import { Swipe, SwipeItem } from 'vant'
import { getBondList } from '@/service/finance-info-server.js'
import { bannerAdvertisement } from '@/service/news-configserver.js'
import BondCard from '@/biz-components/bond-card/index.vue'
export default {
    name: 'index',
    components: {
        [Swipe.name]: Swipe,
        [SwipeItem.name]: SwipeItem,
        BondCard
    },
    created() {
        // 初始化拉取债券banner
        this.handleGetBondBanner()

        // 初始化拉取债券列表
        this.handleGetBondList()

        // 滑动到底触发更新数据
        window.addEventListener('scroll', this.pullRequest)
    },
    data() {
        return {
            hasData: true,
            bannerUrl: [],
            bondList: [],
            timer: null,
            pageSize: 30, // 每页条数
            pageNum: 1 // 当前页数
        }
    },
    methods: {
        // 拉取债券banner
        async handleGetBondBanner() {
            try {
                let data = await bannerAdvertisement(20)
                this.bannerUrl = (data && data.banner_list) || []
                console.log('getBondBanner:error:>>>', data)
            } catch (error) {
                console.log('getBondBanner:error:>>>', error)
            }
        },
        // 获取债券列表
        async handleGetBondList() {
            try {
                let { bondInfoAndCurrentPriceApiResponses } = await getBondList(
                    {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize
                    }
                )
                let listArray = bondInfoAndCurrentPriceApiResponses || []
                if (!listArray || listArray.length === 0) {
                    // this.$dialog.alert({
                    //     message: '没有更多数据了'
                    // })
                    this.hasData = false
                    return
                } else {
                    this.hasData = true
                }
                this.bondList = this.bondList.concat(listArray)
                console.log(
                    'getBondList:data:>>> ',
                    bondInfoAndCurrentPriceApiResponses
                )
            } catch (e) {
                console.log('getBondList:error:>>>', e)
            }
        },
        // 防抖，获取债券列表数据
        pullRequest() {
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                let htmlEle = document.querySelector('html')
                let winHeight = window.innerHeight
                let winScrollTop = window.scrollY
                if (winScrollTop + winHeight >= htmlEle.scrollHeight - 100) {
                    console.log('到底了 :')
                    this.pageNum++
                    this.handleGetBondList()
                }
            }, 300)
        }
    },
    beforeDestroy() {
        // 滑动到底触发更新数据
        window.removeEventListener('scroll', this.pullRequest)
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
}
</style>
