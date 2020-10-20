<template lang="pug">
    .bond-index-wrapper
        FundHeaderTitle.fix(
        :assetType="assetTypetab"
        @handlerCuenrry="handlerCuenrry"
        @handleFilterShow="handleFilterShow"
        )
        .block__fund--header.index-top
            .fund__banner.index-top
                img(:src="bannarTitleUrl" @click="goBarnner")
            .fund__banner2.index-top(v-if="code != 1 && bannerShow")
                img(:src="barnnarUrl")
        .yx-scroll-container(
            :class="{bottom: isPhoneX}"
        )
            .scroll-header.border-bottom(:class="{'small-font': isEn}")
                .scroll-header__fixed {{$t('A111')}}
                .scroll-header__scroll(ref="headerScroll")
                    ul.scroll-header__scroll--content
                        li.scroll-header__scroll--item(
                            v-for="value,key in headerList"
                            :class="[isEn && !fundEarningsField.includes(key) ? 'en' : '']"
                        ) 
                            .item--text(@click="handlerSort(key)") {{value}}
                                .item--sort
                                    SortIcon(
                                        :key="key"
                                        :value="sortMap[key]"
                                    )
            .scroll-main
                .scroll-main-box(v-show="filterList && filterList.length > 0")
                    .scroll-main__fiexed 
                        .scroll-main__fiexed--item.border-bottom(
                            v-for="itemObj in filterList"
                            @click="goNext(itemObj.fundId, itemObj.fundName || itemObj.title)"
                        ) 
                            .fund-name.ellipse
                                span.ellipse {{itemObj.fundName}}
                            .label
                                fund-tag(:title="itemObj.fundRisk")
                                fund-tag(:title="$t(itemObj.currency.name)" v-if="$t(itemObj.currency.name)")
                    .scroll-main__scroll(ref="mainScroll" )
                        ul.scroll-main__scroll--content
                            li.scroll-main__row.border-bottom(
                                v-for="item in filterList"
                                @click="goNext(item.fundId, item.fundName || item.title)"
                            )
                                template(v-for="key in fundEarningsField")
                                    .scroll-main__row--item(
                                        :class="[stockColorType === 1 ? 'number-red' : 'number-green']"
                                        v-if="item[key]>0"
                                    ) {{item[key] | formatNum}}%
                                    .scroll-main__row--item(
                                        :class="[stockColorType === 1 ? 'number-green' : 'number-red']"
                                        v-else-if="item[key]<0"
                                    ) {{item[key] | formatNum}}%
                                    .scroll-main__row--item(
                                        v-else
                                    ) {{item[key] || '--'}}
                                .scroll-main__row--item.center(
                                    :class="{en:isEn}"
                                ) {{item.morningRating || '--'}}
                                template(v-for="key in fundAnalysisfield")
                                    .scroll-main__row--item(
                                        :class="[stockColorType === 1 ? 'number-red' : 'number-green', isEn?'en':'']"
                                        v-if="item[key]>0"
                                    ) {{key=='sharpeRatio3Yr'?'+':''}}{{Number(item[key]).toFixed(2)}}{{key!='sharpeRatio3Yr'?'%':''}}
                                    .scroll-main__row--item(
                                        :class="[stockColorType === 1 ? 'number-green' : 'number-red', isEn?'en':'']"
                                        v-else-if="item[key]<0"
                                    ) {{Number(item[key]).toFixed(2)}}{{key!='sharpeRatio3Yr'?'%':''}}
                                    .scroll-main__row--item(
                                        :class="{en:isEn}"
                                        v-else
                                    ) {{item[key] || '--'}}
            .no-bond-box(v-if="load")
                .no-bond {{ $t('noFund') }}
        van-popup(
            v-model="filterPopupShow"
            position="bottom"
            :style="{height: '85%'}"
            
        )
            .block__content(v-for="item in formFilterList")
                .title {{$t(item.label)}}
                .btn__list
                    .btn--item(
                        v-for="obj in item.btnList"
                        @click="handleChoose(obj, item)"
                        :class="[form[item.label].includes(obj.val) ? 'active': '',]"
                    )
                        span(:class="{en:isEn}") {{item.label=='establishYears'?obj.key:$t(obj.key)}}
            .block__bottom(:class="{bottom : isPhoneX}")
                van-button.left(@click="handleReset") {{$t('reset')}}
                van-button.right(@click="handleClose") {{fundNumStr}}
</template>
<script>
import { Swipe, SwipeItem, Button } from 'vant'
import { getFundListV2 } from '@/service/finance-info-server.js'
import FundHeaderTitle from './components/fund-header-title/index.vue'
import { jumpUrl, debounce } from '@/utils/tools.js'
import { mapGetters } from 'vuex'
import LS from '@/utils/local-storage'
import { getSource } from '@/service/customer-relationship-server'
import jsBridge from '@/utils/js-bridge'
import SortIcon from './components/sort-icon.vue'
import fundTag from '@/biz-components/fund-tag/index.vue'
import BScroll from 'better-scroll'
import { getStockColorType } from '@/utils/html-utils.js'
import { Popup } from 'vant'
export default {
    i18n: {
        zhCHS: {
            noFund: '暂无基金',
            fundAllType: '全部币种',
            fundHkdType: '港币基金',
            FeatureFund: '精选基金',
            fundUsdType: '美元基金',
            HKD: '港币',
            USD: '美元',
            currency: '交易货币',
            riskLevel: '风险等级',
            establishYears: '成立年限 (年)',
            dividendType: '分红类型',
            low: '低风险',
            middleLow: '中低风险',
            middle: '中风险',
            middleHigh: '中高风险',
            high: '高风险',
            accumulate: '累积型',
            cashDividend: '现金分红',
            dividendIvest: '红利再投资',
            reset: '重置'
        },
        zhCHT: {
            noFund: '暫無基金',
            fundAllType: '全部幣種',
            fundHkdType: '港幣基金',
            FeatureFund: '精選基金',
            fundUsdType: '美元基金',
            HKD: '港幣',
            USD: '美元',
            currency: '交易貨幣',
            riskLevel: '風險等級',
            establishYears: '成立年限 (年)',
            dividendType: '分紅類型',
            low: '低風險',
            middleLow: '中低風險',
            middle: '中風險',
            middleHigh: '中高風險',
            high: '高風險',
            accumulate: '累積型',
            cashDividend: '現金分紅',
            dividendIvest: '分紅再投資',
            reset: '重設'
        },
        en: {
            noFund: 'No Data',
            fundAllType: 'ALL CURR',
            fundHkdType: 'HKD',
            FeatureFund: 'Feature Fund',
            fundUsdType: 'USD',
            HKD: 'HKD',
            USD: 'USD',
            currency: 'Transaction Currency',
            riskLevel: 'Risk Level',
            establishYears: 'Years Since Inception (Year)',
            dividendType: 'Dividend Method',
            low: 'Low Rsik',
            middleLow: 'Medium Low Risk',
            middle: 'Medium Risk',
            middleHigh: 'Medium High Risk',
            high: 'High Risk',
            accumulate: 'Accumulation',
            cashDividend: 'Cash',
            dividendIvest: 'Reinvest',
            reset: 'Reset'
        }
    },
    filters: {
        formatNum(val) {
            return Number(val * 100).toFixed(2)
        }
    },
    computed: {
        ...mapGetters(['appType', 'lang', 'isLogin']),
        stockColorType() {
            return +getStockColorType()
        },
        fundNumStr() {
            return this.$t([
                `查看(${this.filterList.length}只)基金`,
                `查看(${this.filterList.length}只)基金`,
                `Check(${this.filterList.length})Funds`
            ])
        },
        isPhoneX() {
            return (
                /iphone/gi.test(window.navigator.userAgent) &&
                window.screen.height >= 812
            )
        },
        isEn() {
            return this.lang === 'en'
        },
        fundEarningsField() {
            return Object.keys(this.headerList).slice(0, 4)
        },
        fundAnalysisfield() {
            return Object.keys(this.headerList).slice(5)
        },
        formFilterList() {
            return [
                {
                    label: 'currency',
                    btnList: [
                        {
                            key: 'HKD',
                            val: 2
                        },
                        {
                            key: 'USD',
                            val: 1
                        }
                    ]
                },
                {
                    label: 'riskLevel',
                    btnList: [
                        {
                            key: 'low',
                            val: 1
                        },
                        {
                            key: 'middleLow',
                            val: 2
                        },
                        {
                            key: 'middle',
                            val: 3
                        },
                        {
                            key: 'middleHigh',
                            val: 4
                        },
                        {
                            key: 'high',
                            val: 5
                        }
                    ]
                },
                {
                    label: 'establishYears',
                    btnList: [
                        {
                            key: '≤1',
                            val: {
                                begin: 0,
                                end: 1
                            }
                        },
                        {
                            key: '1~3',
                            val: {
                                begin: 1,
                                end: 3
                            }
                        },
                        {
                            key: '3~5',
                            val: {
                                begin: 3,
                                end: 5
                            }
                        },
                        {
                            key: '5~10',
                            val: {
                                begin: 5,
                                end: 10
                            }
                        },
                        {
                            key: '>10',
                            val: {
                                begin: 10,
                                end: 100
                            }
                        }
                    ]
                },
                {
                    label: 'dividendType',
                    btnList: [
                        {
                            key: 'accumulate',
                            val: 1
                        },
                        {
                            key: 'cashDividend',
                            val: 2
                        },
                        {
                            key: 'dividendIvest',
                            val: 3
                        }
                    ]
                }
            ]
        }
    },
    keepalive: true,
    name: 'index',
    components: {
        [Swipe.name]: Swipe,
        [SwipeItem.name]: SwipeItem,
        [Popup.name]: Popup,
        [Button.name]: Button,
        FundHeaderTitle,
        SortIcon,
        fundTag
    },
    created() {
        this.assetType = this.$route.query.type
        this.currency = this.$route.query.currency
        this.getFundListV2()
        window.clickSearchCallBack = () => {
            jsBridge.gotoNativeModule('yxzq_goto://search')
        }
    },
    data() {
        return {
            headerList: {
                threeYear: this.$t(['近三年', '近三年', '3Y']),
                twoYear: this.$t(['近两年', '近两年', '2Y']),
                oneYear: this.$t(['近一年', '近一年', '1Y']),
                toYear: this.$t(['今年来', '今年来', 'YTD']),
                morningRating: this.$t([
                    '晨星评级',
                    '晨星評級',
                    'MorningStar Rating'
                ]),
                sharpeRatio3Yr: this.$t([
                    '夏普比率',
                    '夏普比率',
                    'Sharpe Ratio'
                ]),
                maxDrawDown3Yr: this.$t([
                    '最大回撤',
                    '最大交易回落',
                    'Max Drawdown'
                ]),
                captureRatioUpside3Yr: this.$t([
                    '上行捕获比',
                    '上漲獲利比率',
                    'Upside Capture Ratio'
                ]),
                captureRatioDownside3Yr: this.$t([
                    '下行捕获比',
                    '下跌防禦比率',
                    'Downside Capture Ratio'
                ])
            },
            sortMap: {
                threeYear: 1,
                twoYear: 0,
                oneYear: 0,
                toYear: 0,
                morningRating: 0,
                sharpeRatio3Yr: 0,
                maxDrawDown3Yr: 0,
                captureRatioUpside3Yr: 0,
                captureRatioDownside3Yr: 0
            },
            currencyShow: false,
            barnnarUrl: require('@/assets/img/fund/icon_huobi.png'),
            load: false,
            bannerShow: false,
            bannerUrl: [],
            labelTitle: '',
            active: 'fundAllType',
            currencyList: {
                fundAllType: {
                    label: '全部币种',
                    value: null
                },
                fundHkdType: {
                    label: '港币基金',
                    value: 2
                },
                fundUsdType: {
                    label: '美元基金',
                    value: 1
                }
            },
            list: [],
            filterList: [],
            pageNum: 1,
            pageSize: 1000,
            total: 0,
            currency: '',
            form: {
                currency: [],
                riskLevel: [],
                establishYears: [],
                dividendType: []
            },
            assetType: '',
            code: 0,
            assetTypetab: '',
            flag: '',
            bannarTitleUrl: null,
            searchButtonShow: false,
            filterPopupShow: false
        }
    },
    mounted() {
        this.$nextTick(() => {
            let headerScroll = new BScroll(this.$refs.headerScroll, {
                scrollX: true,
                // tap: 'tap',
                // bounce: false,
                // momentum: false,
                // useTransition: false,
                eventPassthrough: 'vertical',
                probeType: 3
            })
            let mainScroll = new BScroll(this.$refs.mainScroll, {
                scrollX: true,
                // tap: 'tap',
                // momentum: false,
                // bounce: false,
                // useTransition: false,
                eventPassthrough: 'vertical',
                probeType: 3
            })
            mainScroll.on('beforeScrollStart', () => {
                this.flag = 'main'
            })
            headerScroll.on('beforeScrollStart', () => {
                this.flag = 'header'
            })
            mainScroll.on('scroll', pos => {
                this.flag === 'main' && headerScroll.scrollTo(pos.x, 0)
            })
            headerScroll.on('scroll', pos => {
                this.flag === 'header' && mainScroll.scrollTo(pos.x, 0)
            })
        })
        this.assetTypetab = this.$route.query.type
        this.getSource()
        this.assetType = this.$route.query.type
        this.currency = this.$route.query.currency
        if (this.$route.query.flag) {
            this.assetTypetab = this.$route.query.flag
        }

        this.getFundListV2()
        this.initI18nState()
        if (this.$route.query.type) {
            this.changeBannarTitle()
        }
        let tab = LS.get('fundListCurrencyTab')
        this.label =
            tab === 'fundUsdType'
                ? this.$t('fundUsdType')
                : tab === 'fundHkdType'
                ? this.$t('fundHkdType')
                : this.$t('fundAllType')
    },
    methods: {
        handlerSort(key) {
            if (this.sortMap[key] === 0) {
                for (let obj in this.sortMap) {
                    if (obj == key) {
                        this.sortMap[obj] = 1
                    } else {
                        this.sortMap[obj] = 0
                    }
                }
                this.list.sort((a, b) => {
                    return b[key] - a[key]
                })
            } else if (this.sortMap[key] === 1) {
                for (let obj in this.sortMap) {
                    if (obj == key) {
                        this.sortMap[obj] = 2
                    } else {
                        this.sortMap[obj] = 0
                    }
                }
                this.list.sort((a, b) => {
                    return a[key] - b[key]
                })
            } else {
                this.resetSortMap()
                this.list.sort((a, b) => {
                    return b.threeYear - a.threeYear
                })
            }
        },
        async handleChoose(obj, item) {
            if (this.form[item.label].includes(obj.val)) {
                let index = this.form[item.label].indexOf(obj.val)
                this.form[item.label].splice(index, 1)
            } else {
                this.form[item.label].push(obj.val)
            }
            this.FilterAction()
        },
        FilterAction() {
            this.filterList = this.list.filter(item => {
                if (
                    this.form.currency.length == 0 ||
                    this.form.currency.includes(item.currency.type)
                ) {
                    return true
                }
            })
            this.filterList = this.filterList.filter(item => {
                if (
                    this.form.riskLevel.length == 0 ||
                    this.form.riskLevel.includes(item.fundRiskType)
                ) {
                    return true
                }
            })
            this.filterList = this.filterList.filter(item => {
                let flag = false
                for (let i = 0; i < this.form.establishYears.length; i++) {
                    if (
                        item.establishYears &&
                        (item.establishYears >
                            this.form.establishYears[i].begin &&
                            item.establishYears <=
                                this.form.establishYears[i].end)
                    ) {
                        flag = true
                    }
                }
                return this.form.establishYears.length == 0 ? true : flag
            })
            this.filterList = this.filterList.filter(item => {
                if (
                    this.form.dividendType.length == 0 ||
                    this.form.dividendType.includes(item.dividendType)
                ) {
                    return true
                }
            })
            this.load = this.filterList.length == 0
        },
        handleReset() {
            this.ResetForm()
            this.filterList = this.list
            this.load = this.filterList.length == 0
        },
        ResetForm() {
            for (let key in this.form) {
                this.form[key] = []
            }
        },
        resetSortMap() {
            this.sortMap = {
                threeYear: 1,
                twoYear: 0,
                oneYear: 0,
                toYear: 0,
                morningRating: 0,
                sharpeRatio3Yr: 0,
                maxDrawDown3Yr: 0,
                captureRatioUpside3Yr: 0,
                captureRatioDownside3Yr: 0
            }
        },
        handleClose() {
            this.filterPopupShow = false
        },
        goBarnner() {
            //大陆版本banner不跳转
            if (this.code === 1) {
                let obj = [
                    'http://shence.youxin.com:8106/r/uQ',
                    'https://m.yxzq.com/marketing/fund-investment/index.html?register-ct=ecp&register-cid=1896#/stock',
                    'https://m.yxzq.com/marketing/fund-investment/index.html?register-ct=ecp&register-cid=1896#/fund',
                    'https://m.yxzq.com/marketing/fund-investment/index.html?register-ct=ecp&register-cid=1896#/mixin',
                    'https://m.yxzq.com/marketing/fund-investment/index.html?register-ct=ecp&register-cid=1896#/money'
                ]
                if (this.assetType) {
                    jumpUrl(3, obj[this.assetType])
                } else {
                    jumpUrl(3, obj[0])
                }
                return
            }
            let jump_url = [
                `${window.location.origin}/marketing/smart-fund/index.html?tabsName=equity#/`,
                `${window.location.origin}/marketing/smart-fund/index.html?tabsName=equity#/`,
                `${window.location.origin}/marketing/smart-fund/index.html?tabsName=bond#/`,
                `${window.location.origin}/marketing/smart-fund/index.html?tabsName=balanced#/`,
                `${window.location.origin}/marketing/smart-fund/index.html?tabsName=moneyMarket#/`
            ]
            if (this.assetType) {
                // console.log(jump_url[this.assetType])
                debounce(jumpUrl(3, jump_url[this.assetType]), 300)
            } else {
                debounce(jumpUrl(3, jump_url[0]), 300)
            }
        },
        //获取用户归属 1大陆 2香港
        async getSource() {
            try {
                const { code } = await getSource()
                if (this.isLogin) {
                    this.code = code
                } else {
                    this.code = this.appType.Hk ? 2 : 1
                }
                this.bannarTitleUrl =
                    this.code != 1
                        ? require(`@/assets/img/fund/fundImg/${this.lang}/fundAll.png`)
                        : require(`@/assets/img/fund/fundImg/${this.lang}/fundAll1.png`)
                if (this.$route.query.type) {
                    this.changeBannarTitle()
                }
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        handlerCuenrry(data) {
            this.currencyShow = false
            // 0：tab切换 1：货币切换
            if (data.flag !== '0') {
                this.assetType = data.assetType
            }
            this.bannerShow = data.assetType === '4' || data.assetType === '2'
            this.barnnarUrl =
                data.assetType === '4'
                    ? require(`@/assets/img/fund/fundImg/${this.lang}/huobi.png`)
                    : require(`@/assets/img/fund/fundImg/${this.lang}/zhaiquan.png`)
            if (data.key) {
                this.bannarTitleUrl =
                    this.code != 1
                        ? require(`@/assets/img/fund/fundImg/${this.lang}/${data.key}.png`)
                        : require(`@/assets/img/fund/fundImg/${this.lang}/${data.key}1.png`)
            }
            this.resetSortMap()
            this.ResetForm()
            this.getFundListV2()
        },
        handleFilterShow() {
            this.filterPopupShow = true
        },
        // 获取基金列表
        async getFundListV2() {
            try {
                this.list = []
                const { list } = await getFundListV2({
                    displayLocation: 1,
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    assetType: this.assetType
                })
                this.list = list
                this.list.sort((a, b) => {
                    return b.threeYear - a.threeYear
                })
                this.filterList = this.list
                this.load = this.list.length == 0
            } catch (e) {
                this.$toast(e.msg)
                console.log('getListFundInfo:error:>>>', e)
            }
        },
        goNext(fundId, name) {
            let url = `${
                window.location.origin
            }/wealth/fund/index.html#/fund-details?id=${fundId}&name=${encodeURIComponent(
                name
            )}`
            debounce(jumpUrl(3, url), 300)
        },
        changeBannarTitle() {
            let bannarEmun = {
                1: 'fundShares',
                2: 'fundBond',
                3: 'fundBlend',
                4: 'fundCurrency'
            }
            this.bannarTitleUrl =
                this.code != 1
                    ? require(`@/assets/img/fund/fundImg/${this.lang}/${
                          bannarEmun[this.$route.query.type]
                      }.png`)
                    : require(`@/assets/img/fund/fundImg/${this.lang}/${
                          bannarEmun[this.$route.query.type]
                      }1.png`)
            this.bannerShow = this.assetType === '4' || this.assetType === '2'
            this.barnnarUrl =
                this.assetType === '4'
                    ? require(`@/assets/img/fund/fundImg/${this.lang}/huobi.png`)
                    : require(`@/assets/img/fund/fundImg/${this.lang}/zhaiquan.png`)
        },
        initI18nState() {
            for (let key in this.currencyList) {
                this.currencyList[key].label = this.$t(key)
            }
        }
    }
}
</script>
<style lang="scss" scoped>
$fixed-width: 179px;
$item-width: 105px;
$max-item-width: 150px;
$row-height: 60px;
$global-padding: 30px;
.bond-index-wrapper {
    padding-top: 42px;
}
.fix {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 99;
}
.bond-index-wrapper {
    // padding-bottom: 77px;
    display: flex;
    flex-direction: column;
    /*height: 100%;
    overflow: hidden;*/
    .banner {
        width: 375px;
        height: 150px;
        a {
            display: block;
            height: 100%;
            img {
                height: 100%;
                width: 100%;
            }
        }
    }
    .bond-list {
        padding: 0 10px;
        /*height: 600px;*/
        // float: left;
        /*overflow: auto;*/
    }
    .no-data {
        padding: 10px 0 7px;
        color: $text-color3;
        font-size: 0.24rem;
        line-height: 17px;
        text-align: center;
    }
    .no-bond-box {
        padding-top: 150px;
        .no-bond {
            width: 130px;
            height: 120px;
            margin: 0 auto;
            padding-top: 100px;
            background: url('~@/assets/img/bond/icon-nobond.png') center 15px
                no-repeat;
            background-size: 110px;
            color: $text-color3;
            font-size: 0.28rem;
            line-height: 20px;
            text-align: center;
            box-sizing: border-box;
        }
    }
}
.fund__banner {
    width: 100%;
    img {
        width: 100%;
    }
}
.fund__banner2 {
    width: 90%;
    margin: 17px 5%;
    img {
        width: 100%;
    }
}
.index-top {
    z-index: 9;
    position: relative;
}
.yx-scroll-container {
    display: flex;
    flex: 1;
    height: 100%;
    flex-direction: column;
    &.bottom {
        margin-bottom: 20px;
    }
    .scroll-header {
        position: sticky;
        top: 42px;
        background: #fff;
        width: 100%;
        display: flex;
        overflow: hidden;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        line-height: 20px;
        font-size: 14px;
        z-index: 999;
        &.small-font {
            font-size: 12px;
        }
        &__fixed {
            display: flex;
            align-items: center;
            padding-left: 12px;
            z-index: 1000;
            width: $fixed-width;
            color: $text-color5;
        }
        &__scroll {
            overflow: hidden;
            flex: 1;
            .scroll-header__scroll--content {
                padding-left: 10px;
                display: inline-block;
                vertical-align: top;
                text-align: center;
                white-space: nowrap;
                .scroll-header__scroll--item {
                    width: $item-width;
                    text-align: right;
                    padding-right: $global-padding;
                    display: inline-block;
                    &.en {
                        width: $max-item-width;
                    }
                    .item--text {
                        display: flex;
                        color: $text-color5;
                        justify-content: flex-end;
                        align-items: center;
                    }
                }
            }
        }
    }
    .scroll-main {
        flex: 1;
        overflow: scroll;
        -webkit-overflow-scrolling: touch;
        background: #fff;
        .scroll-main-box {
            display: flex;
            flex: 1;
            font-size: 16px;
            .scroll-main__fiexed {
                display: inline-block;
                .scroll-main__fiexed--item {
                    width: $fixed-width;
                    height: $row-height;
                    padding-left: 12px;
                    display: flex;
                    justify-content: center;
                    flex-direction: column;
                    .fund-name {
                        align-items: center;
                        justify-content: flex-start;
                        line-height: 22px;
                    }
                    .label {
                        display: flex;
                        padding-left: 5px;
                    }
                }
            }
            .scroll-main__scroll {
                flex: 1;
                overflow: hidden;
                width: 100%;
                font-weight: 600;
                .scroll-main__scroll--content {
                    display: inline-block;
                    .scroll-main__row {
                        height: $row-height;
                        vertical-align: top;
                        white-space: nowrap;
                        display: inline-block;
                        &--item {
                            width: $item-width;
                            text-align: right;
                            line-height: 60px;
                            display: inline-block;
                            padding-right: $global-padding;
                            &.center {
                                text-align: center;
                            }
                            &.en {
                                width: $max-item-width;
                            }
                        }
                    }
                }
            }
        }
    }
}
.van-popup {
    border-radius: 8px 8px 0px 0px;
    .block__bottom {
        &.bottom {
            margin-bottom: 20px;
        }
    }
}
.block__content {
    padding: 20px 12px 0 12px;
    .title {
        font-size: 16px;
        font-weight: 600;
    }
    .btn__list {
        display: flex;
        flex-wrap: wrap;
    }
    .btn--item {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 10px;
        width: 109px;
        height: 40px;
        border-radius: 4px;
        border: 1px solid rgba(25, 25, 25, 0.05);
        &:nth-child(3n + 2) {
            margin: 10px 12px 0 12px;
        }
        &.active {
            color: #2f79ff;
            background: rgba(47, 121, 255, 0.05);
            border-radius: 4px;
            border: 1px solid #2f79ff;
        }
        .en {
            font-size: 12px;
        }
    }
}
.block__bottom {
    width: 100%;
    display: flex;
    position: absolute;
    bottom: 0;
    .van-button {
        flex: 1;
        font-size: 16px;
        border: none;
        border-radius: 0 !important;
    }
    .right {
        background: #0d50d8;
        color: #fff;
    }
}
.number-red {
    color: #ea3d3d;
}

.number-green {
    color: #04ba60;
}
</style>
