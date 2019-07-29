<template lang="pug">
    .index
        .content
            .section1
                .logo
                    img(src="@/assets/img/marketing/mgm/logo.png" class="logoImg")
                    .right-icons 
                        img(
                            v-if="$jsBridge.isYouxinApp"
                            src="/webapp/marketing/lucky-draw/share.png" 
                            class="share-icon"
                            @click="shareHandle"
                        )
                        img(src="@/assets/img/marketing/mgm/detail.png" class="ruleBtn" @click="jumpExplain")
                .title
                    img(src="@/assets/img/marketing/mgm/titleImg2.png")
                .headImg
                    img(src="@/assets/img/marketing/recruit-new/headImg.png")       
                .broadcast
                    img(src="@/assets/img/marketing/recruit-new/broadcast.svg")
                    van-notice-bar.info(
                        :text="broadcastData" 
                        background="none"
                        color="rgba(74,74,74, 1)")
            reward.reward
            .section3
                .viewDetail 
                    .btn 查看 uSMART 迎新活動詳情
                    .downImg(@click="showDetail = !showDetail")
                        van-icon(name="arrow-down" size="19px" color="#6D7278" :class="showDetail ? 'expand':''")
                    activity-rule(v-if="showDetail" :hasSpecial="false")
</template>
<script>
import { Icon, Swipe, SwipeItem, NoticeBar } from 'vant'
import Reward from '../../../components/reward/index'
import ActivityRule from '../../components/activity-rule/index'
import { getBroadcastDatahk } from '@/service/customer-relationship-server.js'
import LS from '@/utils/local-storage.js'
import { setToken } from '@/utils/http-request'
import { getParameter } from '@/utils/tools'
export default {
    data() {
        return {
            showDetail: false,
            broadcastData: ''
        }
    },
    components: {
        [Icon.name]: Icon,
        [Swipe.name]: Swipe,
        [SwipeItem.name]: SwipeItem,
        [NoticeBar.name]: NoticeBar,
        Reward,
        ActivityRule
    },
    created() {
        // 获取活动id
        let id = getParameter('id') || getParameter('register-cid')
        if (id) {
            this.$store.dispatch('setActivityId', id)
        }
        // 获取渠道类型
        if (getParameter('register-ct')) {
            this.$store.dispatch('setChannelType', getParameter('register-ct'))
        }
        // 获取渠道id
        if (getParameter('register-cid')) {
            this.$store.dispatch('setChannelId', getParameter('register-cid'))
        }
        if (getParameter('ICode')) {
            this.$store.dispatch('setUserInfo', {
                inviteCode: getParameter('ICode')
            })
        }
        this.initData()
        this.getUserInfo()
    },
    computed: {
        activityId() {
            return this.$store.getters.activityId
        }
    },
    methods: {
        // 滚动播报
        async initData() {
            try {
                this.broadcastData = await getBroadcastDatahk(this.activityId)
            } catch (e) {
                e.msg && this.$toast(e.msg)
            }
        },
        // 若在app里面打开此页面
        async getUserInfo() {
            if (this.$jsBridge.isYouxinApp) {
                try {
                    let data = await this.$jsBridge.callApp('get_user_info')
                    if (data.phoneNum) {
                        LS.put('userToken', data.userToken)
                        setToken(data.userToken)
                        this.$store.dispatch('setUserInfo', {
                            userToken: data.userToken
                        })
                    } else if (!data.userToken) {
                        LS.put('userToken', data.userToken)
                        setToken(data.userToken)
                        this.$store.dispatch('setUserInfo', {
                            userToken: data.userToken
                        })
                    }
                } catch (e) {
                    e.msg && this.$toast(e.msg)
                }
            }
        },
        // 点击分享
        async shareHandle() {
            try {
                let link = `${this.$appOrigin}/webapp/marketing/recruit-new.html?id=12019061802`
                await this.$jsBridge.callApp('command_share', {
                    shareType: 'freedom',
                    title: '【uSMART迎新獎賞 成功開戶即賞你工行及港鐵各1股】',
                    description:
                        '由即日至9月30 日, 成功開戶嘅新客戶，即賞你工商銀行及港鐵各１股，30日美股LV1串流報價，仲有180日免佣免平台費！',
                    pageUrl: unescape(link),
                    thumbUrl: `${this.$appOrigin}/webapp/marketing/images/luckyShare.png`
                })
                this.$toast('分享成功')
            } catch (e) {
                e.msg && this.$toast(e.msg)
            }
        },
        jumpExplain() {
            this.$router.push({ name: 'explain' })
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../components/common.scss';
.index {
    background: rgba(210, 238, 255, 1) !important;
    .content {
        .section1 {
            width: 100%;
            background: url('~@/assets/img/marketing/recruit-new/section1Bg.png')
                no-repeat center center;
            background-size: cover;
            background-color: rgb(242, 246, 255);
            .logo {
                display: flex;
                justify-content: space-between;
                padding: 13px 0 18px 15px;
                .logoImg {
                    width: 100px;
                    height: 19px;
                    margin-top: 5px;
                }
                .right-icons {
                    .share-icon {
                        width: 24px;
                        height: 28px;
                        margin-right: 15px;
                    }
                    .ruleBtn {
                        width: 54px;
                        height: 27px;
                    }
                }
            }
            .title {
                // padding-top: 24px;
                text-align: center;
                img {
                    width: 300px;
                }
            }
            .headImg {
                padding-top: 11px;
                p {
                    @include font('PingFangTC-Semibold', 0.48rem, 600, #ff7439);
                    line-height: 22px;
                }
                img {
                    width: 375px;
                }
            }
            .broadcast {
                position: relative;
                width: 347px;
                height: 25px;
                background: #2b4f80;
                border-radius: 8px;
                margin: -56px auto 10px;
                img {
                    position: absolute;
                    top: 5px;
                    left: 10px;
                }
                .info {
                    @include W-H(347px, 25px);
                    padding-left: 36px;
                    font-size: 0.22rem;
                    color: #fff !important;
                }
            }
        }
        .reward {
            position: relative;
        }
        .section3 {
            width: 100%;
            .viewDetail {
                width: 100%;
                padding: 20px 0 26px;
                .btn {
                    @include font('PingFangHK-Medium', 0.32rem, 500, #393939);
                    line-height: 22px;
                    text-align: center;
                }
                .downImg {
                    width: 100%;
                    text-align: center;
                    .expand {
                        transform: rotate(-180deg);
                    }
                }
                .detail {
                    width: 347px;
                    padding: 17px;
                    margin: 3px auto 0;
                    background: #fff;
                    border-radius: 8px;
                }
            }
        }
    }
}
</style>
