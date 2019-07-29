<template lang="pug">
    yx-container-better.select-bank.hk-open-account
        .select-bank-main(slot="main")
            .container-title {{$t('onlineOpenAccount')}}
            p.remind {{$t('openWay')}}
            p.sub-remind {{$t('selfAccount')}}
            p.title {{$t('selectYouBank')}}
            ul.bank-list
                li(
                    v-for="item, index in list"
                    :key="item.bankName"
                    @click="goNextStep(item)"
                )
                    .img
                        img(:src="item.imgLoad ? item.logo :'/webapp/open-account/open-account/bank-icon/bank_normal@2x.png'")
                    span.name {{item.bankName}}
                    i.tip(v-if="item.identification") {{item.identification}}
</template>

<script>
import { bankInfoHKSelect } from '@/service/config-manager.js'
import { bankAccountValid } from '@/service/stock-capital-server.js'
import { getCosUrl } from '@/utils/cos-utils'
import { createNamespacedHelpers } from 'vuex'
const { mapMutations } = createNamespacedHelpers('apply')
export default {
    i18n: {
        zhCHS: {
            onlineOpenAccount: '网上开户',
            openWay:
                '通过相关银行账户，转账港币$10,000(或美元$1,500)及以上完成身份审核',
            selfAccount:
                '(需为本人同名银行账户，以后将通过该账户存入/取出资金)',
            selectYouBank: '选择您的银行'
        },
        zhCHT: {
            onlineOpenAccount: '網上開戶',
            openWay:
                '通過香港銀行賬戶，轉賬港幣$10,000(或美元$1,500)及以上完成身份審核',
            selfAccount:
                '(需為本人同名銀行賬戶，以後將通過該賬戶存入/取出資金)',
            selectYouBank: '選擇您的銀行'
        },
        en: {
            onlineOpenAccount: 'Online Account Opening',
            openWay:
                'Transfer HK$10,000 (or US$1,500) from your Hong Kong bank account for Identity Verification',
            selfAccount:
                '(Please use your own bank account for deposit and withdrawal afterwards.)',
            selectYouBank: 'Select your bank'
        }
    },
    data() {
        return {
            list: []
        }
    },
    created() {
        this.bankInfoHKSelect()
    },
    methods: {
        ...mapMutations(['initMutation']),
        goNextStep(item) {
            this.initMutation({
                bankName: item.bankName
            })
            this.$router.push({
                name: 'collection-infomation',
                params: {
                    bankCode: item.bankCode
                },
                query: {
                    bankName: item.bankName,
                    bankLogo: item.logo
                }
            })
        },
        async bankInfoHKSelect() {
            try {
                this.$loading()
                let data = await bankInfoHKSelect()
                let bankCodes = []
                if (data && data.length === 0) {
                    this.$close()
                    return false
                }
                data.forEach(item => {
                    let receivingBankCodes =
                        item.receivingBankCode &&
                        item.receivingBankCode.split(',')
                    bankCodes.push(...receivingBankCodes)
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
                let params = {
                    bankCodes: bankCodes
                }
                // 根据所有bankCode查询有效公司银行列表
                let companyData = await bankAccountValid(params)
                // 根据有效的公司银行列表筛选展示的银行列表
                let filterBankList = data.filter(item => {
                    companyData.bankCodes.forEach(bankCode => {
                        if (item.receivingBankCode.includes(bankCode)) {
                            item.flag = true
                        }
                    })
                    return item.flag
                })
                this.list = filterBankList
                this.$close()
            } catch (e) {
                this.$toast(e.msg)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.select-bank {
    background: $hk-background-color;
    .select-bank-main {
        padding: 0 $global-padding $global-padding;
        .remind {
            font-size: 14px;
            color: $hk-primary-color;
            line-height: 20px;
            padding: 16px 10px;
            background: rgba(1, 33, 220, 0.1);
            border-radius: 10px;
            margin-top: $global-padding;
        }
        .sub-remind {
            color: $hk-text-color4;
            font-size: 12px;
            line-height: 17px;
            margin-top: 5px;
        }
        .title {
            margin: 30px 0 19px;
            color: $hk-text-color;
            font-size: 20px;
        }
        .bank-list {
            background: #fff;
            padding: 0 20px;
            box-shadow: 0 1px 8px 1px $hk-text-color1;
            border-radius: 10px;
            li {
                display: flex;
                align-items: center;
                padding: 18px 0;
                border-bottom: 1px dashed $hk-text-color1;
                &:last-child {
                    border-bottom: none;
                }
                .img {
                    width: 34px;
                    height: 34px;
                    display: inline-block;
                    vertical-align: middle;
                    img {
                        max-width: 32px;
                        margin-top: 50%;
                        margin-left: 50%;
                        transform: translate(-50%, -50%);
                    }
                }
                .name {
                    color: $text-color;
                    font-size: 16px;
                    margin: 0px 7px 0 10px;
                    vertical-align: middle;
                }
                .tip {
                    color: #c19e68;
                    border: 1px solid #c19e68;
                    display: inline-block;
                    height: 15px;
                    padding: 0 3px;
                    text-align: center;
                    line-height: 13px;
                    font-size: 10px;
                    border-radius: 1px;
                    font-style: normal;
                    vertical-align: middle;
                }
            }
        }
    }
}
</style>
