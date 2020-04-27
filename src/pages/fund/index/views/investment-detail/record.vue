<template lang="pug">
.investment__record__wrapper
    .investment__record_header
        p(:class="!isNotStop?'black':''") 定投记录
    .investment__record__container(v-if="hasRecord==='yes'")
        .investment__record_title
            span(v-for="(item,index) in titleList" :key='index') {{item}}
        .investment__record_content
            van-list.record_content_list(
                v-model="loading" 
                :finished="finished" 
                :finished-text="finishedText" 
                @load="onLoad"
            )
                .record_content_list_item(v-for="(item,index) in recordList")
                    .list_item_time {{item.time}}
                    .list_item_amount {{item.amount}}
                    .list_item_status 
                        span(:class="isNotStop?statusMap[item.status].color:statusMap[3].color") {{statusMap[item.status].value}}
                        img(src="@/assets/img/fund/icon-more.png")
    .investment__norecord__container(v-if="hasRecord")
        img(src="@/assets/img/fund/icon-norecord.png")
        span 暂无定投记录

</template>
<script>
import { List } from 'vant'
import { statusMap } from './common'
import { getFundFixedRecordPage } from '@/service/finance-server.js'
export default {
    components: {
        [List.name]: List
    },
    props: ['isNotStop'],
    data() {
        return {
            loading: false,
            finished: false,
            total: 0,
            pageNum: 1,
            pageSize: 20,
            finishedText: '',
            titleList: ['时间', '金额(港币)', '订单状态'],
            recordList: [
                { time: '2020-03-11', amount: '5000.00', status: 0 },
                { time: '2020-03-11', amount: '500330.00', status: 1 },
                { time: '2020-03-11', amount: '5000.00', status: 2 },
                { time: '2020-03-11', amount: '50534500.00', status: 3 },
                { time: '2020-03-11', amount: '5033300.00', status: 4 },
                { time: '2020-03-11', amount: '500430.00', status: 3 },
                { time: '2020-03-11', amount: '5000.00', status: 2 },
                { time: '2020-03-11', amount: '50300.00', status: 1 }
            ],
            statusMap,
            hasRecord: false
        }
    },
    created() {
        this.getFundFixedRecordPage()
    },
    methods: {
        onLoad() {
            if (this.recordList.length < this.total) {
                this.pageNum = this.pageNum + 1
                this.getFundFixedRecordPage()
            }
        },
        //定投记录列表
        async getFundFixedRecordPage() {
            try {
                const {
                    list,
                    total,
                    pageSize,
                    pageNum
                } = await getFundFixedRecordPage({
                    fixedPlanCode: this.$route.query.fixedPlanCode,
                    pageNum: this.pageNum,
                    pageSize: this.pageSize
                })
                this.recordList = list
                this.pageNum = pageNum
                this.pageSize = pageSize
                this.total = total
                this.loading = false
                if (this.total === 0) {
                    this.hasRecord = true
                }
                if (this.recordList.length >= this.total) {
                    this.finished = true
                }
                this.finishedText = this.$t('nomore1')
                this.finishedText =
                    this.total == 0 ? '无更多内容' : this.finishedText
            } catch (e) {
                this.$toast(e.msg)
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.investment__record__wrapper {
    padding: 12px;
    .investment__record_header {
        p {
            font-size: 16px;
            color: $text-link-color;
            margin-bottom: 12px;
        }
    }
    .investment__record_title {
        display: flex;
        justify-content: space-between;
        span {
            color: $text-color6;
        }
    }
    .investment__record_content {
        .record_content_list {
            .record_content_list_item {
                line-height: 48px;
                display: flex;
                // justify-content: space-between;
                border-bottom: 1px solid $text-color8;
                &:last-of-type {
                    border-bottom: none;
                }
                .list_item_time {
                    flex: 1;
                }
                .list_item_amount {
                    text-align: left;
                    flex: 1;
                    // text-align: center;
                }
                .list_item_status {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    img {
                        width: 15px;
                        height: 15px;
                        margin-left: 4px;
                    }
                }
            }
        }
    }
    .investment__norecord__container {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 20px;
        img {
            width: 130px;
            height: 120px;
            margin-bottom: 10px;
        }
        span {
            color: $text-color6;
            padding-bottom: 20px;
        }
    }
}
.yellow {
    color: $hk-text-line-color;
}
.green {
    color: $cell-right-color;
}
.gray {
    color: rgba($tip-color, 0.4);
}
.black {
    color: $text-color !important;
}
.orange {
    color: $stop-tag-color;
}
</style>
