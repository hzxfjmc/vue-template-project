<template lang="pug">
    .full-height.flex-fixed
        yx-step(
            :data="stepData"
            :active="0")
        .gap
        title-header.padding-0(title="选择您的银行卡" :titleStyleObj="{'fontSize':'18px',padding:'14px 19px 0px'}")
        .scroll-able.flex-fixed-container
            bank-card-list(:bankCardList="bankCardList" @clickHandle="redirect")
            .btn-area(@click="goManageAccount")
                img(src="@/assets/img/open-account/withdrawal/edit@2x.png" class="icon-edit")
                span {{$t('online.manageAccount')}}
        history-record(:title="$t('depositRecords')")
</template>
<script>
/**
 * 大陆版入金（线上开户）
 * @ Author LINJAIJUN
 * @ Date 2019/07/10
 */
import { mapGetters } from 'vuex'
import { bankCardBookList } from '@/service/stock-capital-server'
export default {
    data() {
        return {
            bankCardList: []
        }
    },
    methods: {
        goManageAccount() {
            this.$router.push({
                name: 'manage-account',
                query: { fromPage: 'select-bank' }
            })
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
                this.$close()
            } catch (e) {
                this.$toast(e.msg || this.$t('netErrorTips'))
            }
        }
    },
    computed: {
        ...mapGetters([`user`]),
        stepData() {
            return this.$constant.stepData
        }
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
.gap {
    width: 100%;
    height: 10px;
    background-color: $background-bottom-color;
}
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
