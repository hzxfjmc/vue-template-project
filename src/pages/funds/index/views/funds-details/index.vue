<template lang="pug">
.funds-details
    FundsDetailsHeader
    
    FundsDetailsEchart
</template>
<script>
import FundsDetailsHeader from './components/funds-details-header'
import FundsDetailsEchart from './components/funds-details-echart'
export default {
    components: {
        FundsDetailsHeader,
        FundsDetailsEchart
    },
    data() {
        return {}
    }
}
</script>
<style lang="scss" scoped></style>
