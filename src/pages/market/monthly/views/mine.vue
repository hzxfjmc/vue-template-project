<template lang="pug">
    .mine
        template(v-if="list.length > 0")
            van-list.main(
                v-model="loading"
                :finished="finished"
                :error.sync="error"
                @load="onLoad"
            )
                mine-plan(v-for="item in list" :key="item.planId" :data="item")
                router-link.end-plan(to="/mine/finish") {{ $t('mine.checkEnding') }} &gt;
            .footer
                router-link.footer__button(to="/list") {{ $t('router.create') }}
        no-data(v-else :text="$t('common.nodata')")
            router-link.no-data__button(to="/list") {{ $t('router.create') }}
            router-link.no-data__end-plan(to="/mine/finish") {{ $t('mine.checkEnding') }} &gt;
</template>

<script>
import MinePlan from '../components/mine-plan'
import NoData from '../../0-components/no-data'
import { myMonthlyStockList } from '../../0-service/market'
import { Toast, List } from 'vant'
export default {
    name: 'mine',
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
                    status: 0,
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

<style lang="less" scoped>
.mine {
    display: flex;
    flex-direction: column;
    height: 100%;
}
.main {
    flex: 1;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
}
.footer {
    text-align: center;
}
.no-data__button,
.footer__button {
    display: block;
    height: 44px;
    line-height: 44px;
    font-size: 16px;
    color: #fff;
    background: #0055ff;
    &:active {
        background: rgba(#0055ff, 0.8);
    }
}
.no-data__button {
    width: 144px;
    margin: 15px auto 0;
    border-radius: 4px;
}

.no-data__end-plan,
.end-plan {
    font-size: 12px;
    color: rgba(#393939, 0.4);
}
.no-data__end-plan {
    position: absolute;
    bottom: 80px;
    left: 50%;
    transform: translateX(-50%);
}
.end-plan {
    display: block;
    text-align: center;
    margin-bottom: 20px;
}
</style>
