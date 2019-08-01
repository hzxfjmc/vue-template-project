<template lang="pug">
    .bond-index-wrapper
        van-swipe.banner(:autoplay="3000" :show-indicators="false")
            van-swipe-item
                a(href="####" title="")
                    img(src="@/assets/img/bond/banner-demo.png" alt="")
            van-swipe-item
                a(href="####" title="")
                    img(src="@/assets/img/bond/banner-demo.png" alt="")
        .bond-list
            router-link(
                v-for="(item, index) in bondList"
                :key="index"
                to="bond-list"
                title=""
            )
                bond-card(:bondInfo="item")
</template>
<script>
import { Swipe, SwipeItem } from 'vant'
import { getBondList } from '@/service/finance-server.js'
import BondCard from '../../biz-components/bond-card/index.vue'
export default {
    name: 'index',
    components: {
        [Swipe.name]: Swipe,
        [SwipeItem.name]: SwipeItem,
        BondCard
    },
    async created() {
        try {
            let { bondInfoAndCurrentPriceApiResponses } = await getBondList()
            this.bondList = bondInfoAndCurrentPriceApiResponses || []
            console.log(
                'getBondList:data:>>> ',
                bondInfoAndCurrentPriceApiResponses
            )
        } catch (e) {
            console.log('getBondList:error:>>>', e)
        }
    },
    data() {
        return {
            bondList: []
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
}
</style>
