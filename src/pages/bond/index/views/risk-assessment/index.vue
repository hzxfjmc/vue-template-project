<template lang="pug">
    .risk-assessment-wrapper
        .risk-assessment-tips 友信智投致力于为全球用户提供更好的金融服务，为了给您提供更匹配的金融产品xxxxxxxxxxx
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
        fixed-operate-btn(
            :text="'提交测评' + riskTypeTips"
            :disabled="submitBtnDisabled"
            @click="handleSubmit('submit')"
            :class="{ active: !submitBtnDisabled }"
        )
</template>

<script>
import FixedOperateBtn from '@/pages/bond/index/biz-components/fix-operate-button/index.vue'
import { riskAssessSubject, riskAssessAnswer } from '@/service/user-server.js'
import { RadioGroup, Radio, Panel } from 'vant'
export default {
    name: 'RiskAssessment',
    components: {
        [Panel.name]: Panel,
        [RadioGroup.name]: RadioGroup,
        [Radio.name]: Radio,
        FixedOperateBtn
    },
    async created() {
        // 拉取测评题目
        try {
            let { subject, version } = await riskAssessSubject()
            let jsonSubject = (subject && JSON.parse(subject)) || []
            this.subject =
                jsonSubject.map(subItem => {
                    // 绑定每个题目的选择项
                    subItem.choiceNum = -1
                    return subItem
                }) || []
            this.version = version || 0
            console.log('riskAssessSubject:data:>>> ', subject, version)
        } catch (e) {
            console.log('riskAssessSubject:error:>>>', e)
        }
    },
    data() {
        return {
            subject: [],
            version: 0,
            riskTypeTips: '',
            riskTypeTipsMap: {
                1: '(低风险)',
                2: '(中风险)',
                3: '(高风险)',
                4: '(超高风险)',
                5: '(最高风险)'
            },
            submitBtnDisabled: true
        }
    },
    methods: {
        // 提交测试题目
        async handleSubmit(action) {
            if (this.submitBtnDisabled) return
            try {
                // 构造提交数据
                let serializeData = this.subject.map(subjectItem => {
                    return {
                        subjectNum: subjectItem.num,
                        optionNum: subjectItem.choiceNum
                    }
                })
                let submitFlag = false
                if (action === 'submit') {
                    submitFlag = true
                }
                let { assessResult } = await riskAssessAnswer({
                    submitFlag,
                    assessOptionParams: serializeData,
                    subjectVersion: this.version
                })
                this.riskTypeTips = this.riskTypeTipsMap[assessResult]
                // 点击提交按钮时候，才进行跳转
                if (action === 'submit') {
                    if (this.$route.query.id) {
                        this.$router.push({
                            path: '/risk-appropriate-result',
                            query: {
                                id: this.$route.query.id
                            }
                        })
                    } else {
                        // 如果不存在 id 等参数，说明是直接从测评结果页跳转的，测试完成，需要跳转回去
                        this.$router.push({
                            path: '/risk-assessment-result'
                        })
                    }
                }
                console.log('riskAssessAnswer:data:>>> ', assessResult)
            } catch (e) {
                console.log('riskAssessAnswer:error:>>>', e)
            }
        }
    },
    watch: {
        subject: {
            handler() {
                // 只要有一个等于-1，那么说明还有没有选择的题目
                let isAllSelected = !this.subject.some(
                    item => item.choiceNum === -1
                )
                if (isAllSelected) {
                    this.submitBtnDisabled = false
                    this.handleSubmit()
                } else {
                    this.submitBtnDisabled = true
                }
            },
            deep: true
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
    .fix-operate-btn.active {
        background-color: #ffbf32;
    }
}
</style>
