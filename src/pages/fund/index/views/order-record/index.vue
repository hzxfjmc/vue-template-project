<template lang="pug">
    .order-record-container(v-if='orderRecordList.length>0')
        .fund-introduce
            .fund-name {{fundIntro}}
            .fund-detail
                fund-tag(:title="assetType")
                fund-tag(:title="fundRisk")
        .order-record-box
            van-list.order-record-list(v-model="loading" :finished="finished" :finished-text="$t('noMore')" @load="onLoad")
                van-cell(v-for="(item,index) in orderRecordList" :key="index" class="van-cell-item" @click="toDetailHandle(item.orderNo,item.orderStatus)")
                    template(slot-scope='scope')
                        .order-item.flex
                            span(class="order-type") {{item.tradeTypeName}}
                            span(class="type-value" :class='item.color') {{item.typeValue}}
                        .order-item.flex
                            span(class="left-title") {{item.tradeType===1? $t('amount'):$t('share')}}
                            span(class="money-value" ) {{item.tradeType===1? item.moneyValue : item.orderShare}}
                        .order-item.flex
                            span(class="left-title") {{$t('time')}}
                            span(class="right-title" ) {{item.timeValue}}
    .order-record-container-else(v-else style="text-align:center") 
        img.img(src="~@/assets/img/fund/icon-norecord.png") 
        .no-record-box {{$t('noOrder')}}
</template>

<script>
import dayjs from 'dayjs'
import { transNumToThousandMark, sliceDecimal } from '@/utils/tools.js'
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
            amount: '订单金额',
            share: '份额',
            time: '时间',
            noOrder: '暂无记录',
            noMore: '没有更多了'
        },
        zhCHT: {
            amount: '訂單金額',
            share: '份額',
            time: '時間',
            noOrder: '暫無記錄',
            noMore: '沒有更多了'
        },
        en: {
            amount: 'Order Amount',
            share: 'Unit',
            time: 'Time',
            noOrder: 'Not Records',
            noMore: 'No More'
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
                from.path === '/order-record-detail' &&
                this.$route.query.isRefresh
            ) {
                this.fundOrderListFun()
            }
        }
    },
    beforeRouteEnter: (to, from, next) => {
        next(async vm => {
            if (from.path === '/fund-details') {
                vm.fundOrderListFun()
            }
        })
    },
    created() {
        if (this.$route.query.id) {
            this.fundOrderListFun()
        }
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
                this.orderRecordList = []
                res.list.map(item => {
                    this.orderRecordList.push({
                        tradeType: item.tradeType,
                        typeValue: item.externalName,
                        moneyValue:
                            item.currency.name +
                            ' ' +
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
                        orderShare: transNumToThousandMark(
                            sliceDecimal(item.orderShare, 4)
                        ),
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
        padding: 15px 12px;
        background-color: $background-color;
        margin-bottom: 10px;
        .fund-name {
            font-size: 16px;
            line-height: 22px;
            margin-bottom: 6px;
            font-family: '';
        }
        .fund-detail {
            display: flex;
            justify-content: flex-start;
        }
    }
    .order-record-box {
        flex: 1;
        .order-record-list {
            // border-bottom: 1px solid rgba($color: $tip-color, $alpha: 0.05);
            .van-cell-item {
                font-family: PingFangSC;
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
    background: #fff;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .img {
        width: 110px;
        height: 88px;
        margin-bottom: 10px;
        transform: translateY(-65px);
    }
    .no-record-box {
        color: rgba(25, 25, 25, 0.3);
        transform: translateY(-65px);
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
