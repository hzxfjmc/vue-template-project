<template lang="pug">
    .bond-index-wrapper
        van-swipe.banner(v-show="bannerUrl.length !== 0" :autoplay="10000" :show-indicators="bannerUrl.length !== 1")
            van-swipe-item(v-for="(bannerItem, index) in bannerUrl" :key="index")
                a(:href="bannerItem.jump_url ||'javascript:void(0)'" title="")
                    img(:src="bannerItem.picture_url" :alt="bannerItem.banner_title")
                    //- img(:src="require('@/assets/img/bond/banner-demo.png')" :alt="bannerItem.banner_title")
        .bond-list
            router-link(
                v-for="(item, index) in bondList"
                :key="index"
                :to="{path: 'bond-detail?id=' + item.id}"
                title=""
            )
                bond-card(:bondInfo="item")
            .no-data(v-show="!hasData") 没有更多债券
        .no-bond-box(v-if="bondList.length === 0 && isShowPage")
            .no-bond 暂无债券
</template>
<script>
import indexMixin from './mixins.js'
import BondCard from '@/biz-components/bond-card/index'
export default {
    mixins: [indexMixin],
    components: {
        BondCard
    }
}
</script>

<style lang="scss" scoped>
.bond-index-wrapper {
    min-height: 100%;
    padding: 10px 0 77px;
    background-color: $background-bottom-color;
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
