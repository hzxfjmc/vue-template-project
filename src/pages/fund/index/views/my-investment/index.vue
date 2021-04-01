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
        van-tab(:title="$t(['定投计划','定投計劃','Periodic Investment'])")
            van-list.order-record-list(
                v-model="loading" 
                :finished="finished" 
                :finished-text="finishedText" 
                @load="onLoad")
                .inverstment--block--list(
                    @click="toInvestmentDetails(item,index)"
                    v-for="(item,index) in list")
                    .block--item--header.bg-color.ellipse {{item.fundName}}
                    .block--item--content(:class="[item.fixedPlanStatus== 2?'':'border-bottom']")
                        .item--left 
                            .top {{$t('A79')}}({{item.currency === 1 ? $t('usd'):item.currency === 2 ? $t('hkd'):''}})
                            .bottom {{item.fixedTotalAmount|transNumToThousandMark}}
                        .item--left 
                            .top {{$t('A80')}}
                            .bottom.bolder {{item.investNum}}
                       
                    .block--item--footer
                        .flex-item
                            .top {{$t('A81')}}
                            .bottom(v-if="item.fixedPlanStatus!= 2") {{item.recentDeductionDate}}({{item.week}})
                            .bottom(v-else) --
                        .flex-item
                            .top {{$t('A82')}}
                            .bottom {{item.fixedPlanStatus!= 2 ? item.chargeType :'--'}}
                        .flex-item
                            .top {{$t('A83')}}
                            .bottom {{item.fixedPlanStatus!= 2 ? item.fixedPlanAmount :'--'}}
                    .block__tags(v-if="item.fixedPlanStatus == 2") {{$t('stopped')}}
        van-tab(:title="$t(['历史计划','歷史計劃','Historical Plan'])")
            van-list.order-record-list(
                v-model="recordLoading" 
                :finished="recordFinished" 
                :finished-text="finishedText1" 
                @load="onLoad1")
                .inverstment--block--list(
                    @click="toInvestmentDetails(item,index)"
                    v-for="(item,index) in recordList")
                    .block--item--header.bg-uncolor.ellipse {{item.fundName}}
                    .block--item--content
                        .item--left 
                            .top {{$t('A79')}}({{item.currency === 1 ? $t('usd'):item.currency === 2 ? $t('hkd'):''}})
                            .bottom {{item.fixedTotalAmount}}
                        .item--left 
                            .top {{$t('A80')}}
                            .bottom {{item.investNum}}
                    //- .block--item--footer
                    //-     .flex-item
                    //-         .top {{$t('A81')}}
                    //-         .bottom {{item.recentDeductionDate}}({{item.week}})
                    //-     .flex-item
                    //-         .top {{$t('A82')}}
                    //-         .bottom {{item.chargeType}}
                    //-     .flex-item
                    //-         .top {{$t('A83')}}
                    //-         .bottom {{item.fixedPlanAmount}}
        .nomore(v-if="list.length === 0 && active === 0")
            img(:src="require(`@/assets/img/fund/icon-norecord.png`)")
            p {{$t('A84')}}
        .nomore(v-if="recordList.length === 0 && active === 1")
            img(:src="require(`@/assets/img/fund/icon-norecord.png`)")
            p {{$t([`暂无历史计划`,`暂无歷史計劃`,`No Historical Plan`])}}
    .inverstment--footer--btn
        van-button.btn-left(@click="toRouter('/index')") {{$t('A76')}}
        van-button.btn-right(@click="toRouter('/fund-account')") {{$t('A77')}}
</template>
<script>
import './index.scss'
import { getFundFixedPlanPage } from '@/service/finance-server.js'
import { jumpUrl, transNumToThousandMark } from '@/utils/tools.js'
import { List } from 'vant'
import dayjs from 'dayjs'
import { setAppVisibleCallback } from '@/utils/js-bridge'
export default {
    components: {
        [List.name]: List
    },
    filters: {
        transNumToThousandMark: transNumToThousandMark
    },
    i18n: {
        zhCHS: {
            stopped: '已暂停'
        },
        zhCHT: {
            stopped: '已暫停'
        },
        en: {
            stopped: 'Suspended'
        }
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
            let url = `${window.location.origin}/wealth/fund/index.html#/investment-detail`
            let queryString = ''
            ;['fixedPlanCode', 'id', 'investNum'].forEach(key => {
                if (key === 'id') {
                    queryString += `${key}=${item['fundId']}&`
                } else {
                    queryString += `${key}=${item[key]}&`
                }
            })
            url = `${url}?${queryString.slice(0, -1)}`
            jumpUrl('', url)
        },
        //定投计划列表
        async getFundFixedPlanPage(isFirsLoad) {
            try {
                let data = {
                    fixedPlanStatus: [1, 2],
                    pageNum: this.planPageNum,
                    pageSize: this.planPageSize
                }
                if (this.$route.query.id) {
                    data.fundId = this.$route.query.id
                }
                const {
                    list = [],
                    pageSize,
                    pageNum,
                    total
                } = await getFundFixedPlanPage(data)
                let EnumChargeType = {
                    1: this.$t(['证券账户', '證券帳戶', 'Securities Account']),
                    2: 'edda'
                }
                list.forEach(item => {
                    item.chargeType = EnumChargeType[item.chargeType]
                    item.week = this.getWeek(item.recentDeductionDate)
                    item.recentDeductionDate = dayjs(
                        item.recentDeductionDate
                    ).format('MM-DD')
                })
                this.list = isFirsLoad ? list : this.list.concat(list)
                this.planPageNum = pageNum
                this.planPageSize = pageSize
                this.planTotla = total
                this.loading = false

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
            console.log(index)
            let i18nObj = {
                1: this.$t([`周一`, `週一`, `Mon.`]),
                2: this.$t([`周二`, `週二`, `Tues.`]),
                3: this.$t([`周三`, `週三`, `Wed.`]),
                4: this.$t([`周四`, `週四`, `Thur.`]),
                5: this.$t([`周五`, `週五`, `Fri.`]),
                6: this.$t([`周六`, `週六`, `Sat.`]),
                0: this.$t([`周日`, `週日`, `Sun.`])
            }
            return i18nObj[index]
        },
        //定投历史列表
        async getFundFixedRecordPage(isFirstLoad) {
            try {
                let data = {
                    fixedPlanStatus: [3],
                    pageNum: this.recordPageNum,
                    pageSize: this.recordPageSize
                }
                if (this.$route.query.id) {
                    data.fundId = this.$route.query.id
                }
                const {
                    list = [],
                    pageSize,
                    pageNum,
                    total
                } = await getFundFixedPlanPage(data)
                let EnumChargeType = {
                    1: '证券账户',
                    2: 'edda'
                }
                list.forEach(item => {
                    item.chargeType = EnumChargeType[item.chargeType]
                    item.week = this.getWeek(item.recentDeductionDate)
                    item.recentDeductionDate = dayjs(
                        item.recentDeductionDate
                    ).format('MM-DD')
                })
                this.recordLoading = false
                this.recordList = isFirstLoad
                    ? list
                    : this.recordList.concat(list)
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
                if (this.finished) return
                this.getFundFixedPlanPage()
            }
        },
        onLoad1() {
            if (this.list.length < this.recordTotla) {
                this.recordPageNum = this.recordPageNum + 1
                if (this.recordFinished) return
                this.getFundFixedRecordPage()
            }
        },
        init() {
            this.planPageNum = 1
            this.recordPageNum = 1
            this.getFundFixedPlanPage(true)
            this.getFundFixedRecordPage(true)
        }
    },
    created() {
        this.init()
        setAppVisibleCallback(this.init, this)
    }
}
</script>
