<template lang="pug">
    .risk-warning-wrapper
        van-panel(title="债券购买风险提示")

</template>

<script>
import { Panel } from 'vant'
export default {
    name: 'RickWarning',
    components: {
        [Panel.name]: Panel
    }
}
</script>

<style lang="scss" scoped></style>
