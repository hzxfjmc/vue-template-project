<template lang="pug">
    .bond-index-wrapper
        van-swipe.banner(:autoplay="3000" :show-indicators="false")
            van-swipe-item
                a(href="####")
                    img(src="@/assets/img/bond/banner-demo.png")
            van-swipe-item
                a(href="####")
                    img(src="@/assets/img/bond/banner-demo.png")
        .bond-list
            bond-card(
                v-for="(item, index) in bondList"
                :key="index"
                :bondInfo="item"
            )
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
        // console.log(this)
        try {
            let data = await getBondList()
            console.log(data)
        } catch (e) {
            console.log('e:', e)
        }
    },
    data() {
        return {
            bondList: [
                {
                    name: '苹果1',
                    tag: ['高收入', '标签'],
                    rate: {
                        value: '3.561%',
                        desc: '到期年化收益率'
                    },
                    interest: {
                        value: '3月22日、9月22日',
                        desc: '每半年付息'
                    }
                },
                {
                    name: '苹果2',
                    tag: ['高收入2', '标签2'],
                    rate: {
                        value: '3.561%',
                        desc: '到期年化收益率'
                    },
                    interest: {
                        value: '3月22日、9月22日',
                        desc: '每半年付息'
                    }
                },
                {
                    name: '苹果3',
                    tag: ['高收入2', '标签2'],
                    rate: {
                        value: '3.561%',
                        desc: '到期年化收益率'
                    },
                    interest: {
                        value: '3月22日、9月22日',
                        desc: '每半年付息'
                    }
                }
            ]
        }
    }
}
</script>

<style lang="scss" scoped>
.bond-index-wrapper {
    min-height: 100%;
    padding-bottom: 77px;
    background-color: #f1f3f8;
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
