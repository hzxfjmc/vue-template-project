<template lang="pug">
    .full-height.flex-fixed.transfer-container
        yx-step(
            :data="stepData"
            :active="active"
            class="bg-white"
            )
        .gap
        .scroll-able.flex-fixed-container
            .top-box
                .bank-icon(:class="{'bank-bdn':!bankInfo.logo}")
                    img(:src="bankInfo.logo ? bankInfo.logo :'/webapp/open-account/open-account/bank-icon/bank_default@2x.png'")
                .title-box
                    .top-title {{bankInfo.bankName}}
                    .bottom-title(v-if="currency ==='2'") 请通过以下任一方式转账
            .transfer-box(v-if="currency ==='2'")
                .transfer-mode-box
                    .transfer-item
                        .title FPS转数快
                        .sub-title
                            span 7*24小时实时转账
                            span.link(@click="goHelpCenter('FPS')") 了解更多
                        .bank-info-box
                            .info-item(style="width:40%")
                                span.key 手续费：
                                span 最低为0港币
                            .info-item(style="width:60%")
                                span.key 预计到账时间：
                                span 1个工作日内
                .copy-box
                    .inner
                        .copy-tip 请在汇款时选择FPS转数快，输入FPS识别码
                            van-cell(title="FPS识别码" value="3795242" @click="copy('3795242')" class="fps-code")
                            van-cell(title="收款银行名称" value="中国银行（香港）" @click="copy('中国银行（香港）')")
                            van-cell(title="收款账户名称" value="USMART SECURITIES LIMITED" @click="copy('USMART SECURITIES LIMITED')")
                            van-cell(title="收款银行编码" value="012" @click="copy('012')")
                        .btn-copy 点击信息可复制
            .transfer-box
                .transfer-mode-box
                    .transfer-item
                        .title 转账
                        .sub-title
                            span 通过银行官网、App汇款至友信证券银行托管账户
                            span.link(@click="goHelpCenter") 了解更多
                        .bank-info-box
                            .info-item(style="width:40%")
                                span.key 手续费：
                                span {{currency =='2'? bankInfo.hkdPoundage : bankInfo.usdPoundage}}
                            .info-item(style="width:60%")
                                span.key 预计到账时间：
                                span {{bankInfo.accountingDate}}
                .copy-box
                    .inner
                        van-cell(v-for="item in map" @click="copy(accountInfo[item.key])" :title="item.value" :value="accountInfo[item.key]")
                        .btn-copy 点击信息可复制
            .gap
            guide-box(
                :bankName="bankInfo.bankName"
                :appRemittanceGuidelines="bankInfo.appRemittanceGuidelines"
                :webRemittanceGuidelines="bankInfo.webRemittanceGuidelines"
                :mode="currency =='2' ?'fps':''"
                class="bg-white"
            )
        van-button(
            size="large"
            type="primary"
            class="bottom-button"
            @click="redirect"
        ) 我已入金，通知友信

</template>
<script>
/**
 * 入金流程-香港汇款/跨境汇款
 * @ Author LINJAIJUN
 * @ Date 2019/01/05
 */
import { mapGetters } from 'vuex'
import LS from '@/utils/local-storage.js'
import guideBox from '../../components/guide-box'
import common from '../../util/common'
import { getCosUrl } from '@/utils/cos-utils'
export default {
    components: {
        guideBox
    },
    methods: {
        copy(content) {
            common.copy(content)
        },
        goHelpCenter(type) {
            let url = ''
            if (type === 'FPS') {
                url =
                    location.origin + '/webapp/market/generator.html?key=XY013'
            } else {
                url =
                    location.origin + '/webapp/market/generator.html?key=XY014'
            }
            this.$jsBridge.gotoNewWebview(url)
        },
        redirect() {
            this.$router.push({
                name: 'deposit-notice',
                query: {
                    bankName: this.bankInfo.bankName,
                    bankCode: this.bankInfo.bankCode,
                    receivingBankCode: this.bankInfo.receivingBankCode,
                    accountId: this.accountInfo.accountId
                }
            })
        },
        async queryAccountBankRef() {
            try {
                let params = {
                    bankCode: this.bankInfo.receivingBankCode,
                    moneyType: this.currency
                }
                this.$loading()
                let data = await this.$depositService.queryAccountBankRef(
                    params
                )
                let res = data ? data[0] : {}
                if (res.bankLogo) {
                    await getCosUrl(res.bankLogo).then(url => {
                        res.bankLogo = url
                    })
                }
                this.accountInfo = res
                this.$close()
            } catch (e) {
                this.$close()
                this.$toast(e.msg || '网络开小差，请稍后再试')
            }
        }
    },
    computed: {
        ...mapGetters({
            currency: `deposit/currency`,
            bankAttribute: `deposit/bankAttribute`
        }),
        currencyStr() {
            return this.$constant.currency[this.currency]
        },
        title() {
            return this.$constant.title[this.bankAttribute]
        },
        stepData() {
            return this.$constant.stepData
        }
    },
    data() {
        return {
            map: [
                { key: 'accountNo', value: '收款账户号码' },
                { key: 'bankName', value: '收款银行名称' },
                { key: 'accountName', value: '收款账户名称' },
                { key: 'bankRtgs', value: '银行编号' }
                // { key: 'bankSwift', value: 'Swift代码' },
                // { key: 'bankAddress', value: '收款银行地址' }
            ],
            accountInfo: {},
            type: '',
            active: 1,
            bankInfo: {
                bankName: '',
                receivingBankName: '',
                accountingDate: ''
            }
        }
    },
    created() {
        this.bankInfo = LS.get('bankData') || this.$route.params.bankData
        this.queryAccountBankRef()
    }
}
</script>

<style lang="scss">
.transfer-container {
    .van-cell:not(:last-child)::after {
        border-bottom: none;
    }
    .copy-box {
        .fps-code {
            .van-cell__value {
                color: #2f79ff !important;
                font-size: 20px;
            }
        }
    }
}
</style>
<style scoped lang="scss">
@import '~@/assets/styles/bank-icon.scss';
.transfer-container {
    background-color: #eee;
    .top-box {
        padding: 0 18px;
        display: flex;
        display: -webkit-flex;
        align-items: center;
    }
    .title-box {
        margin-left: 10px;
        padding-top: 3px;
        .top-title {
            font-size: 18px;
            font-weight: 600;
            color: $text-color;
            line-height: 20px;
        }
        .bottom-title {
            font-size: 12px;
            font-weight: 400;
            color: rgba($text-color, 0.5);
            line-height: 20px;
            padding-top: 5px;
        }
    }
    .transfer-mode-box {
        padding: 13px 18px;
        .title {
            position: relative;
            font-size: 18px;
            font-weight: 600;
            color: $text-color;
            line-height: 22px;
            &::before {
                content: ' ';
                display: block;
                position: absolute;
                left: -18px;
                top: 2px;
                width: 5px;
                height: 20px;
                background: rgba(47, 121, 255, 1);
            }
        }
        .sub-title {
            font-size: 12px;
            font-weight: 400;
            color: rgba($text-color, 0.5);
            line-height: 16px;
            padding-top: 5px;
        }
        .link {
            padding-left: 5px;
            color: $text-link-color;
        }
        .bank-info-box {
            display: flex;
            flex-wrap: wrap;
            padding-top: 20px;
            .info-item {
                width: 50%;
                .key {
                    color: rgba($text-color, 0.5);
                }
            }
        }
    }
    .copy-box {
        margin: 0 10px;
        min-height: 245px;
        background: url('~@/assets/img/open-account-hk/apply/collection-bg@2x.png')
            left top no-repeat;
        background-size: 100% 100%;
        .inner {
            padding: 20px 20px 30px;
        }
        .van-cell {
            padding: 12px 0;
            .van-cell__title {
                flex: 2;
                color: rgba($text-color, 0.5) !important;
            }
            .van-cell__value {
                text-align: left;
                color: $text-color;
                flex: 4;
            }
        }
        .copy-tip {
            text-align: left;
            color: rgba($text-color, 0.5);
        }
        .btn-copy {
            text-align: center;
            font-size: 12px;
            font-weight: 400;
            color: rgba($text-color, 0.5);
            line-height: 17px;
        }
    }
}
.bg-white {
    background: #fff;
}
.gap {
    width: 100%;
    height: 10px;
    background-color: #eee;
}
</style>
