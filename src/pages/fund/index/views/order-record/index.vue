<template lang="pug">
    .order-record-container(v-if='orderRecordList.length>0')
        .fund-introduce
            .fund-name {{fundIntro}}
            .fund-detail
                fund-tag(:title="assetType")
                fund-tag(:title="fundRisk")
        .order-record-box
            van-list.order-record-list(v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad")
                van-cell(v-for="(item,index) in orderRecordList" :key="index" class="van-cell-item" @click="toDetailHandle(item.orderNo,item.orderStatus)")
                    template(slot-scope='scope')
                        .order-item.flex
                            span(class="order-type") {{item.tradeTypeName}}
                            span(class="type-value" :class='item.color') {{item.typeValue}}
                        .order-item.flex
                            span(class="left-title") {{$t('amount')}}
                            span(class="money-value" ) {{item.moneyValue}}
                        .order-item.flex
                            span(class="left-title") {{$t('time')}}
                            span(class="right-title" ) {{item.timeValue}}
    .order-record-container-else(v-else style="text-align:center") {{$t('noOrder')}}
</template>

<script>
import dayjs from 'dayjs'
import { transNumToThousandMark } from '@/utils/tools.js'
import Vue from 'vue'
import { List } from 'vant'
Vue.use(List)
import { fundOrderList } from '@/service/finance-server.js'
import { setTimeout } from 'timers'
import { differColor } from './differColor.js'
import fundTag from '@/biz-components/fund-tag/index.vue'

export default {
    i18n: {
        zhCHS: {
            amount: '金额',
            time: '时间',
            noOrder: '暂无记录'
        },
        zhCHT: {
            amount: '金额',
            time: '时间',
            noOrder: '暂无记录'
        },
        en: {
            amount: '金额',
            time: '时间',
            noOrder: '暂无记录'
        }
    },
    keepalive: true,
    components: {
        'fund-tag': fundTag
    },
    data() {
        return {
            loading: false,
            finished: false,
            orderRecordList: [],
            assetType: '',
            fundRisk: '',
            fundType: '',
            fundIntro: '',
            pageNum: 1,
            pageSize: 20,
            total: 0
        }
    },
    computed: {},
    watch: {
        $route(to, from) {
            if (
                from.path === '/order-record-detai' &&
                this.$route.query.isRefresh
            ) {
                this.fundOrderListFun()
            }
        }
    },
    created() {
        this.fundOrderListFun()
    },
    methods: {
        // 查询列表
        async fundOrderListFun() {
            try {
                let params = {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    fundId: this.$route.query.id
                }
                let res = await fundOrderList(params)
                const _this = this
                this.total = res.total
                res.list.map(item => {
                    this.orderRecordList.push({
                        tradeType: item.tradeType.name,
                        typeValue: item.externalName,
                        moneyValue:
                            item.currency.name +
                            transNumToThousandMark(
                                (item.orderAmount * 1).toFixed(2)
                            ),
                        timeValue:
                            (item.orderTime &&
                                dayjs(item.orderTime).format(
                                    'YYYY-MM-DD HH:mm:ss'
                                )) ||
                            '--',
                        color: differColor(item.externalStatus),
                        orderNo: item.orderNo,
                        orderStatus: item.externalStatus,
                        tradeTypeName: item.tradeTypeName
                    })

                    this.assetType =
                        item.fundBaseInfoVO && item.fundBaseInfoVO.assetType
                    this.fundRisk = item.fundBaseInfoVO.fundRisk
                    _this.fundIntro = item.fundBaseInfoVO.fundName
                })
            } catch (e) {
                if (e.msg) {
                    this.$alert(e.msg)
                }
            }
        },
        onLoad() {
            setTimeout(() => {
                if (this.orderRecordList.length < this.total) {
                    this.pageNum++
                    this.fundOrderListFun()
                }
                this.loading = false
                if (this.orderRecordList.length >= this.total) {
                    this.finished = true
                }
            }, 300)
        },
        // 跳转到详情
        toDetailHandle(orderNo, orderStatus) {
            this.$router.push({
                name: 'order-record-detail',
                query: {
                    orderNo: orderNo,
                    orderStatus: orderStatus,
                    currencyType: this.$route.query.currencyType
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.order-record-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    .fund-introduce {
        padding: 0 12px;
        height: 72px;
        background-color: $background-color;
        margin-bottom: 10px;
        .fund-name {
            font-size: 16px;
            line-height: 22px;
            padding-top: 15px;
            margin-bottom: 6px;
            font-family: '';
        }
        .fund-detail {
            display: flex;
            justify-content: flex-start;
            margin-bottom: 10px;
        }
    }
    .order-record-box {
        flex: 1;
        .order-record-list {
            border-bottom: 1px solid rgba($color: $tip-color, $alpha: 0.05);
            .van-cell-item {
                .order-item {
                    span {
                        margin-bottom: 10px;
                        font-size: 14px;
                        color: rgba($color: $text-color, $alpha: 0.5);
                        font-family: '';
                        &.order-type {
                            font-size: 16px;
                            color: $text-color;
                        }
                        &.money-value {
                            color: $text-color;
                        }
                    }
                }
            }
        }
    }
}
.order-record-container-else {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
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
