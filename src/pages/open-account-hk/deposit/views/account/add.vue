<template lang="pug">
    .full-height.flex-fixed.page-wrapper
        .scroll-able.flex-fixed-container
            .page-inner
                title-header.padding-0(:title="$t('add.title')")
                .tips-box
                    .box-inner
                        span {{$t('add.tips')}}
                        a.more(href="javascript:;" @click="showDetail") {{$t('add.knowMore')}}>
                .main-content
                    .sub-title {{$t('add.subTitle')}}
                    .bank-list-container
                        bank-list(:bankList="bankList" @clickHandle="redirect")
</template>
<script>
/**
 * 香港版-添加银行账户
 * @ Author LINJAIJUN
 * @ Date 2019/04/09
 */
import { mapGetters } from 'vuex'
import { getCosUrl } from '@/utils/cos-utils'
export default {
    data() {
        return {
            typeList: [],
            bankList: []
        }
    },
    methods: {
        showDetail() {
            this.$alert({
                message: this.$t('add.alertTips'),
                confirmButtonText: this.$t('add.confirmButtonText')
            }).then(() => {})
        },
        async queryHkBankList() {
            try {
                this.$loading()
                let data = await this.$depositService.queryHkBankList()
                data.forEach(item => {
                    if (item.logo) {
                        item.imgLoad = false
                        getCosUrl(item.logo).then(res => {
                            item.logo = res
                            let img = new Image()
                            img.src = item.logo
                            img.onload = () => {
                                item.imgLoad = true
                            }
                        })
                    }
                })
                this.bankList = data
                this.$close()
            } catch (e) {
                this.$toast(e.msg || this.$t('netErrorTips'))
            }
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
        }
    },
    computed: {
        ...mapGetters([`user`])
    },
    created() {
        this.queryHkBankList()
    }
}
</script>

<style scoped lang="scss">
.page-wrapper {
    background: rgba(248, 248, 248, 1);
}
.page-inner {
    padding: 14px 19px 14px;
}
.padding-0 {
    padding: 0;
}
.tips-box {
    margin-top: 14px;
    background: rgba(57, 57, 57, 0.05);
    border-radius: 10px;
    .box-inner {
        padding: 16px 10px;
        color: $hk-text-color;
    }
    .more {
        padding-left: 5px;
        color: $hk-primary-color;
    }
}
.main-content {
    margin-top: 30px;
    .sub-title {
        height: 28px;
        font-size: 20px;
        line-height: 28px;
    }
    .bank-list-container {
        margin-top: 14px;
    }
}
</style>
