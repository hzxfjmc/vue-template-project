<template lang="pug">
.income-details-content
    .list(class="border-bottom" v-for="(item,index) in list")
        .left 10/{{index}}
        .content 
            .top 收益
            .bottom 华夏智能关怀人工防水等级很高
        .right 0.{{index}}
</template>
<script>
export default {
    data() {
        return {
            list: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
        }
    }
}
</script>
<style lang="scss" scoped>
.income-details-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    -webkit-overflow-scrolling: touch;
    background: #fff;
    overflow: hidden;
    overflow-y: auto;
    .list {
        width: 96%;
        padding: 10px 2%;
        display: flex;
        align-items: center;
        .left {
            flex-grow: 1;
            text-align: left;
        }
        .contet {
            flex-grow: 2;
        }
        .right {
            flex-grow: 1;
            text-align: right;
        }
    }
}
</style>
