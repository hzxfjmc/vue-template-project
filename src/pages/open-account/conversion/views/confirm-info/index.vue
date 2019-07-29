<template lang="pug">
.confirm-info.flex-fixed.full-height
    .confirm-info-container.scroll-able.flex-fixed-container
        .margin-bar
        CellInfo(:conversionForm="conversionForm" :curName="curName")
        .margin-bar
        .shares-info
            .title 股票信息
            .si-title.border-bottom
                van-row(justify="end" type="flex")
                    van-col(span="10") 股票名称
                    van-col(span="6" style="text-align: right;") 股票数量
                    van-col(span="8" style="text-align: right;") 成本价
            .si-cell(v-for="item in conversionForm.stockInfo")
                van-row(type="flex" align="center")
                    van-col(span="8") 
                        .flex
                            .stock-name.ellipse {{item.stockName}}
                            .stock-code {{item.stockCode}}
                    van-col(span="8" row="2" style="text-align: right;") 
                        span {{parseInt(item.stockAmount)}}
                        | 股
                    van-col(span="8" style="text-align: right;") {{parseFloat(item.costPrice)}}{{exchangeTypeUnit}}/股
    van-button(
        size="large" 
        type="primary" 
        @click="submitHandler"
        class="bottom-button" ) 确认提交
</template>

<script>
import CellInfo from './cell-info.vue'
import { getLotteryStatus } from '@/service/customer-relationship-server.js'
export default {
    mixins: [require('../../mixins/common-mx.js').default],
    components: {
        CellInfo
    },
    computed: {
        exchangeTypeUnit() {
            return this.conversionForm.exchangeType === 0 ? '港币' : '美元'
        }
    },
    data() {
        return {
            showRecharge: false
        }
    },
    async created() {
        //判断是否转仓或者交易
        try {
            let res = await getLotteryStatus()
            if (res.recharge || res.transfer) {
                this.showRecharge = false
            } else {
                this.showRecharge = true
            }
        } catch (error) {
            this.showRecharge = false
        }
    },
    methods: {
        async submitHandler() {
            try {
                this.$loading()
                let stockInfo = this.conversionForm.stockInfo.map(item => {
                    item.costPrice = parseFloat(item.costPrice)
                    item.price = parseInt(item.price)
                    item.stockAmount = parseInt(item.stockAmount)
                    return item
                })
                let conversionForm = { ...this.conversionForm }
                conversionForm.stockInfo = JSON.stringify(stockInfo)
                conversionForm.requestId = this.$guid()
                let {
                    email,
                    sendBroker
                } = await this.$stockTransferService.addStockTransfer(
                    conversionForm
                )
                this.updateForm({ stockInfo: [] })
                this.$router.push({
                    name: 'complete',
                    query: {
                        email,
                        sendBroker,
                        showRecharge: this.showRecharge
                    }
                })
                this.$close()
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        async getLotteryStatus() {
            let res = await getLotteryStatus()
            return res.recharge || res.transfer
        }
    }
}
</script>

<style lang="scss" scoped>
.confirm-info {
    .text-right {
        text-align: right;
    }
    .margin-bar {
        height: 8px;
        width: 100%;
        background-color: $background-bottom-color;
    }
    .shares-info {
        padding: $global-padding;
        .title {
            font-size: 16px;
            font-weight: 500;
            padding-bottom: 14px;
        }
        .si-title {
            color: $text-color5;
            padding-bottom: 5px;
        }
        .si-cell {
            height: 52px;
            display: flex;
            align-items: center;
            width: 100%;
            font-size: 0.32rem;
            .van-row {
                width: 100%;
                .flex {
                    flex-direction: column;
                    .stock-code {
                        font-size: 12px;
                        color: $text-color5;
                    }
                }
            }
        }
    }
}
</style>
