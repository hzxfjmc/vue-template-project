<template lang="pug">
.home-container
    HomeHeader(:holdData="holdData")
    .home-bannar
        img(src="https://tse4-mm.cn.bing.net/th?id=OIP.bbOTYYnZGn7AGDuzCi12MgHaEl&w=299&h=182&c=7&o=5&dpr=2&pid=1.7")
    HomeFundList
</template>
<script>
import HomeHeader from './components/home-header'
import HomeFundList from './components/home-fund-list'
import { getFundPositionList } from '@/service/finance-server.js'
import { transNumToThousandMark } from '@/utils/tools.js'
export default {
    components: {
        HomeHeader,
        HomeFundList
    },
    data() {
        return {
            holdData: {}
        }
    },
    methods: {
        async getFundPositionList() {
            const {
                positionAmount,
                positionEarnings,
                weekEarnings
            } = await getFundPositionList({
                currency: 2
            })
            this.holdData = {
                positionAmount: transNumToThousandMark(positionAmount),
                positionEarnings: transNumToThousandMark(positionEarnings),
                weekEarnings: transNumToThousandMark(weekEarnings)
            }
        }
    },
    mounted() {
        this.getFundPositionList()
    }
}
</script>
<style lang="scss" scoped>
.home-bannar {
    width: 100%;
    height: 110px;
    background: #fff;
    padding: 10px;
    img {
        width: 100%;
        height: 100%;
    }
}
</style>
