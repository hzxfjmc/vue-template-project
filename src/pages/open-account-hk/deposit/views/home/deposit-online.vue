<template lang="pug">
    .full-height.flex-fixed
        title-header(:title="$t('online.title')")
        .scroll-able.flex-fixed-container
            bank-card-list(:bankCardList="bankCardList" @clickHandle="redirect")
            .btn-area(@click="goManageAccount")
                img(src="@/assets/img/open-account/withdrawal/edit@2x.png" class="icon-edit")
                span {{$t('online.manageAccount')}}
        history-record(:title="$t('depositRecords')")
</template>
<script>
/**
 * 香港版入金（线上开户）
 * @ Author LINJAIJUN
 * @ Date 2019/04/08
 */
import { mapGetters } from 'vuex'
export default {
    data() {
        return {
            bankCardList: []
        }
    },
    methods: {
        goManageAccount() {
            this.$router.push({ name: 'manage-account' })
        },
        redirect(item) {
            this.$router.push({
                name: 'collection-information',
                params: { bankCode: item.bankCode },
                query: {
                    bankName: item.bankName,
                    bankLogo: item.logo,
                    custBankAcct: item.bankAccount,
                    applyType: 'normal'
                }
            })
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
