<template lang="pug">
    .history-search
        .search-bar
            .search-bar__wrap
                img(src="../images/search.png" v-if="$root.isHK")
                img(src="../images/1-search.png" v-else)
                input(v-model="keyword" :placeholder="$t('searchPlaceholder')" @input="searchHandler")
            .cancel(@click="$emit('cancel')") {{ $t('cancel') }}
        // 歷史記錄
        .result(v-if="!keyword")
            .result-header
                .result-header__tip {{ $t('searchHistory') }}
                img.result-header__icon(src="../images/delete.png" v-if="$root.isHK" @click="clearHistory")
                img.result-header__icon(src="../images/1-delete.png" v-else @click="clearHistory")
            .result-item(v-for="(item, index) in history" @click="$emit('select', item)")
                .result-item__name {{ item.name }}
                .result-item__code {{ item.symbol }}
                img.result-item__close(src="../images/close.png" v-if="$root.isHK" @click.stop="delHistory(index)")
                img.result-item__close(src="../images/1-close.png" v-else @click.stop="delHistory(index)")
        // 搜索結果
        .result(v-else)
            .result-header
                .result-header__tip {{ $t('searchResult') }}
            .result-item(v-for="item in list" :key="item.item" @click="selectStock(item)")
                .result-item__name(v-html="item.showName")
                .result-item__code(v-html="item.showSymbol")
</template>

<script>
import { debounce } from '../../0-utils'
import { searchStockList } from '../../0-service/market'
import { Toast } from 'vant'

export default {
    name: 'history-search',
    data() {
        return {
            keyword: '',
            history: [],
            list: []
        }
    },
    created() {
        localStorage.MARKET_STRATEGY_HISTORY =
            localStorage.MARKET_STRATEGY_HISTORY || '[]'
        this.history = JSON.parse(localStorage.MARKET_STRATEGY_HISTORY)
    },
    methods: {
        // 搜索
        searchHandler: debounce(async function() {
            try {
                if (this.keyword) {
                    const data = await searchStockList({
                        q: this.keyword
                    })
                    const reg = new RegExp(this.keyword, 'i')
                    data.list.forEach(item => {
                        item.showName = item.name.replace(
                            reg,
                            `<span>$&</span>`
                        )
                        item.showSymbol = item.symbol.replace(
                            reg,
                            `<span>$&</span>`
                        )
                    })
                    this.list = data.list
                } else {
                    this.list = []
                }
            } catch (e) {
                Toast(e.msg || this.$t('errorTips'))
            }
        }, 300),
        // 設置歷史記錄
        setHistoryStorage() {
            localStorage.MARKET_STRATEGY_HISTORY = JSON.stringify(this.history)
        },
        // 刪除歷史記錄
        delHistory(index) {
            this.history.splice(index, 1)
            this.setHistoryStorage()
        },
        // 清除歷史記錄
        async clearHistory() {
            try {
                await this.$dialog.confirm({
                    message: this.$t('confirmClear'),
                    confirmButtonText: this.$t('confirm'),
                    cancelButtonText: this.$t('cancel')
                })
                this.history = []
                this.setHistoryStorage()
            } catch (e) {} // eslint-disable-line
        },
        // 選擇股票
        selectStock(item) {
            const index = this.history.findIndex(
                citem => item.symbol === citem.symbol
            )
            if (index > -1) {
                this.history.splice(index, 1)
            }
            this.history.unshift({
                market: item.market,
                name: item.name,
                symbol: item.symbol
            })
            this.setHistoryStorage()
            this.$emit('select', item)
        }
    }
}
</script>

<style lang="scss" scoped>
.history-search {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    background: #fff;
    display: flex;
    flex-direction: column;
    padding: 0 18px;
    height: 100%;
}
.search-bar {
    display: flex;
    justify-content: space-between;
    height: 50px;
    padding: 6px 0;
}
.search-bar__wrap {
    position: relative;
    width: 280px;
    background: #f8f8f8;
    border-radius: 4px;
    img {
        width: 18px;
        height: 18px;
        position: absolute;
        left: 10px;
        top: 10px;
    }
    input {
        box-sizing: border-box;
        width: 100%;
        height: 38px;
        padding: 0 10px 0 35px;
        background: transparent;
        border: none;
        outline: none;
    }
}
.cancel {
    line-height: 38px;
    color: #393939;
    font-size: 16px;
}
.result {
    flex: 1;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
}
.result-header {
    display: flex;
    justify-content: space-between;
    margin: 24px 0 14px;
}
.result-header__tip {
    color: rgba(#393939, 0.4);
}
.result-header__icon {
    width: 30px;
    height: 20px;
    padding-left: 10px;
}
.result-item {
    position: relative;
    padding: 11px 0;
    border-top: 1px solid rgba(#393939, 0.04);
}
.result-item__name {
    font-size: 16px;
    color: #393939;
    margin-bottom: 1px;
}
.result-item__code {
    font-size: 12px;
    color: rgba(#393939, 0.5);
}
.result-item__close {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    padding: 10px 0 10px 10px;
}
/*大陆版*/
.is-mainland {
    .history-search {
        background: #0b121f;
        .search-bar__wrap {
            background: #161d29;
        }
        input {
            background: #161d29;
            color: #fff;
        }
        .cancel {
            color: #ebebeb;
        }
    }
    .result-header__tip {
        color: #9fb0ca;
    }
    .result-item {
        border-color: #070b14;
    }
    .result-item__name {
        color: #ebebeb;
    }
    .result-item__code {
        color: #58687f;
    }
}
</style>
<style lang="less">
.result-item__name,
.result-item__code {
    span {
        color: #0013e5;
    }
}
/*大陆版*/
.is-mainland {
    .result-item__name,
    .result-item__code {
        span {
            color: #2f79ff;
        }
    }
}
</style>
