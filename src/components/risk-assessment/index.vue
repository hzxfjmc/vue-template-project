<template lang="pug">
    .risk-assessment-wrapper
        .risk-assessment-tips {{$t('riskAssessmentTips')}}
        .risk-assessment-form
            van-panel(
                v-for="(subjectItem, subjectIndex) in subject"
                :key="subjectIndex"
                :title="subjectItem.title_cn"
            )
                van-radio-group(v-model="subjectItem.choiceNum")
                    van-cell-group
                        van-cell(
                            v-for="(optionItem, optionindex) in subjectItem.option"
                            :key="optionindex"
                            :title="optionItem.text_cn"
                            clickable
                            @click="subjectItem.choiceNum = optionItem.num"
                        )
                            van-radio(slot="right-icon" :name="optionItem.num")
                                i.iconfont(
                                    slot="icon"
                                    slot-scope="props"
                                    :class="props.checked ? 'icon-selected' : 'icon-unchecked'"
                                )
                .has-child-container(v-if="[6,7].includes(subjectIndex)")
                    van-panel(
                        v-for="(subjectItem1, subjectIndex) in subjectItem.subject"
                        :key="subjectIndex"
                        :title="subjectItem1.title_cn"
                    )
                        van-radio-group(v-model="subjectItem1.choiceNum")
                            van-cell-group
                                van-cell(
                                    v-for="(optionItem, optionindex) in subjectItem1.option"
                                    :key="optionindex"
                                    :title="optionItem.text_cn"
                                    clickable
                                    @click="subjectItem1.choiceNum = optionItem.num"
                                )
                                    van-radio(slot="right-icon" :name="optionItem.num")
                                        i.iconfont(
                                            slot="icon"
                                            slot-scope="props"
                                            :class="props.checked ? 'icon-selected' : 'icon-unchecked'"
                                        )

        fixed-operate-btn(
            :text="$t('btnText')"
            :disabled="submitBtnDisabled"
            @click="handleSubmit('submit')"
            :class="{ active: !submitBtnDisabled }"
        )
</template>

<script>
import riskAssessmentMixin from '@/mixins/bond/risk-assessment/index.js'
export default {
    mixins: [riskAssessmentMixin],
    i18n: {
        zhCHS: {
            riskAssessmentTips:
                '友信智投致力于为全球用户提供更好的个人金融服务，为了给您提供更匹配的金融产品和服务，了解您的风险能力和偏好是非常必要的',
            btnText: '提交测评'
        },
        zhCHT: {
            riskAssessmentTips:
                '友信智投致力於為全球用戶提供更好的個人金融服務，為了給您提供更匹配的金融產品和服務，了解您的風險能力和偏好是非常必要的',
            btnText: '提交測評'
        },
        en: {
            riskAssessmentTips:
                'Friendship Intelligence Investment is committed to providing better personal financial services for global users. In order to provide you with more matching financial products and services, it is necessary to understand your risk capabilities and preferences.',
            btnText: 'Submit'
        }
    }
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
