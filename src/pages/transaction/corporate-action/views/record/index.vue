<template lang="pug">
yx-container.corporate-action-home
    .main(slot="main")
        van-list(v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            :immediate-check="false"
            @load="onLoad")
            template(v-for="(item,index) in arr")
                    CellInfo(:conversionForm="item" @click.native="goDetail(item)")
                        .operation(v-if="item.status === 3")
                            .delete.primary-color(@click.stop="deleteHandler(item)") 撤销
</template>

<script>
import JSBridge from '@/utils/js-bridge'
import CellInfo from './record-cell-info.vue'
import { getList, applyModify } from '@/service/stock-order-server.js'
import { List } from 'vant'
export default {
    components: {
        CellInfo,
        [List.name]: List
    },
    data() {
        return {
            conversionForm: {},
            arr: [],
            loading: false,
            finished: false,
            pageNum: 2
        }
    },
    created() {
        window.h5HistoryBack = () => {
            JSBridge.callApp('command_close_webview')
        }
        this.initData()
    },
    methods: {
        goDetail(item) {
            if (JSBridge.isYouxinApp) {
                JSBridge.gotoNewWebview(
                    `${window.location.origin}/webapp/transaction/corporate-action.html#/rightsDetail?applyId=${item.applyId}`,
                    false
                )
            } else {
                location.href = `/webapp/transaction/corporate-action.html#/rightsDetail?applyId=${item.applyId}`
            }
        },
        deleteHandler(item) {
            this.$confirm({
                title: `是否确认撤销${item.stockName}的供股申请`,
                confirmButtonText: '确认',
                cancelButtonText: '取消'
            })
                .then(() => {
                    this.successHander(item)
                })
                .catch(() => {
                    console.log(333)
                })
        },
        async successHander(item) {
            this.$loading()
            let params = {
                action: 1,
                activityType: 0,
                applyId: item.applyId,
                selectionQty: 0
            }
            try {
                await applyModify(params)
                this.$close()
                this.$toast('撤销成功')
                //撤销完重新刷一下数据
                this.initData()
            } catch (e) {
                await this.$toast(e.msg || '网络开小差了,请稍后重试')
            }
        },
        async onLoad() {
            this.$loading()
            try {
                let params = {
                    activityType: 0,
                    orderBy: '',
                    orderDirection: 0,
                    pageNum: this.pageNum,
                    pageSize: 3,
                    pageSizeZero: false
                }
                let { list } = await getList(params)
                this.$close()
                if (list.length) {
                    this.pageNum++
                    this.arr = this.arr.concat(list)
                } else {
                    this.finished = true
                }
                this.loading = false
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        async initData() {
            this.$loading()
            try {
                let params = {
                    activityType: 0,
                    orderBy: '',
                    orderDirection: 0,
                    pageNum: 1,
                    pageSize: 3,
                    pageSizeZero: false
                }
                let { list } = await getList(params)
                this.arr = list
                this.$close()
            } catch (e) {
                this.$toast(e.msg)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.corporate-action-home {
    $disabled: #dadada;
    .main {
        background-color: $background-bottom-color;
    }
    .bottom {
        background-color: $disabled;
        height: 48px;
        line-height: 48px;
        font-size: 16px;
        text-align: center;
        color: #fff;
    }
    .operation {
        height: 40px;
        background-color: #fff;
        padding: 0 $global-padding;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .delete {
            height: 22px;
            width: 49px;
            border: 1px solid $primary-color;
            line-height: 22px;
            font-size: 13px;
            text-align: center;
        }
    }
}
</style>
