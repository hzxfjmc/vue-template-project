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
                .inverstment--block--list(
                    @click="toInvestmentDetails(item,index)"
                    v-for="(item,index) in list")
                    .block--item--header.bg-color.ellipse {{item.fundName}}
                    .block--item--content.border-bottom
                        .item--left 
                            .top {{$t('A79')}}
                            .bottom {{item.fixedTotalAmount}}
                        .item--left 
                            .top {{$t('A80')}}
                            .bottom {{item.investNum}}
                    .block--item--footer
                        .flex-item
                            .top {{$t('A81')}}
                            .bottom {{item.recentDeductionDate}}({{item.week}})
                        .flex-item
                            .top {{$t('A82')}}
                            .bottom {{item.chargeType}}
                        .flex-item
                            .top {{$t('A83')}}
                            .bottom {{item.fixedPlanAmount}}
        van-tab(title="历史计划")
            van-list.order-record-list(
                v-model="recordLoading" 
                :finished="recordFinished" 
                :finished-text="finishedText1" 
                @load="onLoad1")
                .inverstment--block--list(v-for="(item,index) in recordList")
                    .block--item--header.bg-uncolor.ellipse {{item.fundName}}
                    .block--item--content.border-bottom
                        .item--left 
                            .top {{$t('A79')}}
                            .bottom {{item.fixedTotalAmount}}
                        .item--left 
                            .top {{$t('A80')}}
                            .bottom {{item.investNum}}
                    .block--item--footer
                        .flex-item
                            .top {{$t('A81')}}
                            .bottom {{item.recentDeductionDate}}({{item.week}})
                        .flex-item
                            .top {{$t('A82')}}
                            .bottom {{item.chargeType}}
                        .flex-item
                            .top {{$t('A83')}}
                            .bottom {{item.fixedPlanAmount}}
        .nomore(v-if="list.length === 0 && active === 0")
            img(:src="require(`@/assets/img/fund/icon-norecord.png`)")
            p {{$t('A84')}}
        .nomore(v-if="recordList.length === 0 && active === 1")
            img(:src="require(`@/assets/img/fund/icon-norecord.png`)")
            p 暂无历史计划
    .inverstment--footer--btn
        van-button.btn-left(@click="toRouter('/index')") {{$t('A76')}}
        van-button.btn-right(@click="toRouter('/fund-account')") {{$t('A77')}}
</template>
<script>
import './index.scss'
import { getFundFixedPlanPage } from '@/service/finance-server.js'
import { jumpUrl } from '@/utils/tools.js'
import { List } from 'vant'
import dayjs from 'dayjs'
export default {
    components: {
        [List.name]: List
    },
    data() {
        return {
            width: 28,
            active: 0,
            list: [],
            recordList: [],
            planPageNum: 1,
            planPageSize: 20,
            planTotla: 0,
            recordPageNum: 1,
            recordPageSize: 20,
            recordTotla: 0,
            loading: false,
            finished: false,
            finishedText: '',
            recordLoading: false,
            recordFinished: false,
            finishedText1: ''
        }
    },
    methods: {
        toRouter(path) {
            let url
            if (path === '/fund-account') {
                url = `${window.location.origin}/wealth/fund/index.html#${path}`
            } else {
                url = `${window.location.origin}/wealth/fund/index.html#${path}?flag=0`
            }
            jumpUrl(3, url)
        },
        //跳转
        toInvestmentDetails(item) {
            this.$router.push({
                name: 'investment-detail',
                query: {
                    fixedPlanCode: item.fixedPlanCode,
                    id: item.fundId,
                    investNum: item.investNum
                }
            })
        },
        //定投计划列表
        async getFundFixedPlanPage() {
            try {
                const {
                    list,
                    pageSize,
                    pageNum,
                    total
                } = await getFundFixedPlanPage({
                    fixedPlanStatus: [1, 2],
                    pageNum: this.planPageNum,
                    pageSize: this.planPageSize
                })
                this.list = list
                this.planPageNum = pageNum
                this.planPageSize = pageSize
                this.planTotla = total
                this.loading = false
                let EnumChargeType = {
                    1: '证券账户',
                    2: 'edda'
                }
                this.list.map(item => {
                    item.chargeType = EnumChargeType[item.chargeType]
                    item.week = this.getWeek(item.recentDeductionDate)
                    item.recentDeductionDate = dayjs(
                        item.recentDeductionDate
                    ).format('YY-DD')
                    console.log(item.chargeType)
                })
                if (this.list.length >= this.planTotla) {
                    this.finished = true
                }
                this.finishedText = this.$t('nomore1')
                this.finishedText = this.planTotla == 0 ? '' : this.finishedText
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        //计算周末公式
        getWeek(data) {
            let index = new Date(data).getDay()
            let i18nObj = {
                1: this.$t([`周一`, `週一`, `Mon.`]),
                2: this.$t([`周二`, `週二`, `Tues.`]),
                3: this.$t([`周三`, `週三`, `Wed.`]),
                4: this.$t([`周四`, `週四`, `Thur.`]),
                5: this.$t([`周五`, `週五`, `Fri.`]),
                6: this.$t([`周六`, `週六`, `Sat.`]),
                7: this.$t([`周天`, `週天`, `Sun.`])
            }
            return i18nObj[index]
        },
        //定投历史列表
        async getFundFixedRecordPage() {
            try {
                const {
                    list,
                    pageSize,
                    pageNum,
                    total
                } = await getFundFixedPlanPage({
                    fixedPlanStatus: [3],
                    pageNum: this.recordPageNum,
                    pageSize: this.recordPageSize
                })
                this.recordLoading = false
                this.recordList = list
                let EnumChargeType = {
                    1: '证券账户',
                    2: 'edda'
                }
                this.recordList.map(item => {
                    item.chargeType = EnumChargeType[item.chargeType]
                    console.log(item.chargeType)
                })
                this.recordPageNum = pageNum
                this.recordPageSize = pageSize
                this.recordTotla = total
                if (this.recordList.length >= this.recordTotla) {
                    this.recordFinished = true
                }
                if (this.recordTotla.length != 0) {
                    this.finishedText = this.$t('nomore1')
                    this.finishedText =
                        this.recordTotla == 0 ? '' : this.finishedText
                }
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        onLoad() {
            if (this.list.length < this.planTotla) {
                this.planPageNum = this.planPageNum + 1
                this.getFundFixedPlanPage()
            }
        },
        onLoad1() {
            if (this.recordList.length < this.recordTotla) {
                this.recordPageNum = this.recordPageNum + 1
                this.getFundFixedRecordPage()
            }
        }
    },
    created() {
        this.getFundFixedPlanPage()
        this.getFundFixedRecordPage()
    }
}
</script>
