<template lang="pug">
.funds-details
    .funds-content
        FundsDetailsHeader
        
        FundsDetailsEchart

        HoldFundsDetails

        FundsDetailsList 
    
    .funds-footer
        a() 申购
</template>
<script>
import FundsDetailsHeader from './components/funds-details-header'
import FundsDetailsEchart from './components/funds-details-echart'
import HoldFundsDetails from './components/hold-funds-details'
import FundsDetailsList from './components/funds-details-list'
import { getFundsDetails } from '@/service/finance-info-server.js'
export default {
    components: {
        FundsDetailsHeader,
        FundsDetailsEchart,
        HoldFundsDetails,
        FundsDetailsList
    },
    data() {
        return {}
    },
    methods: {
        async getFundsDetails() {
            await getFundsDetails({
                displayLocation: 1,
                fundId: 1
            })
        }
    },
    mounted() {
        this.getFundsDetails()
    }
}
</script>
<style lang="scss" scoped>
.funds-details {
    overflow: hidden;
    .funds-content {
        overflow-y: auto;
        width: 100%;
        margin: 0 0 50px 0;
    }
    .funds-footer {
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
