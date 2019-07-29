<template lang="pug">
.cell-info
    .cell-box
        .cell-item.flex
            .left
              span.cell-title {{conversionForm.stockName}}
              span ({{conversionForm.stockCode|PrefixInteger}})
            .right(:class="{colorPink:isPink,colorGray:isGray,colorYellow:isYellow}") {{conversionForm.statusName}}
        .cell-item.flex
            .left 红股名称
            .right.color-gray {{conversionForm.productName}}
        .cell-item.flex
            .left 红股数量
            .right.color-yellow {{conversionForm.selectionQty}}股
        .cell-item.flex
            .left 红利金额
            .right {{conversionForm.dividendBalance |formatCurrency}}港币
        .cell-item.flex
            .left 总费用
            .right.color-gray {{conversionForm.fee|formatCurrency}}港币
        .cell-item.flex
            .left 选股时间
            .right.color-gray {{conversionForm.createTime}}
</template>

<script>
import { Popup } from 'vant'
import { applyModify } from '@/service/stock-order-server.js'
export default {
    keepalive: true,
    components: {
        [Popup.name]: Popup
    },
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
        }
    },
    data() {
        return {
            showAssetSource: true
        }
    },
    methods: {
        deleteHandler() {
            this.$confirm({
                title: '是否确认撤销御泰中彩控股的供股申请',
                confirmButtonText: '确认',
                cancelButtonText: '取消'
            })
                .then(() => {
                    this.successHander()
                })
                .catch(() => {
                    console.log(333)
                })
        },
        successHander() {
            let params = {
                action: 1,
                activityType: 0,
                applyId: 0,
                selectionQty: 1
            }
            applyModify(params)
        }
    },
    computed: {
        // 按钮是否可用
        isPink() {
            //2:待分红 1：已提交
            return this.conversionForm.status === 2 ||
                this.conversionForm.status === 1
                ? true
                : false
        },
        isGray() {
            //-1：提交失败 0：已完成
            return this.conversionForm.status === -1 ||
                this.conversionForm.status === 0
                ? true
                : false
        },
        isYellow() {
            //3：红利到账 4:红股到账
            return this.conversionForm.status === 3 ||
                this.conversionForm.status === 4
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
    .cell-item {
        padding-top: 10px;
        .left {
            color: $text-color5;
            font-size: 14px;
            span {
                font-size: 12px;
            }
            .cell-title {
                font-weight: 500;
                font-size: 16px;
                line-height: 22px;
                color: rgba(53, 53, 71, 1);
            }
        }
        .right {
            color: rgba(53, 53, 71, 1);
        }
        .colorPink {
            color: #ffba00;
        }
        .colorGray {
            color: $text-color5;
        }
        .colorYellow {
            color: #41ca1e;
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
    .operation {
        height: 40px;
        background-color: #fff;
        padding: 0 $global-padding;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .delete {
            height: 22px;
            width: 49px;
            border: 1px solid $primary-color;
            line-height: 22px;
            font-size: 13px;
            text-align: center;
        }
    }
}
</style>
