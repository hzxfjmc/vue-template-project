<template lang="pug">
    .risk-assessment-wrapper
        risk-assessment-result
</template>

<script>
import riskAssessmentResult from '@/components/risk-assessment-result'
export default {
    components: {
        riskAssessmentResult
    }
}
</script>

<style lang="scss" scoped>
.risk-assessment-wrapper {
    height: 100%;
    background-color: #fff !important;
}
</style>
