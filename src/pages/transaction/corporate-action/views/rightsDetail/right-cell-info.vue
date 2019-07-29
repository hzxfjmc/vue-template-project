<template lang="pug">
.cell-info
    .cell-box
        .cell-item.flex
            .left
                span.cell-title {{conversionForm.stockName}}
            .right {{conversionForm.statusName}}
        .cell-item.flex
            .left 可供股数
            .right {{conversionForm.registAmount}}股
        .cell-item.flex
            .left 供股价
            .right {{conversionForm.reinvestmentPrice|formatCurrency}}港币
        .cell-item.flex
            .left 账户可取金额
            .right {{withdrawBalance|formatCurrency}}港币
        .cell-item.flex
            .left 选择供股数
            .right {{conversionForm.selectionQty}}股
        .cell-item.flex
            .left 手续费
            .right {{conversionForm.fee|formatCurrency}}港币
        .cell-item.flex
            .left 供股总费用
            .right {{(conversionForm.selectionQty * conversionForm.reinvestmentPrice + conversionForm.fee)|formatCurrency}}港币
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
        curName: {
            type: String,
            default: ''
        },
        withdrawBalance: {
            type: String,
            default: ''
        }
    }
}
</script>

<style lang="scss" scoped>
.cell-info {
    .cell-title {
        font-weight: 500;
        font-size: 16px;
        line-height: 22px;
        color: rgba(53, 53, 71, 1);
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

    .van-cell {
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
    .a-tips {
        display: flex;
        align-items: center;
        padding-left: 5px;
        height: 32px;
        .text-color5 {
            font-size: 12px;
            padding-left: 5px;
        }
    }
}
</style>
