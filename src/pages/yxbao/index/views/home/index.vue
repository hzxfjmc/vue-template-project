<template lang="pug">
.block__yxbao--page
    .block__yxbao--header
        .block__yxbao--content
            .block__yxbao--tip {{$t('C3')}}
                em.iconfont(
                    @click="changeHidePadShow"
                    :class="[hidePadShow?'icon-icon-eye':'icon-icon-eye-hide']")
            .block__yxbao--num.block__amount(v-if="hidePadShow") {{positionMarketValue|transNumToThousandMark}}
            .block__yxbao--num(v-else) ****
            .block__yxbao--numtip 
                p {{$t('C4')}} 
                    em.num(v-if="hidePadShow") {{yesterdayEarnings|transNumToThousandMark}}
                    em.num(v-else) ****
                    //- em 元
            .block__yxbao--list
                .block__yxbao--item(@click="toYxbaoPage")
                    p.top {{$t('C6')}} 
                    p.bottom(v-if="hidePadShow") {{tenThousandApy|transNumToThousandMark}}
                    p.bottom(v-else) ****
                .block__yxbao--item(@click="toYxbaoPage")
                    p.top {{$t('C7')}} 
                    p.bottom {{sevenDaysApy|| '0.00'}}
                .block__yxbao--item
                    p.top {{$t('C5')}} 
                    p.bottom(v-if="hidePadShow") {{totalEarnings|transNumToThousandMark}}
                    p.bottom(v-else) ****
            template(v-if="fundId")
                .block__yxbao-btn(v-if="isLogin && positionMarketValue !=0")
                    van-button.btn-color-l(@click="jumpPage('transfer-out',1)") {{$t('C8')}} 
                    van-button.btn-color-r(@click="jumpPage('fund-subscribe',1)") {{$t('C9')}} 
                .block__yxbao-btn(v-else)
                    van-button.btn-color-r.btn-width(@click="jumpPage('fund-subscribe',1)") {{$t('C9')}} 
    .block__yx-tab
        .block__list--item(@click="jumpPage('yxzq_goto://deposit',5)")
            em.iconfont.icon-rujin
            span {{$t('C17')}}     
        .block__list--item(@click="jumpPage('income-details',1)")
            em.iconfont.icon-shouru
            span {{$t('C10')}}         
        .block__list--item(@click="jumpPage('order-list',1)")
            em.iconfont.icon-zijin
            span {{$t('C12')}}                 

    .block-bannar-swiper
        van-swipe(:autoplay="3000")  
            van-swipe-item(
                v-for="(item, index) in banner_list" 
                @click="goBanner(item)"
                :key="index") 
                img(:src="item.picture_url") 

    .block__fund--list
        .block__title {{$t('more')}}
        fundCard(
            v-if="recommendList.length != 0"
            :recommendList="recommendList")

    protocol-popup(
        v-model="protocolVisible"
        :protocolFileList="buyProtocolFileList",
        :fundId="fundId"
        )
    img(
        v-show="false"
        :src="shareIcon"
        ref="moreIcon")
</template>
<script>
import { Swipe, SwipeItem } from 'vant'
import { getBaoPostion } from '@/service/finance-server.js'
import {
    getBaoFundInfo,
    getFundRecommendList
} from '@/service/finance-info-server.js'
import { bannerAdvertisement } from '@/service/news-configserver.js'
import { getFundUserInfo } from '@/service/user-server.js'
import { jumpUrl, transNumToThousandMark } from '@/utils/tools.js'
import fundCard from './fund-card.vue'
import { mapGetters } from 'vuex'
import jsBridge from '@/utils/js-bridge'
import { debounce } from '@/utils/tools.js'
import protocolPopup from './components/protocol-popup'
import env from '@/utils/scheme/env'
export default {
    components: {
        [Swipe.name]: Swipe,
        [SwipeItem.name]: SwipeItem,
        fundCard,
        protocolPopup
    },
    computed: {
        ...mapGetters(['isLogin', 'appType', 'openedAccount', 'lang'])
    },
    i18n: {
        zhCHS: {
            login: '请登录后进行操作 ',
            loginBtn: '立即登录',
            openAccountBtn: '立即开户',
            more: '更多基金',
            openAccount: '您尚未开户，开户成功即可交易'
        },
        zhCHT: {
            login: '請登陸後進行操作 ',
            loginBtn: '立即登錄',
            openAccountBtn: '立即開戶',
            more: '更多基金',
            openAccount: '您尚未開戶，開戶成功即可交易'
        },
        en: {
            login: 'Please login in',
            loginBtn: 'Login',
            openAccountBtn: 'Open account',
            more: 'More',
            openAccount: 'Please open your account to continue the trade'
        }
    },

    filters: {
        transNumToThousandMark(value) {
            return transNumToThousandMark(value)
        }
    },
    data() {
        return {
            banner_list: [],
            recommendList: [],
            hidePadShow: true,
            positionMarketValue: '',
            yesterdayEarnings: '',
            totalEarnings: '',
            fundId: '',
            tenThousandApy: '',
            sevenDaysApy: '',
            shareIcon: require('@/assets/img/yxbao/icon/icon-more.png'),
            protocolVisible: false,
            buyProtocolFileList: [
                { fileName: '交易规则', filePath: 'trade-rule' },
                { fileName: '基金详情', filePath: 'yxbao-details' },
                { fileName: '关于友信宝', filePath: 'yxbao-desc' }
            ],
            userInfo: {}
        }
    },
    async created() {
        this.shareIcon = env.isMainlandBlack
            ? require('@/assets/img/yxbao/icon/icon-more-hk.png')
            : require('@/assets/img/yxbao/icon/icon-more.png')
        this.getFundUserInfo()
        this.bannerAdvertisement()
        await this.getBaoFundInfo()
        this.getBaoPostion()
        this.getFundRecommendList()
        this.setShareButton()
        jsBridge.callAppNoPromise(
            'command_watch_activity_status',
            {},
            'appVisible',
            'appInvisible'
        )
        // 返回刷新页面
        window.appVisible = debounce(this.appVisibleHandle, 300)
        //app点击分享按钮回调
        window.handlerYxbaoShare = async () => {
            this.protocolVisible = true
        }
    },
    methods: {
        //获取用户信息
        async getFundUserInfo() {
            if (!this.isLogin) return
            try {
                const res = await getFundUserInfo()
                this.userInfo = res
                //白名单
                let isWhiteUserBit = this.userInfo.grayStatusBit
                    .toString(2)
                    .split('')
                    .reverse()
                    .join('')[5]
                if (!isWhiteUserBit) {
                    this.fightShow = true
                    return
                }
            } catch (e) {
                this.$toast(e.msg)
                console.log('getFundUserInfo:error:>>>', e)
            }
        },
        //跳转
        async jumpPage(path, type) {
            // 未登录或未开户
            if (!this.isLogin) {
                await this.$dialog.alert({
                    message: this.$t('login'),
                    confirmButtonText: this.$t('loginBtn')
                })
                jsBridge.gotoNativeModule('yxzq_goto://user_login')
                return
            }

            if (!this.openedAccount) {
                // 跳转到开户页面
                await this.$dialog.alert({
                    message: this.$t('openAccount'),
                    confirmButtonText: this.$t('openAccountBtn')
                })
                jsBridge.gotoNativeModule('yxzq_goto://main_trade')
                return
            }
            if (
                !this.userInfo.assessResult ||
                new Date().getTime() >
                    new Date(this.userInfo.validTime).getTime()
            ) {
                let url = `${window.location.origin}/wealth/yxbao/index.html#/risk-assessment?id=${this.fundId}&fundRiskType=1&currencyType=2&displayLocation=3`
                jumpUrl(3, url)
                return
            }
            let url =
                type === 5
                    ? path
                    : `${window.location.origin}/wealth/yxbao/index.html#/${path}?id=${this.fundId}`
            jumpUrl(type, url)
        },
        //bannar图
        async bannerAdvertisement() {
            try {
                const res = await bannerAdvertisement(26)
                this.banner_list = res.banner_list
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        //跳转
        toYxbaoPage() {
            let url = `${window.location.origin}/wealth/yxbao/index.html#/yxbao-details?id=${this.fundId}&displayLocation=3`
            jumpUrl(3, url)
        },
        //获取推荐基金
        async getFundRecommendList() {
            try {
                const res = await getFundRecommendList({
                    displayLocation: this.$route.query.displayLocation || 1,
                    fundId: this.fundId
                })
                this.recommendList = res
                this.recommendList.map(item => {
                    item.apy = Math.floor(item.apy * 10000) / 100
                })
            } catch (e) {
                this.$toast(e.msg)
                console.log('getFundRecommendList:error:>>>', e)
            }
        },
        async appVisibleHandle(data) {
            let re = data
            if (typeof data === 'string') {
                re = JSON.parse(data)
            }
            if (re.data.status !== 'visible') {
                return
            }
            await this.$store.dispatch('initAction')
            this.getBaoPostion()
            this.getFundUserInfo()
        },
        //获取持仓数据
        async getBaoPostion() {
            if (!this.isLogin) return
            try {
                const {
                    positionMarketValue,
                    yesterdayEarnings,
                    totalEarnings
                } = await getBaoPostion({
                    currency: 2
                })
                this.positionMarketValue = Number(positionMarketValue).toFixed(
                    2
                )
                this.yesterdayEarnings = Number(yesterdayEarnings).toFixed(2)

                this.totalEarnings = totalEarnings
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        //获取友信宝详情
        async getBaoFundInfo() {
            try {
                const res = await getBaoFundInfo({
                    currency: 2
                })
                this.fundId = res.fundId
                this.tenThousandApy = res.tenThousandApy
                this.sevenDaysApy = (res.sevenDaysApy * 100).toFixed(4)
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        //设置app分享按钮
        async setShareButton() {
            const base64 = this.$refs.moreIcon.src.replace(
                /^data:image\/(png|ico|jpe|jpeg|gif);base64,/,
                ''
            )
            jsBridge.callApp('command_set_titlebar_button', {
                position: 1, //position取值1、2
                clickCallback: 'handlerYxbaoShare',
                type: 'custom_icon',
                custom_icon: base64
            })
        },
        changeHidePadShow() {
            this.hidePadShow = !this.hidePadShow
        }
    }
}
</script>
<style lang="scss" scoped>
.block__fund--list {
    padding: 0 12px 30px 12px;
    margin: 0 0 20px 0;
}

.block__yxbao--header {
    width: 100%;
    height: 381px;
    display: flex;
    background: linear-gradient(
        360deg,
        rgba(31, 95, 155, 1) 0%,
        rgba(28, 99, 161, 1) 15%,
        rgba(15, 123, 196, 1) 100%
    );
    .block__yxbao--content {
        width: 351px;
        margin: 22px 12px;
        height: 299px;
        background: rgba(186, 211, 255, 0.22);
        box-shadow: -1px 1px 1px 0px rgba(255, 255, 255, 0.29);
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        color: #fff;
        .block__tab--header {
            display: flex;
            flex-direction: column;
            width: 100%;
            align-items: center;
        }
        .block__yxbao--list,
        .block__yxbao-btn {
            display: flex;
            flex-direction: row;
            width: 100%;
            align-items: center;
            justify-content: space-around;
            .block__yxbao--item {
                display: flex;
                flex-direction: column;
                align-items: center;
                .top {
                    font-size: 14px;
                }
                .bottom {
                    font-size: 20px;
                    font-family: yxFontDINPro-Medium;
                }
            }
        }
        .block__yxbao--list {
            margin: 30px 0 0 0;
        }
        .block__yxbao-btn {
            margin: 30px 0 0 0;
            .van-button {
                width: 157px;
                padding: 0;
                border: none;
                font-size: 16px;
                color: rgba(255, 255, 255, 1);
            }
            .btn-width {
                width: 90%;
                margin: 0 5%;
            }
            .btn-color-l {
                background: rgba(4, 89, 162, 0.49);
            }
            .btn-color-r {
                background: rgba(255, 113, 39, 1);
            }
        }
        .block__yxbao--num {
            height: 49px;
            font-size: 38px;
            font-family: DINPro-Medium, DINPro;
            font-weight: 500;
            color: rgba(255, 255, 255, 1);
            line-height: 49px;
        }
        .block__amount {
            font-size: 30px;
        }
        .block__yxbao--tip {
            margin: 18px 0 0 0;
            .iconfont {
                font-size: 15px;
                margin: 0 5px;
            }
        }
        .block__yxbao--numtip {
            height: 26px;
            padding: 2px 10px;
            background: rgba(255, 255, 255, 0.19);
            border-radius: 2px 0px 0px 0px;
            line-height: 24px;
            font-size: 12px;
            position: relative;
            em {
                font-style: normal;
            }
            .num {
                color: #ff7127;
            }
        }
        .block__yxbao--numtip:after {
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-bottom: 6px solid rgba(255, 255, 255, 0.19);
            content: '';
            position: absolute;
            width: 0;
            left: 50%;
            top: -6px;
            transform: translateX(-6px);
        }
    }
}
.block__yx-tab {
    width: 351px;
    height: 92px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.05);
    border-radius: 6px;
    margin: -41px 12px 0 12px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    .block__list--item {
        display: flex;
        flex-direction: column;
        align-items: center;
        .iconfont {
            color: #1078c5;
            font-size: 25px;
        }
    }
}
.block-bannar-swiper {
    width: 351px;
    height: 70px;
    border-radius: 4px;
    display: flex;
    margin: 14px 12px;
    overflow: hidden;
    border: 1px solid red;
}
</style>
