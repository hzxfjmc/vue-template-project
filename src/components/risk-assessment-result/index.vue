<template lang="pug">
    .risk-assessment-result-wrapper(v-show="isShowPage")
        .risk-result-top
            .risk-result__hd
                p {{$t('resultHd')}}
            .risk-result__md {{ isExpried? $t('expired') : assessResultName}}
            .easy-danger-customer(v-if="damagedStatus===1 && !isExpried" @click='showEasyCustomerInfo')
                span {{$t('easyDangerCustomer')}}
                img(src="~@/assets/img/fund/wenhao.png")
            .risk-result-info(v-if="!isExpried") {{assessDefinition && assessDefinition}}
        .foot-container
            .risk-result__bd {{$t('lastTime')}} {{ assessmentTime | date-format('YYYY-MM-DD') }}
            van-button(
                type="info"
                round
                size="large"
                :text="$t('btnText')"
                @click="handleAction"
            )
        van-dialog.easy-customer-container(v-model="showEasyCustomer" :show-confirm-button='false')
            .title {{isExpried? $t('expired') : assessResultName}}
            .msg-info {{assessDefinition}}
            .msg-result {{$t('resultCus')}}
            .msg-title {{$t('msgTitle')}}
            .msg-reason(v-for="(item,index) in $t('msgReason')")
                .item-reason ({{index+1}}) {{item}}
            .danger-intro {{$t('dangerIntro')}}
            .to-call-cs {{$t('toCallCS')}}
            .btn-know(@click="showEasyCustomer = false") {{$t('iKnow')}}
        van-dialog.remaining-container(v-model="showRemainingNum" :show-cancel-button='true' :confirm-button-text="number===0?$t('toCall'):$t('startRisk')" @confirm="startRiskHandle(number)" :cancel-button-text="number===0?$t('toClose'):$t('toCancel')" @cancel="callOrCancel(number)" )
            .title {{$t('leastNum')}} {{number}} {{$t('times')}}
            .years-info(v-if="number!==0") {{resetTimes}}
            .years-info(v-if="number===0")
                .p {{resetTimes}}
                .p {{ $t('yearsInfoToCall')}}
</template>

<script>
import riskAssessmentResultMixin from './mixin.js'
export default {
    mixins: [riskAssessmentResultMixin],
    i18n: {
        zhCHS: {
            resultHd: '您的风评结果为：',
            btnText: '重新测评',
            lastTime: '上次风评日期：',
            easyDangerCustomer: '易受损客户',
            iKnow: '我知道了',
            resultTitle: '保守型(A1)',
            resultCus: '您为“易受损客户”',
            msgTitle: '什么是“易受损客户”',
            msgReason: [
                '65岁或以上；或',
                '教育程度在小学或以下；或',
                '职业是退休及每年收入<HK$20万及资产净值<HK$50万'
            ],
            leastNum: '剩余可测评次数：',
            yearsInfo: '重置',
            yearsInfoToCall: '如有调整，请联系客服',
            startRisk: '开始测评',
            times: '次',
            toCall: '拨打客服电话',
            toCancel: '取消',
            toClose: '关闭',
            expired: '已过期',
            dangerIntro:
                '您的资料中，满足以上任意一项，为“易受损客户”，“易受损客户”的风评为保守型（A1）。',
            toCallCS: '如果资料有误需要调整，请联系客服。',
            leftTimes: (monthTimes, yearTimes) =>
                `本月剩余可测试次数：${monthTimes}次。本年剩余可测试次数：${yearTimes}次。`,
            retryNextMonth: '请于下个月1号重试。',
            timesLimit: '*每年可测评次数一共5次，每月可测评次数为3次'
        },
        zhCHT: {
            resultHd: '您的風評結果為：',
            btnText: '重新測評',
            lastTime: '上次風評日期：',
            easyDangerCustomer: '易受損客戶',
            iKnow: '我知道了',
            resultTitle: '保守型(A1)',
            resultCus: '您為"易受損客戶"',
            msgTitle: '什麼是"易受損客戶"',
            msgReason: [
                '65歲或以上；或',
                '教育程度在小學或以下；或',
                '職業是退休及每年收入<HK$20萬及資產淨值<HK$50萬'
            ],
            leastNum: '剩餘可測評次數：',
            yearsInfo: '重置',
            yearsInfoToCall: '如有調整，請聯繫客服',
            startRisk: '開始測評',
            times: '次',
            toCall: '撥打客服電話',
            toCancel: '取消',
            toClose: '關閉',
            expired: '已過期',
            dangerIntro:
                '您的資料中，滿足以上任意一項，為“易受損客戶“，“易受損客戶“的風險承受能力為保守型（A1）。',
            toCallCS: '如果資料有誤需要調整，請聯系客服。',
            leftTimes: (monthTimes, yearTimes) =>
                `本月剩餘可測試次數：${monthTimes}次。本年剩餘可測試次數：${yearTimes}次。`,
            retryNextMonth: '請於下個月1號重試',
            timesLimit: '*每年可測評次數一共5次，每月可測評次數為3次'
        },
        en: {
            resultHd: 'Result:',
            btnText: 'Assess Again',
            lastTime: 'Last Update:',
            easyDangerCustomer: 'Vulnerable Customer',
            iKnow: 'Got it',
            resultTitle: 'Conservative(A1)',
            resultCus: 'You are vulnerable client',
            msgTitle: 'What is vulnerable client',
            msgReason: [
                '65 years or older, or',
                'level of education is equal to or below primary school level, or',
                'retired and annual income < HK$ 200,000 and net asset value < HK$ 500,000'
            ],
            leastNum: 'Remaining Assessment Chance：',
            yearsInfo: 'Reset',
            yearsInfoToCall: 'Please contact CS if there is any adjustment',
            startRisk: 'Start The Assessment',
            times: 'Times',
            toCall: 'Call CS',
            toCancel: 'Cancel',
            toClose: 'Close',
            expired: 'Expired',
            dangerIntro:
                'Your information meet any of the above, the risk tolerance of "vulnerable customers" and "vulnerable customers" is conservative (A1).',
            toCallCS:
                'If the information is incorrect, please contact customer service for revision.',
            leftTimes: (monthTimes, yearTimes) =>
                `The remaining assessment times for this month: ${monthTimes} . The remaining assessment times for this year: ${yearTimes} .`,
            retryNextMonth: 'Please try again on the 1st of next month',
            timesLimit:
                '*A total of 5 assessments per year is available year while total of 3 assessments per month'
        }
    }
}
</script>

<style lang="scss" scoped>
.risk-assessment-result-wrapper {
    min-height: 100%;
    background-color: #fff;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .risk-result-top {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .risk-result__hd {
            padding: 60px 0 8px;
            color: rgba(25, 25, 25, 0.5);
            font-size: 0.24rem;
            line-height: 24px;
            text-align: center;
        }
        .risk-result__md {
            color: $primary-color-line;
            font-size: 0.48rem;
            line-height: 1;
            margin-bottom: 10px;
        }
        .risk-result-info {
            margin: 10px 16px 0;
            color: $primary-color-line;
        }
        .easy-danger-customer {
            padding: 0 10px;
            height: 25px;
            background: rgba(47, 121, 255, 0.1);
            border-radius: 4px;
            width: fit-content;
            min-width: 80px;
            line-height: 25px;
            color: $primary-color-line;
            img {
                width: 12px;
                height: 12px;
                margin-top: 6px;
            }
        }
    }

    .foot-container {
        .risk-result__bd {
            margin-top: 17px;
            color: rgba(25, 25, 25, 0.3);
            font-size: 0.24rem;
            line-height: 24px;
            margin-bottom: 10px;
        }
    }
}
.easy-customer-container {
    padding: 20px 16px;
    .title {
        font-size: 20px;
        color: $primary-color-line;
        line-height: 20px;
        margin-bottom: 13px;
    }
    .msg-info {
        font-size: 12px;
        color: $primary-color-line;
        margin-bottom: 17px;
        text-align: left;
    }
    .msg-result {
        font-size: 18px;
        color: $primary-color-line;
        text-align: left;
        margin-bottom: 12px;
    }
    .msg-title {
        font-size: 14px;
        color: $text-color5;
        text-align: left;
    }
    .msg-reason {
        @extend .msg-title;
        padding-left: 8px;
        line-height: 22px;
    }
    .danger-intro {
        text-align: left;
        margin-top: 10px;
        font-size: 12px;
    }
    .to-call-cs {
        text-align: left;
        margin-top: 10px;
        font-size: 12px;
    }
    .btn-know {
        height: 48px;
        background: $primary-color;
        border-radius: 6px;
        color: $background-color;
        line-height: 48px;
        margin-top: 19px;
    }
}
.remaining-container {
    padding-top: 20px;
    .title {
        margin-bottom: 20px;
    }
    .years-info {
        font-size: 14px;
        color: $text-color6;
        margin-bottom: 20px;
    }
}
</style>
