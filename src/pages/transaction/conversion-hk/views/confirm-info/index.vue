<template lang="pug">
.confirm-info.flex-fixed.full-height
    .confirm-info-container.scroll-able.flex-fixed-container
        .margin-bar
        CellInfo(:conversionForm="conversionForm" :curName="curName")
        .margin-bar
        .shares-info
            .title {{$t('stockMessage')}}
            .si-title.border-bottom
                van-row(justify="end" type="flex")
                    van-col(span="10") {{$t('stockNameInfo')}}
                    van-col(span="6" style="text-align: right;") {{$t('stockNumber')}}
                    van-col(span="8" style="text-align: right;") {{$t('costCurrent')}}
            .si-cell(v-for="item in conversionForm.stockInfo")
                van-row(type="flex" align="center")
                    van-col(span="8") 
                        .flex
                            .stock-name.ellipse {{item.stockName}}
                            .stock-code {{item.stockCode}}
                    van-col(span="8" row="2" style="text-align: right;") 
                        span {{parseInt(item.stockAmount)}}
                        | {{$t('stockMsg')}}
                    van-col(span="8" style="text-align: right;") {{parseFloat(item.costPrice)}}{{exchangeTypeUnit}}/{{$t('stockMsg')}}
    van-button(
        size="large" 
        type="primary" 
        @click="submitHandler"
        class="bottom-button" ) {{$t('sureSubmit')}}
</template>

<script>
import CellInfo from './cell-info.vue'
import { getLotteryStatus } from '@/service/customer-relationship-server.js'
export default {
    i18n: {
        zhCHT: {
            stockMessage: '股票信息',
            stockNameInfo: '股票名稱',
            stockNumber: '股票數量',
            costCurrent: '成本價',
            sureSubmit: '確認提交',
            hkd: '港幣',
            usd: '美元',
            stockMsg: '股'
        },
        zhCHS: {
            stockMessage: '股票信息',
            stockNameInfo: '股票名称',
            stockNumber: '股票数量',
            costCurrent: '成本价',
            sureSubmit: '确认提交',
            hkd: '港币',
            usd: '美元',
            stockMsg: '股'
        },
        en: {
            stockMessage: 'Stock Message',
            stockNameInfo: 'Stock',
            stockNumber: 'Quantity',
            costCurrent: 'Cost',
            sureSubmit: 'Submit',
            hkd: 'HKD',
            usd: 'USD',
            stockMsg: 'Stock'
        }
    },
    mixins: [require('../../mixins/common-mx.js').default],
    components: {
        CellInfo
    },
    computed: {
        exchangeTypeUnit() {
            return this.conversionForm.exchangeType === 0
                ? this.$t('hkd')
                : this.$t('usd')
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
        }
    }
}
</script>

<style lang="scss">
.confirm-info {
    .van-field {
        line-height: 64px;
    }
}
</style>

<style lang="scss" scoped>
.confirm-info {
    .text-right {
        text-align: right;
    }
    .margin-bar {
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
