<template lang="pug">
    .risk-assessment-wrapper
        .risk-assessment-tips 友信智投致力于为全球用户提供更好的金融服务，为了给您提供更匹配的金融产品xxxxxxxxxxx
        .risk-assessment-form
            van-panel(
                v-for="(assessmentItem, assessmentIndex) in assessmentFormData"
                :key="assessmentIndex"
                :title="assessmentItem.title"
            )
                van-radio-group(v-model="formData[assessmentItem.key]")
                    van-cell-group
                        van-cell(
                            v-for="(choiceItem, choiceindex) in assessmentItem.choiceList"
                            :key="choiceindex"
                            :title="choiceItem.text"
                            clickable
                            @click="formData[assessmentItem.key]=choiceItem.value"
                        )
                            van-radio(slot="right-icon" :name="choiceItem.value")
                                i.iconfont(
                                    slot="icon"
                                    slot-scope="props"
                                    :class="props.checked ? 'icon-selected' : 'icon-unchecked'"
                                )

        fixed-operate-btn(text="提交测评" disabled="disabled")
</template>

<script>
import FixedOperateBtn from '@/pages/bond/index/biz-components/fix-operate-button/index.vue'
import { RadioGroup, Radio, Panel } from 'vant'
export default {
    name: 'RiskAssessment',
    components: {
        [Panel.name]: Panel,
        [RadioGroup.name]: RadioGroup,
        [Radio.name]: Radio,
        FixedOperateBtn
    },
    data() {
        return {
            radio: '',
            radio2: '',
            assessmentFormData: [
                {
                    key: 'radio1',
                    title: '1、您目前的人生阶段',
                    choiceList: [
                        {
                            text: '退休期',
                            value: 1
                        },
                        {
                            text: '退休前期',
                            value: 2
                        },
                        {
                            text: '家庭成长期',
                            value: 3
                        },
                        {
                            text: '家庭形成期',
                            value: 4
                        },
                        {
                            text: '单身期',
                            value: 5
                        }
                    ]
                },
                {
                    key: 'radio2',
                    title: '2、您目前的人生阶段',
                    choiceList: [
                        {
                            text: '退休期',
                            value: 1
                        },
                        {
                            text: '退休前期',
                            value: 2
                        },
                        {
                            text: '家庭成长期',
                            value: 3
                        },
                        {
                            text: '家庭形成期',
                            value: 4
                        },
                        {
                            text: '单身期',
                            value: 5
                        }
                    ]
                },
                {
                    key: 'radio3',
                    title: '3、您目前的人生阶段',
                    choiceList: [
                        {
                            text: '退休期',
                            value: 1
                        },
                        {
                            text: '退休前期',
                            value: 2
                        },
                        {
                            text: '家庭成长期',
                            value: 3
                        },
                        {
                            text: '家庭形成期',
                            value: 4
                        },
                        {
                            text: '单身期',
                            value: 5
                        }
                    ]
                }
            ],
            formData: {
                radio1: '',
                radio2: '',
                radio3: ''
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.risk-assessment-wrapper {
    padding-bottom: 48px;
    .risk-assessment-tips {
        padding: 12px 20px 11px 14px;
        background-color: rgba(47, 121, 255, 0.0993);
        color: rgba(57, 57, 57, 0.6);
        font-size: 0.24rem;
        line-height: 16px;
    }
    .risk-assessment-form {
        .van-panel {
            margin-bottom: 10px;
            padding-bottom: 12px;
        }
        .van-cell {
            &:after {
                display: none;
            }
            padding: 14px 14px 9px 14px;
            font-size: 0.28rem;
            line-height: 24px;
        }
        .van-panel__header {
            &:after {
                display: none;
            }
            .van-cell__title {
                color: rgba(57, 57, 57, 1) !important;
            }
        }
        .van-panel__content {
            .van-cell {
                padding: 9px 14px;
            }
        }
        .van-hairline--top-bottom::after {
            display: none;
        }
        .icon-selected {
            color: #2f79ff;
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
</style>
