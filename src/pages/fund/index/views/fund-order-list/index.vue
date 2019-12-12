<template lang="pug">
.income-details-content
    van-list.order-record-list(v-model="loading" :finished="finished" :finished-text="finishedText" @load="onLoad")
        .block-list(class="border-bottom" v-for="(item,index) in list" :key="index" @click="toDetailHandle(item)")
            .block-left 
                span.element-fund-name {{item.tradeTypeName}}
                span.element-fund-name1 {{$t('fundName')}}
                template(v-if="item.tradeType === 1")
                    span.element-price {{$t('amountMoney')}}
                template(v-else)
                    span.element-price {{$t('share')}}
                span.element-time {{$t('time')}}
            .block-right 
                span.msg(class="element-fund-name")(v-if="item.externalStatus == 1") {{item.externalName}}
                span.msg(class="element-fund-color")(v-if="item.externalStatus == 2") {{item.externalName}}
                span.msg(class="element-fund-color1")(v-if="item.externalStatus == 3") {{item.externalName}}
                span.msg(class="element-fund-color2")(v-if="item.externalStatus == 4") {{item.externalName}}
                span.msg(class="element-fund-color3")(v-if="item.externalStatus == 5") {{item.externalName}}
                span.element-time.fund-name {{item.fundBaseInfoVO.fundName}}
                template(v-if="item.tradeType === 1")
                    span.element-price {{currency == 2 ?'HKD':'USD'}} {{item.orderAmount}}
                template(v-else)
                    span.element-price {{item.orderShare |sliceFixedTwo(4)}}
                span.element-time {{item.orderTime}}
    
    .block-element-nomore(v-if="noMoreShow")
        img.img(src="@/assets/img/fund/icon-norecord.png") 
        .no-record-box {{$t('nomore')}}
            
</template>
<script>
import { fundOrderList } from '@/service/finance-server.js'
import dayjs from 'dayjs'
import { transNumToThousandMark } from '@/utils/tools.js'
import { List } from 'vant'
export default {
    components: {
        [List.name]: List
    },
    i18n: {
        zhCHS: {
            fundName: '基金名称',
            amountMoney: '金额',
            share: '份额',
            time: '时间',
            nomore: '暂无订单记录',
            nomore1: '无更多内容'
        },
        zhCHT: {
            fundName: '基金名稱',
            amountMoney: '金額',
            share: '份額',
            time: '時間',
            nomore: '暫無訂單記錄',
            nomore1: '無更多內容'
        },
        en: {
            fundName: 'Fund Name',
            amountMoney: 'Amount',
            share: 'Unit',
            time: 'Time',
            nomore: 'No Order Record',
            nomore1: 'No More Content'
        }
    },
    data() {
        return {
            list: [],
            noMoreShow: false,
            pageSize: 20,
            pageNum: 1,
            total: 0,
            loading: false,
            finished: false,
            finishedText: '无更多内容',
            currency: this.$route.query.currency
        }
    },
    methods: {
        // 跳转到详情
        toDetailHandle(item) {
            this.$router.push({
                name: 'order-record-detail',
                query: {
                    orderNo: item.orderNo,
                    orderStatus: item.externalStatus,
                    currencyType: this.$route.query.currency
                }
            })
        },
        //上拉加载更多
        onLoad() {
            if (this.list.length < this.total) {
                this.pageNum = this.pageNum + 1
                this.fundOrderList()
            }
        },
        async fundOrderList() {
            try {
                const { list, pageSize, pageNum, total } = await fundOrderList({
                    pageNum: this.pageNum,
                    pageSize: this.pageSize
                })
                this.pageNum = pageNum
                this.total = total
                this.pageSize = pageSize
                list.map(item => {
                    item.orderAmount = transNumToThousandMark(item.orderAmount)
                    item.orderTime = dayjs(item.orderTime).format(
                        'YYYY-MM-DD HH:mm:ss'
                    )
                })
                this.list = this.list.concat(list)
                this.noMoreShow = this.total == 0
                this.loading = false
                if (this.list.length >= this.total) {
                    this.finished = true
                }
                this.finishedText = this.$t('nomore1')
                this.finishedText = this.total == 0 ? '' : this.finishedText
            } catch (e) {
                this.$toast(e.msg)
            }
        }
    },
    mounted() {
        this.fundOrderList()
    }
}
</script>
<style lang="scss" scoped>
.income-details-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    -webkit-overflow-scrolling: touch;
    background: #fff;
    overflow: hidden;
    overflow-y: auto;
    .block-list {
        width: 100%;
        padding: 10px 2%;
        display: flex;
        align-items: center;
        .block-left {
            display: flex;
            width: 30%;
            flex-direction: column;
            span {
                display: inline-block;
                line-height: 25px;
                color: $text-color5;
            }
            .element-fund-name {
                font-size: 16px;
                font-weight: 400;
                line-height: 30px;
                color: $text-color;
            }
        }
        .block-right {
            display: flex;
            width: 70%;
            justify-content: flex-end;
            flex-direction: column;
            align-items: flex-end;
            span {
                display: inline-block;
                line-height: 25px;
            }
            .element-fund-name {
                line-height: 30px;
                color: #2177ff;
            }
            .element-fund-color {
                color: #ffba00;
            }
            .element-fund-color1 {
                color: #191919;
            }
            .element-fund-color2 {
                color: #ff7127;
            }
            .element-fund-color3 {
                color: #41ca1e;
            }
            .element-time {
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;
                overflow: hidden;
            }
            .fund-name {
                width: 100%;
                text-align: right;
                text-overflow: ellipsis;
                overflow: hidden;
                display: block;
                white-space: nowrap;
                line-height: 25px;
            }
        }
    }
}
.block-element-nomore {
    width: 100%;
    text-align: center;
    margin: 150px 0 0 0;
    img {
        width: 130px;
    }
    .no-record-box {
        color: rgba(25, 25, 25, 0.5);
        margin: 10px 0 0 0;
    }
}
</style>
