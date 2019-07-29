<template lang="pug">
    .section
        .index(v-show="!showPoster")
            header(v-webp)
                .top
                    //- img(src="@/assets/img/marketing/mgm-ch/logo.png")
                    .btn
                        a(@click='show=true')
                            span 活动规则
                        a(@click="goRecord('1')")
                            span 邀请记录
            .operation
                .operation-item
                    .title 每邀请1位好友 注册
                    .content
                        .left
                            img(src="@/assets/img/marketing/mgm-ch/con1.png")
                            p 最多可得360天
                        .right
                            p 奖10天港股LV2&
                            p 美股LV1行情
                    .btn(@click="goRecord('1')" v-if="myReward.totalRegisterCount > 0") 已有{{myReward.totalRegisterCount}}位好友注册 获得{{myReward.totalRegisterRewardTimes}}天高级行情
                        van-icon(
                            name="arrow"
                            size="6px"
                            class="arrow")
                    .btn(v-else) 暂无好友注册
                .operation-item
                    .title 每邀请1位好友 开户
                    .content
                        .left
                            img(src="@/assets/img/marketing/mgm-ch/con2.png")
                            p 最多得10股股票
                        .right
                            p 奖1股小米股票
                    .btn(@click="goRecord('2')" v-if="myReward.totalOpenAccountCount > 0") 已有{{myReward.totalOpenAccountCount}}位好友开户 获得{{myReward.totalOpenAccountCount}}股小米股票
                        van-icon(
                            name="arrow"
                            size="6px"
                            class="arrow")
                    .btn(v-else) 暂无好友开户
                .operation-item
                    .title 每邀请1位好友 首次入金/转仓
                    .content
                        .left
                            img(src="@/assets/img/marketing/mgm-ch/con3.png")
                        .right
                            span 入金1万-3万港元
                            p 奖200人民币
                            span 入金3万及以上港元
                            p 奖300人民币
                    .btn(@click="goRecord('3')" v-if="myReward.totalRechargeOrTransferCount > 0") 已有{{myReward.totalRechargeOrTransferCount}}位好友入金 获得{{myReward.totalRechargeOrTransferRewardAmount}}元现金
                        van-icon(
                            name="arrow"
                            size="6px"
                            class="arrow")
                    .btn(v-else) 暂无好友入金
                .info
                    h4 咨询电话：400-626-1888
                    p *友信证券有限公司（uSmart Securities Limited）是香港证监会持牌券商
                    p 中央编号：BJA907,提供证券交易服务并受其监管
                    p.hint 股市有风险，投资需谨慎
            .footer
                p.tag-read(@click="copy") 邀请码：<b>{{invitationCode}}</b> <span>（点击复制 ）</span>
                .btn(@click="handleShowPoster") 分享海报
                .btn(@click="handleShare") 分享链接
            van-popup.rule(v-model="show")
                img.close(
                    src="@/assets/img/marketing/recruit-new-ch/close.svg"
                    @click="show=false")
                .title 活动规则
                p
                    span 一.活动时间：
                    = '2019-07-08 00:00:00至2019-09-08 23:59:59'
                p
                    span 二.活动资格：
                    = '本活动仅限内地用户参与'
                p
                    span 三.活动规则：
                p 1.如何邀请好友：
                p （1）进入邀请好友页面或股票红包页面，将链接分享给好友；
                p （2）好友在注册阶段，填写邀请者的邀请码；
                p 2.邀请奖励：
                p （1）邀请好友注册，每新增1人，邀请者获得10天港股LV2及美股LV1高级行情，最多获得360天高级行情；
                p （2）邀请好友开户，每新增1人，邀请者获得1股小米，最多获得10股小米；
                p （3）邀请好友入金/转仓，每新增1位好友首次入金/转仓1万-3万港元（或等额美元），邀请者获得200元人民币，每新增1位好友首次入金/转仓3万及以上港元（或等额美元），邀请者获得300元人民币；
                p 3.奖励发放及领取：
                p （1）港股LV2行情、美股LV1行情，好友完成注册并绑定手机号后，以行情卡的形式即刻发放到您的账户，可在友信智投App“个人中心--奖励中心”查看；
                p （2）股票奖励，获得股票后，即刻以股票卡的形式发放到您的友信智投账户，可在友信智投App“个人中心-奖励中心”中查看，入金1港元即可激活股票卡，成功使用股票卡后，股票将在5个交易日内存入到您的股票账户；
                p （3）现金奖励：用户首次成功入金/转仓并达到奖励发放标准后，以现金券的形式发放到您的友信智投App“个人中心-奖励中心”，点击“立即使用”，前往微信服务号“友信智投”绑定您的友信账户，现金将以微信红包的方式发放到您的微信账户；
                p 四.其他声明：
                p · 兑换标准：1USD=7.75HKD；
                p · 内地用户指拥有中国大陆身份证且常驻地在中国大陆的用户；
                p · 活动所得港股LV2行情为内地版，仅限内地用户在中国大陆使用；
                p · 首次入金金额以实际完成到账为准，首次转仓以发起转仓前一个交易日的收盘价格计算到账股票价值；
                p · 入金/转仓必须来自用户于金融机构的同名个人账户，不接受第三者出入金/转仓；
                p · 本优惠活动及相关的广告内容不构成任何证券、金融产品或工具的邀约、招揽、建议、意见或任何保证；
                p · 其他疑问可拨打客服电话400-626-1888或通过在线客服咨询；
                p · 友信智投享有对此活动的解释权及最终决定权。
        .posterWrap(v-show="showPoster")
            .poster
                .header
                    img.logo(src="@/assets/img/marketing/mgm-ch/logo.png")
                    p 股市有风险，投资需谨慎
                img.bg1(src="@/assets/img/marketing/mgm-ch/poster1.png")
                img.bg2(src="@/assets/img/marketing/mgm-ch/poster2.png")
                img.bg3(src="@/assets/img/marketing/mgm-ch/poster3.png")
                #qrcode
                .hint 扫描二维码，注册领福利
                .advantage
                    ul
                        li
                            img(src="@/assets/img/marketing/mgm-ch/advantage1.png")
                            p 持牌券商
                        li
                            img(src="@/assets/img/marketing/mgm-ch/advantage2.png")
                            p 港美股免佣
                        li
                            img(src="@/assets/img/marketing/mgm-ch/advantage3.png")
                            p 智能选股
                p.explain *具体奖励规则以平台公布的活动规则为准
        van-popup.downloadHK(v-model="showDownloadHK")
            .hint
                p 此活动仅限内地用户参与
                p 香港及海外用户请下载友信智投港版
                p App“USMART”，参与专属邀请好友活动
            .btn(@click="showDownloadHK=false") 我知道了
</template>

<script>
import {
    getTotalReward,
    getSource
} from '@/service/customer-relationship-server.js'
import { Icon, Popup } from 'vant'
import QRCode from 'qrcodejs2'
import { setTimeout } from 'timers'
import { getParameter } from '@/utils/tools'
import { webViewClick } from '@/utils/burying-point'

export default {
    data() {
        return {
            activityId: '',
            invitationCode: '',
            show: false,
            myReward: {},
            showPoster: false,
            hasCode: false,
            showDownloadHK: false
        }
    },
    created() {
        if (this.userInfo.userToken) {
            this.getSource()
            this.getUserInfo()
        } else {
            this.init()
        }
    },
    computed: {
        userInfo() {
            return this.$store.getters.user
        }
    },
    components: {
        [Icon.name]: Icon,
        [Popup.name]: Popup
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
        // 用户未登录时不允许进入该页面，引导至下载页面
        async init() {
            try {
                await this.$jsBridge.callApp('command_user_login')
                this.$store.dispatch('initAction')
                this.getSource()
                this.getUserInfo()
            } catch {
                this.$jsBridge.callApp('command_close_webview')
            }
        },
        // 获取当前用户的获奖信息
        async getTotalReward() {
            try {
                let res = await getTotalReward(this.activityId)
                this.myReward = res
            } catch (e) {
                e.msg && this.$toast(e.msg)
            }
        },
        // 获取当前用户信息
        async getUserInfo() {
            try {
                let id = getParameter('id') || getParameter('register-cid')
                this.activityId = id
                let data = await this.$jsBridge.callApp('get_user_info')
                this.invitationCode = data.invitationCode
                data.userToken && this.getTotalReward()
            } catch (e) {
                e.msg && this.$toast(e.msg)
            }
        },
        // 复制邀请码
        async copy() {
            try {
                await this.$jsBridge.callApp('command_copy_to_pasteboard', {
                    content: this.invitationCode
                })
                this.$toast('邀请码口令已复制')
            } catch (e) {
                e.msg && this.$toast(e.msg)
            }
        },
        // 跳转邀请记录页面
        goRecord(type) {
            this.$router.push({
                name: 'record',
                query: {
                    recordType: type
                }
            })
        },
        // 分享链接
        async handleShare() {
            try {
                webViewClick('Invitefriend', 'shareurl', '分享链接')
                let link = `${
                    this.$appOrigin
                }/webapp/marketing/new-ch-outer.html?ICode=${
                    this.invitationCode
                }&id=${this.activityId}#/index`
                await this.$jsBridge.callApp('command_share', {
                    shareType: 'freedom',
                    title: '好友送您永久港、美股免佣，还有免费股票和现金！',
                    description:
                        '友信证券，港美股持牌券商，现在开户享永久港、美股免佣',
                    pageUrl: unescape(link),
                    thumbUrl: `${
                        this.$appOrigin
                    }/webapp/marketing/images/mgmChShare.png`
                })
                this.$toast('分享成功')
            } catch (e) {
                e.msg && this.$toast(e.msg)
            }
        },
        // 分享海报
        handleShowPoster() {
            webViewClick('Invitefriend', 'sharepost', '分享海报')
            this.showPoster = true
            if (!this.hasCode) {
                this.hasCode = true
                new QRCode('qrcode', {
                    width: 100,
                    height: 100,
                    text: `${
                        window.location.origin
                    }/webapp/marketing/new-ch-outer.html?ICode=${
                        this.invitationCode
                    }&id=${this.activityId}#/index` // 二维码内容
                })
            }
            // 调用app截图方法
            setTimeout(() => {
                this.getImg()
            }, 300)
        },
        // app海报分享方法调用
        async getImg() {
            try {
                await this.$jsBridge.callApp('command_screenshot_share_save')
            } catch (e) {
                e.msg && this.$toast(e.msg)
            } finally {
                // 分享成功或取消分享，海报隐藏
                this.showPoster = false
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@mixin font($size: 0.24rem, $weight: 400, $color: #b95f22) {
    font: {
        size: $size;
        weight: $weight;
    }
    color: $color;
}
.section {
    width: 100%;
    height: 100%;
    .index {
        header {
            position: relative;
            width: 100%;
            height: 515px;
            background-image: url('~@/assets/img/marketing/mgm-ch/banner.png');
            background-size: cover;
            &.webp {
                background-image: url(~@/assets/img/marketing/mgm-ch/webp/banner.webp);
            }
            .top {
                .btn {
                    float: right;
                    a {
                        display: inline-block;
                        width: 38px;
                        height: 44px;
                        background: url('~@/assets/img/marketing/mgm-ch/btnBg.png')
                            no-repeat;
                        background-size: cover;
                        padding: 1px 4px 0;
                        margin-right: 18px;
                        color: rgba(255, 255, 255, 1);
                        line-height: 18px;
                        span {
                            display: inline-block;
                            transform: scale(0.714);
                            font-size: 0.28rem;
                        }
                    }
                }
            }
        }
        .operation {
            width: 100%;
            background: linear-gradient(#ed9020 0%, #ffc01f 25%);
            padding-bottom: 170px;
            margin-top: -2px;
            .operation-item {
                .title {
                    position: relative;
                    width: 160px;
                    height: 34px;
                    background: linear-gradient(
                        90deg,
                        rgba(255, 180, 17, 0) 0%,
                        rgba(255, 178, 18, 0.04) 0%,
                        rgba(255, 77, 47, 1) 100%
                    );
                    border-radius: 21px;
                    margin: 0 auto 14px;
                    @include font(0.32rem, 500, #fff);
                    line-height: 34px;
                    text-shadow: 0px 1px 2px rgba(230, 127, 26, 1);
                    text-align: center;
                    &::before {
                        position: absolute;
                        top: 6px;
                        left: -21px;
                        content: url('~@/assets/img/marketing/mgm-ch/water1.svg');
                        vertical-align: top;
                    }
                    &::after {
                        position: absolute;
                        top: 6px;
                        right: -24px;
                        content: url('~@/assets/img/marketing/mgm-ch/water.svg');
                        vertical-align: top;
                    }
                }
                .content {
                    width: 347px;
                    height: 160px;
                    background: url('~@/assets/img/marketing/mgm-ch/contentBg.png')
                        no-repeat;
                    background-size: cover;
                    margin: 0 auto;
                    overflow: hidden;
                    .left {
                        float: left;
                        padding: 24px 24px 0;
                        img {
                            width: 100px;
                        }
                        p {
                            margin-top: -28px;
                            @include font(0.28rem, 400, rgba(185, 95, 34, 0.6));
                            line-height: 14px;
                            text-align: center;
                            transform: scale(0.714);
                        }
                    }
                    .right {
                        float: left;
                        padding-top: 46px;
                        p {
                            @include font(0.4rem, bold, rgba(185, 95, 34, 1));
                            line-height: 26px;
                            letter-spacing: 1px;
                        }
                    }
                }
                .btn {
                    margin-bottom: 30px;
                    @include font(0.24rem, 400, #fff);
                    line-height: 17px;
                    text-align: center;
                    .arrow {
                        vertical-align: middle;
                        margin-left: 4px;
                    }
                }
                &:nth-of-type(3) {
                    .title {
                        width: 233px;
                    }
                    .right {
                        padding-top: 28px;
                        span {
                            @include font(0.24rem, 400, rgba(129, 53, 1, 1));
                            line-height: 16px;
                        }
                    }
                    .btn {
                        margin-bottom: 0;
                    }
                }
            }
            .info {
                padding-top: 40px;
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
        }
        .footer {
            position: fixed;
            bottom: 0;
            width: 375px;
            padding: 19px 0px 34px 18px;
            background: rgba(255, 246, 211, 1);
            box-shadow: 0px 0px 2px 0px rgba(212, 161, 34, 1);
            p {
                padding-bottom: 20px;
                text-align: center;
                @include font(0.28rem, 400, #f65a2a);
                b {
                    @include font($size: 0.32rem, $weight: 500);
                }
                span {
                    font-size: 12px;
                }
            }
            .btn {
                display: inline-block;
                width: 162px;
                height: 40px;
                background: linear-gradient(
                    180deg,
                    rgba(255, 144, 42, 1) 0%,
                    rgba(241, 52, 43, 1) 100%
                );
                border-radius: 7px;
                @include font(0.32rem, 500, #fff);
                line-height: 40px;
                text-align: center;
                &:nth-of-type(1) {
                    margin-right: 15px;
                }
            }
        }
        .rule {
            width: 335px;
            height: 400px;
            padding: 14px;
            border-radius: 20px;
            .close {
                float: right;
            }
            .title {
                position: relative;
                width: 107px;
                margin: 6px auto 10px;
                @include font(0.36rem, 500, rgba(255, 114, 25, 1));
                line-height: 25px;
                letter-spacing: 1px;
                text-align: center;
                &::before {
                    position: absolute;
                    left: 0;
                    top: 50%;
                    content: '';
                    width: 4px;
                    height: 4px;
                    border-radius: 50%;
                    margin-top: -2px;
                    background: #ff7219;
                }
                &::after {
                    position: absolute;
                    right: 0;
                    top: 50%;
                    content: '';
                    width: 4px;
                    height: 4px;
                    border-radius: 50%;
                    margin-top: -2px;
                    background: #ff7219;
                }
            }
            p {
                @include font($color: rgba(185, 95, 34, 1));
                line-height: 20px;
                span {
                    font-weight: 500;
                }
            }
        }
    }
    .posterWrap {
        width: 100%;
        height: 100%;
        .poster {
            position: relative;
            width: 100%;
            background: url('~@/assets/img/marketing/mgm-ch/posterBg.png')
                no-repeat;
            background-size: cover;
            .header {
                display: flex;
                justify-content: space-between;
                line-height: 30px;
                padding: 30px 11px 0 20px;
                .logo {
                    width: 105px;
                    height: 30px;
                }
                p {
                    font-size: 8px;
                    color: rgba(255, 249, 175, 0.7);
                }
            }
            .bg1 {
                display: block;
                width: 335px;
                margin: 25px auto 10px;
            }
            .bg2 {
                display: block;
                width: 314px;
                margin: 0 auto;
            }
            .bg3 {
                display: block;
                width: 338px;
                margin: 10px auto 20px;
            }
            #qrcode {
                display: inline-block;
                width: auto;
                padding: 6px;
                background: #fff;
                margin-left: 50%;
                transform: translateX(-50%);
            }
            .hint {
                font-size: 0.28rem;
                color: #fff9af;
                margin: 10px 0 20px 0;
                text-align: center;
            }
            .advantage {
                width: 100%;
                padding: 0 40px;
                text-align: center;
                ul {
                    display: flex;
                    justify-content: space-between;
                    li {
                        img {
                            width: 58px;
                            height: 58px;
                        }
                        p {
                            margin-top: 6px;
                            font-size: 14px;
                            color: rgba(255, 249, 175, 1);
                            line-height: 20px;
                        }
                    }
                }
            }
            .explain {
                padding: 10px 0;
                font-size: 8px;
                color: rgba(255, 249, 175, 0.7);
                line-height: 11px;
                text-align: center;
            }
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
</style>
