<template lang="pug">
.investment__detail__wrapper
    .investment__detail__header(:class="!isNotStop?'no-color':'has-color'")
        .investment__detail__header_info(@click="toFundDetailHandle")
            .header_info_left(:class="!isNotStop?'header_info_gray-left':''")
                .name {{fundHeaderInfoVO.fundName}}
                .code ISIN:{{fundHeaderInfoVO.fundCode}}
            .header_info_right
                img(src="@/assets/img/fund/icon-right.png")
        .investment__detail__header_amount
            .header_amount.left
                .title(:class="!isNotStop?'gray-color':''") 累计金额(港币）
                .content(:class="!isNotStop?'black-color':''") {{investmentInfo.fixedPlanAmount|transNumToThousandMark}}
            .header_amount.right
                .title(:class="!isNotStop?'gray-color':''") 已投期数
                .content(:class="!isNotStop?'black-color':''") {{investNum}}
            .header_amount.tag(v-if="fixedPlanStatus!==1" :class="fixedPlanStatus===2?'yellow':'orange'")
                .span {{statusValue}}
    .investment__detail__card.card
        .card_title
            img(:src="!isNotStop?require('@/assets/img/fund/dingtou2@2x.png'):require('@/assets/img/fund/dingtou@2x.png')")
            span(:class="!isNotStop?'black-color':''") 定投计划
        .card_content
            .card_content_item
                .left 时间金额
                .right {{investmentInfo.fixedCycleType}}{{investmentInfo.fixedCycleValue}} 定投 {{investmentInfo.fixedPlanAmount|transNumToThousandMark}} 港币
            .card_content_item
                .left 扣款方式
                .right {{investmentInfo.eddaBankName}}({{investmentInfo.eddaBankAccount}}) 自动换汇
            .card_content_item
                .left 下次扣款日期
                .right {{investmentInfo.recentDeductionDate}}，{{$t('A32')}}
    .investment__detail__tag.card(v-if="isNotStop")
        .investment__detail__tag_item(
            v-for="(item,index) in tagImgList" 
            :key="index" 
            @click="clickHandle(item.val)")
            img(:src="item.url")
            span {{item.text}}
    .investment__detail__record.card(:class="!isNotStop?'mt5':''")
        record(:isNotStop="isNotStop")
    van-dialog(
        v-model='isShowDialog' 
        :title="dialogTitle" 
        :message="dialogMessage" 
        :showCancelButton='true'  
        :cancelButtonText="cancelButtonText"  
        :confirmButtonText="confirmButtonText"
        @confirm='confirmDialogHandle')
</template>
<script>
import record from './record'
import {
    getFundFixedPlanDetail,
    getUpdateFundFixedPlanStatus
} from '@/service/finance-server'
import { getFundDetail } from '@/service/finance-info-server.js'
import dayjs from 'dayjs'
import { transNumToThousandMark } from '@/utils/tools.js'
import jsBridge from '@/utils/js-bridge.js'
export default {
    components: {
        record
    },
    filters: {
        transNumToThousandMark
    },
    data() {
        return {
            tagImgList: [
                {
                    val: 1,
                    url: require('@/assets/img/fund/icon-set.png'),
                    text: '修改计划'
                },
                {
                    val: 2,
                    url: require('@/assets/img/fund/icon-pause.png'),
                    text: '暂停定投'
                },
                {
                    val: 3,
                    url: require('@/assets/img/fund/icon-close.png'),
                    text: '终止定投'
                }
            ],
            isNotStop: true,
            fundId: '56',
            fixedPlanStatus: 1, //定投状态 1：有效 2 暂停 3 终止
            isShowDialog: false,
            dialogTitle: '',
            dialogMessage: '',
            cancelButtonText: '取消',
            confirmButtonText: '确认',
            statusValue: '',
            fundHeaderInfoVO: {},
            investmentInfo: {},
            investNum: 0,
            fixedPlanStatusval: null
        }
    },
    created() {
        this.getFundFixedPlanDetail()
        this.getFundDetail()
        this.init()
        this.investNum = this.$route.query.investNum
    },
    methods: {
        //修改定投计划
        async getUpdateFundFixedPlanStatus(token) {
            try {
                const res = await getUpdateFundFixedPlanStatus({
                    fixedPlanCode: this.$route.query.fixedPlanCode,
                    fixedPlanStatus: this.fixedPlanStatusval,
                    tradeToken: token
                })
                console.log(res)
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        //获取基金详情
        async getFundDetail() {
            try {
                const { fundHeaderInfoVO } = await getFundDetail({
                    displayLocation: 1,
                    fundId: this.$route.query.id
                })
                this.fundHeaderInfoVO = fundHeaderInfoVO
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        toFundDetailHandle() {
            this.$router.push({
                name: 'fund-details',
                query: {
                    id: this.fundId
                }
            })
        },
        // 点击tab
        clickHandle(val) {
            if (val === 1) {
                // 修改计划 跳定投申购页面
                this.$router.push({
                    name: 'fund-details',
                    query: {
                        id: this.fundId
                    }
                })
            } else if (val === 2) {
                // 暂停定投
                this.fixedPlanStatusval = 2
                this.isShowDialog = true
                this.dialogTitle = '暂停定投'
                this.dialogMessage =
                    '定投是一种良好的投资习惯，确定暂停定投吗？'
            } else if (val === 3) {
                // 终止定投
                this.fixedPlanStatusval = 3
                this.isShowDialog = true
                this.dialogTitle = '终止定投'
                this.dialogMessage =
                    '定投是一种良好的投资习惯，终止定投后不可恢复确定终止定投吗？'
            } else if (val === 4) {
                // 恢复定投
                this.isShowDialog = true
                this.dialogTitle = '恢复定投'
                this.dialogMessage =
                    '恢复定投后将会执行扣款操作，请注意下次扣款日期，确保扣款时您的账户中有足够金额'
            }
        },
        async confirmDialogHandle() {
            try {
                let data = await jsBridge.callApp('command_trade_login', {
                    needToken: true
                })
                let token = data && data.token
                this.getUpdateFundFixedPlanStatus(token)
            } catch (error) {
                this.$toast(error.desc.errorMessage)
                console.log('申购页面-tradeErrorMsg :', error)
            }
        },
        init() {
            if (this.fixedPlanStatus === 2) {
                // 暂停状态
                this.statusValue = '暂停中'
                this.tagImgList = [
                    {
                        val: 4,
                        url: require('@/assets/img/fund/icon-start.png'),
                        text: '恢复定投'
                    },
                    {
                        val: 3,
                        url: require('@/assets/img/fund/icon-close.png'),
                        text: '终止定投'
                    }
                ]
            } else if (this.fixedPlanStatus === 3) {
                this.statusValue = '已终止'
                this.isNotStop = false
            }
        },
        // 查询定投详情
        async getFundFixedPlanDetail() {
            try {
                let params = {
                    fixedPlanCode: this.$route.query.fixedPlanCode
                }
                let res = await getFundFixedPlanDetail(params)
                this.fixedPlanStatus = res.fixedPlanStatus
                this.investmentInfo = res
                this.investmentInfo.recentDeductionDate = dayjs(
                    this.investmentInfo.recentDeductionDate
                ).format('YYYY-MM-DD')
                let monthValue = {
                    1: '一',
                    2: '二',
                    3: '三',
                    4: '四',
                    5: '五'
                }
                this.investmentInfo.fixedCycleValue =
                    this.investmentInfo.fixedCycleType === 1
                        ? monthValue[this.investmentInfo.fixedCycleValue]
                        : this.investmentInfo.fixedCycleValue == '0'
                        ? '月末'
                        : `${this.investmentInfo.fixedCycleValue}号`
                this.investmentInfo.fixedCycleType =
                    this.investmentInfo.fixedCycleType === 1 ? '每周' : '每月'
            } catch (e) {
                e.msg && this.$toast(e.msg)
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.investment__detail__wrapper {
    display: flex;
    width: 100%;
    flex-direction: column;
    // height: 100%;
    background: $background-bottom-color;
    .investment__detail__header {
        .investment__detail__header_info {
            // padding: 0 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 14px 12px;
            border-bottom: 1px solid rgba($background-color, 0.05);
            .header_info_left {
                .name {
                    color: $background-color;
                    font-size: 16px;
                }
                .code {
                    color: rgba($background-color, 0.4);
                    font-size: 12px;
                }
            }
            .header_info_gray-left {
                .name {
                    color: $text-color;
                    font-size: 16px;
                }
                .code {
                    color: rgba($text-color5, 0.4);
                    font-size: 12px;
                }
            }
            .header_info_right {
                img {
                    width: 15px;
                    height: 15px;
                    color: $background-color;
                }
            }
        }
        .investment__detail__header_amount {
            display: flex;
            padding: 14px 0 14px 12px;
            // justify-content: space-between;
            .title {
                font-size: 12px;
                color: rgba($background-color, 0.6);
            }
            .content {
                font-size: 28px;
                color: $background-color;
            }
            .header_amount.left {
                margin-right: 50px;
                // flex: 4;
            }
            .header_amount.tag {
                position: absolute;
                right: 0;
                padding: 0 6px;
                height: 23px;
                background: $stop-tag-color;
                border-radius: 83px 0px 0px 83px;
                display: flex;
                justify-content: center;
                align-items: center;
                .span {
                    color: $background-color;
                    font-size: 12px;
                }
            }
        }
    }
    .investment__detail__card {
        padding: 12px;
        min-height: 107px;
        z-index: 999;
        margin: -85px 12px 10px;
        .card_title {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            img {
                width: 17px;
                height: 19px;
                margin-right: 6px;
            }
            span {
                font-size: 16px;
                color: $text-link-color;
                font-weight: 500;
            }
        }
        .card_content {
            .card_content_item {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
                .left {
                    color: $text-color6;
                }
                .right {
                    color: $text-color;
                }
                &:last-of-type {
                    margin-bottom: 0;
                }
            }
        }
    }
    .investment__detail__tag {
        margin: 0 12px;
        display: flex;
        justify-content: space-around;
        .investment__detail__tag_item {
            display: flex;
            align-items: center;
            height: 48px;
            img {
                width: 15px;
                height: 15px;
                margin-right: 6px;
            }
            span {
                color: $text-link-color;
            }
        }
    }
    .investment__detail__record {
        margin: 15px 12px;
    }
    .mt5 {
        margin-top: 5px;
    }
}
.card {
    background: $background-color;
    box-shadow: 0px 0px 4px 0px rgba(#000, 0.05);
    border-radius: 6px;
}
.has-color {
    height: 240px;
    background: linear-gradient(
        360deg,
        rgba($primary-color-line, 0) 0%,
        rgba(#2971f7, 1) 28%,
        rgba($primary-color, 1) 100%
    );
}
.no-color {
    height: 240px;
    background: linear-gradient(
        360deg,
        rgba(#d3d5da, 0) 0%,
        rgba($background-bottom-color, 1) 28%,
        rgba(#ced1d5, 1) 100%
    );
}
.gray-color {
    color: $text-color6 !important;
}
.black-color {
    color: $text-color !important;
}
.orange {
    background: $stop-tag-color !important;
}
.yellow {
    background: $sell-color !important;
}
</style>
