<template lang="pug">
.block-fund-list-content
    .list-item-content(v-for="(item,index) in fundList" :key="index" @click="toFundDetails(item)")
        .fund-name {{item.fundName}}
        .fund-list-num
            .fund-row
                span 近七日数据
                .block-element-number {{item.weekEarnings}}
            .fund-row
                span 持仓收益
                .block-element-number {{item.positionEarnings}}
            .fund-row
                span 金额
                .block-element-number {{item.positionAmount}}
            .fund-row
                span 份额
                .block-element-number 6
        .fund-list-other(class="border-top" v-if="item.redeemDeliveryShare !== '0.00' && item.inTransitAmount !== '0.00'")
            .o-item
                .footer-left-l 赎回中
                .footer-right
                    span 份额
                    span.price-number {{item.redeemDeliveryShare}}
            .o-item
                .footer-left-l 申购中
                .footer-right
                    span {{item.currency == 2 ? 'HKD':'USD'}}
                    span.price-number {{item.inTransitAmount}}
    .block-element-nomore(v-if="noMoreShow")
        img.img(src="@/assets/img/fund/icon-norecord.png") 
        .no-record-box 暂无持仓
</template>
<script>
export default {
    props: {
        fundList: {
            type: Array,
            default: () => {}
        },
        noMoreShow: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        toFundDetails(item) {
            this.$router.push({
                path: '/fund-details',
                query: { id: item.fondId }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.block-fund-list-content {
    width: 94%;
    margin: 0 3%;
    color: #000;
    .list-item-content {
        width: 100%;
        border-radius: 4px;
        // height: 110px;
        margin: 10px 0 0 0;
        padding: 10px 2% 14px 2%;
        background: #fff;
        .fund-name {
            font-size: 0.32rem;
            line-height: 22px;
            margin: 10px 0 5px 0;
        }
        .fund-list-num {
            display: flex;
            margin: 14px 0 0 0;
            flex-direction: row;
            .fund-row {
                width: 25%;
                text-align: right;
                span {
                    font-size: 0.24rem;
                    color: rgba(25, 25, 25, 0.5);
                }
                .block-element-number {
                    font-size: 0.32rem;
                    font-family: 'yxFontDINPro-Regular';
                }
            }
            .fund-row:first-child {
                text-align: left;
            }
        }
        .fund-list-other {
            margin: 10px 0 0 0;
            padding: 7px 0 0 0;
            .o-item {
                display: flex;
                margin: 5px 0 0 0;
                flex-direction: row;
                .footer-left-l {
                    width: 50%;
                }
                .footer-right {
                    text-align: right;
                    width: 50%;
                    span {
                        font-size: 0.24rem;
                        color: rgba(25, 25, 25, 0.5);
                    }
                    .price-number {
                        // width: 80px;
                        font-size: 0.28rem;
                        font-family: 'yxFontDINPro-Regular';
                        color: rgba(25, 25, 25, 1);
                        margin: 0 0 0 5px;
                        display: inline-block;
                    }
                }
            }
        }
    }
}
.block-element-nomore {
    width: 100%;
    text-align: center;
    margin: 100px 0 0 0;
    img {
        width: 130px;
    }
    .no-record-box {
        color: rgba(25, 25, 25, 0.5);
        margin: 10px 0 0 0;
    }
}
</style>
