<template lang="pug">
 .block__status--list
    .block__status--item
        .block__status--icon
        .block__status--right
            p 提交转出申请成功，可立即购买股票
            p 2020-03-09 12:20:29
        
    .block__status--item
        .block__status--icon
        .block__status--right
            p 提交转出申请成功，可立即购买股票
            p 2020-03-09 12:20:29
</template>
<script>
export default {
    data() {
        return {}
    }
}
</script>
<style lang="scss" scoped>
.block__status--list {
    padding: 0 12px 14px 12px;
    .block__status--item {
        position: relative;
        display: flex;
        flex-direction: row;
    }
    .block__status--icon {
        width: 15px;
        margin: 4px 10px 0 0;
        height: 15px;
        border: 1px solid red;
    }
    .block__status--item:last-child {
        margin: 46px 0 0 0;
    }
    .block__status--item:first-child:after {
        content: '';
        position: absolute;
        height: 56px;
        width: 1px;
        left: 7px;
        top: 26px;
        display: inline-block;
        background: red;
    }
}
</style>
