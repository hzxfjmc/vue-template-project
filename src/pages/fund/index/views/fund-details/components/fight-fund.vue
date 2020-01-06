<template lang="pug">
.block__fight--fund
    .block__fight--header
        .block__left
            span 参与拼团
            img(:src="require('@/assets/img/fund/icon/vip.png')")
        .block__right
            span 详细规则
            em.iconfont.icon-previewright
    .block__fight--content
        .block__fight--list
            .block__list--item
                img(:src="require('@/assets/img/fund/icon/Subscribe.png')")
                p 拼团认购
            .block__list--item
                img(:src="require('@/assets/img/fund/icon/Achieve.png')")
                p 达到目标
            .block__list--item
                img(:src="require('@/assets/img/fund/icon/Success.png')")
                p 拼团成功
            .block__list--item
                img(:src="require('@/assets/img/fund/icon/return.png')")
                p 申购费折扣返还
    .block__fight--bottom
        .block__list--p  
            img(:src="require('@/assets/img/fund/icon/about.png')")
            span 拼团未满达成目标，视为拼团失败不影响基金申购
        .block__list--p  
            img(:src="require('@/assets/img/fund/icon/check.png')")
            span 拼团成功，
                em(v-for="(item,index) in actionInfo.rule_detail.rule_list" :key="index") 团队规模{{item.start_user_count}}人以上尊享申购费{{item.discount/1000}}折;
    .block__bottom--header
        img(:src="require('@/assets/img/fund/icon/Notice.png')")
        span 3280人正在拼团申购
    .block__bottom--swiper
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
                    .block__vant--p 拼团成功，团队规模{{items.order_count}}人，尊享申购费{{items.rule_detail/1000}}折
</template>
<script>
import { Swipe, SwipeItem } from 'vant'
export default {
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
    padding: 0 12px;
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
                min-width: 50px;
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
