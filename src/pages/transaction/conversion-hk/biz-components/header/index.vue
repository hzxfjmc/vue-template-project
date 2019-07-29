<template lang="pug">
.header-container.full-height.flex-fixed.conversion-hk
    yx-step.header-step(:data="[$t('brokerInformation'), $t('stockInformation'), $t('confirmation')]" :active="step")
    keep-alive
        router-view
</template>

<script>
import yxStep from '@/components/yx-step'
export default {
    i18n: {
        zhCHT: {
            brokerInformation: '填寫信息',
            stockInformation: '股票信息',
            confirmation: '確認信息'
        },
        zhCHS: {
            brokerInformation: '填写信息',
            stockInformation: '股票信息',
            confirmation: '确认信息'
        },
        en: {
            brokerInformation: 'Broker Information',
            stockInformation: 'Stock',
            confirmation: 'confirmation'
        }
    },
    components: {
        yxStep
    },
    computed: {
        step() {
            return parseInt(this.$route.params.step) || 0
        }
    }
}
</script>

<style lang="scss">
.conversion-hk {
    .step-box .step-item.active p {
        color: $hk-primary-color;
    }
    .step-box .step-item.active .dot {
        background: $hk-primary-color;
    }
    .step-box .step-item p {
        white-space: nowrap;
    }
}
</style>
