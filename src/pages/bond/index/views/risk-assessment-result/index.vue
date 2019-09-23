<template lang="pug">
    yx-container-better(v-show="isShowPage")
        .risk-assessment-result-wrapper(slot="main")
            .risk-result__hd
                p 您的风评结果为：
            .risk-result__md {{ assessmentType  }}
            .risk-result__bd 上次风评日期：{{ assessmentTime | date-format('YYYY年MM月DD日') }}
        van-button(
            type="info"
            slot="bottom"
            class="foot-button"
            text="重新测评"
            :disabled="!isDisabled"
            @click="handleAction"
        )
</template>

<script>
import riskAssessmentResultMixin from '@/mixins/bond/risk-assessment-result/index.js'
export default {
    mixins: [riskAssessmentResultMixin]
}
</script>

<style lang="scss" scoped>
.risk-assessment-result-wrapper {
    min-height: 100%;
    background-color: #fff;
    text-align: center;
    .risk-result__hd {
        padding: 60px 0 8px;
        color: rgba(25, 25, 25, 0.5);
        font-size: 0.24rem;
        line-height: 24px;
        text-align: center;
    }
    .risk-result__md {
        color: #2f79ff;
        font-size: 0.48rem;
        line-height: 1;
    }
    .risk-result__bd {
        margin-top: 17px;
        color: rgba(25, 25, 25, 0.3);
        font-size: 0.24rem;
        line-height: 24px;
    }
}
</style>
