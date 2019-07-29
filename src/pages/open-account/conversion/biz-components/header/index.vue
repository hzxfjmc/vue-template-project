<template lang="pug">
.header-container.full-height.flex-fixed
    yx-step.header-step(:data="['填写信息', '股票信息', '确认信息']" :active="step")
    keep-alive
        router-view
</template>

<script>
import yxStep from '@/components/yx-step'
export default {
    components: {
        yxStep
    },
    computed: {
        step() {
            return parseInt(this.$route.params.step) || 0
        }
    }
}
</script>

<style lang="scss">
.header-container {
    .step-box .step-item {
        .line {
            border: none;
            border-top: solid 1px rgba(225, 225, 225, 0.5);
        }
    }
}
</style>
