<template lang="pug">
.investment--block--wrapper
    .investment--header
        img(src="@/assets/img/fund/succed.svg")
        .header--title {{$t('A110')}}
    .investment--container
        .investment--container--header
            em.iconfont
            span {{$t('A109')}}
        .investmnet--container--list
            .investmnet--list--item
                .left {{$t('A111')}}
                .right {{fundInfo.fundName}}
            .investmnet--list--item
                .left {{$t('A112')}}
                .right {{fundInfo.fixedCycleType}}{{fundInfo.fixedCycleValue}} {{$t('A2')}} {{fundInfo.fixedPlanAmount|transNumToThousandMark}} {{fundInfo.currency == 1 ? $t('usd'): fundInfo.currency == 2 ? $t('hkd'):''}}
            .investmnet--list--item
                .left {{$t('A15')}}
                .right(v-if="fundInfo.chargeType == 2") {{fundInfo.eddaBankName}}({{fundInfo.eddaBankAccount}}) 
                    em(v-if="fundInfo.exchangeFlag === 1") {{$t('A113')}}
                .right(v-else) ({{fundInfo.bankName}}) 
                    em(v-if="fundInfo.exchangeFlag === 1") {{$t('A113')}}
            .investmnet--list--item
                .left {{$t('A31')}}
                .right {{fundInfo.recentDeductionDate}}
    
    .investment--footer(@click="toRouterPath('/my-investment')")
        van-button( color="#0D50D8") {{$t('A114')}}
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
            1: this.$t([`周一`, `週一`, `Mon.`]),
            2: this.$t([`周二`, `週二`, `Tues.`]),
            3: this.$t([`周三`, `週三`, `Wed.`]),
            4: this.$t([`周四`, `週四`, `Thurs.`]),
            5: this.$t([`周五`, `週五`, `Fri.`])
        }
        this.fundInfo.fixedCycleValue =
            this.fundInfo.fixedCycleType === 1
                ? monthValue[this.fundInfo.fixedCycleValue]
                : this.fundInfo.fixedCycleValue == '0'
                ? this.$t([`月末`, `月末`, `Late of the month`])
                : this.$t([
                      `${this.fundInfo.fixedCycleValue}日`,
                      `${this.fundInfo.fixedCycleValue}日`,
                      `${this.fundInfo.fixedCycleValue}th`
                  ])
        this.fundInfo.fixedCycleType =
            this.fundInfo.fixedCycleType === 1
                ? this.$t(['每周', '每週', 'Weekly'])
                : this.$t(['每月', '每月', 'Monthly'])
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
                min-width: 80px;
            }
            .right {
                text-align: right;
                em {
                    font-style: normal;
                }
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
