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
                :to="{ name: 'fund-details', query: { id: `${item.fondId}` }}"
            )
                Card(:info="item")
            //- .no-data(v-if="list.length !== 0") 没有更多基金
        .no-bond-box(v-if="load")
            .no-bond {{ $t('noBond') }}
</template>
<script>
import { Swipe, SwipeItem } from 'vant'
import { getFundListV2 } from '@/service/finance-info-server.js'
import Card from './components/fund-card/index.vue'
export default {
    i18n: {
        zhCHS: {
            noBond: '暂无基金'
        }
    },
    keepalive: true,
    name: 'index',
    components: {
        [Swipe.name]: Swipe,
        [SwipeItem.name]: SwipeItem,
        Card
    },
    created() {
        this.getFundListV2()
    },
    data() {
        return {
            load: false,
            bannerUrl: [],
            list: [],
            pageNum: 1,
            pageSize: 20,
            total: 0,
            currency: 2
        }
    },
    methods: {
        // 获取基金列表
        async getFundListV2() {
            try {
                this.list = []
                const { list } = await getFundListV2({
                    displayLocation: 1,
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    assetType: this.$route.query.type,
                    currency: this.$route.query.currency
                })
                this.list = list
                this.load = this.list.length == 0
            } catch (e) {
                this.$toast(e.msg)
                console.log('getListFundInfo:error:>>>', e)
            }
        }
    },
    watch: {
        $route(to, from) {
            if (from.path === '/home') {
                this.getFundListV2()
            }
        }
    },
    beforeRouteEnter(to, from, next) {
        to.meta.title = to.query.assetTypeName
        next()
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
