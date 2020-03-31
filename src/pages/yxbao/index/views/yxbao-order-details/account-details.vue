<template lang="pug">
.block__account--details
    .block__account--header.border-bottom
        p.title {{orderDetails.recordTypeName}}
        p.num {{orderDetails.recordAmount}}
            em.money {{$t('hkd')}}
    .block__account--list.border-bottom(v-if="!successHide")
        .block__account--item
            p {{$t('C22')}}
            p {{orderDetails.recordFee}}{{$t('hkd')}}
        .block__account--item
            p {{$t('C23')}}
            p {{orderDetails.recordAmount}}{{$t('hkd')}}
    .block__status--step
        transferStep(
            v-if="intoShow"
            :stepOne="intoStepOne"
            :stepTwo="intoStepTwo"
            )
        transferStep(
            v-else
            :stepOne="stepOne"
            :successHide="successHide"
            :stepTwo="stepTwo"
            )
</template>
<script>
import transferStep from './transfer-step'
import dayjs from 'dayjs'
import { getBaoCapitalTradeDetails } from '@/service/finance-server.js'
export default {
    components: {
        transferStep
    },
    data() {
        return {
            intoShow: true,
            successHide: true,
            orderDetails: {},
            stepOne: {
                label: '提交转出申请成功，可立即购买股票',
                time: ''
            },
            stepTwo: {
                label: '资金到达证券账户',
                time: ''
            },
            intoStepOne: {
                label: '转入',
                time: ''
            },
            intoStepTwo: {
                label: '开始查看收益',
                time: ''
            }
        }
    },

    created() {
        this.getBaoCapitalTradeDetails()
    },
    methods: {
        //获取详情
        async getBaoCapitalTradeDetails() {
            try {
                const res = await getBaoCapitalTradeDetails({
                    recordNo: this.$route.params.data.recordNo
                })
                this.orderDetails = res
                let outTypeName = this.$t([
                    '普通转出',
                    '普通轉出',
                    'Redemption（Fast）'
                ])
                let fastOutTypeName = this.$t([
                    '快速转出',
                    '快速轉出',
                    'Redemption（Common）'
                ])

                if (this.orderDetails.outType === 1) {
                    this.orderDetails.recordTypeName = outTypeName
                }
                if (this.orderDetails.outType === 2) {
                    this.orderDetails.recordTypeName = fastOutTypeName
                }

                this.InitState()
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        InitState() {
            //转入
            if (this.orderDetails.recordType === 1) {
                this.intoStepOne.time = dayjs(
                    this.orderDetails.createTime
                ).format('YYYY-MM-DD HH:mm:ss')
                this.intoStepTwo.time = `预计${dayjs(
                    this.orderDetails.earningsDate
                ).format('MM-DD')}`
            }
            //转出
            if (this.orderDetails.recordType === 2) {
                this.intoShow = false
                if (this.orderDetails.outType == 2) {
                    this.successHide = false
                }
                this.stepOne.time = dayjs(this.orderDetails.createTime).format(
                    'YYYY-MM-DD HH:mm:ss'
                )
                this.stepTwo.time = `预计${dayjs(
                    this.orderDetails.earningsDate
                ).format('MM-DD')}`
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.block__account--details {
    background: #fff;
    width: 100%;
    height: 100%;
}
.block__account--header {
    width: 100%;
    height: 123px;
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .title {
        font-size: 16px;
        color: $text-color5;
    }
    .num {
        font-size: 24px;
        display: flex;
        align-items: center;
        font-family: yxFontDINPro-Medium;
        .money {
            font-size: 20px;
            font-style: normal;
            font-weight: 500;
        }
    }
}
.block__account--list {
    padding: 14px 12px;
    .block__account--item {
        display: flex;
        flex-direction: row;
        line-height: 26px;
        color: $text-color6;
        justify-content: space-between;
    }
}
.block__status--step {
    padding: 14px 12px;
}
</style>
