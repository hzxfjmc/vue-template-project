<template lang="pug">
    .bond-index-wrapper
        van-swipe.banner(v-show="bannerUrl.length !== 0" :autoplay="10000" :show-indicators="bannerUrl.length !== 1")
            van-swipe-item(v-for="(bannerItem, index) in bannerUrl" :key="index")
                a(:href="bannerItem.jump_url" title="")
                    img(:src="bannerItem.picture_url" :alt="bannerItem.banner_title")
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
import indexMixin from '@/mixins/bond/index/index.js'
export default {
    mixins: [indexMixin]
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
