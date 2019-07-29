<template lang="pug">
yx-container.corporate-action-home
    .main(slot="main")
        van-list(v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            :immediate-check="false"
            @load="onLoad")
            template(v-for="(item,index) in arr")
                CellInfo(:conversionForm="item")
</template>

<script>
import JSBridge from '@/utils/js-bridge'
import CellInfo from './choose-r-cell-info.vue'
import { getList } from '@/service/stock-order-server.js'
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
        async onLoad() {
            this.$loading()
            try {
                let params = {
                    activityType: 1,
                    orderBy: '',
                    orderDirection: 0,
                    pageNum: this.pageNum,
                    pageSize: 6,
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
                    activityType: 1,
                    orderBy: '',
                    orderDirection: 0,
                    pageNum: 1,
                    pageSize: 6,
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
    .header {
        background-color: $primary-color;
        width: 100%;
        color: rgba(235, 235, 235, 1);
        line-height: 32px;
        height: 32px;
        padding: 0 $global-padding;
    }
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
}
</style>
