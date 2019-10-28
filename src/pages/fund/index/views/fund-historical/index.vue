<template lang="pug">
    .fund-historacal
        van-list.order-record-list(v-model="loading" :finished="finished" :finished-text="finishedText" @load="onLoad")
            .block-list.border-bottom(class="block-header")
                .block-left 日期
                .block-content 单位净值
                .block-right 日涨幅
            .block-list(class="border-bottom" v-for="(item,index) in list")
                .block-left 423
                  
                .block-content 423
                    
                .block-right 432
    
        //- .block-element-nomore(v-if="noMoreShow")
        //-     img.img(src="@/assets/img/fund/icon-norecord.png") 
        //-     .no-record-box {{$t('nomore')}}
</template>
<script>
import { List } from 'vant'
// import { getFundNetPriceHistoryV1 } from '@/service/finance-info-server.js'
export default {
    components: {
        [List.name]: List
    },
    data() {
        return {
            list: [{}, {}, {}, {}],
            loading: false,
            finished: false,
            fundId: 1,
            pageNum: 1,
            pageSize: 20,
            finishedText: '无更多内容'
        }
    },
    methods: {
        //上拉加载更多
        onLoad() {
            // 异步更新数据
            setTimeout(() => {
                if (this.list.length < this.total) {
                    this.pageNum = this.pageNum + 1
                    this.fundOrderList()
                }
                // 加载状态结束
                this.loading = false

                // 数据全部加载完成
                if (this.list.length >= this.total) {
                    this.finished = true
                }
            }, 500)
        },
        //基金净值历史查询接口
        async getFundNetPriceHistoryV1() {
            try {
                // const res = await getFundNetPriceHistoryV1({
                //     fundId: this.fundId,
                //     pageNum: this.pageNum,
                //     pageSize: this.pageSize
                // })
            } catch (e) {
                this.$toast(e.msg)
            }
        }
    },
    mounted() {
        this.getFundNetPriceHistoryV1()
    }
}
</script>
<style lang="scss" scoped>
.fund-historacal {
    background: #fff;
    // display: flex;
    width: 100%;
    height: 100%;
}
.block-list {
    width: 96%;
    margin: 0 2%;
    display: flex;
    line-height: 40px;
    .block-left,
    .block-content,
    .block-right {
        width: 33.33%;
    }
    .block-content {
        text-align: center;
    }
    .block-right {
        text-align: right;
    }
}
.block-header {
    .block-left,
    .block-content,
    .block-right {
        color: $text-color5;
    }
}
</style>
