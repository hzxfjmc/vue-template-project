<template lang="pug">
    .section
        header
            .top
                //- img(src="@/assets/img/marketing/recruit-new-ch/logo.png")
                a(@click='show=true') 活动<br>规则
            .prize
                van-notice-bar.noticeBar(
                    :text="broadcastData"
                    background="none"
                    color="#fff")
        .operation
            .operation-item(:class="rewardInfo.registered && rewardInfo.bindingPhone ? 'isGet':''")
                div(v-if="!rewardInfo.bindingPhone")
                    h2 注册领股票&高级行情
                    p 领股票红包,免费获得腾讯、阿里、平安等公司股票,至多领3股;<br>高级行情为180天港股LV2&美股LV1
                    button(
                        v-if="!rewardInfo.registered"
                        @click="goRegister") 立即注册
                    button(
                        v-if="rewardInfo.registered && !rewardInfo.bindingPhone"
                        @click="goBind") 绑定手机
                div(
                    v-if="rewardInfo.registered && rewardInfo.bindingPhone"
                    class="geted")
                    h2 完成注册，恭喜您获得
                    p 180天港股LV2&美股LV1行情 股票红包
                    button(@click="goGetStock") 免费领股票
            .operation-item(:class="rewardInfo.openAccount ? 'isGet':''")
                div(v-if="!rewardInfo.openAccount")
                    h2 开户享永久免佣
                    p 活动期间完成开户，享受港、美股交易 永久0佣金
                    button(@click="goOpenAccount") 立即开户
                div(
                    v-if="rewardInfo.openAccount"
                    class="geted")
                    h2 完成开户，恭喜您获得
                    p 港、美股永久免佣
            .operation-item(:class="rewardInfo.recharge ? 'isGet':''")
                div(v-if="!rewardInfo.recharge && !rewardInfo.transfer")
                    h2 入金返100-1000元现金
                    p 首次入金/转仓1港元，返100元人民 币现金，至多可得1000元人民币
                    button(@click="goGetGold") 立即入金
                div(
                    v-if="rewardInfo.recharge || rewardInfo.transfer"
                    class="geted")
                    h2(v-if="rewardInfo.recharge") 完成入金，恭喜您获得
                    h2(v-if="rewardInfo.transfer") 完成转仓，恭喜您获得
                    p {{rewardInfo.rewardAmount}}元人民币
        .activityTime 活动时间：2019年7月8日--2019年9月8日
        .details
            ul
                li
                    span 股票红包
                    != '完成注册，即可获得股票红包，<b>分享到微信，</b>与好友共同开启，<b>随机获得腾讯、阿里、平安、小米等公司股票;</b>'
                li
                    span 高级行情
                    = '完成注册，即可获得180天港股LV2实时行情，180天美股LV1实时行情;'
                li
                    span 港股永久免佣
                    = '活动期间完成开户，享受港股交易永久0佣金;'
                li
                    span 首次入金/转仓
                    table
                        tr
                            th 金额
                                span （港币或等额美元）
                            th 奖励
                                span （人民币现金）
                        tr(v-for="item in list")
                            td {{item.name}}
                            td {{item.reward}}
        //- .wave
        //-     img(src="@/assets/img/marketing/recruit-new-ch/wave.png" )
        .explain
            .title
                img(src="@/assets/img/marketing/recruit-new-ch/noticeblue.svg" )
                = '特别说明：'
            p · 本活动仅限拥有中国大陆身份证且常驻地在中国大陆的用户参与;
            p · 活动所得港股LV2行情为内地版，仅限中国大陆用户在中国大陆使用;
            p · 活动所得奖励均可在“个人中心-奖励中心”查看;
            p · 首次转仓：活动期间内首次从其他券商转入股票到友信智投，按照发起转仓前一个交易日的收盘价格计算到账股票市值;
            p · 兑换标准1USD=7.75HKD;
            p · 其他问题可拨打客服电话400-626-1888或通过在线客服咨询。
            p · 友信智投享有对此活动的解释权及最终决定权
        .shareBtn(@click="handleShare") 分享给好友
        .advertList
            .listTitle
                div
                    h4 友信证券
                    p 投资 智在简单
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
        rule-popup(v-model="show")
        van-popup.downloadHK(v-model="showDownloadHK")
            .hint
                p 此活动仅限内地用户参与
                p 香港及海外用户请下载友信智投港版
                p App“uSMART”，参与专属新手活动
            .btn(@click="showDownloadHK=false") 我知道了
</template>

<script>
import { NoticeBar, Popup } from 'vant'
import RulePopup from '../../../components/rule/index'
import {
    getBroadcastData,
    getMyRewardInfo,
    getSource
} from '@/service/customer-relationship-server.js'
import LS from '@/utils/local-storage.js'
import { setToken } from '@/utils/http-request'
import { getParameter } from '@/utils/tools'

export default {
    data() {
        return {
            show: false,
            activityId: '',
            broadcastData: '',
            rewardInfo: {},
            showDownloadHK: false,
            list: [
                {
                    name: 'HK$0 < 金额 < 10,000',
                    reward: '￥100'
                },
                {
                    name: 'HK$10,000 ≤ 金额 < 30,000',
                    reward: '￥200'
                },
                {
                    name: 'HK$30,000 ≤ 金额 < 100,000',
                    reward: '￥300'
                },
                {
                    name: 'HK$100,000 ≤ 金额 < 500,000',
                    reward: '￥500'
                },
                {
                    name: 'HK$500,000 ≤ 金额 < 1,000,000',
                    reward: '￥800'
                },
                {
                    name: 'HK$1,000,000及以上',
                    reward: '￥1000'
                }
            ]
        }
    },
    components: {
        [Popup.name]: Popup,
        [NoticeBar.name]: NoticeBar,
        RulePopup
    },
    created() {
        let id = getParameter('id') || getParameter('register-cid')
        this.activityId = id
        this.getSource()
        this.getBroadcast()
        this.userInfo.userToken && this.getMyRewardInfo()
    },
    computed: {
        userInfo() {
            return this.$store.getters.user
        }
    },
    methods: {
        // 判断用户归属地
        async getSource() {
            try {
                let res = await getSource()
                if (res.code != 1) {
                    this.showDownloadHK = true
                }
            } catch (e) {
                e.msg && this.$toast(e.msg)
            }
        },
        // 滚动播报
        async getBroadcast() {
            try {
                this.broadcastData = await getBroadcastData(this.activityId)
            } catch (e) {
                e.msg && this.$toast(e.msg)
            }
        },
        // 奖励信息
        async getMyRewardInfo() {
            try {
                this.rewardInfo = await getMyRewardInfo(this.activityId)
            } catch (e) {
                e.msg && this.$toast(e.msg)
            }
        },
        // 跳转注册页面
        async goRegister() {
            try {
                let data = await this.$jsBridge.callApp('command_user_login')
                LS.put('userToken', data.userToken)
                setToken(data.userToken)
                data.userToken && this.getMyRewardInfo()
            } catch (e) {
                e.msg && this.$toast(e.msg)
            }
        },
        // 跳转绑定手机页面
        async goBind() {
            try {
                let data = await this.$jsBridge.callApp(
                    'command_bind_mobile_phone'
                )
                LS.put('userToken', data.userToken)
                setToken(data.userToken)
                data.userToken && this.getMyRewardInfo()
            } catch (e) {
                e.msg && this.$toast(e.msg)
            }
        },
        // 跳转到股票红包页面
        goGetStock() {
            window.location.href = `/webapp/marketing/stock.html#/`
        },
        // 跳转到开户页面
        goOpenAccount() {
            this.$jsBridge.gotoNativeModule('yxzq_goto://main_trade')
        },
        // 跳转到入金页面
        goGetGold() {
            this.$jsBridge.gotoNativeModule(
                `yxzq_goto://webview?url=${encodeURIComponent(
                    window.location.origin + '/webapp/open-account/deposit.html'
                )}`
            )
        },
        //分享
        async handleShare() {
            try {
                let link = `${this.$appOrigin}/webapp/marketing/new-ch-outer.html?id=${this.activityId}#/index`
                await this.$jsBridge.callApp('command_share', {
                    shareType: 'freedom',
                    title: '享永久港美股免佣，免费拿千元现金、热门股票',
                    description:
                        '友信证券，港、美股持牌券商，现在开户即享港、美股永久免佣',
                    pageUrl: unescape(link),
                    overseaPageUrl: `https://m.usmartsecurities.com/webapp/marketing/new-ch-outer.html?id=${this.activityId}#/index`,
                    thumbUrl: `${this.$appOrigin}/webapp/marketing/images/newChShare.png`
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
.section {
    width: 100%;
    background: #e04040
        url('~@/assets/img/marketing/recruit-new-ch/banner3.png') no-repeat;
    background-size: contain;

    header {
        position: relative;
        height: 470px;
        .top {
            a {
                float: right;
                width: 42px;
                height: 50px;
                padding-top: 8px;
                background: rgba(255, 108, 94, 1);
                border-radius: 0 0 21px 21px;
                margin-right: 24px;
                @include font(0.24rem, 400, #fff);
                line-height: 15px;
                text-align: center;
            }
        }
        .prize {
            position: absolute;
            bottom: 22px;
            width: 375px;
            height: 26px;
            line-height: 26px;
            background: rgba(224, 64, 64, 0.7937);
            //border-radius: 16px;
            @include font(0.24rem, 400, #fff);
            overflow: hidden;
            text-align: center;
            .noticeBar {
                width: 290px;
                height: 100%;
                margin: 0 auto;
                transform: scale(0.83);
            }
        }
    }
    .operation {
        position: relative;
        width: 375px;
        height: 600px;
        background: url('~@/assets/img/marketing/recruit-new-ch/operationBg.png')
            no-repeat;
        background-size: contain;
        .operation-item {
            position: absolute;
            left: 32px;
            width: 309px;
            padding-left: 100px;
            div {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                padding-right: 6px;
            }
            &:nth-of-type(1) {
                top: 26px;
                height: 156px;
            }
            &:nth-of-type(2) {
                top: 234px;
                height: 142px;
            }
            &:nth-of-type(3) {
                top: 426px;
                height: 142px;
            }
            div {
                h2 {
                    @include font(0.36rem, 500, #df3c07);
                    line-height: 36px;
                }
                p {
                    @include font(0.24rem, 400, #804040);
                    line-height: 17px;
                }
                button {
                    width: 116px;
                    height: 32px;
                    @include font(0.28rem, 400, #fff);
                    background: #df3c07;
                    border-radius: 19px;
                    border: none;
                    margin: 10px 0 0 0;
                }
            }
            .geted {
                h2 {
                    @include font(0.28rem, 400, #df3c07);
                }
                p {
                    @include font(0.32rem, 500, #804040);
                    line-height: 20px;
                }
            }
        }
        .isGet {
            background: url('~@/assets/img/marketing/recruit-new-ch/isGet.png')
                no-repeat right bottom;
            background-size: 71px 67px;
        }
    }
    .activityTime {
        margin: 12px 0;
        @include font(0.24rem, 400, rgba(255, 255, 255, 0.6));
        line-height: 14px;
        text-align: center;
    }
    .details {
        width: 100%;
        height: 520px;
        background: url('~@/assets/img/marketing/recruit-new-ch/last.png')
            no-repeat;
        background-size: cover;
        padding-top: 90px;
        margin-top: -30px;
        ul {
            width: 311px;
            margin: 0px auto;
            padding: 0px 16px 16px;
            li {
                margin-top: 10px;
                line-height: 20px;
                @include font(0.24rem, 500, #50191b);
                b {
                    font-weight: normal;
                    color: #e04040;
                }
                > span {
                    display: inline-block;
                    height: 18px;
                    padding: 0px 4px;
                    line-height: 18px;
                    background: #e04040;
                    border-radius: 2px;
                    color: #fff;
                    margin-right: 5px;
                }
                table {
                    color: #4a1d1d;
                    border-collapse: collapse;
                    width: 100%;
                    margin: 10px 0 0 0;
                    tr {
                        width: 100%;
                        th {
                            padding: 4px 0 6px;
                            border: 1px solid #e9c3bb;
                            font-weight: 400;
                            line-height: 16px;
                            text-align: center;
                            span {
                                display: block;
                                font-size: 0.24rem;
                                line-height: 17px;
                                transform: scale(0.83);
                            }
                        }
                        td {
                            border: 1px solid #e9c3bb;
                            padding: 2px 0 0 8px;
                        }
                    }
                }
            }
        }
    }
    .wave {
        margin-top: -4px;
        img {
            width: 100%;
        }
    }
    .explain {
        width: 347px;
        margin: 20px auto;
        @include font(0.28rem, 500, #fff);
        line-height: 18px;
        .title {
            font-size: 14px;
            margin-bottom: 4px;
            img {
                width: 15px;
                float: left;
                margin: 0px 5px 0 0px;
            }
        }
        p {
            font-size: 12px;
        }
        h3 {
            margin: 10px 0 0 0;
            span {
                display: inline-block;
                @include font(0.24rem, 400, rgba(255, 255, 255, 0.5));
                transform: scale(0.83);
                transform-origin: left;
            }
        }
    }
    .shareBtn {
        width: 216px;
        height: 40px;
        background: rgba(255, 198, 28, 1);
        border-radius: 6px;
        margin: 0 auto 28px;
        font-size: 0.32rem;
        font-weight: 500;
        color: rgba(224, 64, 64, 1);
        line-height: 40px;
        text-align: center;
    }
    .advertList {
        width: 335px;
        margin: 0 auto;
        .listTitle {
            text-align: center;
            margin: 6px 0;
            &::before {
                position: relative;
                top: 21px;
                display: block;
                height: 1px;
                width: 100%;
                content: '';
                margin: 0 auto;
                background: rgba(255, 255, 255, 0.5);
            }
            div {
                position: relative;
                width: 190px;
                margin: 0 auto;
                background: #e04040;
                line-height: 22px;
                h4 {
                    @include font(0.4rem, 500, #fff);
                }
                p {
                    @include font(0.28rem, 400, #fff);
                }
                &::before {
                    position: absolute;
                    top: 6px;
                    left: 14px;
                    content: url('~@/assets/img/marketing/recruit-new-ch/water2.svg');
                    vertical-align: top;
                }
                &::after {
                    position: absolute;
                    top: 6px;
                    right: 14px;
                    content: url('~@/assets/img/marketing/recruit-new-ch/water1.svg');
                    vertical-align: top;
                }
            }
        }
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
    .downloadHK {
        width: 323px;
        background: rgba(255, 255, 255, 1);
        border-radius: 20px;
        @include font(0.32rem, 400, rgba(57, 57, 57, 1));
        line-height: 22px;
        text-align: center;
        .hint {
            padding: 34px 26px;
        }
        .btn {
            width: 100%;
            line-height: 48px;
            border-top: 0.03rem solid #f0f0f0;
            color: rgba(60, 120, 250, 1);
        }
    }
}
@media screen and (max-width: 350px) {
    .section .details ul li {
        font-size: 0.2rem;
    }
}
</style>
