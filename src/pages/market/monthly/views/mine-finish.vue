<template lang="pug">
    .mine-finish
        van-list.main(
            v-if="list.length > 0"
            v-model="loading"
            :finished="finished"
            :error.sync="error"
            @load="onLoad"
        )
            mine-plan(v-for="item in list" :key="item.stockCode" :data="item")
        no-data(v-else :text="$t('common.nodata')")
</template>

<script>
import MinePlan from '../components/mine-plan'
import NoData from '../../0-components/no-data'
import { myMonthlyStockList } from '../../0-service/market'
import { Toast, List } from 'vant'
export default {
    name: 'mine-finish',
    components: {
        MinePlan,
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
    mounted() {
        this.onLoad()
    },
    methods: {
        async onLoad() {
            try {
                this.loading = true
                const data = await myMonthlyStockList({
                    status: 1,
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
