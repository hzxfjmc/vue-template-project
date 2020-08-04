<template lang="pug">
div(:class="bem()")
    div(:class="bem('header')")
        div(:class="bem('content')")
            div(:class="bem('capital')")
                div(:class="bem('total-assets')")
                    p.top {{$t('C66')}}
                        em.iconfont(
                            @click="changeHidePadShow"
                            :class="[hidePadShow?'icon-icon-eye':'icon-icon-eye-hide']")
                    .block__element
                        .element__num(v-if="hidePadShow")
                            p.bottom {{currentPostion.positionAmount|transNumToThousandMark}}
                        .element__num(v-else)
                            p.bottom ****
                        .element__select
                            p.tips(
                                @click="handlerCurrency"
                                )  {{currencyTab === 0 ? $t('hkd') : $t('usd')}}
                                em.iconfont.icon-icon-bottom
                            .block__mask(
                                v-if="chooseCurrencyShow" 
                                @click="chooseCurrencyShow = !chooseCurrencyShow"
                            )
                            .block__currey(v-if="chooseCurrencyShow")
                                        span.border-bottom(
                                            @click="chooseCurrency(0)"
                                            :class="[currencyTab === 0 ? 'active' :'']") {{$t('hkd')}}
                                        span(
                                            @click="chooseCurrency(1)"
                                            :class="[currencyTab === 1 ? 'active' :'']") {{$t('usd')}}
                div(:class="bem('gain')")
                    p.top {{$t('C4')}}
                    .block__container
                        p.bottom.num(
                            v-if="hidePadShow && currentPostion.yesterdayEarnings<=0"
                        ) {{currentPostion.yesterdayEarnings|transNumToThousandMark}}
                        p.bottom.num(
                            v-else-if="hidePadShow && currentPostion.yesterdayEarnings>0"
                        ) +{{currentPostion.yesterdayEarnings|transNumToThousandMark}}
                        p.bottom.num(v-else) ****
            template(v-if="fundId")
                div(
                    :class="bem('button')"
                    v-if="showTransfer"
                    )
                    van-button.btn-color-l(@click="jumpPageIntoOut('transfer-out',1, fundId)") {{$t('C8')}} 
                    van-button.btn-color-r(@click="jumpPageIntoOut('fund-subscribe',1, fundId)") {{$t('C9')}} 
                div(
                    :class="bem('button')"
                    v-else
                    )
                    van-button.btn-color-r.btn-width(@click="jumpPageIntoOut('fund-subscribe',1, fundId)") {{$t('C9')}} 
            div(:class="bem('tabs')")
                div(:class="bem('tabs-item')")(@click="jumpPage('yxzq_goto://deposit',5)")
                    em.iconfont.icon-rujin
                    span {{$t('C17')}}     
                div(:class="bem('tabs-item')")(@click="jumpPage('income-details',1)")
                    em.iconfont.icon-shouru
                    span {{$t('C10')}}         
                div(:class="bem('tabs-item')")(@click="jumpPage('order-list',1)")
                    em.iconfont.icon-zijin
                    span {{$t('orderList')}}
    div(
        :class="bem('fund')"
        v-for="item in baoPositionList"
        )
        div(:class="bem('fund-name')") {{item.fundName}}(
            span {{item.currency === 1 ? $t('usd') : $t('hkd')}})
        div(:class="bem('fund-card')")
            .block__item(v-if="item.hkdPositionMarketValue > 0")
                .item__left
                    p {{ item.currency === 1 ? $t('C89'): $t('C3')}}
                    p.num {{ item.currency === 1 ? item.usdPositionMarketValue : item.hkdPositionMarketValue | transNumToThousandMark}}
                .item__right
                    p {{$t('C4')}}
                    p.num(
                        v-if="item.hkdYesterdayEarnings<=0"
                        :class="{'green': item.hkdYesterdayEarnings < 0}"
                    ) {{ item.currency === 1 ?item.usdYesterdayEarnings : item.hkdYesterdayEarnings | transNumToThousandMark}}
                    p.num.red(
                        v-else-if="item.hkdYesterdayEarnings>0"
                    ) +{{ item.currency === 1 ?item.usdYesterdayEarnings : item.hkdYesterdayEarnings | transNumToThousandMark}}
                    p.num(v-else) 0.00
            .block__item
                .item__left
                    p {{$t('C5')}}
                    p.num(
                        v-if="item.hkdTotalEarnings<=0"
                        :class="{'green': item.hkdTotalEarnings < 0}"
                    ) {{ item.currency === 1 ? item.usdTotalEarnings : item.hkdTotalEarnings | transNumToThousandMark}}
                    p.num.red(
                        v-else-if="item.hkdTotalEarnings>0"
                    ) +{{ item.currency === 1 ? item.usdTotalEarnings : item.hkdTotalEarnings | transNumToThousandMark}}
                    p.num(v-else) 0.00
                .item__center
                    p {{$t('C6')}}
                    p.num {{item.tenThousandApy|transNumToThousandMark}}
                .item__right
                    p(@click="yieldInLast7dClick") {{$t('yieldInLast7d')}}
                        em.iconfont.icon-about_icon
                    p.num {{item.sevenDayApy*100 |transNumToThousandMark}}%
            .block__item.tabs(
                v-if="item.showMore"
                :class="{'around': !showOrderList }"
            )
                .item__list(@click="jumpPageIntoOut('fund-subscribe',1, item.fundId)")
                    .fund__icon.one
                    p {{$t('C9')}}
                .item__list(
                    v-if="showTransfer && item.availableBaoBalance>0"
                    @click="jumpPageIntoOut('transfer-out',1, item.fundId)"
                    )
                    .fund__icon.two
                    p {{$t('C8')}}
                .item__list(
                    v-if="showOrderList"
                    @click="jumpPage('order-list',1, item.fundId)"
                    )
                    .fund__icon.three
                    p {{$t('orderList')}}
                .item__list(
                    @click="goToFundDetails(item.fundId)"
                )
                    .fund__icon.four
                    p {{$t('C90')}}
            .block_more 
                span.iconfont(
                    :class="[item.showMore ? 'icon-icon-top' : 'icon-icon-bottom']"
                    @click="item.showMore = !item.showMore"
                    )
    .block__swiper.block-bannar-swiper(v-if="banner_list.length!==0")
        van-swipe(:autoplay="3000")  
            van-swipe-item(
                v-for="(item, index) in banner_list" 
                @click="goBanner(item)"
                :key="index") 
                img(:src="item.picture_url") 
    img(
        v-show="false"
        :src="aboutIcon"
        ref="aboutIcon")
</template>
<script>
import { Swipe, SwipeItem } from 'vant'
import { getBaoPostionV2 } from '@/service/finance-server.js'
import {
    getBaoFundInfo,
    getBaoFundList
} from '@/service/finance-info-server.js'
import { bannerAdvertisement } from '@/service/news-configserver.js'
import { getFundUserInfo } from '@/service/user-server.js'
import { jumpUrl, transNumToThousandMark } from '@/utils/tools.js'
import { mapGetters } from 'vuex'
import jsBridge from '@/utils/js-bridge'
import { debounce } from '@/utils/tools.js'
import LS from '@/utils/local-storage'
import { createNamespace } from '@/utils/bem'
const [bem] = createNamespace('yxbao')
import { isYouxinApp } from '../../../../../utils/html-utils'
export default {
    components: {
        [Swipe.name]: Swipe,
        [SwipeItem.name]: SwipeItem
    },
    computed: {
        ...mapGetters(['isLogin', 'appType', 'openedAccount', 'lang']),
        showTransfer() {
            return this.isLogin && this.hkSummary.positionAmount > 0
        },
        showOrderList() {
            return this.isLogin && this.openedAccount
        }
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
            login: '請登入後進行操作 ',
            loginBtn: '立即登入',
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
            baoPositionList: [],
            fundList: [],
            baoFundIdlist: [],
            hkSummary: {},
            usSummary: {},
            currentPostion: {
                positionAmount: 0,
                yesterdayEarnings: 0
            },
            hidePadShow: true,
            hideTabs: false,
            chooseCurrencyShow: false,
            refresh: false,
            currencyTab: 0,
            fundId: '',
            tenThousandApy: '',
            sevenDaysApy: '',
            aboutIcon: require('@/assets/img/yxbao/icon/icon-about.png'),
            userInfo: {}
        }
    },
    async created() {
        LS.put('refresh', false)
        this.getFundUserInfo()
        this.bannerAdvertisement()
        await this.getBaoFundInfo()
        await this.getBaoPostionV2()
        this.setAboutButton()
        await this.getBaoFundList()
        this.showPsd = LS.get('showMoney')
        this.currencyTab = !LS.get('activeTab') ? 0 : LS.get('activeTab')
        jsBridge.callAppNoPromise(
            'command_watch_activity_status',
            {},
            'appVisible',
            'appInvisible'
        )
        // 返回刷新页面
        window.appVisible = debounce(this.appVisibleHandle, 300)
        //app点击跳转现金+页面
        window.handlerYxbaoAbout = async () => {
            let url
            if (this.lang === 'zhCHS') {
                url = `${window.location.origin}/marketing/template/index.html#/?pageNo=youxinbao`
            }
            if (this.lang === 'zhCHT') {
                url = `${window.location.origin}/marketing/template/index.html#/?pageNo=Cash_TC`
            }
            if (this.lang === 'en') {
                url = `${window.location.origin}/marketing/template/index.html#/?pageNo=Cash_EN`
            }
            jumpUrl(3, url)
        }
    },
    watch: {
        currencyTab: function(val) {
            if (this.isLogin) {
                this.currentPostion =
                    val === 0 ? this.hkSummary : this.usSummary
            }
        }
    },
    methods: {
        bem,
        goBanner(item) {
            jumpUrl(item.news_jump_type, item.jump_url)
        },
        //获取用户信息
        async getFundUserInfo() {
            if (!this.isLogin) return
            try {
                const res = await getFundUserInfo()
                this.userInfo = res
            } catch (e) {
                this.$toast(e.msg)
                console.log('getFundUserInfo:error:>>>', e)
            }
        },
        async jumpPageIntoOut(path, type, fundId) {
            // 未登录或未开户
            if (!this.isLogin) {
                await this.$dialog.alert({
                    message: this.$t('login'),
                    confirmButtonText: this.$t('loginBtn'),
                    closeOnClickOverlay: true
                })
                jsBridge.gotoNativeModule('yxzq_goto://user_login')
                return
            }
            if (!this.openedAccount) {
                // 跳转到开户页面
                await this.$dialog.alert({
                    message: this.$t('openAccount'),
                    confirmButtonText: this.$t('openAccountBtn'),
                    closeOnClickOverlay: true
                })
                jsBridge.gotoNativeModule('yxzq_goto://main_trade')
                return
            }
            if (
                !this.userInfo.assessResult ||
                new Date().getTime() >
                    new Date(this.userInfo.validTime).getTime()
            ) {
                let url = `${window.location.origin}/wealth/yxbao/index.html#/risk-assessment?id=${fundId}&fundRiskType=1&currencyType=2&displayLocation=3`
                jumpUrl(3, url)
                return
            }

            let url =
                (this.userInfo.extendStatusBit & 16) > 0
                    ? path
                    : `open-permissions`
            jumpUrl(
                type,
                `${window.location.origin}/wealth/yxbao/index.html#/${url}?id=${fundId}`
            )
        },
        //跳转
        async jumpPage(path, type, fundId = '') {
            // 未登录或未开户
            if (!this.isLogin) {
                await this.$dialog.alert({
                    message: this.$t('login'),
                    confirmButtonText: this.$t('loginBtn'),
                    closeOnClickOverlay: true
                })
                jsBridge.gotoNativeModule('yxzq_goto://user_login')
                return
            }

            if (!this.openedAccount) {
                // 跳转到开户页面
                await this.$dialog.alert({
                    message: this.$t('openAccount'),
                    confirmButtonText: this.$t('openAccountBtn'),
                    closeOnClickOverlay: true
                })
                jsBridge.gotoNativeModule('yxzq_goto://main_trade')
                return
            }
            let url =
                type === 5
                    ? path
                    : `${window.location.origin}/wealth/yxbao/index.html#/${path}?id=${fundId}`
            jumpUrl(type, url)
        },
        //bannar图
        async bannerAdvertisement() {
            try {
                const res = await bannerAdvertisement(106)
                this.banner_list = res.banner_list
                console.log(this.banner_list)
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        // 去基金详情
        goToFundDetails(fundId) {
            let url = `${window.location.origin}/wealth/yxbao/index.html#/yxbao-details?id=${fundId}&displayLocation=3`
            jumpUrl(3, url)
        },
        appVisibleHandle(data) {
            setTimeout(async () => {
                this.refresh = LS.get('refresh')
                console.log('refresh======>', this.refresh)
                let re = data
                if (typeof data === 'string') {
                    re = JSON.parse(data)
                }
                if (re.data.status !== 'visible') {
                    return
                }
                await this.$store.dispatch('initAction')
                if (this.refresh) {
                    this.baoPositionList = []
                    await this.getBaoPostionV2()
                    await this.getBaoFundList()
                    LS.put('refresh', false)
                    this.refresh = false
                }
                this.getFundUserInfo()
            }, 0)
        },
        //获取现金+持仓
        async getBaoPostionV2() {
            if (!this.isLogin) return
            try {
                const {
                    baoPositionList,
                    hkSummary,
                    usSummary
                } = await getBaoPostionV2()
                let sortedList = baoPositionList.sort((pre, curr) => {
                    return (
                        curr.hkdPositionMarketValue - pre.hkdPositionMarketValue
                    )
                })
                if (sortedList.length) {
                    this.baoPositionList = sortedList
                    this.baoFundIdlist = sortedList.map(item => item.fundId)
                }
                this.hkSummary = hkSummary
                this.usSummary = usSummary
                this.currentPostion =
                    this.currencyTab === 0 ? hkSummary : usSummary
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        // 获取现金+列表
        async getBaoFundList() {
            try {
                const res = await getBaoFundList()
                //没有持仓过的基金列表
                let noPositionList = res.filter(item => {
                    return this.baoFundIdlist.indexOf(item.fundId) === -1
                })
                noPositionList.forEach(item => {
                    item.sevenDayApy = item.sevenDaysApy
                })
                let baoPositionList = this.baoPositionList.concat(
                    noPositionList
                )
                //持仓金额大于0的基金
                let baoPositionList1 = []
                //持仓金额小于0的基金
                let baoPositionList2 = []
                baoPositionList.forEach(item => {
                    if (
                        item.availableBaoBalance &&
                        item.availableBaoBalance > 0
                    ) {
                        baoPositionList1.push(item)
                    } else {
                        baoPositionList2.push(item)
                    }
                })
                baoPositionList2.sort((pre, curr) => {
                    return curr.sevenDayApy - pre.sevenDayApy
                })
                this.baoPositionList = [].concat(
                    baoPositionList1,
                    baoPositionList2
                )
                this.fundId = this.baoPositionList[0].fundId
                this.baoPositionList.forEach(item => {
                    this.$set(item, 'showMore', false)
                })
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        //获取现金+详情
        async getBaoFundInfo() {
            try {
                const res = await getBaoFundInfo({
                    currency: 2
                })
                this.tenThousandApy = res.tenThousandApy
                this.sevenDaysApy = (res.sevenDaysApy * 100).toFixed(4)
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        async setAboutButton() {
            const base64 = this.$refs.aboutIcon.src.replace(
                /^data:image\/(png|ico|jpe|jpeg|gif);base64,/,
                ''
            )
            if (isYouxinApp) {
                jsBridge.callApp('command_set_titlebar_button', {
                    position: 2, //position取值1、2
                    clickCallback: 'handlerYxbaoAbout',
                    type: 'custom_icon',
                    custom_icon: base64
                })
            }
        },
        changeHidePadShow() {
            this.hidePadShow = !this.hidePadShow
            LS.put('showMoney', this.hidePadShow)
        },
        yieldInLast7dClick() {
            this.$dialog.alert({
                title: this.$t('yieldInLast7d'),
                message: this.$t('yieldInLast7dTips'),
                confirmButtonText: this.$t('iknow'),
                confirmButtonColor: '#3c78fa',
                messageAlign: 'left'
            })
        },
        handlerCurrency() {
            this.chooseCurrencyShow = true
        },
        chooseCurrency(val) {
            this.chooseCurrencyShow = false
            LS.put('activeTab', val)
            this.currencyTab = val
        }
    }
}
</script>
<style lang="scss" scoped>
.yx-yxbao__fund {
    padding: 0 10px;
    .yx-yxbao__fund-name {
        margin-top: 14px;
        font-size: 16px;
        line-height: 22px;
        border-left: 4px solid #ff7127;
        padding-left: 5px;
    }
}
.yx-yxbao__fund-card {
    margin-top: 10px;
    padding: 10px 14px 5px 14px;
    display: flex;
    flex-direction: column;
    border-radius: 6px;
    background-color: $background-color;
    box-shadow: 0px 0px 4px 0px $text-color8;
    color: rgba(0, 0, 0, 0.5);
    font-size: 14px;
    .block__item {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        &:nth-child(2) {
            margin-top: 20px;
        }
        &.tabs {
            justify-content: space-between;
            margin-top: 10px;
            padding: 10px 12px;
            background: rgba(251, 251, 251, 1);
            border-radius: 4px;
        }
        &.around {
            justify-content: space-around;
        }
    }
    .item__right {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        .iconfont {
            font-size: 12px;
        }
    }
    .item__center,
    .item__list {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .item__left,
    .item__right,
    .item__center {
        flex: 1;
    }
    .item__center {
        border-left: 1px solid rgba(0, 0, 0, 0.1);
        border-right: 1px solid rgba(0, 0, 0, 0.1);
    }
    .item__list {
        p {
            padding-top: 2px;
        }
    }
    .line {
        width: 2px;
        background-color: rgba(0, 0, 0, 0.1);
    }
    .num {
        font-size: 18px;
        font-weight: 600;
        color: #383838;
        &.green {
            color: #00ba60;
        }
        &.red {
            color: #ff7127;
        }
    }
    .fund__icon {
        width: 20px;
        height: 20px;
        background-size: 20px 20px;
        &.one {
            background-image: url('~@/assets/img/yxbao/icon/cash_deposit@2x.png');
        }
        &.two {
            background-image: url('~@/assets/img/yxbao/icon/cash_transfer@2x.png');
        }
        &.three {
            width: 21px;
            height: 18px;
            background-size: 21px 18px;
            background-image: url('~@/assets/img/yxbao/icon/cash_record@2x.png');
        }
        &.four {
            width: 18px;
            height: 21px;
            background-size: 18px 21px;
            background-image: url('~@/assets/img/yxbao/icon/cash_detail@2x.png');
        }
    }
    .block_more {
        text-align: center;
        span {
            padding: 4px;
        }
    }
}
.yx-yxbao {
    width: 100%;
    display: flex;
    flex-direction: column;
}
.yx-yxbao__header {
    width: 100%;
    display: flex;
    flex-direction: column;
    background: linear-gradient(
        360deg,
        rgba(254, 150, 98, 0) 0%,
        rgba(255, 161, 133, 1) 35%,
        rgba(255, 138, 102, 1) 62%,
        rgba(254, 113, 39, 1) 100%
    );
}
.yx-yxbao__content {
    width: 351px;
    margin: 22px 12px 0 12px;
    height: 250px;
    background: $background-color;
    box-shadow: -1px 1px 1px 0px rgba(255, 255, 255, 0.29);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: rgba(25, 25, 25, 1);
    .yx-yxbao__button {
        display: flex;
        flex-direction: row;
        width: 100%;
        align-items: center;
        justify-content: space-around;
        margin-top: 20px;
        .van-button {
            width: 157px;
            padding: 0;
            border: none;
            font-size: 16px;
            color: $background-color;
        }
        .btn-width {
            width: 90%;
            margin: 0 5%;
        }
        .btn-color-l {
            background: #ffe9df;
            color: #fe7329;
        }
        .btn-color-r {
            background: rgba(254, 115, 41, 1);
        }
    }
}
.yx-yxbao__capital {
    width: 100%;
    padding: 20px 14px 0 14px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-size: 14px;
    .yx-yxbao__gain {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    }
    .bottom {
        font-size: 34px;
        font-weight: 600;
        line-height: 43px;
        &.num {
            font-size: 16px;
        }
    }
    .iconfont {
        font-size: 15px;
        margin: 0 5px;
        color: #8c8c8c;
    }
}
.block__element {
    display: flex;
    flex-direction: row;
    align-items: center;
    .block__mask {
        position: fixed;
        width: 100%;
        top: 0;
        left: 0;
        z-index: 99999;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
    }
    .element__select {
        position: relative;
    }
    .block__currey {
        position: absolute;
        height: 100px;
        z-index: 9999999;
        border-radius: 4px;
        left: 0px;
        top: 38px;
        background: #fff;
        display: flex;
        justify-content: center;
        flex-direction: column;
        span {
            color: #000;
            width: 60px;
            height: 50px;
            line-height: 50px;
            display: block;
            text-align: center;
        }
        .active {
            color: #2f79ff;
        }
    }
    .block__currey:before {
        content: '';
        width: 0px;
        height: 0px;
        top: -10px;
        left: 50%;
        transform: translate(-50%, 0);
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-bottom: 10px solid #fff;
        position: absolute;
    }
    .tips {
        margin: 4px 0 0 6px;
        padding-left: 6px;
        font-size: 14px;
        line-height: 20px;
        border: 1px solid rgba(0, 0, 0, 0.5);
        border-radius: 11px;
    }
}
.yx-yxbao__tabs {
    width: 100%;
    margin: 20px 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .yx-yxbao__tabs-item {
        width: 33.33%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .iconfont {
            color: #ff7024;
            font-size: 25px;
        }
    }
}
.block__swiper {
    width: 351px;
    height: 70px;
    border-radius: 4px;
    position: relative;
    z-index: 99;
    margin: 14px 12px 4px 12px;
    overflow: hidden;
    img {
        width: 100%;
    }
}
</style>
