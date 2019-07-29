<template lang="pug">
.cell-info
    .cell-box
        .cell-item.flex
            .left  {{$t('股票名稱')}}
            .right 
               span {{conversionForm.productName}}
               span.cell-title ({{conversionForm.productCode|PrefixInteger}})
        .cell-item.flex
            .left  {{$t('事項說明')}}
            .right.max-width {{conversionForm.introduce}}
        .cell-item.flex
            .left {{$t('權益金额')}}
            .right {{conversionForm.singleBalance|thounds}}{{$t('港幣')}}
        .cell-item.flex
            .left {{$t('紅股名稱')}}
            .right 
              span {{conversionForm.stockName}}
              span.cell-title ({{conversionForm.stockCode|PrefixInteger}})
        .cell-item.flex
            .left {{$t('选股價')}} 
            .right {{conversionForm.defaultReinvestmentPrice|thounds}}{{$t('港幣')}}
        .cell-item.flex
            .left {{$t('默认選项')}}
            .right {{conversionForm.activityTypeName}}
        .cell-item.flex
            .left {{$t('零股零息')}}
            .right {{conversionForm.payChangeName}} 
        slot
    .cell-box
        .cell-item.flex
            .left {{$t('手續費')}}
            .right {{serviceCharge|thounds}}{{$t('港幣')}}
        .cell-item.flex
            .left {{$t('公司行動費')}}
            .right {{companyActionFee|thounds}}{{$t('港幣')}}
        .cell-item.flex
            .left {{$t('扣除總費用')}}
            .right {{fee|thounds}}{{$t('港幣')}}
    p.a-tips 
        span.iconfont.icon-warning.text-color2
        span.text-color5  {{$t('權益金额为本次可供分配的紅股紅利總金额')}}
</template>

<script>
export default {
    keepalive: true,
    i18n: {
        zhCHS: {
            股票名稱: '股票名称',
            權益金额: '权益金额',
            选股價: '选股价',
            港幣: '港币',
            紅股名稱: '红股名称',
            默认選项: '默认选项',
            手續費: '手续费',
            公司行動費: '公司行动费',
            扣除總費用: '扣除总费用',
            權益金额为本次可供分配的紅股紅利總金额:
                '权益金额为本次可供分配的红股红利总金额',
            零股零息: '零股零息',
            事項說明: '事项说明'
        },
        zhCHT: {
            股票名稱: '股票名稱',
            權益金额: '權益金额',
            选股價: '选股價',
            港幣: '港幣',
            紅股名稱: '紅股名稱',
            默认選项: '默认選项',
            手續費: '手續費',
            公司行動費: '公司行動費',
            扣除總費用: '扣除總費用',
            權益金额为本次可供分配的紅股紅利總金额:
                '權益金额为本次可供分配的紅股紅利總金额',
            零股零息: '零股零息',
            事項說明: '事項說明'
        },
        en: {
            股票名稱: 'Stock',
            權益金额: 'Entitlement',
            选股價: 'Re-Investment Price',
            港幣: 'HKD',
            紅股名稱: 'Scrip',
            默认選项: 'Default',
            手續費: 'Handling Fee',
            公司行動費: 'Corporate Action Service Fee',
            扣除總費用: 'Total Fee',
            權益金额为本次可供分配的紅股紅利總金额:
                'Entitlement amount is the total amount of Cash Dividend and Scrip Dividend',
            零股零息: 'Zero share zero interest',
            事項說明: 'Description of the matter'
        }
    },
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
