<template lang="pug">
.fund-account-header
    van-tabs(
        v-model="active" 
        background="#2f79ff" 
        color="#fff" 
        :line-width="width"
        :swipeable="swipeable"
        title-inactive-color="rgba(255,255,255,0.6)" 
        @change="handlerCurrency"
        @click="handlerClickCurrency"
        title-active-color="#fff")
        van-tab(:title="$t('myHkdAccount')" name="2")
        van-tab(:title="$t('myUsdAccount')" name="1")
        .block-account-header
            .header-content
                .header-content-left
                    span.title 
                        em(v-if="holdData.currency == 2") {{$t('myHkdAccount')}}
                        em(v-if="holdData.currency == 1") {{$t('myUsdAccount')}}
                        i.iconfont(:class="showPsd?'icon-icon-eye':'icon-icon-eye-hide'" @click="hideNumber")
                    .number-price(v-if="showPsd") {{firstPositionAmount || '--'}}.
                        em(v-if="showPsd") {{secondPositionAmount || '--'}}
                    .number-price(v-if="!showPsd") ******
                
                .header-content-right
                    span {{$t('profitPostion')}}
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
import localStorage from '@/utils/local-storage'
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
            profitPostion: '持有收益',
            SevenDayIncome: '近七日收益',
            IncomeDetails: '收益明细',
            OrderRecord: '订单记录'
        },
        zhCHT: {
            myHkdAccount: '港幣資產',
            myUsdAccount: '美元資產',
            profitPostion: '持倉收益',
            SevenDayIncome: '近七日收益',
            IncomeDetails: '收益明細',
            OrderRecord: '訂單記錄'
        },
        en: {
            myHkdAccount: 'HKD Assets',
            myUsdAccount: 'USD Assets',
            profitPostion: 'Total Return',
            SevenDayIncome: 'RTN 7d ',
            IncomeDetails: 'Revenue Detail',
            OrderRecord: 'Order History'
        }
    },
    data() {
        return {
            width: 30,
            active: 0,
            swipeable: true,
            showPsd: true
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
        //
        handlerClickCurrency() {
            console.log(213123)
        },
        //跳转路由
        toRouterPath(path) {
            this.$emit('toRouterPath', path)
        },
        //修改货币
        handlerCurrency(name) {
            localStorage.put('activeTab', name)
            name = name == 0 ? 2 : 1
            this.$emit('handlerCurrency', name)
        },
        hideNumber() {
            this.showPsd = !this.showPsd
            localStorage.put('showMoney', this.showPsd)
            this.$emit('changeEyeTab', this.showPsd)
        }
    },
    mounted() {
        this.active =
            localStorage.get('activeTab') != null
                ? localStorage.get('activeTab')
                : 0
        this.showPsd = localStorage.get('showMoney')
    }
}
</script>
<style lang="scss" scoped>
// @import './index.scss';
.fund-account-header {
    // background: #2f79ff;
    color: #fff;
    overflow: hidden;
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
    padding: 0 3% 10px 3%;
    flex-direction: row;
    // margin: 20px 0 10px 0;
    .header-content-left {
        flex: 1;
        width: 52%;
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
        .number-price {
            font-size: 0.7rem;
            font-family: 'yxFontDINPro-Medium';
            em {
                font-size: 0.4rem;
            }
        }
    }
    .header-content-right {
        flex: 1;
        width: 43%;
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
    padding: 0 3%;
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
