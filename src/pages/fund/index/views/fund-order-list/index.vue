<template lang="pug">
.income-details-content
    van-list.order-record-list(v-model="loading" :finished="finished" finished-text="无更多内容" @load="onLoad")
        .block-list(class="border-bottom" v-for="(item,index) in list")
            .block-left 
                span.element-fund-name {{item.tradeTypeName}}
                span.element-price 金额
                span.element-time 时间
            .block-right 
                span.msg(class="element-fund-name")(v-if="item.externalStatus == 1") {{item.tradeTypeName}}
                span.msg(class="element-fund-color")(v-if="item.externalStatus == 2") {{item.tradeTypeName}}
                span.msg(class="element-fund-color1")(v-if="item.externalStatus == 3") {{item.tradeTypeName}}
                span.msg(class="element-fund-color2")(v-if="item.externalStatus == 4") {{item.tradeTypeName}}
                span.msg(class="element-fund-color3")(v-if="item.externalStatus == 5") {{item.tradeTypeName}}
                span.element-price {{currency == 2 ?'HKD':'USD'}} {{item.orderAmount}}
                span.element-time {{item.orderTime}}
    
    .block-element-nomore(v-if="noMoreShow")
        img.img(src="@/assets/img/fund/icon-norecord.png") 
        .no-record-box 暂无订单记录
            
</template>
<script>
import { fundOrderList } from '@/service/finance-server.js'
import dayjs from 'dayjs'
import { List } from 'vant'
export default {
    components: {
        [List.name]: List
    },
    data() {
        return {
            list: [],
            noMoreShow: false,
            pageSize: 10,
            pageNum: 1,
            total: 0,
            loading: false,
            finished: false,
            currency: this.$route.query.currency
        }
    },
    methods: {
        //上拉加载更多
        onLoad() {
            // 异步更新数据
            setTimeout(() => {
                if (this.list.length < this.total) {
                    this.pageNum = this.pageNum + 1
                    this.fundOrderList()
                }
                // 加载状态结束
                this.loading = false

                // 数据全部加载完成
                if (this.list.length >= this.total) {
                    this.finished = true
                }
            }, 500)
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
                    item.orderAmount = item.orderTime = dayjs(
                        item.orderTime
                    ).format('YYYY-MM-DD HH:mm:ss')
                })
                this.list = this.list.concat(list)
                this.noMoreShow = this.total == 0
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
