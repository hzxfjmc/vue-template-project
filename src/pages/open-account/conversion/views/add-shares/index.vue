<template lang="pug">
.add-shares.flex-fixed.full-height
    SearchShares(
        v-model="showSearch" 
        @select-stocks="selectStocksHandler" 
        :exchangeType="conversionForm.exchangeType")
    p.a-tips 
        span.iconfont.icon-warning.text-color2
        span.text-color5 您当前所选市场为{{exchangeTypeName}}股，请添加需转入的{{exchangeTypeName}}股名称和数量
    .add-button.border-bottom(@click="addHandler")
        span.iconfont.icon-add.text-color2(:class="{'primary-color': canAdd}")
        span.text-color7 添加股票
    .add-shares-container.scroll-able.flex-fixed-container
        .add-edit(v-for="item,index in stockInfo")
            van-cell.stock-name(
                @click.native="selectStocks(index)"
                title='股票名称')
                template(v-if="item.stockName")
                    span.name {{item.stockName}}
                    span.code {{item.stockCode}}
                template(v-else) 
                    span.text-color2 请输入转入股票名称或代码
            van-field.bp-field(
                placeholder="请输入转入股票数量"
                type='tel'
                clearable
                @input="inputStockAmount(item)"
                @focus="inputStockAmount(item)"
                @blur="blurStockAmount(item)"
                v-model="item.stockAmount"
                maxlength=10
                label='股票数量')
            van-field.bp-field(
                placeholder="请输入股票成本价格"
                type='text'
                clearable
                @focus="focusPrice(item)"
                @input="inputPrice(item)"
                @blur="blurPrice(item)"
                v-model="item.costPrice"
                maxlength=10
                label='成本价')
            .operation
                .delete.primary-color(@click="deleteHandler(index)") 删除
        p.a-tips 
            span.text-color5 “成本价”用于计算您的“持仓盈亏"，您可以手动输入设置
    van-button(
        size="large" 
        type="primary" 
        @click="submitHandler"
        :disabled="disabled"
        class="bottom-button" ) 下一步
</template>

<script>
import SearchShares from '@/biz-components/search-shares/index.vue'
export default {
    // keepalive: true,
    mixins: [require('../../mixins/common-mx.js').default],
    data() {
        return {
            currentIndex: 0,
            showSearch: false,
            stockInfo: []
        }
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            if (from.name === 'home' && vm.stockInfo.length === 0) {
                vm.addHandler()
            }
        })
    },
    beforeRouteLeave(to, from, next) {
        if (to.name === 'home') {
            this.updateForm({ stockInfo: this.stockInfo })
        }
        next()
    },
    methods: {
        roundFun(value, n) {
            return Math.round(value * Math.pow(10, n)) / Math.pow(10, n) || 0
        },
        submitHandler() {
            console.log(this.$route.params)
            this.updateForm({ stockInfo: this.stockInfo })
            this.$router.push({
                name: 'confirm-info',
                params: {
                    step: 3
                }
            })
        },
        inputStockAmount(val) {
            val.stockAmount = parseInt(val.stockAmount) || ''
        },
        blurStockAmount(val) {
            if (val.stockAmount) {
                val.stockAmount = val.stockAmount + '股'
            }
        },
        focusPrice(val) {
            val.costPrice = parseFloat(val.costPrice) || ''
        },
        inputPrice(val) {
            val.costPrice =
                val.costPrice && val.costPrice.replace(/[^0-9.]/g, '')
        },
        blurPrice(val) {
            if (val.costPrice) {
                val.costPrice =
                    this.roundFun(val.costPrice, 3) +
                    `${this.exchangeTypeUnit}/股`
            }
        },
        addHandler() {
            this.canAdd &&
                this.stockInfo.unshift({
                    stockName: '',
                    stockCode: '',
                    stockAmount: '',
                    costPrice: '',
                    tradingUnit: '',
                    price: ''
                })
        },
        selectStocks(index) {
            this.showSearch = true
            this.currentIndex = index
        },
        deleteHandler(index) {
            this.stockInfo.splice(index, 1)
        },
        async selectStocksHandler(val) {
            this.showSearch = false
            if (this.stockInfo.some(item => item.stockCode === val.symbol)) {
                this.$alert('不可重复选择')
                return
            }
            //证券代码stockCode，stockName证券名称，
            //stockAmount总数量，costPrice成本价，price转股时市价，均为必填项

            let data = await this.$quotesService.quote([
                `${val.market + val.symbol}`
            ])
            let curInfo = data.list[0]
            let base = Math.pow(10, curInfo.price_base)
            this.$set(this.stockInfo, this.currentIndex, {
                stockName: val.name,
                stockCode: val.symbol,
                stockAmount: '',
                costPrice: curInfo.now / base + `${this.exchangeTypeUnit}/股`,
                tradingUnit: curInfo.trading_unit,
                price: curInfo.now,
                priceBase: curInfo.price_base
            })
        }
    },
    created() {
        if (this.$route.params.ifChange) {
            this.stockInfo = []
        } else {
            this.stockInfo = this.conversionForm.stockInfo
        }
    },
    computed: {
        exchangeTypeName() {
            return this.conversionForm.exchangeType === 0 ? '港' : '美'
        },
        exchangeTypeUnit() {
            return this.conversionForm.exchangeType === 0 ? '港币' : '美元'
        },
        canAdd() {
            return this.stockInfo.length < 10 && !this.canSubmit
        },
        canSubmit() {
            return this.stockInfo.some(item => {
                return !item.costPrice || !item.stockAmount || !item.stockCode
            })
        },
        disabled() {
            return (
                this.stockInfo.length === 0 ||
                (this.stockInfo.length > 0 && this.canSubmit)
            )
        }
    },
    components: {
        SearchShares
    }
}
</script>

<style lang="scss">
.add-shares {
    .stock-name {
        .van-cell__title,
        .van-cell__value {
            flex: inherit;
        }
        .van-cell__value {
            .name {
                color: $text-color;
                padding-right: 10px;
            }
        }
    }
}
</style>

<style lang="scss" scoped>
.add-shares {
    background-color: $background-bottom-color;
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
    .add-button {
        height: 48px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #fff;
        .icon-add {
            font-size: 30px;
            padding-right: 10px;
        }
    }
    .add-shares-container {
        .add-edit {
            margin-top: 10px;
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
    }
}
</style>
