<template lang="pug">
.fund-account-header
    .block-account-header
        .header-content
            .header-content-left
                span.title 
                    em 基金总资产
                    i.iconfont(:class="showPsd?'icon-icon-eye':'icon-icon-eye-hide'" @click="hideNumber")
                .fund__content
                    .number-price(v-if="showPsd") {{firstPositionAmount || '--'}}.
                        em(v-if="showPsd") {{secondPositionAmount || '--'}}
                    .number-price(v-if="!showPsd") ******
                    .number-price-active 
                        span(@click="handlerCurrencyName") {{currencyNum===0?'港币':'美元'}}
                        em(class="iconfont icon-icon-bottom" @click="handlerCurrencyName") 
                        .block--master(v-if="chooseCurrencyShow")
                        .block__currey(v-if="chooseCurrencyShow")
                            span.border-bottom(
                                @click="chooseCurrency(0)"
                                :class="[currencyNum === 0 ? 'active' :'']") 港币
                            span(
                                @click="chooseCurrency(1)"
                                :class="[currencyNum === 1 ? 'active' :'']") 美元
            
            .header-content-right
                span {{$t('profitPosition')}}
                    em(v-if="showPsd") {{holdData.positionAmountFlag}}{{holdData.positionEarnings || '--'}}
                    em(v-else) ****
                span {{$t('SevenDayIncome')}}
                    em(v-if="showPsd") {{holdData.positionEarningsFlag}}{{holdData.weekEarnings || '--'}}
                    em(v-else) ****
        
        .header-footer-tab(class="border-bottom-active")
            span.header-footer-left(@click="toRouterPath('/income-details')") {{$t('IncomeDetails')}}
            span(@click="toRouterPath('/fund-order-list')") {{$t('OrderRecord')}}
    slot(name="fundList")
</template>
<script>
import { Tab, Tabs } from 'vant'
// import { DropdownMenu, DropdownItem } from 'vant-fork'
import LS from '@/utils/local-storage'
import { enumCurrency } from '@/pages/fund/index/map'
export default {
    props: {
        holdData: {
            type: Object,
            default: () => {}
        }
    },
    i18n: {
        zhCHS: {
            myHkdAccount: '港币资产',
            myUsdAccount: '美元资产',
            profitPosition: '持有收益',
            SevenDayIncome: '近七日收益',
            IncomeDetails: '收益明细',
            OrderRecord: '订单记录'
        },
        zhCHT: {
            myHkdAccount: '港幣資產',
            myUsdAccount: '美元資產',
            profitPosition: '持倉收益',
            SevenDayIncome: '近七日收益',
            IncomeDetails: '收益明細',
            OrderRecord: '訂單記錄'
        },
        en: {
            myHkdAccount: 'HKD',
            myUsdAccount: 'USD',
            profitPosition: 'Total Return',
            SevenDayIncome: 'RTN 7d ',
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
            value1: 0,
            option1: [
                { text: '全部商品', value: 0 },
                { text: '新款商品', value: 1 },
                { text: '活动商品', value: 2 }
            ]
        }
    },
    components: {
        [Tab.name]: Tab,
        [Tabs.name]: Tabs
    },
    computed: {
        firstPositionAmount() {
            if (!this.holdData.positionAmount) return null
            return this.holdData.positionAmount.split('.')[0]
        },
        secondPositionAmount() {
            if (!this.holdData.positionAmount) return null
            return this.holdData.positionAmount.split('.')[1]
        }
    },
    methods: {
        handlerCurrencyName() {
            this.chooseCurrencyShow = true
            document.body.style.overflow = 'hidden'
            document.addEventListener(
                'touchmove',
                e => {
                    e.preventDefault()
                },
                false
            ) //禁止页面滑动
        },
        chooseCurrency(data) {
            this.currencyNum = data
            this.chooseCurrencyShow = false
            document.body.style.overflow = '' //出现滚动条
            document.removeEventListener(
                'touchmove',
                e => {
                    e.preventDefault()
                },
                false
            )
        },
        //跳转路由
        toRouterPath(path) {
            this.$emit('toRouterPath', path)
        },
        //修改货币
        handlerCurrency(name) {
            this.currency = name === 0 ? enumCurrency.HKD : enumCurrency.USD
            this.$emit('handlerCurrency', this.currency, name)
        },
        hideNumber() {
            this.showPsd = !this.showPsd
            LS.put('showMoney', this.showPsd)
            this.$emit('changeEyeTab', this.showPsd)
        }
    },
    mounted() {
        this.active = LS.get('activeTab')
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
    height: 150px;
    background: linear-gradient(
        162deg,
        rgba(13, 126, 204, 1) 0%,
        rgba(43, 79, 128, 1) 100%
    );
    // background: #2f79ff;
    box-shadow: 0px 2px 4px 0px rgba(57, 57, 57, 0.2);
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
    padding: 0 3% 10px 3%;
    flex-direction: row;
    .header-content-left {
        flex: 1;
        width: 60%;
        .title {
            color: rgba(255, 255, 255, 0.6);
            line-height: 20px;
            display: flex;
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
            width: 100%;
            flex-direction: row;
            .number-price {
                font-size: 0.7rem;
                // flex: 10;
                font-family: 'yxFontDINPro-Medium';
                em {
                    font-size: 0.4rem;
                }
            }
            .number-price-active {
                width: 50px;
                height: 40px;
                line-height: 55px;
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
        flex: 1;
        width: 40%;
        margin: 28px 0 0 0;
        span {
            display: inline-block;
            width: 100%;
            text-align: right;
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
    margin: 10px 0 0 0;
    padding: 0 3% 0 3%;
    height: 40px;
    line-height: 40px;
    display: flex;
    font-size: 0.28rem;
    span {
        display: inline-block;
        width: 50%;
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
</style>
