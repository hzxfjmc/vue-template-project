<template lang="pug">
    div.bg-w.pb-48
        yx-step(
        :data="stepData"
        :active="active")
        .gap
        .bank-transfer-box
            .flex-box.inner.space-between
                .item
                    .title 本人同名银行账户
                    .flex-box.start
                        .bank-icon
                            img(:src="bankInfo.logo" v-if="bankInfo.logo")
                        .bank-title {{bankInfo.bankName}}
                .item
                    p 存入{{currencyStr}}
                    p
                        img(src="@/assets/img/open-account/deposit/arrow@2x.png" class="icon-arrow")
                .item
                    .title 友信证券收款账户
                    .flex-box.start
                        .bank-icon
                            img(:src="accountInfo.bankLogo" v-if="accountInfo.bankLogo")
                        .bank-title {{bankInfo.receivingBankName}}
            .txt.flex-box.start
                p
                    span.label 手续费：
                    span {{currency =='2'? bankInfo.hkdPoundage : bankInfo.usdPoundage}}
                p
                    span.label 预计到账时间：
                    span {{bankInfo.accountingDate}}
        .gap
        .account-box
            .title {{title}}
            .info-box
                ul
                    li.flex-box.start(v-for="item in map" @click="copy(accountInfo[item.key])")
                        .item-left
                            span.label {{item.value}}
                        .item-right {{accountInfo[item.key]}}
            .btn-copy 点击信息可复制
        .gap
        guide-box(:bankName="bankInfo.bankName" :appRemittanceGuidelines="bankInfo.appRemittanceGuidelines" :webRemittanceGuidelines="bankInfo.webRemittanceGuidelines")
        van-button(
            size="large"
            type="primary"
            class="btn"
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
                { key: 'bankRtgs', value: '银行编号' },
                // { key: 'bankSwift', value: 'Swift代码' },
                { key: 'bankAddress', value: '收款银行地址' }
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

<style scoped lang="scss">
@import '~@/assets/styles/bank-icon.scss';
.flex-box {
    display: flex;
    display: -webkit-flex;
    align-items: center;
}
.space-between {
    justify-content: space-between;
}
.start {
    justify-content: start;
}
.bg-w {
    background: #fff;
}
.flex-box {
    display: flex;
    display: -webkit-flex;
    align-items: center;
}
.space-between {
    justify-content: space-between;
}
.start {
    justify-content: start;
}
.mt-10 {
    margin-top: 10px;
}
.mt-24 {
    margin-top: 24px;
}
.pb-48 {
    padding-bottom: 48px;
}
.gap {
    width: 100%;
    height: 10px;
    background-color: $background-bottom-color;
}
.btn {
    position: fixed;
    width: 100%;
    height: 48px;
    background: rgba(40, 90, 200, 1);
    text-align: center;
    border-radius: unset !important;
    line-height: 48px;
    cursor: pointer;
    color: #fff;
    font-size: 16px;
    bottom: 0;
    left: 0;
}

.bank-transfer-box {
    height: 111px;
    .bank-icon {
        width: 22px;
        height: 22px;
    }
    .bank-title {
        font-size: 12px;
        opacity: 0.5;
        margin-left: 5px;
    }
    .txt {
        padding: 0 14px;
        p {
            &:last-child {
                margin-left: 30px;
            }
            .label {
                opacity: 0.5;
            }
        }
    }
    p {
        font-size: 12px;
        line-height: 20px;
        text-align: center;
        img {
            margin-top: 5px;
        }
    }
    .inner {
        padding: 14px 14px 15px;
    }
    .title {
        font-size: 14px;
        line-height: 24px;
        font-weight: 500;
        color: rgba(53, 53, 71, 1);
    }
}
.account-box {
    padding: 14px;
    .title {
        font-size: 18px;
        font-weight: 500;
        color: rgba(53, 53, 71, 1);
        line-height: 22px;
    }
    .fps-title {
        margin-top: 24px;
        text-align: center;
        font-size: 14px;
        font-weight: 400;
        color: rgba(53, 53, 71, 0.5);
        line-height: 20px;
    }
    .fps-code {
        text-align: center;
        font-size: 28px;
        font-weight: 500;
        color: rgba(47, 121, 255, 1);
        line-height: 40px;
    }
    .btn-copy {
        margin-top: 12px;
        text-align: center;
        font-size: 12px;
        font-weight: 400;
        color: rgba(53, 53, 71, 0.5);
        line-height: 20px;
    }
}
.info-box {
    ul li {
        padding-top: 12px;
        &:first-child {
            padding-top: 16px;
        }
    }
    .item-left {
        flex: 1;
        .label {
            opacity: 0.5;
        }
    }
    .item-right {
        flex: 2;
    }
}
.icon-arrow {
    width: 31px;
    height: 11px;
}
</style>
