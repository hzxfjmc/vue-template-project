<template lang="pug">
.income-details-content
    .list(class="border-bottom" v-for="(item,index) in list")
        .block-left 
            span.element-fund-name 申购
            span.element-price 金额
            span.element-time 时间
        .block-right 
            span.element-fund-name 交易进行中
            span.element-price USD 10000,0043
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
            .element-fund-name {
                font-size: 16px;
                font-weight: 400;
                line-height: 30px;
                color: $text-color;
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
            .element-fund-name {
                line-height: 30px;
            }
        }
    }
}
</style>
