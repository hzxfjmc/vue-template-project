<template lang="pug">
.fund-account-header
    van-tabs(
        v-model="active" 
        background="#2f79ff" 
        color="#fff" 
        :line-width="width"
        :swipeable="swipeable"
        title-inactive-color="rgba(255,255,255,0.6)" 
        @click="handlerCurrency"
        title-active-color="#fff")
        van-tab(title="港币基金" name="1")
        van-tab(title="美元基金" name="2")
        .block-account-header
            .header-content
                .header-content-left
                    span.title 
                        em 我的港币资产
                        i.iconfont(class="icon-icon-eye" @click="hideNumber")
                    .number-price(v-if="showPsd") {{firstPositionAmount}}.
                        em(v-if="showPsd") {{secondPositionAmount}}
                    .number-price(v-if="!showPsd") ******
                
                .header-content-right
                    span 持仓盈亏
                        em(v-if="showPsd") {{holdData.positionEarnings}}
                        em(v-else) ****
                    span 近七日收益
                        em(v-if="showPsd") {{holdData.weekEarnings}}
                        em(v-else) ****
            
            .header-footer-tab(class="border-top")
                span.header-footer-left(@click="toRouterPath('/income-details')") 收益明细
                span(@click="toRouterPath('/fund-order-list')") 订单记录
        slot(name="fundList")
</template>
<script>
import { Tab, Tabs } from 'vant'
export default {
    props: {
        holdData: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            width: 0,
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
        //跳转路由
        toRouterPath(path) {
            this.$emit('toRouterPath', path)
        },
        //修改货币
        handlerCurrency(name) {
            name = name == 0 ? 2 : 1
            this.$emit('handlerCurrency', name)
        },
        hideNumber() {
            this.showPsd = !this.showPsd
        }
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
.header-content {
    width: 100%;
    display: flex;
    padding: 0 3% 10px 3%;
    flex-direction: row;
    // margin: 20px 0 10px 0;
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
            .icon-icon-eye {
                font-size: 20px;
                float: left;
                margin: 0 0 0 10px;
            }
        }
        .number-price {
            font-size: 0.76rem;
            em {
                font-size: 0.4rem;
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
