import FixedOperateBtn from '@/biz-components/fix-operate-button/index.vue'
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
                                id: this.$route.query.id,
                                currencyType: this.$route.query.currencyType
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
