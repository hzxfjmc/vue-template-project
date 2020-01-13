<template lang="pug">
.block__fight--fund
    .block__fight--header
        .block__left
            span {{$t("competition")}}
            img(:src="require('@/assets/img/fund/icon/vip.png')")
        .block__right
            span {{$t('rule')}}
            em.iconfont.icon-previewright
    .block__fight--content
        .block__fight--list
            .block__list--item
                img(:src="require('@/assets/img/fund/icon/Subscribe.png')")
                p {{$t('subscription')}}
            .block__list--item
                img(:src="require('@/assets/img/fund/icon/Achieve.png')")
                p {{$t('target')}}
            .block__list--item
                img(:src="require('@/assets/img/fund/icon/Success.png')")
                p {{$t('teamSuccess')}}
            .block__list--item
                img(:src="require('@/assets/img/fund/icon/return.png')")
                p {{$t('discountReturn')}}
    .block__fight--bottom
        .block__list--p  
            img(:src="require('@/assets/img/fund/icon/about.png')")
            span {{$t('describe')}}
        .block__list--p  
            img(:src="require('@/assets/img/fund/icon/check.png')")
            span {{$t('teamSuccess')}}，
                em(v-for="(item,index) in actionInfo.rule_detail.rule_list" :key="index") 根据团队规模最高可返{{item.discount}}%申购费 
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
                    .block__vant--p 拼团成功，团队规模{{items.order_count}}人，尊享{{items.rule_detail}}%申购费返还
</template>
<script>
import { Swipe, SwipeItem } from 'vant'
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
            describe2: '人正在拼团申购',
            describe3: '拼团成功，团队规模3人，尊享70%申购费返还'
        },
        zhCHT: {
            competition: '参与拼团',
            rule: '详细规则',
            subscription: '拼团认购',
            target: '达到目标',
            teamSuccess: '拼团成功',
            discountReturn: '申购费折扣返还',
            describe: '拼团未满达成目标，视为拼团失败不影响基金申购',
            describe1: '根据团队规模最高可返60%申购费',
            describe2: '5人正在拼团申购',
            describe3: '拼团成功，团队规模3人，尊享70%申购费返还'
        },
        en: {
            competition: '参与拼团',
            rule: '详细规则',
            subscription: '拼团认购',
            target: '达到目标',
            teamSuccess: '拼团成功',
            discountReturn: '申购费折扣返还',
            describe: '拼团未满达成目标，视为拼团失败不影响基金申购',
            describe1: '根据团队规模最高可返60%申购费',
            describe2: '5人正在拼团申购',
            describe3: '拼团成功，团队规模3人，尊享70%申购费返还'
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
    data() {
        return {}
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
            justify-content: center;
            position: relative;
            img {
                width: 36px;
                height: 36px;
            }
            p {
                margin: 10px 0 0 0;
                white-space: nowrap;
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
    .block__fight--bottom {
        width: 100%;
        background: rgba(122, 122, 122, 0.05);
        display: flex;
        padding: 0 0 5px 0;
        margin: 20px 0 0 0;
        flex-direction: column;
        .block__item--notice {
            display: flex;
            margin: 10px 0 0 0;
            padding: 0 5px;
            flex-direction: row;
            img {
                width: 20px;
                height: 20px;
            }
        }
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
