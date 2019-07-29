<template lang="pug">
.apply-header.full-height.flex-fixed
    .apply-steps(slot="top")
        .step-box
            template(v-for="step,index in stepList")
                .step(:class="{active: currentStep >= index || step.finish}")
                    span.iconfont(:class="`icon-${step.icon}`" @click="goCurrentStep(step)")
                .step(v-if="index < stepList.length - 1")
        .step-box
            template(v-for="step,index in stepList")
                .step(:class="{active: currentStep >= index || step.finish}")
                    span.step-title {{step.title}}
                .step(
                    v-if="index < stepList.length - 1"
                    :class="{active: currentStep > index || step.finish}"
                    )
                    span
                    .line
    router-view
</template>

<script>
import { getHKOpenAccountInfo } from '@/service/user-account-server-hk.js'
export default {
    i18n: {
        zhCHS: {
            personnalInformation: '个人资料',
            financialInformation: '财务背景',
            employmentInformation: '职业状况',
            declarationInfo: '信息确认',
            pleaseEnterFullInfo: '请先填写完成前面资料'
        },
        zhCHT: {
            personnalInformation: '個人資料',
            financialInformation: '財務背景',
            employmentInformation: '職業狀況',
            declarationInfo: '信息確認',
            pleaseEnterFullInfo: '請先填寫完成前面的資料'
        },
        en: {
            personnalInformation: 'Personal Information',
            financialInformation: 'Financial Information',
            employmentInformation: 'Employment  Information',
            declarationInfo: 'Declaration',
            pleaseEnterFullInfo: 'Please fill in the previous field'
        }
    },
    name: 'apply-header',
    watch: {
        '$route.name'(newName) {
            let curIndex
            this.stepList.some((item, index) => {
                if (item.icon === newName) {
                    return (curIndex = index)
                }
            })
            if (curIndex > 0) {
                this.stepList[curIndex - 1].finish = true
            }
        }
    },
    computed: {
        currentStep() {
            return this.stepList.findIndex(
                item => item.icon === this.$route.name
            )
        }
    },
    async created() {
        try {
            let { infoEditStatus } = await getHKOpenAccountInfo()
            let step = this.transNum(infoEditStatus)
            this.stepList.forEach(item => {
                if (item.step <= step) {
                    item.finish = true
                }
            })
        } catch (e) {
            await this.$toast(e.msg || '网络开小差了,请稍后重试')
            this.$close()
        }
    },
    data() {
        return {
            stepList: [
                {
                    icon: 'personal',
                    title: this.$t('personnalInformation'),
                    finish: false,
                    step: 2
                },
                {
                    icon: 'asset-status',
                    title: this.$t('financialInformation'),
                    finish: false,
                    step: 3
                },
                {
                    icon: 'essential',
                    title: this.$t('employmentInformation'),
                    finish: false,
                    step: 4
                },
                {
                    icon: 'confirm-info',
                    title: this.$t('declarationInfo'),
                    finish: false,
                    step: 5
                }
            ]
        }
    },
    methods: {
        transNum(infoEditStatus) {
            let sum = 1
            for (let i = 1; i <= 6; i++) {
                // 当前完成第几位
                if ((infoEditStatus & sum) === 0) {
                    return i
                }
                sum *= 2
            }
        },
        goCurrentStep(item) {
            // 判断跳转到哪一步
            if (item.finish) {
                this.$router.push(`/step/${item.step}`)
            } else {
                this.$toast(this.$t('pleaseEnterFullInfo'))
            }
        }
    }
}
</script>

<style lang="scss">
.apply-header {
    .apply-steps {
        width: 100%;
        padding: $global-padding;
        .step-box {
            display: flex;
            justify-content: space-between;
            .step {
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                color: $hk-text-color4;
                .step-title {
                    font-size: 0.24rem;
                }
                .iconfont {
                    font-size: 25px;
                }
                .line {
                    width: 33px;
                    height: 1px;
                    background: $hk-text-color4;
                    opacity: 0.2;
                }
            }
            .step.active {
                color: $hk-primary-color;
                .line {
                    background-color: $hk-primary-color;
                    opacity: 1;
                }
            }
        }
    }
}
</style>
