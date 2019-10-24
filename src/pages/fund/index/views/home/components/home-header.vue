<template lang="pug">
.home-header-container(class="fund-account-header")
    .header-tab
        van-tabs(
            v-model="active" 
            background="#2f79ff" 
            color="#fff" 
            @click="handlerCurrency"
            :line-width="width"
            title-inactive-color="rgba(255,255,255,0.6)" 
            title-active-color="#fff")
            van-tab(title="港币基金" name="2")
            van-tab(title="美元基金" name="1")
    .header-content-item
        .list-item(v-for="(item,index) in list" :key="item.icon" @click='toFundList(item,index)')
            i.iconfont(:class="item.icon")
            span {{item.assetTypeName}}
    
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
import { getReleaseFundAssetType } from '@/service/finance-info-server.js'
export default {
    components: {
        [Tab.name]: Tab,
        [Tabs.name]: Tabs
    },
    data() {
        return {
            width: 0,
            showMoney: true,
            list: [],
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
        //获取已发布的基金底层分类
        async getReleaseFundAssetType() {
            try {
                this.list = await getReleaseFundAssetType()
                this.list.map(item => {
                    switch (item.assetType) {
                        case 1:
                            item.icon = 'icon-icon-sharesfund'
                            break
                        case 2:
                            item.icon = 'icon-iconFFzhaiquanjijin'
                            break
                        case 3:
                            item.icon = 'icon-iconFFhunhejijin'
                            break
                        case 4:
                            item.icon = 'icon-icon-currency-fund'
                            break
                    }
                })
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        //修改货币
        handlerCurrency(name) {
            name = name == 0 ? 2 : 1
            this.$emit('handlerCurrency', name)
        },
        //隐藏
        hideNumber() {
            this.showMoney = !this.showMoney
        },
        //跳转基金列表页面
        toFundList(data) {
            this.$emit('toFundList', { type: data.assetType })
        },
        toFundAccount() {
            this.$router.push({
                path: '/fund-account'
            })
        }
    },
    mounted() {
        this.getReleaseFundAssetType()
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
    height: 78px;
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
