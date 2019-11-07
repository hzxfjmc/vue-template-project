<template lang="pug">
.block-fund-list-content
    .list-item-content(v-for="(item,index) in fundList" :key="index" @click="toFundDetails(item)")
        .fund-name {{item.fundName}}
        .fund-list-num
            .fund-row
                span {{$t('SevenDayIncome')}}
                .block-element-number(v-if="eyeTab && item.flag1 == 0" :class="stockColorType === 1 ?'active-red':'active-green'") +{{item.weekEarnings}}
                .block-element-number(v-if="eyeTab && item.flag1 == 1" :class="stockColorType === 1 ?'active-green':'active-red'") {{item.weekEarnings}}
                .block-element-number(v-if="eyeTab && item.flag1 == 2") {{item.weekEarnings}}
                .block-element-number(v-if="!eyeTab") ****
            .fund-row
                span {{$t('profitPostion')}}
                .block-element-number(v-if="eyeTab && item.flag == 0" :class="stockColorType === 1 ?'active-red':'active-green'") +{{item.positionEarnings}}
                .block-element-number(v-if="eyeTab && item.flag == 1" :class="stockColorType === 1 ?'active-green':'active-red'") {{item.positionEarnings}}
                .block-element-number(v-if="eyeTab && item.flag == 2") {{item.positionEarnings}}
                .block-element-number(v-if="!eyeTab") ****
            .fund-row
                span {{$t('amountMoney')}}
                .block-element-number(v-if="eyeTab") {{item.positionAmount}}
                .block-element-number(v-else) ****
            .fund-row
                span {{$t('share')}}
                .block-element-number(v-if="eyeTab") {{item.positionShare}}
                .block-element-number(v-else) ****
        .fund-list-other(class="border-top" v-if="item.redeemDeliveryShare !== '0.0000' || item.inTransitAmount !== '0.00'")
            .o-item(v-if="item.redeemDeliveryShare !== '0.0000'")
                .footer-left-l {{$t('Redemption')}}
                .footer-right
                    span {{$t('share')}}
                    span.price-number(v-if="eyeTab") {{item.redeemDeliveryShare}}
                    span.price-number(v-else) ****
            .o-item(v-if="item.inTransitAmount !== '0.00'")
                .footer-left-l {{$t('subscribe')}}
                .footer-right
                    span {{item.currency == 2 ? 'HKD':'USD'}}
                    span.price-number(v-if="eyeTab") {{item.inTransitAmount}}
                    span.price-number(v-else) ****
    .block-element-nomore(v-if="noMoreShow")
        img.img(src="@/assets/img/fund/empty.png") 
        .no-record-box {{$t('nomore')}}
</template>
<script>
import localStorage from '@/utils/local-storage'
import { gotoNewWebView } from '@/utils/js-bridge.js'
import { getStockColorType } from '@/utils/html-utils.js'
export default {
    props: {
        fundList: {
            type: Array,
            default: () => {}
        },
        noMoreShow: {
            type: Boolean,
            default: false
        },
        eyeTab: {
            type: Boolean,
            default: localStorage.get('showMoney')
        }
    },
    data() {
        return {}
    },
    i18n: {
        zhCHS: {
            amountMoney: '金额',
            share: '份额',
            profitPostion: '持有收益',
            SevenDayIncome: '近七日收益',
            Redemption: '赎回中',
            subscribe: '申购中',
            nomore: '暂无持仓'
        },
        zhCHT: {
            amountMoney: '金額',
            share: '份額',
            profitPostion: '持有收益',
            SevenDayIncome: '近七日收益',
            Redemption: '贖回中',
            subscribe: '申購中',
            nomore: '暫無持倉'
        },
        en: {
            amountMoney: 'Amount',
            share: 'Unit',
            profitPostion: 'Total Return',
            SevenDayIncome: 'RTN 7d',
            Redemption: 'Redeming',
            subscribe: 'Purchasing',
            nomore: 'No Position'
        }
    },
    computed: {
        stockColorType() {
            return +getStockColorType()
        }
    },
    methods: {
        toFundDetails(item) {
            let url = `${window.location.origin}/wealth/fund/index.html#/fund-details?id=${item.fundId}`
            gotoNewWebView(url)
        },
        changeEye() {
            this.eyeTab = localStorage.get('showMoney')
        }
    }
}
</script>
<style lang="scss" scoped>
.block-fund-list-content {
    width: 96%;
    margin: 0 2%;
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
                    font-size: 15px;
                    font-family: 'yxFontDINPro-Regular';
                }
                .active-red {
                    color: #ea3d3d;
                }
                .active-green {
                    color: #00ba60;
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
