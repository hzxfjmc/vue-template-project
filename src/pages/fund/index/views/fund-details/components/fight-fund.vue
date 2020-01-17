<template lang="pug">
.block__fight--fund
    .block__fight--header(@click="toRouterRuleKey")
        .block__left
            span {{$t("competition")}}
            img(:src="vipImgUrl")
        .block__right
            span {{$t('rule')}}
            em.iconfont.icon-previewright
    .block__fight--content
        .block__fight--list
            .block__list--item
                img(:src="require('@/assets/img/fund/icon/Subscribe.png')")
                .plist
                    p {{$t('subscription')}}

            .block__list--item
                img(:src="require('@/assets/img/fund/icon/Achieve.png')")
                .plist
                    p {{$t('target')}}
            .block__list--item
                img(:src="require('@/assets/img/fund/icon/Success.png')")
                .plist
                    p {{$t('teamSuccess')}}
            .block__list--item
                img(:src="require('@/assets/img/fund/icon/return.png')")
                .plist
                    p {{$t('discountReturn')}}
    .block__fight--bottom
        .block__list--p  
            img(:src="require('@/assets/img/fund/icon/about.png')")
            span {{$t('describe')}}
        .block__list--p  
            img(:src="require('@/assets/img/fund/icon/check.png')")
            span {{actionInfo.describeDiscount}}
                //- em(
                //-     v-for="(item,index) in actionInfo.rule_detail.rule_list" 
                //-     :key="index")  
    .block__item--notice(v-if="swipeShow")
        img.block__notice(:src="require('@/assets/img/fund/icon/Notice.png')")
        span {{actionInfo.ad_order_count}}{{$t('describe2')}}
    .block__bottom--swiper(v-if="swipeShow")
        van-swipe(
            :show-indicators="false"
            :autoplay='3000'
            style="height:150px;"
            vertical)
            van-swipe-item(v-for="(item,index) in userList")
                .block__vant--item.border-top(v-for="(items,index) in item")
                    .block__vant--left
                        img(:src="items.headImg")
                    .block__vant--name {{items.nickName}}
                    .block__vant--p {{items.discribe}}
</template>
<script>
import { Swipe, SwipeItem } from 'vant'
import { mapGetters } from 'vuex'
import { jumpUrl } from '@/utils/tools.js'
export default {
    i18n: {
        zhCHS: {
            competition: '参与拼团',
            rule: '详细规则',
            subscription: '拼团认购',
            target: '达到目标',
            teamSuccess: '拼团成功',
            discountReturn: '申购费折扣返还',
            describe: '拼团未满达成目标，视为拼团失败不影响基金申购',
            describe1: '根据团队规模最高可返60%申购费',
            describe2: '人正在拼团申购'
        },
        zhCHT: {
            competition: '「同行」認購',
            rule: '詳細規則',
            subscription: '「同行」認購',
            target: '達到目標',
            teamSuccess: '「同行」成功',
            discountReturn: '申購費折扣返還',
            describe: '未達成「同行優惠」目標，未能領取優惠，不影響基金申購',
            describe1: '根據團隊規模最高可享申購費60%折扣',
            describe2: '人正在參與「同行」申購'
        },
        en: {
            competition: 'Subs. with Group Discount',
            rule: 'Terms and Conditions',
            subscription: 'Subs. with Group Discount',
            target: 'You entitled Group Discount',
            teamSuccess: 'You entitled Group Discount',
            discountReturn: 'Discount on subscription fee',
            describe:
                "You will fail to get the Group Discount if you do not gather enough people, but it doesn't affect funds subscription.",
            describe1:
                'Up to X% discount on handling fee if you meet the Group Discount requirement.',
            describe2: 'N people is joining the Group Discount'
        }
    },
    components: {
        [Swipe.name]: Swipe,
        [SwipeItem.name]: SwipeItem
    },
    props: {
        actionInfo: {
            type: Object
        },
        userList: {
            type: Array
        },
        swipeShow: {
            type: Boolean
        }
    },
    computed: {
        ...mapGetters(['lang'])
    },
    data() {
        return {
            vipImgUrl: require('@/assets/img/fund/fundImg/zhCHS/vip.png')
        }
    },
    methods: {
        toRouterRuleKey() {
            jumpUrl(
                3,
                `${window.location.origin}/webapp/market/generator.html?key=${this.actionInfo.rule_key}`
            )
        }
    },
    created() {
        this.vipImgUrl = require(`@/assets/img/fund/fundImg/${this.lang}/vip.png`)
    }
}
</script>
<style lang="scss" scoped>
.block__fight--fund {
    margin: 8px 0;
    background: #fff;
    padding: 0 12px 20px 12px;
    .block__fight--header {
        display: flex;
        flex-direction: row;
        line-height: 50px;
        .block__left,
        .block__right {
            width: 50%;
        }
        .block__left {
            display: flex;
            flex-direction: row;
            align-items: center;
            img {
                width: 56px;
                height: 17px;
                margin: 2px 0 0 5px;
            }
        }
        .block__right {
            text-align: right;
            display: flex;
            color: #191919;
            align-items: center;
            justify-content: flex-end;
            .icon-previewright {
                font-size: 22px;
                line-height: 30px;
            }
        }
    }
    .block__fight--list {
        display: flex;
        flex-direction: row;
        .block__list--item {
            width: 25%;
            font-size: 12px;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            // justify-content: center;
            position: relative;
            img {
                width: 36px;
                height: 36px;
            }
            .plist {
                margin: 5px 0 0 0;
            }
            p {
                margin: 2px 0 0 0;
                width: 100%;
                // white-space: nowrap;
            }
        }
        .block__list--item:after {
            content: '';
            display: block;
            width: 40%;
            border: 1px dashed #ff8e8e;
            top: 18px;
            right: -18px;
            position: absolute;
        }
        .block__list--item:last-child {
            width: 25%;
        }
        .block__list--item:last-child:after {
            content: '';
            border: none;
        }
    }
    .block__item--notice {
        display: flex;
        margin: 10px 0;
        padding: 0 5px;
        align-items: center;
        flex-direction: row;
        img {
            width: 15px;
            height: 15px;
        }
        span {
            font-size: 16px;
            margin: 0 0 0 5px;
        }
    }
    .block__fight--bottom {
        width: 100%;
        background: rgba(122, 122, 122, 0.05);
        display: flex;
        padding: 0 0 5px 0;
        margin: 20px 0 0 0;
        flex-direction: column;
        .block__list--p {
            font-size: 12px;
            line-height: 20px;
            display: flex;
            flex-direction: row;
            align-items: center;
            padding: 5px 0 0 0;
            img {
                width: 12px;
                height: 12px;
                margin: 0 5px;
            }
            em {
                font-style: normal;
            }
        }
        .block__notice {
            width: 10px;
            height: 10px;
        }
    }
    .block__bottom--header {
        width: 100%;
        font-size: 16px;
        line-height: 22px;
        display: flex;
        flex-direction: row;
        align-items: center;
        margin: 10px 0;
        img {
            width: 15px;
            height: 15px;
            margin: 0 5px 0 0;
        }
    }
    .block__bottom--swiper {
        width: 100%;
        height: 150px;
        .block__vant--item {
            height: 75px;
            display: flex;
            flex-direction: row;
            align-items: center;
            .block__vant--left {
                img {
                    width: 40px;
                    height: 40px;
                    border-radius: 40px;
                }
            }
            .block__vant--name {
                overflow: hidden;
                white-space: nowrap;
                margin: 0 5px;
                width: 50px;
                height: 20px;
                text-overflow: ellipsis;
            }
            .block__vant--p {
                width: 70%;
            }
        }
    }
}
</style>
