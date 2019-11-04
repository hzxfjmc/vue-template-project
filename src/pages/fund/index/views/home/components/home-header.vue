<template lang="pug">
.home-header-container(class="fund-account-header")
    van-tabs(
        v-model="active" 
        background="#2f79ff" 
        color="#fff" 
        :swipeable="swipeable"
        @change = "handlerCurrency"
        @click="handlerCurrency"
        :line-width="width"
        title-inactive-color="rgba(255,255,255,0.6)" 
        title-active-color="#fff")
            van-tab(:title="$t('hkdFund')" name="2")
            van-tab(:title="$t('usdFund')" name="1")
            .block-home-content
                .header-content-item
                    .list-item(
                        v-for="(item,index) in list" 
                        :key="item.icon" 
                        :style="{width:`${100/(list.length)}%`}"
                        @click='toFundList(item,index)')
                        i.iconfont(:class="item.icon")
                        span {{item.assetTypeName}}
                
                .header-content-number
                    .header-content-top
                        span {{$t('AllTotalMarketPostion')}} ({{this.currency == 2 ? 'HKD':'USD'}}) 
                        i.iconfont(:class="showMoney ? 'icon-icon-eye' :'icon-icon-eye-hide'" @click="hideNumber")
                    .header-content(@click="toFundAccount")
                        span(v-if="showMoney") {{firstPositionAmount || '--'}}
                        em(v-if="showMoney") .{{secondPositionAmount || '--'}}
                        span(v-if="!showMoney") *******
                    .header-content-bottom
                        .header-row-left
                            span {{$t('HoldIncome')}}
                            em(v-if="showMoney") {{holdData.positionEarnings || '--'}}
                            em.element-hide(v-else) ****
                        .header-row-right
                            span {{$t('SevenDayIncome')}}
                            em(v-if="showMoney") {{holdData.weekEarnings || '--'}}
                            em.element-hide(v-else) ****
            .block-element
                slot(name="banner")
                slot(name="fundList")

</template>
<script>
import { Tab, Tabs } from 'vant'
import localStorage from '@/utils/local-storage'
import { getReleaseFundAssetType } from '@/service/finance-info-server.js'
export default {
    components: {
        [Tab.name]: Tab,
        [Tabs.name]: Tabs
    },
    i18n: {
        zhCHS: {
            hkdFund: '港币资产',
            usdFund: '美元资产',
            AllTotalMarketPostion: '持仓总市值',
            HoldIncome: '持有收益',
            SevenDayIncome: '近七日收益'
        },
        zhCHT: {
            hkdFund: '港幣資產',
            usdFund: '美元資產',
            AllTotalMarketPostion: '持倉總市值',
            HoldIncome: '持有收益',
            SevenDayIncome: '近七日收益'
        },
        en: {
            hkdFund: 'HKD Assets',
            usdFund: 'USD Assets',
            AllTotalMarketPostion: 'Market Value',
            HoldIncome: 'Total Return',
            SevenDayIncome: 'RTN 7d'
        }
    },
    data() {
        return {
            width: 30,
            showMoney: true,
            swipeable: true, //开启手势滑动
            list: [],
            currency: 2,
            active: 0
        }
    },
    props: {
        holdData: {
            type: Object,
            default: () => {}
        },
        lists: {
            type: Array,
            default: () => {}
        }
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
        //修改货币
        handlerCurrency(name) {
            localStorage.put('activeTab', name)
            this.currency = name == 0 ? 2 : 1
            this.getReleaseFundAssetType()
            this.$emit('handlerCurrency', this.currency)
        },
        //隐藏
        hideNumber() {
            this.showMoney = !this.showMoney
            localStorage.put('showMoney', this.showMoney)
        },
        //跳转基金列表页面
        toFundList(data) {
            this.$emit('toFundList', {
                type: data.assetType,
                assetTypeName: data.assetTypeName
            })
        },
        toFundAccount() {
            this.$router.push({
                path: '/fund-account'
            })
        },
        //获取已发布的基金底层分类
        async getReleaseFundAssetType() {
            try {
                let data = {
                    currency: this.currency
                }
                if (localStorage.get('activeTab') != null) {
                    data.currency = localStorage.get('activeTab') == 0 ? 2 : 1
                }
                this.list = await getReleaseFundAssetType(data)
                this.list.map(item => {
                    switch (item.assetType) {
                        case 1:
                            item.icon = 'icon-icon_EquityFund'
                            break
                        case 2:
                            item.icon = 'icon-icon_BondFund'
                            break
                        case 3:
                            item.icon = 'icon-icon_MixedFund'
                            break
                        case 4:
                            item.icon = 'icon-icon_MonetaryFund'
                            break
                        case 5:
                            item.icon = 'icon-icon_etf'
                            break
                        case 6:
                            item.icon = 'icon-icon_Financialfund'
                            break
                    }
                })
            } catch (e) {
                this.$toast(e.msg)
            }
        }
    },
    mounted() {
        this.getReleaseFundAssetType()
        this.active =
            localStorage.get('activeTab') != null
                ? localStorage.get('activeTab')
                : 0
        this.showMoney =
            localStorage.get('showMoney') != null
                ? localStorage.get('showMoney')
                : true
    }
}
</script>
<style lang="scss" scoped>
.block-home-content {
    background: #2f79ff;
    padding: 0 0 10px 0;
}
.home-header-container {
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
.header-content-item {
    width: 100%;
    display: flex;
    padding: 20px 0 10px 0;
    height: 78px;
    // background: #2f79ff;
    flex-direction: row;
    color: #fff;
    .iconfont {
        display: inline-block;
        font-size: 0.36rem;
    }
    .list-item {
        background: #2f79ff;
        display: flex;
        flex-direction: column;
        text-align: center;
        span {
            font-size: 0.28rem;
        }
    }
}
.header-content-number {
    width: 96%;
    margin: 10px 2%;
    background: #2f79ff;
    background: #fff;
    padding: 0 0 10px 0;
    height: 130px;
    // height: 133px;
    border-radius: 4px;
    .header-content-top {
        // text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px 0 0 0;
        span {
            color: rgba(25, 25, 25, 0.5);
            font-size: 0.24rem;
            // display: inline-block;
            line-height: 17px;
        }
        .iconfont {
            // display: inline-block;
            line-height: 17px;
            font-size: 0.4rem;
            padding: 0 0 0 10px;
        }
    }
    .header-content {
        font-family: 'yxFontDINPro-Medium';
        line-height: 36px;
        margin: 5px 0 0 0;
        text-align: center;
        span {
            font-size: 0.56rem;
        }
        em {
            font-style: normal;
            font-size: 0.4rem;
        }
    }
    .header-content-bottom {
        display: flex;
        flex-direction: row;
        width: 96%;

        margin: 10px 2% 0 2%;
        // align-items: center;
        .header-row-left,
        .header-row-right {
            display: flex;
            flex-direction: row;
            align-items: center;
            width: 50%;
            // line-height: 20px;
            em {
                font-style: normal;
                font-family: 'yxFontDINPro-Regular';
                font-size: 0.32rem;
                display: inline-block;
                margin: 0 0 0 5px;
                // padding: 6px 0 0 0;
            }
            span {
                font-size: 0.24rem;
                // float: right;
                color: rgba(25, 25, 25, 0.5);
            }
            .element-hide {
                // padding: 3px 0 0 0;
                display: flex;
                justify-content: center;
                padding: 6px 0 0 0;
                align-items: center;
                // float: left;
                // line-height: 24px;
            }
        }
        .header-row-right {
            text-align: right;
            justify-content: flex-end;
        }
    }
}
</style>
