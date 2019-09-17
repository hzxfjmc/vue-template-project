import FixedOperateBtn from '@/biz-components/fix-operate-button/index.vue'
import { riskAssessResult } from '@/service/user-server.js'
import jsBridge from '@/utils/js-bridge.js'

export default {
    name: 'RiskAssessmentResult',
    components: {
        FixedOperateBtn
    },
    created() {
        // 等待预定请求完成后，执行下一步操作
        this.handleSetupResult()
    },
    data() {
        return {
            riskTypeList: {
                // 风险等级列表
                100: '已过期',
                0: '尚未风评',
                1: '低风险',
                2: '中风险',
                3: '高风险',
                4: '超高风险',
                5: '最高风险'
            },
            userRiskLevel: 0, // 用户风险测评等级序号
            assessmentTime: 0, // 上次风评时间
            isShowPage: false,
            showEasyCustomer: false, // 易受损客户弹窗
            assessResultName: '',
            showRemainingNum: false, //剩余次数弹窗
            number: 0 //剩余次数
        }
    },
    computed: {
        // 风评等级
        // assessmentType() {
        //     return this.riskTypeList[this.userRiskLevel]
        // }
    },
    methods: {
        // 将多个异步聚合为同步
        async handleSetupResult() {
            await Promise.all([this.handleRiskAssessResult()])
            if (this.userRiskLevel === 0) {
                // 尚未风评
                this.handleAction()
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
                    assessResultName
                } = await riskAssessResult()
                if (validTime && new Date() > new Date(validTime)) {
                    // 当前时间大于测评有效时间，测评过期
                    this.userRiskLevel = 100
                } else {
                    this.userRiskLevel = assessResult || 0 // 用户风险测评等级
                }
                this.assessmentTime = createTime || 0
                this.assessResultName = assessResultName
                console.log('riskAssessResult:data:>>> ', assessResult)
            } catch (error) {
                console.log('riskAssessResult:error:>>>', error)
            }
        },
        // 操作按钮
        handleAction() {
            this.showRemainingNum = true
        },
        // 点击易受损客户
        showEasyCustomerInfo() {
            this.showEasyCustomer = true
        },
        // 开始测评
        startRiskHandle(number) {
            if (number === 0) {
                this.showRemainingNum = false
            } else {
                // 跳转到风险测评
                this.$router.push({
                    path: '/risk-assessment'
                })
            }
        },
        // 关闭或者拨打客服电话
        callOrCancel(number) {
            if (number === 0) {
                jsBridge.gotoCustomerService()
            } else {
                this.showRemainingNum = false
            }
        }
    }
}
