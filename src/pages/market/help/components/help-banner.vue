<template lang="pug">
    .help-banner
        van-swipe(:autoplay="5000")
            van-swipe-item(
            v-for="(item,index) in list"
            :key="index"
            @click.native="handleBannerClick(item)"
            )
                .pic(:style="`background-image: url(${item.picture_url})`")
                <!--img(:src="item.picture_url")-->
</template>

<script>
import { Swipe, SwipeItem } from 'vant'
import bannerBuryingPoint from '../../0-utils/banner-burying-point'

export default {
    props: {
        list: {
            type: Array,
            default: () => ({})
        }
    },
    data() {
        return {}
    },
    methods: {
        handleBannerClick(item = {}) {
            bannerBuryingPoint({
                ...item,
                view_page: '帮助中心'
            })
        }
    },
    components: {
        [Swipe.name]: Swipe,
        [SwipeItem.name]: SwipeItem
    }
}
</script>

<style lang="scss" scoped>
.help-banner {
    $bannerHeight: 150px;
    max-height: $bannerHeight;
    overflow: hidden;
    .pic {
        height: $bannerHeight;
        background-position: center center;
        background-size: cover;
    }
    /*img {
            width: 100%;
            min-height: $bannerHeight;
        }*/
}
</style>
