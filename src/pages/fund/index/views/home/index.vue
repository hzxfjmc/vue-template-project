<template lang="pug">
.home-container
    HomeHeader(
        @handlerCurrency="handlerCurrency"
        @toFundList = "toFundList"
        :lists="list"
        :holdData="holdData"
        )
        .home-banner(slot="banner" v-if="bannerUrl!=''" @click="goBanner")
            img(:src="bannerUrl")
        HomeFundList(:fundList="fundList" slot="fundList")
</template>
<script>
import HomeHeader from './components/home-header'
import HomeFundList from './components/home-fund-list'
import { getFundPositionList } from '@/service/finance-server.js'
import { getFundListV2 } from '@/service/finance-info-server.js'
import { bannerAdvertisement } from '@/service/news-configserver.js'
import { transNumToThousandMark, jumpUrl } from '@/utils/tools.js'
import { getCosUrl } from '@/utils/cos-utils'
import LS from '@/utils/local-storage'
import { gotoNewWebView } from '@/utils/js-bridge.js'
import { enumCurrency } from '@/pages/fund/index/map'

export default {
    components: {
        HomeHeader,
        HomeFundList
    },
    data() {
        return {
            holdData: {},
            currency: enumCurrency.HKD,
            fundList: [],
            list: [],
            bannerUrl: '',
            showPage: 27,
            market: '',
            active: 0,
            jumpUrl: '',
            jumpType: ''
        }
    },
    methods: {
        goBanner() {
            if (this.jumpUrl) {
                jumpUrl(this.jumpType, this.jumpUrl)
            }
        },
        //跳转基金
        toFundList(data) {
            let url = `${
                window.location.origin
            }/wealth/fund/index.html#/index?type=${data.type}&currency=${
                this.currency
            }&assetTypeName=${encodeURIComponent(data.assetTypeName)}` // 中文没有编码WebView打不开
            gotoNewWebView(url)
        },
        //获取banner图
        async bannerAdvertisement() {
            try {
                this.showPage = this.currency == enumCurrency.HKD ? 26 : 27
                const { banner_list } = await bannerAdvertisement(this.showPage)
                if (banner_list[0]) {
                    const res = await getCosUrl(banner_list[0].picture_url)
                    this.bannerUrl = res
                    this.jumpType = banner_list[0].news_jump_type
                    this.jumpUrl = banner_list[0].jump_url
                } else {
                    this.bannerUrl = ''
                }
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        //查询基金列表
        async getFundListV2() {
            try {
                const { list } = await getFundListV2({
                    displayLocation: 1,
                    pageNum: 1,
                    pageSize: 20,
                    classify: 1,
                    currency: this.currency
                })
                this.fundList = list
                this.fundList.map(item => {
                    item.msg =
                        Number(item.apy) > 0 ? 0 : Number(item.apy) < 0 ? 1 : 2
                    item.apy = item.apy * 100
                })
            } catch (e) {
                this.$toast(e.msg)
                console.log('getFundListV2:error:>>> ', e)
            }
        },
        //切换港币和美元
        handlerCurrency(currency, activeTab) {
            this.currency = currency
            LS.put('activeTab', activeTab)
            this.getFundPositionList()
            this.bannerAdvertisement()
            this.getFundListV2()
        },
        async getFundPositionList() {
            try {
                const {
                    positionAmount,
                    positionEarnings,
                    weekEarnings
                } = await getFundPositionList({
                    currency: this.currency
                })
                this.holdData = {
                    positionAmount: transNumToThousandMark(positionAmount),
                    positionEarnings: transNumToThousandMark(positionEarnings),
                    weekEarnings: transNumToThousandMark(weekEarnings),
                    currency: this.currency
                }
            } catch (e) {
                this.$toast(e.msg)
                console.log('getFundPositionList:error:>>> ', e)
            }
        },
        setCurrencyByMarket(market) {
            let currency = ''
            switch (market) {
                case 'hk':
                    currency = enumCurrency.HKD
                    this.active = 0
                    LS.put('activeTab', this.active)
                    break
                case 'us':
                    currency = enumCurrency.USD
                    this.active = 1
                    LS.put('activeTab', this.active)
                    break
            }
            return currency
        }
    },
    created() {
        LS.remove('activeTab')
        this.market = this.$route.query.market || 'hk'
        this.currency = this.setCurrencyByMarket(this.market)
        this.bannerAdvertisement()
        this.getFundPositionList()
        this.getFundListV2()
    }
}
</script>
<style lang="scss" scoped>
.home-banner {
    width: 100%;
    height: 110px;
    background: #fff;
    padding: 10px;
    img {
        width: 100%;
        height: 100%;
        border-radius: 4px;
    }
}
</style>
