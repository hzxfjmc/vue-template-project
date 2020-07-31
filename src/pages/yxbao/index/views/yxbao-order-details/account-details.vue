<template lang="pug">
.block__account--details
    .block__account--header.border-bottom
        p.title {{orderDetails.recordTypeName}}
        p.num {{orderDetails.recordAmount}}
            em.money {{orderDetails.currency === 1 ? $t('usd') : $t('hkd')}}
    .block__account--list.border-bottom(v-if="!successHide")
        .block__account--item
            p {{$t('fundName')}}
            p {{orderDetails.fundName}}(
                span {{orderDetails.currency === 1 ? $t('usd') : $t('hkd')}})
        .block__account--item
            p {{$t('C22')}}
            p {{orderDetails.recordFee}}{{orderDetails.currency === 1 ? $t('usd') : $t('hkd')}}
        .block__account--item
            p {{$t('C23')}}
            p {{orderDetails.recordAmount}}{{orderDetails.currency === 1 ? $t('usd') : $t('hkd')}}
    .block__status--step
        .block__fund-name
            p {{$t('fundName')}}
            p {{orderDetails.fundName}}(
                span {{orderDetails.currency === 1 ? $t('usd') : $t('hkd')}})
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
            fundName: '',
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
                    `${dayjs(date).format('MM-DD')}(${week}) (Estimated)`
                ])
                this.intoStepOne.label = this.$t('C9')
                this.intoStepTwo.label = this.$t('C26')
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
                this.stepTwo.label = this.$t('C25')
                let desc1 =
                    this.orderDetails.outType == 1
                        ? this.$t([
                              `提交转出申请成功，可立即购买股票`,
                              `提交轉出申請成功，立即可以購買股票`,
                              `Redemption of success It can buy stock immediately`
                          ])
                        : this.$t([
                              `快速转出成功，资金到达证券账户`,
                              `快速轉出成功，資金到達證券賬戶`,
                              `Redemption（Fast）of success, Deposit to uSMART Account`
                          ])
                if (this.orderDetails.outType == 2) {
                    this.successHide = false
                    this.orderDetails.recordTypeName = this.$t('C19')
                }
                this.stepOne.label = desc1
                this.stepOne.time = dayjs(this.orderDetails.createTime).format(
                    'YYYY-MM-DD HH:mm:ss'
                )
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
.block__account--fund-name {
    display: flex;
    justify-content: space-between;
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
    .block__fund-name {
        display: flex;
        justify-content: space-between;
        padding: 12px;
    }
}
</style>
