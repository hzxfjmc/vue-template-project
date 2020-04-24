<template lang="pug">
.inverstment--block--wrapper
    van-tabs(
        color="#2F79FF"
        :line-width="width"
        title-inactive-color="#191919"
        title-active-color="#2F79FF"
        v-model="active" 
        sticky
        swipeable) 
        van-tab(title="定投计划")
            van-list.order-record-list(
                v-model="loading" 
                :finished="finished" 
                :finished-text="finishedText" 
                @load="onLoad")
                .inverstment--block--list(v-for="(item,index) in list")
                    .block--item--header.bg-color.ellipse JP摩根中國A股市324324324機會基最多是这么多个…
                    .block--item--content.border-bottom
                        .item--left 
                            .top 累计金额(港币）
                            .bottom 13,450.00
                        .item--left 
                            .top 已投期数
                            .bottom 100
                    .block--item--footer
                        .flex-item
                            .top 下次扣款日期
                            .bottom 02-11(周一)
                        .flex-item
                            .top 扣款方式
                            .bottom 建设银行(0483)
                        .flex-item
                            .top 扣款金额
                            .bottom 5,0000.00
        van-tab(title="历史计划")
            van-list.order-record-list(
                v-model="loading1" 
                :finished="finished1" 
                :finished-text="finishedText1" 
                @load="onLoad1")
                .inverstment--block--list(v-for="(item,index) in list")
                    .block--item--header.bg-uncolor.ellipse JP摩根中國A股市324324324機會基最多是这么多个…
                    .block--item--content.border-bottom
                        .item--left 
                            .top 累计金额(港币）
                            .bottom 13,450.00
                        .item--left 
                            .top 已投期数
                            .bottom 100
                    .block--item--footer
                        .flex-item
                            .top 下次扣款日期
                            .bottom 02-11(周一)
                        .flex-item
                            .top 扣款方式
                            .bottom 建设银行(0483)
                        .flex-item
                            .top 扣款金额
                            .bottom 5,0000.00
        .nomore(v-if="list.length === 0 && active === 0")
            img(:src="require(`@/assets/img/fund/icon-norecord.png`)")
            p 暂无定投计划
        .nomore(v-if="list.length === 0 && active === 1")
            img(:src="require(`@/assets/img/fund/icon-norecord.png`)")
            p 暂无历史计划
    .inverstment--footer--btn
        van-button.btn-left() 发现更多定投机会
        van-button.btn-right 我的持仓
</template>
<script>
import './index.scss'
import {
    getFundFixedPlanPage,
    getFundFixedRecordPage
} from '@/service/finance-server.js'
import { List } from 'vant'
export default {
    components: {
        [List.name]: List
    },
    data() {
        return {
            width: 28,
            active: 1,
            list: [],
            planPageNum: 1,
            planPageSize: 20,
            planTotla: 0,
            recordPageNum: 1,
            recordPageSize: 20,
            recordTotla: 0,
            loading: false,
            finished: false,
            finishedText: '无更多内容',
            loading1: false,
            finished1: false,
            finishedText1: '无更多内容'
        }
    },
    methods: {
        //定投计划列表
        async getFundFixedPlanPage() {
            try {
                const { list } = await getFundFixedPlanPage({
                    fixedPlanStatus: [1],
                    pageNum: 1,
                    pageSize: 20
                })
                console.log(list)
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        //定投历史列表
        async getFundFixedRecordPage() {
            try {
                const { list } = await getFundFixedRecordPage({
                    fixedPlanCode: '1',
                    pageNum: 1,
                    pageSize: 20
                })
                console.log(list)
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        onLoad() {
            if (this.list.length < this.total) {
                this.pageNum = this.pageNum + 1
                this.fundOrderList()
            }
        },
        onLoad1() {}
    },
    created() {
        this.getFundFixedPlanPage()
        this.getFundFixedRecordPage()
        console.log(123)
    }
}
</script>
