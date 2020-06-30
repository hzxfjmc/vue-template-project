<template lang="pug">
.investment__record__wrapper
    .investment__record_header
        p(:class="!isNotStop?'black':''") {{$t('A96')}}
    .investment__record__container(v-if="!hasRecord")
        .investment__record_title
            .block__title.item0 {{$t('A97')}}
            .block__title.item1 {{$t('A98')}}({{currencyName}})
            .block__title.item2 {{$t('A99')}}
        .investment__record_content
            van-list.record_content_list(
                v-model="loading" 
                :finished="finished" 
                :finished-text="finishedText" 
                @load="onLoad"
            )
                .record_content_list_item(
                    @click="toDetailHandle(item)"
                    v-for="(item,index) in recordList")
                    .list_item_time {{item.fixedDate}}
                    .list_item_amount {{item.fixedPlanAmount}}
                    .list_item_status 
                        span(:class="statusMap[item.externalStatus].color") {{item.externalName}}
                        img(src="@/assets/img/fund/icon-more.png")
            
    .investment__norecord__container(v-if="hasRecord")
        img(src="@/assets/img/fund/icon-norecord.png")
        span {{$t('A101')}}

</template>
<script>
import { List } from 'vant'
import { statusMap } from './common'
import dayjs from 'dayjs'
import { getFundFixedRecordPage } from '@/service/finance-server.js'
export default {
    components: {
        [List.name]: List
    },
    props: ['isNotStop', 'currencyType'],
    data() {
        return {
            loading: false,
            finished: false,
            total: 0,
            pageNum: 1,
            pageSize: 20,
            finishedText: '',
            recordList: [],
            statusMap,
            hasRecord: false
        }
    },
    computed: {
        currencyName() {
            const CURRENCYEUMN = {
                1: this.$t('usd'),
                2: this.$t('hkd')
            }
            return CURRENCYEUMN[this.currencyType]
        }
    },
    created() {
        this.getFundFixedRecordPage()
    },
    methods: {
        // 跳转到详情
        toDetailHandle(item) {
            let data = {
                name: 'transaction-record',
                query: {
                    orderNo: item.orderNo,
                    orderStatus: item.externalStatus,
                    currencyType: this.$route.query.currency
                }
            }

            if (item.actionInfo) {
                data.query.groupId = item.actionInfo.group.group_id
            }
            this.$router.push(data)
        },
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
                this.recordList.map(item => {
                    item.fixedDate = dayjs(item.fixedDate).format('YYYY-MM-DD')
                })
                this.finishedText = this.$t('nomore1')
                this.finishedText =
                    this.total == 0 ? '无更多内容' : this.finishedText
                console.log(this.recordList)
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
            font-weight: bold;
        }
    }
    .investment__record_title {
        display: flex;
        justify-content: space-between;
        flex-direction: row;
        .block__title {
            color: $text-color6;
            flex: 1;
        }
        .item1 {
            text-align: center;
        }
        .item2 {
            text-align: right;
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
                    text-align: center;
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
