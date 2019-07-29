<template lang="pug">
    li.info-item(:class="{sub: isSubItem}")
        span.name(:style="fontSize ? 'font-size: ' + fontSize + 'px' : ''")
            slot
        span.rate {{ data | formatRate(compare, keyName + '_yoy') }}
        span.value {{ data | formatSum(keyName, exchangeRate) }}
</template>

<script>
export default {
    name: 'info-item',
    props: {
        data: {
            required: true
        },
        compare: {
            required: true
        },
        keyName: {
            required: true
        },
        fontSize: {
            default: null
        },
        isSubItem: {
            default: false
        },
        currency: {
            // 1-本位币，2-港币，3-美元，4-人民币
            required: true
        }
    },
    computed: {
        // 汇率
        exchangeRate() {
            if (this.data) {
                let rate
                switch (this.currency) {
                    case '2':
                        rate =
                            this.data.list.usd_to_hkd /
                            this.data.list.usd_to_curr_currency
                        return rate
                    case '3':
                        rate = 1 / this.data.list.usd_to_curr_currency
                        return rate
                    case '4':
                        rate =
                            this.data.list.usd_to_cny /
                            this.data.list.usd_to_curr_currency
                        return rate
                    default:
                        return 1
                }
            } else {
                return ''
            }
        }
    },
    filters: {
        formatRate(data, typeKey, key) {
            if (!data) {
                return ''
            }
            // 非法数据
            if (data[typeKey][key] === 999999.999999) {
                return '--'
            }
            return data[typeKey][key].toFixed(2) + '%'
        },
        formatSum(data, key, rate) {
            if (data) {
                // 非法数据
                if (data.list[key] === 999999.999999) {
                    return '--'
                }
                // 汇率转换
                const value = data.list[key] * rate
                // 单位转换
                if (Math.abs(value) > 100) {
                    return (Math.floor(value) / 100).toFixed(2) + '亿'
                } else if (Math.abs(value) < 0.01) {
                    return (value * 10e6).toFixed(2) + '元'
                } else {
                    return (value * 100).toFixed(2) + '万'
                }
            } else {
                return ''
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.info-item {
    display: flex;
    justify-content: space-between;
    span {
        display: inline-block;
        &.name {
            width: 43%;
        }
        &.rate {
            width: 15%;
            margin-left: 2%;
        }
        &.value {
            width: 40%;
            text-align: right;
        }
    }
    &.sub {
        span.name {
            color: #58687f;
            padding-left: 10px;
        }
    }
    + .info-item {
        margin-top: 8px;
    }
}
</style>
