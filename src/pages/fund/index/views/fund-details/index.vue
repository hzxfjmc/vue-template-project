<template lang="pug">
.fund-details
    .fund-content(slot="main")
        fundDetailsHeader(:fundHeaderInfoVO="fundHeaderInfoVO")
        
        fundDetailsEchart(
          @chooseTime = "getFundNetPrice"
          :initEchartList="initEchartList")

        HoldfundDetails(:initState="holdInitState")

        fundDetailsList(
            :fundCorrelationFileList="fundCorrelationFileList"
            :fundTradeInfoVO = "fundTradeInfoVO"
            :fundOverviewInfoVO="fundOverviewInfoVO") 
    
    .fund-footer(@click="tofundSubscribe")
        a 申购
</template>
<script>
import fundDetailsHeader from './components/fund-details-header'
import fundDetailsEchart from './components/fund-details-echart'
import HoldfundDetails from './components/hold-fund-details'
import fundDetailsList from './components/fund-details-list'
import dayjs from 'dayjs'
import {
    getFundDetail,
    getFundNetPrice
} from '@/service/finance-info-server.js'
import { getFundPosition } from '@/service/finance-server.js'
import localStorage from '../../../../../utils/local-storage'

export default {
    components: {
        fundDetailsHeader,
        fundDetailsEchart,
        HoldfundDetails,
        fundDetailsList
    },
    data() {
        return {
            fundHeaderInfoVO: {},
            fundOverviewInfoVO: {},
            fundCorrelationFileList: [],
            fundTradeInfoVO: {},
            initEchartList: [],
            holdInitState: {}
        }
    },
    methods: {
        tofundSubscribe() {
            this.$router.push({
                path: '/fund-subscribe',
                query: this.fundHeaderInfoVO
            })
        },
        async getFundDetail() {
            const res = await getFundDetail({
                displayLocation: 1,
                fundId: 1
            })
            this.fundHeaderInfoVO = res.fundHeaderInfoVO
            this.fundHeaderInfoVO.apy = Number(
                this.fundHeaderInfoVO.apy
            ).toFixed(2)
            this.fundHeaderInfoVO.netPrice = Number(
                this.fundHeaderInfoVO.netPrice
            ).toFixed(2)
            this.fundHeaderInfoVO.initialInvestAmount = Number(
                this.fundHeaderInfoVO.initialInvestAmount
            ).toFixed(2)
            this.fundHeaderInfoVO.belongDay = dayjs(
                this.fundHeaderInfoVO.belongDay
            ).format('YYYY-MM-DD')
            this.fundOverviewInfoVO = res.fundOverviewInfoVO
            this.fundCorrelationFileList = res.fundCorrelationFileList
            this.fundTradeInfoVO = res.fundTradeInfoVO
        },
        async getFundPosition() {
            const res = await getFundPosition({
                fundId: 1
            })
            this.holdInitState = res
        },
        async getFundNetPrice(time) {
            const res = await getFundNetPrice({
                fundId: 1,
                fundNetPriceDateType: time || 1
            })
            this.initEchartList = res
            this.initEchartList.map(item => {
                item.belongDay = dayjs(item.belongDay).format('YYYY-MM-DD')
            })
        }
    },
    mounted() {
        localStorage.put(
            'userToken',
            'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzZXNzaW9uIjoiMTk5ZGIwMzI2Mjc0NDE4ZDk4YmJjYTNmNjBkZWYxMTEiLCJzb3VyY2UiOiJhcHAiLCJ1dWlkIjozNTQ3MDQ1NjQxMTE2NTA4MTZ9.9wfTLuPWptnvId694okt7kIP54ZW33eGJtFGhequsO0'
        )
        this.getFundNetPrice()
        this.getFundDetail()
        this.getFundPosition()
    }
}
</script>
<style lang="scss" scoped>
.fund-details {
    display: flex;
    flex-direction: column;
    height: 100%;
    -webkit-overflow-scrolling: touch;
    overflow: hidden;
    .fund-content {
        overflow: hidden;
        overflow-y: auto;
        // -webkit-overflow-scrolling: touch;
        flex: 1;
        height: 90%;
    }
    .fund-footer {
        width: 100%;
        height: 50px;
        background: $primary-color;
        color: #fff;
        text-align: center;
        line-height: 50px;
    }
}
</style>
