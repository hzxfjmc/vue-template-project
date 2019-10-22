<template lang="pug">
.income-details-content
    .list(class="border-bottom" v-for="(item,index) in list")
        .block-left 
            span.element-fund-name 基金名称
            span.element-price 金额
            span.element-time 时间
        .block-right 
            span.element-fund-name {{item.fundName}}
            span.element-price-red(v-if="item.msg == 0") +{{item.earnings}}
            span.element-price-green(v-if="item.msg == 1") {{item.earnings}}
            span.element-price(v-if="item.msg == 2") {{item.earnings}}
            span.element-time {{item.belongDate}}
    .footer-msg 无更多内容
            
</template>
<script>
import { getFundPositionEarningsListV1 } from '@/service/finance-server.js'
import { transNumToThousandMark } from '@/utils/tools.js'
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
        async getFundPositionEarningsListV1() {
            const { list } = await getFundPositionEarningsListV1({
                pageNum: this.pageNum,
                pageSize: this.pageSize,
                currency: 2
            })
            this.list = list
            this.list.map(item => {
                item.msg =
                    Number(item.earnings) > 0
                        ? 0
                        : Number(item.earnings) < 0
                        ? 1
                        : 2
                item.earnings = transNumToThousandMark(item.earnings)
                item.belongDate = dayjs(item.belongDate).format(
                    'YYYY-MM-DD HH:MM:SS'
                )
            })
        }
    },
    mounted() {
        this.getFundPositionEarningsListV1()
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
        // height: 150px;
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
            .element-price-red {
                color: #ea3d3d;
            }
            .element-price-green {
                color: #00ba60;
            }
        }
    }
}
.footer-msg {
    width: 100%;
    text-align: center;
    margin: 10px 0;
}
</style>
