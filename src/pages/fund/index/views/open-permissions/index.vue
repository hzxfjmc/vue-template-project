<template lang="pug">
    .open-permission-wrapper
        .risk-result-container
            .risk-item.flex
                .left  您的风险承受能力
                .right {{registration}}
            .risk-item.flex
                .left  风格类型
                .right {{riskStyle}}
            .risk-item.flex
                .left  适合产品
                .right {{suitPro}}
        .permission-container
            .permission-content
                .title 基金权限开通协议
                .main-content
                    .title-info {{titleInfo}}
                    .content {{permissionContent}}
            .signature-box
                .title 输入拼音姓名
                van-field(v-model="uaerName" placeholder="请输入拼音：zhangyi" class="signature-input" )      
        fixed-operate-btn(
            :text="'已阅读并同意该协议' + riskTypeTips"
            :disabled="submitBtnDisabled"
            @click="handleSubmit('submit')"
            :class="{ active: !submitBtnDisabled }"
        )
</template>

<script>
import riskAssessmentMixin from '@/mixins/bond/risk-assessment/index.js'
export default {
    mixins: [riskAssessmentMixin],
    data() {
        return {
            registration: 'A5',
            riskStyle: '激进型',
            suitPro: '高风险产品',
            uaerName: '',
            titleInfo: '为了降低您的投资风险，请您完整阅读风险披露内容',
            permissionContent: `正文：CFD 是不适合各类投资者的复杂产品，因此您应该始终确保您了解您所购买的产品是如何运作的，它是否能够满足您的需求，您是否能在亏损时拥有头寸以承担损失。
在做出交易决定之前，您应仔细阅读这些条款和产品说明。
在交易 CFD 之前，您务必确信了解所涉及的风险。您是否能在亏损时拥有头寸以承担损失。`
        }
    }
}
</script>

<style lang="scss" scoped>
.open-permission-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    .risk-result-container {
        padding: 14px 12px;
        display: flex;
        flex-direction: column;
        background-color: $background-color;
        margin-bottom: 10px;
        height: 100px;
        .risk-item {
            line-height: 24px;
            .left {
                font-size: 14px;
                color: $text-color;
                opacity: 0.5;
            }
            .right {
                font-size: 15px;
            }
        }
    }
    .permission-container {
        padding: 0 12px 100px;
        background-color: $background-color;
        flex: 1;
        display: flex;
        flex-direction: column;

        .title {
            font-size: 18px;
            color: $text-color;
            line-height: 22px;
            padding: 12px 0;
        }
        .permission-content {
            flex: 1;
            .main-content {
                min-height: 273px;
                background: rgba(47, 121, 255, 0.04);
                font-size: 14px;
                color: $text-color;
                padding-left: 16px;
                display: flex;
                flex-direction: column;
                .title-info {
                    padding: 14px 0;
                    line-height: 20px;
                    opacity: 0.5;
                }
                .content {
                    line-height: 24px;
                    opacity: 0.5;
                    flex: 1;
                }
            }
        }
        .signature-box {
            .signature-input {
                height: 51px;
                border-radius: 4px;
                background-color: $btn-background-color;
                border-radius: 4px;
                border: 1px solid $btn-border-color;
            }
        }
    }
}
</style>
