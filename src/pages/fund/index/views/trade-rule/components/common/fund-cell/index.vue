<template lang="pug">
.fund-cell 
    .fund-cell-list(v-for="item of cellList")
        .left {{item.label}}
        .right
           span {{item.value}}
           span(v-if="item.twoValue") {{item.twoValue}}
</template>
<script>
export default {
    props: {
        cellList: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {}
    }
}
</script>
<style lang="scss" scoped>
.fund-cell {
    // padding:0 10px;
    .fund-cell-list {
        line-height: 30px;
        display: flex;
        .left,
        .right {
            width: 50%;
        }
        .left {
            color: $text-color5;
            font-size: 0.28rem;
        }
        .right {
            text-align: right;
            span {
                display: inline-block;
                width: 100%;
                line-height: 10px;
            }
        }
    }
}
</style>
