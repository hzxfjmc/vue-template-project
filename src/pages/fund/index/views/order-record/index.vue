<template lang="pug">
    .order-record-container(v-if='orderRecordList.length>0')
        .fund-introduce
            .fund-name {{`${fundIntro}-${fundType}`}}
            .fund-detail
                .fund-detail-item {{assetType}}
                .fund-detail-item {{$t('fundRiskText')}} {{fundRisk}}
        .order-record-box
            van-list.order-record-list(v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad")
                van-cell(v-for="(item,index) in orderRecordList" :key="index" class="van-cell-item" @click="toDetailHandle(item.orderNo)")
                    template(slot-scope='scope')
                        .order-item.flex
                            span(class="order-type") {{item.tradeType}}
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

export default {
    i18n: {
        zhCHS: {
            amount: '金额',
            time: '时间',
            fundRiskText: '风险等级',
            noOrder: '暂无记录'
        },
        zhCHT: {
            amount: '金额',
            time: '时间',
            fundRiskText: '风险等级',
            noOrder: '暂无记录'
        },
        en: {
            amount: '金额',
            time: '时间',
            fundRiskText: '风险等级',
            noOrder: '暂无记录'
        }
    },
    keepalive: true,
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
            pageSize: 6,
            total: 0,
            fundRiskList: [
                { type: 'A1', risk: 'R1', name: '低风险' },
                { type: 'A2', risk: 'R2', name: '中低风险' },
                { type: 'A3', risk: 'R3', name: '中风险' },
                { type: 'A4', risk: 'R4', name: '中高风险' },
                { type: 'A5', risk: 'R5', name: '高风险' }
            ]
        }
    },
    computed: {},
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
                    fundId: 18
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
                        color: _this.differColor(item.externalStatus),
                        orderNo: item.orderNo
                    })

                    this.assetType =
                        item.fundBaseInfoVO && item.fundBaseInfoVO.assetType
                    _this.fundRiskList.map(value => {
                        if (item.fundBaseInfoVO.fundRisk === value.name) {
                            _this.fundRisk = value.risk
                            _this.fundType = value.type
                        }
                    })
                    _this.fundIntro =
                        item.fundBaseInfoVO &&
                        item.fundBaseInfoVO.fondCode +
                            ' ' +
                            item.fundBaseInfoVO.fundName
                })
            } catch (e) {
                if (e.msg) {
                    this.$alert({
                        message: e.msg,
                        confirmButtonText: '我知道了'
                    })
                }
            }
        },
        onLoad() {
            setTimeout(() => {
                if (this.orderRecordList.length < this.total) {
                    this.loading = false
                    this.pageNum = this.pageNum + 1
                    this.fundOrderListFun()
                }
                this.finished = true
            }, 300)
        },
        // 设置不同的颜色
        differColor(type) {
            let color = ''
            switch (type) {
                case 1:
                    color = 'blue-style'
                    break
                case 2:
                    color = 'yellow-style'
                    break
                case 3:
                    color = 'grey-style'
                    break
                case 4:
                    color = 'green-style'
                    break
                default:
                    break
            }
            return color
        },
        toDetailHandle(orderNo) {
            console.log(orderNo, '677')
            this.$router.push({
                name: 'order-record-detail',
                query: orderNo
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
        }
        .fund-detail {
            display: flex;
            flex-direction: row;
            margin-bottom: 10px;
            .fund-detail-item {
                padding: 0 4px;
                font-size: 10px;
                color: $level-text-color;
                height: 16px;
                line-height: 14px;
                border-radius: 1px;
                opacity: 0.79;
                border: 1px solid $primary-color;
                margin-right: 10px;
            }
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
                        &.order-type {
                            font-size: 16px;
                            color: $text-color;
                        }
                        &.money-value {
                            color: $text-color;
                        }
                        // &.type-value {
                        //     color: $cell-right-color;
                        // }
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
