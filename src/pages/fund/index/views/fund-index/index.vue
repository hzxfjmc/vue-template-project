<template lang="pug">
div
    .block-fund-index
        .block__swiper.block__fund_index_swiper
            van-swipe(:autoplay="3000") 
                van-swipe-item(
                    v-for="(item, index) in barnnarHkList" 
                    :key="index"  
                    @click="goBanner(item)") 
                    img(:src="item.picture_url") 
        // && openedAccount
        template
            .block__assets(v-if="isLogin")
                .block__top.border-bottom
                    .block__left--label 
                        span {{$t('protfolloAssets')}}
                        em(
                            class="iconfont" 
                            @click="hideNumber"
                            :class="[moneyShow?'icon-icon-eye':'icon-icon-eye-hide']")
                    .block__right(@click="handlerDialog")
                        span {{$t('aboutAssets')}}
                        em(class="iconfont icon-icon_fund_index_2")
                .block__left--number
                    .block__left--num
                        p {{$t('TotalAssets')}}
                        .block__list-es
                            .block--element--number(
                                :class="code != 1? 'color-blue':'color-black'" 
                                v-if="moneyShow") {{currentPostion.positionTotalAmount|transNumToThousandMark}}
                            .block--element--number.close--eye(v-else) ******
                            .block--element--select(:class="code != 1? 'color-blue':'color-black'") 
                                span(@click="handlerCurrency") {{currencyTab===0?$t('hkd'):$t('usd')}}
                                em(class="iconfont icon-iconxiala" @click="handlerCurrency")
                                .block--master(
                                    v-if="chooseCurrencyShow" 
                                    @click="chooseCurrencyShow = !chooseCurrencyShow")
                                .block__currey(v-if="chooseCurrencyShow")
                                    span.border-bottom(
                                        @click="chooseCurrency(0)"
                                        :class="[currencyTab === 0 ? 'active' :'']") {{$t('hkd')}}
                                    span(
                                        @click="chooseCurrency(1)"
                                        :class="[currencyTab === 1 ? 'active' :'']") {{$t('usd')}}

                    .block__right--yes
                        p {{$t('SevenDayIncome')}}
                        p.num(
                            v-if="moneyShow && currentPostion.weekEarnings>0" 
                            :class="stockColorType == 1 ? 'color-red' : 'color-green'") +{{currentPostion.weekEarnings|transNumToThousandMark}}
                        p.num(
                            v-if="moneyShow && currentPostion.weekEarnings<0" 
                            :class="stockColorType == 1 ? 'color-green' : 'color-red'") {{currentPostion.weekEarnings|transNumToThousandMark}}
                        p.num(
                            v-if="moneyShow && currentPostion.weekEarnings==0") {{currentPostion.weekEarnings|transNumToThousandMark}}
                        p.num(v-if="!moneyShow") ****
                
                .block__left__bottom.border-top
                    .block__bottom--l(@click="toRouterAccount")
                        p {{$t('fund')}}
                            em.num(v-if="moneyShow") {{currentPostion.fundPositionAmount|transNumToThousandMark}}
                            em(v-else) ****
                        em.iconfont.icon-previewright
                    .block__bottom-r(@click="toYxbao")
                    
                        p {{$t('uMoney')}}
                            em.num(v-if="moneyShow && !isWhiteUserBit") {{currentPostion.baoPositionAmount|transNumToThousandMark}}
                            em(v-if="!moneyShow && !isWhiteUserBit") ****
                            em.word(v-if="isWhiteUserBit") :{{$t('tips')}}
                        em.iconfont.icon-previewright(v-if="!isWhiteUserBit")
                    //- span(v-if="moneyShow") {{weekEarnings}} {{currencyTab===0?$t('hkd'):$t('usd')}} {{$t('SevenDayIncome')}}
                    //- span(v-else) **** {{currencyTab===0?$t('hkd'):$t('usd')}} {{$t('SevenDayIncome')}}
           
            .block__assets(v-else)
                .block--assets--header.border-bottom
                    .block--left
                        p {{$t('descFund')}}
                        p {{$t('descFund1')}}
                    .block--right(
                        v-if="!isLogin" 
                        @click="toRouterAccount")
                        .block--button
                            span {{$t('LoginNow')}}
                            em.iconfont.icon-iconEBgengduoCopy
                    .block--right(
                        v-else 
                        @click="toRouterAccount")
                        .block--button
                            span {{$t('OpenAccount')}}
                            em.iconfont.icon-iconEBgengduoCopy
                .block__assets--bottom
                    p {{$t('types')}}
        
        .block-bannar-sub-swiper(v-if="tabbarnnarList.length !== 0")
                van-swipe 
                    van-swipe-item(
                        v-for="(item, index) in tabbarnnarList" 
                        @click="goBanner(item)"
                        :key="index") 
                        img(:src="item.picture_url") 
        .block__tab
            .block__tab--list
                .block__tab--Item(
                    @click="handlerNavItem(item)"
                    v-for="(item,index) in tabList" 
                    :key="index") 
                    img(:src="code !=1 ? item.imgUrl:item.imgUrl1") 
                    span {{item.label}}
        .block__container
            FundList(
                :code = "code"
                v-if="choiceFundListShow"
                :fundlist="choiceFundList")
            .block-bannar-sub-swiper(v-if="barnnarList.length !== 0")
                van-swipe(:autoplay="3000")  
                    van-swipe-item(
                        v-for="(item, index) in barnnarList" 
                        @click="goBanner(item)"
                        :key="index") 
                        img(:src="item.picture_url") 
                        
            .block--yxbao-container(v-if="!isWhiteUserBit")
                .block--title
                    h3 {{$t('uMoney')}}
                    em.iconfont.icon-attention(@click="handlerDesc")
                p.block--desc {{$t('stockRedemption')}}
                .block--bottom-content
                    .left
                        .number(
                            v-if="Number(sevenDaysApy)>0" 
                            :class="stockColorType == 1 ? 'color-red' : 'color-green'") +{{sevenDaysApy}}%
                        .number(
                            v-if="Number(sevenDaysApy)<0" 
                            :class="stockColorType == 1 ? 'color-green' : 'color-red'") {{sevenDaysApy}}%
                        .number(
                            v-if="Number(sevenDaysApy) === 0") {{sevenDaysApy}}%
                        p.block--bottom--desc {{$t('yieldInLast7d')}}
                    .content
                        p.number {{tenThousandApy}}
                        p.block--bottom--desc {{$t('tenKRtn')}}
                    .right
                        van-button(@click="toYxbao").block--subscribe {{$t('SubsNow')}}
                        
            FundListItem(
                :code = "code"
                :bgColor="code !=1 ? '#F1B92D':'#FFBF32'"
                :title="robustFundList.masterTitle"
                v-if="robustFundListShow"
                :fundlist="robustFundList")
                
           
            FundListItem(
                :code = "code"
                :fundlist="blueChipFundList"
                :title="blueChipFundList.masterTitle"
                v-if="blueChipFundListShow"
                :bgColor="code != 1 ? '#2B4F80':'#2F79FF'")

            .block-bannar-sub(
                :class="[code != 1 ? 'block__fund-hk' : 'block__fund-ch']"
                v-if="barnnarUsList.length !== 0")
                van-swipe(:autoplay="3000") 
                    van-swipe-item(
                        v-for="(item, index) in barnnarUsList" 
                        :key="index"  
                        @click="goBanner(item)") 
                        img(:src="item.picture_url") 
                        
        .block__bottom--p
            img(:src="appType.Ch?bottomMsgLogoYxzt:bottomMsgLogoUsmart")
            p {{$t('bottomMsg')}}
            a(href="javascript:void(0);" @click="toDeclareAgreement") {{$t('bottomHref')}}
</template>
<script>
import './index.scss'
import { Swipe, SwipeItem } from 'vant'
import FundList from './fund-list'
import FundListItem from './fund-list-item'
import {
    getFundHomepageInfo,
    getBaoFundInfo
} from '@/service/finance-info-server'
import { getFundTotalPosition } from '@/service/finance-server'
import { CURRENCY_NAME } from '@/pages/fund/index/map'
import { transNumToThousandMark, jumpUrl, debounce } from '@/utils/tools.js'
import { bannerAdvertisement } from '@/service/news-configserver.js'
import { getStockColorType } from '@/utils/html-utils.js'
import jsBridge from '@/utils/js-bridge'
import LS from '@/utils/local-storage'
import { mapGetters } from 'vuex'
import { getFundUserInfo } from '@/service/user-server.js'
import { getSource } from '@/service/customer-relationship-server'
import { i18n } from './i18n'
export default {
    components: {
        [Swipe.name]: Swipe,
        [SwipeItem.name]: SwipeItem,
        FundList,
        FundListItem
    },
    i18n: i18n,
    filters: {
        transNumToThousandMark(value) {
            return transNumToThousandMark(value)
        }
    },
    computed: {
        stockColorType() {
            return +getStockColorType()
        },
        ...mapGetters(['appType', 'lang', 'isLogin', 'openedAccount'])
    },
    data() {
        return {
            currencyTab: 0,
            moneyShow: true,
            barnnarList: [],
            barnnarUsList: [],
            barnnarHkList: [],
            tabbarnnarList: [],
            chooseCurrencyShow: false,
            choiceFundListShow: false,
            blueChipFundListShow: false,
            robustFundListShow: false,
            tabList: [
                {
                    imgUrl: require('@/assets/img/fund/icon_zhexian.png'),
                    imgUrl1: require('@/assets/img/fund/icon_zhexian1.png'),
                    label: '股票型',
                    key: 'fundShares',
                    value: '1'
                },
                {
                    imgUrl: require('@/assets/img/fund/icon_xunzhang.png'),
                    imgUrl1: require('@/assets/img/fund/icon_xunzhang1.png'),
                    label: '債劵型',
                    key: 'fundBond',
                    value: '2'
                },
                {
                    imgUrl: require('@/assets/img/fund/icon_fenpei.png'),
                    imgUrl1: require('@/assets/img/fund/icon_fenpei1.png'),
                    label: '混合型',
                    key: 'fundBlend',
                    value: '3'
                },

                {
                    imgUrl: require('@/assets/img/fund/icon_money.png'),
                    imgUrl1: require('@/assets/img/fund/icon_money1.png'),
                    label: '貨幣型',
                    key: 'fundCurrency',
                    value: '4'
                }
            ],
            choiceFundList: {}, //精选基金
            blueChipFundList: {}, //绩优基金
            robustFundList: {}, //稳健基金
            hkSummary: {},
            usSummary: {},
            currentPostion: {},
            code: null,
            fundlist: [],
            apy: '0',
            bottomMsgLogoUsmart: require('@/assets/img/fund/uSmart.png'),
            bottomMsgLogoYxzt: require('@/assets/img/fund/yxzt.png'),
            tenThousandApy: '',
            sevenDaysApy: '',
            isWhiteUserBit: true
        }
    },
    methods: {
        //获取用户信息
        async getFundUserInfo() {
            try {
                const res = await getFundUserInfo()
                this.userInfo = res
                //白名单
                let isWhiteUserBit = this.userInfo.grayStatusBit
                    .toString(2)
                    .split('')
                    .reverse()
                    .join('')[7]
                this.isWhiteUserBit = true
                if (isWhiteUserBit == 1) {
                    this.isWhiteUserBit = false
                    return
                }
            } catch (e) {
                this.$toast(e.msg)
                console.log('getFundUserInfo:error:>>>', e)
            }
        },
        //获取友信宝详情
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
        //跳转友信宝
        toYxbao() {
            if (this.isWhiteUserBit)
                return this.$dialog.alert({
                    message: this.$t('tips1'),
                    confirmButtonText: this.$t('confirm')
                })
            let url = `${window.location.origin}/wealth/yxbao/index.html#/`
            jumpUrl(3, url)
        },
        //描述
        handlerDesc() {
            this.$dialog.alert({
                title: this.$t('aboutAssets'),
                className: 'block--dialog',
                message: this.$t('msg'),
                firmButtonText: this.$t('iKnow')
            })
        },
        toOrderList() {
            this.openWebView(
                `${window.location.origin}/wealth/fund/index.html#/fund-order-list`
            )
        },
        handlerDialog() {
            this.$dialog.alert({
                title: this.$t('accountTotal'),
                message: this.$t('msg'),
                messageAlign: 'left',
                confirmButtonText: this.$t('confirm')
            })
        },
        hideNumber() {
            this.moneyShow = !this.moneyShow
            LS.put('showMoney', this.moneyShow)
        },
        goBanner(item) {
            if (!item.news_jump_type && !item.jump_url) return
            debounce(jumpUrl(item.news_jump_type, item.jump_url), 300)
        },
        //跳转
        handlerNavItem(item) {
            this.openWebView(
                `${window.location.origin}/wealth/fund/index.html#/index?type=${item.value}`
            )
        },
        //App页面跳转
        async openWebView(url) {
            if (jsBridge.isYouxinApp) {
                jsBridge.gotoNewWebview(url)
            } else {
                location.href = url
            }
        },
        toRouterAccount() {
            // 未登录或未开户
            if (!this.isLogin) {
                this.$dialog
                    .alert({
                        message: this.$t('login'),
                        closeOnClickOverlay: true,
                        overlay: true,

                        confirmButtonText: this.$t('loginBtn')
                    })
                    .then(() => {
                        jsBridge.gotoNativeModule('yxzq_goto://user_login')
                    })
                return
            }
            if (!this.openedAccount) {
                this.$dialog
                    .alert({
                        message: this.$t('openAccount'),
                        closeOnClickOverlay: true,
                        confirmButtonText: this.$t('openAccountBtn')
                    })
                    .then(() => {
                        jsBridge.gotoNativeModule('yxzq_goto://main_trade')
                    })
                return
            }
            this.openWebView(
                `${window.location.origin}/wealth/fund/index.html#/fund-account`
            )
        },
        //获取轮播
        async bannerAdvertisement(flag) {
            try {
                const res = await bannerAdvertisement(26)
                const res1 = await bannerAdvertisement(27)
                const res2 = await bannerAdvertisement(100)
                const res3 = await bannerAdvertisement(101)
                this.barnnarHkList = res.banner_list
                if (res.banner_list.length === 0) {
                    let imgUrl =
                        this.code != 1
                            ? require(`@/assets/img/fund/fundImg/${this.lang}/barnner.png`)
                            : require(`@/assets/img/fund/banner1.jpg`)
                    this.barnnarHkList.push({
                        picture_url: imgUrl
                    })
                }
                this.barnnarUsList = res1.banner_list
                this.barnnarList = res2.banner_list
                this.tabbarnnarList = res3.banner_list
            } catch (e) {
                if (flag) {
                    return
                }
                this.$toast(e.msg)
            }
        },
        //获取持仓
        async getFundTotalPosition(flag) {
            try {
                const { usdSummary, hkdSummary } = await getFundTotalPosition()
                this.hkSummary = hkdSummary
                this.usSummary = usdSummary
                this.currentPostion =
                    this.currencyTab === 0 ? hkdSummary : usdSummary
            } catch (e) {
                if (flag) {
                    return
                }
                this.$toast(e.msg)
            }
        },
        handlerCurrency() {
            this.chooseCurrencyShow = true
        },
        chooseCurrency(data) {
            this.currencyTab = data
            LS.put('activeTab', data)
            this.currentPostion =
                this.currencyTab === 0 ? this.hkSummary : this.usSummary

            this.chooseCurrencyShow = false
        },
        async getFundHomepageInfo() {
            try {
                const {
                    fundHomepageThree,
                    fundHomepageOne,
                    fundHomepageFour
                } = await getFundHomepageInfo({
                    moduleBitmap: 15
                })
                let obj = {
                    flag: !fundHomepageOne,
                    flag1: !fundHomepageThree,
                    flag2: !fundHomepageFour
                }
                this.choiceFundList = fundHomepageOne || { data: [] }
                this.blueChipFundList = fundHomepageFour || { data: [] }
                this.robustFundList = fundHomepageThree || { data: [] }
                this.factoryMap_('choiceFundList', obj)
                this.factoryMap_('blueChipFundList', obj)
                this.factoryMap_('robustFundList', obj)
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        //工厂模式批量生成图片并插入数组中
        factoryMap_(type, obj) {
            let arr_ = {
                choiceFundList: this.choiceFundList,
                blueChipFundList: this.blueChipFundList,
                robustFundList: this.robustFundList
            }
            arr_[type].data.map(item => {
                if (this.code !== 1 && this.lang === 'en') {
                    item.fundSize = item.fundSize / 1000000000
                } else {
                    item.fundSize = item.fundSize / 100000000
                }
                item.fundSize = transNumToThousandMark(item.fundSize, 2)
                item.initialInvestAmount = transNumToThousandMark(
                    Number(item.initialInvestAmount).toFixed(0),
                    0
                )
                item.tradeCurrency =
                    CURRENCY_NAME[this.lang][item.tradeCurrency]
                item.fundSizeCurrency =
                    CURRENCY_NAME[this.lang][item.fundSizeCurrency]
                this.choiceFundListShow = !obj.flag
                this.blueChipFundListShow = !obj.flag2
                this.robustFundListShow = !obj.flag1
            })
        },
        //创建echart图并生成图片回调出来
        initI18n() {
            this.tabList.map(item => {
                item.label = this.$t(item.key)
            })
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
            this.getSource(true)
        },
        //获取用户归属 1大陆 2香港
        async getSource(flag) {
            try {
                const { code } = await getSource()
                this.code = code
                if (this.isLogin) {
                    this.getFundUserInfo()
                    this.getFundTotalPosition(flag)
                } else {
                    this.code = this.appType.Hk ? 2 : 1
                }
                this.bannerAdvertisement(flag)
            } catch (e) {
                //解决ios上出现网络开小差的问题
                if (flag) {
                    return
                }
                this.$toast(e.msg)
            }
        },
        toDeclareAgreement() {
            let url = `${window.location.origin}/wealth/fund/index.html#/declare-agreement`
            this.openWebView(url)
        }
    },
    async created() {
        this.getBaoFundInfo()
        this.moneyShow = LS.get('showMoney')
        this.currencyTab = !LS.get('activeTab') ? 0 : LS.get('activeTab')
        this.initI18n()
        jsBridge.callAppNoPromise(
            'command_watch_activity_status',
            {},
            'appVisible',
            'appInvisible'
        )
        // 解决ios系统快速切换tab后，报网络开小差的情况
        window.appVisible = debounce(this.appVisibleHandle, 300)
        await this.getFundHomepageInfo()
        this.getSource(false)
        this.getFundUserInfo()
    }
}
</script>
<style lang="scss" scoped>
@import './index.scss';
.fund-echart-render {
    height: 65px;
    width: 70px;
}
.block__bottom--p {
    width: 90%;
    margin: 20px 5%;
    img {
        height: 12px;
        margin: 0 auto 20px;
        display: block;
    }
    p {
        font-size: 12px;
        line-height: 17px;
        text-align: justify;
        color: #999999;
        margin-bottom: 20px;
    }
    a {
        text-align: center;
        font-size: 12px;
        display: block;
        padding-bottom: 20px;
        color: $hk-text-line-color;
    }
}
</style>
