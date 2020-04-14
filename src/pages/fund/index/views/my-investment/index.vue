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
        van-button.btn-left() 123
        van-button.btn-right 453
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
<style lang="scss" scoped>
.inverstment--block--wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    .inverstment--footer--btn {
        margin: 0 16px 20px 16px;
        flex-direction: row;
        justify-content: space-between;
        display: flex;
        .btn-left {
            width: 160px;
            background: #ffbf32;
            color: #fff;
        }
        .btn-right {
            width: 160px;
            background: #2f79ff;
            color: #fff;
        }
    }
}
</style>
