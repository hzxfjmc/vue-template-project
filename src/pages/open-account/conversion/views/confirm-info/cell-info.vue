<template lang="pug">
.cell-info
    .cell-box.border-bottom
        .cell-title 转出方信息
        .cell-item.flex
            .left 转出券商
            .right {{conversionForm.brokerName}}
        .cell-item.flex
            .left 账户号码
            .right {{conversionForm.transferAccount}}
        .cell-item.flex
            .left 账户姓名
            .right {{curName}}
        template(v-if='conversionForm.brokerId === 0')
            .cell-item.flex
                .left {{judgeCode}}
                .right {{conversionForm.settlementCode}}
            .cell-item.flex
                .left 联系人
                .right {{conversionForm.contact}}
            .cell-item.flex
                .left 联系人电话
                .right {{conversionForm.telephone}}
    .cell-box
        .cell-title 接收方信息
        .cell-item.flex
            .left 接收券商
            .right 友信证券有限公司
</template>

<script>
import { mapGetters } from 'vuex'
export default {
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
                ? 'CCASS代码'
                : 'DTC代码'
        },
        accountTypeName() {
            return this.user.accountType === 1 ? '现金账户' : '保证金账户'
        },
        userFundAccount() {
            if (!this.user.fundAccount) {
                return '暂未开户'
            }
            return this.conversionForm.exchangeType === 0
                ? `港股${this.accountTypeName}${this.user.fundAccount.substr(
                      -4
                  )}`
                : `美股${this.accountTypeName}${this.user.fundAccount.substr(
                      -4
                  )}`
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
            //padding-left: 10px;
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
