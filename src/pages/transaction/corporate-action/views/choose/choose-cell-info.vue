<template lang="pug">
.cell-info
    .cell-box
        .cell-item.flex
            .left 股票名称
            .right 
               span {{conversionForm.productName}}
               span.cell-title ({{conversionForm.productCode|PrefixInteger}})
        .cell-item.flex
            .left 事项说明
            .right.max-width {{conversionForm.introduce}}
        .cell-item.flex
            .left 权益金额
            .right {{conversionForm.singleBalance|thounds}}港币
        .cell-item.flex
            .left 红股名称
            .right 
              span {{conversionForm.stockName}}
              span.cell-title ({{conversionForm.stockCode|PrefixInteger}})
        .cell-item.flex
            .left 选股价
            .right {{conversionForm.defaultReinvestmentPrice|thounds}}港币
        .cell-item.flex
            .left 默认选项
            .right {{conversionForm.activityTypeName}}
        .cell-item.flex
            .left 零股零息
            .right {{conversionForm.payChangeName}} 
        slot
    .cell-box
        .cell-item.flex
            .left 手续费
            .right {{serviceCharge|thounds}}港币
        .cell-item.flex
            .left 公司行动费
            .right {{companyActionFee|thounds}}港币
        .cell-item.flex
            .left 扣除总费用
            .right {{fee|thounds}}港币
    p.a-tips 
        span.iconfont.icon-warning.text-color2
        span.text-color5 权益金额为本次可供分配的红股红利总金额
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
            default: ''
        },
        companyActionFee: {
            default: ''
        },
        fee: {
            default: ''
        }
    },
    data() {
        return {
            selectionQty: '',
            dividendBalance: ''
        }
    },
    computed: {
        // 按钮是否可用
        textShow() {
            return this.selectionQty ? true : ''
        },
        MoneyShow() {
            return this.dividendBalance ? true : ''
        }
    },
    filters: {
        thounds(num) {
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
        .color-gray {
            color: $text-color5;
            font-size: 12px;
        }
        .color-blue {
            color: rgba(40, 90, 200, 1);
            margin-left: 10px;
        }
    }
    .speci {
        padding-top: 20px;
        padding-bottom: 10px;
        .left {
            font-size: 18px;
            color: rgba(53, 53, 71, 1);
        }
    }
    .van-cell {
        display: inline-block;
        padding: 0;
        font-size: 18px;
        width: 130px;
    }
    .right {
        span {
            margin-left: 10px;
        }
        .unit {
            vertical-align: top;
        }
    }
    .max-width {
        max-width: 110px;
        text-align: right;
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
        padding-left: 5px;
        height: 32px;
        .text-color5 {
            font-size: 12px;
            padding-left: 5px;
        }
    }
}
</style>
