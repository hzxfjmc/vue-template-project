<template lang="pug">
.collection-infomation-box
    .title-h2 {{$t(`mode${collectionsInfo.mode}`)}}
    .sub-title(v-if="collectionsInfo.mode === 3") {{$t('donotAccept')}}
    .h2-content
        .content-item 
            span.item-title {{$t('bankChargeInfo')}}：
            span {{collectionsInfo.bankPoundage}}
            span.iconfont.icon-warning(@click="showTips")
        .content-item 
            span.item-title {{$t('arrivalInfo')}}：
            span {{collectionsInfo.accountingDate}}
    .copy-text
        .copy-tip {{$t('clickToCopy')}}
        template(v-if="collectionsInfo.mode == 1")
            van-cell(:title="$t('FPSCode')" :value="bankAccountInfo.accountFps" @click="copy(bankAccountInfo.accountFps)")
            van-cell(:title="$t('bankNameMoney')" :value="bankAccountInfo.bankName" @click="copy(bankAccountInfo.bankName)")
            van-cell(:title="$t('accountNameMon')" :value="bankAccountInfo.accountName" @click="copy(bankAccountInfo.accountName)")
            van-cell(:title="$t('bankCode')" :value="bankAccountInfo.bankRtgs" @click="copy(bankAccountInfo.bankRtgs)")
        template(v-else)
            van-cell(:title="$t('HKDAccount')" :value="bankAccountInfo.accountNoHk" @click="copy(bankAccountInfo.accountNoHk)")
            van-cell(:title="$t('USDAccount')" :value="bankAccountInfo.accountNoUs" @click="copy(bankAccountInfo.accountNoUs)")
            van-cell(:title="$t('bankName')" :value="bankAccountInfo.bankName" @click="copy(bankAccountInfo.bankName)")
            van-cell(:title="$t('bankCode')" :value="bankAccountInfo.bankRtgs" @click="copy(bankAccountInfo.bankRtgs)")
            van-cell(:title="$t('accountName')" :value="bankAccountInfo.accountName" @click="copy(bankAccountInfo.accountName)")
        .copy-text-problem(@click="goHelpCenter") {{$t('anyDifficult')}}？
</template>

<script>
import { bankAccountBankRef } from '@/service/stock-capital-server.js'
import { createNamespacedHelpers } from 'vuex'
const { mapMutations } = createNamespacedHelpers('apply')
import jsBridge from '@/utils/js-bridge'
import { Toast } from 'vant'
export default {
    i18n: {
        zhCHS: {
            mode1: 'FPS转数快',
            mode2: '网上转账',
            mode3: '银行柜台/ATM',
            donotAccept: '不支持无记名存入资金',
            bankChargeInfo: '手续费',
            arrivalInfo: '预计到账时间',
            noMoreThan: '单笔限额',
            clickToCopy: '点击信息可复制',
            FPSCode: 'FPS识别码',
            bankNameMoney: '收款银行名称',
            accountNameMon: '收款账户名称',
            HKDAccount: '港币账户',
            USDAccount: '美元账户',
            bankName: '银行名称',
            bankCode: '银行编号',
            accountName: '账户名称',
            anyDifficult: '遇到问题',
            bankChargeInfo2: '银行手续费',
            referenceOnly: '银行手续费仅供参考，具体以银行为准',
            usMartFee: '友信证券在转账中不收取任何费用',
            okToKnow: '我知道了',
            copied: '已复制',
            errorTip: '网络开小差了，请稍后重试'
        },
        zhCHT: {
            mode1: 'FPS轉數快',
            mode2: '網上轉賬',
            mode3: '銀行櫃臺/ATM',
            donotAccept: '不支持無記名存入資金',
            bankChargeInfo: '手續費',
            arrivalInfo: '預計到賬時間',
            noMoreThan: '單筆限額',
            clickToCopy: '點擊信息可複製',
            FPSCode: 'FPS ID',
            bankNameMoney: '收款銀行名稱',
            accountNameMon: '收款賬戶名稱',
            HKDAccount: '港幣賬戶',
            USDAccount: '美元賬戶',
            bankName: '銀行名稱',
            bankCode: '銀行編號',
            accountName: '賬戶名稱',
            anyDifficult: '遇到問題',
            bankChargeInfo2: '銀行手續費',
            referenceOnly: '銀行手續費僅供參考，具體以銀行為準',
            usMartFee: '友信證券在轉賬中不收取任何費用',
            okToKnow: '我知道了',
            copied: '已復制',
            errorTip: '網絡開小差了，請稍後重試'
        },
        en: {
            mode1: 'FPS',
            mode2: 'Online Transfer',
            mode3: 'Bank Counter / ATM',
            donotAccept: "Don't accept cash deposit",
            bankChargeInfo: 'Bank Charge',
            arrivalInfo: 'Arrival',
            noMoreThan: 'No More Than',
            clickToCopy: 'Click to Copy',
            FPSCode: 'FPS ID',
            bankNameMoney: 'Bank Name',
            accountNameMon: 'Account Name',
            HKDAccount: 'HKD Account',
            USDAccount: 'USD Account',
            bankName: 'Bank Name',
            bankCode: 'Bank Code',
            accountName: 'Account Name',
            anyDifficult: 'Any difficulty',
            bankChargeInfo2: 'Bank Charge',
            referenceOnly:
                'Bank charge is for reference only. Actual charge are subject to bank latest announcement.',
            usMartFee: "uSMART don't charge any fee for the bank transfer.",
            okToKnow: 'OK',
            copied: 'Copied',
            errorTip: 'The network is off. Please try again later'
        }
    },
    props: {
        collectionsInfo: {
            type: Object,
            default: () => {
                return {
                    accountingDate: '',
                    bankPoundage: '',
                    mode: '',
                    receivingBankCode: '',
                    receivingBankName: '',
                    singleLimit: ''
                }
            }
        },
        index: {
            type: Number,
            default: null
        }
    },
    data() {
        return {
            bankAccountInfo: {}
        }
    },
    async created() {
        try {
            let accountList = await bankAccountBankRef({
                bankCode: this.collectionsInfo.receivingBankCode,
                accountDirection: 1, // 账户方向 1-收款账户 2-付款账户
                accountnStatus: 1 // 账户状态 1-启用中，2-失效 字段后台写错，影响面太大，不宜修改
            })
            let bankAccountInfo = accountList[0]
            // 根据不同账户类型展示不同的账号
            let accountInfo = {
                accountNoHk: '',
                accountNoUs: ''
            }
            accountList.forEach(item => {
                switch (item.accountType) {
                    case 1:
                        bankAccountInfo.accountNoHk = item.accountNo
                        accountInfo.accountNoHk = item.accountNo
                        break
                    case 2:
                        bankAccountInfo.accountNoUs = item.accountNo
                        accountInfo.accountNoUs = item.accountNo
                        break
                    case 9:
                        bankAccountInfo.accountNoHk = item.accountNo
                        bankAccountInfo.accountNoUs = item.accountNo
                        accountInfo.accountNoHk = item.accountNo
                        accountInfo.accountNoUs = item.accountNo
                        break
                }
            })
            this.bankAccountInfo = bankAccountInfo
            this.$emit('get-collections-info', accountInfo, this.index)
        } catch (e) {
            this.$toast(e.msg || this.$t('errorTip'))
        }
    },
    methods: {
        ...mapMutations(['initMutation']),
        goHelpCenter() {
            let url = location.origin + '/webapp/market/help.html'
            this.$jsBridge.gotoNewWebview(url)
        },
        showTips() {
            this.$alert({
                className: 'alert-box',
                title: this.$t('bankChargeInfo2'),
                message: `${this.$t('referenceOnly')}<br>${this.$t(
                    'usMartFee'
                )}`,
                confirmButtonText: this.$t('okToKnow')
            }).then(() => {})
        },
        copy(content) {
            if (!content) return false
            let toastHtml = `
            <div class="toast-box">
                <div class="content">${content}</div>
                <div class="copy-tips">${this.$t('copied')}</div>
            </div>
            `
            jsBridge
                .callApp('command_copy_to_pasteboard', {
                    content: content
                })
                .then(res => {
                    if (res === 'success') {
                        Toast({
                            type: 'html',
                            message: toastHtml
                        })
                    }
                })
        }
    },
    computed: {
        receivingBankCode() {
            return this.collectionsInfo.receivingBankCode
        }
    }
}
</script>

<style lang="scss">
.collection-infomation-box {
    .van-cell {
        padding: 0;
        line-height: 45px;
        font-size: 16px;
    }
    .van-cell:not(:last-child)::after {
        border: none;
    }
}
.toast-box {
    width: 120px;
    height: 40px;
    padding: 0 5px;
    display: flex;
    display: -webkit-flex;
    text-align: center;
    justify-content: center;
    flex-direction: column;
    justify-items: center;
    .copy-tips {
        padding-top: 10px;
    }
}
.alert-box.van-dialog {
    border-radius: 14px !important;
    .van-dialog__header {
        font-size: 20px;
        font-weight: 400;
        padding-right: 20px;
        padding-left: 20px;
    }
    .van-dialog__message {
        font-size: 16px;
        line-height: 22px;
    }
}
</style>

<style lang="scss" scoped>
.collection-infomation-box {
    background: $hk-background-color;
    .title-h2 {
        padding: 20px 0 10px 0;
        font-size: 20px;
        line-height: 28px;
    }
    .sub-title {
        font-size: 12px;
        color: $hk-text-color5;
    }
    .h2-content {
        display: flex;
        flex-wrap: wrap;
        line-height: 22px;
        font-size: 12px;
        .content-item {
            min-width: 50%;
            word-break: break-all;
            .item-title {
                color: $hk-text-color5;
            }
        }
    }
    .copy-text {
        padding: 20px $global-padding 30px;
        margin-top: 16px;
        background: url('~@/assets/img/open-account-hk/apply/collection-bg@2x.png')
            left top no-repeat;
        background-size: 100% 100%;
        .copy-tip {
            text-align: right;
            font-size: 12px;
            color: rgba(57, 57, 57, 0.6);
        }
        .copy-text-problem {
            color: $hk-primary-color;
            text-align: center;
            font-size: 12px;
            line-height: 17px;
            padding-top: 33px;
        }
    }
    .icon-warning {
        position: relative;
        top: 1px;
        left: 5px;
    }
}
</style>
