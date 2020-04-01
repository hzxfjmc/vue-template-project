<template lang="pug">
    yx-container.open-permission-wrapper
        .permission-container(slot="main")
            .permission-content
                .title {{ agreementTitle }}
                .main-content
                    //- iframe(src=`/webapp/market/generator.html?key=${fundCode}` v-if="fundCode")
                    .title-info {{$t('titleInfo')}}
                    .content(v-html="riskInfo") 
            .signature-box
                .title {{$t('inputName')}}
                van-field(v-model="autograph" :placeholder="signNamePlaceholder" class="signature-input" )      
                p {{ $t('agreeText') }}
        .footer-btn(slot='bottom')
            van-button(type="info" round  size="large" @click="openPermissionHandle" :disabled="disabled") {{$t('btnText')}}
</template>

<script>
import { fundRiskAutograph, getFundUserInfo } from '@/service/user-server.js'
import { i18nOpenPermissions } from './open-permissions-i18n.js'
import LS from '@/utils/local-storage.js'
import { queryMessageDetail } from '@/service/news-helpcenter.js'

export default {
    i18n: i18nOpenPermissions,
    data() {
        return {
            fundCode: '',
            autograph: LS.get('signName') || '',
            agreementTitle: '',
            riskInfo: '',
            permissionContent: `正文：CFD 是不适合各类投资者的复杂产品，因此您应该始终确保您了解您所购买的产品是如何运作的，它是否能够满足您的需求，您是否能在亏损时拥有头寸以承担损失。
在做出交易决定之前，您应仔细阅读这些条款和产品说明。在交易 CFD 之前，您务必确信了解所涉及的风险。您是否能在亏损时拥有头寸以承担损失。`,
            disabled: true,
            resultIndex: '',
            firstName: '',
            lastName: '',
            userInfo: ''
        }
    },
    computed: {
        // 签名占位符
        signNamePlaceholder() {
            return (
                (this.firstName &&
                    this.lastName &&
                    this.$t('placeText') +
                        `${this.lastName}${this.firstName}`) ||
                this.$t('placeText')
            )
        }
    },
    watch: {
        autograph(val) {
            if (val !== '') {
                this.disabled = false
            } else {
                this.disabled = true
            }
        }
    },
    async created() {
        this.getFundUserInfo()
        if (this.$route.query.fondCode) {
            this.fundCode = this.$route.query.fondCode
        }
        try {
            let data = await queryMessageDetail({
                key: 'fundagreement'
            })
            if (data && data.content) {
                this.agreementTitle = data.title
                this.riskInfo = JSON.parse(data.content)[0].htmlContent
            }
        } catch (e) {
            console.log('queryMessageDetail:', e)
        }
    },
    methods: {
        async openPermissionHandle() {
            try {
                let params = {
                    autograph: this.autograph
                }
                let res = await fundRiskAutograph(params)
                // 签名成功，本地设置标记，用与返回时候保留签名，刷新则清除
                LS.put('signName', this.autograph)
                console.log(res)
                // 跳申购页
                this.$router.replace({
                    path: '/fund-subscribe',
                    query: {
                        id: this.$route.query.id,
                        currencyType: this.$route.query.currencyType
                    }
                })
            } catch (e) {
                if (e.msg) {
                    this.$dialog.alert({
                        message: e.msg
                    })
                }
            }
        },
        //获取用户信息
        async getFundUserInfo() {
            try {
                const res = await getFundUserInfo()
                this.userInfo = res
                this.resultIndex = res.assessResult
                this.firstName = res.firstName
                this.lastName = res.lastName
            } catch (e) {
                console.log('getFundUserInfo:error:>>>', e)
            }
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
        padding: 0 12px 0;
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
            // flex: 1;
            .main-content {
                height: 45vh;
                max-height: 410px;
                min-height: 273px;
                overflow: scroll;
                background: rgba(47, 121, 255, 0.04);
                font-size: 0 14px 14px;
                color: $text-color;
                padding: 0 14px 14px;
                display: flex;
                flex-direction: column;
                // padding-bottom: 14px;
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
                &::-webkit-scrollbar {
                    width: 6px;
                    height: 0;
                    border-radius: 3px;
                    background: rgba(47, 121, 255, 0.0959);
                }
                &::-webkit-scrollbar-thumb {
                    border-radius: 3px;
                    -webkit-box-shadow: inset 0 0 5px rgba(47, 121, 255, 0.0959);
                    background: rgba(47, 121, 255, 0.0959);
                    scrollbar-arrow-color: rgba(47, 121, 255, 0.0959);
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
            p {
                padding-top: 10px;
                font-size: 12px;
                color: $text-color5;
            }
        }
    }
}
</style>
