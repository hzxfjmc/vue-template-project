<template lang="pug">
    .detail(v-if="data")
        van-list.main(
            v-model="loading"
            :finished="finished"
            :error.sync="error"
            @load="onLoad"
            :immediate-check="false"
        )
            detail-card(:data="data")
            detail-record(:data="data")
            detail-list(:data="data" :list="list")
        .button--single(v-if="data.status === 3") {{ $t('detail.ygInProgress') }}
        .button--single(v-if="data.status === 2") {{ $t('common.ended') }}
        .button-group(v-if="[0, 1].includes(data.status)")
            .button(@click="doEnd") {{ $t('detail.end') }}
            .button(@click="gotoUpdate" :class="{disable: data.status !== 0}") {{ $t('detail.update') }}
            .button(v-if="data.status === 0" @click="doStop") {{ $t('detail.stop') }}
            .button(v-if="data.status === 1" @click="doRecover") {{ $t('detail.recover') }}
</template>

<script>
import DetailCard from '../components/detail-card'
import DetailRecord from '../components/detail-record'
import DetailList from '../components/detail-list'
import {
    getMonthlyStockPlanMainInfo,
    getMonthlyStockPlanDetail,
    editMonthlyStockStatus
} from '../../0-service/market'
import { Toast, List } from 'vant'
export default {
    name: 'detail',
    components: {
        DetailCard,
        DetailRecord,
        DetailList,
        [List.name]: List
    },
    data() {
        return {
            error: false,
            loading: false,
            finished: false,
            pageNum: 2,
            data: null,
            list: []
        }
    },
    async mounted() {
        this.init()
    },
    methods: {
        async init() {
            try {
                this.pageNum = 2
                this.data = null
                this.list = []
                const planId = this.$route.params.planId
                const [data, data2] = await Promise.all([
                    getMonthlyStockPlanMainInfo({ planId }),
                    getMonthlyStockPlanDetail({ planId })
                ])
                this.data = data
                this.list = data2.list
                this.loading = false
                this.finished = data2.pageSize >= data2.total
            } catch (e) {
                Toast(e.msg || this.$t('common.errorTips'))
            }
        },
        async onLoad() {
            try {
                this.loading = true
                const data = await getMonthlyStockPlanDetail({
                    planId: this.$route.params.planId,
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
        },
        gotoUpdate() {
            if (this.data.status !== 0) {
                return
            }
            const { stockCode, exchangeType, planId } = this.data
            this.$router.push(`/edit/${stockCode}/${exchangeType}/${planId}`)
        },
        // 結束月供
        async doEnd() {
            try {
                try {
                    await this.$dialog.confirm({
                        title: this.$t('detail.confirmEndYg'),
                        message: this.$t('detail.confirmEndYgTips'),
                        confirmButtonText: this.$t('detail.confirmEnd'),
                        cancelButtonText: this.$t('detail.continueYg')
                    })
                } catch (e) {
                    return
                }
                // 驗證交易密碼
                if (!(await this.$tradeLogin())) {
                    return
                }
                await editMonthlyStockStatus({
                    planId: this.$route.params.planId,
                    status: 2
                })
                Toast(this.$t('detail.planEnded'))
                this.init()
            } catch (e) {
                Toast(e.msg || this.$t('common.errorTips'))
            }
        },
        // 暫停月供
        async doStop() {
            try {
                // 驗證交易密碼
                if (!(await this.$tradeLogin())) {
                    return
                }
                // 提交數據
                await editMonthlyStockStatus({
                    planId: this.$route.params.planId,
                    status: 1
                })
                Toast(this.$t('detail.planStopped'))
                this.init()
            } catch (e) {
                Toast(e.msg || this.$t('common.errorTips'))
            }
        },
        // 恢復月供
        async doRecover() {
            try {
                // 驗證交易密碼
                if (!(await this.$tradeLogin())) {
                    return
                }
                // 提交數據
                await editMonthlyStockStatus({
                    planId: this.$route.params.planId,
                    status: 0
                })
                Toast(this.$t('detail.planRecovered'))
                this.init()
            } catch (e) {
                Toast(e.msg || this.$t('common.errorTips'))
            }
        }
    }
}
</script>

<style lang="less" scoped>
.detail {
    display: flex;
    flex-direction: column;
    height: 100%;
}
.main {
    flex: 1;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
}
.button--single {
    font-size: 16px;
    color: #fff;
    text-align: center;
    line-height: 48px;
    height: 48px;
    background: #d7d7d7;
}
.button-group {
    display: flex;
    line-height: 48px;
    height: 48px;
    border-top: 1px solid #eaeaea;
}
.button {
    width: 33.33%;
    font-size: 16px;
    color: #0055ff;
    text-align: center;
    &.disable {
        color: #c4c4c4;
    }
    & + .button {
        border-left: 1px solid #eaeaea;
    }
}
</style>
