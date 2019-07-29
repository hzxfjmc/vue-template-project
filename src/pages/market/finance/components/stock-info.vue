<template lang="pug">
    .stock-info
        .stock-info-main
            .stock
                span.name {{ data ? data.list.chs_name_abbr : '' }}
                span.symbol {{ data ? `(${data.list.secu_code})` : '' }}
                img(src="../../0-images/icon-02.png" @click="enterExpain")
            .ctr
                .currency
                    yx-select-pop(:value="currency" @input="$emit('update:currency', $event)" :options="currencies" :margin-left="40")
                .compare
                    yx-select-pop(:value="compare" @input="$emit('update:compare', $event)" :options="compares")
                .date-picker
                    img.prev(src="../../0-images/arrow-02.png" @click="$emit('change-next')")
                    | {{ data | formatDate }}
                    img.next(src="../../0-images/arrow-02.png" @click="$emit('change-prev')")
        .stock-info-sub
            p
                span 原始币种
                span {{ data | currencyType(currency) }}
            p
                span 报告类型
                span {{ data | reportType }}
</template>

<script>
import YxSelectPop from '@/components/yx-select-pop'

export default {
    name: 'stock-info',
    props: {
        data: {
            default: null
        },
        currency: {
            default: null
        },
        compare: {
            default: null
        },
        type: {
            default: ''
        }
    },
    data() {
        return {
            currencies: [
                { label: '本位币', value: '1' },
                { label: '港币', value: '2' },
                { label: '美元', value: '3' },
                { label: '人民币', value: '4' }
            ],
            compares: [
                { label: '同比', value: 'yoy' },
                { label: '2年复合', value: 'yoy2' },
                { label: '3年复合', value: 'yoy3' },
                { label: '5年复合', value: 'yoy5' }
            ]
        }
    },
    methods: {
        enterExpain() {
            location.href =
                '/webapp/market/finance-explain.html?type=' + this.type
        }
    },
    filters: {
        formatDate(data) {
            return data ? data.list.end_date.split(' ')[0] : ''
        },
        reportType(data) {
            if (data) {
                const map = new Map([[1, '年报'], [2, '季报'], [10, '半年报']])
                return map.get(data.list.period_type_id) || ''
            }
            return ''
        },
        currencyType(data, chooseType) {
            switch (chooseType) {
                case '1':
                    if (data) {
                        const map = new Map([
                            [1, '人民币'],
                            [2, '美元'],
                            [3, '港币'],
                            [5, '新加坡币'],
                            [6, '日元'],
                            [7, '英镑'],
                            [8, '欧元'],
                            [9, '加元'],
                            [10, '澳元'],
                            [11, '新西兰元'],
                            [12, '法郎']
                        ])
                        return map.get(data.list.curr_type) || ''
                    }
                    return ''
                case '2':
                    return '港币'
                case '3':
                    return '美元'
                case '4':
                    return '人民币'
            }
            return ''
        }
    },
    components: {
        YxSelectPop
    }
}
</script>

<style lang="scss" scoped>
.stock-info-main {
    background: #101a2c;
    padding: 10px 14px 14px;
    .stock {
        line-height: 22px;
        margin-bottom: 15px;
        .name {
            display: inline-block;
            font-size: 16px;
            color: #ebebeb;
            margin-right: 4px;
            max-width: 200px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .symbol {
            vertical-align: top;
            display: inline-block;
            font-size: 14px;
            color: rgba(#ebebeb, 0.4);
        }
        img {
            float: right;
            width: 20px;
            height: 20px;
            box-sizing: content-box;
            padding: 4px;
            position: relative;
            right: -6px;
            top: -4px;
        }
    }
    .ctr {
        display: flex;
        justify-content: space-between;
        line-height: 20px;
        .currency {
            width: 36%;
        }
        .compare {
            width: 28%;
            text-align: center;
        }
        .date-picker {
            width: 40%;
            text-align: right;
            display: inline-block;
            img {
                position: relative;
                top: 50%;
                margin-top: -7px;
                width: 10px;
                height: 6px;
                box-sizing: content-box;
                padding: 8px 4px 0;
                &.prev {
                    transform: rotate(90deg);
                }
                &.next {
                    transform: rotate(-90deg);
                }
            }
        }
    }
}
.stock-info-sub {
    padding: 13px 14px;
    margin-bottom: 7px;
    p {
        display: flex;
        justify-content: space-between;
        line-height: 20px;
        font-size: 14px;
        + p {
            margin-top: 8px;
        }
    }
}
</style>
