<template lang="pug">
.home-header-container(class="fund-account-header")
    .header-tab
        van-tabs(
            v-model="active" 
            background="#2f79ff" 
            color="#fff" 
            border=false
            title-inactive-color="#fff" 
            title-active-color="#fff")
            van-tab(title="港币基金" name="1")
            van-tab(title="美元基金" name="2")
    .header-content-item
        .list-item(v-for="(item,index) in list" :key="item.icon" @click='toFundList(item,index)')
            i.iconfont(:class="item.icon")
            span {{item.label}}
    
    .header-content-number
        .header-content-top
            span 持仓总市值(HKD) 
            i.iconfont(class="icon-icon-eye" @click="hideNumber")
        .header-content(@click="toFundAccount")
            span(v-if="showMoney") {{firstPositionAmount}}
            em(v-if="showMoney") .{{secondPositionAmount}}
            span(v-if="!showMoney") *******
        .header-content-bottom
            .header-row-left
                span 持有收益
                em(v-if="showMoney") {{holdData.positionEarnings}}
                em.element-hide(v-else) ****
            .header-row-right
                span 近七日收益
                em(v-if="showMoney") {{holdData.weekEarnings}}
                em.element-hide(v-else) ****

</template>
<script>
import { Tab, Tabs } from 'vant'
export default {
    components: {
        [Tab.name]: Tab,
        [Tabs.name]: Tabs
    },
    data() {
        return {
            showMoney: true,
            list: [
                { icon: 'icon-icon-currency-fund', label: '货币基金' },
                { icon: 'icon-iconFFzhaiquanjijin', label: '债券基金' },
                { icon: 'icon-icon-sharesfund', label: '股票基金' },
                { icon: 'icon-iconFFhunhejijin', label: '混合基金' }
            ],
            active: 0
        }
    },
    props: {
        holdData: {
            type: Object,
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
        //隐藏
        hideNumber() {
            this.showMoney = !this.showMoney
        },
        //跳转基金列表页面
        toFundList() {
            this.$router.push({
                path: '/'
            })
        },
        toFundAccount() {
            this.$router.push({
                path: '/fund-account'
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.home-header-container {
    width: 100%;
    padding: 0 0 10px 0;
    background: #2f79ff;
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
    flex-direction: row;
    color: #fff;
    .iconfont {
        display: inline-block;
        font-size: 0.36rem;
    }
    .list-item {
        width: 25%;
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
