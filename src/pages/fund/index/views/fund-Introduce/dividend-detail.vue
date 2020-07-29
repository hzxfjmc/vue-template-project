<template lang="pug">
.dividend-detail-container
        .container__wrap(v-if="dividendDetailList.length")
            van-list.dividend-record-list(v-model="loading" :finished="finished" :finished-text="$t('list')['noMore'].label" @load="onLoad")
                van-cell(class="van-cell-item")
                    .dividend-list
                            .dividend-item.flex
                                span(class="right-value") {{$t('list')['recordDate'].label}}
                            .dividend-item.flex
                                span(class="right-value") {{$t('list')['dividendDate'].label}}
                            .dividend-item.flex
                                span(class="right-value") {{$t('list')['dividendRecord'].label}}
                van-cell(v-for="(item,index) in dividendDetailList" :key="index" class="van-cell-item" )
                    template(slot-scope='scope')
                        .dividend-list
                            .dividend-item.flex
                                span(class="right-value") {{item.recordDate}}
                            .dividend-item.flex
                                span(class="right-value") {{item.exDividendDate}}
                            .dividend-item.flex
                                span(class="right-value") {{item.dividendRecord}}
        .no-bond-box(v-else)
            .no-bond.no-data {{$t('noData')}}
</template>

<script>
import { i18nIntroducelist } from './fund-introduce'
import { getFundDividendList } from '@/service/finance-info-server.js'
import dayjs from 'dayjs'
export default {
    name: 'divident-detail',
    i18n: i18nIntroducelist,
    components: {},
    data() {
        return {
            dividendDetailList: [],
            loading: false,
            finished: false,
            total: '',
            pageNum: 1,
            pageSize: 20
        }
    },
    watch: {},
    created() {
        this.getFundDividendListFun()
    },
    methods: {
        // 获取列表
        async getFundDividendListFun() {
            try {
                this.loading = true
                let params = {
                    fundId: this.$route.query.id,
                    pageNum: this.pageNum,
                    pageSize: this.pageSize
                }
                let res = await getFundDividendList(params)
                this.total = res.total
                res.list.map(item => {
                    let recordDate, exDividendDate
                    if (item.recordDate) {
                        recordDate = dayjs(item.recordDate).format('YYYY-MM-DD')
                    } else {
                        recordDate = '--'
                    }
                    if (item.exDividendDate) {
                        exDividendDate = dayjs(item.exDividendDate).format(
                            'YYYY-MM-DD'
                        )
                    } else {
                        exDividendDate = '--'
                    }
                    item.dividendPerShare = Number(
                        item.dividendPerShare
                    ).toFixed(4)
                    this.dividendDetailList.push({
                        exDividendDate: exDividendDate,
                        recordDate: recordDate,
                        dividendRecord: item.dividendPerShare
                    })
                })
                // 加载状态结束
                this.loading = false
                // 数据全部加载完成
                if (this.dividendDetailList.length >= this.total) {
                    this.finished = true
                }
            } catch (e) {
                if (e.msg) {
                    this.$alert(e.msg)
                }
            } finally {
                this.loading = false
            }
        },
        // 加载
        onLoad() {
            this.pageNum++
            this.getFundDividendListFun()
        }
    }
}
</script>

<style scoped lang="scss">
.dividend-detail-container {
    .left-title {
        color: rgba($text-color, 0.5);
    }
    .van-hairline--top-bottom {
        position: absolute;
    }
}
.dividend-list {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .flex {
        display: flex;
        flex-direction: column;
    }
}
</style>
