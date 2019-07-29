<template lang="pug">
    .plan-card(
    :style="`background-image:url(/webapp/marketing/my-commission/${imgSelectType}.png)`"
    :class="{'en-plan-card': planLangFlag}"
    )
        .promotion(v-if="isFree && !current") {{$t('promotionInfo')}}
        .plan-card__top
            .plan-card__title
                | {{packageInfo.title}}
                span {{packageInfo.for}}
            .plan-card__status(v-if="current && $i18n.lang !== 'en'") {{$t('inEffect')}}
        .plan-card__bottom
            .plan-card__info
                p(v-for="item in packageInfo.list") {{item}}
                p.plan-card__effdate(v-if="packageInfo.expirationDate && hideEffectDate(package.effDate)") {{packageInfo.expirationDate(package.effDate)}}
            template(v-if="!current")
                .plan-card__button(
                v-if="(package.enable && !isSelected) || (package.existCoupon === 0 && !isSelected)"
                @click="userPackageSwitch"
                :class="{'text-yellow': isFree}"
                ) {{ isFree && !package.effDate ? $t(`useNow`) : $t('selectInfo') }}
                .plan-tip(
                v-else-if="isSelected"
                ) {{$t(`hasChanged`)}}
                .plan-tip(
                v-else-if="package.existCoupon === 1"
                @click="getCommissionHandler"
                ) {{$t(`getCommissionNow`)}}>>
                .plan-tip(
                v-else-if="package.existCoupon === null"
                ) {{$t(`nextMonthChange`)}}
</template>

<script>
function formatterDate(time) {
    if (!time) {
        return ''
    }
    let mouthMap = {
        '01': 'January',
        '02': 'February',
        '03': 'March',
        '04': 'April',
        '05': 'May',
        '06': 'June',
        '07': 'July',
        '08': 'August',
        '09': 'September',
        '10': 'October',
        '11': 'November',
        '12': 'December'
    }
    let timeArr = time.split('-')
    let year = timeArr[0]
    let mouth = timeArr[1]
    let day = timeArr[2]
    return `${day} ${mouthMap[mouth]},${year}`
}
import {
    userPackageSwitch,
    userPackageHomeSwitchTip,
    userCouponConditionList,
    couponUse
} from '@/service/product-server.js'

// const FROM = {
//     INLAND: 1,
//     HK: 2
// }
const CODE = {
    INLAND_US: '0000',
    HK_US: '1111',
    INLAND_FREE: '2222',
    INLAND_JIETI: '4444',
    HK_FREE: '6666',
    HK_BIAOZHUN: '7777',
    HK_JIETI: '5555'
}
export default {
    i18n: {
        zhCHT: {
            useNow: '立即使用',
            promotionInfo: '優惠計劃',
            getCommissionNow: `立即獲取`,
            hasChanged: `已選擇，尚未生效`,
            nextMonthChange: `下個月可切換`,
            longChangeMessage: `<br>本月無法再切換其他基本計劃`,
            noCouponTip: `很抱歉，根據優惠券規則你暫時無法使用優惠，你可以在獎品中心查看詳情。`,
            okButtonText: `確定`,
            know: '確定',
            freeMessage: `計劃有效期不足，是否選擇使用一張免佣卡？<br>使用後將在下一個交易日生效`,
            effectNextDayText: key =>
                `是否確定切換為${key}？<br>切換後下一個交易日生效`,
            hasChangedToast: `已提交切換<br>將在下一個交易日生效`,
            selectInfo: '選擇',
            inEffect: '已選擇',
            cancelButton: '取消',
            sorryToConfirm:
                '很抱歉，由於所選計劃的有效期不足一天，因此無法切換。如有任何疑問請與客戶服務聯絡。',
            [CODE.INLAND_US]: {
                title: '標準計劃',
                list: [
                    `佣金：0美元/股`,
                    `最低佣金：0美元/筆`,
                    `平台使用費：0.005美元/股`
                ]
            },
            [CODE.INLAND_FREE]: {
                title: '免佣計劃',
                list: [
                    `佣金： 0.00%`,
                    `最低佣金：0港元/筆`,
                    `平台使用費：12港元/筆`
                ],
                expirationDate: key => `有效期至:${key}`
            },
            [CODE.INLAND_JIETI]: {
                title: '免平台费计划',
                list: [
                    `平台使用费：0港元/笔`,
                    `佣金： 0.02%~0.08%`,
                    `最低佣金：0~5港元/笔`
                ]
            },
            [CODE.HK_US]: {
                title: '一世免佣計劃',
                list: [
                    `佣金：0.00%`,
                    `最低佣金：美元$0/筆`,
                    `平台使用費：美元$0.005/股`,
                    `最低平台使用費：美元$1.5/筆`,
                    `交收費：美元$0.003/股`
                ]
            },
            [CODE.HK_FREE]: {
                title: '免佣免平台費計劃',
                list: [
                    `佣金： 0.00%`,
                    `最低佣金：港幣$0/筆`,
                    `平台使用費： 港幣$0/筆`
                ],
                expirationDate: key => `有效期至:${key}`
            },
            [CODE.HK_BIAOZHUN]: {
                title: '一世免佣計劃',
                list: [
                    `佣金： 0.00%`,
                    `最低佣金：港幣$0/筆`,
                    `平台使用費： 港幣$12/筆`
                ]
            },
            [CODE.HK_JIETI]: {
                title: '一世免平台費計劃',
                list: [
                    `按客戶賬戶總資產值計算`,
                    `總資產值港幣十萬元以下，0.05% 佣金`,
                    `總資產值港幣十萬元或以上，0.03% 佣金`,
                    `最低佣金：港幣$1/筆`,
                    `平台使用費：港幣$0/筆`
                ]
            },
            basicPlanTip: key => `切换后将在第二天生效<br>是否确认切换至${key}`
        },
        zhCHS: {
            useNow: '立即使用',
            promotionInfo: '特价资费',
            getCommissionNow: `立即获得`,
            hasChanged: `已选择未生效`,
            nextMonthChange: `下个月可切换`,
            longChangeMessage: `<br>且本月内将无法再次切换成其他基础计划`,
            noCouponTip: `很抱歉，因优惠券使用规则您暂时无法使用，您可以在奖励中心查看详情。`,
            okButtonText: `好的`,
            know: '知道了',
            freeMessage: `有效期不足，是否使用一张佣金卡？<br>切换后将在第二天生效`,
            effectNextDayText: key =>
                `是否切换至${key}？<br>切换后将在第二天生效`,
            hasChangedToast: `已提交切换<br>预计第二天内生效`,
            selectInfo: '选择',
            inEffect: '生效中',
            cancelButton: '取消',
            sorryToConfirm:
                '很抱歉，因您的计划有效期不足一天，若切换则第二天无法生效，所以您无法切换，如有疑问请联系客服。',
            [CODE.INLAND_US]: {
                title: '标准计划',
                list: [
                    `佣金：0美元/股`,
                    `最低佣金：0美元/笔`,
                    `平台使用费：0.005美元/股`
                ]
            },
            [CODE.INLAND_FREE]: {
                title: '免佣计划',
                list: [
                    `佣金： 0.00%`,
                    `最低佣金：0港元/笔`,
                    `平台使用费：12港元/笔`
                ],
                expirationDate: key => `有效期至:${key}`
            },
            [CODE.INLAND_JIETI]: {
                title: '免平台费计划',
                list: [
                    `平台使用费：0港元/笔`,
                    `佣金： 0.02%~0.08%`,
                    `最低佣金：0~5港元/笔`
                ]
            },
            [CODE.HK_US]: {
                title: '一世免佣计划',
                list: [
                    `佣金：0.00%`,
                    `平台使用费：0.005美元/股`,
                    `最低平台使用费：1.5美元/笔`,
                    `交收费：0.003美元/股`
                ]
            },
            [CODE.HK_FREE]: {
                title: '免佣免平台费计划',
                list: [
                    `佣金： 0.00%`,
                    `最低佣金：0港元/笔`,
                    `平台使用费： 0港元/笔`
                ],
                expirationDate: key => `有效期至:${key}`
            },
            [CODE.HK_BIAOZHUN]: {
                title: '一世免佣计划',
                list: [
                    `佣金： 0.00%`,
                    `最低佣金：0港元/笔`,
                    `平台使用费： 12港元/笔`
                ]
            },
            [CODE.HK_JIETI]: {
                title: '一世免平台费计划',
                list: [
                    `根据账户总资产梯度收取佣金`,
                    `总资产 10万HKD以下：0.05%`,
                    `总资产 10万HKD以上：0.03%`,
                    `最低佣金：1港元/笔`,
                    `平台使用费：0港元/笔`
                ]
            },
            basicPlanTip: key => `切换后将在第二天生效<br>是否确认切换至${key}`
        },
        en: {
            useNow: 'USE NOW',
            promotionInfo: 'PROMOTION',
            getCommissionNow: `GET IT NOW`,
            hasChanged: `Selected yet ineffective`,
            nextMonthChange: `Switchable by next month`,
            longChangeMessage: `<br>You cannot switch to other regular plan within this month`,
            noCouponTip: `We are sorry. The voucher cannot be applied in this case, please check for details in Rewards Centre.`,
            okButtonText: `CONFIRM`,
            know: 'CONFIRM',
            freeMessage: `The plan is going to expire, do you wish to use a Commission Voucher instead? <br>The changes will be effective from the next transaction day.`,
            effectNextDayText: key =>
                `Confirm to swtich to ${key}？<br>New plan will be effective on the next transaction day`,
            hasChangedToast: `Switch confirmed,<br>the changes will be effective from the next transaction day.`,
            selectInfo: 'SELECT',
            inEffect: 'SELECTED',
            cancelButton: 'CANCEL',
            sorryToConfirm:
                'We are sorry. You cannot switch to the selected plan as it is going to expire. For enquiries, please contact our customer service.',
            [CODE.INLAND_US]: {
                title: '标准计划',
                list: [
                    `佣金：0美元/股`,
                    `最低佣金：0美元/笔`,
                    `平台使用费：0.005美元/股`
                ]
            },
            [CODE.INLAND_FREE]: {
                title: '免佣计划',
                list: [
                    `佣金： 0.00%`,
                    `最低佣金：0港元/笔`,
                    `平台使用费：12港元/笔`
                ],
                expirationDate: key => `有效期至:${key}`
            },
            [CODE.INLAND_JIETI]: {
                title: '免平台费计划',
                list: [
                    `平台使用费：0港元/笔`,
                    `佣金： 0.02%~0.08%`,
                    `最低佣金：0~5港元/笔`
                ]
            },
            [CODE.HK_US]: {
                title: 'Lifetime $0 commission',
                list: [
                    `Commission rate: 0.00%`,
                    `Min commission: HK$0/ transaction`,
                    `Platform usage fee: US$0.005/ shares`,
                    `Min platform usage fee: US$1.5/ transaction`,
                    `Settlement fee: US$0.003/ shares`
                ]
            },
            [CODE.HK_FREE]: {
                title: '$0 Commission and $0 Platform fee',
                list: [
                    `Commission rate: 0.00%`,
                    `Min commission: HK$0/ transaction`,
                    `Platform usage fee: HK$0`
                ],
                expirationDate: key => `Expiry date:${formatterDate(key)}`
            },
            [CODE.HK_BIAOZHUN]: {
                title: 'Lifetime $0 commission',
                list: [
                    `Commission rate: 0.00%`,
                    `Min commission: HK$0/ transaction`,
                    `Platform usage fee: HK$12/ transaction`
                ]
            },
            [CODE.HK_JIETI]: {
                title: 'Lifetime $0 platform fee',
                list: [
                    `Commission rate varies based on customer's total account asset:`,
                    `Valued below HK$100,000, 0.05% commission rate`,
                    `Valued at HK$100,000 or above, 0.03% commission rate`,
                    `Min commission: HK$1/ transaction`,
                    `Platform usage fee: HK$0/ transaction`
                ]
            },
            basicPlanTip: key => `切换后将在第二天生效<br>是否确认切换至${key}`
        }
    },
    props: {
        current: {
            type: Boolean,
            default: false
        },
        attribution: {
            type: Boolean,
            default: false
        },
        package: {
            type: Object,
            default: () => {}
        },
        currentSelectCode: {
            type: String,
            default: ''
        },
        planLangFlag: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        imgSelectType() {
            if (this.isFree) {
                return 'cur-free'
            }
            /* if (this.isFree && this.current) {
                return 'cur-free'
            }
            else if (this.isFree && !this.current) {
                return 'no-commission'
            } */
            return 'commission'
        },
        packageInfo() {
            return this.$t(this.package.packageCode) || {}
        },
        isSelected() {
            return this.package.packageCode === this.currentSelectCode
        },
        isFree() {
            return (
                [CODE.INLAND_FREE, CODE.HK_FREE].indexOf(
                    this.package.packageCode
                ) > -1
            )
        }
    },
    methods: {
        getCommissionHandler() {
            window.location.href = `/webapp/marketing/recruit-new${
                this.attribution ? '-ch' : ''
            }.html?register-ct=wdyj-sj&register-cid=${
                this.attribution ? 1000003 : 1000001
            }#/index`
        },
        async userPackageSwitch() {
            try {
                let offDate =
                    new Date().getTime() -
                    new Date(this.package.effDate).getTime()
                // 免佣套餐
                // 免佣卡不在有效期内
                if (this.isFree && !this.package.effDate) {
                    await this.$confirm({
                        message: this.$t(`freeMessage`),
                        className: 'round-confirm',
                        cancelButtonText: this.$t('cancelButton'),
                        confirmButtonText: this.$t(`okButtonText`)
                    })
                    let { list } = await userCouponConditionList({
                        couponType: 3,
                        selectType: 1,
                        activated: 2
                    })
                    if (list.length > 0) {
                        // 有权
                        let { couponBusinessId } = list[0]
                        try {
                            await couponUse({ businessId: couponBusinessId })
                        } catch (e) {
                            this.$confirm({
                                message: this.$t(`noCouponTip`),
                                className: 'round-confirm',
                                showCancelButton: false,
                                confirmButtonText: this.$t('know')
                            })
                            return
                        }
                    } else {
                        this.$toast(this.$t(`noFreeCoupon`))
                        return
                    }
                } else if (this.isFree && offDate > 0) {
                    this.$confirm({
                        message: this.$t('sorryToConfirm'),
                        className: 'round-confirm',
                        showCancelButton: false,
                        confirmButtonText: this.$t('know')
                    })
                    return
                } else {
                    let message = this.$t(
                        `effectNextDayText`,
                        this.packageInfo.title
                    )

                    // 基础套餐提示和佣金计划不一样
                    if (!this.isFree) {
                        message = this.$t(
                            `basicPlanTip`,
                            this.packageInfo.title
                        )
                    }
                    await this.$confirm({
                        message: message,
                        className: 'round-confirm',
                        cancelButtonText: this.$t('cancelButton'),
                        confirmButtonText: this.$t(`okButtonText`)
                    })
                    await userPackageSwitch(this.package.packageCode)
                }
                this.$emit('change-plan')
                this.$toast(this.$t(`hasChangedToast`), 'top', {
                    type: 'html',
                    className: 'toast-like-ios'
                })
            } catch (e) {
                e.msg && this.$toast(e.msg)
            }
        },
        userPackageHomeSwitchTip() {
            userPackageHomeSwitchTip()
        },
        //有效期超过2050年不显示文案
        hideEffectDate(_date) {
            if (!_date) {
                return false
            }
            if (new Date('2050-01-01') - new Date(_date) > 0) {
                return true
            } else {
                return false
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.plan-card {
    position: relative;
    width: 100%;
    height: 156px;
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
    padding: 16px;
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-top: $global-padding;
    overflow: hidden;
    .promotion {
        position: absolute;
        display: inline-block;
        width: 150px;
        height: 20px;
        line-height: 20px;
        font-size: 12px;
        text-align: center;
        background-color: #ff6f14;
        right: -42px;
        top: 12px;
        transform: rotate(30deg);
    }
    .plan-card__top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 5px;
        .plan-card__title {
            font-size: 24px;
            font-weight: 500;
            span {
                font-size: 10px;
                line-height: 14px;
                padding-left: 5px;
            }
        }
        .plan-card__status {
            border: 1px solid #fff;
            padding: 3px 10px;
            border-radius: 20px;
            font-size: 12px;
        }
    }
    .plan-card__bottom {
        font-size: 10px;
        line-height: 17px;
        color: rgba(255, 255, 255, 0.8);
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        .plan-card__info {
            flex: 1;
            .plan-card__effdate {
                font-size: 0.16rem;
                color: rgba(255, 255, 255, 0.6);
            }
        }
        .plan-card__button {
            height: 28px;
            width: 84px;
            background-color: #fff;
            color: $hk-primary-color;
            text-align: center;
            line-height: 28px;
            font-size: 14px;
            border-radius: 28px;
        }
        .plan-tip {
            font-size: 16px;
            color: #fff;
        }
        .text-yellow {
            color: #ff6d2d;
        }
    }
}
//英文和繁体特定样式
.en-plan-card {
    height: auto;
    background-size: 100% 100%;
    .plan-card__bottom {
        flex-direction: column;
        align-items: flex-start;
        .plan-card__button,
        .plan-tip {
            align-self: flex-end;
        }
    }
}
</style>
