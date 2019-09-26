<template lang="pug">
    .order-status-about-container
        .order-status-about
                van-cell(border)
                    template(slot-scope='scope')
                        .status-title.flex
                            span {{$t('orderStatus')}}
                            span(:class="differenceColor") {{orderStatusValue}}  
                        .begin-time
                            img(src="@/assets/img/fund/clock.png")
                            span {{$t('estimate')}} 
                            span {{surePositionBeginTime}} 
                        .left-line
                        .end-time
                            i(class="dot")
                            span {{$t('estimate')}} 
                            span {{surePositionEndTime}} 
</template>

<script>
import { differColor } from '../../order-record/differColor.js'
export default {
    name: 'order-status-about',
    props: {
        orderStatus: {
            type: Number,
            default: 0
        },
        orderStatusValue: {
            type: String,
            default: ''
        },
        beginTime: {
            type: String,
            default: ''
        },
        endTime: {
            type: String,
            default: ''
        }
    },
    i18n: {
        zhCHS: {
            orderStatus: '订单状态',
            estimate: '预计',
            surePosition: '日确认份额',
            checkProfit: '日查收收益'
        },
        zhCHT: {
            orderStatus: '訂單狀態',
            estimate: '預計',
            surePosition: '日確認份額',
            checkProfit: '日查收收益'
        },
        en: {
            orderStatus: 'Order Status',
            estimate: 'Predict',
            surePosition: 'Allocate Fund Units in X Days',
            checkProfit: 'Check Earnings in X Days'
        }
    },
    data() {
        return {}
    },
    computed: {
        differenceColor() {
            return differColor(this.orderStatus)
        },
        // 确认份额日多语言
        surePositionBeginTime() {
            return {
                zhCHS: `${this.beginTime}日确认净值 `,
                zhCHT: `${this.beginTime}日確認凈值`,
                en: `${this.beginTime} CFMD NAV`
            }[this.$i18n.lang]
        },
        // 查收收益日多语言
        surePositionEndTime() {
            return {
                zhCHS: `${this.endTime}日证券到达证券账户`,
                zhCHT: `${this.endTime}日資金到達證券賬戶`,
                en: `Funds Credited to Securities Account in ${this.endTime} Days`
            }[this.$i18n.lang]
        }
    },
    created() {},
    methods: {}
}
</script>

<style lang="scss" scoped>
.order-status-about-container {
    font-family: '';
    .order-status-about {
        .status-title {
            margin-bottom: 16px;
            .status-color {
                color: $status-text-color;
            }
        }
        .begin-time {
            img {
                width: 15px;
                height: 15px;
                vertical-align: middle;
                margin-right: 6px;
            }
            span {
                color: $text-color;
                opacity: 0.5;
                line-height: 20px;
                &.time {
                    opacity: 1;
                }
            }
        }
        .left-line {
            width: 1px;
            height: 56px;
            background-color: $text-color;
            opacity: 0.19;
            margin: 2px 0 -8px 7px;
        }
        .end-time {
            @extend .begin-time;
            i.dot {
                display: inline-block;
                width: 6px;
                height: 6px;
                border-radius: 3px;
                background-color: $tip-color;
                opacity: 0.19;
                margin: 0 10px 0 4.5px;
            }
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
}
</style>
