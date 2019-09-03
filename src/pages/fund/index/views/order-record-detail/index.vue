<template lang="pug">
    yx-container.order-record-detail-container
        .order-record-detail(slot='main')
            .fund-introduce
                .fund-name {{fundName}}
                .fund-detail {{fundDetail}}
            order-status-about
            van-cell-group(class="order-group")
                van-cell(class="order-time" )
                    .order-item.flex(v-for="item in orderAboutList")
                        span.itemName {{item.name}}
                        span {{item.value}}
                van-cell(class="order-money-cell" )
                    .order-money.flex
                        .left-title.flex
                            span.type {{orderType}}
                            span.type-text {{$t('amount')}}
                        .right-value {{moneyNum}}
            .btn-buy-more
                van-button(type="info" round  size="large" @click="buyMoreHandle") {{$t('againBuy')}}
            van-dialog(v-model='isShowBackout' message="您是否要撤销当前订单" showConfirmButton	showCancelButton=true)
    
</template>

<script>
import orderStatusAbout from './components/order-status-about'
import { isYouxinApp } from '@/utils/html-utils.js'
import jsBridge from '@/utils/js-bridge'

export default {
    i18n: {
        zhCHS: {
            amount: '金额',
            againBuy: '再买一笔'
        },
        zhCHT: {
            amount: '金额',
            againBuy: '再买一笔'
        },
        en: {
            amount: '金额',
            againBuy: '再买一笔'
        }
    },
    components: {
        orderStatusAbout
    },
    data() {
        return {
            fundName: 'Pimco 亚洲投资级债券基金-A2',
            fundDetail: 'ISIN:IE00B0MD9M11',
            orderAboutList: [
                { name: '订单生成时间', value: '2019-07-12 15:06:44' },
                { name: '订单号', value: '01907120540425132220050' }
            ],
            orderType: '赎回',
            moneyNum: '2,000.000.00',
            detailMsg: {},
            title: '订单',
            isShowBackout: false
        }
    },
    created() {
        const _this = this
        // 设置撤销按钮
        if (isYouxinApp) {
            jsBridge.registerFn('showBackOut', function() {
                _this.showBackOutHandle()
            })
            jsBridge.callApp('command_set_titlebar_button', {
                position: 2,
                type: 'text',
                text: '撤销',
                clickCallback: 'showBackOut'
            })
        }
        // 清除撤销按钮
        const clearTitleBarBOButton = function() {
            if (isYouxinApp) {
                jsBridge.callApp('command_set_titlebar_button', {
                    type: 'hide',
                    position: 2,
                    text: '',
                    clickCallback: ''
                })
            }
        }
        console.log(clearTitleBarBOButton)
    },
    methods: {
        // 再买一笔
        buyMoreHandle() {
            this.$router.push({
                path: '/fund-subscribe',
                query: this.detailMsg
            })
        },
        // 撤销
        showBackOutHandle() {
            this.isShowBackout = true
        }
    }
}
</script>

<style lang="scss" scoped>
.order-record-detail-container {
    height: 100%;
    background-color: $background-color;
    .fund-introduce {
        background-color: $background-color;
        &::after {
            width: 100%;
            content: '';
            display: block;
            height: 10px;
            background-color: $background-bottom-color;
        }
        .fund-name {
            font-size: 16px;
            line-height: 22px;
            padding-top: 15px;
            margin-bottom: 6px;
            padding-left: 12px;
        }
        .fund-detail {
            font-size: 14px;
            color: $text-color5;
            padding: 0 0 12px 12px;
        }
    }
    .order-group {
        padding-bottom: 41px;
        .order-time {
            .itemName {
                color: $text-color5;
                margin-bottom: 10px;
            }
        }
        .order-money-cell {
            border-bottom: 1px solid rgba($color: $text-color, $alpha: 0.05);
            .order-money {
                .left-title {
                    flex-direction: column;
                    .type {
                        font-size: 16px;
                        line-height: 22px;
                    }
                    .type-text {
                        @extend .type;
                        color: $text-color5;
                    }
                }
                .right-value {
                    font-size: 24px;
                    line-height: 44px;
                }
            }
        }
    }
    .btn-buy-more {
        padding: 0 16px;
    }
}
</style>
