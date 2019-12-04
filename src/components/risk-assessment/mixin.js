import YxContainerBetter from '@/components/yx-container-better'
import {
    riskAssessSubject,
    riskAssessAnswer,
    riskAssessResult
} from '@/service/user-server.js'
import { mapGetters } from 'vuex'

import { RadioGroup, Radio, Panel } from 'vant'
export default {
    name: 'RiskAssessment',
    components: {
        [Panel.name]: Panel,
        [RadioGroup.name]: RadioGroup,
        [Radio.name]: Radio,
        YxContainerBetter
    },
    async created() {
        // 拉取测评题目
        try {
            let { subject, version } = await riskAssessSubject()
            let jsonSubject = (subject && JSON.parse(subject)) || []
            this.subject =
                jsonSubject.map(subItem => {
                    // 绑定每个题目的选择项
                    if (subItem.subject) {
                        subItem.subject.map(i => {
                            i.choiceNum = -1
                        })
                    } else {
                        subItem.choiceNum = -1
                    }

                    return subItem
                }) || []
            this.version = version || 0
        } catch (e) {
            console.log('riskAssessSubject:error:>>>', e)
        }
    },
    data() {
        return {
            subject: [],
            version: 0,
            submitBtnDisabled: true,
            userInfo: '',
            showEasyCustomer: false,
            assessDefinition: '',
            canSubmit: false
        }
    },
    computed: {
        ...mapGetters(['appType']),
        // 跳转路由前缀，为 hk 使用
        prev() {
            return this.appType.Hk ? '/hk' : ''
        },
        titleI18n() {
            return {
                zhCHS: 'title_cn',
                zhCHT: 'title_hk',
                en: 'title_us'
            }[this.$i18n.lang]
        },
        textI18n() {
            return {
                zhCHS: 'text_cn',
                zhCHT: 'text_hk',
                en: 'text_us'
            }[this.$i18n.lang]
        }
    },
    methods: {
        // 提交测试题目
        async handleSubmit() {
            if (!this.submitBtnDisabled && this.canSubmit) return
            this.canSubmit = true
            try {
                this.$loading()
                // 构造提交数据
                let serializeData = this.subject.map(subjectItem => {
                    if (subjectItem.subject) {
                        let arr = []
                        // 有子题目
                        subjectItem.subject.map(i => {
                            arr.push({
                                subjectNum: i.num,
                                optionNum: i.choiceNum
                            })
                        })
                        return arr
                    } else {
                        return {
                            subjectNum: subjectItem.num,
                            optionNum: subjectItem.choiceNum
                        }
                    }
                })

                // 提交测评
                let { assessResult } = await riskAssessAnswer({
                    submitFlag: true,
                    assessOptionParams: serializeData,
                    subjectVersion: this.version
                })
                console.log(assessResult)

                // 拉取风险测评结果
                let res = await riskAssessResult()
                this.assessDefinition = res.assessDefinition
                if (res.damagedStatus === 1) {
                    this.showEasyCustomer = true
                } else {
                    this.jumpToResult()
                }
            } catch (e) {
                this.canSubmit = false
                if (e.msg) {
                    await this.$toast(e.msg)
                }
                console.log('riskAssessAnswer:error:>>>', e)
            } finally {
                this.$close()
            }
        },
        // 跳转
        jumpToResult() {
            let id = this.$route.query.id,
                strategyId = this.$route.query.strategyId, //策略跟投参数
                versionId = this.$route.query.versionId, //策略跟投参数
                direction = this.$route.query.direction, // 只有债券才有这个参数
                path = '/risk-appropriate-result',
                query = {
                    // 默认传输基金参数
                    id,
                    currencyType: this.$route.query.currencyType,
                    fundRiskType: this.$route.query.fundRiskType
                }
            // App 风险测评菜单进入：
            // 1、/wealth/fund/index.html#/risk-assessment-result
            // 2、/wealth/fund/index.html#/risk-assessment

            // 基金
            // H5 产品适当性匹配进入：
            // 1、/wealth/fund/index.html#/risk-appropriate-result
            // 2、/wealth/fund/index.html#/risk-assessment?id=&fundRiskType=

            // 债券
            // H5 产品适当性匹配进入：
            // 1、/wealth/bond/index.html#/risk-appropriate-result
            // 2、/wealth/bond/index.html#/risk-assessment?id=&direction=

            // 债券参数
            if (direction) {
                path = this.prev + path
                query = {
                    id: id,
                    direction
                }
            }

            // 从 H5 进入风评测试
            if (id) {
                this.$router.replace({
                    path,
                    query
                })
            } else if (versionId && strategyId) {
                // 策略跟投
                let url =
                    window.location.origin +
                    `/webapp/stock-king/portfolio.html#/create/${strategyId}/${versionId}`
                window.location.replace(url)
            } else {
                // 如果不存在 id 参数，说明是直接从测评结果页跳转的，测试完成，直接跳转出去
                this.$router.replace({
                    path: '/risk-assessment-result'
                })
            }
        },
        // 关闭弹窗
        closeEasyCustomer() {
            this.closeEasyCustomer = false
            this.jumpToResult()
        }
    },
    watch: {
        subject: {
            handler() {
                // 只要有一个等于-1，那么说明还有没有选择的题目
                let isAllSelected = !this.subject.some(item => {
                    if (item.subject) {
                        let childFlag = item.subject.some(i => {
                            return i.choiceNum === -1
                        })
                        return childFlag
                    } else {
                        return item.choiceNum === -1
                    }
                })
                console.log('isAllSelected-------', isAllSelected)
                if (isAllSelected) {
                    this.submitBtnDisabled = false
                } else {
                    this.submitBtnDisabled = true
                }
            },
            deep: true
        }
    }
}
