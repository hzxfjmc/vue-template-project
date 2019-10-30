<template lang="pug">
.fund-account-container
    fundAccountHeader(
        @toRouterPath = "toRouterPath"
        @changeEyeTab = "changeEyeTab"
        @handlerCurrency="handlerCurrency"
        :holdData="holdData")
        fundList(
            slot="fundList"
            :eyeTab="eyeTab"
            :noMoreShow="noMoreShow"        
            :fundList="fundList")

</template>
<script>
import fundAccountHeader from './components/fund-account-header'
import fundList from './components/fund-list'
import { getFundPositionList } from '@/service/finance-server.js'
import { transNumToThousandMark } from '@/utils/tools.js'
import localStorage from '@/utils/local-storage'
export default {
    data() {
        return {
            holdData: {},
            fundList: [],
            currency: 2,
            noMoreShow: false,
            eyeTab: localStorage.get('showMoney')
        }
    },
    components: {
        fundAccountHeader,
        fundList
    },
    methods: {
        toRouterPath(path) {
            this.$router.push({
                path: path,
                query: { currency: this.currency }
            })
        },
        changeEyeTab(data) {
            this.eyeTab = data
        },
        //切换货币
        handlerCurrency(data) {
            this.currency = data
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
                        // item[key] = transNumToThousandMark(item[key])
                    }
                }
                item.currency = this.currency
            })
            this.fundList = positionList

            this.fundList.map(item => {
                for (let key in item) {
                    if (key != 'fundId' && key != 'fundName') {
                        if (key === 'positionShare') {
                            item[key] = transNumToThousandMark(item[key], 4)
                        } else {
                            item[key] = transNumToThousandMark(item[key])
                        }
                    }
                }
            })
            this.noMoreShow = this.fundList.length == 0
        }
    },
    mounted() {
        this.currency = localStorage.get('activeTab') == 0 ? 2 : 1
        this.getFundPositionList()
    }
}
</script>
<style lang="scss" scoped></style>
