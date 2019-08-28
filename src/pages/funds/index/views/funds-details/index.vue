<template lang="pug">
.funds-details
    FundsDetailsHeader
    
    FundsDetailsEchart

    HoldFundsDetails

    FundsDetailsList 
</template>
<script>
import FundsDetailsHeader from './components/funds-details-header'
import FundsDetailsEchart from './components/funds-details-echart'
import HoldFundsDetails from './components/hold-funds-details'
import FundsDetailsList from './components/funds-details-list'
export default {
    components: {
        FundsDetailsHeader,
        FundsDetailsEchart,
        HoldFundsDetails,
        FundsDetailsList
    },
    data() {
        return {}
    }
}
</script>
<style lang="scss" scoped>
.funds-details {
    overflow: hidden;
}
</style>
