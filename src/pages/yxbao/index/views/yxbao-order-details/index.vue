<template lang="pug">
.block__order--details
    .block__order--header.border-bottom
        img(:src="img") 
        p {{orderDetails.recordTypeName}}{{orderDetails.recordStatusName}}
    .block__order-status.border-bottom
        p.title {{$t('orderStatus')}}
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
    .block__word--list.border-bottom(v-if="intoShow")
        .block__word--item
            p.word-color {{$t('C30')}}
            p {{$t('C31')}}
        .block__word--item
            p.word-color {{$t('C27')}}
            p.num {{orderDetails.recordAmount|transNumToThousandMark}}{{$t('hkd')}}

    .block__word--list.border-bottom(v-else)
        .block__word--item
            p.word-color {{$t('C37')}}
            p {{orderDetails.recordTypeName}}
        .block__word--item
            p.word-color {{$t('Amounts')}}
            p.num {{orderDetails.recordAmount|transNumToThousandMark}}{{$t('hkd')}}

        .block__word--item
            p.word-color {{$t('C22')}}
            p.num {{orderDetails.recordFee|transNumToThousandMark}}{{$t('hkd')}}

    .block__footer--btn
        van-button(@click="toHomePage") 完成
        
</template>
<script>
import transferStep from './transfer-step'
import dayjs from 'dayjs'
import { transNumToThousandMark } from '@/utils/tools.js'
export default {
    components: {
        transferStep
    },
    i18n: {
        zhCHS: {
            orderStatus: '订单状态',
            Amounts: '转出金额'
        },
        zhCHT: {
            orderStatus: '訂單狀態',
            Amounts: '轉出金額'
        },
        en: {
            orderStatus: 'Order Status',
            Amounts: 'Redemption Amounts'
        }
    },
    filters: {
        transNumToThousandMark(value) {
            return transNumToThousandMark(value)
        }
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
            },
            img: `${window.location.origin}/wealth/yxbao/zhuan-succed.png`
        }
    },
    created() {
        this.InitState()
    },
    methods: {
        InitState() {
            this.orderDetails = this.$route.params.data
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
                    this.orderDetails.deliveryDate
                ).format('MM-DD')}`
            }
            //初始化多语言
            this.stepTwo.label = this.$t('C25')
        },
        toHomePage() {
            this.$router.push({
                name: 'home'
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.block__order--details {
    width: 100%;
    height: 100%;
    background: #fff;
    .block__order--header {
        width: 100%;
        height: 180px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        img {
            width: 99px;
            height: 99px;
        }
        p {
            font-size: 20px;
            margin: 12px 0 0 0;
        }
    }
}
.block__order-status {
    .title {
        margin: 14px 0 14px 12px;
    }
}
.block__word--list.border-bottom {
    padding: 14px 12px;
    display: flex;
    flex-direction: column;
    .block__word--item {
        display: flex;
        line-height: 22px;
        flex-direction: row;
        justify-content: space-between;
        .word-color {
            color: $text-color6;
        }
        .num {
            font-size: 16px;
        }
    }
    .block__word--item {
        margin: 10px 0 0 0;
    }
    .block__word--item:first-child {
        margin: 0 0 0 0;
    }
}
.block__footer--btn {
    .van-button {
        width: 343px;
        height: 48px;
        margin: 20px 16px 0 16px;
        background: rgba(13, 80, 216, 1);
        border-radius: 6px;
        color: #fff;
        font-size: 16px;
    }
}
</style>
