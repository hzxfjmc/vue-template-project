<template lang="pug">
    .transaction__record__detail__wrapper
        .transaction__record__detail__header
            .detail__header_name {{fundInfo.fundBaseInfoVO.fundName}}
            .detail__header_code ISIN:{{fundInfo.fundBaseInfoVO.fundCode}}
        .transaction__record__detail__line
        .transaction__record__detail__main
            .detail__main__item
                .detail__main_title {{$t('A99')}}
                .detail__main_content {{fundInfo.externalName}}
            .detail__main__item(v-if="fundInfo.externalStatus === 4")
                .detail__main_title {{$t(`失败原因`,`失敗原因`,`Cause of failure`)}}
                .detail__main_content {{fundInfo.rejectReason}}
            .detail__main__item
                .detail__main_title {{$t(`生成时间`,`訂單時間`,`Order Time`)}}
                .detail__main_content {{fundInfo.orderTime}}
            .detail__main__item
                .detail__main_title {{$t(`订单号`,`訂單號`,`Order Number`)}}
                .detail__main_content {{fundInfo.orderNo}}
        .transaction__record__detail__amount
            .detail__amount__item
                .detail__amount_title {{$t(`订单类别`,`訂單類別`,`Order Type`)}}
                .detail__amount_content {{fundInfo.tradeTypeName}}
            .detail__amount__item
                .detail__amount_title {{$t('A98')}}
                .detail__amount_content {{fundInfo.currency.name}} {{fundInfo.orderAmount | transNumToThousandMark}}
        .transaction__record__detail__btn
                van-button(type="info" round size="large" @click="buyMoreHandle") {{$t(`再买一笔`,`再買一筆`,`Make a transaction again`)}}
</template>

<script>
// import { statusMap } from './map'
import { fundOrderDetail } from '@/service/finance-server.js'
import dayjs from 'dayjs'
import { transNumToThousandMark } from '@/utils/tools.js'
export default {
    data() {
        return {
            fundInfo: {
                fundBaseInfoVO: {},
                currency: {}
            }
        }
    },
    filters: {
        transNumToThousandMark(value) {
            return transNumToThousandMark(value)
        }
    },
    methods: {
        async fundOrderDetail() {
            try {
                const res = await fundOrderDetail({
                    orderNo: this.$route.query.orderNo
                })
                this.fundInfo = res
                console.log(this.fundInfo)
                this.fundInfo.orderTime = dayjs(this.fundInfo.orderTime).format(
                    'YYYY-MM-DD HH:mm:ss'
                )
                this.fundInfo.tradeTypeName =
                    res.fixedInvest === 1 ? this.$t('A2') : res.tradeTypeName
            } catch (e) {
                console.log(e)
            }
        },
        buyMoreHandle() {
            this.$router.push({
                path: '/fixed-investment',
                query: {
                    id: this.fundInfo.fundBaseInfoVO.fundId
                }
            })
        }
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
