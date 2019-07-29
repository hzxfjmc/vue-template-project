<template lang="pug">
    .full-height.flex-fixed.page-wrapper
        .scroll-able.flex-fixed-container
            .page-inner
                title-header.padding-0(:title="$t('offline.title')" :subTitle="$t('offline.subTitle')")
                .step-box
                    .step-item
                        .step-icon
                            img(src="@/assets/img/open-account-hk/deposit/choosebank@2x.png")
                        .step-title {{$t('offline.stepTitle1')}}
                    .step-item
                        .step-line
                    .step-item
                        .step-icon
                            img(src="@/assets/img/open-account-hk/deposit/transfer@2x.png")
                        .step-title {{$t('offline.stepTitle2')}}
                    .step-item
                        .step-line
                    .step-item
                        .step-icon
                            img(src="@/assets/img/open-account-hk/deposit/submit@2x.png")
                        .step-title {{$t('offline.stepTitle3')}}
                .main-content
                    .sub-title {{$t('offline.title2')}}
                    .bank-list-container
                        bank-list(:bankList="bankList" @clickHandle="redirect" :lastUsedText="$t('offline.lastUsedText')")
        history-record(:title="$t('depositRecords')")
</template>
<script>
/**
 * 香港版入金（门店开户）
 * @ Author LINJAIJUN
 * @ Date 2019/04/09
 */
import { mapGetters } from 'vuex'
import { bankAccountValid } from '@/service/stock-capital-server.js'
import { getCosUrl } from '@/utils/cos-utils'
export default {
    data() {
        return {
            bankList: [],
            lastBankInfo: {}
        }
    },
    methods: {
        async rechargeLastSuccess() {
            try {
                this.lastBankInfo = await this.$depositService.rechargeLastSuccess()
            } catch (e) {
                this.$close()
                this.$toast(e.msg || this.$t('netErrorTips'))
            }
        },
        async queryHkBankList() {
            try {
                let data = await this.$depositService.queryHkBankList()
                let bankCodes = []
                if (data && data.length === 0) {
                    this.$close()
                    return false
                }
                data.forEach(item => {
                    let receivingBankCodes = item.receivingBankCode.split(',')
                    bankCodes.push(...receivingBankCodes)
                    if (
                        this.lastBankInfo &&
                        item.bankCode === this.lastBankInfo.acceptBankCode
                    ) {
                        item.lastUsed = true
                        item.order = 1
                    } else {
                        item.order = 0
                    }
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
                let sortList = data.sort((a, b) => {
                    return b.order - a.order
                })

                let params = {
                    bankCodes: bankCodes
                }
                // 根据所有bankCode查询有效公司银行列表
                let companyData = await bankAccountValid(params)
                // 根据有效的公司银行列表筛选展示的银行列表
                let filterBankList = sortList.filter(item => {
                    companyData.bankCodes.forEach(bankCode => {
                        if (item.receivingBankCode.includes(bankCode)) {
                            item.flag = true
                        }
                    })
                    return item.flag
                })
                this.bankList = filterBankList
                this.$close()
            } catch (e) {
                this.$close()
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
    async created() {
        this.$loading()
        await this.rechargeLastSuccess()
        await this.queryHkBankList()
    }
}
</script>

<style scoped lang="scss">
.page-wrapper {
    background: rgba(248, 248, 248, 1);
}
.page-inner {
    padding: 14px 19px 0;
}
.padding-0 {
    padding: 0;
}
.main-content {
    margin-top: 30px;
    .sub-title {
        color: $hk-text-color;
        height: 28px;
        font-size: 20px;
        line-height: 28px;
    }
    .bank-list-container {
        margin-top: 20px;
    }
}
.step-box {
    display: flex;
    display: -webkit-flex;
    justify-content: space-around;
    margin-top: 14px;
    .step-item {
        width: 20%;
        position: relative;
        text-align: center;
    }
    .step-icon {
        margin: 0 auto;
        width: 24px;
        height: 24px;
        img {
            width: 100%;
            max-width: 100%;
        }
    }
    .step-title {
        font-size: 12px;
        color: $hk-text-color;
        opacity: 0.5911;
    }
    .step-line {
        position: absolute;
        bottom: 8px;
        width: 100%;
        height: 1px;
        background: rgba(57, 57, 57, 1);
        opacity: 0.1;
    }
}
</style>
