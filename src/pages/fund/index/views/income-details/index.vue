<template lang="pug">
.income-details-content
    .list(class="border-bottom" v-for="(item,index) in list")
        .block-left 
            span.element-fund-name 基金名称
            span.element-price 金额
            span.element-time 时间
        .block-right 
            span.element-fund-name 贝莱德全球基金-环球高收益
            span.element-price +100,000.00
            span.element-time 2019-07-08 15:55:08
            
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
        width: 100%;
        padding: 10px 2%;
        // height: 150px;
        display: flex;
        align-items: center;
        .block-left {
            display: flex;
            width: 30%;
            flex-direction: column;
            span {
                display: inline-block;
                line-height: 25px;
                color: $text-color5;
            }
        }
        .block-right {
            display: flex;
            width: 70%;
            justify-content: flex-end;
            flex-direction: column;
            align-items: flex-end;
            span {
                display: inline-block;
                line-height: 25px;
            }
        }
    }
}
</style>
