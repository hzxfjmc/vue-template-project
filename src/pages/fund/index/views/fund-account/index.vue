<template lang="pug">
.fund-account-container
    fundAccountHeader(
        @toRouterPath = "toRouterPath"
        @handlerCurrency="handlerCurrency"
        :holdData="holdData")
    fundList(
        :noMoreShow="noMoreShow"        
        :fundList="fundList")

</template>
<script>
import fundAccountHeader from './components/fund-account-header'
import fundList from './components/fund-list'
import { getFundPositionList } from '@/service/finance-server.js'
import { transNumToThousandMark } from '@/utils/tools.js'
export default {
    data() {
        return {
            holdData: {},
            fundList: [],
            currency: 2,
            noMoreShow: false
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
            this.holdData = {
                positionAmount: transNumToThousandMark(positionAmount),
                positionEarnings: transNumToThousandMark(positionEarnings),
                weekEarnings: transNumToThousandMark(weekEarnings)
            }
            this.fundList = positionList
            this.fundList.map(item => {
                for (let key in item) {
                    if (key != 'fundId' && key != 'fundName') {
                        item[key] = transNumToThousandMark(item[key])
                    }
                }
            })
            this.fundList = []
            this.noMoreShow = this.fundList.length == 0
        }
    },
    mounted() {
        this.getFundPositionList()
    }
}
</script>
<style lang="scss" scoped></style>
