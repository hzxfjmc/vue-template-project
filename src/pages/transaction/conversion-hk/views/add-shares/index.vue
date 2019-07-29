<template lang="pug">
.add-shares.flex-fixed.full-height(:class="lang=='en'?'en-share':'ch-share'")
    SearchShares(
        v-model="showSearch" 
        @select-stocks="selectStocksHandler" 
        :exchangeType="conversionForm.exchangeType")
    p.a-tips 
        span.iconfont.icon-warning.text-color2
        span.text-color5 {{$t(`stockType`, exchangeTypeName)}}
    .add-button(@click="addHandler")
        span.iconfont.icon-add.text-color2(:class="{'hk-primary-color': canAdd}")
        span.text-color7 {{$t('addStock')}}
    .add-shares-container.scroll-able.flex-fixed-container
        .add-edit(v-for="item,index in stockInfo")
            van-cell.stock-name.bp-field(
                @click.native="selectStocks(index)"
                :title="$t('stockName')")
                template(v-if="item.stockName")
                    span.name {{item.stockName}}
                    span.code {{item.stockCode}}
                template(v-else) 
                    span.text-color2 {{$t('enterNameMsg')}}
            van-field.bp-field(
                :placeholder="$t('enterNumberMsg')"
                type='tel'
                clearable
                @input="inputStockAmount(item)"
                @focus="inputStockAmount(item)"
                @blur="blurStockAmount(item)"
                v-model="item.stockAmount"
                maxlength=10
                :label="$t('stochNumber')")
            van-field.bp-field(
                :placeholder="$t('enterPrice')"
                type='text'
                clearable
                @focus="focusPrice(item)"
                @input="inputPrice(item)"
                @blur="blurPrice(item)"
                v-model="item.costPrice"
                maxlength=10
                :label="$t('currentPrice')")
            .operation
                .delete.hk-primary-color(@click="deleteHandler(index)") {{$t('deleteMsg')}}
        p.a-tips 
            span.text-color5 {{$t('priceTip')}}
    van-button(
        size="large" 
        type="primary" 
        @click="submitHandler"
        :disabled="disabled"
        class="bottom-button" ) {{$t('nextInfo')}}
</template>

<script>
import SearchShares from '@/biz-components/search-shares/hk-index.vue'
import { lang } from '@/utils/html-utils'
export default {
    i18n: {
        zhCHT: {
            addStock: '添加股票',
            stockName: '股票名稱',
            enterNameMsg: '請輸入轉入股票名稱或代碼',
            enterNumberMsg: '請输入轉入股票數量',
            stochNumber: '股票數量',
            enterPrice: '請輸入股票成本價格',
            currentPrice: '成本價',
            deleteMsg: '删除',
            nextInfo: '下一步',
            repeatSelect: '不可重複選擇',
            hkd: '港幣',
            usd: '美元',
            stockType: key =>
                `您當前所選市场为${key}股，請添加需轉入的${key}股名稱和數量`,
            hongkong: '港',
            usa: '美',
            stockMsg: '股',
            priceTip: '“成本價”用於計算您的“持倉盈虧”，您可以手動輸入設置'
        },
        zhCHS: {
            addStock: '添加股票',
            stockName: '股票名称',
            enterNameMsg: '请输入转入股票名称或代码',
            enterNumberMsg: '请输入转入股票数量',
            stochNumber: '股票数量',
            enterPrice: '请输入股票成本价格',
            currentPrice: '成本价',
            deleteMsg: '删除',
            nextInfo: '下一步',
            repeatSelect: '不可重复选择',
            hkd: '港币',
            usd: '美元',
            stockType: key =>
                `您当前所选市场为${key}股，请添加需转入的${key}股名称和数量`,
            hongkong: '港',
            usa: '美',
            stockMsg: '股',
            priceTip: '“成本价”用于计算您的“持仓盈亏"，您可以手动输入设置'
        },
        en: {
            addStock: 'Add',
            stockName: 'Stock',
            enterNameMsg: 'Please enter stock name/symbol',
            enterNumberMsg: 'Please enter quantity',
            stochNumber: 'Quantity',
            enterPrice: 'current market price',
            currentPrice: 'Cost',
            deleteMsg: 'Delete',
            nextInfo: 'Next',
            repeatSelect: 'Cannot duplicate',
            hkd: 'HKD',
            usd: 'USD',
            stockType: key =>
                `You selected ${key} market，please add ${key} stock you want to deposit`,
            hongkong: 'HK',
            usa: 'US',
            stockMsg: 'Stock',
            priceTip:
                'Please tell us your "cost" of the stock for calculating your profit. If not set, the cost will be the market price of stock at time of transfer.'
        }
    },
    mixins: [require('../../mixins/common-mx.js').default],
    data() {
        return {
            currentIndex: 0,
            showSearch: false,
            stockInfo: [],
            lang
        }
    },
    beforeRouteEnter(to, from, next) {
        console.log(to, from)
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
                val.stockAmount = val.stockAmount + this.$t('stockMsg')
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
                    `${this.exchangeTypeUnit}/${this.$t('stockMsg')}`
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
            this.$bus.$emit('show-bar')
            this.showSearch = false
            if (this.stockInfo.some(item => item.stockCode === val.symbol)) {
                this.$alert(this.$t('repeatSelect'))
                return
            }
            //證劵代碼stockCode，stockName證劵名稱，
            //stockAmount总数量，costPrice成本價，price轉股时市價，均为必填项

            let data = await this.$quotesService.quote([
                `${val.market + val.symbol}`
            ])
            let curInfo = data.list[0]
            let base = Math.pow(10, curInfo.price_base)
            this.$set(this.stockInfo, this.currentIndex, {
                stockName: val.name,
                stockCode: val.symbol,
                stockAmount: '',
                costPrice:
                    curInfo.now / base +
                    `${this.exchangeTypeUnit}/${this.$t('stockMsg')}`,
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
            return this.conversionForm.exchangeType == 0
                ? this.$t('hongkong')
                : this.$t('usa')
        },
        exchangeTypeUnit() {
            return this.conversionForm.exchangeType === 0
                ? this.$t('hkd')
                : this.$t('usd')
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
    watch: {
        showSearch(val) {
            if (val) {
                this.$bus.$emit('hide-bar')
            } else {
                this.$bus.$emit('show-bar')
            }
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
        .van-cell__title {
            flex: inherit;
        }
        .van-cell__value {
            .name {
                color: $text-color;
                padding-right: 10px;
            }
        }
    }
    .add-edit {
        border-radius: 10px;
        padding: 10px 0;
        .van-cell {
            border-radius: 10px;
        }
        .operation {
            border-radius: 10px;
        }
    }
}
#app {
    .add-shares {
        .bp-field {
            line-height: 39px;
        }
    }
    .en-share {
        .van-cell__title {
            width: 70px;
        }
    }
}
</style>

<style lang="scss" scoped>
.add-shares {
    background-color: $background-bottom-color;
    // .stock-name {
    //     height: 50px;
    //     padding-top: 10px;
    // }
    .a-tips {
        display: flex;
        align-items: center;
        padding-left: 10px;
        height: 32px;
        .text-color5 {
            font-size: 12px;
            padding-left: 5px;
        }
    }
    .add-button {
        margin: 0 auto;
        display: flex;
        align-items: center;
        width: 339px;
        height: 62px;
        border-radius: 12px;
        opacity: 0.2999;
        border: 1px dotted $hk-primary-color;
        .icon-add {
            font-size: 34px;
            padding-right: 10px;
            margin-left: 20px;
        }
    }
    .add-shares-container {
        .add-edit {
            margin: 0 auto;
            margin-bottom: 10px;
            width: 339px;
            background: rgba(255, 255, 255, 1);
            box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.08);
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
                    border: 1px solid $hk-primary-color;
                    line-height: 22px;
                    font-size: 13px;
                    text-align: center;
                }
            }
        }
    }
    .van-cell__value {
        text-align: left;
        span {
            white-space: nowrap;
        }
    }
}
</style>
