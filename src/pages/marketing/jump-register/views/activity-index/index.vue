<template lang="pug">
    .section(:class="isRegister ? 'allGet':''")
        header
            .top
                img(src="@/assets/img/marketing/recruit-new-ch/logo.png")
        .getInfo(v-if="isRegister")
            p Dear {{nickname}}
            p 奖励已发放到您的友信智投账户，请前往APP查收
        .operation
            .operation-item(:class="isRegister ? 'isGet':''")
                div
                    button 注册送
                    h2 免费股票+180天高级行情
            .operation-item(:class="isOpenAccount ? 'isGet':''")
                div
                    button 开户送
                    h2 永久港、美股免佣
            .operation-item(:class="isGetGold ? 'isGet':''")
                div
                    button 入金送
                    h2 100-1000元返现
            .btn(v-if="isRegister" @click="goApp") 前往APP查收奖励
        .advertList
            .adverItem1
                .title 为什么选择友信证券
                ul
                    li: div
                        h4 持牌券商
                        p 香港证监会1/4/9号牌持牌券商
                    li: div
                        h4 永久免佣
                        p 活动期间完成开户，享永久港、美股免佣
                    li: div
                        h4 产品体验
                        p 智能选股、在线极速开户、毫秒级下单速度
            .adverItem2
                .title 为什么投资港美股
                .adverItemWrap
                    ul
                        li
                            img(src="@/assets/img/marketing/recruit-new-ch/advantage2_1.png")
                            h4 优质公司
                            p 投资腾讯、阿里、百度 苹果、脸书等优质公司
                        li
                            img(src="@/assets/img/marketing/recruit-new-ch/advantage2_2.png")
                            h4 T+0交易
                            p 日内买卖，交易更灵活
                    ul
                        li
                            img(src="@/assets/img/marketing/recruit-new-ch/advantage2_3.png")
                            h4 0资金门槛
                            p 无需50万资金门槛<br>0门槛开户入金
                        li
                            img(src="@/assets/img/marketing/recruit-new-ch/advantage2_4.png")
                            h4 交易品种丰富
                            p 股票、ETF、以及窝轮 牛熊证等衍生品
            .adverItem3
                .title 资产安全，值得信赖
                ul
                    li
                        img(src="@/assets/img/marketing/recruit-new-ch/advantage3_1.png")
                        h4 财产保障
                        p 账户受投资者赔偿基金(ICC)赔付保障
                    li
                        img(src="@/assets/img/marketing/recruit-new-ch/advantage3_2.png")
                        h4 资金托管
                        p 客户资产独立托管于中国银行（香港）等银行
                    li
                        img(src="@/assets/img/marketing/recruit-new-ch/advantage3_3.png")
                        h4 市场监督
                        p 港美股成熟市场监管 投资者保护体系完善
        .info
            h4 咨询电话：400-626-1888
            p *友信证券有限公司（uSmart Securities Limited）是香港证监会持牌券商
            p 中央编号：BJA907,提供证券交易服务并受其监管
            p.hint 股市有风险，投资需谨慎
        .getBtn(v-if="!isRegister")
            .btn(@click="goRegister") 立即领取
        .callUp(@click="handleCallUp")
            p 联系客服
</template>

<script>
import { Dialog } from 'vant'
import { getMyRewardInfo } from '@/service/customer-relationship-server.js'
import { mapGetters } from 'vuex'
import { getParameter } from '@/utils/tools'
export default {
    data() {
        return {
            isRegister: false,
            isOpenAccount: false,
            isGetGold: false,
            nickname: '',
            activityId: ''
        }
    },
    created() {
        let id = getParameter('id') || getParameter('register-cid') || '1009'
        this.activityId = id
        // 判断用户是否登录
        if (this.userInfo.userToken) {
            this.getUserInfo()
        }
    },
    components: {
        [Dialog.name]: Dialog
    },
    computed: {
        ...mapGetters(['userInfo'])
    },
    methods: {
        // 获取当前用户信息
        async getUserInfo() {
            try {
                let data = await getMyRewardInfo(this.activityId)
                if (this.$route.query.nickname) {
                    this.isRegister = true
                    this.nickname = this.$route.query.nickname
                } else {
                    this.isRegister = data.registered
                    this.nickname = data.nickname
                }
                this.isOpenAccount = data.openAccount
                this.isGetGold = data.recharge || data.transfer
            } catch (e) {
                if (e.code === 300101) {
                    this.$store.dispatch('setUserInfo', {
                        userToken: ''
                    })
                }
                e.msg && this.$toast(e.msg)
            }
        },
        // 跳转注册页面
        goRegister() {
            this.$router.push({
                name: 'register'
            })
        },
        // 前往app
        goApp() {
            this.$goAppDownLoad()
        },
        // 联系客服
        handleCallUp() {
            Dialog.confirm({
                title: '是否拨打',
                message: '400-626-1888'
            })
                .then(() => {
                    window.location.href = 'tel://400-626-1888'
                })
                .catch(() => {})
        }
    }
}
</script>

<style lang="scss" scoped>
@mixin font($size, $weight, $color) {
    font: {
        size: $size;
        weight: $weight;
    }
    color: $color;
}
.section {
    width: 100%;
    padding-bottom: 104px;
    background: #e04040 url('~@/assets/img/marketing/recruit-new-ch/banner.png')
        no-repeat;
    background-size: contain;
    .callUp {
        position: fixed;
        top: 240px;
        right: 0;
        width: 45px;
        height: 46px;
        padding-top: 30px;
        background: rgba(224, 64, 64, 0.69)
            url('~@/assets/img/marketing/recruit-new-ch/kefu.svg') no-repeat
            center 7px;
        border-radius: 8px 0 0 8px;
        font-size: 0.16rem;
        color: #fff;
        text-align: center;
    }
    header {
        position: relative;
        height: 470px;
        .top {
            justify-content: space-between;
            display: flex;
            img {
                width: 120px;
                height: 35px;
                margin: 20px 14px 39px;
            }
        }
    }
    .operation {
        position: relative;
        width: 375px;
        height: 362px;
        background: url('~@/assets/img/marketing/recruit-new-ch/operationOuterBg.png')
            no-repeat;
        background-size: contain;
        .operation-item {
            position: absolute;
            left: 45px;
            width: 283px;
            height: 80px;
            padding-left: 80px;
            div {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                padding-right: 6px;
            }
            &:nth-of-type(1) {
                top: 62px;
            }
            &:nth-of-type(2) {
                top: 147px;
            }
            &:nth-of-type(3) {
                top: 234px;
            }
            h2 {
                @include font(0.32rem, 500, #ff4a0f);
                line-height: 24px;
            }
            button {
                height: 18px;
                padding: 0 6px;
                border-radius: 19px;
                border: none;
                background: #f04228;
                @include font(0.24rem, 400, #fff);
                line-height: 18px;
            }
        }
        .isGet {
            background: url('~@/assets/img/marketing/recruit-new-ch/isGet.png')
                no-repeat right bottom;
            background-size: 58px 55px;
        }
    }
    .advertList {
        width: 335px;
        margin: 0 auto;
        .title {
            @include font(0.4rem, 500, #fff);
            line-height: 48px;
            text-align: center;
        }
        .adverItem1 {
            ul {
                width: 100%;
                padding: 32px 28px;
                background: #fff;
                border-radius: 8px;
                li {
                    width: 100%;
                    min-height: 60px;
                    background: url('~@/assets/img/marketing/recruit-new-ch/advantage1_1.png')
                        no-repeat left center;
                    background-size: 60px;
                    padding-left: 82px;
                    margin-bottom: 34px;
                    h4 {
                        padding-bottom: 4px;
                        @include font(0.36rem, 500, rgba(128, 64, 64, 1));
                        line-height: 27px;
                    }
                    p {
                        @include font(0.28rem, 400, rgba(128, 64, 64, 1));
                        line-height: 20px;
                    }
                    &:nth-of-type(2) {
                        background: url('~@/assets/img/marketing/recruit-new-ch/advantage1_2.png')
                            no-repeat left center;
                        background-size: 60px;
                    }
                    &:nth-of-type(3) {
                        background: url('~@/assets/img/marketing/recruit-new-ch/advantage1_3.png')
                            no-repeat left center;
                        background-size: 60px;
                        margin: 0;
                    }
                }
            }
        }
        .adverItem2 {
            .title {
                padding-top: 24px;
            }
            .adverItemWrap {
                padding: 30px 24px 20px;
                background: #fff;
                border-radius: 8px;
                ul {
                    display: flex;
                    justify-content: space-between;
                    li {
                        width: 120px;
                        padding-bottom: 10px;
                        text-align: center;
                        img {
                            width: 50px;
                        }
                        h4 {
                            padding-top: 10px;
                            @include font(0.32rem, 500, rgba(128, 64, 64, 1));
                            line-height: 22px;
                        }
                        p {
                            @include font(0.24rem, 400, rgba(128, 64, 64, 1));
                            line-height: 17px;
                            transform: scale(0.83);
                        }
                    }
                }
            }
        }
        .adverItem3 {
            .title {
                padding-top: 34px;
                padding-bottom: 10px;
            }
            ul {
                display: flex;
                justify-content: space-between;
                padding-bottom: 16px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.3);
                li {
                    text-align: center;
                    img {
                        width: 40px;
                    }
                    h4 {
                        padding-top: 6px;
                        @include font(0.32rem, 500, #fff);
                        line-height: 22px;
                    }
                    p {
                        @include font(0.24rem, 400, #fff);
                        line-height: 17px;
                        transform: scale(0.83);
                    }
                    &:nth-of-type(2) {
                        width: 250px;
                    }
                }
            }
        }
    }
    .info {
        padding: 20px 0 26px 0;
        @include font(0.24rem, 400, #fff);
        line-height: 14px;
        text-align: center;
        h4 {
            margin-bottom: 6px;
        }
        p {
            font-size: 0.2rem;
        }
        .hint {
            font-size: 0.16rem;
            color: rgba(255, 255, 255, 0.5);
        }
    }
    .getBtn {
        position: fixed;
        bottom: 0;
        z-index: 10;
        width: 375px;
        padding: 22px 0 35px 0;
        background: #d23b36;
        box-shadow: 0px -1px 4px 0px rgba(150, 50, 50, 0.5);
        .btn {
            width: 335px;
            height: 47px;
            background: linear-gradient(
                180deg,
                rgba(255, 231, 130, 1) 0%,
                rgba(255, 208, 6, 1) 100%
            );
            border-radius: 24px;
            margin: 0 auto;
            @include font(0.36rem, 400, rgba(224, 64, 64, 1));
            line-height: 47px;
            text-align: center;
        }
    }
}
.allGet {
    // width: 100%;
    // background: #e04040
    //     url('~@/assets/img/marketing/recruit-new-ch/banner2.png') no-repeat;
    // background-size: contain;
    padding-bottom: 0px;
    // header {
    //     height: 400px;
    // }
    .getInfo {
        text-align: center;
        p:nth-of-type(1) {
            @include font(0.48rem, 500, #fffe66);
            line-height: 33px;
        }
        p:nth-of-type(2) {
            margin: 5px 0;
            @include font(0.24rem, 400, #fffe66);
            line-height: 17px;
        }
    }
    .operation {
        width: 375px;
        height: 381px;
        background: url('~@/assets/img/marketing/recruit-new-ch/operationOuterBg2.png')
            no-repeat;
        background-size: contain;
        .operation-item {
            &:nth-of-type(1) {
                top: 32px;
            }
            &:nth-of-type(2) {
                top: 119px;
            }
            &:nth-of-type(3) {
                top: 206px;
            }
        }
        .btn {
            position: absolute;
            bottom: 42px;
            left: 50%;
            width: 282px;
            height: 42px;
            background: linear-gradient(
                180deg,
                rgba(255, 231, 130, 1) 0%,
                rgba(255, 208, 6, 1) 100%
            );
            border-radius: 8px;
            margin-left: -141px;
            @include font(0.36rem, 400, #e04040);
            line-height: 42px;
            text-align: center;
        }
    }
}
</style>
