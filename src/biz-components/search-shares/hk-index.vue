<template lang="pug">
van-popup.search-shares(v-model="show" position="right")
    .search-shares-container
        van-search.border-bottom(
            :placeholder="placeholder || $t('searchPlace')" 
            background="#fff"
            v-model="searchKey"
            showAction
            )
            .cancel(slot="action" @click="show=false" ) {{$t('cancel')}}
            .iconfont.icon-search(slot="left-icon")
        .search-result
            .result-title.border-bottom {{searchList.length > 0 ? $t('searchResult') : $t('noDataNow')}}
            .result-item.border-bottom(v-for="item in searchList")
                .top-item(@click="selectStocks(item)") 
                    span.shares(v-html="item.el.name")
                .bottom-item
                    span.text-color2(v-html="item.el.symbol")
                    span.text-color2 .{{item.market.toUpperCase()}}
</template>

<script>
import qutoesService from '@/service/quotesService.js'
import mixin from './mixin.js'
export default {
    name: 'ch',
    mixins: [mixin],
    watch: {
        searchKey(val, oldVal) {
            console.log(val, oldVal)
            if (!val) {
                this.searchList = []
            }
            if (val) {
                clearTimeout(this.timer)
                this.timer = setTimeout(async () => {
                    this.params.q = val
                    this.params.mkts = this.exchangeType == 0 ? 'hk' : 'us'
                    let { list } = await qutoesService.searchStocks(this.params)
                    this.searchList = list.map(el => {
                        let item = { ...el }
                        for (let i in el) {
                            if (String(el[i]).indexOf(val) != -1) {
                                el[i] = String(el[i])
                                    .split(val)
                                    .join(
                                        `<font style="color:#0013E5;">${val}</font>`
                                    )
                            }
                        }
                        item.el = el
                        return item
                    })
                }, 300)
            }
        }
    }
}
</script>

<style lang="scss">
#app .van-field {
    line-height: 0.58rem;
}
.search-shares {
    .van-search {
        background-color: #fff;
        .van-search__content {
            background-color: rgba(53, 53, 71, 0.04) !important;
        }
        .van-cell {
            .van-field__control {
                padding-left: 5px;
            }
            .van-field__control:placeholder {
                color: $text-color;
            }
        }
    }
}
</style>

<style lang="scss" scoped>
.search-shares {
    .search-shares-container {
        height: 100vh;
        width: 100vw;
        background-color: #fff;
        .search-result {
            padding: 0 10px;
        }
        .result-title {
            line-height: 20px;
            padding: 10px 8px;
        }
        .result-item {
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 6px 0;
            .top-item {
                display: flex;
                align-items: center;
                color: #393939;
                .shares {
                    font-size: 16px;
                }
                .flex {
                    width: 16px;
                    margin: 0 7px;
                    height: 11px;
                    font-size: 8px;
                    border-radius: 3px;
                    justify-content: center;
                    text-align: center;
                    color: #fff;
                    background-color: #5f42bd;
                }
            }
            .bottom-item {
                line-height: 15px;
            }
        }
    }
}
</style>
