<template lang="pug">
.fund-account-header
    .block-account-header(:class="[code != 1 ? 'bg-hk' : 'bg-ch']")
        .header-content
            .header-content-left
                span.title 
                    em {{$t('accountTotal')}}
                    i.iconfont(
                        :class="showPsd?'icon-icon-eye':'icon-icon-eye-hide'" 
                        @click="hideNumber")
                .fund__content
                    .number-price(
                        v-if="showPsd") {{firstPositionAmount || '--'}}.
                        em(v-if="showPsd") {{secondPositionAmount || '--'}}
                    .number-price.close-eye(v-if="!showPsd") ******
                    .number-price-active 
                        span(@click="handlerCurrencyName") {{currencyNum===0?$t('hkd'):$t('usd')}}
                        em(class="iconfont icon-icon-bottom" @click="handlerCurrencyName") 
                        .block--master(v-if="chooseCurrencyShow" @click="chooseCurrencyShow = !chooseCurrencyShow")
                        .block__currey(v-if="chooseCurrencyShow")
                            span(
                                @click="chooseCurrency(0)"
                                :class="[currencyNum === 0 ? 'active' :'']") {{$t('hkd')}}
                            span(
                                @click="chooseCurrency(1)"
                                :class="[currencyNum === 1 ? 'active' :'']") {{$t('usd')}}
            .block__footer--hold(
                v-if="inTransitOrder!=='0'"
                @click="toRouterPath('/fund-order-list')")
                span {{inTransitOrder}}{{$t('fundmsg')}}
                em(class="iconfont icon-previewright")
            .header-content-right
                .block__content--left
                    span.block__content--subtitle {{$t('SevenDayIncome')}} 
                    span.block__content--p(v-if="showPsd") {{positionDation.weekEarnings>0 ? '+' : ''}} {{positionDation.weekEarnings|transNumToThousandMark}}
                    span.block__content--p(v-else) ****
                .block__content--right
                    span.block__content--subtitle {{$t('profitPosition')}} 
                    span.block__content--p(v-if="showPsd") {{positionDation.positionEarnings>0 ? '+' : positionDation.positionEarnings<0 ? '' :''}} {{positionDation.positionEarnings|transNumToThousandMark}}
                    span.block__content--p(v-else) ****
        .header-footer-tab.border-top(class="border-bottom-active")
            span.header-footer-left(@click="toRouterPath('/income-details')") {{$t('IncomeDetails')}}
            span(@click="toRouterPath('/fund-order-list')") {{$t('OrderRecord')}}
        
    slot(name="fundList")
</template>
<script>
import { Tab, Tabs } from 'vant'
import LS from '@/utils/local-storage'
import { transNumToThousandMark } from '@/utils/tools.js'
import { mapGetters } from 'vuex'
export default {
    props: {
        holdData: {
            type: Object,
            default: () => {}
        },
        inTransitOrder: {
            type: String,
            default: ''
        },
        code: {
            type: Number
        }
    },
    computed: {
        ...mapGetters(['appType'])
    },
    filters: {
        transNumToThousandMark: transNumToThousandMark
    },
    i18n: {
        zhCHS: {
            accountTotal: '基金总资产',
            hkd: '港币',
            usd: '美元',
            myHkdAccount: '港币资产',
            myUsdAccount: '美元资产',
            profitPosition: '持有收益',
            SevenDayIncome: '近七日收益',
            IncomeDetails: '收益明细',
            OrderRecord: '订单记录',
            fundmsg: '笔交易确认中'
        },
        zhCHT: {
            accountTotal: '基金總資產',
            hkd: '港幣',
            usd: '美元',
            fundmsg: '筆交易確認中',
            myHkdAccount: '港幣資產',
            myUsdAccount: '美元資產',
            profitPosition: '持倉收益',
            SevenDayIncome: '近七日收益',
            IncomeDetails: '收益明細',
            OrderRecord: '訂單記錄'
        },
        en: {
            accountTotal: 'Total Fund Assets',
            hkd: 'HKD',
            usd: 'USD',
            myHkdAccount: 'HKD',
            myUsdAccount: 'USD',
            profitPosition: 'Total Return',
            SevenDayIncome: '7 Days',
            fundmsg: ' Processing Order',
            IncomeDetails: 'Revenue Detail',
            OrderRecord: 'Order History'
        }
    },
    data() {
        return {
            chooseCurrencyShow: false,
            currencyNum: 0,
            width: 30,
            active: 0,
            swipeable: true,
            showPsd: true,
            currency: null,
            fontSize: '35',
            lineheight: '40',
            positionDation: {},
            value1: 0,
            firstPositionAmount: '',
            secondPositionAmount: ''
        }
    },
    components: {
        [Tab.name]: Tab,
        [Tabs.name]: Tabs
    },
    watch: {
        holdData() {
            this.holdData.hkSummary.positionAmount = transNumToThousandMark(
                this.holdData.hkSummary.positionAmount
            )
            this.holdData.usSummary.positionAmount = transNumToThousandMark(
                this.holdData.usSummary.positionAmount
            )
            this.positionDation =
                this.currencyNum === 0
                    ? this.holdData.hkSummary
                    : this.holdData.usSummary
            this.Conversion()
        }
    },
    methods: {
        Conversion() {
            if (this.positionDation.positionAmount) {
                this.firstPositionAmount = this.positionDation.positionAmount.split(
                    '.'
                )[0]
                if (this.firstPositionAmount.length > 6) {
                    this.fontSize = '24'
                    this.lineheight = '50'
                }
                this.secondPositionAmount = this.positionDation.positionAmount.split(
                    '.'
                )[1]
            }
        },
        handlerCurrencyName() {
            this.chooseCurrencyShow = true
        },
        chooseCurrency(data) {
            this.currencyNum = data
            LS.put('activeTab', data)
            this.positionDation =
                data === 0 ? this.holdData.hkSummary : this.holdData.usSummary
            this.Conversion(data)
            this.chooseCurrencyShow = false
        },
        //跳转路由
        toRouterPath(path) {
            this.$emit('toRouterPath', path)
        },
        hideNumber() {
            this.showPsd = !this.showPsd
            LS.put('showMoney', this.showPsd)
            this.$emit('changeEyeTab', this.showPsd)
        }
    },
    mounted() {
        this.currencyNum = !LS.get('activeTab') ? 0 : LS.get('activeTab')
        this.showPsd = LS.get('showMoney')
    }
}
</script>
<style lang="scss" scoped>
// @import './index.scss';
.fund-account-header {
    // background: #2f79ff;
    color: #fff;
    width: 100%;
}
.header-tab {
    font-size: 0.32rem;
    width: 50%;
    margin: 0 25%;
    padding: 10px 0 0 0;
    .van-tab {
        font-size: 0.32rem;
    }
}
.block-account-header {
    width: 100%;
    padding: 20px 0 0 0;
}
.bg-hk {
    background: linear-gradient(
        162deg,
        rgba(13, 126, 204, 1) 0%,
        rgba(43, 79, 128, 1) 100%
    );
    box-shadow: 0px 2px 4px 0px rgba(57, 57, 57, 0.2);
}
.bg-ch {
    background: #2f79ff;
}
.border-bottom-active {
    position: relative;
    &::after {
        position: absolute;
        box-sizing: border-box;
        content: ' ';
        pointer-events: none;
        right: 0;
        top: 0;
        left: 0;
        border-top: 1px solid #5e97ff;

        @media only screen and (min-resolution: 2dppx) {
            // 非标准的
            -webkit-transform: scaleY(0.5);
            transform: scaleY(0.5);
        }
    }
}
.header-content {
    width: 100%;
    display: flex;
    padding: 0 3% 20px 3%;
    float: left;
    flex-direction: column;
    .header-content-left {
        width: 100%;
        .title {
            color: rgba(255, 255, 255, 0.6);
            line-height: 20px;
            display: flex;
            justify-content: center;
            width: 100%;
            font-size: 0.24rem;
            em {
                float: left;
            }
            .iconfont {
                font-size: 20px;
                float: left;
                margin: 0 0 0 10px;
            }
        }
        .fund__content {
            display: flex;
            height: 40px;
            justify-content: center;
            width: 100%;
            flex-direction: row;
            .number-price {
                font-size: 30px;
                font-family: 'yxFontDINPro-Medium';
                em {
                    font-size: 0.4rem;
                }
            }
            .close-eye {
                line-height: 64px;
            }
            .number-price-active {
                width: 55px;
                height: 40px;
                line-height: 55px;
                margin: 0 0 0 5px;
                text-align: right;
                height: 100%;
                position: relative;
                .block--master {
                    position: fixed;
                    width: 100%;
                    top: 0;
                    left: 0;
                    z-index: 99999;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                }
                .block__currey {
                    width: 120px;
                    position: absolute;
                    height: 100px;
                    z-index: 9999999;
                    text-align: left;
                    border-radius: 10px;
                    left: 0px;
                    top: 55px;
                    background: #fff;
                    display: flex;
                    justify-content: center;
                    flex-direction: column;
                    span {
                        color: #000;
                        width: 100px;
                        height: 50px;
                        line-height: 50px;
                        display: block;
                        margin: 0 10px;
                    }
                    .active {
                        color: #0091ff;
                    }
                }
                .block__currey:before {
                    content: '';
                    width: 0px;
                    height: 0px;
                    top: -10px;
                    left: 20px;
                    border-left: 10px solid transparent;
                    border-right: 10px solid transparent;
                    border-bottom: 10px solid #fff;
                    position: absolute;
                }
                em {
                    margin: 0 5px 0 0;
                }
                .number__price--subcontent {
                    position: absolute;
                    width: 100px;
                    top: 40px;
                    left: -40px;
                    height: 80px;
                    z-index: 9999;
                    background: #fff;
                }
            }
        }
    }
    .header-content-right {
        display: flex;
        flex-direction: row;
        width: 100%;
        .block__content--left,
        .block__content--right {
            width: 50%;
            display: flex;
            flex-direction: column;
            text-align: center;
            .block__content--subtitle {
                font-size: 14px;
                line-height: 30px;
            }
            .block__content--p {
                font-size: 16px;
                color: #fff;
                font-family: yxFontDINPro-Medium;
            }
        }
        span {
            display: inline-block;
            width: 100%;
            font-size: 0.24rem;
            color: rgba(255, 255, 255, 0.6);
            line-height: 17px;
            em {
                color: #fff;
                width: 40%;
                text-align: right;
                display: inline-block;
            }
        }
    }
    em {
        font-style: normal;
    }
}
.header-footer-tab {
    width: 100%;
    padding: 0 3% 0 3%;
    height: 40px;
    // border: 1px solid red;
    margin: 30px 0 0 0;
    line-height: 40px;
    display: flex;
    font-size: 0.28rem;
    span {
        display: inline-block;
        width: 50%;
        height: 40px;
        line-height: 40px;
        text-align: center;
    }
    .header-footer-left {
        position: relative;
    }
    .header-footer-left:after {
        content: '';
        height: 20px;
        position: absolute;
        top: 10px;
        border-right: 1px solid rgba(255, 255, 255, 0.2);
        right: 0;
    }
}
.block__footer--hold {
    line-height: 40px;
    display: flex;
    justify-content: center;
    color: rgba(255, 255, 255, 0.6);
    span {
        font-size: 14px;
        // color: rgba(255, 255, 255, 1);
    }
    em {
        font-size: 20px;
        // color: rgba(255, 255, 255, 1);
        line-height: 40px;
        margin: 1px 0 0 5px;
    }
}
</style>
