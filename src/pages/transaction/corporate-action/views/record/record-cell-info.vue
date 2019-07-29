<template lang="pug">
.cell-info
    .cell-box
        .cell-item.flex
            .left 
              span.cell-title {{conversionForm.stockName}}
              span ({{conversionForm.stockCode|PrefixInteger}})
            .right(:class="{colorPink:isPink,colorGray:isGray,colorYellow:isYellow}") {{conversionForm.statusName}}
        .cell-item.flex
            .left 供股股数/ (可供股数)
            .right.color-pink {{conversionForm.selectionQty}}/{{conversionForm.registAmount}}股
        .cell-item.flex
            .left 供股价
            .right.color-gray {{conversionForm.reinvestmentPrice|formatCurrency}}港币
        .cell-item.flex
            .left 手续费
            .right.color-yellow {{conversionForm.fee|formatCurrency}}港币
        .cell-item.flex
            .left 供股总费用
            .right {{(conversionForm.selectionQty * conversionForm.reinvestmentPrice+conversionForm.fee) |formatCurrency}}港币
        .cell-item.flex
            .left 供股时间
            .right.color-gray {{conversionForm.createTime}}
    slot
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
        }
    },
    data() {
        return {
            showAssetSource: true
        }
    },
    methods: {},
    computed: {
        // 按钮是否可用
        isPink() {
            //3:待审核 1：修改已提交 2：撤销已提交 0：已提交
            return this.conversionForm.status === 3 ||
                this.conversionForm.status === 1 ||
                this.conversionForm.status === 2 ||
                this.conversionForm.status === 0
                ? true
                : false
        },
        isGray() {
            //-1：提交失败4：已撤回 6：已驳回
            return this.conversionForm.status === -1 ||
                this.conversionForm.status === 4 ||
                this.conversionForm.status === 6
                ? true
                : false
        },
        isYellow() {
            //5:成功 7：供股到账
            return this.conversionForm.status === 5 ||
                this.conversionForm.status === 7
                ? true
                : false
        }
    }
}
</script>

<style lang="scss" scoped>
.cell-info {
    margin-bottom: 10px;
    background: $background-color;
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
        .right {
            color: rgba(53, 53, 71, 1);
        }
        .colorPink {
            color: rgba(122, 89, 202, 1);
        }
        .colorGray {
            color: $text-color5;
        }
        .colorYellow {
            color: $warn-color;
        }
    }
    .speci {
        font-size: 18px;
    }
    .cell-box {
        margin: 0 10px;
        padding: $global-padding;
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
