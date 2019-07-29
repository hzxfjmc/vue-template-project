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
                            .delete.primary-color(@click.stop="deleteHandler(item)") {{$t('cancelled')}}
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
    i18n: {
        zhCHS: {
            ifcancel: res => {
                return `是否确认撤销${res}的供股申请`
            },
            withdrawalSuccess: '撤销成功'
        },
        zhCHT: {
            ifcancel: res => {
                return `是否確認撤銷${res}的供股申請`
            },
            withdrawalSuccess: '撤销成功'
        },
        en: {
            ifcancel: res => {
                return `Whether to confirm the withdrawal of the ${res}  rights issue application`
            },
            withdrawalSuccess: 'Successful cancellation'
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
                    `${window.location.origin}/webapp/transaction/corporate-action-hk.html#/rightsDetail?applyId=${item.applyId}`,
                    false
                )
            } else {
                location.href = `/webapp/transaction/corporate-action-hk.html#/rightsDetail?applyId=${item.applyId}`
            }
        },
        deleteHandler(item) {
            this.$confirm({
                title: this.$t('ifcancel', item.stockName),
                confirmButtonText: this.$t('confirmed'),
                cancelButtonText: this.$t('cancel')
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
                this.$toast(this.$t('withdrawalSuccess'))
                //撤销完重新刷一下数据
                this.initData()
            } catch (e) {
                await this.$toast(e.msg || this.$t('netError'))
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
        padding-top: 10px;
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
