<template lang="pug">
    yx-container-better.collection-infomation.hk-open-account
        .collection-infomation-main(slot="main")
            .container-title
                .bank-logo
                    img(:src="bankLogo" v-if="bankLogo")
                    .bank-icon(v-else :class="bankClsName")
                .title {{bankName}}
            p.container-title-tip {{$t('anyWayToTransfer')}}
            ContentBox(
                v-for="collectionsInfo, index in collectionsList"
                :key="index"
                :index="index"
                :collectionsInfo="collectionsInfo"
                v-on:get-collections-info="getCollectionsInfo"
            )
        van-button(
            slot="bottom"
            type="primary"
            size="large"
            class="bottom-button"
            @click="goNextStep"
        ) {{$t('transferredMyAccount')}}
</template>

<script>
import ContentBox from './content-box.vue'
import { bankInfoHKSelectInfo } from '@/service/config-manager.js'
import { bankAccountValid } from '@/service/stock-capital-server.js'
import bankCodeMap from '@/utils/common/bank-code-map'
import LS from '@/utils/local-storage.js'

export default {
    i18n: {
        zhCHS: {
            transferredMyAccount: '我已转账，提交确认',
            anyWayToTransfer: '请通过以下任一方式发起转账'
        },
        zhCHT: {
            transferredMyAccount: '我已轉賬，提交確認',
            anyWayToTransfer: '請通過以下任一方式發起轉賬'
        },
        en: {
            transferredMyAccount: 'Submit Deposit Proof',
            anyWayToTransfer: 'Support Below Methods'
        }
    },
    data() {
        return {
            bankName: '',
            bankLogo: '',
            bankClsName: '',
            custBankAcct: '',
            collectionsList: [],
            collectionsInfo: {},
            collectionsInfoList: []
        }
    },
    components: {
        ContentBox
    },
    created() {
        this.bankName = this.$route.query.bankName
        this.bankLogo = this.$route.query.bankLogo
        this.bankClsName = this.bankLogo
            ? ''
            : `bank-icon-${bankCodeMap[this.$route.params.bankCode].className}` ||
              'bank-icon-other'
        this.custBankAcct = this.$route.query.custBankAcct
        this.bankInfoHKSelectInfo()
    },
    methods: {
        getCollectionsInfo(item) {
            this.collectionsInfoList.push(item)
        },
        goNextStep() {
            let params = {
                custBankName: this.bankName,
                custBankCode: this.$route.params.bankCode,
                bankAcct: this.collectionsInfo.accountNo,
                custBankAcct: this.custBankAcct,
                applyType: this.$route.query.applyType
            }
            LS.put('collectionsInfoList', this.collectionsInfoList)
            this.$router.push({ name: 'submit-record', query: params })
        },
        async bankInfoHKSelectInfo() {
            try {
                this.$loading()
                let data = await bankInfoHKSelectInfo(
                    this.$route.params.bankCode
                )
                let bankCodes = []
                data.forEach(item => {
                    bankCodes.push(item.receivingBankCode)
                })
                let params = {
                    bankCodes: bankCodes
                }
                // 根据所有bankCode查询有效公司银行列表
                let companyData = await bankAccountValid(params)
                // 根据有效的公司银行列表筛选展示的银行列表
                let filterBankList = data.filter(item => {
                    return companyData.bankCodes.includes(
                        item.receivingBankCode
                    )
                })
                this.collectionsList = filterBankList
                this.$close()
            } catch (e) {
                this.$toast(e.msg || '網絡開小差了，請稍後重試')
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/styles/bank-icon-hk.scss';
#app .collection-infomation {
    background: $hk-background-color;
}
.collection-infomation {
    .bank-icon {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 1px solid rgba(225, 225, 225, 0.5);
    }
    background: $hk-background-color;
    .collection-infomation-main {
        .container-title {
            display: flex;
            align-items: center;
            .title {
                padding-left: 6px;
                max-width: 85%;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }
        .bank-logo {
            width: 32px;
            height: 32px;
            margin-top: 2px;
            img {
                width: 100%;
            }
        }
        padding: 0 $global-padding;
        .container-title-tip {
            font-size: 12px;
            line-height: 17px;
            color: $hk-text-color4;
        }
    }
}
</style>
