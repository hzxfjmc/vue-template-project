<template lang="pug">
.fund-account-container
    fundAccountHeader(
        @toRouterPath = "toRouterPath"
        @changeEyeTab = "changeEyeTab"
        @handlerCurrency="handlerCurrency"
        :code ="code"
        :inTransitOrder="inTransitOrder"
        :holdData="holdData")
    .fund--list--wrapper
        fundList(
            slot="fundList"
            bgColor="#0091FF"
            currency="2"
            :title = "$t('fundHkdType')"
            v-if="!noMoreShow"
            :code = "code"
            :eyeTab="eyeTab"       
            :amount="hkdPositionAmount"
            :fundList="hkPositionList")
        fundList(
            slot="fundList"
            bgColor="#FFBA00"
            currency="1"
            :title = "$t('fundUsdType')"
            v-if="!noMoreShow"
            :code = "code"
            :eyeTab="eyeTab"    
            :amount="usdPositionAmount"
            :fundList="usPositionList")
    .block-element-nomore(v-if="noMoreShow")
        img.img(src="@/assets/img/fund/empty.png") 
        .no-record-box {{$t('nomore')}}

</template>
<script>
import fundAccountHeader from './components/fund-account-header'
import fundList from './components/fund-list'
import { getFundPositionListV3 } from '@/service/finance-server'
import { transNumToThousandMark } from '@/utils/tools.js'
import LS from '@/utils/local-storage'
import { gotoNewWebView } from '@/utils/js-bridge.js'
import { enumCurrency } from '@/pages/fund/index/map'
import { getSource } from '@/service/customer-relationship-server'
export default {
    data() {
        return {
            holdData: {},
            fundList: [],
            usdPositionAmount: '',
            hkdPositionAmount: '',
            currency: 2,
            noMoreShow: false,
            code: 0,
            hkPositionList: [],
            usPositionList: [],
            inTransitOrder: '',
            eyeTab: LS.get('showMoney')
        }
    },
    i18n: {
        zhCHS: {
            fundHkdType: '港币基金',
            fundUsdType: '美元基金',
            nomore: '暂无持仓'
        },
        zhCHT: {
            fundHkdType: '港幣基金',
            fundUsdType: '美元基金',
            nomore: '暫無持倉'
        },
        en: {
            fundHkdType: 'HKD Fund',
            fundUsdType: 'USD Fund',
            nomore: 'No Holdings'
        }
    },
    components: {
        fundAccountHeader,
        fundList
    },
    methods: {
        toRouterPath(path) {
            let url = `${window.location.origin}/wealth/fund/index.html#${path}?currency=${this.currency}`
            gotoNewWebView(url)
        },
        changeEyeTab(data) {
            this.eyeTab = data
        },
        //切换货币
        handlerCurrency(currency) {
            this.currency = currency
            this.getFundPositionListV3()
        },
        async getFundPositionListV3() {
            const {
                hkPositionList,
                hkSummary,
                usPositionList,
                usSummary,
                hkdPositionAmount,
                usdPositionAmount,
                inTransitOrder
            } = await getFundPositionListV3()
            this.hkPositionList = hkPositionList
            this.usPositionList = usPositionList
            this.inTransitOrder = inTransitOrder || '0'
            this.holdData = {
                hkSummary: hkSummary,
                usSummary: usSummary
            }
            this.usdPositionAmount = transNumToThousandMark(usdPositionAmount)
            this.hkdPositionAmount = transNumToThousandMark(hkdPositionAmount)
            this.usPositionList.map(item => {
                item.currency = item.currency.type
                for (let key in item) {
                    if (
                        key != 'fundId' &&
                        key != 'fundName' &&
                        key != 'currency'
                    ) {
                        item.flag =
                            item['positionEarnings'] > 0
                                ? 0
                                : item['positionEarnings'] < 0
                                ? 1
                                : 2
                        item.flag1 =
                            item['weekEarnings'] > 0
                                ? 0
                                : item['weekEarnings'] < 0
                                ? 1
                                : 2
                    }
                }
            })
            this.usPositionList.map(item => {
                for (let key in item) {
                    if (
                        key === 'inTransitAmount' ||
                        key === 'positionAmount' ||
                        key === 'weekEarnings' ||
                        key === 'positionEarnings'
                    ) {
                        item[key] = transNumToThousandMark(item[key], 2)
                    }
                    if (
                        key === 'redeemDeliveryShare' ||
                        key === 'positionShare'
                    ) {
                        item[key] = transNumToThousandMark(item[key], 4)
                    }
                }
            })
            this.hkPositionList.map(item => {
                item.currency = item.currency.shortSymbol
                for (let key in item) {
                    if (
                        key != 'fundId' &&
                        key != 'fundName' &&
                        key != 'currency'
                    ) {
                        // item[key] = transNumToThousandMark(item[key], 4)
                        item.flag =
                            item['positionEarnings'] > 0
                                ? 0
                                : item['positionEarnings'] < 0
                                ? 1
                                : 2
                        item.flag1 =
                            item['weekEarnings'] > 0
                                ? 0
                                : item['weekEarnings'] < 0
                                ? 1
                                : 2
                    }
                }
            })
            this.hkPositionList.map(item => {
                for (let key in item) {
                    if (
                        key === 'inTransitAmount' ||
                        key === 'positionAmount' ||
                        key === 'weekEarnings' ||
                        key === 'positionEarnings'
                    ) {
                        item[key] = transNumToThousandMark(item[key], 2)
                    }
                    if (
                        key === 'redeemDeliveryShare' ||
                        key === 'positionShare'
                    ) {
                        item[key] = transNumToThousandMark(item[key], 4)
                    }
                }
            })
        },
        //获取用户归属 1大陆 2香港
        async getSource() {
            try {
                const { code } = await getSource()
                this.code = code
            } catch (e) {
                this.$toast(e.msg)
            }
        }
    },
    mounted() {
        this.currency =
            LS.get('activeTab') === 0 ? enumCurrency.HKD : enumCurrency.USD
        this.getFundPositionListV3()
        this.getSource()
    }
}
</script>
<style lang="scss" scoped>
.fund-account-container {
    padding: 0 0 20px 0;
}
.block-element-nomore {
    width: 100%;
    text-align: center;
    margin: 100px 0 0 0;
    img {
        width: 130px;
    }
    .no-record-box {
        color: rgba(25, 25, 25, 0.5);
        margin: 10px 0 0 0;
    }
}
.fund--list--wrapper {
    margin: 60px 0;
    width: 100%;
}
</style>
