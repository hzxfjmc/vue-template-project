<template lang="pug">
.block-fund-list-content(:class="[code!=1? 'block-fund-list-content-hk' : 'block-fund-list-content-ch']")
    .block__fund-title.border-bottom(@click="hanlderSwitch") 
        span(:style="{background:bgColor}")
        p {{title}}
        .block__fund--right
            p {{currency === '2'?'港币市值' :'美元市值'}}
            p {{currency === '2'?'hkd' :'usd'}} 437647836
        em(:class="listShow && fundList.length != 0 ? 'iconfont icon-icon-bottom' : 'iconfont icon-iconshouqi'")
    .list-item-content(
        v-for="(item,index) in fundList" 
        v-if="listShow"
        :key="index" 
        @click="toFundDetails(item)")
        .fund-name {{item.fundName}}
        .fund-list-num
            .fund-row
                .fund__row--list
                    .block-element-number(v-if="eyeTab") {{item.positionAmount}}
                    .block-element-number(v-else) ****
                    span {{$t('amountMoney')}}
                .fund__row--list
                    .block-element-number(
                        v-if="eyeTab && item.flag == 0" 
                        :class="stockColorType === 1 ?'active-red':'active-green'") +{{item.positionEarnings|parseThousands}}
                    .block-element-number(
                        v-if="eyeTab && item.flag == 1" 
                        :class="stockColorType === 1 ?'active-green':'active-red'") {{item.positionEarnings}}
                    .block-element-number(
                        v-if="eyeTab && item.flag == 2") {{item.positionEarnings}}
                    .block-element-number(v-if="!eyeTab") ****
                    span {{$t('profitPostion')}}
            .fund-row
                .fund__row--list
                    .block-element-number(v-if="eyeTab && item.flag1 == 0" :class="stockColorType === 1 ?'active-red':'active-green'") +{{item.weekEarnings}}
                    .block-element-number(v-if="eyeTab && item.flag1 == 1" :class="stockColorType === 1 ?'active-green':'active-red'") {{item.weekEarnings}}
                    .block-element-number(v-if="eyeTab && item.flag1 == 2") {{item.weekEarnings}}
                    .block-element-number(v-if="!eyeTab") ****
                    span {{$t('SevenDayIncome')}}
                .fund__row--list
                    .block-element-number(v-if="eyeTab") {{item.positionShare}}
                    .block-element-number(v-else) ****
                    span {{$t('share')}}
        .fund-list-other(
            class="border-top" 
            v-if="item.redeemDeliveryShare != 0 || item.inTransitAmount != 0")
            .o-item(v-if="item.redeemDeliveryShare != 0")
                .footer-left-l {{$t('Redemption')}}
                .footer-right
                    span {{$t('share')}}
                    span.price-number(v-if="eyeTab") {{item.redeemDeliveryShare}}
                    span.price-number(v-else) ****
            .o-item(v-if="item.inTransitAmount != 0")
                .footer-left-l {{$t('subscribe')}}
                .footer-right
                    span {{item.currency}}
                    span.price-number(v-if="eyeTab") {{item.inTransitAmount|parseThousands(2)}}
                    span.price-number(v-else) ****
    .list-item-content-sub(v-if="fundList.length === 0")
        span {{$t('nomore')}}

   
</template>
<script>
import localStorage from '@/utils/local-storage'
import { gotoNewWebView } from '@/utils/js-bridge.js'
import { getStockColorType } from '@/utils/html-utils.js'
import { mapGetters } from 'vuex'
import { parseThousands } from '@/utils/tools.js'
export default {
    props: {
        bgColor: {
            type: String,
            default: ''
        },
        title: {
            type: String,
            default: ''
        },
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
        },
        currency: {
            type: String
        },
        code: {
            type: Number
        }
    },
    data() {
        return {
            listShow: true
        }
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
            SevenDayIncome: '7 Days',
            Redemption: 'Redeming',
            subscribe: 'Purchasing',
            nomore: 'No Position'
        }
    },
    computed: {
        ...mapGetters(['appType']),
        stockColorType() {
            return +getStockColorType()
        }
    },
    filters: {
        parseThousands
    },
    methods: {
        hanlderSwitch() {
            this.listShow = !this.listShow
        },
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
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 4px 0px rgba(57, 57, 57, 0.1);
    border-radius: 10px;
    overflow: hidden;
    color: #000;
    .block__fund-title {
        display: flex;
        flex-direction: row;
        height: 44px;
        line-height: 44px;
        .block__fund--right {
            font-size: 11px;
            width: 300px;
            text-align: right;
            margin: 5px 0;
            // border: 1px solid red;
            p {
                font-size: 11px;
                line-height: 17px;
                color: rgba(25, 25, 25, 0.5);
            }
        }
        span {
            display: block;
            width: 4px;
            height: 16px;
            margin: 14px 0;
        }
        p {
            width: 85%;
            font-size: 16px;
            margin: 0 0 0 18px;
        }
    }
    .list-item-content {
        width: 100%;
        padding: 10px 5% 14px 5%;
        border-bottom: 1px solid #e1e1e1;
        background: #fff;
        .fund-name {
            font-size: 0.32rem;
            line-height: 20px;
            margin: 10px 0 5px 0;
        }
        .fund-list-num {
            display: flex;
            margin: 14px 0 0 0;
            flex-direction: column;
            .fund-row {
                width: 100%;
                text-align: right;
                display: flex;
                flex-direction: row;
                .fund__row--list {
                    width: 50%;
                    margin: 6px 0 0 0;
                    text-align: left;
                }
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
    .list-item-content:last-child {
        border: none;
    }
    .list-item-content-sub {
        text-align: center;
        line-height: 40px;
    }
}
.block-fund-list-content-hk {
    width: 90%;
    margin: 20px 5% 0 5%;
}
.block-fund-list-content-ch {
    width: 96%;
    margin: 14px 2% 0 2%;
}
</style>
