<template lang="pug">
    yx-container.order-record-detail-container
        .order-record-detail(slot='main')
            .fund-introduce
                .fund-name {{`${fundIntro}-${fundType}`}}
                .fund-detail ISIN: {{fundDetail}}
            order-status-about(:orderNo='orderNo' v-if="orderStatus===1")
            van-cell-group(class="order-group")
                van-cell(class="order-time" )
                    .order-item.flex(v-if="orderStatus!==1")
                        span.itemName {{$t('orderStatus')}}
                        span(:class='differenceColor') {{orderStatusValue}}
                    .order-item.flex
                        span.itemName {{$t('orderTime')}}
                        span {{orderTimeValue}}
                    .order-item.flex(v-if="orderStatus!==1")
                        span.itemName {{$t('orderFinish')}}
                        span {{orderFinishValue}}
                    .order-item.flex
                        span.itemName {{$t('orderNum')}}
                        span {{orderNumValue}}
                van-cell(class="order-time" v-if="orderStatus!==1")
                    .order-item.flex
                        span.itemName {{$t('orderNetWorth')}}
                        span {{netPrice}}
                    .order-item.flex
                        span.itemName {{$t('orderShares')}}
                        span {{orderShare}}
                van-cell(class="order-money-cell" )
                    .order-money.flex
                        .left-title.flex
                            span.type {{$t('orderName')}}
                            span.type-text {{$t('amount')}}
                        .right-value.flex 
                            span.type {{orderType}}
                            span.type-text {{moneyNum}}
            .btn-buy-more
                van-button(type="info" round  size="large" @click="buyMoreHandle") {{$t('againBuy')}}
            van-dialog(v-model='isShowBackout' :message="$t('dialogMsg')" 	showCancelButton=true)
    
</template>

<script>
import { fundOrderDetail } from '@/service/finance-server.js'
import orderStatusAbout from './components/order-status-about'
import { transNumToThousandMark } from '@/utils/tools.js'
import { isYouxinApp } from '@/utils/html-utils.js'
import jsBridge from '@/utils/js-bridge'
import dayjs from 'dayjs'
import { i18nOrderStatusData } from './order-status-detail-i18n'
import { differColor } from '../order-record/differColor.js'

export default {
    i18n: i18nOrderStatusData,
    keepalive: true,
    components: {
        orderStatusAbout
    },
    watch: {
        $route(to, from) {
            if (from.path == '/order-record') {
                this.fundOrderDetailFun()
            }
        }
    },
    data() {
        return {
            fundType: '',
            fundIntro: '',
            fundName: '',
            fondId: '',
            fundDetail: '',
            orderAboutList: [
                { name: '订单生成时间', value: '2019-07-12 15:06:44' },
                { name: '订单号', value: '01907120540425132220050' }
            ],
            orderTimeValue: '',
            orderNumValue: '',
            orderType: '',
            orderNo: this.$route.query,
            orderStatus: 1,
            orderStatusValue: '',
            orderFinishValue: '',
            netPrice: '',
            orderShare: '',
            moneyNum: '2,000.000.00',
            differenceColor: '',
            detailMsg: {},
            title: '订单',
            isShowBackout: false,
            fundRiskList: [
                { type: 'A1', risk: 'R1', name: '低风险' },
                { type: 'A2', risk: 'R2', name: '中低风险' },
                { type: 'A3', risk: 'R3', name: '中风险' },
                { type: 'A4', risk: 'R4', name: '中高风险' },
                { type: 'A5', risk: 'R5', name: '高风险' }
            ]
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
        this.fundOrderDetailFun()
    },
    methods: {
        // 获取详情
        async fundOrderDetailFun() {
            let params = {
                orderNo: this.$route.query.orderNo
            }
            let res = await fundOrderDetail(params)
            this.fondId = res.fundBaseInfoVO.fondId
            this.orderResult = res
            this.differenceColor = differColor(res.externalStatus)
            this.orderStatusValue = res.externalName
            this.orderStatus = res.externalStatus
            this.orderShare = transNumToThousandMark(
                (res.orderShare * 1).toFixed(3)
            )
            this.netPrice = transNumToThousandMark(
                (res.netPrice * 1).toFixed(2)
            )
            this.orderFinishValue =
                (res.finishTime &&
                    dayjs(res.finishTime).format('YYYY-MM-DD HH:mm:ss')) ||
                '--'
            this.fundIntro = `${res.fundBaseInfoVO.fondCode} ${res.fundBaseInfoVO.fundName}`
            this.fundRiskList.map(item => {
                if (res.fundBaseInfoVO.fundRisk === item.name) {
                    this.fundType = item.type
                }
            })
            this.fundDetail = res.fundBaseInfoVO.isin
            this.orderTimeValue =
                (res.orderTime &&
                    dayjs(res.orderTime).format('YYYY-MM-DD HH:mm:ss')) ||
                '--'
            this.orderNumValue = res.orderNo
            this.orderType = res.tradeType.name
            this.moneyNum = transNumToThousandMark(
                (res.orderAmount * 1).toFixed(2)
            )
        },
        // 再买一笔
        buyMoreHandle() {
            this.$router.push({
                path: '/fund-subscribe',
                query: this.fondId
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
                        color: $text-color5;
                        font-size: 16px;
                        line-height: 22px;
                    }
                    .type-text {
                        @extend .type;
                        color: $text-color5;
                    }
                }
                .right-value {
                    // @extend .left-title;
                    flex-direction: column;
                    align-items: flex-end;
                    .type {
                        font-size: 16px;
                        line-height: 22px;
                    }
                    .type-text {
                        font-size: 24px;
                        line-height: 34px;
                    }
                }
            }
        }
    }
    .btn-buy-more {
        padding: 0 16px;
    }
}
.yellow-style {
    color: $cell-right-color !important;
}
.blue-style {
    color: $hk-text-line-color !important;
}
.grey-style {
    color: $text-color3 !important;
}
.green-style {
    color: $green-text-color !important;
}
</style>
