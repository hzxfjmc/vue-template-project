<template lang="pug">
    .bond-index-wrapper(ref="bondIndexWrapper")
        van-swipe.banner(v-show="bannerUrl.length !== 0" :autoplay="10000" :show-indicators="bannerUrl.length !== 1")
            van-swipe-item(v-for="(bannerItem, index) in bannerUrl" :key="index")
                a(:href="bannerItem.jump_url || 'javascript:void(0)'" title="")
                    img(:src="bannerItem.picture_url" :alt="bannerItem.banner_title")
                    //- img(:src="require('@/assets/img/bond-hk/banner-demo.png')" :alt="bannerItem.banner_title")
        .bond-list
            router-link(
                v-for="(item, index) in bondList"
                :key="index"
                :to="{path: '/hk/bond-detail?id=' + item.id}"
                title=""
            )
                bond-card-hk(:bondInfo="item")
            .no-data(v-show="!hasData") {{ $t('noMoreBonds') }}
        .no-bond-box(v-if="bondList.length === 0 && isShowPage")
            .no-bond {{ $t('noBonds') }}
</template>
<script>
import indexMixin from './mixins.js'
import BondCardHk from '@/biz-components/bond-card/index-hk'
export default {
    i18n: {
        zhCHS: {
            noMoreBonds: '没有更多债券',
            noBonds: '暂无债券'
        },
        zhCHT: {
            noMoreBonds: '沒有更多債券',
            noBonds: '暫無債券'
        },
        en: {
            noMoreBonds: 'No more bonds',
            noBonds: 'No bonds'
        }
    },
    mixins: [indexMixin],
    components: {
        BondCardHk
    }
}
</script>

<style lang="scss" scoped>
.bond-index-wrapper {
    height: 100%;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    padding: 8px 0 48px;
    .banner {
        height: 100px;
        margin: 0 $hk-global-padding;
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
        padding: 20px $hk-global-padding 0;
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
