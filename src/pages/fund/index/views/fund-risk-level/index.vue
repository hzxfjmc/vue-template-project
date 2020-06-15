<template lang="pug">
    .fund-risk-container.fund-container
        .fund-risk__header
            .title {{this.$t('fundRiskLevel')}}
            .content {{this.$t(fundRiskType)}}
            .tips(@click="fundTipsHandle") 
                span {{this.$t('riskTips')}}
                span.iconfont.icon-icon_fund_index_2   
            .desc {{this.$t(`R${this.$route.query.fundRiskType}`)}}
        .fund-block
            .fund-block__fundRisk
                table.table
                    tr
                        th {{this.$t('Risklevel')}}
                        th {{this.$t('RiskDesc')}}
                    tr
                        td {{this.$t('lowRsik')}}
                        td {{this.$t('R1')}}
                    tr
                        td {{this.$t('mediumLowRisk')}}
                        td {{this.$t('R2')}}
                    tr
                        td {{this.$t('mediumRisk')}}
                        td {{this.$t('R3')}}
                    tr
                        td {{this.$t('mediumHighRisk')}}
                        td {{this.$t('R4')}}
                    tr
                        td {{this.$t('highRisk')}}
                        td {{this.$t('R5')}}
            .fund-block__userRisk(v-if="userRiskLevel")
                .fund-risk__header
                    .title {{this.$t('userRiskLevel')}}
                    .content {{this.$t(userRiskType)}}
                    .tips.user(
                        v-if="this.userRiskLevel === 1"
                        @click="userTipsHandle")
                        span 易受损客户
                        span.iconfont.icon-icon_fund_index_2
                    .desc {{this.$t(`A${userRiskLevel}`)}}
                table.table
                    tr
                        th {{this.$t('riskTolerance')}}
                        th {{this.$t('RiskDesc')}}
                    tr
                        td {{this.$t('conservative')}}
                        td {{this.$t('A1')}}
                    tr
                        td {{this.$t('stable')}}
                        td {{this.$t('A2')}}
                    tr
                        td {{this.$t('balanced')}}
                        td {{this.$t('A3')}}
                    tr
                        td {{this.$t('growth')}}
                        td {{this.$t('A4')}}
                    tr
                        td {{this.$t('aggressive')}}
                        td {{this.$t('A5')}}
            .fund-risk__fotter(v-if="userRiskLevel")
                van-button(
                    type="primary" 
                    size="large"
                    @click="handleAction"
                ) 重新评测
            van-dialog(
                v-model = "show"
                :showConfirmButton = "false"
            )
                .alert-wrap
                    .type {{this.$t('conservative')}}
                    .typeDesc {{this.$t('A1')}}
                    .typeUser {{this.$t(['你为“易受损客户”','',''])}}
                    .content {{this.$t(['什么是易损型用户?'])}}
                        ul
                            li(v-for="item in this.$t('vulnerableList')" :key="index") {{item}}
                    .description {{this.$t('description')}}
                    .info {{this.$t('info')}}
                    van-button(
                        type="primary" 
                        size="large"
                        @click="cancel"
                    ) {{this.$t('iKnow')}}
</template>
<script>
import { Button, Dialog } from 'vant'
import { riskAssessResult } from '@/service/user-server.js'
import i18n from './i18n'
export default {
    i18n,
    data() {
        return {
            show: false,
            userRiskLevel: null
        }
    },
    components: {
        [Button.name]: Button,
        [Dialog.name]: Dialog
    },
    created() {
        this.handleRiskAssessResult()
    },
    methods: {
        fundTipsHandle() {
            this.$alert({
                message: this.$t('tipsDesc'),
                confirmButtonText: this.$t('iKnow')
            })
        },
        userTipsHandle() {
            this.show = true
        },
        cancel() {
            this.show = false
        },
        handleAction() {
            this.$router.push({
                path: '/risk-assessment',
                query: {
                    id: this.$route.query.id,
                    fundRiskType: this.$route.query.fundRiskType,
                    displayLocation: 1
                }
            })
        },
        async handleRiskAssessResult() {
            try {
                let res = await riskAssessResult()
                this.userRiskLevel = res.assessResult || 0 // 用户风险测评等级
            } catch (e) {
                if (e.msg) {
                    this.$alert(e.msg)
                }
                console.log('riskAssessResult:error:>>>', e)
            }
        }
    },
    computed: {
        fundRiskType() {
            let fundRiskType = this.$route.query.fundRiskType || 0
            const riskTypeList = [
                'lowRsik',
                'mediumLowRisk',
                'mediumRisk',
                'mediumHighRisk',
                'highRisk'
            ]
            return riskTypeList[Number(fundRiskType) - 1]
        },
        userRiskType() {
            const userRiskTypeList = [
                'conservative',
                'stable',
                'balanced',
                'growth',
                'aggressive'
            ]
            return userRiskTypeList[this.userRiskLevel - 1]
        }
    }
}
</script>
<style lang="scss">
.fund-container {
    background-color: $background-bottom-color;
}
.fund-risk__header {
    display: flex;
    flex-direction: column;
    padding: 14px;
    background-color: #fff;
    .title {
        margin-bottom: 20px;
        font-size: 16px;
        margin-left: -14px;
        padding-left: 10px;
        font-weight: 400;
        color: rgba(53, 53, 71, 1);
        border-left: 4px solid rgba(47, 121, 255, 1);
    }
    .tips {
        width: 150px;
        height: 20px;
        margin-bottom: 20px;
        text-align: center;
        border-radius: 2px;
        font-size: 14px;
        color: rgba(47, 121, 255, 1);
        background-color: #e0f2ff;
        &.user {
            width: 90px;
        }
        .iconfont {
            margin-left: 4px;
            font-size: 13px;
        }
    }
    .content {
        margin-bottom: 10px;
        height: 30px;
        font-size: 22px;
        font-weight: 500;
        color: rgba(47, 121, 255, 1);
        line-height: 30px;
    }
}
.fund-block__fundRisk {
    padding: 6px 14px;
    background-color: #fff;
}
.table {
    text-align: center;
    th {
        height: 40px;
        background-color: rgba(0, 92, 229, 0.4);
        &:first-child {
            width: 85px;
        }
    }
    td {
        padding: 10px;
        background-color: #e0f2ff;
        &:last-child {
            text-align-last: left;
        }
    }
}
.fund-block__userRisk {
    margin-top: 10px;
    padding-bottom: 20px;
    background-color: #fff;
    .table {
        padding: 6px 14px;
    }
}
.alert-wrap {
    display: flex;
    flex-direction: column;
    text-align: start;
    color: $primary-color;
    padding: 10px 15px;
    .type {
        font-size: 25px;
        padding: 15px 0;
        text-align: center;
    }
    .typeDesc {
        font-size: 15px;
    }
    .typeUser {
        font-size: 20px;
        padding: 5px 0;
    }
    .content {
        font-size: 15px;
        color: $text-color5;
    }
    ul {
        padding: 5px;
        li {
            padding: 3px;
        }
    }
    .description {
        font-size: 15px;
        color: $text-color;
        padding-bottom: 5px;
    }
    .info {
        color: $text-color;
        font-size: 15px;
        padding-bottom: 20px;
    }
}
</style>
