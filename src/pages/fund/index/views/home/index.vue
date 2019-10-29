<template lang="pug">
.home-container
    HomeHeader(
        @handlerCurrency="handlerCurrency"
        @toFundList = "toFundList"
        :lists="list"
        :holdData="holdData")
        .home-bannar(slot="bannar")
            img(src="https://tse4-mm.cn.bing.net/th?id=OIP.bbOTYYnZGn7AGDuzCi12MgHaEl&w=299&h=182&c=7&o=5&dpr=2&pid=1.7")
        HomeFundList(:fundList="fundList" slot="fundList")
</template>
<script>
import HomeHeader from './components/home-header'
import HomeFundList from './components/home-fund-list'
import { getFundPositionList } from '@/service/finance-server.js'
import { getFundListV2 } from '@/service/finance-info-server.js'
import { transNumToThousandMark } from '@/utils/tools.js'
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
            list: []
        }
    },
    methods: {
        //跳转基金
        toFundList(data) {
            this.$router.push({
                path: '/',
                query: {
                    type: data.type,
                    currency: this.currency
                }
            })
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
                    item.apy = transNumToThousandMark(item.apy)
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
            // this.getReleaseFundAssetType(true)
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
        // this.getReleaseFundAssetType()
        this.getFundPositionList()
        this.getFundListV2()
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
