<template lang="pug">
.dividend-detail-container
        van-list.dividend-record-list(v-model="loading" :finished="finished" :finished-text="$t('list')['noMore'].label" @load="onLoad")
            van-cell(v-for="(item,index) in dividendDetailList" :key="index" class="van-cell-item" )
                template(slot-scope='scope')
                    .dividend-item.flex
                        span(class="left-title") {{$t('list')['dividendDate'].label}}
                        span(class="right-value") {{item.dividendDate}}
                    .dividend-item.flex
                        span(class="left-title") {{$t('list')['dividendRecord'].label}}
                        span(class="right-value") {{item.dividendRecord}}
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
                    this.dividendDetailList.push({
                        dividendDate: dayjs(item.dividendPaymentDate).format(
                            'YYYY-MM-DD'
                        ),
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
        margin-bottom: 5px;
    }
}
</style>
