<template lang="pug">
    yx-container-better
        .risk-assessment-wrapper(slot="main")
            .risk-assessment-tips 友信智投致力于为全球用户提供更好的个人金融服务，为了给您提供更匹配的金融产品和服务，了解您的风险能力和偏好是非常必要的
            .risk-assessment-form
                van-panel(
                    v-for="(subjectItem, subjectIndex) in subject"
                    :key="subjectIndex"
                    :title="subjectItem.num + '、' + subjectItem.title"
                )
                    van-radio-group(v-model="subjectItem.choiceNum")
                        van-cell-group
                            van-cell(
                                v-for="(optionItem, optionindex) in subjectItem.option"
                                :key="optionindex"
                                :title="optionItem.text"
                                clickable
                                @click="subjectItem.choiceNum = optionItem.num"
                            )
                                van-radio(slot="right-icon" :name="optionItem.num")
                                    i.iconfont(
                                        slot="icon"
                                        slot-scope="props"
                                        :class="props.checked ? 'icon-selected' : 'icon-unchecked'"
                                    )
        van-button(
            type="info"
            slot="bottom"
            class="foot-button"
            :text="'提交测评' + riskTypeTips"
            :disabled="submitBtnDisabled"
            @click="handleSubmit('submit')"
            :class="{ active: !submitBtnDisabled }"
        )
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
    background: rgba(#191919, 0.05);
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
}
.foot-button.active {
    background-color: $sell-color;
    border-color: $sell-color;
}
</style>
