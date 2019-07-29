<template lang="pug">
    div
        yx-step(
        :data="stepData"
        :active="1")
        .gap
        .notice-box
            .inner
                p 大陆银行卡入金有被退回风险，可能产生手续费及换汇损失，如发生资金退回情况，请及时联络银行处理。友信恕不承担银行向客户收取的费用损失。建议您通过香港本地银行卡存入资金。
        .fps-box
            .title 选择您的汇出银行
            .sub-title 跨境汇款
            .s-sub-title
                span 通过银行官网、APP等向友信证券收款账户存入资金
                a(href="javascript:;" @click="goHelpCenter") &nbsp;了解更多
            .bank-list
                .bank-list-item(v-for="item in bankList" @click="goTransferMoney(item)")
                    .flex-box
                        .bank-icon(:class="{'bank-bdn':!item.imgLoad}")
                            img(:src="item.imgLoad ? item.logo : '/webapp/open-account/open-account/bank-icon/bank_normal@2x.png'")
                        .bank-title {{item.bankName}}
                    .flex-box
                        p
                            span.label 手续费：
                            span {{currency =='2'? item.hkdPoundage : item.usdPoundage}}
                        p
                            span.label 预计到账时间：
                            span {{item.accountingDate}}
            .s-sub-title.mt-10
            .s-sub-title
                a(href="javascript:;" @click="goBankCardProcessing") 没有香港银行卡？查看香港银行卡办卡指引 >
</template>
<script>
/**
 * 入金流程-选择汇出银行（大陆卡）
 * @ Author LINJAIJUN
 * @ Date 2018/12/27
 */
import { mapGetters } from 'vuex'
import LS from '@/utils/local-storage.js'
import { getCosUrl } from '@/utils/cos-utils'
export default {
    methods: {
        goHelpCenter() {
            let url =
                location.origin + '/webapp/market/generator.html?key=XY015'
            this.$jsBridge.gotoNewWebview(url)
        },
        // 跨境汇款
        goTransferMoney(item) {
            this.$store.dispatch('deposit/setTransferMethod', '3')
            LS.remove('bankData')
            LS.put('bankData', item)
            this.$router.push({
                name: 'transfer-money-mainland',
                params: {
                    bankData: item
                }
            })
        },
        goBankCardProcessing() {
            let url =
                location.origin +
                '/webapp/open-account/deposit.html#/bank-card-processing?referrer=deposit'
            this.$jsBridge.gotoNewWebview(url)
        },
        // 获取银行展示信息列表
        async bankInfoDisplaySelect(cardAttribute) {
            let params = {
                cardAttribute: cardAttribute,
                mode: '3' // 入金方式：1-汇款 2-fps 3-跨境汇款
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
                            console.log(item.logo)
                            item.logo = res
                            console.log(item.logo)
                            let img = new Image()
                            img.src = item.logo
                            img.onload = () => {
                                item.imgLoad = true
                            }
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
                this.$close()
                this.$toast(e.msg || '网络开小差，请稍后再试')
            }
        }
    },
    computed: {
        ...mapGetters({
            currency: `deposit/currency`,
            bankAttribute: `deposit/bankAttribute`
        }),
        stepData() {
            return this.$constant.subAccountStepData
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
.mt-10 {
    margin-top: 10px;
}
.mt-15 {
    margin-top: 15px;
}
.notice-box {
    margin: 14px 14px 0;
    background: rgba(240, 245, 255, 0.4);
    border: 1px solid rgba(60, 120, 250, 0.1);
    font-size: 14px;
    font-weight: 400;
    color: rgba(53, 53, 71, 1);
    line-height: 20px;
    opacity: 0.7;
    .inner {
        padding: 8px;
    }
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
        font-weight: 500;
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
    padding: 14px 14px 0;
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
        font-size: 12px;
        font-weight: 400;
        color: rgba(53, 53, 71, 0.5);
        line-height: 24px;
        a {
            color: rgba(40, 90, 200, 1);
        }
    }
}
.bank-list-item {
    padding: 10px 0;
    border-bottom: 1px solid rgba(225, 225, 225, 0.5);
    p {
        font-size: 12px;
        flex: 3;
        margin-left: 20px;
        &:first-child {
            flex: 2;
            margin-left: 42px;
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
</style>
