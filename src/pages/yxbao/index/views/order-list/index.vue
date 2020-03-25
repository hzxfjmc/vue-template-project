<template lang="pug">
.income-details-content
    van-list.order-record-list(
        v-model="loading" 
        :finished="finished" 
        :finished-text="finishedText" 
        @load="onLoad")
        .block-list(
            class="border-bottom" 
            v-for="(item,index) in list" 
            :key="item.recordNo" 
            @click="toDetailHandle(item)"
            )
            .block__order--list
                .block__order--left
                    p.title {{item.recordTypeName}}
                    p.color {{item.createTime}}
                .block__order--right
                    p.num(v-if="item.recordAmount>0") +{{item.recordAmount}}
                    p.num(v-else-if="item.recordAmount<0") -{{item.recordAmount}}
                    p.num(v-else) {{item.recordAmount}}
                    p.color 余额 {{item.recordBalance}}
    .block-element-nomore(v-if="noMoreShow")
        img.img(src="@/assets/img/fund/icon-norecord.png") 
        .no-record-box {{$t('nomore')}}
            
</template>
<script>
import { getBaoCapitalTradeList } from '@/service/finance-server.js'
import dayjs from 'dayjs'
import { List } from 'vant'
import shareWay from '@/biz-components/share-way/index'
export default {
    components: {
        [List.name]: List,
        shareWay
    },
    i18n: {
        zhCHS: {
            nomore1: '无更多内容'
        },
        zhCHT: {
            nomore1: '無更多內容'
        },
        en: {
            nomore1: 'No More Content'
        }
    },
    data() {
        return {
            list: [],
            noMoreShow: false,
            pageSize: 20,
            pageNum: 1,
            total: 0,
            loading: false,
            finished: false,
            finishedText: '无更多内容'
        }
    },
    methods: {
        // 跳转到详情
        toDetailHandle(item) {
            let data = {
                name: 'account-details',
                params: {
                    data: item
                }
            }
            this.$router.push(data)
        },
        //上拉加载更多
        onLoad() {
            if (this.list.length < this.total) {
                this.pageNum = this.pageNum + 1
                this.getBaoCapitalTradeList()
            }
        },
        async getBaoCapitalTradeList() {
            try {
                const {
                    list,
                    pageSize,
                    pageNum,
                    total
                } = await getBaoCapitalTradeList({
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    currency: 2
                })
                this.loading = false
                list.map(item => {
                    item.createTime = dayjs(item.createTime).format(
                        'YYYY-MM-DD hh:mm:ss'
                    )
                })
                this.list = this.list.concat(list)
                this.pageNum = pageNum
                this.total = total
                this.pageSize = pageSize
                this.noMoreShow = this.total == 0
                if (this.list.length >= this.total) {
                    this.finished = true
                }
                this.finishedText = this.$t('nomore1')
                this.finishedText = this.total == 0 ? '' : this.finishedText
            } catch (e) {
                this.$toast(e.msg)
            }
        }
    },
    async created() {
        this.getBaoCapitalTradeList()
    }
}
</script>
<style lang="scss" scoped>
.income-details-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    -webkit-overflow-scrolling: touch;
    background: #fff;
    overflow: hidden;
    overflow-y: auto;
    .block-list {
        width: 100%;
        // padding: 10px 2%;
        // display: flex;
        align-items: center;
    }
}
.block__order--list {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 82px;
    align-items: center;
    .block__order--left {
        margin: 0 0 0 12px;
        .title {
            font-size: 16px;
        }
    }
    .block__order--right {
        margin: 0 12px 0 0;
        text-align: right;
        .num {
            font-size: 18px;
        }
    }
    p {
        line-height: 26px;
    }
    .color {
        color: rgba(25, 25, 25, 0.65);
    }
}
.block__no-more {
    width: 100%;
    text-align: center;
    color: rgba(25, 25, 25, 0.45);
    line-height: 20px;
    margin: 20px 0 0 0;
}

.block-element-nomore {
    width: 100%;
    text-align: center;
    margin: 150px 0 0 0;
    img {
        width: 130px;
    }
    .no-record-box {
        color: rgba(25, 25, 25, 0.5);
        margin: 10px 0 0 0;
    }
}
</style>
