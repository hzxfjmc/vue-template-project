<template lang="pug">
.investment--block--wrapper
    .investment--header
        img(src="@/assets/img/fund/succed.svg")
        .header--title 设置定投成功
    .investment--container
        .investment--container--header
            em.iconfont
            span 定投计划
        .investmnet--container--list
            .investmnet--list--item
                .left 基金名称
                .right {{fundInfo.fundName}}
            .investmnet--list--item
                .left 时间金额
                .right {{fundInfo.fixedCycleType}}{{fundInfo.fixedCycleValue}} {{$t('A2')}} {{fundInfo.fixedPlanAmount|transNumToThousandMark}} 港币
            .investmnet--list--item
                .left {{$t('A15')}}
                .right(v-if="fundInfo.chargeType == 2") {{fundInfo.eddaBankName}}({{fundInfo.eddaBankAccount}}) 自动换汇
                .right(v-else) ({{fundInfo.bankName}}) 自动换汇
            .investmnet--list--item
                .left {{$t('A31')}}
                .right {{fundInfo.recentDeductionDate}}，{{$t('A32')}}
    
    .investment--footer(@click="toRouterPath('/my-investment')")
        van-button( color="#0D50D8") 完成
</template>
<script>
import dayjs from 'dayjs'
import { gotoNewWebView } from '@/utils/js-bridge.js'
import { transNumToThousandMark } from '@/utils/tools.js'
export default {
    data() {
        return {
            fundInfo: {}
        }
    },
    filters: {
        transNumToThousandMark
    },
    created() {
        this.fundInfo = this.$route.query
        this.fundInfo.recentDeductionDate = dayjs(
            this.fundInfo.recentDeductionDate
        ).format('YYYY-MM-DD')
        let monthValue = {
            1: '一',
            2: '二',
            3: '三',
            4: '四',
            5: '五'
        }
        this.fundInfo.fixedCycleValue =
            this.fundInfo.fixedCycleType === 1
                ? monthValue[this.fundInfo.fixedCycleValue]
                : this.fundInfo.fixedCycleValue == '0'
                ? '月末'
                : `${this.fundInfo.fixedCycleValue}号`
        this.fundInfo.fixedCycleType =
            this.fundInfo.fixedCycleType === 1 ? '每周' : '每月'
    },
    methods: {
        toRouterPath(path) {
            let url = `${window.location.origin}/wealth/fund/index.html#${path}?currency=${this.currency}`
            gotoNewWebView(url)
        }
    }
}
</script>
<style lang="scss" scoped>
.investment--block--wrapper {
    display: flex;
    width: 100%;
    flex-direction: column;
    height: 100%;
    background: #fff;
}
.investment--header {
    display: flex;
    flex-direction: column;
    margin: 47px 0 24px 0;
    width: 100%;
    text-align: center;
    .header--title {
        margin: 12px 0 0 0;
        font-size: 20px;
        line-height: 22px;
    }
}

.investment--container {
    display: flex;
    margin: 0 12px;
    flex-direction: column;
    .investment--container--header {
        width: 100%;
        height: 34px;
        display: flex;
        background: rgba(235, 243, 255, 1);
        align-items: center;
        span {
            font-size: 16px;
            color: rgba(47, 121, 255, 1);
            margin: 0 0 0 2px;
        }
    }
    .investmnet--container--list {
        width: 100%;
        border: 1px solid rgba(244, 248, 255, 1);
        margin: 5px 0 0 0;
        .investmnet--list--item {
            margin: 10px 10px 10px 10px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            .left {
                color: $text-color5;
            }
        }
    }
}

.investment--footer {
    width: 343px;
    position: fixed;
    margin: 0 16px;
    bottom: 22px;
    .van-button {
        width: 100%;
        background: #0d50d8;
        color: #fff;
        font-size: 16px;
        height: 48px;
        line-height: 48px;
    }
}
</style>
