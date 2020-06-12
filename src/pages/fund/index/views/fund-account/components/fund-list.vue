<template lang="pug">
.block-fund-list-content(:class="[code!=1? 'block-fund-list-content-ch' : 'block-fund-list-content-ch']")
    .block__fund-title(@click="hanlderSwitch") 
        span(:style="{background:bgColor}")
        p.title {{title}}
        .block__fund--right
            p {{currency === '2'?$t('hkdAssets') :$t('usdAssets')}} {{currency === '2'?'HKD' :'USD'}} 
                em.block__em(v-if="eyeTab") {{amount}}
                em.block_em1(v-else) ****
        em(:class="listShow && fundList.length != 0 ? 'iconfont icon-icon-bottom' : 'iconfont icon-iconshouqi'")
    .list-item-content.border-bottom(
        v-for="(item,index) in fundList" 
        v-if="listShow"
        :key="index" 
        @click="toFundDetails(item)")
        .fund-name 
            p {{item.fundName}}
            span(v-if="item.fixedFlag && investmentWhiteBit") {{$t('A2')}}
        .fund-list-num
            .fund-row
                .fund__row--list
                    span {{$t('positionMarketValue')}}
                    .block-element-number(v-if="eyeTab") {{item.positionAmount|parseThousands(2)}}
                    .block-element-number(v-else) ****
                    
                .fund__row--list.block__center
                    span {{$t('profitPostion')}}
                    .block-element-number(
                        v-if="eyeTab && item.positionEarnings>0" 
                        :class="stockColorType === 1 ?'active-red':'active-green'") +{{item.positionEarnings|parseThousands}}
                    .block-element-number(
                        v-if="eyeTab && item.positionEarnings<0 " 
                        :class="stockColorType === 1 ?'active-green':'active-red'") {{item.positionEarnings}}
                    .block-element-number(
                        v-if="eyeTab && item.positionEarnings==0") {{item.positionEarnings}}
                    .block-element-number(v-if="!eyeTab") ****
                    
                .fund__row--list.block__right
                    span {{$t('SevenDayIncome')}}
                    .block-element-number(v-if="eyeTab  && item.weekEarnings>0" :class="stockColorType === 1 ?'active-red':'active-green'") +{{item.weekEarnings|parseThousands(2)}}
                    .block-element-number(v-if="eyeTab && item.weekEarnings<0" :class="stockColorType === 1 ?'active-green':'active-red'") {{item.weekEarnings|parseThousands(2)}}
                    .block-element-number(v-if="eyeTab  && item.weekEarnings==0") {{item.weekEarnings||'0.00'}}
                    .block-element-number(v-if="!eyeTab") ****
                   
            //- .fund-row
                
        .fund-list-other(
            v-if="item.redeemDeliveryShare != 0 || item.inTransitAmount != 0")
            .o-item(v-if="item.redeemDeliveryShare != 0")
                .footer-left-l {{$t('Redemption')}}
                .footer-right
                    span {{$t('share')}}
                    span.price-number(v-if="eyeTab") {{item.redeemDeliveryShare}}
                    span.price-number(v-else) ****
            .o-item(v-if="item.inTransitAmount != 0")
                .footer-left-l {{code === 1 ? $t('subscribe') : $t('subscribeHk')}}
                .footer-right
                    span {{item.currency == 1 ? $t('usd'):$t('hkd')}}
                    span.price-number(v-if="eyeTab") {{item.inTransitAmount|parseThousands(2)}}
                    span.price-number(v-else) ****
    .list-item-content-sub(v-if="fundList.length === 0")
        span {{$t('nomore')}}

   
</template>
<script>
import localStorage from '@/utils/local-storage'
import { getStockColorType } from '@/utils/html-utils.js'
import { mapGetters } from 'vuex'
import { parseThousands, jumpUrl } from '@/utils/tools.js'
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
        investmentWhiteBit: {
            type: Boolean,
            default: false
        },
        fundList: {
            type: Array,
            default: () => {}
        },
        amount: {
            type: String,
            default: ''
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
            hkdAssets: '港币市值',
            usdAssets: '美元市值',
            profitPostion: '持有收益',
            SevenDayIncome: '近七日收益',
            positionMarketValue: '持有资产',
            Redemption: '赎回中',
            subscribe: '申购中',
            subscribeHk: '申购中',
            nomore: '暂无持仓',
            usd: '美元',
            hkd: '港币'
        },
        zhCHT: {
            amountMoney: '金額',
            share: '份額',
            positionMarketValue: '持有市值',
            hkdAssets: '港幣市值',
            usdAssets: '美元市值',
            profitPostion: '持有收益',
            SevenDayIncome: '近七日收益',
            Redemption: '贖回中',
            subscribe: '申購中',
            subscribeHk: '認購中',
            nomore: '暫無持倉',
            usd: '美元',
            hkd: '港幣'
        },
        en: {
            amountMoney: 'Amount',
            share: 'Unit',
            positionMarketValue: 'Holding Value',
            hkdAssets: 'HKD Holdings',
            usdAssets: 'USD Holdings',
            profitPostion: 'Total Return',
            SevenDayIncome: '7 Days',
            Redemption: 'Redeming',
            subscribe: 'Purchasing',
            subscribeHk: 'Purchasing',
            nomore: 'No Holdings',
            usd: 'USD',
            hkd: 'HKD'
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
            let url = `${window.location.origin}/wealth/fund/index.html#/hold-fund-details?id=${item.fundId}`
            jumpUrl(3, url)
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
        align-items: center;
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        line-height: 44px;
        // .title {
        //     font-weight: bolder;
        // }
        .block__fund--right {
            font-size: 11px;
            text-align: right;
            margin: 5px 0;
            p {
                font-size: 12px;
                line-height: 36px;
                white-space: nowrap;
                color: rgba(25, 25, 25, 0.5);
            }
            .block__em {
                font-style: normal;
                padding: 0;
            }
            .block_em1 {
                font-style: normal;
                padding: 0;
            }
        }
        span {
            display: block;
            width: 4px;
            height: 14px;
            margin: 6px 0 6px 4px;
        }
        p {
            width: 85%;
            font-size: 16px;
            margin: 0 0 0 6px;
        }
        em {
            padding: 0 12px 0 6px;
            color: rgba(25, 25, 25, 0.45);
        }
    }
    .list-item-content {
        padding: 10px 5% 14px 5%;
        background: #fff;
        .fund-name {
            font-size: 0.32rem;
            line-height: 20px;
            margin: 10px 0 5px 0;
            display: flex;
            flex-direction: row;
            p {
                max-width: 80%;
                text-overflow: ellipsis;
                display: -webkit-box;
                overflow: hidden;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
            }
            span {
                display: block;
                padding: 0 8px;
                font-size: 10px;
                background: rgba(47, 121, 255, 1);
                color: #fff;
                border-radius: 1px;
                margin: 0 0 0 6px;
            }
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
                .block__center {
                    text-align: center;
                }
                .block__right {
                    text-align: right;
                }
                span {
                    font-size: 0.24rem;
                    color: rgba(25, 25, 25, 0.5);
                }
                .block-element-number {
                    font-size: 14px;
                    font-family: 'yxFontDINPro-Medium';
                    // font-weight: bold;
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
            // padding: 7px 0 0 0;
            line-height: 40px;
            .o-item {
                display: flex;
                margin: 5px 0 0 0;
                height: 40px;
                border-radius: 4px;
                background: rgba(0, 0, 0, 0.02);
                flex-direction: row;
                .footer-left-l {
                    width: 50%;
                    padding: 0 0 0 10px;
                }
                .footer-right {
                    text-align: right;
                    width: 50%;
                    padding: 0 10px 0 0;
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
    width: 351px;
    margin: 20px 12px 0 12px;
}
.block-fund-list-content-ch {
    width: 351px;
    margin: 14px 12px 0 12px;
}
</style>
