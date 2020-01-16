<template lang="pug">
.block__fight--fund-hk
    .block__fight--header(@click="toRouterRuleKey")
        .block__left
            span {{$t('competition')}}
            //- img(:src="vipImgUrl")
        .block__right
            span {{$t('rule')}}
            em.iconfont.icon-previewright
    .block__fight--content
        .block__fight--list
            .block__list--item
                img(:src="require('@/assets/img/fund/icon/Subscribe-hk.png')")
                .plist
                    p {{$t('subscription')}}
            .block__list--item
                img(:src="require('@/assets/img/fund/icon/Achieve-hk.png')")
                .plist
                    p {{$t('target')}}
                    p {{$t('target1')}}
            .block__list--item
                img(:src="require('@/assets/img/fund/icon/Success-hk.png')")
                .plist
                    p {{$t('teamSuccess')}}
            .block__list--item
                img(:src="require('@/assets/img/fund/icon/return-hk.png')")
                .plist
                    p {{$t('discountReturn')}}
                    p {{$t('discountReturn1')}}
    .block__fight--bottom
        .block__list--p  
            img(:src="require('@/assets/img/fund/icon/about.png')")
            span {{$t('describe')}}
        .block__list--p  
            img(:src="require('@/assets/img/fund/icon/check.png')")
            span {{actionInfo.describeDiscountHk}}
    .block__item--notice
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
                    .block__vant--p {{items.discribeHk}}
</template>
<script>
import { Swipe, SwipeItem } from 'vant'
import { mapGetters } from 'vuex'
import { jumpUrl } from '@/utils/tools.js'
export default {
    i18n: {
        zhCHS: {
            competition: '参与「同行优惠」享折扣',
            rule: '详细规则',
            subscription: '成功认购',
            target: '组团参与',
            target1: '[同行优惠]',
            teamSuccess: '达到目标',
            discountReturn: '认购费',
            discountReturn1: '折扣返还',
            describe: '拼团未满达成目标，视为拼团失败不影响基金申购',
            describe1: '根据团队规模最高可返60%申购费',
            describe2: '人正在助力'
        },
        zhCHT: {
            competition: '參與「同行優惠」享折扣',
            rule: '詳細規則',
            subscription: '成功認購',
            target: '組團參與',
            target1: '「同行優惠」',
            teamSuccess: '達到目標',
            discountReturn: '認購費',
            discountReturn1: '折扣返還',
            describe: '未達成目標，不影響基金正常認購',
            describe1: '根據團隊規模最高可享申購費60%折扣',
            describe2: '人正在申購'
        },
        en: {
            competition: 'Subs. with Group Discount',
            rule: 'Terms and Conditions',
            subscription: 'Subscribe Fund',
            target: 'Share with friends ',
            target1: 'to get Group Discount',
            teamSuccess: 'Fulfill requirements',
            discountReturn: 'Get fees discount ',
            discountReturn1: '',
            describe:
                "You will fail to get the Group Discount if you do not gather enough people, but it doesn't affect funds subscription.",
            describe1:
                'If you meet the Group Discount requirements, group leader can get subs. fee 90% off, other members can enjoy 80% discount on subs. fee. ',
            describe2: ' ppl subscribing now'
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
.block__fight--fund-hk {
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
            img {
                width: 56px;
                height: 17px;
                margin: 18px 0 0 5px;
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
        margin: 10px 0 0 0;
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
                display: flex;
                margin: 0 5px;
            }
            em {
                font-style: normal;
            }
        }
        .block__notice {
            width: 15px;
            height: 15px;
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
