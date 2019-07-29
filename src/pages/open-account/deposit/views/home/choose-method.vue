<template lang="pug">
    div
        yx-step(
        :data="stepData"
        :active="0")
        .gap
        .box-layout
            <!--.top-title 选择入金方式-->
            .item-box.flex-box(@click="goHKBankTransfer")
                .item-left
                    h2.title 我持有香港银行卡 #[i.tips 极速到账]
                    h3.sub-title(v-if="currency !== '1'") 支持FPS转数快
                    a.handle-link(href="javascript:;" @click.stop="goBankCardProcess") 查看香港银行卡办理指引
                .item-right
                    img(src="/webapp/open-account/open-account/deposit/bg_HK@2x.png",alt="HK")
            .item-box.flex-box.bg-china(@click="goMainlandBankTransfer")
                .item-left
                    h2.title 我仅有大陆银行卡
                    .recommend-box
                        h3.sub-title(v-if="bankNameListStr") 支持银行:
                        .recommend-bank(v-if="bankNameListStr") {{bankNameListStr}}
                        .recommend-bank(v-if="isLoad && !bankNameListStr") 暂不支持大陆银行卡转账
                .item-right
</template>
<script>
/**
 * 入金流程-选择银行卡属地
 * @ Author LINJAIJUN
 * @ Date 2018/12/27
 */
import { mapGetters } from 'vuex'
import {
    subAccountRegionValid,
    subAccountQryValid,
    bankInfoDisplaySelect,
    bankAccountValid
} from '@/service/stock-capital-server'
export default {
    methods: {
        // 香港银行卡
        goHKBankTransfer() {
            this.$store.dispatch('deposit/setBankAttribute', '1')
            this.$router.push({
                name: 'hk-transfer-method'
            })
        },
        // 大陆银行卡
        goMainlandBankTransfer() {
            if (this.bankList.length) {
                this.$store.dispatch('deposit/setBankAttribute', '2')
                if ([4, 10, 11].indexOf(this.subAccountStatus) !== -1) {
                    // 已开通子账户正常跳转
                    this.$router.push({
                        name: 'mainland-transfer-method'
                    })
                } else {
                    if (this.subAccountStatus === 2) {
                        if (this.showAccountManager === 2) {
                            // 未开通且有专属客户经理、跳转客户经理页面开通
                            this.$router.push({
                                name: 'sub-account-manager'
                            })
                        } else {
                            // 未开通且无专属客户经理、跳转默认页面开通
                            this.$router.push({
                                name: 'sub-account-default'
                            })
                        }
                    } else {
                        // 处理中
                        this.$router.push({
                            name: 'sub-account-dealing'
                        })
                    }
                }
            } else {
                this.$alert({
                    message: `暂不支持大陆银行卡转账<br>如有疑问请联系客服`,
                    confirmButtonText: '我知道了'
                }).then(() => {})
            }
        },
        // 预约办理银行卡
        goBankCardProcess() {
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
                let data = (await bankInfoDisplaySelect(params)) || []
                if (data.length === 0) {
                    this.$close()
                    return false
                }
                let bankCodes = []
                data.forEach(item => {
                    bankCodes.push(item.receivingBankCode)
                })
                let params2 = {
                    bankCodes: bankCodes,
                    moneyType: this.currency
                }
                // 根据币种查询公司银行列表
                let companyData = await bankAccountValid(params2)
                this.$close()
                // 根据公司银行列表筛选展示的银行列表
                let filterBankList = data.filter(item => {
                    return companyData.bankCodes.includes(
                        item.receivingBankCode
                    )
                })
                this.bankList = filterBankList
                this.bankList.forEach(item => {
                    this.bankNameList.push(item.bankName)
                })
                if (this.bankNameList.length > 3) {
                    this.bankNameList.length = 3
                    this.bankNameListStr = this.bankNameList.join('、') + '等'
                } else {
                    this.bankNameListStr = this.bankNameList.join('、')
                }
                this.isLoad = true
            } catch (e) {
                this.$close()
                this.isLoad = true
                this.$toast(e.msg)
            }
        },

        // 校验客户所在地是否显示客户经理
        async subAccountRegionValid() {
            try {
                let params = `uuid=${this.user.userId}`
                let res = (await subAccountRegionValid(params)) || {}
                this.showAccountManager = res.showFlag || 1
            } catch (e) {
                this.$toast(e.msg || '网络开小差，请稍后再试')
            }
        },
        // 查询自己的二级账户(有效账户)
        async subAccountQryValid() {
            try {
                let params = {
                    uuid: this.user.userId
                }
                let res = (await subAccountQryValid(params)) || {}
                if (res.showStatus) {
                    this.subAccountStatus = res.showStatus
                } else {
                    // 客户没有开通子账户，待开通
                    this.subAccountStatus = 2
                }
            } catch (e) {
                if (e.code === 408983) {
                    // 客户没有开通子账户，待开通
                    this.subAccountStatus = 2
                } else {
                    this.$toast(e.msg || '网络开小差，请稍后再试')
                }
            }
        }
    },
    computed: {
        ...mapGetters({
            currency: `deposit/currency`,
            user: 'user'
        }),
        stepData() {
            return this.$constant.stepData
        }
    },
    data() {
        return {
            isLoad: false,
            bankList: [],
            bankNameList: [],
            bankNameListStr: '',
            showAccountManager: null, // 显示客户经理 'null'/1-不显示， 2-显示
            subAccountStatus: null // 前端APP显示状态1:待开通,2:开通失败,4:已开通,8:已冻结;9:已关闭；10-已重启；11-已修改"
        }
    },
    created() {
        this.bankInfoDisplaySelect('2')
        this.subAccountRegionValid()
        this.subAccountQryValid()
    }
}
</script>

<style scoped lang="scss">
.box-layout {
    padding: 0px 10px;
    .top-title {
        padding-left: 2px;
        font-size: 18px;
        font-weight: 500;
    }
}
.item-box {
    position: relative;
    width: 100%;
    height: 150px;
    border: 1px solid rgba(225, 225, 225, 0.5);
    margin-top: 20px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 12px;
    img {
        width: 100%;
        height: 100%;
    }
    .title {
        position: relative;
        font-size: 18px;
        color: $text-color;
        font-weight: 500;
        line-height: 25px;
    }
    .sub-title {
        font-size: 12px;
        color: $text-color;
        font-weight: 400;
        line-height: 17px;
    }
}
.bg-china {
    background: url('~@/assets/img/open-account/deposit/bg_China@2x.png')
        no-repeat top right;
    background-size: 190px 150px;
}

.item-left {
    padding: 20px 0 20px 15px;
}
.item-right {
    width: 120px;
}
.flex-box {
    display: flex;
    justify-content: space-between;
}
.tips {
    display: inline-block;
    position: absolute;
    top: 2px;
    right: -72px;
    width: 68px;
    height: 19px;
    font-size: 12px;
    font-weight: 400;
    text-align: center;
    color: rgba(255, 255, 255, 1);
    line-height: 19px;
    background: url('~@/assets/img/open-account/deposit/account@2x.png');
    background-size: cover;
}
.handle-link {
    position: absolute;
    font-size: 12px;
    color: $text-link-color;
    bottom: 34px;
}
.recommend-box {
    position: absolute;
    width: 54%;
    top: 73px;
}
.recommend-bank {
    margin-top: 6px;
    font-size: 12px;
    line-height: 17px;
    color: $text-color;
    opacity: 0.7;
}
.gap {
    width: 100%;
    height: 10px;
    background-color: $background-bottom-color;
}
</style>
