<template lang="pug">
van-popup.search-shares(v-model="show" position="right")
    .search-shares-container
        van-search.border-bottom(
            :placeholder="placeholder" 
            background="#fff"
            v-model="searchKey"
            showAction
            )
            .cancel(slot="action" @click="show=false" ) 取消
            .iconfont.icon-search(slot="left-icon")
        .search-result
            .result-title.border-bottom {{searchList.length > 0 ? '搜索结果' : '暂无结果'}}
            .result-item.border-bottom(v-for="item in searchList")
                .top-item(@click="selectStocks(item)") 
                    span.flex {{item.market.toUpperCase()}}
                    span.shares {{item.name}}
                .bottom-item
                    p.text-color2 {{item.symbol}}
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
                    this.searchList = list
                }, 300)
            }
        }
    }
}
</script>

<style lang="scss">
.search-shares {
    .van-search {
        background-color: #fff;
        .van-cell {
            background-color: rgba(53, 53, 71, 0.04);
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
                .shares {
                    font-size: 16px;
                    flex: 1;
                    flex-wrap: wrap;
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
                padding-left: 30px;
                line-height: 15px;
            }
        }
    }
}
</style>
