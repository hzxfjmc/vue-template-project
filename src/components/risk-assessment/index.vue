<template lang="pug">
    yx-container.risk-assessment-wrapper
        .risk-assessment-tips(slot="top") 
            .content 
                .top
                    span.quotes 
                    span.text {{$t('riskAssessmentTipsTop')}}
                .bottom 
                    .span {{$t('riskAssessmentTipsBottom')}}
                    span.only-once {{$t('onlyOnce')}}
                    span {{$t('riskAgainText')}}
        .risk-assessment-form(slot="main")
            van-panel(
                v-for="(subjectItem, subjectIndex) in subject"
                :key="subjectIndex"
                :title="subjectItem[titleI18n]"
            )
                van-radio-group(v-model="subjectItem.choiceNum")
                    van-cell-group
                        van-cell(
                            v-for="(optionItem, optionindex) in subjectItem.option"
                            :key="optionindex"
                            :title=`optionItem[textI18n]`
                            clickable
                            @click="subjectItem.choiceNum = optionItem.num"
                        )
                            van-radio(slot="right-icon" :name="optionItem.num")
                                i.iconfont(
                                    slot="icon"
                                    slot-scope="props"
                                    :class="props.checked ? 'icon-selected' : 'icon-unchecked'"
                                )
                .has-child-container(v-if="[6,7].includes(subjectIndex)")
                    van-panel#child-title(
                        v-for="(subjectItem1, subjectIndex) in subjectItem.subject"
                        :key="subjectIndex"
                        :title="subjectItem1[titleI18n]"
                        style="color:#000"
                    )
                        van-radio-group(v-model="subjectItem1.choiceNum")
                            van-cell-group
                                van-cell(
                                    v-for="(optionItem, optionindex) in subjectItem1.option"
                                    :key="optionindex"
                                    :title="optionItem[textI18n]"
                                    clickable
                                    @click="subjectItem1.choiceNum = optionItem.num"
                                )
                                    van-radio(slot="right-icon" :name="optionItem.num")
                                        i.iconfont(
                                            slot="icon"
                                            slot-scope="props"
                                            :class="props.checked ? 'icon-selected' : 'icon-unchecked'"
                                        )
            van-dialog.easy-customer-container(v-model="showEasyCustomer" :show-confirm-button='false')
                .title {{$t('resultTitle') }}
                .msg-info {{assessDefinition && assessDefinition}}
                .msg-result {{$t('resultCus')}}
                .msg-title {{$t('msgTitle')}}
                .msg-reason(v-for="(item,index) in $t('msgReason')")
                    .item-reason ({{index+1}}) {{item}}
                .danger-intro {{$t('dangerIntro')}}
                .to-call-cs {{$t('toCallCS')}}
                .btn-know(@click="closeEasyCustomer") {{$t('iKnow')}}
        .van-bottom-btn(slot="bottom")
            van-button.btn(type="info" round size="large" :disabled="submitBtnDisabled" @click="handleSubmit('submit')"
            :class="{ active: !submitBtnDisabled }") {{$t('btnText')}}

</template>

<script>
import riskAssessmentMixin from '@/mixins/bond/risk-assessment/index.js'
export default {
    mixins: [riskAssessmentMixin],
    i18n: {
        zhCHS: {
            riskAssessmentTipsTop:
                '友信智投致力于为全球用户提供更好的个人金融服务，为了您能获得更匹配的金融产品和服务，了解您的风险能力和取向是非常必要的。',
            riskAssessmentTipsBottom:
                '完成问卷用时约2分钟，请依据您的实际情况回答，每半年',
            onlyOnce: '仅有一次',
            riskAgainText: '重新测评机会。',
            btnText: '提交测评',
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
            dangerIntro:
                '您的资料中，满足以上任意一项，为“易受损客户”，“易受损客户”的风评为保守型（A1）。',
            toCallCS: '如果资料有误需要调整，请联系客服。'
        },
        zhCHT: {
            riskAssessmentTipsTop:
                '友信智投致力於為全球用戶提供更好的個人金融服務，為了您能獲得更匹配的金融產品和服務，了解您的風險能力和取向是非常必要的。',
            riskAssessmentTipsBottom:
                '完成問卷用時約2分鐘，請依據您的實際情況回答，每半年',
            onlyOnce: '僅有一次',
            riskAgainText: '重新測評機會。',
            btnText: '提交測評',
            iKnow: '我知道了',
            resultTitle: '保守型(A1)',
            resultCus: '您為"易受損客戶"',
            msgTitle: '什麼是"易受損客戶"',
            msgReason: [
                '65歲或以上；或',
                '教育程度在小學或以下；或',
                '職業是退休及每年收入<HK$20萬及資產淨值<HK$50萬'
            ],
            dangerIntro:
                '您的資料中，滿足以上任意一項，為“易受損客戶”，“易受損客戶”的風評為保守型（A1）。',
            toCallCS: '如果資料有誤需要調整，請聯繫客服。'
        },
        en: {
            riskAssessmentTipsTop: `uSMART is dedicated to bring personal financial services to the world.
This assessment is important to know about your investment risk profile for choosing suitable products.`,
            riskAssessmentTipsBottom:
                'Please take 2 mins to complete assessment, you have',
            onlyOnce: 'only one chance',
            riskAgainText: 'to reassess every half-year.',
            btnText: 'Submit',
            iKnow: 'Got it',
            resultTitle: 'Conservative(A1)',
            resultCus: 'You are vulnerable client',
            msgTitle: 'What is vulnerable client',
            msgReason: [
                '65 years or older, or',
                'level of education is equal to or below primary school level, or',
                'retired and annual income < HK$ 200,000 and net asset value < HK$ 500,000'
            ],
            dangerIntro:
                'You will be classed as vulnerable client if you match any of above criteria. Risk profile of vulnerable client is "Conservative" (A1).',
            toCallCS: 'Please contact CS if there is any adjustment.'
        }
    }
}
</script>

<style lang="scss" scoped>
.risk-assessment-wrapper.yx-container {
    background-color: $text-color8;
    font-family: 'PingFang SC';
    .risk-assessment-tips {
        background-color: #fff;
        padding: 14px 10px 0;
        position: relative;
        .content {
            background: rgba(238, 244, 255, 1);
            box-shadow: 0px 2px 6px 0px rgba(57, 57, 57, 0.05);
            border-radius: 6px;
            padding: 5px 8px 5px 12px;
            font-size: 0.28rem;
            line-height: 20px;
            .top {
                color: $primary-color-line;
                .quotes {
                    display: inline-block;
                    width: 31px;
                    height: 24px;
                    background: url('~@/assets/img/fund/@2x.png') center
                        no-repeat;
                    background-size: contain;
                    margin-right: 10px;
                }
                .text {
                    font-size: 14px;
                    font-family: PingFangSC-Medium, PingFangSC;
                    font-weight: 600;
                    color: $primary-color-line;
                    line-height: 24px;
                }
            }
            .bottom {
                font-size: 12px;
                color: $text-color3;
                line-height: 18px;
                .only-once {
                    color: $text-color5;
                    font-weight: 600;
                }
            }
        }
    }
    .risk-assessment-form {
        .van-panel {
            margin-bottom: 10px;
            padding-bottom: 10px;
        }
        .van-cell {
            &:after {
                display: none;
            }
            font-size: 0.28rem;
            line-height: 24px;
        }
        .van-panel__header {
            &:after {
                display: none;
            }
        }
        .van-panel__content {
            .van-cell {
                padding: 10px 12px;
            }
            .van-cell__title {
                color: $hk-text-color6 !important;
            }
        }
        .van-hairline--top-bottom::after {
            display: none;
        }
        .icon-selected {
            color: $primary-color-line;
        }
        .icon-unchecked {
            opacity: 0.4;
        }
        .icon-unchecked,
        .icon-selected {
            font-size: 0.32rem;
        }
    }
    .van-bottom-btn {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 48px;
        background-color: #fff;
        .btn {
            width: 100%;
            height: 100%;
            color: $background-color;
            &[disabled='disabled'] {
                background-color: $disabled-color;
            }
        }
    }
    #child-title {
        .van-panel__header {
            .van-cell__title {
                color: $hk-text-color !important;
            }
        }
        border-bottom: 0.5px solid rgba($color: $text-color2, $alpha: 0.05);
        &:nth-of-type(2) {
            border-bottom: none;
        }
    }
}
.easy-customer-container {
    padding: 20px 16px;
    text-align: center;

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
</style>
