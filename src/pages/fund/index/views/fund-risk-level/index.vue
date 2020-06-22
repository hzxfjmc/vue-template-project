<template lang="pug">
    yx-container
        .fund-risk-container.fund-container(slot="main")
            .fund-risk__header
                .title {{this.$t('fundRiskLevel')}}
                .content {{this.$t(fundRiskType)}}
                .tips(
                    v-if="tagShow"
                    @click="fundTipsHandle"
                    :class="{derivatives: tagsShow}"
                    )
                    span 
                        span(v-if="tagsShow") {{this.$t('Derivatives')}}
                        span {{this.$t('Complex')}}
                        span.iconfont.icon-icon_fund_index_2   
                .desc {{this.$t(`R${this.$route.query.fundRiskType}`)}}
            .fund-block
                .fund-block__fundRisk(:style="{height: tableHeight}")
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
                .mask(v-if="all")
                .all(v-if="all")
                    .content-wrap(@click="showAll")
                        span {{this.$t('all')}}
                        span.iconfont.icon-icon-bottom
                .block_wrap(v-if="isLogin")
                    .fund-block__userRisk
                        .fund-risk__header
                            .title {{this.$t('userRiskLevel')}}
                            .fund-risk__top(v-if="userRiskLevel")
                                .content {{this.$t(userRiskType)}}
                                .tips.user(
                                    v-if="damagedStatus"
                                    @click="userTipsHandle")
                                    span {{this.$t(['易受损客户','易受損客戶','Vulnerable Customer'])}}
                                    span.iconfont.icon-icon_fund_index_2
                                .desc {{this.$t(`A${userRiskLevel}`)}}
                            .desc(v-else) {{this.$t('noAssess')}}
                        .fund-risk__table(:style="{height: tableHeight2}")
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
                    .mask(v-if="all2")
                    .all(v-if="all2")
                        .content-wrap(@click="showAll2")
                            span {{this.$t('all')}}
                            span.iconfont.icon-icon-bottom    
            van-dialog(
                v-model = "show"
                :showConfirmButton = "false"
                :closeOnClickOverlay="true"
                :width="400"
            )
                .alert-wrap
                    .type {{this.$t('conservative')}}
                    .typeDesc {{this.$t('A1')}}
                    .typeUser {{this.$t(['您为“易受损客户”','您為“易受損客戶”','You are vulnerable client'])}}
                    .content {{this.$t(['什么是易损型用户?','什麽是易損型用戶?','What is vulnerable client'])}}
                        ul
                            li(v-for="(item, index) in this.$t('vulnerableList')" :key="index") {{item}}
                    .description {{this.$t('description')}}
                    .info {{this.$t('info')}}
                    van-button(
                        type="primary" 
                        size="large"
                        @click="cancel"
                    ) {{this.$t('iKnow')}}       
        .fund-risk__fotter( slot="bottom" )
                van-button(
                    class="foot-button"
                    type="primary" 
                    size="large"
                    @click="handleAction"
                ) {{userRiskLevel ? this.$t('assessAgain') : this.$t('assessNow')}}
</template>
<script>
import jsBridge from '@/utils/js-bridge'
import { Button, Dialog } from 'vant'
import { riskAssessResult } from '@/service/user-server.js'
import i18n from './i18n'
import { mapGetters } from 'vuex'
export default {
    i18n,
    data() {
        return {
            show: false,
            all: true,
            all2: true,
            userRiskLevel: null,
            damagedStatus: null,
            tableHeight: '150px',
            tableHeight2: '150px'
        }
    },
    components: {
        [Button.name]: Button,
        [Dialog.name]: Dialog
    },
    created() {
        if (this.isLogin) {
            this.handleRiskAssessResult()
        }
    },
    methods: {
        fundTipsHandle() {
            this.$alert({
                message: this.$t('tipsDesc'),
                className: 'text-align-justify',
                confirmButtonColor: '#0D50D8',
                confirmButtonText: this.$t('iKnow')
            })
        },
        showAll() {
            this.all = false
            this.tableHeight = 'auto'
        },
        showAll2() {
            this.all2 = false
            this.tableHeight2 = 'auto'
        },
        userTipsHandle() {
            this.show = true
        },
        cancel() {
            this.show = false
        },
        async handleAction() {
            if (this.isLogin) {
                this.$router.push({
                    path: '/risk-assessment',
                    query: {
                        id: this.$route.query.id,
                        fundRiskType: this.$route.query.fundRiskType,
                        displayLocation: 1
                    }
                })
            } else {
                await this.$dialog.alert({
                    message: this.$t('login'),
                    confirmButtonText: this.$t('loginBtn')
                })
                jsBridge.gotoNativeModule('yxzq_goto://user_login')
            }
        },
        async handleRiskAssessResult() {
            try {
                let res = await riskAssessResult()
                this.userRiskLevel = res.assessResult || 0 // 用户风险测评等级
                this.damagedStatus = res.damagedStatus || 0
            } catch (e) {
                if (e.msg) {
                    this.$alert(e.msg)
                }
                console.log('riskAssessResult:error:>>>', e)
            }
        }
    },
    computed: {
        ...mapGetters(['isLogin']),
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
        },
        tagsShow() {
            return JSON.parse(this.$route.query.tagsShow)
        },
        tagShow() {
            return JSON.parse(this.$route.query.tagShow)
        }
    }
}
</script>
<style lang="scss">
.text-align-justify .van-dialog__message {
    text-align: justify;
    white-space: pre-line;
}
.fund-container {
    background-color: $background-bottom-color;
}
.fund-risk__header {
    display: flex;
    flex-direction: column;
    padding: 14px;
    background-color: $background-color;
    .title {
        margin-bottom: 15px;
        font-size: 16px;
        margin-left: -14px;
        padding-left: 10px;
        font-weight: 400;
        color: rgba(53, 53, 71, 1);
        border-left: 4px solid $text-link-color;
    }
    .tips {
        margin-bottom: 15px;
        font-size: 14px;
        color: $primary-color;
        span {
            border-radius: 4px;
            padding: 3px;
            background-color: rgba(224, 242, 255, 0.4);
        }
        .iconfont {
            font-size: 14px;
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
    background-color: $background-color;
    overflow: hidden;
}
.mask {
    position: relative;
    margin-top: -83px;
    height: 83px;
    background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.32) 0%,
        rgba(255, 255, 255, 1) 100%
    );
}
.all {
    padding: 12px 0;
    text-align: center;
    line-height: 20px;
    font-size: 15px;
    background-color: $background-color;
    color: rgba(25, 25, 25, 0.45);
    span {
        margin-right: 5px;
    }
}
.table {
    text-align: center;
    th {
        height: 40px;
        background-color: rgba(0, 92, 229, 0.19);
        &:first-child {
            width: 90px;
            border-top-left-radius: 4px;
        }
        &:last-child {
            border-top-right-radius: 4px;
        }
    }
    td {
        padding: 10px;
        background-color: $text-link-color06;
        &:last-child {
            text-align: justify;
            white-space: pre-line;
        }
    }
}
.fund-block__userRisk {
    margin-top: 10px;
    padding-bottom: 20px;
    background-color: #fff;
    .desc {
        margin-top: 15px;
    }
    .fund-risk__table {
        overflow: hidden;
        .table {
            padding: 6px 14px;
        }
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
    .fund-risk__fotter {
        position: absolute;
        bottom: 0px;
    }
}
</style>
