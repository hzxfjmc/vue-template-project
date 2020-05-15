<template lang="pug">
.block--swipper--wrapper
     van-swipe(:autoplay="500000") 
        van-swipe-item(
            v-for="(item, index) in fundBarnnarList" 
            :key="index"  
            @click="goBanner(item)") 
            .block--swipper--content()
                .block__swipper--content(:style="{background:`url(${item.picture_url})`}")
                    .block--tilte {{item.banner_title}}
                    .block--desc {{item.banner_sub_title}}
                    .block--tag(v-if="item.TagContent.length != 0")
                        fund-tag(
                            v-for="(i,index) in item.TagContent"
                            :title="i.name")
                    .block--fund-num(
                        v-if="Number(item.apy)>0"
                        :class="stockColorType == 1 ? 'color-red' : 'color-green'") {{Number(item.apy)*100}}%
                    .block--fund-num(
                        v-if="Number(item.apy)<0"
                        :class="stockColorType == 1 ? 'color-green' : 'color-red'") {{Number(item.apy)*100}}%
                    .block--fund-num.color-black(v-if="Number(item.apy)==0") {{Number(item.apy)*100}}%
                    .block--fund--num__desc(v-if="item.FundCycle!=0") {{item.FundCycleName}}{{$t('nav')}}
                    van-button(v-if="item.Button != ''") {{item.Button}}
</template>
<script>
import { Swipe, SwipeItem } from 'vant'
import { getStockColorType } from '@/utils/html-utils.js'
import fundTag from '@/biz-components/fund-tag/index.vue'
import './swipe.scss'
export default {
    i18n: {
        zhCHS: {
            nav: '涨跌幅'
        },
        zhCHT: {
            nav: '漲跌幅'
        },
        en: {
            nav: 'Chg%'
        }
    },
    props: {
        fundBarnnarList: {
            type: Array,
            default: () => {}
        }
    },
    computed: {
        stockColorType() {
            return +getStockColorType()
        }
    },
    components: {
        [Swipe.name]: Swipe,
        [SwipeItem.name]: SwipeItem,
        'fund-tag': fundTag
    },
    methods: {},
    created() {}
}
</script>
<style lang="scss" scoped>
.block--swipper--wrapper {
    margin: 7px 0 0 0;
    width: 100%;
    min-height: 220px;
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
        .block--tag {
            display: flex;
            flex-direction: row;
        }
        .block--fund--num__desc {
            font-weight: 400;
            color: rgba(25, 25, 25, 0.45);
            line-height: 20px;
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
