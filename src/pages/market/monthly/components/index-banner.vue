<template lang="pug">
    van-swipe.monthly-index-banner(:autoplay="10000" indicator-color="white")
        van-swipe-item(v-for="item in list" :key="item.jump_url")
            a.banner(href="javascript:" @click="clickBanner(item)")
                img(:src="item.picture_url")
</template>

<script>
import { Swipe, SwipeItem } from 'vant'
import bannerBuryingPoint from '../../0-utils/banner-burying-point'

export default {
    name: 'index-banner',
    components: {
        [Swipe.name]: Swipe,
        [SwipeItem.name]: SwipeItem
    },
    props: {
        list: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        clickBanner(item) {
            bannerBuryingPoint({
                ...item,
                view_page: '月供股'
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.banner {
    display: block;
    img {
        border-radius: 6px;
        width: 100%;
        height: 85px;
    }
}
</style>

<style lang="scss">
.monthly-index-banner {
    .van-swipe__indicators {
        bottom: 8px;
    }
    .van-swipe__indicator {
        width: 8px;
        height: 2px;
        border-radius: 0;
    }
}
</style>
