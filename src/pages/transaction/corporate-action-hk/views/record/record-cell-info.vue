<template lang="pug">
.cell-info
    .cell-box
        .cell-item.flex
            .left 
              span.cell-title {{conversionForm.stockName}}
              span ({{conversionForm.stockCode|PrefixInteger}})
            .right(:class="{colorPink:isPink,colorGray:isGray,colorYellow:isYellow}") {{conversionForm.statusName}}
        .cell-item.flex
            .left {{$t('供股股數/ (可供股數)')}}
            .right.color-pink {{conversionForm.selectionQty}}/{{conversionForm.registAmount}}股
        .cell-item.flex
            .left {{$t('供股價')}}
            .right.color-gray {{conversionForm.reinvestmentPrice|formatCurrency}}{{$t('港幣')}}
        .cell-item.flex
            .left {{$t('手續費')}}
            .right.color-yellow {{conversionForm.fee|formatCurrency}}{{$t('港幣')}}
        .cell-item.flex
            .left {{$t('供股總費用')}}
            .right {{(conversionForm.selectionQty * conversionForm.reinvestmentPrice+conversionForm.fee) |formatCurrency}}{{$t('港幣')}}
        .cell-item.flex
            .left {{$t('SupplyTime')}}
            .right.color-gray {{conversionForm.createTime}}
    slot
</template>

<script>
export default {
    keepalive: true,
    i18n: {
        zhCHS: {
            股票名稱: '股票名称',
            '供股股數/可供股數': '供股股数/可供股数',
            供股價: '供股价',
            港幣: '港币',
            賬戶可取金額: '账户可取金额',
            剩餘供股數: '剩余供股数',
            手續費: '手续费',
            供股總費用: '供股总费用',
            SupplyTime: '供股时间'
        },
        zhCHT: {
            股票名稱: '股票名稱',
            '供股股數/可供股數': '供股股數/可供股数',
            供股價: '供股價',
            港幣: '港幣',
            賬戶可取金額: '賬戶可取金額',
            剩餘供股數: '剩餘供股數',
            手續費: '手續費',
            供股總費用: '供股總費用',
            SupplyTime: '供股時間'
        },
        en: {
            股票名稱: 'Stock',
            '供股股數/可供股數': 'Accepted/Offered',
            供股價: 'Price',
            港幣: 'HKD',
            賬戶可取金額: 'Withdrawable Cash',
            剩餘供股數: 'Remaining',
            手續費: 'Handling Fee',
            供股總費用: 'Total Amount',
            SupplyTime: 'Supply time'
        }
    },
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
            return [0, 1, 2, 3].includes(this.conversionForm.status)
                ? true
                : false
        },
        isGray() {
            //-1：提交失败4：已撤回 6：已驳回
            return [-1, 4, 6].includes(this.conversionForm.status)
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
    margin: 0 auto;
    margin-bottom: 10px;
    width: 339px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.08);
    border-radius: 10px;
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
            color: #0121dc;
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
}
</style>
