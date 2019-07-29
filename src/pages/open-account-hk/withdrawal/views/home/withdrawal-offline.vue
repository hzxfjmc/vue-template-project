<template lang="pug">
    .full-height.flex-fixed
        title-header(:title="$t('offline.title')")
        .scroll-able.flex-fixed-container
            bank-card-list(:bankCardList="bankCardList" @clickHandle="goFunds")
            .bank-add(v-if="!bankCardList.length" @click="goAddAccount")
                .icon-box
                    span.iconfont.icon-add
                p
                    span {{$t('offline.btnText')}}
            .btn-area(v-else @click="goManageAccount")
                img(src="@/assets/img/open-account/withdrawal/edit@2x.png" class="icon-edit")
                span {{$t('offline.btnText2')}}
        history-record(:title="$t('withdrawalRecords')")
</template>
<script>
/**
 * 香港版出金（门店开户）
 * @ Author LINJIAJUN
 * @ Date 2019/04/10
 */
import { mapGetters } from 'vuex'
import { queryOwnValiBankCardBinding } from '@/service/stock-capital-server.js'
export default {
    data() {
        return {
            bankCardList: []
        }
    },
    methods: {
        goFunds(item) {
            this.$router.push({
                name: 'funds',
                query: {
                    bankName: item.bankName,
                    bankCode: item.bankCode,
                    bankAccount: item.bankAccount,
                    accountType: item.accountType,
                    accountTypeName: item.accountTypeName,
                    pageType: 'offline'
                }
            })
        },
        goAddAccount() {
            this.$router.push({
                name: 'account',
                query: { type: 'add', fromPage: 'offline' }
            })
        },
        goManageAccount() {
            this.$router.push({
                name: 'manage-account'
            })
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
    .icon-edit {
        width: 15px;
        height: 15px;
        margin: 3px 5px 0 0;
    }
}
.bank-add {
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    justify-content: center;
    height: 130px;
    border-radius: 8px;
    border: 1px dashed $hk-primary-color;
    margin: 0 20px 0;
    .icon-box {
        text-align: center;
        color: $hk-primary-color;
        .icon-add {
            font-size: 34px;
        }
    }
    p {
        text-align: center;
        font-size: 12px;
        color: $hk-primary-color;
    }
}
</style>
