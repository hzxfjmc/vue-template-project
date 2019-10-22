<template lang="pug">
.income-details-content
    .list(class="border-bottom" v-for="(item,index) in list")
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
            
</template>
<script>
import { fundOrderList } from '@/service/finance-server.js'
import dayjs from 'dayjs'
export default {
    data() {
        return {
            list: [],
            pageSize: 10,
            pageNum: 1,
            currency: this.$route.query.currency
        }
    },
    methods: {
        async fundOrderList() {
            const { list } = await fundOrderList({
                pageNum: this.pageNum,
                pageSize: this.pageSize
            })
            this.list = list
            this.list.map(item => {
                item.orderAmount = item.orderTime = dayjs(
                    item.orderTime
                ).format('YYYY-MM-DD HH:mm:ss')
            })
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
    .list {
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
</style>
