<template lang="pug">
    yx-container.order-record-detail-container
        //- yx-nav-bar(
        //-     slot='top'
        //-     :title='title'
        //-     right-text="撤销"
        //-     class='yx-nav'
        //- )
        .order-record-detail(slot='main')
            .fund-introduce
                .fund-name {{fundName}}
                .fund-detail {{fundDetail}}
            order-status-about
            van-cell-group(class="order-group")
                van-cell(class="order-time" )
                    .order-item.flex(v-for="item in orderAboutList")
                        span.itemName {{item.name}}
                        span {{item.value}}
                van-cell(class="order-money-cell" )
                    .order-money.flex
                        .left-title.flex
                            span.type {{orderType}}
                            span.type-text {{$t('amount')}}
                        .right-value {{moneyNum}}
            .btn-buy-more
                van-button(type="info" round  size="large" @click="buyMoreHandle") {{$t('againBuy')}}
    
</template>

<script>
import orderStatusAbout from './components/order-status-about'
import { yxNavBar } from '@/components/yx-nav-bar'

export default {
    i18n: {
        zhCHS: {
            amount: '金额',
            againBuy: '再买一笔'
        },
        zhCHT: {
            amount: '金额',
            againBuy: '再买一笔'
        },
        en: {
            amount: '金额',
            againBuy: '再买一笔'
        }
    },
    components: {
        orderStatusAbout,
        yxNavBar
    },
    data() {
        return {
            fundName: 'Pimco 亚洲投资级债券基金-A2',
            fundDetail: 'ISIN:IE00B0MD9M11',
            orderAboutList: [
                { name: '订单生成时间', value: '2019-07-12 15:06:44' },
                { name: '订单号', value: '01907120540425132220050' }
            ],
            orderType: '赎回',
            moneyNum: '2,000.000.00',
            detailMsg: {},
            title: '订单'
        }
    },
    created() {
        console.log(this, this.$jsBridge, '0000')
    },
    methods: {
        buyMoreHandle() {
            this.$router.push({
                path: '/fund-subscribe',
                query: this.detailMsg
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.order-record-detail-container {
    height: 100%;
    background-color: $background-color;
    .fund-introduce {
        background-color: $background-color;
        &::after {
            width: 100%;
            content: '';
            display: block;
            height: 10px;
            background-color: $background-bottom-color;
        }
        .fund-name {
            font-size: 16px;
            line-height: 22px;
            padding-top: 15px;
            margin-bottom: 6px;
            padding-left: 12px;
        }
        .fund-detail {
            font-size: 14px;
            color: $text-color5;
            padding: 0 0 12px 12px;
        }
    }
    .order-group {
        padding-bottom: 41px;
        .order-time {
            .itemName {
                color: $text-color5;
                margin-bottom: 10px;
            }
        }
        .order-money-cell {
            border-bottom: 1px solid rgba($color: $text-color, $alpha: 0.05);
            .order-money {
                .left-title {
                    flex-direction: column;
                    .type {
                        font-size: 16px;
                        line-height: 22px;
                    }
                    .type-text {
                        @extend .type;
                        color: $text-color5;
                    }
                }
                .right-value {
                    font-size: 24px;
                    line-height: 44px;
                }
            }
        }
    }
    .btn-buy-more {
        padding: 0 16px;
    }
}
</style>
