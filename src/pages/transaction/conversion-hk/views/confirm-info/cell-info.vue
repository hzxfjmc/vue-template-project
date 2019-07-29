<template lang="pug">
.cell-info
    .cell-box
        .cell-title {{$t('transferFrom')}}
        .cell-item.flex
            .left {{$t('brokerNameInfo')}}
            .right {{conversionForm.brokerName}}
        .cell-item.flex
            .left {{$t('accountNumber')}}
            .right {{conversionForm.transferAccount}}
        .cell-item.flex
            .left {{$t('accountName')}}
            .right {{curName}}
        template(v-if='conversionForm.brokerId === 0')
            .cell-item.flex
                .left {{judgeCode}}
                .right {{conversionForm.settlementCode}}
            .cell-item.flex
                .left {{$t('contackPerson')}}
                .right {{conversionForm.contact}}
            .cell-item.flex
                .left {{$t('contackPhone')}}
                .right {{conversionForm.telephone}}
    .cell-box
        .cell-title {{$t('transferMsg')}}
        .cell-item.flex
            .left {{$t('transferPep')}}
            .right {{$t('youxin')}}
</template>

<script>
import { mapGetters } from 'vuex'
import { lang } from '@/utils/html-utils'
export default {
    i18n: {
        zhCHT: {
            transferFrom: '轉出方信息',
            brokerNameInfo: '轉出券商',
            accountNumber: '賬戶號碼',
            accountName: '賬戶姓名',
            ccassCode: 'CCASS代碼',
            dtcCode: 'DTC代碼',
            contackPerson: '聯繫人',
            contackPhone: '聯繫人電話',
            transferMsg: '接收方資訊',
            transferPep: '接收券商',
            youxin: '友信證劵有限公司',
            cashAccount: '現金賬戶',
            promiseAccount: '保證金賬戶',
            notOpenAccount: '暫未開戶',
            hkStock: '港股',
            usStock: '美股'
        },
        zhCHS: {
            transferFrom: '转出方信息',
            brokerNameInfo: '转出券商',
            accountNumber: '账户号码',
            accountName: '账户姓名',
            ccassCode: 'CCASS代码',
            dtcCode: 'DTC代码',
            contackPerson: '联系人',
            contackPhone: '联系人电话',
            transferMsg: '接收方信息',
            transferPep: '接收券商',
            youxin: '友信证券有限公司',
            cashAccount: '现金账户',
            promiseAccount: '保证金账户',
            notOpenAccount: '暂未开户',
            hkStock: '港股',
            usStock: '美股'
        },
        en: {
            transferFrom: 'Transfer From',
            brokerNameInfo: 'Broker Name',
            accountNumber: 'Account No.',
            accountName: 'Account Name',
            ccassCode: 'CCASS No.',
            dtcCode: 'DTC No.',
            contackPerson: 'Contact Person',
            contackPhone: 'Contact No.',
            transferMsg: 'Receiver information',
            transferPep: 'Transfer To',
            youxin: 'uSMART Securities Limited',
            cashAccount: 'Cash account',
            promiseAccount: 'Margin Account',
            notOpenAccount: 'Have not opened an account yet',
            hkStock: 'HK Stock',
            usStock: 'US Stock'
        }
    },
    keepalive: true,
    props: {
        conversionForm: {
            type: Object,
            default: () => {
                return {}
            }
        },
        curName: {
            type: String,
            default: ''
        }
    },
    computed: {
        judgeCode() {
            return this.conversionForm.exchangeType === 0
                ? this.$t('ccassCode')
                : this.$t('dtcCode')
        },
        accountTypeName() {
            return this.user.accountType === 1
                ? this.$t('cashAccount')
                : this.$t('promiseAccount')
        },
        userFundAccount() {
            if (!this.user.fundAccount) {
                return this.$t('notOpenAccount')
            }
            //英文加空格，这里写的不好，按理应该把这两个属性合为一个属性，i18n里直接拼
            if (lang === 'en') {
                return this.conversionForm.exchangeType === 0
                    ? `${this.$t('hkStock')} ${
                          this.accountTypeName
                      } ${this.user.fundAccount.substr(-4)}`
                    : `${this.$t('usStock')} ${
                          this.accountTypeName
                      } ${this.user.fundAccount.substr(-4)}`
            } else {
                return this.conversionForm.exchangeType === 0
                    ? `${this.$t('hkStock')}${
                          this.accountTypeName
                      }${this.user.fundAccount.substr(-4)}`
                    : `${this.$t('usStock')}${
                          this.accountTypeName
                      }${this.user.fundAccount.substr(-4)}`
            }
        },
        ...mapGetters([`user`])
    }
}
</script>

<style lang="scss" scoped>
.cell-info {
    padding: 0 $global-padding $global-padding;
    .cell-title {
        font-weight: 500;
        font-size: 16px;
        line-height: 22px;
    }
    .cell-item {
        padding-top: 10px;
        word-break: break-all;
        .left {
            color: $text-color5;
            // padding-left: 10px;
            min-width: 80px;
        }
    }
    .cell-box {
        padding: $global-padding 0;
    }
    .cell-box:last-child {
        border: 0;
    }
}
</style>
