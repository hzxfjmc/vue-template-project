<template lang="pug">
    .Index      
        van-popup.redPackage(v-model="showRed")
            .wrap
                h3 获得股票红包
                h5 分享领红包
                .redWrap
                    img(
                        src="@/assets/img/marketing/stock/go.png"
                        @click="handleShare")
                .btn(@click="handleShare") 分享到微信，与好友共同开启
                .hint 随机获得腾讯、阿里、苹果等公司股票
            img.close(
                src="@/assets/img/marketing/stock/closeRed.png"
                @click="showRed = false")
        .header(v-webp)
            .rule(@click="show=true") 活动规则
        .lotterydraw(v-webp)
            .lottery-tip 
                p 100%中奖，腾讯、阿里等热股任性拿
            ul
                li(v-for="item in stock" :class="item.isStart ? 'start':''")
                    div(v-if="!item.isStart")
                        h5 {{item.name}}
                        p(:class="item.color"): span {{item.price}}
        p.tishi 股票价格仅供参考，以市场实时价格为准
        .lotteryResult
            .my(v-if="myStock.length > 0")
                .title 我已获得（{{myStock.length}}/3） 
                ul
                    li(
                        v-for="item,index in totalStock" 
                        :class="myStock[index] ? 'act':'' " )
                        img(
                            src="@/assets/img/marketing/stock/stock.png" 
                            v-if="myStock[index]")
                        img(
                            src="@/assets/img/marketing/stock/grayStock.png" 
                            v-else)
                        p(v-if="myStock[index]") {{myStock[index].stockName}}1股
                        p(v-else) 股票待领取
                img.cord(src="@/assets/img/marketing/stock/cord.png")
                img.cord(src="@/assets/img/marketing/stock/cord.png")
            .nextStep    
                div     
                    img(v-if="myStock.length < 3" src="@/assets/img/marketing/stock/share.png")
                    .text(v-if="myStock.length > 0 && myStock.length < 3")
                        p 最多可领3份股票，
                        p 快去领取好友发出的股票吧！
                div.hasGet(v-if="myStock.length == 3")
                    img(src="@/assets/img/marketing/stock/share1.png")
                    p 您已领满3份股票，快去“奖励中心”查收吧
                .btn(
                    v-if="myStock.length <= 0" 
                    @click="handleShareToGet") 分享领股票
                .btn(
                    v-if="myStock.length > 0 && myFriendsStock.length < 1000"  
                    @click="handleShare") 给好友发股票
        .seeFriends
            .title 看朋友们手气如何     
            p.recentInviteRecord(v-if="myFriendsStock.length > 30") 最近30位领取股票好友    
            .record          
                ul
                    .shadow
                    .noRecord(v-if="myFriendsStock.length <= 0") 暂无领取记录
                    li(v-for="item,index in myFriendsStock")
                        div(v-if="index < 30" class="myFriendsStockWrap")
                            .left 
                                .img
                                    img(:src="item.portrait") 
                                .text
                                    p 
                                        span {{item.nickName}}
                                        span {{item.receiveTime}}               
                            .right
                                img(:src="itemSrc[item.stockType]")
                                p {{item.stockName}}
        .advantage
            .title 
                h4 友信证券
                p 投资 智在简单
            ul 
                li: div 
                    h4 持牌券商
                    p 香港证监会持牌券商，客户资金银行托管
                li: div 
                    h4 永久免佣
                    p 现在开户享港、美股永久0佣金
                li: div 
                    h4 智能投资
                    p 量化选股策略，近4年收益超300%
                li: div 
                    h4 交易品种丰富
                    p 投资港美股票，衍生品权证，稳健基金
        .info
            h4 咨询电话：400-626-1888
            p *友信证券有限公司（uSmart Securities Limited）是香港证监会持牌券商
            p 中央编号：BJA907,提供证券交易服务并受其监管
            p.hint 股市有风险，投资需谨慎      
        van-popup.rulePopup(v-model="show")
            img.close(
                src="@/assets/img/marketing/stock/close.png" 
                @click="show=false") 
            .title 活动规则         
            h5 1. 活动时间：
            p 2019-07-08 00:00:00至2019-09-08 23:59:59
            h5 2. 活动资格：
            p 本活动仅限中国内地用户及未注册的非内地用户参与
            h5 3. 活动规则
            p 1）新用户完成注册后，可获得1个股票红包，发送到微信和好友一起开启，有机会获得如下公司股票：腾讯控股、阿里巴巴、苹果、京东、中国平安、中国恒大、小米集团、腾讯音乐；
            p 2）每个股票红包内共有1000份股票，可供1000位用户领取；
            p 3）用户领取了自己红包内的股票后，还可领取好友红包内的股票，最多可得3份股票；
            p 4）同一个股票红包，每位用户最多领取1股；
            p 5）用户领取股票后，即刻以股票卡的形式发放到您的友信智投账户，可在友信智投App“个人中心-奖励中心”中查看，入金≥1港元即可激活股票卡，成功使用股票卡后，股票将在5个交易日内存入到您的股票账户；
            h5 4. 其他声明
            p 1）内地用户指拥有中国大陆身份证且常驻地在中国大陆的用户；
            p 2）入金/转仓必须来自用户于金融机构的同名个人账户，不接受第三者出入金/转仓；
            p 3）本优惠活动及相关的广告内容不构成任何证券、金融产品或工具的邀约、招揽、建议、意见或任何保证；
            p 4）其他疑问可拨打客服电话400-626-1888或通过在线客服咨询；
            p 5）友信智投享有对此活动的解释权及最终决定权。
</template>

<script>
import { Popup } from 'vant'
import {
    getMyStock,
    getStockRecord,
    getStockPrice
} from '@/service/customer-relationship-server.js'
import userService from '@/service/user-server.js'
import md5 from 'js-md5'
import LS from '@/utils/local-storage.js'
import { ENV } from '@/utils/DOMAIN.js'
export default {
    data() {
        return {
            show: false,
            redpacketId: '', // 股票红包ID
            invitationCode: '',
            myStock: [],
            totalStock: 3,
            myFriendsStock: [],
            showRed: false,
            itemSrc: [
                '',
                require('@/assets/img/marketing/stock/logo1.png'),
                require('@/assets/img/marketing/stock/logo2.png'),
                require('@/assets/img/marketing/stock/logo3.png'),
                require('@/assets/img/marketing/stock/logo4.png'),
                require('@/assets/img/marketing/stock/logo5.png'),
                require('@/assets/img/marketing/stock/logo6.png'),
                require('@/assets/img/marketing/stock/logo7.png'),
                require('@/assets/img/marketing/stock/logo8.png'),
                require('@/assets/img/marketing/stock/logo9.png')
            ],
            stock: [
                {
                    stockType: 1,
                    name: '腾讯控股',
                    price: '',
                    color: 'red'
                },
                {
                    stockType: 2,
                    name: '京东',
                    price: '',
                    color: 'blue'
                },
                {
                    stockType: 9,
                    name: '美团点评',
                    price: '',
                    color: 'orange'
                },
                {
                    stockType: 4,
                    name: '中国平安',
                    price: '',
                    color: 'purple'
                },
                {
                    isStart: true
                },
                {
                    stockType: 5,
                    name: '小米',
                    price: '',
                    color: 'purple'
                },
                {
                    stockType: 6,
                    name: '阿里巴巴',
                    price: '',
                    color: 'orange'
                },
                {
                    stockType: 7,
                    name: '中国恒大',
                    price: '',
                    color: 'blue'
                },
                {
                    stockType: 8,
                    name: '苹果',
                    price: '',
                    color: 'red'
                }
            ]
        }
    },
    created() {
        // 获取股票价值
        this.getStockPrice()
        // 判断用户是否是首次进入该页面，若为首次则引导进行分享
        if (this.userInfo.userToken) {
            this.showRed = !LS.get('isNotFirstGoMGMCH') ? true : false
            LS.put('isNotFirstGoMGMCH', true)
            // 获取uuid生成股票红包id
            this.getUserInfo()
            // 获取我的奖励信息
            this.getMyStock()
        }
    },
    components: {
        [Popup.name]: Popup
    },
    computed: {
        userInfo() {
            return this.$store.getters.user
        }
    },
    methods: {
        async getUserInfo() {
            try {
                let data = await userService.getCurrentUser()
                this.redpacketId = md5(data.uuid)
                this.invitationCode = data.invitationCode
                // 获取我的好友的中奖信息
                this.getStockRecord()
            } catch (e) {
                e.msg && this.$toast(e.msg)
            }
        },
        async getMyStock() {
            try {
                let res = await getMyStock()
                this.myStock = res
            } catch (e) {
                e.msg && this.$toast(e.msg)
            }
        },
        async getStockRecord() {
            try {
                let res = await getStockRecord(this.redpacketId)
                this.myFriendsStock = res
            } catch (e) {
                e.msg && this.$toast(e.msg)
            }
        },
        async getStockPrice() {
            try {
                let res = await getStockPrice()
                res.map(item => {
                    this.stock.map(item_1 => {
                        if (item.stockType == item_1.stockType) {
                            item_1.price = item.price
                        }
                    })
                })
            } catch (e) {
                e.msg && this.$toast(e.msg)
            }
        },
        // 点击“分享领股票”按钮前先判断用户是否登录
        async handleShareToGet() {
            if (this.userInfo.userToken) {
                this.handleShare()
            } else {
                await this.$jsBridge.callApp('command_user_login')
                await this.$store.dispatch('initAction')
                this.showRed = !LS.get('isNotFirstGoMGMCH') ? true : false
                LS.put('isNotFirstGoMGMCH', true)
                // 获取uuid生成股票红包id
                this.getUserInfo()
                // 获取我的奖励信息
                this.getMyStock()
            }
        },
        // 分享小程序
        async handleShare() {
            try {
                await this.$jsBridge.callApp('command_share', {
                    shareType: 'wx_mini_program',
                    title:
                        this.userInfo.userName +
                        '送您腾讯、阿里、苹果等股票，随机领3股',
                    description:
                        this.userInfo.userName +
                        '送您腾讯、阿里、苹果等股票，随机领3股',
                    pageUrl: window.location.href,
                    thumbUrl: `${window.location.origin}/webapp/marketing/images/shareImg.jpg?v=1`,
                    wxUserName: 'gh_5e877b645a34',
                    wxPath: `pages/index/index?redpacketId=${this.redpacketId}&env=${ENV}&invitationCode=${this.invitationCode}&redPacketNickName=${this.userInfo.userName}`,
                    withShareTicket: false,
                    miniProgramType: ENV == 'PRO' ? 0 : 2
                })
                this.$toast('分享成功')
            } catch (e) {
                e.msg && this.$toast(e.msg)
            }
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
.Index {
    width: 100%;
    background-color: #f3463d;
    padding-bottom: 50px;
    .redPackage {
        border-radius: 4px;
        background: none;
        .wrap {
            width: 294px;
            height: 391px;
            background: url('~@/assets/img/marketing/stock/redBg.png') no-repeat
                center center;
            background-size: cover;
            text-align: center;
            h3 {
                padding-top: 70px;
                @include font(0.56rem, 600, #fff);
                line-height: 40px;
            }
            h5 {
                margin: 20px 0 10px 0;
                @include font(0.24rem, 400, #fff);
                line-height: 17px;
            }
            .redWrap {
                width: 196px;
                height: 126px;
                background: url('~@/assets/img/marketing/stock/red.png')
                    no-repeat center center;
                background-size: cover;
                margin: 0 auto;
                img {
                    width: 59px;
                    margin: 6px auto 0;
                }
            }
            .btn {
                width: 220px;
                height: 30px;
                background: url('~@/assets/img/marketing/stock/redTextBg.png')
                    no-repeat center center;
                background-size: cover;
                margin: 38px auto 10px;
                @include font(0.28rem, 400, #ba2b45);
                line-height: 30px;
                text-align: center;
            }
            .hint {
                @include font(0.24rem, 400, #ffe6af);
                line-height: 17px;
                text-align: center;
            }
        }
        .close {
            display: block;
            width: 30px;
            margin: 60px auto;
        }
    }
    .header {
        position: relative;
        width: 375px;
        height: 187px;
        background-image: url('/webapp/marketing/stock/header-img.png');
        background-size: cover;
        &.webp {
            background-image: url('/webapp/marketing/stock/webp/header-img.webp');
        }
        .logo {
            width: 87px;
            margin: 17px;
        }
        .rule {
            float: right;
            width: 35px;
            height: 46px;
            padding-top: 4px;
            background: rgba(255, 148, 69, 1);
            border-radius: 0px 0px 18px 18px;
            margin-right: 20px;
            @include font(0.24rem, 400, #fff);
            line-height: 18px;
            text-align: center;
        }
    }
    .lotterydraw {
        width: 375px;
        height: 408px;
        background: url('/webapp/marketing/stock/lottery.png') no-repeat center
            center;
        background-size: cover;
        padding: 0 41px;
        .lottery-tip {
            height: 86px;
            p {
                color: #fff;
                text-align: center;
                padding-top: 22px;
                font-family: PingFangSC-Semibold;
                font-size: 13px;
                font-weight: 600;
            }
        }
        &.webp {
            background-image: url('/webapp/marketing/stock/webp/lottery.webp');
        }
        ul {
            li {
                position: relative;
                float: left;
                width: 95px;
                height: 97px;
                padding-top: 20px;
                background: url('~@/assets/img/marketing/stock/stockBgAct.png')
                    no-repeat center center;
                background-size: cover;
                border-radius: 10px;
                margin-right: 4px;
                text-align: center;
                &:nth-of-type(3n) {
                    margin: 0;
                }
                h5 {
                    @include font(0.3rem, 500, rgba(162, 14, 7, 1));
                    line-height: 17px;
                }
                p {
                    width: 80px;
                    height: 38px;
                    line-height: 38px;
                    margin: 2px auto 0;
                    font-weight: 500;
                    color: rgba(255, 255, 255, 1);
                    text-shadow: 0px 0px 1px rgba(211, 21, 91, 0.35);
                    text-align: center;
                    span {
                        display: inline-block;
                        font-size: 0.18rem;
                    }
                }
                .red {
                    background: url('~@/assets/img/marketing/stock/redBtn.png')
                        no-repeat center center;
                    background-size: cover;
                }
                .orange {
                    background: url('~@/assets/img/marketing/stock/orangeBtn.png')
                        no-repeat center center;
                    background-size: cover;
                }
                .blue {
                    background: url('~@/assets/img/marketing/stock/blueBtn.png')
                        no-repeat center center;
                    background-size: cover;
                }
                .purple {
                    background: url('~@/assets/img/marketing/stock/purpleBtn.png')
                        no-repeat center center;
                    background-size: cover;
                }
            }
            .start {
                background: url('~@/assets/img/marketing/stock/goBtn.png')
                    no-repeat center center;
                background-size: cover;
            }
        }
    }
    .tishi {
        font-size: 9px;
        color: rgba(255, 255, 255, 0.5);
        text-align: center;
        margin: -4px 0 8px;
    }
    .lotteryResult {
        .my {
            position: relative;
            width: 340px;
            height: 152px;
            background: rgba(255, 249, 249, 1);
            box-shadow: 0px 0px 8px 0px rgba(154, 35, 35, 0.35);
            border-radius: 5px;
            margin: 0 auto 15px;
            padding-top: 12px;
            .title {
                width: 280px;
                background: url('~@/assets/img/marketing/stock/advTitleBg.png')
                    no-repeat center center;
                background-size: contain;
                margin: 0 auto;
                @include font(0.3rem, 600, rgba(248, 72, 63, 1));
                text-align: center;
            }
            ul {
                display: flex;
                justify-content: space-between;
                padding: 23px 32px 0;
                li {
                    text-align: center;
                    img {
                        width: 69px;
                    }
                    p {
                        padding-top: 4px;
                        @include font(0.24rem, 400, #999);
                    }
                }
                .act {
                    p {
                        color: rgba(176, 35, 28, 1);
                    }
                }
            }
            .cord {
                position: absolute;
                bottom: -32px;
                width: 13px;
                &:nth-of-type(1) {
                    left: 49px;
                }
                &:nth-of-type(2) {
                    right: 49px;
                }
            }
        }
        .nextStep {
            width: 340px;
            padding: 28px 28px 10px;
            background: rgba(255, 249, 249, 1);
            box-shadow: 0px 0px 8px 0px rgba(154, 35, 35, 0.35);
            border-radius: 5px;
            margin: 0 auto;
            text-align: center;
            img {
                width: 126px;
                margin: 0 auto 10px;
            }
            p {
                line-height: 24px;
                @include font(0.28rem, 400, rgba(51, 51, 51, 1));
            }
            .btn {
                width: 133px;
                height: 47px;
                line-height: 35px;
                background: url('~@/assets/img/marketing/stock/btnBg.png')
                    no-repeat center;
                background-size: cover;
                margin: 15px auto 0;
                @include font(0.24rem, 400, #fff);
                text-align: center;
            }
        }
    }
    .seeFriends {
        .title {
            width: 280px;
            height: 17px;
            margin: 16px auto;
            background: url('~@/assets/img/marketing/stock/seeFriendsTitle.png')
                no-repeat center center;
            background-size: cover;
            @include font(0.3rem, 600, #fff);
            text-align: center;
            line-height: 17px;
        }
        .recentInviteRecord {
            margin-top: -10px;
            padding-bottom: 10px;
            @include font(0.24rem, 400, rgba(255, 254, 254, 0.8));
            text-align: center;
            line-height: 17px;
        }
        .record {
            width: 354px;
            padding-top: 14px;
            margin: 0 auto;
            background: url('~@/assets/img/marketing/stock/record.png')
                no-repeat top center;
            background-size: contain;
            ul {
                .shadow {
                    width: 310px;
                    height: 20px;
                    margin: -2px 0 -16px -14px;
                    background: #fff;
                    box-shadow: inset 0px 15px 10px -15px #930d06;
                }
                .noRecord {
                    font-size: 0.24rem;
                    color: #333;
                    font-weight: 500;
                    text-align: center;
                    line-height: 60px;
                }
                width: 310px;
                padding: 0px 14px;
                background: #fff;
                box-shadow: 0px 3px 7px 0px rgba(154, 35, 35, 0.35);
                border-radius: 0px 0px 5px 5px;
                margin: 0px auto;
                li {
                    .myFriendsStockWrap {
                        display: flex;
                        justify-content: space-between;
                        padding: 10px 0px 10px 0;
                        border-bottom: 1px solid rgba(255, 220, 218, 1);
                        overflow: hidden;
                    }
                    &:nth-of-type(1) {
                        padding-top: 14px;
                    }
                    .left {
                        display: flex;
                        align-items: center;
                        width: 230px;
                        .img {
                            img {
                                width: 40px;
                                height: 40px;
                                margin-right: 12px;
                                border-radius: 3px;
                            }
                        }
                        .text {
                            display: flex;
                            // align-items: center;
                            height: 20px;
                            line-height: 20px;
                            p {
                                span {
                                    display: inline-block;
                                    height: 20px;
                                    vertical-align: middle;
                                    &:nth-of-type(1) {
                                        width: 70px;
                                        overflow: hidden;
                                        text-overflow: ellipsis;
                                        white-space: nowrap;
                                        @include font(
                                            0.24rem,
                                            500,
                                            rgba(51, 51, 51, 1)
                                        );
                                        margin-right: 10px;
                                    }
                                    &:nth-of-type(2) {
                                        @include font(
                                            0.18rem,
                                            400,
                                            rgba(102, 102, 102, 1)
                                        );
                                    }
                                }
                            }
                        }
                    }
                    .right {
                        width: 80px;
                        text-align: center;
                        img {
                            width: 25px;
                            height: 25px;
                            border-radius: 3px;
                        }
                        p {
                            @include font(0.2rem, 400, rgba(51, 51, 51, 1));
                        }
                    }
                }
            }
        }
    }
    .advantage {
        width: 340px;
        margin: 0 auto;
        .title {
            width: 210px;
            margin: 16px auto;
            background: url('~@/assets/img/marketing/stock/seeFriendsTitle.png')
                no-repeat center 4px;
            background-size: contain;
            text-align: center;
            h4 {
                @include font(0.3rem, 600, #fffefe);
            }
            p {
                @include font(0.24rem, 400, rgba(255, 254, 254, 0.8));
            }
        }
        ul {
            width: 100%;
            padding: 25px 0 25px 25px;
            background: #fff;
            border-radius: 8px;
            li {
                width: 100%;
                min-height: 50px;
                background: url('~@/assets/img/marketing/stock/advantage1_1.png')
                    no-repeat left center;
                background-size: 50px;
                padding-left: 70px;
                margin-bottom: 30px;
                h4 {
                    padding-bottom: 4px;
                    @include font(0.3rem, 600, #a20e07);
                    line-height: 27px;
                }
                p {
                    @include font(0.24rem, 400, #666666);
                    line-height: 20px;
                }
                &:nth-of-type(2) {
                    background: url('~@/assets/img/marketing/stock/advantage1_2.png')
                        no-repeat left center;
                    background-size: 50px;
                }
                &:nth-of-type(3) {
                    background: url('~@/assets/img/marketing/stock/advantage1_3.png')
                        no-repeat left center;
                    background-size: 50px;
                }
                &:nth-of-type(4) {
                    background: url('~@/assets/img/marketing/stock/advantage1_4.png')
                        no-repeat left center;
                    background-size: 50px;
                    margin: 0;
                }
            }
        }
    }
    .info {
        padding-top: 20px;
        @include font(0.26rem, 400, #fff);
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
    .rulePopup {
        width: 335px;
        height: 330px;
        padding: 20px;
        border-radius: 20px;
        .title {
            width: 280px;
            margin: 0 auto 20px;
            background: url('~@/assets/img/marketing/stock/advTitleBg.png')
                no-repeat center center;
            background-size: contain;
            @include font(0.3rem, 500, #f8483f);
            text-align: center;
        }
        .close {
            width: 12px;
            float: right;
            margin: -10px -10px 0 0;
        }
        h5 {
            @include font(0.24rem, 500, #ae1b14);
            line-height: 20px;
        }
        p {
            @include font(0.24rem, 400, #333);
            line-height: 20px;
        }
    }
}
</style>
