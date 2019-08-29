<template lang="pug">
    span 订单记录
</template>

<script>
import riskAssessmentMixin from '@/mixins/bond/risk-assessment/index.js'
export default {
    mixins: [riskAssessmentMixin]
}
</script>

<style lang="scss" scoped>
.risk-assessment-wrapper {
    padding-bottom: 48px;
    .risk-assessment-tips {
        padding: 5px 8px 5px 12px;
        background: rgba(255, 172, 79, 0.2);
        color: #dda16b;
        font-size: 0.28rem;
        line-height: 20px;
    }
    .risk-assessment-form {
        .van-panel {
            margin-bottom: 10px;
            padding-bottom: 10px;
        }
        .van-cell {
            &:after {
                display: none;
            }
            padding: 14px 14px 10px 12px;
            font-size: 0.28rem;
            line-height: 24px;
        }
        .van-panel__header {
            &:after {
                display: none;
            }
        }
        .van-panel__content {
            .van-cell {
                padding: 10px 12px;
            }
            .van-cell__title {
                color: rgba(#393939, 0.6) !important;
            }
        }
        .van-hairline--top-bottom::after {
            display: none;
        }
        .icon-selected {
            color: $primary-color-line;
        }
        .icon-unchecked {
            opacity: 0.4;
        }
        .icon-unchecked,
        .icon-selected {
            font-size: 0.32rem;
        }
    }
    .fix-operate-btn.active {
        background-color: $sell-color;
    }
}
</style>
