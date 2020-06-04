<template lang="pug">
.block--swipper--wrapper
     van-swipe(:autoplay="3000") 
        van-swipe-item(
            v-for="(item, index) in fundBarnnarList" 
            :key="index" 
            @click="toRoute(item)" ) 
            .block--swipper--content()
                .block__swipper--content(:style="{background:`url(${item.picture_url}) no-repeat`,backgroundSize:'100% 100%'}")
                    .block--tilte {{item.banner_title}}
                    .block--desc {{item.banner_sub_title}}
                    template(v-if="item.TagType === 2")
                        .block--tag(v-if="item.TagContent.length != 0")
                            fund-tag(
                                v-for="(i,index) in item.TagContent"
                                :title="i.name")
                    template(v-else)
                        .block--tag(v-if="item.TagList.length != 0")
                            fund-tag(
                                v-for="i in item.TagList"
                                :title="i")
                    .block--fund-num(
                        v-if="Number(item.apy)>0 && item.FundCycle != 0"
                        :class="stockColorType == 1 ? 'color-red' : 'color-green'") +{{Number(item.apy*100).toFixed(2)}}%
                    .block--fund-num(
                        v-if="Number(item.apy)<0 && item.FundCycle != 0"
                        :class="stockColorType == 1 ? 'color-green' : 'color-red'") {{Number(item.apy*100).toFixed(2)}}%
                    .block--fund-num.color-black(v-if="Number(item.apy)==0 && item.FundCycle != 0") {{Number(item.apy*100).toFixed(2)}}%
                    .block--fund--num__desc(v-if="item.FundCycle!=0 && lang!='en'") {{item.FundCycleName}}{{$t('nav')}}
                    .block--fund--num__desc(v-if="item.FundCycle!=0 && lang=='en'") The highest {{item.FundCycleName}}{{$t('nav')}} Rtn(Cum)
                    van-button(v-if="item.Button != ''") {{item.Button}}
</template>
<script>
import { Swipe, SwipeItem } from 'vant'
import { getStockColorType } from '@/utils/html-utils.js'
import { jumpUrl } from '@/utils/tools.js'
import { mapGetters } from 'vuex'
import fundTag from '@/biz-components/fund-tag/index.vue'
import './swipe.scss'
export default {
    i18n: {
        zhCHS: {
            nav: '涨跌幅高达'
        },
        zhCHT: {
            nav: '漲跌幅高達'
        },
        en: {
            nav: ''
        }
    },
    props: {
        fundBarnnarList: {
            type: Array,
            default: () => {}
        }
    },
    computed: {
        ...mapGetters(['appType', 'lang', 'isLogin', 'openedAccount']),
        stockColorType() {
            return +getStockColorType()
        }
    },
    components: {
        [Swipe.name]: Swipe,
        [SwipeItem.name]: SwipeItem,
        'fund-tag': fundTag
    },
    methods: {
        toRoute(item) {
            jumpUrl(item.news_jump_type, item.jump_url)
        }
    },
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
        height: 250px;
        padding: 0 12px;
    }
    .block__swipper--content {
        display: flex;
        flex-direction: column;
        align-items: center;
        background-size: 100% 100%;
        height: 230px;
        .block--tilte {
            margin: 43px 0 0 0;
            font-weight: bold;
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
            margin: 2px 0 0 0;
        }
        .block--fund-num {
            font-size: 26px;
            line-height: 33px;
            margin: 8px 0 0 0;
            font-family: yxFontDINPro-Medium;
        }
        .van-button {
            width: 268px;
            height: 44px;
            margin: 8px 0 0 0;
            color: #fff;
            font-size: 14px;
            font-weight: bold;
            background: #2971f0;
            border: none;
        }
    }

    // .van-swipe-item {
    //     width: 100% !important;
    // }
}
</style>
