<template lang="pug">
    .index
        .content
            .section1
                .logo
                    img(src="@/assets/img/marketing/mgm/logo.png" class="logoImg")
                    img(src="@/assets/img/marketing/mgm/detail.png" class="ruleBtn" @click="jumpExplain")
                .title(v-if="!Inviter")
                    img(src="@/assets/img/marketing/mgm/titleImg.png")
                    p 現金獎賞高達
                        span  HKD2,600
                div.invatorTitle(v-if="Inviter") 
                    p 好友 {{userInfo.inviteName}}
                    img(src="@/assets/img/marketing/mgm/titleImg3.png")
                .headImg
                    img(src="@/assets/img/marketing/mgm/headImg.png")
                .advanList
                    .advanItem
                        img(src="@/assets/img/marketing/mgm/advan1.png")
                        p <span>享</span>智能選股 
                        p 策略
                    .advanItem
                        img(src="@/assets/img/marketing/mgm/advan2.png")
                        p <span>免</span>180日  
                        p 港股平台費
                .advanList.advanList2
                    .advanItem
                        img.larger(src="@/assets/img/marketing/mgm/advan3.png")
                        p <span>獎</span>一世港股 
                        p 美股免佣
                    .advanItem
                        img(src="@/assets/img/marketing/mgm/advan4.png")
                        p <span>送</span>現金HKD2,600及
                        p 股票USD$2,200*
                p.hint *以GOOGLE 2019年7月8日收市價計算
                .broadcast
                    van-notice-bar.info(
                        :text="broadcastData" 
                        left-icon="volume-o"
                        background="none"
                        color="rgba(43, 79, 128, 0.6)")
            .section2
                img.one(src="@/assets/img/marketing/mgm/one.png" v-if="Inviter")
                .rewardRule(:class="Inviter ? 'rewardRule1' : ''")
                    .title                          
                        span 領獎三部曲
                    ul.rules
                        li
                            img(src="@/assets/img/marketing/mgm/ruleImg1.png")
                            p 好友註冊
                            p 
                                span HKD
                                span 20
                            p 你和好友各獲得
                            p HKD10
                        li
                            img(src="@/assets/img/marketing/mgm/ruleImg2.png")
                            p 好友開戶
                            p 
                                span HKD
                                span 100
                            p 你和好友各獲得
                            p HKD50
                        li
                            img(src="@/assets/img/marketing/mgm/ruleImg3.png")
                            p 好友存款/轉倉
                            p 
                                span HKD
                                span 400
                            p 你和好友各獲得
                            p HKD200
                .myReward(v-if="!Inviter")
                    .title
                        p 我的獎品
                    .totalReward  HKD
                        span {{totalReward || 0}}
                    .rewardType 已賺取
                p(v-if="!Inviter && showGoReward" class="goRewardBtn") 
                    span(@click="goRewardCenter") 前往App獎品中心
                    van-icon(name="arrow" size="11px" class="arrow" style="margin-left:3px;")
            .section3(v-if="!Inviter")
                .recordTable
                    .title
                        span 邀請紀錄
                    table  
                        tbody.tableBody
                            tr.tHead 
                                td 姓名
                                td 狀態
                                td 已領取
                                td 待賺取
                            van-loading.loading(type="spinner" v-show="showRecord")
                            p.noData(v-if ="recordData.length <= 0") 暫無邀請記錄
                            div(v-for="item in recordData")                            
                                tr(@click="item.detailRecordShow = !item.detailRecordShow")
                                    td {{item.customerName}}
                                    td {{item.status}}
                                    td HKD {{item.receivedAmount}}
                                    td HKD {{item.unreceivedAmount}} 
                                        van-icon(
                                            name="play" 
                                            size="10px" 
                                            color="rgba(57,57,57,0.4)" 
                                            :class="item.detailRecordShow ? 'down-act':'down'")
                                ul(v-if="item.detailRecordShow")
                                    li(:class="item.statusType  ? 'active':''") 
                                        p 好友註冊
                                        p HKD 10
                                        p.line
                                    li(:class="(item.statusType == 2 || item.statusType == 3) ? 'active':''")
                                        p 好友開戶
                                        p HKD 50
                                        p.line
                                    li(:class=" item.statusType == 3 ? 'active':''")
                                        p 好友存款/轉倉
                                        p HKD 200
                .footerWrap
                    .footer
                        .invitationCode 邀請碼 :
                            p {{userInfo.inviteCode}}
                        van-button.share.footerBtn(
                            @click="handleMakePoster") 分享圖片
                        van-button.inviteFriends.footerBtn(@click="inviteFriends") 邀請好友
            .sectionInvitor(v-if="Inviter")
                img.two(src="@/assets/img/marketing/mgm/two.png")
                reward(:isMgm='true')
</template>
<script>
import { Icon, NoticeBar, Loading } from 'vant'
import Reward from '../../../components/reward/index'
import {
    getBroadcastDatahk,
    getTotalRewardhk,
    getRecordhk
} from '@/service/customer-relationship-server.js'
import userService from '@/service/user-server.js'
import { facebookShare } from '@/utils/share/facebook.js'
import { mapGetters } from 'vuex'
import {
    isDownLoadApp,
    isMobile
} from '../../../components/utils/downLoadApp.js'
import { getParameter } from '@/utils/tools'
import { setToken } from '@/utils/http-request'
// 视口设置(facebook分享用)
const viewport = {
    el: document.querySelector('meta[name=facebookSharedes]'),
    el2: document.querySelector('meta[name="twitter:description"]'),
    contentBak: document.querySelector('meta[name=facebookSharedes]').content,
    set(con) {
        let text = `好友${con}邀請您齊齊攞高達港幣$2,600現金獎賞及匯豐銀行、港交所、港鐵等股票`
        this.el.content = text
        this.el2.content = text
    },
    reset() {
        this.el.content = this.contentBak
    }
}

export default {
    data() {
        return {
            isYouxinApp: false,
            Inviter: false,
            detailRecordShow: true,
            broadcastData: '',
            totalReward: '',
            recordData: [],
            showRecord: true,
            link: ''
        }
    },
    components: {
        [Icon.name]: Icon,
        [NoticeBar.name]: NoticeBar,
        [Loading.name]: Loading,
        Reward
    },
    created() {
        // 判断是否在app里
        if (this.$jsBridge.isYouxinApp) {
            this.isYouxinApp = true
        }
        // 判断是邀请者还是被邀请者
        this.Inviter = this.userInfo.userToken ? false : true
        // 获取活动id
        let id = getParameter('id') || getParameter('register-cid')
        this.$store.dispatch('setActivityId', id)
        // 获取渠道id
        if (getParameter('register-cid')) {
            this.$store.dispatch('setChannelId', getParameter('register-cid'))
        }
        // 获取渠道类型
        if (getParameter('register-ct')) {
            this.$store.dispatch('setChannelType', getParameter('register-ct'))
        } else {
            this.$store.dispatch('setChannelType', 'm')
        }
        // 根据活动id获取滚动播报信息
        this.getBroadcast()
        // 若用户为邀请者
        if (!this.Inviter) {
            // 获取邀请者信息
            this.getInfo()
            // 若为被邀请者
        } else {
            // 获取用户昵称，邀请码
            if (this.isYouxinApp) {
                this.init()
            } else {
                this.$store.dispatch('setUserInfo', {
                    inviteName: getParameter('n'),
                    inviteCode: getParameter('ICode')
                })
            }
        }
    },
    computed: {
        ...mapGetters(['userInfo', 'activityId']),
        baseUrl() {
            return this.$appOrigin
        },
        showGoReward() {
            return isMobile()
        }
    },
    methods: {
        // 用户没有登录时无法进入该页面，引导至登录页
        async init() {
            try {
                let data = await this.$jsBridge.callApp('command_user_login')
                this.Inviter = false
                setToken(data.userToken)
                this.$store.dispatch('setUserInfo', {
                    inviteName: data.userName,
                    inviteCode: data.invitationCode,
                    userToken: data.userToken
                })
                viewport.set(data.userName)
                this.getTotalRewardhk()
                this.getRecordhk()
            } catch {
                this.$jsBridge.callApp('command_close_webview')
            }
        },
        // 获取邀请者信息
        async getInfo() {
            try {
                if (this.isYouxinApp) {
                    let data = await this.$jsBridge.callApp('get_user_info')
                    this.$store.dispatch('setUserInfo', {
                        inviteName: data.userName,
                        inviteCode: data.invitationCode
                    })
                    viewport.set(data.userName)
                } else {
                    let data = await userService.getCurrentUser()
                    this.$store.dispatch('setUserInfo', {
                        inviteName: data.nickname,
                        inviteCode: data.invitationCode
                    })
                    viewport.set(data.nickname)
                }
                // 初始化页面
                this.getTotalRewardhk()
                this.getRecordhk()
                this.link = `${this.baseUrl}?ICode=${
                    this.userInfo.inviteCode
                }&n=${this.userInfo.inviteName}&id=${this.activityId}#/`
            } catch (e) {
                if (e.code === 300101) {
                    this.$store.dispatch('setUserInfo', {
                        userToken: ''
                    })
                    this.Inviter = true
                }
                e.msg && this.$toast(e.msg)
            }
        },
        // 滚动播报
        async getBroadcast() {
            try {
                this.broadcastData = await getBroadcastDatahk(this.activityId)
            } catch (e) {
                e.msg && this.$toast(e.msg)
            }
        },
        // 累计奖励
        async getTotalRewardhk() {
            try {
                let res = await getTotalRewardhk(this.activityId)
                this.totalReward = res.totalAmount
            } catch (e) {
                e.msg && this.$toast(e.msg)
            }
        },
        // 邀请记录
        async getRecordhk() {
            try {
                let res = await getRecordhk(this.activityId)
                this.recordData = res.map(item => {
                    item.detailRecordShow = false
                    return item
                })
                this.showRecord = false
            } catch (e) {
                this.showRecord = false
                e.msg && this.$toast(e.msg)
            }
        },
        // 邀请好友
        async inviteFriends() {
            let name = encodeURIComponent(this.userInfo.inviteName)
            let link = `${this.baseUrl}/webapp/marketing/mgm.html?ICode=${
                this.userInfo.inviteCode
            }&n=${name}&id=${this.activityId}#/`
            if (this.isYouxinApp) {
                try {
                    await this.$jsBridge.callApp('command_share', {
                        shareType: 'freedom',
                        title: '【uSMART友信智投 邀請好友 獲賞現金及股票】',
                        description: `好友${
                            this.userInfo.inviteName
                        }邀請您齊齊攞高達港幣$2,600現金獎賞及匯豐銀行、港交所、港鐵等股票`,
                        pageUrl: link,
                        thumbUrl: `${
                            this.baseUrl
                        }/webapp/marketing/images/facebook.jpg`
                    })
                    this.$toast('分享成功')
                } catch (e) {
                    e.msg && this.$toast(e.msg)
                }
            } else {
                let ua = navigator.userAgent.toLowerCase()
                if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                    //在微信中打开
                    this.$alert('請點擊右上角分享按鈕進行分享！')
                } else if (ua.indexOf('FBAN') > -1) {
                    facebookShare(
                        link,
                        `https://m.usmartsecurities.com${window.location
                            .pathname +
                            window.location.search +
                            window.location.hash}`
                    )
                } else {
                    this.$alert('請在uSMARTApp中打開！')
                }
            }
        },
        // 跳转至邀请海报页面
        handleMakePoster() {
            this.$router.push({
                path: 'poster',
                query: {
                    ICode: this.userInfo.inviteCode,
                    n: this.userInfo.inviteName,
                    id: this.activityId
                }
            })
        },
        //跳转至活动说明
        jumpExplain() {
            this.$router.push({
                path: 'explain',
                query: {
                    Inviter: this.Inviter
                }
            })
        },
        // 跳转app奖励中心
        goRewardCenter() {
            if (this.$jsBridge.isYouxinApp) {
                this.$jsBridge.gotoNewWebview(
                    this.$appOrigin + '/webapp/marketing/award-center.html#/ch'
                )
            } else {
                isDownLoadApp.call(
                    this,
                    false,
                    'yxzq_goto://user_login',
                    'yxusmart://yx.usmart.app/personal',
                    this.userInfo.uuid
                )
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../../components/common.scss';
.index {
    .content {
        padding-bottom: 26px;
        background-color: #d2eeff;
        .section1 {
            width: 100%;
            background: url('~@/assets/img/marketing/mgm/section1Bg.png')
                no-repeat center center;
            background-size: cover;
            .logo {
                display: flex;
                justify-content: space-between;
                padding: 14px 0 18px 15px;
                .logoImg {
                    width: 100px;
                    height: 19px;
                    margin-top: 6px;
                }
                .ruleBtn {
                    width: 54px;
                    height: 27px;
                }
            }

            .title {
                img {
                    display: block;
                    width: 220px;
                    margin: 0 auto 7px;
                }
                p {
                    line-height: 25px;
                    @include font('PingFangHK-Medium', 0.36rem, 500, #2b4f80);
                    text-align: center;
                    span {
                        @include font('DIN Pro Bold', 0.48rem, 600, #ff7439);
                        vertical-align: bottom;
                    }
                }
            }
            .invatorTitle {
                padding: 0 0 23px 33px;
                p {
                    @include font('PingFangHK-bold', 0.36rem, 600, #2b4f80);
                    line-height: 30px;
                }
                img {
                    width: 276px;
                }
            }
            .headImg {
                padding-top: 10px;
                text-align: center;
                img {
                    width: 339px;
                }
            }
            .advanList {
                display: flex;
                justify-content: space-between;
                padding: 30px 30px 18px;
                .advanItem {
                    display: inline-block;
                    width: 140px;
                    text-align: center;
                    img {
                        height: 37px;
                        margin-bottom: 8px;
                    }
                    .larger {
                        height: 45px;
                        margin-bottom: 0;
                    }
                    p {
                        font-size: 0.32rem;
                        font-weight: 600;
                        color: #2b4f80;
                        line-height: 20px;
                        span {
                            font-size: 0.36rem;
                            color: #ff7439;
                        }
                    }
                }
            }
            .advanList2 {
                padding-top: 2px;
            }
            .hint {
                padding-bottom: 10px;
                font-size: 0.22rem;
                color: #2b4f80;
                line-height: 16px;
                text-align: center;
            }
            .broadcast {
                .info {
                    @include font($size: 0.26rem, $color: #2b4f80);
                }
            }
        }
        .section2 {
            .one {
                display: block;
                width: 180px;
                margin: 0 auto -20px;
            }
            .rewardRule1 {
                padding-top: 26px !important;
            }
            .rewardRule {
                width: 347px;
                padding: 10px 0 16px;
                border-radius: 8px;
                margin: 0 auto;
                background: rgba(255, 255, 255, 1);
                .title {
                    text-align: center;
                    span {
                        @include font(
                            'PingFangHK-Semibold',
                            0.4rem,
                            600,
                            #ff7439
                        );
                        line-height: 31px;
                    }
                    img {
                        width: 31px;
                        margin-left: 13px;
                        vertical-align: top;
                    }
                }
                .rules {
                    display: flex;
                    justify-content: space-between;
                    padding: 12px 8px 0;
                    li {
                        text-align: center;
                        img {
                            width: 52px;
                        }
                        p:nth-of-type(1) {
                            line-height: 20px;
                            margin-top: 7px;
                            @include font($size: 0.28rem);
                        }
                        p:nth-of-type(2) {
                            line-height: 30px;
                            @include font(
                                'DINPro-Medium',
                                0.6rem,
                                500,
                                #2b4f80
                            );
                            span:nth-of-type(1) {
                                font-size: 0.34rem;
                            }
                        }
                        p:nth-of-type(3) {
                            line-height: 17px;
                            @include font(
                                $size: 0.24rem,
                                $color: rgba(57, 57, 57, 0.6)
                            );
                        }
                        p:nth-of-type(4) {
                            line-height: 17px;
                            @include font(
                                'DINPro-bold',
                                0.28rem,
                                600,
                                rgba(57, 57, 57, 0.6)
                            );
                        }
                        &:nth-of-type(2) {
                            p:nth-of-type(2) {
                                color: #8fc31f;
                            }
                        }
                        &:nth-of-type(3) {
                            p:nth-of-type(2) {
                                color: #ff7439;
                            }
                        }
                    }
                }
            }
            .myReward {
                @include W-H(316px, 134px);
                margin: 23px auto 0px;
                background: url('~@/assets/img/marketing/mgm/myReward.png')
                    no-repeat center center;
                background-size: cover;
                .title {
                    display: flex;
                    justify-content: space-between;
                    line-height: 42px;
                    padding: 0 14px;
                    p:nth-of-type(1) {
                        @include font('PingFangHK-Medium', 0.4rem, 500, #fff);
                    }
                    p:nth-of-type(2) {
                        @include font($size: 0.28rem, $color: #fff);
                        .arrow {
                            margin-left: 6px;
                            vertical-align: middle;
                        }
                    }
                }
                .totalReward {
                    line-height: 25px;
                    margin: 16px 0 4px;
                    @include font('DINPro-Medium', 0.4rem, 500, #ff7439);
                    text-align: center;
                    span {
                        font-size: 0.72rem;
                    }
                }
                .rewardType {
                    line-height: 20px;
                    @include font(
                        $size: 0.28rem,
                        $color: rgba(57, 57, 57, 0.4)
                    );
                    text-align: center;
                }
            }
            .goRewardBtn {
                width: 230px;
                height: 40px;
                background: linear-gradient(
                    225deg,
                    rgba(109, 165, 249, 1) 0%,
                    rgba(43, 79, 128, 1) 100%
                );
                border-radius: 9px;
                margin: 10px auto 0px;
                font-size: 16px;
                font-weight: 500;
                color: #fff;
                line-height: 40px;
                text-align: center;
            }
        }
        .section3 {
            width: 100%;
            // background-color: #d2eeff;
            padding-top: 20px;
            // padding-bottom: 26px;
            .recordTable {
                width: 347px;
                padding: 20px 10px 10px;
                border-radius: 8px;
                margin: 0 auto 50px;
                background: #fff;
                .title {
                    text-align: center;
                    &::before {
                        position: relative;
                        top: 14px;
                        display: block;
                        height: 1px;
                        width: 94%;
                        content: '';
                        margin: 0 auto;
                        background-color: #2b4f80; /*颜色需与主题大背景色一致*/
                    }
                    span {
                        position: relative;
                        display: inline-block;
                        line-height: 28px;
                        padding: 0 18px 0 18px;
                        background: #fff;
                        @include font(
                            'PingFangHK-Semibold',
                            0.4rem,
                            600,
                            #2b4f80
                        );
                    }
                }
                table {
                    tr {
                        display: flex;
                        width: 327px;
                        min-height: 53px;
                        padding: 16px 9px;
                        border: 1px solid rgba(247, 247, 247, 1);
                        border-radius: 10px;
                        margin-bottom: 10px;
                        background: rgba(255, 255, 255, 1);
                        box-shadow: 0px 2px 4px 0px rgba(57, 57, 57, 0.05);
                        @include font(
                            $size: 0.28rem,
                            $color: rgba(57, 57, 57, 1)
                        );
                        td {
                            flex: 1;
                            &:nth-of-type(3) {
                                text-align: right;
                            }
                            &:nth-of-type(4) {
                                text-align: right;
                            }
                            .down {
                                transform: rotate(90deg);
                            }
                            .down-act {
                                transform: rotate(-90deg);
                            }
                        }
                    }
                    .tHead {
                        background: none;
                        box-shadow: none;
                        border: none;
                        @include font(
                            $size: 0.28rem,
                            $color: rgba(57, 57, 57, 0.4)
                        );
                    }
                    .loading {
                        margin: auto;
                    }
                    .noData {
                        text-align: center;
                    }
                    ul {
                        li {
                            position: relative;
                            display: inline-block;
                            height: 72px;
                            margin-top: -10px;
                            @include font($color: rgba(57, 57, 57, 0.4));
                            text-align: center;
                            &:nth-of-type(1) {
                                width: 104px;
                                padding: 20px 10px 20px 14px;
                                background: url('~@/assets/img/marketing/mgm/record1.png')
                                    no-repeat 6px center;
                                background-size: 21px 20px;
                            }
                            &:nth-of-type(1).active {
                                background: url('~@/assets/img/marketing/mgm/record1-act.png')
                                    no-repeat 6px center;
                                background-size: 21px 20px;
                            }
                            &:nth-of-type(2) {
                                width: 108px;
                                padding: 20px 10px 20px 24px;
                                background: url('~@/assets/img/marketing/mgm/record2.png')
                                    no-repeat 6px center;
                                background-size: 30px 20px;
                            }
                            &:nth-of-type(2).active {
                                background: url('~@/assets/img/marketing/mgm/record2-act.png')
                                    no-repeat 6px center;
                                background-size: 30px 20px;
                            }
                            &:nth-of-type(3) {
                                width: 108px;
                                padding: 20px 0px 20px 30px;
                                background: url('~@/assets/img/marketing/mgm/record3.png')
                                    no-repeat 6px center;
                                background-size: 23px 20px;
                            }
                            &:nth-of-type(3).active {
                                background: url('~@/assets/img/marketing/mgm/record3-act.png')
                                    no-repeat 6px center;
                                background-size: 23px 20px;
                            }
                            p:nth-of-type(2) {
                                @include font(
                                    $size: 0.28rem,
                                    $color: rgba(57, 57, 57, 0.4)
                                );
                            }
                            .line {
                                position: absolute;
                                top: 50%;
                                right: 0;
                                @include W-H(25px, 1px);
                                background: rgba(57, 57, 57, 0.4);
                            }
                        }
                        .active {
                            @include font($color: #2b4f80);
                            .line {
                                background: #2b4f80;
                            }
                            p:nth-of-type(2) {
                                @include font($size: 0.28rem, $color: #2b4f80);
                            }
                        }
                    }
                }
            }
            .footerWrap {
                position: fixed;
                bottom: 0;
                z-index: 10;
                .footer {
                    display: flex;
                    @include W-H(100%, 48px);
                    // padding: 30px 0 5px 0;
                    background: #d2eeff;
                    .invitationCode {
                        width: 115px;
                        line-height: 20px;
                        padding: 2px 0 0 18px;
                        background: url('~@/assets/img/marketing/mgm/inviteCodeBg.png')
                            no-repeat center center;
                        background-size: cover;
                        @include font(
                            $size: 0.28rem,
                            $color: rgba(57, 57, 57, 0.4)
                        );
                        p {
                            line-height: 23px;
                            @include font('DINPro-Medium', 0.36rem, 500);
                        }
                    }
                    .footerBtn {
                        width: 130px;
                        line-height: 48px;
                        padding: 0 0 0 17px;
                        background: #2b4f80
                            url('~@/assets/img/marketing/mgm/share.svg')
                            no-repeat 16px 16px;
                        border-radius: 0 !important;
                        border: none;
                        @include font($size: 0.32rem, $color: #fff);
                        span {
                            display: inline-block;
                            padding-left: 10px;
                        }
                    }

                    .inviteFriends {
                        background: rgba(255, 116, 57, 1)
                            url('~@/assets/img/marketing/mgm/invite.svg')
                            no-repeat 16px 14px;
                    }
                }
            }
        }
        .sectionInvitor {
            margin-top: 20px;
            .two {
                display: block;
                width: 180px;
                margin: 0 auto -20px;
            }
        }
    }
}
</style>
