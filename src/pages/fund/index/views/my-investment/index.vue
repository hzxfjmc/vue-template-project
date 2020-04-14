<template lang="pug">
.inverstment--block--wrapper
    van-tabs(
        v-model="active" 
        swipeable) 
        van-tab(title="定投计划")
            span 123213
        van-tab(title="历史计划")
            span 123213
    .inverstment--footer--btn
        van-button
</template>
<script>
export default {
    data() {
        return {
            active: 0
        }
    }
}
</script>
<style lang="scss" scoped></style>
