import YxContainerBetter from '@/components/yx-container-better'
import {
    riskAssessResult,
    checkRiskAssessTimes
} from '@/service/user-server.js'
import jsBridge from '@/utils/js-bridge.js'
import dayjs from 'dayjs'
import './remain-dialog.scss'
export default {
    name: 'RiskAssessmentResult',
    components: {
        YxContainerBetter
    },
    async created() {
        // 等待预定请求完成后，执行下一步操作
        await this.handleRiskAssessResult()
        this.handleSetupResult()
    },
    data() {
        return {
            userRiskLevel: 0, // 用户风险测评等级序号
            assessmentTime: 0, // 上次风评时间
            isShowPage: false,
            showEasyCustomer: false, // 易受损客户弹窗
            assessResultName: '',
            showRemainingNum: false, //剩余次数弹窗
            number: 0, //剩余次数
            assessDefinition: '', // 描述
            damagedStatus: 0, //是否容易受损客户 0-否，1-是
            resetTime: '', //重置时间
            isExpried: false // 是否过期
        }
    },
    computed: {
        resetTimes() {
            return {
                zhCHS: dayjs(this.resetTime).format('YYYY年MM月DD日') + '重置',
                zhCHT: dayjs(this.resetTime).format('YYYY年MM月DD日') + '重置',
                en:
                    'Reset on 1st January ' +
                    dayjs(this.resetTime).format('YYYY')
            }[this.$i18n.lang]
        }
    },
    methods: {
        // 将多个异步聚合为同步
        async handleSetupResult() {
            // await Promise.resolve(this.handleRiskAssessResult())
            if (this.userRiskLevel === 0) {
                // 尚未风评
                this.startRiskHandle()
            }
            this.isShowPage = true
        },
        // 拉取风险测评结果
        async handleRiskAssessResult() {
            try {
                let {
                    assessResult,
                    createTime,
                    validTime,
                    assessResultName,
                    assessDefinition,
                    damagedStatus,
                    validCount,
                    resetTime
                } = await riskAssessResult()
                if (validTime && new Date() > new Date(validTime)) {
                    // 当前时间大于测评有效时间，测评过期
                    this.userRiskLevel = 100
                    this.isExpried = true
                } else {
                    this.userRiskLevel = assessResult || 0 // 用户风险测评等级
                }
                this.assessmentTime = createTime || 0
                this.assessResultName = assessResultName
                this.assessDefinition = assessDefinition
                this.damagedStatus = damagedStatus
                this.number = validCount
                this.resetTime = resetTime
                console.log(
                    'riskAssessResult:data:>>> ',
                    assessResult,
                    this.assessResultName
                )
            } catch (error) {
                console.log('riskAssessResult:error:>>>', error)
            }
        },
        // 操作按钮
        async handleAction() {
            if (this.isExpried) {
                // 已过期，直接跳转到风评页面
                this.$router.replace({
                    path: '/risk-assessment',
                    query: {
                        notFirstSubmit: true
                    }
                })
            } else {
                try {
                    let { monthTimes, yearTimes } = await checkRiskAssessTimes()
                    // let monthTimes = 1,
                    //     yearTimes = 1
                    if (yearTimes <= 0) {
                        this.$confirm({
                            className: 'remaining-container',
                            message: `
                            <div class="title center">${this.$t(
                                'leastNum'
                            )} 0 ${this.$t('times')}</div>
                            <div class="years-info">${this.$t(
                                'yearsInfoToCall'
                            )}</div>
                            `,
                            closeOnClickOverlay: true,
                            confirmButtonText: this.$t('toCall'),
                            cancelButtonText: this.$t('toClose')
                        }).then(() => {
                            // 拨打客服电话
                            jsBridge.gotoCustomerService()
                        })
                    } else {
                        if (monthTimes <= 0) {
                            this.$confirm({
                                className: 'remaining-container',
                                message: `
                            <div class="years-info">${this.$t(
                                'leftTimes',
                                monthTimes,
                                yearTimes
                            )}${this.$t('retryNextMonth')}</div>
                            `,
                                showConfirmButton: false,
                                cancelButtonText: this.$t('iKnow'),
                                cancelButtonColor: '#0D50D8',
                                closeOnClickOverlay: true
                            })
                        } else {
                            this.$confirm({
                                className: 'remaining-container',
                                message: `
                            <div class="title">${this.$t(
                                'leftTimes',
                                monthTimes,
                                yearTimes
                            )}</div>
                            <div class="text">${this.$t('timesLimit')}</div>
                            `,
                                confirmButtonText: this.$t('startRisk'),
                                cancelButtonText: this.$t('toCancel'),
                                closeOnClickOverlay: true
                            }).then(() => {
                                // 开始测评
                                // 跳转到风险测评
                                this.$router.push({
                                    path: '/risk-assessment',
                                    query: {
                                        notFirstSubmit: true
                                    }
                                })
                            })
                        }
                    }
                    // this.showRemainingNum = true
                } catch (e) {
                    console.log(e)
                    e.msg && this.$toast(e.msg)
                }
            }
        },
        // 点击易受损客户
        showEasyCustomerInfo() {
            this.showEasyCustomer = true
        },
        // 开始测评或拨打客服电话
        startRiskHandle(number) {
            if (number === 0) {
                jsBridge.gotoCustomerService()
            } else {
                // 跳转到风险测评
                this.$router.push({
                    path: '/risk-assessment',
                    query: {
                        notFirstSubmit: true
                    }
                })
            }
        },
        // 关闭
        callOrCancel() {
            this.showRemainingNum = false
        }
    }
}
