<template lang="pug">
    .risk-assessment-result-wrapper(v-show="isShowPage")
        .risk-result-top
            .risk-result__hd
                p {{$t('resultHd')}}
            .risk-result__md {{ assessResultName  }}
            .easy-danger-customer(v-if="userRiskLevel===3" @click='showEasyCustomerInfo') {{$t('easyDangerCustomer')}}
            .risk-result-info(v-if="userRiskLevel===3") {{$t('riskInfo')}}
        .foot-container
            .risk-result__bd {{$t('lastTime')}} {{ assessmentTime | date-format('YYYY-MM-DD') }}
            fixed-operate-btn(
                :text="$t('btnText')"
                @click="handleAction"
            )
        van-dialog.easy-customer-container(v-model="showEasyCustomer" :show-confirm-button='false')
            .title {{$t('resultTitle') }}
            .msg-info {{$t('riskInfo')}}
            .msg-result {{$t('resultCus')}}
            .msg-title {{$t('msgTitle')}}
            .msg-reason(v-for="(item,index) in $t('msgReason')")
                .item-reason ({{index+1}}) {{item}}
            .btn-know(@click="showEasyCustomer = false") {{$t('iKnow')}}
            

</template>

<script>
import riskAssessmentResultMixin from '@/mixins/bond/risk-assessment-result/index.js'
export default {
    mixins: [riskAssessmentResultMixin],
    i18n: {
        zhCHS: {
            resultHd: '您的风评结果为：',
            btnText: '重新测评',
            lastTime: '上次风评日期：',
            riskInfo: '您对资本亏损的承受能力偏低及重视保存资本',
            easyDangerCustomer: '易受损客户',
            iKnow: '我知道了',
            resultTitle: '保守型',
            resultCus: '您为“易受损客户”',
            msgTitle: '什么是“易受损客户”',
            msgReason: [
                '65岁或以上；或',
                '教育程度在小学或以下；或',
                '职业是退休及每年收入<HK$20万及资产净值<HK$50万'
            ]
        },
        zhCHT: {
            resultHd: '您的風評結果為：',
            btnText: '重新測評',
            lastTime: '上次風評日期：',
            riskInfo: '您對資本虧損的承受能力偏低及重視保存資本',
            easyDangerCustomer: '易受損客戶',
            iKnow: '我知道了',
            resultTitle: '保守型',
            resultCus: '您为“易受损客户”',
            msgTitle: '什么是“易受损客户”',
            msgReason: [
                '65岁或以上；或',
                '教育程度在小学或以下；或',
                '职业是退休及每年收入<HK$20万及资产净值<HK$50万'
            ]
        },
        en: {
            resultHd: 'Result:',
            btnText: 'Submit',
            lastTime: 'Last Update:',
            riskInfo: '您对资本亏损的承受能力偏低及重视保存资本',
            easyDangerCustomer: 'Vulnerable customer',
            iKnow: '我知道了',
            resultTitle: '保守型',
            resultCus: '您为“易受损客户”',
            msgTitle: '什么是“易受损客户”',
            msgReason: [
                '65岁或以上；或',
                '教育程度在小学或以下；或',
                '职业是退休及每年收入<HK$20万及资产净值<HK$50万'
            ]
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
            color: #2f79ff;
            font-size: 0.48rem;
            line-height: 1;
            margin-bottom: 10px;
        }
        .risk-result-info {
            margin-top: 10px;
        }
        .easy-danger-customer {
            padding: 0 10px;
            height: 25px;
            background: rgba(47, 121, 255, 0.1);
            border-radius: 4px;
            width: fit-content;
            min-width: 80px;
            line-height: 25px;
        }
    }

    .foot-container {
        .risk-result__bd {
            margin-top: 17px;
            color: rgba(25, 25, 25, 0.3);
            font-size: 0.24rem;
            line-height: 24px;
            margin-bottom: 59px;
        }
    }
}
.easy-customer-container {
    padding: 20px 16px;
    .title {
        font-size: 20px;
        color: rgba(47, 121, 255, 1);
        line-height: 20px;
        margin-bottom: 13px;
    }
    .msg-info {
        font-size: 12px;
        color: rgba(47, 121, 255, 1);
        margin-bottom: 17px;
        text-align: left;
    }
    .msg-result {
        font-size: 18px;
        color: rgba(47, 121, 255, 1);
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
    .btn-know {
        height: 48px;
        background: $primary-color;
        border-radius: 6px;
        color: $background-color;
        line-height: 48px;
        margin-top: 19px;
    }
}
</style>
