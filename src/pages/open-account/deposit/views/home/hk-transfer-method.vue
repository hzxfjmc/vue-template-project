<template lang="pug">
    div
        yx-step(
        :data="stepData"
        :active="0")
        .gap
        .fps-box()
            .title 选择您的转出银行
        .bank-box
            .s-sub-title
                span 请使用与您友信证券账户同名的银行账户进行转账
            .bank-list
                .bank-list-item(v-for="item in bankList" @click="goTransferMoney(item)")
                    .flex-box
                        .bank-icon(:class="{'bank-bdn':!item.logo}")
                            img(:src="item.imgLoad ? item.logo : '/webapp/open-account/open-account/bank-icon/bank_default@2x.png'")
                        .bank-title {{item.bankName}}
                    .text-box(v-if="item.bankName!=='其它银行'")
                        p
                            span.label 手续费：
                            span {{currency ==='2'? item.hkdPoundage : item.usdPoundage}}
                        p
                            span.label 预计到账时间：
                            span {{currency === '2'?'1个工作日内':item.accountingDate}}
                    .flex-box.text-box(v-else)
                        p
                            span.label 如您没有表中的银行卡，请选择此项
</template>
<script>
/**
 * 入金流程-选择汇出银行（香港卡）
 * @ Author LINJAIJUN
 * @ Date 2018/12/27
 */
import { mapGetters } from 'vuex'
import LS from '@/utils/local-storage.js'
import { getCosUrl } from '@/utils/cos-utils'
export default {
    methods: {
        goHelpCenter(type) {
            let url = ''
            if (type === 'FPS') {
                url =
                    location.origin + '/webapp/market/generator.html?key=XY013'
            } else {
                url =
                    location.origin + '/webapp/market/generator.html?key=XY014'
            }
            this.$jsBridge.gotoNewWebview(url)
        },
        // FPS转数快
        goTransferFPS() {
            this.$store.dispatch('deposit/setTransferMethod', '2')
            this.$router.push({
                name: 'transfer-fps'
            })
        },
        // 汇款
        goTransferMoney(item) {
            this.$store.dispatch('deposit/setTransferMethod', '1')
            LS.remove('bankData')
            LS.put('bankData', item)
            this.$router.push({
                name: 'transfer-money',
                params: {
                    bankData: item
                }
            })
        },
        // 获取银行展示信息列表
        async bankInfoDisplaySelect(cardAttribute) {
            let params = {
                cardAttribute: cardAttribute,
                mode: '1' // 入金方式：1-汇款 2-fps 3-跨境汇款
            }
            try {
                this.$loading()
                let data = await this.$depositService.bankInfoDisplaySelect(
                    params
                )
                let bankCodes = []
                data.forEach(async item => {
                    bankCodes.push(item.receivingBankCode)
                    if (item.logo) {
                        item.imgLoad = false
                        await getCosUrl(item.logo).then(res => {
                            item.logo = res
                            let img = new Image()
                            img.src = item.logo
                            img.onload = () => {
                                item.imgLoad = true
                            }
                            console.log(item.logo)
                        })
                    }
                })
                let params2 = {
                    bankCodes: bankCodes,
                    moneyType: this.currency
                }
                // 根据币种查询公司银行列表
                let companyData = await this.$depositService.bankAccountValid(
                    params2
                )
                // 根据公司银行列表筛选展示的银行列表
                let filterBankList = data.filter(item => {
                    return companyData.bankCodes.includes(
                        item.receivingBankCode
                    )
                })
                this.bankList = filterBankList
                this.$close()
            } catch (e) {
                this.$toast(e.msg || '网络开小差，请稍后再试')
            }
        }
    },
    computed: {
        ...mapGetters({
            currency: `deposit/currency`,
            bankAttribute: `deposit/bankAttribute`
        }),
        currencyStr() {
            return this.$constant.currency[this.currency]
        },
        stepData() {
            return this.$constant.stepData
        }
    },
    data() {
        return {
            bankList: []
        }
    },
    created() {
        this.bankInfoDisplaySelect(this.bankAttribute)
    }
}
</script>

<style scoped lang="scss">
@import '~@/assets/styles/bank-icon.scss';
.flex-box {
    display: flex;
    display: -webkit-flex;
    justify-content: flex-start;
    align-items: center;
}
.gap {
    width: 100%;
    height: 10px;
    background-color: $background-bottom-color;
}
.bd-b {
    border-bottom: 1px solid rgba(225, 225, 225, 0.5);
}
.mt-15 {
    margin-top: 15px;
}
.mb-15 {
    margin-bottom: 15px;
}
.fps-box {
    background: #fff;
    padding: 14px 14px 0;
    .title {
        font-size: 18px;
        font-weight: 500;
        color: rgba(53, 53, 71, 1);
        line-height: 22px;
    }
    .sub-title {
        margin-top: 20px;
        font-size: 16px;
        font-weight: 600;
        color: rgba(53, 53, 71, 1);
        line-height: 22px;
    }
    .s-sub-title {
        font-size: 12px;
        font-weight: 400;
        color: rgba(53, 53, 71, 0.5);
        line-height: 24px;
        a {
            color: $text-link-color;
        }
    }
}
.bank-box {
    background: #fff;
    padding: 8px 14px 0;
    .title {
        font-size: 16px;
        font-weight: 500;
        color: rgba(53, 53, 71, 1);
    }
    .sub-title {
        font-size: 14px;
        font-weight: 400;
        color: rgba(53, 53, 71, 0.5);
        margin-top: 4px;
    }
    .s-sub-title {
        font-size: 14px;
        font-weight: 400;
        color: rgba(53, 53, 71, 0.5);
        line-height: 20px;
        a {
            color: $text-link-color;
        }
    }
}
.bank-list {
    padding-top: 5px;
}
.bank-list-item {
    padding: 10px 0;
    border-bottom: 1px solid rgba(225, 225, 225, 0.5);
    p {
        font-size: 12px;
        flex: 4;
        margin-left: 0px;
        &:first-child {
            flex: 2;
            margin-left: 0px;
        }
        .label {
            color: rgba(53, 53, 71, 0.5);
        }
    }
}
.bank-title {
    font-size: 16px;
    font-weight: 500;
    color: rgba(53, 53, 71, 1);
    line-height: 34px;
    margin-left: 8px;
}
.bank-recommend {
    width: 32px;
    height: 18px;
    background: rgba(245, 93, 131, 1);
    border-radius: 2px;
    font-size: 12px;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    line-height: 18px;
    text-align: center;
    margin-left: 6px;
}
.text-box {
    padding-top: 4px;
}
</style>
