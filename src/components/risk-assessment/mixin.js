import YxContainerBetter from '@/components/yx-container-better'
import {
    riskAssessSubject,
    riskAssessAnswer,
    riskAssessResult
} from '@/service/user-server.js'

import { RadioGroup, Radio, Panel } from 'vant'
export default {
    name: 'RiskAssessment',
    components: {
        [Panel.name]: Panel,
        [RadioGroup.name]: RadioGroup,
        [Radio.name]: Radio,
        YxContainerBetter
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
    methods: {
        // 提交测试题目
        async handleSubmit() {
            if (!this.submitBtnDisabled && this.canSubmit) return
            this.canSubmit = true
            try {
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
                    console.log(this.showEasyCustomer)
                } else {
                    this.jumpToResult()
                }
            } catch (e) {
                this.canSubmit = false
                console.log('riskAssessAnswer:error:>>>', e)
            }
        },
        // 获取用户信息
        // async getCurrentUser() {
        //     try {
        //         const res = await getCurrentUser()
        //         this.userInfo = res
        //         console.log(this.userInfo.assessResult, 'assessResult')
        //         if (
        //             this.userInfo.assessResult &&
        //             !this.$route.query.notFirstSubmit
        //         ) {
        //             console.log(this.userInfo.assessResult)
        //             window.location.replace(
        //                 location.origin +
        //                     '/wealth/fund/index.html#/risk-assessment-result'
        //             )
        //             // this.$router.replace({
        //             //     path: '/risk-assessment-result'
        //             // })
        //         }
        //     } catch (e) {
        //         console.log('getCurrentUser:error:>>>', e)
        //     }
        // },
        // 跳转
        jumpToResult() {
            let id = this.$route.query.id
            if (id) {
                let wealthPage = this.$route.query.wealthPage
                let direction = this.$route.query.direction
                if (wealthPage) {
                    let url =
                        window.location.origin +
                        `/wealth/${wealthPage}/index.html#/risk-appropriate-result?id=${id}&direction=${direction}`
                    window.location.replace(url)
                    return
                }

                this.$router.replace({
                    path: '/risk-appropriate-result',
                    query: {
                        id: id,
                        currencyType: this.$route.query.currencyType,
                        fundRiskType: this.$route.query.fundRiskType
                    }
                })
            } else {
                // 如果不存在 id 等参数，说明是直接从测评结果页跳转的，测试完成，直接跳转出去
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
    }
}
