<template lang="pug">
.fund-account-container
    fundAccountHeader(:holdData="holdData")
    fundList(:fundList="fundList")

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
            fundList: []
        }
    },
    components: {
        fundAccountHeader,
        fundList
    },
    methods: {
        async getFundPositionList() {
            const {
                positionAmount,
                positionEarnings,
                weekEarnings,
                positionList
            } = await getFundPositionList({
                currency: 2
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
        }
    },
    mounted() {
        this.getFundPositionList()
    }
}
</script>
<style lang="scss" scoped></style>
