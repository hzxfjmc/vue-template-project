<template lang="pug">
    .bond-index-wrapper
        .block-banner(v-if="bannerList.length != 0")
            van-swipe(:autoplay="3000") 
                van-swipe-item(
                    v-for="(item, index) in bannerList" 
                    :key="index" 
                    @click="goBanner(item)") 
                    img(:src="item.picture_url") 
        .yx-scroll-container(
            :class="{bottom: isPhoneX}"
        )
            .scroll-header.border-bottom(
                :class="[{'small-font': isEn},bannerList.length>0?'top88':'top0']")
                .scroll-header__fixed {{$t('A111')}}
                .scroll-header__scroll(ref="headerScroll")
                    ul.scroll-header__scroll--content
                        li.scroll-header__scroll--item(
                            v-for="(value,key) in headerList"
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
                            @click="goNext(itemObj.fundId, itemObj.fundName || itemObj.title, itemObj.displayLocation)"
                        )
                            .fund-name.ellipse
                                span.ellipse {{itemObj.fundName}}
                            .label
                                fund-tag-type(:title="itemObj.fundRisk" :type="itemObj.fundRiskType")
                                fund-tag-type(:title="$t(itemObj.currency.name)" v-if="$t(itemObj.currency.name)")
                    .scroll-main__scroll(ref="mainScroll" )
                        ul.scroll-main__scroll--content
                            li.scroll-main__row.border-bottom(
                                v-for="item in filterList"
                                @click="goNext(item.fundId, item.fundName || item.title, item.displayLocation)"
                            )
                                template(v-for="key in fundEarningsField")
                                    .scroll-main__row--item(
                                        :class="[stockColorType === 1 ? 'number-red' : 'number-green']"
                                        v-if="item[key]>0&&key === 'threeYear'"
                                    ) {{item[key] | formatNum}}%
                                    .scroll-main__row--item(
                                        :class="[stockColorType === 1 ? 'number-green' : 'number-red']"
                                        v-else-if="item[key]<0&&key === 'threeYear'"
                                    ) {{item[key] | formatNum}}%
                                    .scroll-main__row--item(
                                        v-else-if="key==='initialInvestAmount'"
                                    ) {{item[key]|transNumToThousandMark}}
                                    .scroll-main__row--item(
                                        v-else
                                    ) {{item[key] || '--'}}
                               
            .no-bond-box(v-if="load")
                .no-bond {{ $t('noFund') }}
        
</template>
<script>
import { Swipe, SwipeItem, Button } from 'vant'
import {
    getFundListV2,
    getListFundCompany
} from '@/service/finance-info-server.js'
import FundHeaderTitle from './components/fund-header-title/index.vue'
import { jumpUrl, debounce, transNumToThousandMark } from '@/utils/tools.js'
import { mapGetters } from 'vuex'
import LS from '@/utils/local-storage'
import { getSource } from '@/service/customer-relationship-server'
import SortIcon from './components/sort-icon.vue'
import fundTag from '@/biz-components/fund-tag/index.vue'
import fundTagType from '@/biz-components/fund-tag-type/index.vue'
import BScroll from 'better-scroll'
import { getStockColorType } from '@/utils/html-utils.js'
import { Popup } from 'vant'
import { bannerAdvertisement } from '@/service/news-configserver.js'
export default {
    i18n: {
        zhCHS: {
            allowFixed: '是否定投',
            yes: '是',
            no: '否',
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
            allowFixed: '是否定投',
            yes: '是',
            no: '否',
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
            allowFixed: '是否定投',
            yes: '是',
            no: '否',
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
        transNumToThousandMark,
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
            console.log(Object.keys(this.headerList).slice(0, 4))
            return Object.keys(this.headerList).slice(0, 4)
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
                },
                {
                    label: 'fundCompany'
                },
                {
                    label: 'allowFixed',
                    btnList: [{ key: 'yes', val: 1 }, { key: 'no', val: 0 }]
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
        fundTag,
        'fund-tag-type': fundTagType
    },
    created() {
        this.assetType = this.$route.query.type
        this.currency = this.$route.query.currency
        this.getFundListV2()
        this.bannerAdvertisement()
        this.getListFundCompany()
        window.clickAllFundTitleback = () => {
            this.$router.push({
                path: '/index'
            })
        }
    },
    data() {
        return {
            bannerList: [],
            allowFixed: null,
            headerList: {
                initialInvestAmount: this.$t([
                    '起购金额',
                    '起購金額',
                    'Min Subs'
                ]),
                currencyName: this.$t(['货币', '货币', '货币']),
                threeYear: this.$t(['近三年', '近三年', '3Y']),
                morningRating: this.$t([
                    '晨星评级',
                    '晨星評級',
                    'MorningStar Rating'
                ])
            },
            sortMap: {
                initialInvestAmount: 0,
                currencyName: 0,
                threeYear: 1,
                morningRating: 0
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
                dividendType: [],
                fundCompany: []
            },
            companyList: [],
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
        async bannerAdvertisement() {
            try {
                const res = await bannerAdvertisement(124)
                this.bannerList = res.banner_list
            } catch (e) {
                this.$message.error(e.msg)
            }
        },
        goBanner(item) {
            jumpUrl(item.jumpType, item.jumpUrl)
        },

        handlerSort(key) {
            if (key === 'currencyName') {
                if (this.sortMap[key] === 0) {
                    this.filterList.sort((a, b) => {
                        return b['currency']['type'] - a['currency']['type']
                    })
                    this.sortMap[key] = 1
                } else if (this.sortMap[key] === 1) {
                    this.filterList.sort((a, b) => {
                        return a['currency']['type'] - b['currency']['type']
                    })
                    this.sortMap[key] = 2
                } else {
                    this.resetSortMap()
                    this.filterList.sort((a, b) => {
                        return b.threeYear - a.threeYear
                    })
                }
            }
            if (key != 'currencyName') {
                if (this.sortMap[key] === 0) {
                    for (let obj in this.sortMap) {
                        if (obj == key) {
                            this.sortMap[obj] = 1
                        } else {
                            this.sortMap[obj] = 0
                        }
                    }
                    this.filterList.sort((a, b) => {
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
                    this.filterList.sort((a, b) => {
                        return a[key] - b[key]
                    })
                } else {
                    this.resetSortMap()
                    this.filterList.sort((a, b) => {
                        return b.threeYear - a.threeYear
                    })
                }
            }
        },

        resetSortMap() {
            this.sortMap = {
                initialInvestAmount: 0,
                currencyName: 0,
                threeYear: 1,
                morningRating: 0
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

        // 获取基金列表
        async getFundListV2() {
            try {
                this.list = []
                const { list } = await getFundListV2({
                    displayLocation: [1, 3],
                    pageNum: this.pageNum,
                    allowFixed: 1,
                    pageSize: this.pageSize,
                    assetType: this.assetType
                })
                this.list = list
                this.list.sort((a, b) => {
                    return b.threeYear - a.threeYear
                })
                const CURRENCY_ENUM = {
                    1: this.$t('USD'),
                    2: this.$t('HKD')
                }
                this.list.map(item => {
                    item.initialInvestAmount = Number(item.initialInvestAmount)
                    item.currencyName = CURRENCY_ENUM[item.currency.type]
                })
                this.filterList = this.list
                this.load = this.list.length == 0
            } catch (e) {
                this.$toast(e.msg)
                console.log('getListFundInfo:error:>>>', e)
            }
        },
        // 获得基金公司列表
        async getListFundCompany() {
            try {
                let data = await getListFundCompany({
                    pageNum: 1,
                    pageSize: 20
                })
                this.companyList = data.list
                this.companyList.forEach(item => {
                    item.label = item.companySampleName
                    item.val = item.companyId
                })
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        goNext(fundId, name, displayLocation) {
            let url = ''
            if (displayLocation === 3) {
                url = `${window.location.origin}/wealth/yxbao/index.html#/yxbao-details?id=${fundId}&displayLocation=3`
            } else {
                url = `${
                    window.location.origin
                }/wealth/fund/index.html#/fund-details?id=${fundId}&name=${encodeURIComponent(
                    name
                )}`
            }
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
.fix {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 99;
}
.block__fund--header {
    position: fixed;
    top: 0;
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
.block-banner {
    width: 100%;
    height: 150px;
    img {
        width: 100%;
        height: 100%;
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
    // position: relative;
}
.yx-scroll-container {
    display: flex;
    flex: 1;
    height: 100%;
    flex-direction: column;
    // margin: 88px 0 0 0;
    &.bottom {
        margin-bottom: 20px;
    }
    .scroll-header {
        position: sticky;
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
    .top0 {
        top: 0px;
    }
    .top88 {
        top: 150px;
    }
    .scroll-main {
        flex: 1;
        overflow: scroll;
        -webkit-overflow-scrolling: touch;
        float: left;
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
                        white-space: nowrap;
                        display: block;
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
    .block__content {
        &:last-child {
            margin-bottom: 70px;
        }
    }
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
        margin-top: 10px;
        width: 109px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
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
body[data-theme='pro-theme'] {
    .btn--item {
        &.active {
            color: $primary-pro-color;
            border: 1px solid $primary-pro-color;
            background: rgba(218, 175, 111, 0.1);
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
    // .right {
    //     background: #0d50d8;
    //     color: #fff;
    // }
}
.number-red {
    color: #ea3d3d;
}

.number-green {
    color: #04ba60;
}
</style>
