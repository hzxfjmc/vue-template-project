<template lang="pug">
    .risk-assessment-result-wrapper
        .risk-result__header
            i(:type="riskType")
            h2 {{ riskType > 2 ? '匹配' : '不匹配' }}
            p 您的风评取向{{ riskType > 2 ? '适合' : '不适合' }}购买该产品
        .risk-result__content
            .risk-cell
                span 您的风险取向
                strong 稳健型(2)
            .risk-cell
                span 产品风险
                strong 稳健型(3)及以上可购买
        .risk-result__tips
            h2
                i.iconfont.icon-about_icon
                span 什么是风险测评？
            p 您的风评取向不适合购买该产品您的风评取向不适合购买该产品您的风评取向不适合购买该产品
        .risk-agreement
            i.iconfont.icon-selected
            p
                span 我已阅读并知晓债券相关风险，我已阅读
                a(:href="productUrl") 《产品资料》
        fixed-operate-btn(text="开始测评")
</template>

<script>
import FixedOperateBtn from '@/pages/bond/index/biz-components/fix-operate-button/index.vue'
import { riskAssessResult } from '@/service/user-server.js'
import { getBondDetail } from '@/service/finance-info-server.js'
export default {
    name: 'RickWarning',
    components: {
        FixedOperateBtn
    },
    async created() {
        try {
            // 拉取风险测评结果
            let { assessResult } = await riskAssessResult()
            let userRiskLevel = assessResult || 0 // 用户风险测评等级
            console.log('riskAssessResult:data:>>> ', assessResult)

            // 获取债券信息
            let { bondEditableInfo } = await getBondDetail(
                this.$route.query.id - 0
            )
            this.productUrl =
                bondEditableInfo && bondEditableInfo.productOverview // 产品资料url
            let bondRiskLevel =
                (bondEditableInfo &&
                    bondEditableInfo.riskLevel &&
                    bondEditableInfo.riskLevel.type) ||
                0 // 债券风险等级
            console.log('getBondDetail:data:>>> ', bondEditableInfo)

            if (userRiskLevel === 0) {
                // 尚未风评
                this.riskType = 1
            } else if (userRiskLevel <= bondRiskLevel) {
                // 风评级别不够
                this.riskType = 2
            } else {
                // 风评级别够了，可以购买
                this.riskType = 3
            }
        } catch (e) {
            console.log('riskAssessResult:error:>>>', e)
        }
    },
    data() {
        return {
            riskType: 1,
            productUrl: ''
        }
    }
}
</script>

<style lang="scss" scoped>
.risk-assessment-result-wrapper {
    padding-bottom: 48px;
    .risk-result__header {
        padding-top: 20px;
        i {
            display: block;
            width: 90px;
            height: 90px;
            margin: 0 auto;
            &[type='1'],
            &[type='2'] {
                background: url('~@/assets/img/bond/icon-cry.png') center
                    no-repeat;
                background-size: 100%;
            }
            &[type='3'] {
                background: url('~@/assets/img/bond/icon-laugh.png') center
                    no-repeat;
                background-size: 100%;
            }
        }
        h2 {
            margin: 14px 0 2px;
            color: #2f79ff;
            font-size: 0.48rem;
            line-height: 24px;
            text-align: center;
        }
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
            &:last-child {
                margin-bottom: 0;
            }
            span {
                opacity: 0.6;
            }
            strong {
                flex: 1;
                text-align: right;
            }
        }
    }
    .risk-result__tips {
        margin: 0 14px;
        h2 {
            line-height: 1;
            i {
                margin-right: 6px;
                color: #393939;
                font-size: 0.3rem;
                vertical-align: middle;
            }
            span {
                font-size: 0.24rem;
                line-height: 24px;
                vertical-align: middle;
            }
        }
        p {
            margin-top: 2px;
            font-size: 0.24rem;
            line-height: 18px;
            opacity: 0.4;
        }
    }
    .risk-agreement {
        position: absolute;
        bottom: 62px;
        padding-left: 14px;
        .icon-selected {
            margin-right: 7px;
            color: #2f79ff;
            font-size: 0.32rem;
            vertical-align: middle;
        }
        p {
            display: inline-block;
            font-size: 0.24rem;
            line-height: 20px;
            // vertical-align: middle;
            span {
                opacity: 0.4;
            }
            a {
                color: #2f79ff;
                font-size: 0.24rem;
            }
        }
    }
}
</style>
