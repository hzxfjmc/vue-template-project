<template lang="pug">
 .block__status--list
    .block__status--item
        em.iconfont.icon-icon-checkbox-selected
        .block__status--right
            p 提交转出申请成功，可立即购买股票
            p 2020-03-09 12:20:29
        
    .block__status--item.block__after(v-if="successHide")
        em.iconfont.icon-icon-money
        .block__status--right
            p 提交转出申请成功，可立即购买股票
            p 2020-03-09 12:20:29
</template>
<script>
export default {
    props: {
        successHide: {
            type: Boolean,
            default: true
        }
    },
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
    em {
        width: 15px;
        color: #2f79ff;
        margin: 4px 10px 0 0;
        display: inline-block;
    }
    .block__after {
        margin: 46px 0 0 0;
    }
    .block__after:after {
        content: '';
        position: absolute;
        height: 56px;
        width: 1px;
        left: 7px;
        top: -55px;
        display: inline-block;
        background: #2f79ff;
    }
}
</style>
