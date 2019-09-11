<template lang="pug">
    .order-status-about-container
        .order-status-about
                van-cell(border)
                    template(slot-scope='scope')
                        .status-title.flex
                            span {{$t('orderStatus')}}
                            span(class="status-color") {{statusValue}}  
                        .begin-time
                            img(src="@/assets/img/fund/clock.png")
                            span {{$t('estimate')}}
                            span(class='time') {{beginTime}} 
                            span {{$t('surePosition')}}
                        .left-line
                        .end-time
                            i(class="dot")
                            span {{$t('estimate')}} 
                            span(class='time') {{endTime}} 
                            span {{$t('checkProfit')}} 
</template>

<script>
import { fundOrderDetail } from '@/service/finance-server.js'
import dayjs from 'dayjs'

export default {
    name: 'order-status-about',
    props: {
        orderNo: {
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
            orderStatus: '订单状态',
            estimate: '预计',
            surePosition: '日确认份额',
            checkProfit: '日查收收益'
        },
        en: {
            orderStatus: '订单状态',
            estimate: '预计',
            surePosition: '日确认份额',
            checkProfit: '日查收收益'
        }
    },
    data() {
        return {
            statusValue: '',
            beginTime: '07.01日',
            endTime: '07.19日'
        }
    },
    created() {
        console.log(this.orderNo)
        this.fundOrderDetailFun()
    },
    methods: {
        async fundOrderDetailFun() {
            let params = {
                orderNo: this.orderNo
            }
            let res = await fundOrderDetail(params)
            this.statusValue = res.externalName
            this.beginTime = dayjs(res.confirmDate).format('MM.DD')
            this.endTime = dayjs(res.deliveryDate).format('MM.DD')
        }
    }
}
</script>

<style lang="scss" scoped>
.order-status-about-container {
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
            margin: 2px 0 -8px 8px;
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
                margin: 0 10px 0 6px;
            }
        }
    }
}
</style>
