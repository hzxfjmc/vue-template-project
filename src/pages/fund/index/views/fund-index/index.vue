<template lang="pug">
.block-fund-index
    .block__swiper.block__fund_index_swiper
        van-swipe(:autoplay="10000") 
            van-swipe-item(
                v-for="(item, index) in barnnarHkList" 
                :key="index"  
                @click="goBanner(item)") 
                img(:src="item.picture_url") 
    .block__assets
        .block__left
            .block__left--label 
                span {{$t('accountTotal')}}
                em(
                    class="iconfont" 
                    @click="hideNumber"
                    :class="[moneyShow?'icon-icon-eye':'icon-icon-eye-hide']")
            .block__right
                .block--hold(@click="toRouterAccount")  
                    span {{$t('fundHold')}}
                    em(class="iconfont icon-iconEBgengduoCopy")
        .block__left--number
            .block--element--number(:class="code != 1? 'color-blue':'color-black'" v-if="moneyShow") {{positionAmount}}
            .block--element--number.close--eye(v-else) ******
            .block--element--select(:class="code != 1? 'color-blue':'color-black'") 
                span(@click="handlerCurrency") {{currency===0?$t('hkd'):$t('usd')}}
                em(class="iconfont icon-iconxiala" @click="handlerCurrency")
                em(class="iconfont icon-icon_fund_index_2" @click="handlerDialog")
                .block--master(
                    v-if="chooseCurrencyShow" 
                    @click="chooseCurrencyShow = !chooseCurrencyShow")
                .block__currey(v-if="chooseCurrencyShow")
                    span.border-bottom(
                        @click="chooseCurrency(0)"
                        :class="[currency === 0 ? 'active' :'']") {{$t('hkd')}}
                    span(
                        @click="chooseCurrency(1)"
                        :class="[currency === 1 ? 'active' :'']") {{$t('usd')}}
        
        .block__left__bottom
            span(v-if="moneyShow") {{weekEarnings}} {{currency===0?$t('hkd'):$t('usd')}} {{$t('SevenDayIncome')}}
            span(v-else) **** {{currency===0?$t('hkd'):$t('usd')}} {{$t('SevenDayIncome')}}
        .block__bottom--num.border-top(
            v-if="inTransitOrder !== '0'"
            @click="toOrderList")
            span {{inTransitOrder}}{{$t('fundmsg')}}
            em(class="iconfont icon-previewright")
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
            van-swipe 
                van-swipe-item(
                    v-for="(item, index) in barnnarList" 
                    :key="index") 
                    img(:src="item.bannerUrl") 
        FundListItem(
            :code = "code"
            :bgColor="code !=1 ? '#2B4F80':'#2F79FF'"
            :title="robustFundList.masterTitle"
            v-if="robustFundListShow"
            :fundlist="robustFundList")
        FundListItem(
            :code = "code"
            :fundlist="blueChipFundList"
            :title="blueChipFundList.masterTitle"
            v-if="blueChipFundListShow"
            :bgColor="code != 1 ? '#F1B92D':'#FFBF32'")

        .block-bannar-sub(
            :class="[code != 1 ? 'block__fund-hk' : 'block__fund-ch']"
            v-if="barnnarUsList.length !== 0")
            van-swipe(:autoplay="10000") 
                van-swipe-item(
                    v-for="(item, index) in barnnarUsList" 
                    :key="index"  
                    @click="goBanner(item)") 
                    img(:src="item.picture_url") 
    .fund-echart-render(ref="renderEchartlist")
</template>
<script>
import { Swipe, SwipeItem } from 'vant'
import FundList from './fund-list'
import FundListItem from './fund-list-item'
import { getFundHomepageInfo } from '@/service/finance-info-server'
import { getFundPositionListV3 } from '@/service/finance-server'
import { CURRENCY_NAME } from '@/pages/fund/index/map'
import { transNumToThousandMark, jumpUrl } from '@/utils/tools.js'
import { bannerAdvertisement } from '@/service/news-configserver.js'
import { getStockColorType } from '@/utils/html-utils.js'
import dayjs from 'dayjs'
import F2 from '@antv/f2'
import jsBridge from '@/utils/js-bridge'
import { enablePullRefresh } from '@/utils/js-bridge.js'
import LS from '@/utils/local-storage'
import { mapGetters } from 'vuex'
import { debounce } from '@/utils/tools.js'
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
                '1. 你可选择港币或美元作为基金总资产基础货币。\n2. uSMART会将你所有基金市值按照基础货币来显示和计算。例子: 当你的基础货币为港币时，你的基金总资产 = 港币基金市值 + 美元基金市值(按汇率转换成港币)\n3. 基础货币只是作为uSMART基金资产计算显示之用。不会影响各基金的基金货币。'
        },
        zhCHT: {
            fundHold: '基金持倉',
            SevenDayIncome: '近七日收益',
            hkd: '港幣',
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
                '1. 你可選擇港幣或美元作為基金總資產基礎貨幣。\n2. uSMART會將你所有基金市值按照基礎貨幣來顯示和計算。例子: 當你的基礎貨幣為港幣時，你的基金總資產 = 港幣基金市值 + 美元基金市值(按匯率轉換成港幣)\n3. 基礎貨幣只是作為uSMART基金資產計算顯示之用。不會影響各基金的基金貨幣。'
        },
        en: {
            fundHold: 'Position',
            SevenDayIncome: '7 Days',
            hkd: 'HKD',
            usd: 'USD',
            accountTotal: 'Total Fund Assets',
            fundCurrency: 'Money Market',
            fundBond: 'Bond',
            fundBlend: 'Balanced',
            fundShares: 'Equity',
            login: 'Please login in',
            loginBtn: 'Login',
            openAccountBtn: 'Open account',
            openAccount: 'Please open your account to continue the trade',
            confirm: 'Confirm',
            fundmsg: 'Processing Order',
            msg:
                '1. You can choose HKD or USD as the base currency of total fund assets.\n2. uSMART will display and calculate the market value of all your fund assets in the base currency.Example: When your base currency is HKD, your total fund assets = HKD fund market value + USD fund market value (convert to HKD at latest exchange rate)\n3. The base currency is only used as a display of uSMART fund asset calculations. Does not affect the fund currency of each fund.'
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
            currency: 0,
            moneyShow: true,
            barnnarList: [],
            barnnarUsList: [],
            barnnarHkList: [],
            chooseCurrencyShow: false,
            choiceFundListShow: false,
            blueChipFundListShow: false,
            robustFundListShow: false,
            tabList: [
                {
                    imgUrl: require('@/assets/img/fund/icon_money.png'),
                    imgUrl1: require('@/assets/img/fund/icon_money1.png'),
                    label: '貨幣型',
                    key: 'fundCurrency',
                    value: '4'
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
                    imgUrl: require('@/assets/img/fund/icon_zhexian.png'),
                    imgUrl1: require('@/assets/img/fund/icon_zhexian1.png'),
                    label: '股票型',
                    key: 'fundShares',
                    value: '1'
                }
            ],
            choiceFundList: {}, //精选基金
            blueChipFundList: {}, //绩优基金
            robustFundList: {}, //稳健基金
            hkSummary: {},
            usSummary: {},
            positionAmount: '0.00',
            weekEarnings: '0.00',
            code: null,
            inTransitOrder: '0',
            imgUrl:
                'http://pic11.nipic.com/20101204/6349502_104413074997_2.jpg',
            fundlist: []
        }
    },
    methods: {
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
            jumpUrl(item.news_jump_type, item.jump_url)
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
        async bannerAdvertisement() {
            try {
                const res = await bannerAdvertisement(26)
                const res1 = await bannerAdvertisement(27)
                const res2 = await bannerAdvertisement(100)
                this.barnnarHkList = res.banner_list
                if (res.banner_list.length === 0) {
                    this.barnnarHkList.push({
                        picture_url: require(`@/assets/img/fund/fundImg/${this.lang}/barnner.png`)
                    })
                }
                this.barnnarUsList = res1.banner_list
                this.barnnarList = res2.banner_list
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        //获取持仓
        async getFundPositionListV3() {
            try {
                const {
                    usSummary,
                    hkSummary,
                    inTransitOrder
                } = await getFundPositionListV3()
                this.hkSummary = hkSummary
                this.usSummary = usSummary
                let positionAmout =
                    this.currency === 0
                        ? hkSummary.positionAmount
                        : usSummary.positionAmount
                let weekEarnings =
                    this.currency === 0
                        ? hkSummary.weekEarnings
                        : usSummary.weekEarnings
                this.inTransitOrder = inTransitOrder || '0'
                this.positionAmount = transNumToThousandMark(positionAmout, 2)
                this.weekEarnings = transNumToThousandMark(weekEarnings, 2)
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        handlerCurrency() {
            this.chooseCurrencyShow = true
            document.body.style.overflow = 'hidden'
        },
        chooseCurrency(data) {
            this.currency = data
            LS.put('activeTab', data)
            this.positionAmount =
                data === 0
                    ? transNumToThousandMark(this.hkSummary.positionAmount, 2)
                    : transNumToThousandMark(this.usSummary.positionAmount, 2)
            this.weekEarnings =
                data === 0
                    ? transNumToThousandMark(this.hkSummary.weekEarnings, 2)
                    : transNumToThousandMark(this.usSummary.weekEarnings, 2)
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
                    item.fundSize = item.fundSize / 10000000
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
                let cavas = document.createElement('canvas')
                cavas.style.position = 'fixed'
                cavas.style.top = '0'
                cavas.style.zIndex = '-1'
                cavas.style.opacity = 0
                cavas.id = `chartId${item.fundId}`
                this.$refs.renderEchartlist.appendChild(cavas)
                this.draw(
                    `chartId${item.fundId}`,
                    item.fundHomepagePointList,
                    res => {
                        item.imgUrl = res
                        setTimeout(() => {
                            // if(obj.flag){
                            this.choiceFundListShow = !obj.flag
                            // }

                            this.blueChipFundListShow = !obj.flag2
                            this.robustFundListShow = !obj.flag1
                        }, 200)
                    }
                )
            })
        },
        //创建echart图并生成图片回调出来
        draw(canvasId, data, callback) {
            const chart = new F2.Chart({
                id: canvasId,
                pixelRatio: window.devicePixelRatio
            })
            data.map(item => {
                item.pointData = Number(item.pointData)
            })
            chart.source(data, {
                pointData: {
                    tickCount: 5,
                    min: 0,
                    formatter: function formatter(val) {
                        return Number(val).toFixed(2)
                    }
                },
                belongDay: {
                    type: 'timeCat',
                    range: [0, 1],
                    tickCount: 3,
                    formatter: function formatter(val) {
                        return dayjs(val).format('YYYY-MM-DD')
                    }
                }
            })
            chart.tooltip({
                custom: true,
                showXTip: true,
                showYTip: true,
                snap: true,
                crosshairsType: 'xy',
                crosshairsStyle: {
                    lineDash: [2]
                }
            })
            chart.axis(false)
            chart
                .line()
                .position('belongDay*pointData')
                .color(`${this.stockColorType === 1 ? '#ea3d3d' : '#04ba60'}`)

            chart.render()
            setTimeout(() => {
                let imgUrl = document
                    .getElementById(canvasId)
                    .toDataURL('image/png')
                callback(imgUrl)
            }, 500)
        },
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
        },
        //获取用户归属 1大陆 2香港
        async getSource() {
            try {
                const { code } = await getSource()
                this.code = code
                if (this.isLogin) {
                    this.getFundPositionListV3()
                } else {
                    this.code = this.appType.Hk ? 2 : 1
                }
            } catch (e) {
                this.$toast(e.msg)
            }
        }
    },
    mounted() {
        enablePullRefresh(true)
        this.$refs.renderEchartlist.innerHTML = ''
        this.moneyShow = LS.get('showMoney')
        this.currency = LS.get('activeTab')
        this.initI18n()
        this.getFundHomepageInfo()
        this.bannerAdvertisement()
        jsBridge.callAppNoPromise(
            'command_watch_activity_status',
            {},
            'appVisible',
            'appInvisible'
        )
        // 解决ios系统快速切换tab后，报网络开小差的情况
        window.appVisible = debounce(this.appVisibleHandle, 100)
        this.getSource()
    }
}
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>
