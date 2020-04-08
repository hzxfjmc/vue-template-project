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
        van-button(@click="toHomePage") {{$t('done')}}
        
</template>
<script>
import transferStep from './transfer-step'
import dayjs from 'dayjs'
import { transNumToThousandMark } from '@/utils/tools.js'
import jsBridge from '@/utils/js-bridge.js'
export default {
    components: {
        transferStep
    },
    i18n: {
        zhCHS: {
            orderStatus: '订单状态',
            Amounts: '转出金额',
            done: '完成'
        },
        zhCHT: {
            orderStatus: '訂單狀態',
            Amounts: '轉出金額',
            done: '完成'
        },
        en: {
            orderStatus: 'Order Status',
            Amounts: 'Redemption Amounts',
            done: 'Completed'
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
        this.$nextTick(() => {
            let title =
                this.orderDetails.recordType === 1
                    ? this.$t(['转入结果', '轉入結果', 'Subs. Resluts'])
                    : this.$t(['转出结果', '轉出結果', 'Redemption Resluts'])
            document.title = title
        })
    },
    methods: {
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
        InitState() {
            this.orderDetails = this.$route.params.data
            let date =
                this.orderDetails.recordType === 1
                    ? this.orderDetails.earningsDate
                    : this.orderDetails.deliveryDate
            let week = this.getWeek(date)
            let datei18n = this.$t([
                `预计${dayjs(date).format('MM-DD')}(${week})`,
                `預計${dayjs(date).format('MM-DD')}(${week})`,
                `The funds will deposit to your account on ${dayjs(date).format(
                    'MM-DD'
                )}(${week}) (Estimated)`
            ])
            //转入
            if (this.orderDetails.recordType === 1) {
                this.intoStepOne.time = dayjs(
                    this.orderDetails.createTime
                ).format('YYYY-MM-DD HH:mm:ss')
                this.intoStepTwo.time = this.$t([
                    `预计${dayjs(date).format('MM-DD')}(${week})`,
                    `預計${dayjs(date).format('MM-DD')}(${week})`,
                    `The funds will deposit to your account on ${dayjs(
                        date
                    ).format('MM-DD')}(${week}) (Estimated)`
                ])
            }
            //转出
            if (this.orderDetails.recordType === 2) {
                this.intoShow = false
                this.orderDetails.recordTypeName = this.$t('C18')
                let desc =
                    this.orderDetails.outType == 1
                        ? this.$t([
                              `预计${dayjs(
                                  this.orderDetails.deliveryDate
                              ).format('MM-DD')}(${week})10:00前到账`,
                              `預計${dayjs(
                                  this.orderDetails.deliveryDate
                              ).format('MM-DD')}(${week})10:00前到賬`,
                              `The funds will deposit to your account on ${dayjs(
                                  this.orderDetails.deliveryDate
                              ).format('MM-DD')}(${week}) (Estimated)`
                          ])
                        : datei18n
                this.stepTwo.time = desc
                if (this.orderDetails.outType == 2) {
                    this.successHide = false
                    this.orderDetails.recordTypeName = this.$t('C19')
                }
                this.stepOne.time = dayjs(this.orderDetails.createTime).format(
                    'YYYY-MM-DD HH:mm:ss'
                )
            }
            //初始化多语言
            this.stepTwo.label = this.$t('C25')
        },
        toHomePage() {
            if (jsBridge.isYouxinApp) {
                jsBridge.callApp('command_close_webview')
            } else {
                this.$router.push({
                    name: 'home'
                })
            }
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
