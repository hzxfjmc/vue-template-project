<template lang="pug">
    .full-height.flex-fixed
        title-header.padding-0(:title="title" v-if="fromPage === 'select-bank'" :titleStyleObj="{'fontSize':'18px',padding:'14px 19px 0px'}")
        title-header(:title="title" v-else)
        .scroll-able.flex-fixed-container
            bank-card-list(:bankCardList="bankCardList" :typeList="typeList" @delHandle="bankCardBookEdit")
            .btn-area(@click="goAddAccount" v-if="bankCardList.length < 5")
                img(src="@/assets/img/open-account/withdrawal/add.png")
                span {{$t('manageAccount.add')}}
        history-record(:title="$t('depositRecords')")
</template>
<script>
/**
 * 香港版-管理银行账户
 * @ Author LINJAIJUN
 * @ Date 2019/04/09
 */
import { mapGetters } from 'vuex'
import {
    bankCardBookList,
    bankCardBookEdit
} from '@/service/stock-capital-server'
export default {
    data() {
        return {
            typeList: [],
            bankCardList: []
        }
    },
    methods: {
        goAddAccount() {
            this.goStep('add-account', true)
        },
        goStep(pageName, showBarTitle) {
            // 线上开户大陆入金
            if (this.fromPage === 'select-bank') {
                this.$jsBridge.gotoNativeModule(
                    `yxzq_goto://webview?url=${encodeURIComponent(
                        window.location.origin +
                            `/webapp/open-account/deposit.html#/${pageName}`
                    )}&titleBarVisible=${showBarTitle}`
                )
            } else {
                this.$jsBridge.gotoNativeModule(
                    `yxzq_goto://webview?url=${encodeURIComponent(
                        window.location.origin +
                            `/webapp/open-account-hk/deposit.html#/${pageName}`
                    )}&titleBarVisible=${showBarTitle}`
                )
            }
        },
        bankCardBookEdit(item) {
            this.$confirm({
                title: this.$t('manageAccount.delTitle'),
                message: this.$t('manageAccount.delContent'),
                confirmButtonText: this.$t('manageAccount.delConfirm'),
                cancelButtonText: this.$t('manageAccount.delCancel')
            })
                .then(async () => {
                    try {
                        let params = {
                            bankAccount: item.bankAccount,
                            bookDeleted: 0
                        }
                        await bankCardBookEdit(params)
                        this.$toast(this.$t('manageAccount.delSuccess'))
                        this.bankCardBookList()
                    } catch (e) {
                        this.$toast(e.msg || this.$t('manageAccount.delFail'))
                    }
                })
                .catch(() => {})
        },
        async bankCardBookList() {
            try {
                this.$loading()
                let params = {
                    deleted: 1,
                    pageNum: 1,
                    pageSize: 20
                }
                let { list } = await bankCardBookList(params)
                this.bankCardList = list
                this.typeList = this.bankCardList.length >= 2 ? ['del'] : []
                this.$close()
            } catch (e) {
                this.$toast(e.msg || this.$t('netErrorTips'))
            }
        }
    },
    computed: {
        title() {
            return this.$t('manageAccount.title')
        },
        fromPage() {
            return this.$route.query.fromPage || ''
        },
        ...mapGetters([`user`])
    },
    created() {
        this.bankCardBookList()
    }
}
</script>

<style scoped lang="scss">
.padding-0 {
    padding: 0;
}
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
