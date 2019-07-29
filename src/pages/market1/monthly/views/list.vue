<template lang="pug">
    .list
        van-list(
            v-model="loading"
            :finished="finished"
            :error.sync="error"
            @load="onLoad"
        )
            .title(v-if="list.length > 0") {{ $t('list.createYg') }}
            .card(v-for="(item, index) in list" :key="index")
                .card__title
                    | {{ item.stockName }}
                    span {{ item.stockCode }}
                .card__description {{ item.publicityMessage }}
                router-link.card__button(:to="'/edit/' + item.stockCode + '/' + item.exchangeType") {{ $t('list.createYg') }}
        no-data(v-if="list.length === 0" :text="$t('common.nodata')")
</template>

<script>
import { Toast, List } from 'vant'
import { getMonthlyStockList } from '../../0-service/market'
import NoData from '../../0-components/no-data'
export default {
    name: 'list',
    components: {
        NoData,
        [List.name]: List
    },
    data() {
        return {
            loading: false,
            finished: false,
            error: false,
            pageNum: 1,
            list: []
        }
    },
    methods: {
        async onLoad() {
            try {
                this.loading = true
                const data = await getMonthlyStockList({
                    pageNum: this.pageNum
                })
                this.pageNum++
                this.list = this.list.concat(data.list)
                this.loading = false
                this.finished = this.list.length >= data.total
            } catch (e) {
                this.loading = false
                this.error = true
                Toast(e.msg || this.$t('common.errorTips'))
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.list {
    margin: 0 18px;
}
.title {
    margin: 14px 0;
    font-size: 28px;
    line-height: 40px;
}
.card {
    border: 1px solid #ececec;
    border-radius: 8px;
    text-align: center;
    padding: 14px;
    margin-bottom: 10px;
    &__title {
        font-size: 20px;
        margin-bottom: 5px;
        span {
            font-size: 12px;
            color: rgba(#393939, 0.5);
            margin-left: 4px;
        }
    }
    &__description {
        font-size: 12px;
        color: rgba(#393939, 0.4);
        margin-bottom: 20px;
    }
    &__button {
        display: block;
        width: 225px;
        height: 40px;
        font-size: 14px;
        line-height: 40px;
        color: #fff;
        border-radius: 4px;
        background: #0055ff;
        margin: 0 auto;
        &:active {
            background: rgba(#0055ff, 0.8);
        }
    }
}
</style>
