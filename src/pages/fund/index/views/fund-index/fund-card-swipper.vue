<template lang="pug">
.block--swipper--wrapper
     van-swipe(:autoplay="500000") 
        van-swipe-item(
            v-for="(item, index) in fundBarnnarList" 
            :key="index"  
            @click="goBanner(item)") 
            .block--swipper--content()
                .block__swipper--content(:style="{background:`url(${item.picture_url})`}")
                    //- img(:src="item.picture_url")
                    .block--tilte {{item.banner_title}}
                    .block--desc {{item.banner_sub_title}}
                    .block--fund-num {{Number(item.apy)*100}}%
                    van-button() 立即买入
</template>
<script>
import { Swipe, SwipeItem } from 'vant'
import './swipe.scss'
export default {
    i18n: {},
    props: {
        fundBarnnarList: {
            type: Array,
            default: () => {}
        }
    },
    components: {
        [Swipe.name]: Swipe,
        [SwipeItem.name]: SwipeItem
    },
    methods: {},
    created() {}
}
</script>
<style lang="scss" scoped>
.block--swipper--wrapper {
    margin: 7px 0 0 0;
    .block--swipper--content {
        width: 100%;
        height: 220px;
        padding: 0 12px;
    }
    .block__swipper--content {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 200px;
        .block--tilte {
            margin: 43px 0 0 0;
            font-size: 18px;
        }
        .block--desc {
            font-size: 14px;
            color: rgba(25, 25, 25, 0.65);
        }
        .block--fund-num {
            font-size: 26px;
            line-height: 33px;
            font-family: yxFontDINPro-Medium;
        }
        .van-button {
            width: 268px;
            height: 44px;
            margin: 8px 0 0 0;
            color: #fff;
            background: #2971f0;
            border: none;
        }
    }

    // .van-swipe-item {
    //     width: 100% !important;
    // }
}
</style>
