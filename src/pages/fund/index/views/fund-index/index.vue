<template lang="pug">
div
    .block-fund-index
        template
            .block__header--linear
                .block-hr
                .block__assets(v-if="isLogin && openedAccount")
                    .block__top
                        .block__left--label 
                            span {{$t('protfolloAssets')}}
                            em(
                                class="iconfont" 
                                @click="hideNumber"
                                :class="[moneyShow?'icon-icon-eye':'icon-icon-eye-hide']")
                        .block__right(@click="handlerDialog")
                            span {{$t('aboutAssets')}}
                            em(class="iconfont icon-iconEBshoucang2 icon_about")
                    .block__left--number
                        .block__left--num
                            p {{$t('TotalAssets')}}
                            .block__list-es
                                .block--element--number.color-black(
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
                            p.subtitle {{$t('SevenDayIncome')}}
                            p.num(
                                v-if="moneyShow && currentPostion.weekEarnings>0" ) +{{currentPostion.weekEarnings|transNumToThousandMark}}
                            p.num(
                                v-if="moneyShow && currentPostion.weekEarnings<0" ) {{currentPostion.weekEarnings|transNumToThousandMark}}
                            p.num(
                                v-if="moneyShow && currentPostion.weekEarnings==0") {{currentPostion.weekEarnings|transNumToThousandMark}}
                            p.num(v-if="!moneyShow") ****
                    
                    .block__left__bottom.border-top-left(v-if="!isWhiteUserBit") 
                        .block__bottom--l.border-right-r(@click="toRouterAccount")
                            p {{$t('fund')}}
                                em.num(
                                    v-if="moneyShow"
                                    :style="h2Style"
                                    ) {{currentPostion.fundPositionAmount|transNumToThousandMark}}
                                em(v-else) ****
                                em.iconfont.icon-previewright.previewright_left
                        .block__bottom-r(@click="toYxbao")
                            p {{$t('uMoney')}}
                                em.num(
                                    v-if="moneyShow && !isWhiteUserBit"
                                    :style="h2baoPositionAmountStyle") {{currentPostion.baoPositionAmount|transNumToThousandMark}}
                                em(v-if="!moneyShow && !isWhiteUserBit") ****
                                em.word(v-if="isWhiteUserBit")  {{$t('tips')}}
                                em.iconfont.icon-previewright(v-if="!isWhiteUserBit")
                    .block__left__bottom.border-top.text-align(
                        v-else
                        @click="toRouterAccount")
                        span {{$t('holdData')}}
                        em.iconfont.icon-previewright
                .block__assets(v-else)
                    .block--assets--header
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
        
                .block__tab
                    .block__tab--list
                        .block__tab--Item(
                            @click="handlerNavItem(item)"
                            v-for="(item,index) in tabList" 
                            :key="index") 
                            img(:src="item.imgUrl1") 
                            span {{item.label}}
                .block-bannar-sub-swiper.second__bannar.block__bannar__Tab(v-if="barnnarList1.length !== 0")
                        van-swipe(:autoplay="3000")
                            van-swipe-item(
                                v-for="(item, index) in barnnarList1"
                                @click="goBanner(item)"
                                :key="index")
                                img(:src="item.picture_url")
                yx-skeleton(
                :loading="!fundBarnnarList.length"
                )
                    .empty(slot="loadingShow")
                        img(src="@/assets/img/fund/empty.png")
                    FundCardSwipper(
                        :fundBarnnarList="fundBarnnarList")
        .block__container
            .block--yxbao-container.margin_top(v-if="!isWhiteUserBit")
                .block--title
                    h3 {{$t('uMoney')}}
                    em.iconfont.icon-iconEBshoucang2(@click="handlerDesc")
                p.block--desc(v-if="lang != 'en'") {{$t('stockRedemption')}}
                p.block--desc.block--desc_en(v-else) {{$t('stockRedemption')}}
                .block--bottom-content(@click="toYxbao")
                    .left
                        .number(v-if="Number(sevenDaysApy)>0")  +{{sevenDaysApy}}%
                        .number(v-else ) {{sevenDaysApy}}%
                        p.block--bottom--desc {{currencyTab===0?$t('hkd'):$t('usd')}} | {{$t('yieldInLast7d')}}
                            span.iconfont.icon-warning
                    .right
                        van-button.block--subscribe {{$t('SubsNow')}}
            
            .block-bannar-sub-swiper.block__bannar__Tab(v-if="barnnarList.length !== 0")
                van-swipe(:autoplay="3000")  
                    van-swipe-item(
                        v-for="(item, index) in barnnarList" 
                        @click="goBanner(item)"
                        :key="index") 
                        img(:src="item.picture_url") 
            FundList(
                :code = "code"
                v-if="choiceFundListShow"
                :fundlist="choiceFundList")
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

            FundArticle
                .block-bannar-sub.block__bannar__Tab(
                    slot="swipper"
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
    getBaoFundInfo,
    getFundSimpleInfoList
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
import FundCardSwipper from './fund-card-swipper'
import FundArticle from './fund-article'
import fundCommonMethods from '../../mixins/fund-common-methods.js'
import yxSkeleton from '@/components/yx-skeleton'
export default {
    mixins: [fundCommonMethods],
    components: {
        [Swipe.name]: Swipe,
        [SwipeItem.name]: SwipeItem,
        FundList,
        FundListItem,
        FundCardSwipper,
        FundArticle,
        yxSkeleton
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
        ...mapGetters(['appType', 'lang', 'isLogin', 'openedAccount']),
        h2Style() {
            // 名称字体变化策略
            let fundName = this.currentPostion.fundPositionAmount || ''
            if (fundName.length > 13) {
                return {
                    fontSize: '10px'
                }
            }
            return {
                fontSize: '12px'
            }
        },
        h2baoPositionAmountStyle() {
            // 名称字体变化策略
            let fundName = this.currentPostion.baoPositionAmount || ''
            if (fundName.length > 13) {
                return {
                    fontSize: '10px'
                }
            }
            return {
                fontSize: '12px'
            }
        }
    },
    data() {
        return {
            currencyTab: 0,
            moneyShow: true,
            barnnarList: [],
            barnnarList1: [],
            barnnarUsList: [],
            tabbarnnarList: [],
            fundBarnnarList: [],
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
            inTransitOrder: '0',
            imgUrl:
                'http://pic11.nipic.com/20101204/6349502_104413074997_2.jpg',
            fundlist: [],
            apy: '0',
            bottomMsgLogoUsmart: require('@/assets/img/fund/uSmart.png'),
            bottomMsgLogoYxzt: require('@/assets/img/fund/yxzt.png'),
            tenThousandApy: '',
            sevenDaysApy: '',
            isWhiteUserBit: false,
            news_list: []
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
                this.isWhiteUserBit = false
                if (isWhiteUserBit == 1) {
                    this.isWhiteUserBit = false
                    return
                }
            } catch (e) {
                this.$toast(e.msg)
                console.log('getFundUserInfo:error:>>>', e)
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
        //跳转现金+
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
                // this.$dialog
                //     .alert({
                //         message: this.$t('login'),
                //         closeOnClickOverlay: true,
                //         overlay: true,

                //         confirmButtonText: this.$t('loginBtn')
                //     })
                //     .then(() => {
                jsBridge.gotoNativeModule('yxzq_goto://user_login')
                // })
                return
            }
            if (!this.openedAccount) {
                // this.$dialog
                //     .alert({
                //         message: this.$t('openAccount'),
                //         closeOnClickOverlay: true,
                //         confirmButtonText: this.$t('openAccountBtn')
                //     })
                //     .then(() => {
                jsBridge.gotoNativeModule('yxzq_goto://main_trade')
                // })
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
                this.barnnarList1 = res.banner_list
                this.barnnarUsList = res1.banner_list
                this.barnnarList = res2.banner_list
                let fundCodeList = []
                res3.banner_list.map(item => {
                    if (item.TagContent) {
                        item.TagContent = JSON.parse(item.TagContent)
                        item.TagContent.sort((a, b) => {
                            return a - b
                        })
                    }
                    if (item.TagType === 2 && item.TagContent) {
                        for (let i of item.TagContent) {
                            const langEUM = {
                                en: 'en',
                                zhCHT: 'tc',
                                zhCHS: 'cn'
                            }
                            i.name = i[langEUM[this.lang]]
                        }
                    }
                    if (item.FundCycle != 0) {
                        item.FundCycleName = this.$t(`${item.FundCycle}`)
                    }
                    if (item.FundCycle != undefined && item.Fund) {
                        fundCodeList.push({
                            fundCode: item.Fund,
                            apyType: item.FundCycle
                        })
                    }
                })
                if (res3.banner_list.length === 0) return
                let fundListInfo = []
                if (fundCodeList.length > 0) {
                    fundListInfo = await getFundSimpleInfoList({
                        fundSimpleInfoApiVOList: fundCodeList
                    })
                }
                const AssetsEumn = {
                    1: this.$t('Equity'),
                    2: this.$t('Bond'),
                    3: this.$t('Balanced'),
                    4: this.$t('MMF'),
                    5: this.$t('Index'),
                    6: this.$t('Financial')
                }

                res3.banner_list.map(item => {
                    fundListInfo.map(items => {
                        if (item.Fund === items.fundCode) {
                            item.apy = items.apy
                            item.assetType = AssetsEumn[items.assetType]
                            item.dividendType =
                                items.dividendType == 2
                                    ? this.$t('DIVIDEND')
                                    : this.$t('NET_PRICE')
                            item.fundSize = this.changeFundSizeLang(
                                items.fundSize,
                                items.fundSizeCurrency
                            )
                            item.initialInvestAmount = this.$t([
                                `${transNumToThousandMark(
                                    items.initialInvestAmount
                                )}${
                                    CURRENCY_NAME[this.lang][
                                        items.tradeCurrency
                                    ]
                                }起`,
                                `${transNumToThousandMark(
                                    items.initialInvestAmount
                                )}${
                                    CURRENCY_NAME[this.lang][
                                        items.tradeCurrency
                                    ]
                                }起`,
                                `Min. ${transNumToThousandMark(
                                    items.initialInvestAmount
                                )}${
                                    CURRENCY_NAME[this.lang][
                                        items.tradeCurrency
                                    ]
                                }`
                            ])
                            item.riskLevel = this.$t('resultList')[
                                items.riskLevel
                            ].type
                        }
                    })
                    const arrList = {
                        1: item.assetType,
                        2: item.initialInvestAmount,
                        3: item.fundSize,
                        4: item.riskLevel,
                        5: item.dividendType
                    }
                    item.TagList = []
                    for (let i of item.TagContent) {
                        item.TagList.push(arrList[i])
                    }
                })
                this.fundBarnnarList = res3.banner_list
            } catch (e) {
                console.log(e)
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
                    fundHomepageTwo,
                    fundHomepageOne,
                    fundHomepageThree
                } = await getFundHomepageInfo({
                    moduleBitmap: 15
                })
                let obj = {
                    flag: !fundHomepageOne,
                    flag1: !fundHomepageTwo,
                    flag2: !fundHomepageThree
                }
                this.choiceFundList = fundHomepageOne || { data: [] }
                this.blueChipFundList = fundHomepageThree || { data: [] }
                this.robustFundList = fundHomepageTwo || { data: [] }
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
                item.initialInvestAmount = transNumToThousandMark(
                    Number(item.initialInvestAmount).toFixed(0),
                    0
                )
                const AssetsEumn = {
                    1: this.$t('Equity'),
                    2: this.$t('Bond'),
                    3: this.$t('Balanced'),
                    4: this.$t('MMF'),
                    5: this.$t('Index'),
                    6: this.$t('Financial')
                }
                if (item.definedLabels) {
                    item.TagList = JSON.parse(
                        JSON.stringify(item.definedLabels)
                    )
                } else {
                    item.TagList = []
                }
                item.assetType = AssetsEumn[item.assetType]
                item.initialInvestAmount = this.$t([
                    `${item.initialInvestAmount}${
                        CURRENCY_NAME[this.lang][item.tradeCurrency]
                    }起`,
                    `${item.initialInvestAmount}${
                        CURRENCY_NAME[this.lang][item.tradeCurrency]
                    }起`,
                    `Min. ${item.initialInvestAmount}${
                        CURRENCY_NAME[this.lang][item.tradeCurrency]
                    }`
                ])
                item.fundSize = this.changeFundSizeLang(
                    item.fundSize,
                    item.fundSizeCurrency
                )

                item.dividendType =
                    item.dividendType == 2
                        ? this.$t('DIVIDEND')
                        : this.$t('NET_PRICE')
                item.riskLevel = this.$t('resultList')[item.riskLevel].type
                const arrList = {
                    1: item.assetType,
                    2: item.initialInvestAmount,
                    3: item.fundSize,
                    4: item.riskLevel,
                    5: item.dividendType
                }
                item.systemLabelsList = []
                item.systemLabels.sort()

                for (let i of item.systemLabels) {
                    item.systemLabelsList.push(arrList[i])
                    item.TagList.push(arrList[i])
                }

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
                    // this.getFundUserInfo()
                    this.getFundTotalPosition(flag)
                } else {
                    this.code = this.appType.Hk ? 2 : 1
                }
                await this.bannerAdvertisement(flag)
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
        if (this.isLogin) {
            this.getFundUserInfo()
        }
    }
}
</script>
<style lang="scss" scoped>
.block--subscribe {
    border: none;
}
/deep/ .van-button::before {
    background-color: #fff;
}
.fund-echart-render {
    height: 65px;
    width: 70px;
}
.block__bottom--p {
    width: 90%;
    margin: 20px 5%;
    img {
        height: 12px;
        margin: 0 auto 10px;
        display: block;
    }
    p {
        font-size: 12px;
        line-height: 17px;
        text-align: justify;
        color: #999999;
        margin-bottom: 14px;
    }
    a {
        text-align: center;
        font-size: 12px;
        display: block;
        padding-bottom: 20px;
        color: rgba(25, 25, 25, 0.45);
        text-decoration: underline;
    }
}
.swipper-img {
    width: 100%;
}
// .block-bannar-sub-swiper {
//     margin: 6px 0 0 0;
// }
.empty {
    padding: 0 12px;
    img {
        width: 100%;
    }
}
</style>
