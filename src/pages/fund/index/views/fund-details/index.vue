<template lang="pug">
.fund-details
    .fund-content
        fundDetailsHeader(:fundHeaderInfoVO="fundHeaderInfoVO")
        
        fundDetailsEchart

        HoldfundDetails

        fundDetailsList(
            :fundCorrelationFileList="fundCorrelationFileList"
            :fundOverviewInfoVO="fundOverviewInfoVO") 
    
    .fund-footer
        a() 申购
</template>
<script>
import fundDetailsHeader from './components/fund-details-header'
import fundDetailsEchart from './components/fund-details-echart'
import HoldfundDetails from './components/hold-fund-details'
import fundDetailsList from './components/fund-details-list'
import dayjs from 'dayjs'
import { getFundDetail } from '@/service/finance-info-server.js'
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
            fundCorrelationFileList: []
        }
    },
    methods: {
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
        }
    },
    mounted() {
        localStorage.put('myCat', 'Tom')
        localStorage.put(
            'userToken',
            'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzZXNzaW9uIjoiMWI0NWE1ZmQxNTIwNDhlYzgyN2Q3ZjJhZDBkOGQyNjUiLCJzb3VyY2UiOiJhcHAiLCJ1dWlkIjozNjQ0MDE0NDA3MDc2NjU5MjB9.JCRqIUb5DdsO0cTnohI-B9Cu20bqi7irY39lLHyvziA'
        )
        this.getFundDetail()
    }
}
</script>
<style lang="scss" scoped>
.fund-details {
    overflow: hidden;
    .fund-content {
        overflow-y: auto;
        width: 100%;
        margin: 0 0 50px 0;
        overflow: hidden;
    }
    .fund-footer {
        width: 100%;
        height: 50px;
        background: $primary-color;
        position: fixed;
        bottom: 0;
        line-height: 50px;
        text-align: center;
        color: #fff;
        font-size: 0.32rem;
    }
}
</style>
