<template lang="pug">
    .transaction__record__detail__wrapper
        .transaction__record__detail__header
            .detail__header_name Pimco 亚洲投资级债券基金-A2
            .detail__header_code ISIN:LU0538203018
        .transaction__record__detail__line
        .transaction__record__detail__main
            .detail__main__item
                .detail__main_title 订单状态
                .detail__main_content 交易进行中
            .detail__main__item
                .detail__main_title 失败原因
                .detail__main_content 余额不足，扣款失败
            .detail__main__item
                .detail__main_title 生成原因
                .detail__main_content 余额不足，扣款失败
            .detail__main__item
                .detail__main_title 生成时间
                .detail__main_content 2019-07-10 15:55:08
            .detail__main__item
                .detail__main_title 订单号
                .detail__main_content 4534534634
        .transaction__record__detail__amount
            .detail__amount__item
                .detail__amount_title 订单类别
                .detail__amount_content 定投
            .detail__amount__item
                .detail__amount_title 金额
                .detail__amount_content HKD 10,000.00
        .transaction__record__detail__btn
                van-button(type="info" round size="large" @click="buyMoreHandle") 再买一笔
</template>

<script>
// import { statusMap } from './map'
export default {
    data() {
        return {}
    },
    methods: {
        buyMoreHandle() {}
    }
}
</script>

<style lang="scss" scoped>
.transaction__record__detail__wrapper {
    display: flex;
    width: 100%;
    flex-direction: column;
    height: 100%;
    background: $background-color;
    .transaction__record__detail__header {
        padding: 14px 12px;
        .detail__header_name {
            font-size: 16px;
            color: $text-color;
        }
        .detail__header_code {
            font-size: 12px;
            color: $text-color6;
        }
    }
    .transaction__record__detail__line {
        width: 100%;
        height: 6px;
        background-color: #f1f3f8;
    }
    .transaction__record__detail__main {
        padding: 14px 12px;
        border-bottom: 1px solid $text-color8;
        .detail__main__item {
            display: flex;
            justify-content: space-between;
            color: rgba($text-color, 0.5);
            margin-bottom: 10px;
        }
    }
    .transaction__record__detail__amount {
        @extend .transaction__record__detail__main;
        .detail__amount__item {
            @extend .detail__main__item;
            .detail__amount_content {
                font-size: 16px;
                color: $text-color;
            }
        }
    }
    .transaction__record__detail__btn {
        padding: 40px 16px 0;
    }
}
.yellow-style {
    color: $cell-right-color !important;
}
.blue-style {
    color: $hk-text-line-color !important;
}
.grey-style {
    color: $text-color3 !important;
}
.green-style {
    color: $green-text-color !important;
}
</style>
