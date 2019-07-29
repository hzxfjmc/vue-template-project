<template lang="pug">
    .full-height.flex-fixed.page-wrapper
        .scroll-able.flex-fixed-container
            .page-inner
                title-header.padding-0(:title="$t('add.title')" :titleStyleObj="{'fontSize':'18px','paddingLeft':'0'}")
                .tips-box
                    .box-inner
                        span {{$t('add.tips')}}
                        a.more(href="javascript:;" @click="showDetail") {{$t('add.knowMore')}}>
                .main-content
                    .sub-title {{$t('add.subTitle')}}
                    .bank-list-container
                        bank-list-dl(:bankList="bankList" @clickHandle="redirect")
</template>
<script>
/**
 * 添加银行账户（线上开户）
 * @ Author LINJAIJUN
 * @ Date 2019/07/10
 */
import { mapGetters } from 'vuex'
import { getCosUrl } from '@/utils/cos-utils'
import { bankInfoHkSelect } from '@/service/config-manager'
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
        async bankInfoHkSelect() {
            try {
                this.$loading()
                let data = await bankInfoHkSelect()
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
        this.bankInfoHkSelect()
    }
}
</script>

<style scoped lang="scss">
.page-inner {
    padding: 14px 19px 14px;
}
.padding-0 {
    padding: 0;
}
.tips-box {
    .box-inner {
        color: $text-color5;
        font-size: 16px;
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
}
</style>
