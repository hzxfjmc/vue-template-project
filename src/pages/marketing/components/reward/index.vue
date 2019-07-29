<template lang="pug">
    .rewardWrap
        .reward   
            img.title(src='@/assets/img/marketing/mgm/rewardTitle.png' v-if="isMgm")     
            ul 
                li
                    .rewardSwipeTitle 註冊即送
                    van-swipe.rewardSwipe(             
                        :show-indicators="false"
                        :loop="false")
                        van-swipe-item.rewardSwipeItem(@click="goRegister") 
                            .item 
                                img(src="@/assets/img/marketing/mgm/reward1.png")
                            .item 
                                img(src="@/assets/img/marketing/mgm/reward2.png")
                    .action(@click="goRegister") 極速註冊
                li
                    .rewardSwipeTitle 開戶即送
                    img.newReward(src="@/assets/img/marketing/mgm/reward8.png")
                    van-swipe.rewardSwipe(
                        :show-indicators="false"
                        :loop="false" )
                        van-swipe-item.rewardSwipeItem(@click="goOpenAccount") 
                            .item 
                                img(src="@/assets/img/marketing/mgm/reward3.png")
                            .item 
                                img(src="@/assets/img/marketing/mgm/reward4.png")
                    .action(@click="goOpenAccount") 立即開戶
                li
                    .rewardSwipeTitle 存款即送
                    .term 首次存款/轉倉 
                        span 港幣$20,000或以上
                    van-swipe.rewardSwipe.smallRewardSwipe(
                        :show-indicators="false"
                        :loop="false" )
                        van-swipe-item.rewardSwipeItem(@click="goGetGold") 
                            .item 
                                img(src="@/assets/img/marketing/mgm/reward9.png")
                            span 或
                            .item
                                img(src="@/assets/img/marketing/mgm/reward5.png")
                    .term 首次存款/轉倉 
                        span 港幣$50,000或以上
                    van-swipe.rewardSwipe.smallRewardSwipe(
                        :show-indicators="false"
                        :loop="false" )
                        van-swipe-item.rewardSwipeItem(@click="goGetGold") 
                            .item 
                                img(src="@/assets/img/marketing/mgm/reward10.png")
                            span 或
                            .item 
                                img(src="@/assets/img/marketing/mgm/reward6.png")
                    .term2.term 
                        b 以上存款/轉倉額外贈送
                    van-swipe.rewardSwipe.smallRewardSwipe.swipeCenter(
                        :show-indicators="false"
                        :loop="false" )
                        van-swipe-item.rewardSwipeItem(@click="goGetGold") 
                            .item.item2
                                img(src="@/assets/img/marketing/mgm/reward7.png")
                    .action(@click="goGetGold") 立即存款
</template>
<script>
import { Swipe, SwipeItem } from 'vant'
import { isDownLoadApp } from '../utils/downLoadApp.js'
import LS from '@/utils/local-storage.js'
import { setToken } from '@/utils/http-request'
export default {
    data() {
        return {
            showDetail: false
        }
    },
    props: {
        isMgm: {
            type: Boolean,
            default: false
        }
    },
    components: {
        [Swipe.name]: Swipe,
        [SwipeItem.name]: SwipeItem
    },
    computed: {
        // 获取用户信息
        userInfo() {
            return this.$store.getters.userInfo
        }
    },
    methods: {
        // 注册登录，app里跳转app的登录，app外跳转h5的登录
        async goRegister() {
            if (this.userInfo.userToken) {
                this.$toast(
                    '你己是 uSMART 的註冊用戶，請前往領取開戶和存款獎品。'
                )
                return
            }
            try {
                if (this.$jsBridge.isYouxinApp) {
                    let user = await this.$jsBridge.callApp(
                        'command_user_login'
                    )
                    if (!user.phoneNum) {
                        user = {}
                        user = await this.$jsBridge.callApp(
                            'command_bind_mobile_phone'
                        )
                    }
                    if (user.userToken) {
                        LS.put('userToken', user.userToken)
                        setToken(user.userToken)
                        this.$store.dispatch('setUserInfo', {
                            userToken: user.userToken
                        })
                    }
                } else {
                    this.$router.push({ name: 'register' })
                }
            } catch (e) {
                e.msg && this.$toast(e.msg)
            }
        },
        // 跳转app的开户页
        goOpenAccount() {
            this.isDownLoadApp()
        },
        // 跳转app的入金页
        goGetGold() {
            this.isDownLoadApp()
        },
        // 判断用户手机是否下载app，若已下载则跳转相应的模块，若没有下载则跳转应用市场
        isDownLoadApp() {
            isDownLoadApp.call(
                this,
                false,
                'yxzq_goto://main_trade',
                'yxusmart://yx.usmart.app/main?tag=trade',
                this.userInfo.uuid
            )
        }
    }
}
</script>
<style lang="scss" scoped>
@mixin font(
    $family: 'PingFangHK-Regular',
    $size: 12px,
    $weight: 400,
    $color: #393939
) {
    font: {
        family: $family;
        size: $size;
        weight: $weight;
    }
    color: $color;
}
@mixin W-H($width, $height: auto) {
    width: $width;
    height: $height;
}
.rewardWrap {
    width: 100%;
    background: rgba(210, 238, 255, 1);
    .reward {
        width: 347px;
        margin: 0 auto;
        padding: 0 11px;
        border-radius: 8px;
        background: #fff;
        .title {
            display: block;
            width: 141px;
            padding-top: 35px;
            margin: 0 auto;
        }
        ul {
            padding-bottom: 20px;
            li {
                .rewardSwipeTitle {
                    width: 126px;
                    height: 30px;
                    line-height: 30px;
                    background: url('~@/assets/img/marketing/mgm/num1.png')
                        no-repeat left center;
                    background-size: 27px;
                    padding-left: 38px;
                    margin: 0 auto 10px;
                    @include font('PingFangTC-Semibold', 0.44rem, 600, #2b4f80);
                }
                padding-top: 25px;
                .newReward {
                    width: 325px;
                    margin-bottom: 10px;
                }
                .rewardSwipe {
                    .van-swipe-item {
                        float: none !important;
                    }
                    .rewardSwipeItem {
                        .item {
                            @include W-H(158px, 84px);
                            margin-right: 9px;
                            float: left;
                            img {
                                width: 100%;
                            }
                            &:nth-of-type(2) {
                                margin-right: 0;
                            }
                        }
                    }
                }
                .swipeCenter {
                    width: 148px;
                    margin: 0 auto;
                }
                .smallRewardSwipe {
                    .rewardSwipeItem {
                        .item {
                            width: 148px;
                            height: 84px;
                            margin: 0;
                            img {
                                width: 100%;
                            }
                        }
                        span {
                            float: left;
                            margin: 0 6px;
                            @include font(
                                'PingFangHK-Medium',
                                0.28rem,
                                500,
                                rgba(57, 57, 57, 0.4)
                            );
                            line-height: 84px;
                        }
                    }
                }
                .action {
                    @include W-H(130px, 35px);
                    background: linear-gradient(
                        45deg,
                        rgba(43, 79, 128, 1) 0%,
                        rgba(109, 165, 249, 1) 100%
                    );
                    border-radius: 6px;
                    margin: 15px auto 0;
                    @include font('PingFangHK-Medium', 0.36rem, 500, #fff);
                    line-height: 35px;
                    text-align: center;
                }
            }
            li:nth-of-type(2) {
                .rewardSwipeTitle {
                    background: url('~@/assets/img/marketing/mgm/num2.png')
                        no-repeat left center;
                    background-size: 27px;
                    color: #8fc31f;
                }
                .action {
                    background: linear-gradient(
                        45deg,
                        rgba(194, 227, 66, 1) 0%,
                        rgba(143, 195, 31, 1) 100%
                    );
                }
            }
            li:nth-of-type(3) {
                .rewardSwipeTitle {
                    background: url('~@/assets/img/marketing/mgm/num3.png')
                        no-repeat left center;
                    background-size: 27px;
                    color: #ff7439;
                    margin-bottom: -4px;
                }
                .term {
                    padding: 20px 0 15px 0;
                    @include font('PingFangHK-Medium', 0.32rem, 500, #ff7439);
                    line-height: 22px;
                    text-align: center;
                    span {
                        color: #393939;
                    }
                }
                .action {
                    background: linear-gradient(
                        45deg,
                        rgba(250, 152, 110, 1) 0%,
                        rgba(255, 116, 57, 1) 100%
                    );
                }
                .item2 {
                    // float: none !important;
                    // margin: 0 auto !important;
                }
                .term2 {
                    position: relative;
                    width: 325px;
                    height: 56px;
                    &::before {
                        position: absolute;
                        top: 30px;
                        left: 14px;
                        height: 1px;
                        width: 298px;
                        content: '';
                        background-color: #ff7439; /*颜色需与主题大背景色一致*/
                    }
                    b {
                        position: absolute;
                        left: 64px;
                        width: 198px;
                        height: 22px;
                        background: #fff;
                        font-weight: 500;
                    }
                }
            }
        }
    }
}
</style>
