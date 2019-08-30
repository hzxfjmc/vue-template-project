<template lang="pug">
    .order-record-detail-container
        .fund-introduce
            .fund-name {{fundName}}
            .fund-detail
                .fund-detail-item(v-for="(item) in fundDetailList") {{item}}
        
</template>

<script>
import riskAssessmentMixin from '@/mixins/bond/risk-assessment/index.js'
export default {
    mixins: [riskAssessmentMixin],
    data() {
        return {
            fundName: 'Pimco 亚洲投资级债券基金-A2'
        }
    }
}
</script>

<style lang="scss" scoped>
.order-record-detail-container {
    .fund-introduce {
        height: 75px;
    }
}
</style>
