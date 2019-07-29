<template lang="pug">
.cell-info
    .cell-box
        .cell-item.flex
            .left
              span.cell-title {{conversionForm.stockName}}
              span ({{conversionForm.stockCode|PrefixInteger}})
            .right(:class="{colorPink:isPink,colorGray:isGray,colorYellow:isYellow}") {{conversionForm.statusName}}
        .cell-item.flex
            .left {{$t('紅股名稱')}}
            .right.color-gray {{conversionForm.productName}}
        .cell-item.flex
            .left {{$t('紅股數量')}}
            .right.color-yellow {{conversionForm.selectionQty}}{{$t('share')}}
        .cell-item.flex
            .left {{$t('紅利金额')}}
            .right {{conversionForm.dividendBalance |formatCurrency}}{{$t('港幣')}}
        .cell-item.flex
            .left {{$t('總費用')}}
            .right.color-gray {{conversionForm.fee|formatCurrency}}{{$t('港幣')}}
        .cell-item.flex
            .left {{$t('選股時間')}}
            .right.color-gray {{conversionForm.createTime}}
</template>

<script>
import { Popup } from 'vant'
export default {
    keepalive: true,
    i18n: {
        zhCHS: {
            港幣: '港币',
            紅股名稱: '红股名称',
            紅股數量: '红股数量',
            紅利金额: '紅利金额',
            默认選项: '默认选项',
            手續費: '手续费',
            總費用: '总费用',
            選股時間: '选股时间'
        },
        zhCHT: {
            港幣: '港幣',
            紅股名稱: '紅股名稱',
            紅股數量: '紅股數量',
            紅利金额: '紅利金额',
            默认選项: '默认選项',
            手續費: '手續費',
            總費用: '總費用',
            選股時間: '選股時間'
        },
        en: {
            港幣: 'HKD',
            紅股名稱: 'Bonus name',
            紅股數量: 'Number of bonus shares',
            紅利金额: 'Bonus amount',
            默认選项: 'Default option',
            手續費: 'Handling fee',
            總費用: 'Total fee',
            選股時間: 'Stock selection time'
        }
    },
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
    margin: 0 auto;
    margin-bottom: 10px;
    width: 339px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.08);
    border-radius: 10px;
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
