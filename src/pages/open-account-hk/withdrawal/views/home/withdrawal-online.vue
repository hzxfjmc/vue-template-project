<template lang="pug">
    .full-height.flex-fixed
        title-header(:title="$t('online.title')")
        .scroll-able.flex-fixed-container
            bank-card-list(:bankCardList="bankCardList" @clickHandle="goFunds")
            .btn-area(@click="redirect")
                img(src="@/assets/img/open-account/withdrawal/edit@2x.png" class="icon-edit")
                span {{$t('online.btnText')}}
        history-record(:title="$t('withdrawalRecords')")
</template>
<script>
/**
 * 香港版出金（线上开户）
 * @ Author LINJIAJUN
 * @ Date 2019/04/09
 */
import { mapGetters } from 'vuex'
export default {
    data() {
        return {
            bankCardList: []
        }
    },
    methods: {
        goFunds(item) {
            let accountType = null
            let accountTypeList = []
            let accountTypeName = ''
            let cys = item.cys.filter(item => {
                return item.deleted === 1
            })
            if (cys.length) {
                cys.forEach(item => {
                    accountTypeList = [...accountTypeList, item.moneyType]
                })
                if (
                    accountTypeList.includes(1) &&
                    accountTypeList.includes(2) // 币种类型	(0-人民币，1-美元，2-港币)
                ) {
                    accountType = 3 // 自定义，仅用于判断
                    accountTypeName = '综合账户' // 出金银行账户类型1-港币账户，2-美元账户，9-综合账户（全部币种）
                }
                if (
                    accountTypeList.length === 1 &&
                    accountTypeList.includes(1)
                ) {
                    accountType = 2
                    accountTypeName = cys[0].moneyTypeName
                }
                if (
                    accountTypeList.length === 1 &&
                    accountTypeList.includes(2)
                ) {
                    accountType = 1
                    accountTypeName = cys[0].moneyTypeName
                }
            }
            this.$router.push({
                name: 'funds',
                query: {
                    bankName: item.bankName,
                    bankCode: item.bankCode,
                    bankAccount: item.bankAccount,
                    accountType: accountType,
                    accountTypeName: accountTypeName,
                    pageType: 'online'
                }
            })
        },
        redirect() {
            location.href = `/webapp/open-account-hk/deposit.html#/manage-account`
        },
        async queryBankCardBookList() {
            try {
                this.$loading()
                let params = {
                    deleted: 1,
                    pageNum: 1,
                    pageSize: 20
                }
                let { list } = await this.$depositService.queryBankCardBookList(
                    params
                )
                list.forEach(item => {
                    item.accountTypeList = []
                    item.cys.forEach(subItem => {
                        if (subItem.deleted === 1) {
                            item.accountTypeList.push(subItem.moneyTypeName)
                        }
                    })
                })
                this.bankCardList = list
                this.$close()
            } catch (e) {
                this.$toast(e.msg || this.$t('netErrorTips'))
            }
        }
    },
    computed: {
        ...mapGetters([`user`])
    },
    created() {
        this.queryBankCardBookList()
    }
}
</script>

<style scoped lang="scss">
.btn-area {
    font-size: 14px;
    font-weight: 400;
    color: rgba(53, 53, 71, 0.7);
    text-align: center;
    .icon-edit {
        width: 15px;
        height: 15px;
        margin: 3px 5px 0 0;
    }
}
</style>
