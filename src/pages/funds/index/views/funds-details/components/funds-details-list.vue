<template lang="pug">
.funds-details-list
    .vant-list(v-for="item of list")
        em.left(class="iconfont") 31342
        span.center 交易记录
        em.right(class="iconfont icon-iconEBgengduoCopy")
</template>
<script>
export default {
    data() {
        return {
            list: [{}, {}, {}, {}, {}]
        }
    }
}
</script>
<style lang="scss" scoped>
.funds-details-list {
    margin: 10px 0 0 0;
    background: $background-color;
    .vant-list {
        // width:92;
        margin: 0 10px;
        border-bottom: 1px solid #e1e1e1;
        height: 50px;
        line-height: 50px;
        em {
            font-style: normal;
        }
    }
}
</style>
