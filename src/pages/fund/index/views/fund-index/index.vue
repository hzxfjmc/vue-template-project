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
                            em.num(v-if="moneyShow") {{currentPostion.baoPositionAmount|transNumToThousandMark}}
                            em(v-else) ****
                        em.iconfont.icon-previewright
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
            FundListItem(
                :code = "code"
                :bgColor="code !=1 ? '#F1B92D':'#FFBF32'"
                :title="robustFundList.masterTitle"
                v-if="robustFundListShow"
                :fundlist="robustFundList")
                
            .block--yxbao-container
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
                            :class="stockColorType == 1 ? 'color-green' : 'color-red'") -{{sevenDaysApy}}%
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
import { getSource } from '@/service/customer-relationship-server'
export default {
    components: {
        [Swipe.name]: Swipe,
        [SwipeItem.name]: SwipeItem,
        FundList,
        FundListItem
    },
    i18n: {
        zhCHS: {
            unit: '亿',
            fundHold: '基金持仓',
            SevenDayIncome: '近七日收益',
            hkd: '港币',
            usd: '美元',
            accountTotal: '基金总资产',
            fundCurrency: '货币型',
            fundBond: '债券型',
            fundBlend: '混合型',
            fundShares: '股票型',
            confirm: '确认',
            login: '请登录后进行操作 ',
            loginBtn: '立即登录',
            openAccountBtn: '立即开户',
            fundmsg: '笔交易确认中',
            openAccount: '您尚未开户，开户成功即可交易',
            msg:
                '1. 你可选择港币或美元作为基金总资产基础货币。\n2. uSMART会将你所有基金市值按照基础货币来显示和计算。例子: 当你的基础货币为港币时，你的基金总资产 = 港币基金市值 + 美元基金市值(按汇率转换成港币)\n3. 基础货币只是作为uSMART基金资产计算显示之用。不会影响各基金的基金货币。',
            bottomMsg:
                '基金过往业绩不预示未来表现，不构成投资建议，市场有风险,投资需谨慎。内容未经证券及期货事务监察委员会审阅。',
            bottomHref: '免责声明/风险披露',
            bottomMsg1:
                '*本网页所载有及/或提供之数据仅供一般参考之用, 并不构成, 亦无意作为, 也不应被诠释为专业意见、要约、招揽或建议投资于此资料内所述之任何基金或投资产品。投资者须注意, 所有投资涉及风险(包括可能会失投资本金), 基金及投资产品之价格可升可跌, 而所呈列的过往表现资料并不表示将来亦会有类似的表现。投资者在作出任何投资决定前, 应详细阅读相关基金及投资产品之销售文件及条款细则(包括当中所载之风险因素之全文)。',
            bottomMsg2:
                '投资者须基于本身的财政状况、投资经验、投资目标及预期回报而做出投资决定, 在有需要的情况下, 作任何投资前咨询独立专业顾问。本网页信息由友信证券有限公司(“友信证券”) 提供，保留随时修改而不作另行通知, 内容未经证券及期货事务监察委员会审阅。',
            SubsNow: '立即转入',
            tenKRtn: '万元收益',
            uMoney: '友信宝',
            stockRedemption: '闲置资金可赚钱，赎回立即可购买股票',
            descFund: '智选基金，',
            descFund1: '让你的钱聪明起来',
            LoginNow: '立即登录',
            OpenAccount: '立即开户',
            types: '多种类型，投资全球',
            protfolloAssets: '我的组合资产',
            aboutAssets: '资产币种说明',
            TotalAssets: '总资产',
            fund: '基金',
            iKnow: '我知道了',
            yieldInLast7d: '近七日年化'
        },
        zhCHT: {
            fundHold: '基金持倉',
            SevenDayIncome: '近七日收益',
            hkd: '港幣',
            unit: '億',
            usd: '美元',
            accountTotal: '基金總資產',
            fundCurrency: '貨幣型',
            fundBond: '債券型',
            fundBlend: '混合型',
            fundShares: '股票型',
            confirm: '確認',
            login: '請登陸後進行操作 ',
            loginBtn: '立即登錄',
            fundmsg: '筆交易確認中',
            openAccountBtn: '立即開戶',
            openAccount: '您尚未開戶，開戶成功即可交易',
            msg:
                '1. 你可選擇港幣或美元作為基金總資產基礎貨幣。\n2. uSMART會將你所有基金市值按照基礎貨幣來顯示和計算。例子: 當你的基礎貨幣為港幣時，你的基金總資產 = 港幣基金市值 + 美元基金市值(按匯率轉換成港幣)\n3. 基礎貨幣只是作為uSMART基金資產計算顯示之用。不會影響各基金的基金貨幣。',
            bottomMsg:
                '基金過往業績不預示未來表現，不構成投資建議，市場有風險,投資需謹慎。內容未經證券及期貨事務監察委員會審閱。',
            bottomHref: '免責聲明/風險披露',
            bottomMsg1:
                '*本網頁所載有及/或提供之數據僅供一般參考之用, 並不構成, 亦無意作為, 也不應被詮釋為專業意見、要約、招攬或建議投資於此資料內所述之任何基金或投資產品。投資者須注意, 所有投資涉及風險(包括可能會失投資本金), 基金及投資產品之價格可升可跌, 而所呈列的過往表現資料並不表示將來亦會有類似的表現。投資者在作出任何投資決定前, 應詳細閱讀相關基金及投資產品之銷售文件及條款細則(包括當中所載之風險因素之全文)。',
            bottomMsg2:
                '投資者須基於本身的財政狀況、投資經驗、投資目標及預期回報而做出投資決定, 在有需要的情況下, 作任何投資前諮詢獨立專業顧問。本網頁信息由友信證券有限公司(“友信證券”) 提供，保留隨時修改而不作另行通知, 內容未經證券及期貨事務監察委員會審閱。',
            SubsNow: '立即轉入',
            tenKRtn: '萬元收益',
            uMoney: '友信寶',
            stockRedemption: '閒置資金可賺錢，贖回立即可購買股票',
            descFund: '智選基金，',
            descFund1: '讓你的錢聰明起來',
            LoginNow: '立即登錄',
            OpenAccount: '立即開戶',
            types: '多種類型，投資全球',
            protfolloAssets: '我的組合資產',
            aboutAssets: '資產幣種說明',
            TotalAssets: '總資產',
            fund: '基金',
            iKnow: '我知道了',
            yieldInLast7d: '近七日年化'
        },
        en: {
            unit: 'B ',
            fundHold: 'Portfolio',
            SevenDayIncome: '7 Days',
            hkd: 'HKD',
            usd: 'USD',
            accountTotal: 'Total Fund Assets',
            fundCurrency: 'MMF',
            fundBond: 'Bond',
            fundBlend: 'Allocation',
            fundShares: 'Equity',
            login: 'Please login in',
            loginBtn: 'Login',
            openAccountBtn: 'Open account',
            openAccount: 'Please open your account to continue the trade',
            confirm: 'Confirm',
            fundmsg: ' Processing Order',
            msg:
                '1. You can choose HKD or USD as the base currencyTab of total fund assets.\n2. uSMART will display and calculate the market value of all your fund assets in the base currencyTab.Example: When your base currencyTab is HKD, your total fund assets = HKD fund market value + USD fund market value (convert to HKD at latest exchange rate)\n3. The base currencyTab is only used as a display of uSMART fund asset calculations. Does not affect the fund currencyTab of each fund.',
            bottomMsg:
                'Past performance is not an indicator of future performance. All investments involve risk. Investors should consider all available information before making any investment decisions.The contents have not been reviewed by the Securities and Futures Commission.',
            bottomHref: 'Disclaimer/Risk Disclosure',
            bottomMsg1:
                'Information provided on these webpages is for general information and reference only and does not constitute nor is it intended to be construed as any professional advice, offer, solicitation, or recommendation to deal in any funds or investment products. Investors should note that all investments involve risks (including the possibility of loss of the capital invested), prices of funds and investment products may go up as well as down and past performance is not indicative of future performance. Investors should read the relevant investment offering documents and terms and conditions (including the full text of the risk factors stated therein) in detail before making any investment decision.',
            bottomMsg2:
                'Investors should make investment decision(s) based on his/her own financial situation, investment experience, investment objectives, and expected return; and if necessary, should seek independent professional advice before making any investment decision(s). This webpage is issued by uSmart Securities Limited and uSmart reserves the rights to make any amendments without prior notice.  The contents have not been reviewed by the Securities and Futures Commission.',
            SubsNow: 'Subs. Now',
            tenKRtn: '10K Rtn',
            uMoney: 'uMoney',
            stockRedemption: 'It can buy stock immediately after redemption',
            descFund: 'Smart Fund，',
            descFund1: 'Make your money smart',
            LoginNow: 'Login Now',
            OpenAccount: 'Open Account',
            types: 'Multiple types, Invest globally',
            protfolloAssets: 'My Portfolio Assets',
            aboutAssets: 'About Your Assets',
            TotalAssets: 'Total Assets',
            fund: 'Fund',
            iKnow: 'Got it',
            yieldInLast7d: 'Yield in Last 7d'
        }
    },
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
            imgUrl:
                'http://pic11.nipic.com/20101204/6349502_104413074997_2.jpg',
            fundlist: [],
            apy: '0',
            bottomMsgLogoUsmart: require('@/assets/img/fund/uSmart.png'),
            bottomMsgLogoYxzt: require('@/assets/img/fund/yxzt.png'),
            tenThousandApy: '',
            sevenDaysApy: ''
        }
    },
    methods: {
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
            let url = `${window.location.origin}/wealth/yxbao/index.html#/`
            jumpUrl(3, url)
        },
        //描述
        handlerDesc() {
            this.$dialog.alert({
                title: this.$t('aboutAssets'),
                className: 'block--dialog',
                message:
                    '1.总资产是您基金资产和友信宝资产的总和\n2.你可选择港币或美元作为基金总资产基础货币。uSMART会将你所有基金市值按照基础货币来显示和计算。例子:当你的基础货币为港币时，你的基金总资产=港币基金市值+美元基金市值(按汇率转换成港币)\n3.基础货币只是作为uSMART基金资产计算显示之用。不会影响各基金的基金货币。',
                confirmButtonText: this.$t('iKnow')
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
