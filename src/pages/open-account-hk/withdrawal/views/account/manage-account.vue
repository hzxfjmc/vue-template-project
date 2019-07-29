<template lang="pug">
    .full-height.flex-fixed
        title-header(:title="$t('manageAccount.title')")
        .scroll-able.flex-fixed-container
            bank-card-list(:bankCardList="bankCardList" :typeList="typeList" @delHandle="delBankCard" @editHandle="editBankCard")
            .btn-area(@click="goAddAccount")
                img(src="@/assets/img/open-account/withdrawal/add.png")
                span {{$t('manageAccount.add')}}
        history-record(:title="$t('withdrawalRecords')")
</template>
<script>
/**
 * 香港版-出金（门店开户）管理收款账户
 * @ Author LINJAIJUN
 * @ Date 2019/04/10
 */
import { mapGetters } from 'vuex'
import {
    queryOwnValiBankCardBinding,
    delBankCardBinding
} from '@/service/stock-capital-server.js'
export default {
    data() {
        return {
            typeList: [],
            bankCardList: []
        }
    },
    methods: {
        goAddAccount() {
            if (this.bankCardList.length < 5) {
                this.$router.push({
                    name: 'account',
                    query: { type: 'add', fromPage: 'manage-account' }
                })
            } else {
                this.$alert({
                    message: this.$t('manageAccount.tips1'),
                    confirmButtonText: this.$t('manageAccount.btnTextConfirm')
                })
            }
        },
        editBankCard(item) {
            this.$router.push({
                name: 'account',
                query: {
                    type: 'edit',
                    fromPage: 'manage-account',
                    bindingId: item.bindingId
                }
            })
        },
        delBankCard(item) {
            this.$confirm({
                message: this.$t('manageAccount.tips2'),
                confirmButtonText: this.$t('manageAccount.btnText')
            })
                .then(async () => {
                    try {
                        let params = {
                            bindingId: item.bindingId,
                            deleted: 2 // 是否删除 1-有效 2-删除
                        }
                        await delBankCardBinding(params)
                        this.$toast(this.$t('manageAccount.tips3'))
                        this.getBankCardList()
                    } catch (e) {
                        this.$toast(e.msg || this.$t('manageAccount.tips4'))
                    }
                })
                .catch(() => {})
        },
        async getBankCardList() {
            try {
                let params = {
                    userId: this.user.userId
                }
                this.$loading()
                let list = await queryOwnValiBankCardBinding(params)
                list.forEach(item => {
                    item.accountTypeList = [item.accountTypeName]
                })
                this.bankCardList = list
                this.typeList =
                    this.bankCardList.length >= 1 ? ['del', 'edit'] : []
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
        delete window.h5HistoryBack
        window.h5HistoryBack = () => {
            if (this.$route.name === 'manage-account') {
                this.$router.replace({ name: 'home' })
            }
            return true
        }
        this.getBankCardList()
    }
}
</script>

<style scoped lang="scss">
.btn-area {
    font-size: 14px;
    font-weight: 400;
    color: rgba(53, 53, 71, 0.7);
    text-align: center;
    line-height: 24px;
    img {
        width: 24px;
        height: 24px;
        margin-right: 6px;
    }
}
</style>
