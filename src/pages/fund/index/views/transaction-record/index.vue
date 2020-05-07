<template lang="pug">
    .transaction__record__detail__wrapper
        .transaction__record__detail__header
            .detail__header_name {{fundInfo.fundBaseInfoVO.fundName}}
            .detail__header_code ISIN:{{fundInfo.fundBaseInfoVO.fundCode}}
        .transaction__record__detail__line
        .transaction__record__detail__main
            .detail__main__item
                .detail__main_title 订单状态
                .detail__main_content {{fundInfo.externalName}}
            .detail__main__item
                .detail__main_title 失败原因
                .detail__main_content 余额不足，扣款失败
            .detail__main__item
                .detail__main_title 生成原因
                .detail__main_content 余额不足，扣款失败
            .detail__main__item
                .detail__main_title 生成时间
                .detail__main_content {{fundInfo.orderTime}}
            .detail__main__item
                .detail__main_title 订单号
                .detail__main_content {{fundInfo.orderNo}}
        .transaction__record__detail__amount
            .detail__amount__item
                .detail__amount_title 订单类别
                .detail__amount_content {{fundInfo.tradeTypeName}}
            .detail__amount__item
                .detail__amount_title 金额
                .detail__amount_content {{fundInfo.currency.name}} {{fundInfo.orderAmount}}
        .transaction__record__detail__btn
                van-button(type="info" round size="large" @click="buyMoreHandle") 再买一笔
</template>

<script>
// import { statusMap } from './map'
import { fundOrderDetail } from '@/service/finance-server.js'
import dayjs from 'dayjs'
export default {
    data() {
        return {
            fundInfo: {}
        }
    },
    methods: {
        async fundOrderDetail() {
            try {
                const res = await fundOrderDetail({
                    orderNo: this.$route.query.orderNo
                })
                this.fundInfo = res
                this.fundInfo.orderTime = dayjs(this.fundInfo.orderTime).format(
                    'YYYY-MM-DD HH:mm:ss'
                )
            } catch (e) {
                console.log(e)
            }
        },
        buyMoreHandle() {}
    },
    created() {
        this.fundOrderDetail()
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
