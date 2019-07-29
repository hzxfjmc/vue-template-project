<template lang="pug">
.cell-info
    .cell-box.border-bottom
        .cell-item.flex
            .left 股票名称
            .right 
                span {{conversionForm.stockName}}
                span.cell-title ({{conversionForm.stockCode|PrefixInteger}})
        .cell-item.flex
            .left 可供股数
            .right {{conversionForm.registAmount}}股
        .cell-item.flex
            .left 供股价
            .right {{conversionForm.strikePrice|formatCurrency}}港币
        .cell-item.flex
            .left 账户可取金额
            .right {{withdrawBalance|formatCurrency}}港币
        slot
    p.a-tips 
        span.iconfont.icon-warning.text-color2(:class="{ active: isActive }")
        span.text-color5(:class="{ active: isActive }") {{tipText}}
    .cell-box
        .cell-item.flex(v-if='!conversionForm.tradeFlag')
            .left 剩余供股数
            .right {{conversionForm.registAmount-selectionQty}} 股
        .cell-item.flex
            .left 手续费
            .right {{serviceCharge|formatCurrency}}港币
        .cell-item.flex
            .left 供股总费用
            .right {{fee|formatCurrency}}港币
</template>

<script>
export default {
    keepalive: true,
    props: {
        conversionForm: {
            type: Object,
            default: () => {
                return {}
            }
        },
        serviceCharge: {
            default: '0' //手续费
        },
        fee: {
            default: '0' //总费用
        },
        selectionQty: {
            default: '2222'
        },
        withdrawBalance: {
            default: '11'
        }
    },
    data() {
        return {
            banlance: '',
            tipText: '供股数不能超过可供股数，供股总费用不能超过账户可取金额'
        }
    },
    created() {},
    methods: {
        onNextStep() {}
    },
    computed: {
        isActive() {
            return this.selectionQty > this.conversionForm.registAmount
                ? true
                : false
        }
    },
    filters: {
        formatCurrency(num) {
            let strVal = String(num)
            if (strVal.indexOf('.') != -1) {
                return `${Number(
                    String(Number(strVal).toFixed(2)).split('.')[0]
                ).toLocaleString()}.${
                    String(Number(strVal).toFixed(2)).split('.')[1]
                }`
            } else {
                return `${Number(strVal).toLocaleString()}.00`
            }
        },
        PrefixInteger(num) {
            return (Array(5).join('0') + num).slice(-5)
        }
    }
}
</script>

<style lang="scss" scoped>
.cell-info {
    .cell-title {
        font-size: 12px;
        color: $text-color5;
    }
    .cell-item {
        padding-top: 10px;
        .left {
            color: $text-color5;
        }
    }
    .speci {
        padding-top: 20px;
        .left {
            font-size: 18px;
            color: rgba(53, 53, 71, 1);
        }
    }
    .right {
        span {
            vertical-align: top;
            margin-left: 10px;
        }
    }
    .van-cell {
        display: inline-block;
        padding: 0;
        font-size: 18px;
        width: 110px;
    }
    .cell-box {
        padding: $global-padding 0;
    }
    .cell-box:last-child {
        border: 0;
    }
    .van-cell:not(:last-child)::after {
        border: 0;
    }
    .a-tips {
        display: flex;
        align-items: center;
        height: 32px;
        .text-color5 {
            font-size: 12px;
            padding-left: 5px;
        }
        .active {
            color: rgba(255, 56, 84, 1);
        }
    }
}
</style>
