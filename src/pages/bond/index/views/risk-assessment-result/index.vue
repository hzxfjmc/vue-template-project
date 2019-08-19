<template lang="pug">
    .risk-assessment-result-wrapper(v-show="isShowPage")
        .risk-result__header
            p 您的风评结果为：
        .risk-result__content
            .risk-cell
                span {{ riskTypeList[userRiskLevel] && riskTypeList[userRiskLevel] || '--'  }}
        fixed-operate-btn(
            :text="btnText"
            @click="handleAction"
        )
</template>

<script>
import FixedOperateBtn from '@/pages/bond/index/biz-components/fix-operate-button/index.vue'
import { riskAssessResult } from '@/service/user-server.js'
export default {
    name: 'RickWarning',
    components: {
        FixedOperateBtn
    },
    created() {
        // 等待预定请求完成后，执行下一步操作
        this.handleSetupResult()
    },
    data() {
        return {
            riskMatchResult: 1, // 风险匹配结果
            riskTypeList: {
                // 风险等级列表
                100: '--',
                0: '尚未风评',
                1: '低风险',
                2: '中风险',
                3: '高风险',
                4: '超高风险',
                5: '最高风险'
            },
            userRiskLevel: 0, // 用户风险测评等级
            btnText: '',
            isShowPage: false
        }
    },
    methods: {
        // 将多个异步聚合为同步
        async handleSetupResult() {
            await Promise.all([this.handleRiskAssessResult()])
            if (this.userRiskLevel === 0) {
                // 尚未风评
                this.riskMatchResult = 1
                this.btnText = '开始测评'
            } else if (this.userRiskLevel < this.bondRiskLevel) {
                // 风评级别不够
                this.riskMatchResult = 2
                this.btnText = '重新测评'
            } else {
                // 风评级别够了，可以购买
                this.riskMatchResult = 3
                this.btnText = '确认'
            }
            this.isShowPage = true
        },
        // 拉取风险测评结果
        async handleRiskAssessResult() {
            try {
                let { assessResult } = await riskAssessResult()
                this.userRiskLevel = 2 || 0 // 用户风险测评等级
                console.log('riskAssessResult:data:>>> ', assessResult)
            } catch (error) {
                console.log('riskAssessResult:error:>>>', error)
            }
        },
        // 操作按钮
        handleAction() {
            // 跳转到风险测评
            this.$router.push({
                path: '/risk-assessment'
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.risk-assessment-result-wrapper {
    padding-bottom: 48px;
    .risk-result__header {
        padding-top: 20px;
        p {
            color: #393939;
            font-size: 0.24rem;
            opacity: 0.4;
            line-height: 24px;
            text-align: center;
        }
    }
    .risk-result__content {
        margin: 14px 14px 10px;
        padding: 20px 0;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 2px 6px 0px rgba(57, 57, 57, 0.05);
        border-radius: 6px;
        .risk-cell {
            display: flex;
            margin-bottom: 20px;
            padding: 0 14px;
            font-size: 0.28rem;
            line-height: 24px;
            span {
                opacity: 0.6;
            }
        }
    }
}
</style>
