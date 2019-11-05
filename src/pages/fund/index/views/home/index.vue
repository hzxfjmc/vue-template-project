<template lang="pug">
.home-container
    HomeHeader(
        @handlerCurrency="handlerCurrency"
        @toFundList = "toFundList"
        :lists="list"
        :holdData="holdData")
        .home-banner(slot="banner" v-if="bannerUrl!=''")
            img(:src="bannerUrl")
        HomeFundList(:fundList="fundList" slot="fundList")
</template>
<script>
import HomeHeader from './components/home-header'
import HomeFundList from './components/home-fund-list'
import { getFundPositionList } from '@/service/finance-server.js'
import { getFundListV2 } from '@/service/finance-info-server.js'
import { bannerAdvertisement } from '@/service/news-configserver.js'
import { transNumToThousandMark } from '@/utils/tools.js'
import { getCosUrl } from '@/utils/cos-utils'
import localStorage from '@/utils/local-storage'
import { gotoNewWebView } from '@/utils/js-bridge.js'
export default {
    components: {
        HomeHeader,
        HomeFundList
    },
    data() {
        return {
            holdData: {},
            currency: 2,
            fundList: [],
            list: [],
            bannerUrl: '',
            showPage: 27
        }
    },
    methods: {
        //跳转基金
        toFundList(data) {
            let url = `${
                window.location.origin
            }/wealth/fund/index.html#/?type=${data.type}&currency=${
                this.currency
            }&assetTypeName=${encodeURIComponent(data.assetTypeName)}` // 中文没有编码WebView打不开
            gotoNewWebView(url)
        },
        //获取banner图
        async bannerAdvertisement() {
            try {
                this.showPage = this.currency == 2 ? 27 : 28
                const { banner_list } = await bannerAdvertisement(this.showPage)
                if (banner_list[0]) {
                    const res = await getCosUrl(banner_list[0].picture_url)
                    this.bannerUrl = res
                } else {
                    this.bannerUrl = ''
                }
                console.log(this.bannerUrl)
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
        handlerCurrency(data) {
            this.currency = data
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
        }
    },
    mounted() {
        this.currency =
            localStorage.get('activeTab') != null
                ? localStorage.get('activeTab') == 0
                    ? 2
                    : 1
                : 2
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
