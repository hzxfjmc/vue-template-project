<template lang="pug">
.fund-account-container
    fundAccountHeader(
        @toRouterPath = "toRouterPath"
        @changeEyeTab = "changeEyeTab"
        @handlerCurrency="handlerCurrency"
        :holdData="holdData")
        fundList(
            slot="fundList"
            bgColor="#0091FF"
            title = '港幣基金'
            v-if="!noMoreShow"
            :eyeTab="eyeTab"       
            :fundList="fundList")
        fundList(
            slot="fundList"
            bgColor="#FFBA00"
            title = '美元基金'
            v-if="!noMoreShow"
            :eyeTab="eyeTab"    
            :fundList="fundList")
    .block-element-nomore(v-if="noMoreShow")
        img.img(src="@/assets/img/fund/empty.png") 
        .no-record-box {{$t('nomore')}}

</template>
<script>
import fundAccountHeader from './components/fund-account-header'
import fundList from './components/fund-list'
import { getFundPositionList } from '@/service/finance-server.js'
import { transNumToThousandMark } from '@/utils/tools.js'
import LS from '@/utils/local-storage'
import { gotoNewWebView } from '@/utils/js-bridge.js'
import { enumCurrency } from '@/pages/fund/index/map'
export default {
    data() {
        return {
            holdData: {},
            fundList: [],
            currency: 2,
            noMoreShow: false,
            eyeTab: LS.get('showMoney')
        }
    },
    i18n: {
        zhCHS: {
            nomore: '暂无持仓'
        },
        zhCHT: {
            nomore: '暫無持倉'
        },
        en: {
            nomore: 'No Position'
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
            this.getFundPositionList()
        },
        async getFundPositionList() {
            const {
                positionAmount,
                positionEarnings,
                weekEarnings,
                positionList
            } = await getFundPositionList({
                currency: this.currency
            })
            let positionAmountFlag =
                positionEarnings > 0 ? '+' : positionEarnings < 0 ? '-' : ''
            let positionEarningsFlag =
                weekEarnings > 0 ? '+' : weekEarnings < 0 ? '-' : ''
            this.holdData = {
                positionAmount: transNumToThousandMark(positionAmount),
                positionEarnings: transNumToThousandMark(
                    Math.abs(positionEarnings)
                ),
                weekEarnings: transNumToThousandMark(Math.abs(weekEarnings)),
                currency: this.currency,
                positionAmountFlag: positionAmountFlag,
                positionEarningsFlag: positionEarningsFlag
            }
            positionList.map(item => {
                for (let key in item) {
                    if (key != 'fundId' && key != 'fundName') {
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
                item.currency = this.currency
            })
            this.fundList = positionList

            this.fundList.map(item => {
                for (let key in item) {
                    if (key != 'fundId' && key != 'fundName') {
                        if (
                            key === 'positionShare' ||
                            key === 'redeemDeliveryShare'
                        ) {
                            item[key] = transNumToThousandMark(item[key], 4)
                        } else {
                            item[key] = transNumToThousandMark(item[key])
                        }
                    }
                }
            })
            this.noMoreShow = this.fundList.length == 0
            console.log(this.noMoreShow)
        }
    },
    mounted() {
        this.currency =
            LS.get('activeTab') === 0 ? enumCurrency.HKD : enumCurrency.USD
        this.getFundPositionList()
    }
}
</script>
<style lang="scss" scoped>
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
</style>
