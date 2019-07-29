<template lang="pug">
    .full-height.flex-fixed.bg-bottom
        yx-step(
            :data="stepData"
            :active="active"
            class="bg-white"
            )
        .gap
        .main-container.bg-white
            .apply-box
                .top-img-box
                    img(src="/webapp/open-account/open-account/deposit/doing@2x.png" )
                .tips-box
                    span 若您仅持有大陆银行卡，无需办理香港银行卡，通过专属
                    span.link(@click="showTips") 个人收款账户
                    i.iconfont.icon-wenhao.icon-font-style
                    span ，即可轻松完成跨境汇款。
                .apply-btn-box
                    van-button(
                        size="large"
                        type="primary"
                        @click="subAccountApply"
                    ) 立即申请开通
        .gap
        guide-box(title="申请遇到问题？" :isSubAccount="true" class="bg-white")
</template>

<script>
/**
 * 入金流程-申请子账户/默认页面
 * @ Author LINJAIJUN
 * @ Date 2019/07/16
 */
import { mapGetters, mapActions } from 'vuex'
import guideBox from '../../components/guide-box'
import {
    subAccountApply,
    bankAccountQryAType
} from '@/service/stock-capital-server'
import { getCurrentUser } from '@/service/user-server'
export default {
    name: 'sub-account-default',
    components: {
        guideBox
    },
    methods: {
        ...mapActions({
            getOpenAccountBasicInfo: 'deposit/getOpenAccountBasicInfo'
        }),
        showTips() {
            this.$alert({
                message:
                    '个人收款账户是友信证券联合交通银行（香港），以客户个人名义开通的收款账户，您可使用国内银行卡通过柜台、网银和手机银行，跨境汇款至子账户',
                confirmButtonText: '我知道了'
            })
        },
        // 申请二级子账户
        async subAccountApply() {
            if (!this.acceptTypeInfo.bankChineseName) {
                this.$toast('提交失败')
                return false
            }
            let realNameEn = this.baseInfo ? this.baseInfo.realNameEn : ''
            let chineseName = this.baseInfo
                ? this.baseInfo.realName || this.baseInfo.realNameEn
                : ''
            let familyNameSpell = this.baseInfo ? this.baseInfo.lastName : ''
            let firstNameSpell = this.baseInfo ? this.baseInfo.firstName : ''
            let bankChineseName = this.acceptTypeInfo.bankChineseName
            let bankEnglishName = this.acceptTypeInfo.bankEnglishName
            let fundAccount = this.fundAccount
            let params = {
                accountName: this.acceptTypeInfo.accountName, // 公司账户全称。立即生效必输
                accountNo: this.acceptTypeInfo.accountNo, // 主账户账号。立即生效必输
                bankChineseName: bankChineseName, // 主账户银行中文名称
                bankEnglishName: bankEnglishName, // 主账户银行英文名称
                bankRtgs: '', //主账户RTGS
                bankSwift: this.acceptTypeInfo.bankSwift, // 收款账户SWIFT码
                chineseName: chineseName, // 客户姓名
                familyNameSpell: familyNameSpell, // 姓拼音
                firstNameSpell: firstNameSpell, // 名拼音
                fundAccount: fundAccount, // 资金账户
                moneyType: this.currency, // 币种类型。(0-人民币，1-美元，2-港币)
                openRule: 2, // 开通规则1-开户分配 2-申请开通
                remark: '',
                subAcctNameCn: `${chineseName}`, // 子账户中文名称. 公司名简称-客户名
                subAcctNameEn: familyNameSpell
                    ? `${familyNameSpell} ${firstNameSpell}`
                    : `${realNameEn}`, // 子账户英文名称. 公司名简称-客户名
                userId: this.user.userId // 用户uuid
            }
            try {
                await subAccountApply(params)
                this.$toast('提交成功')
                this.$router.replace({
                    name: 'sub-account-dealing'
                })
            } catch (e) {
                this.$toast('提交失败')
            }
        },
        // 查询申请二级子账户相关信息
        async bankAccountQryAType() {
            let params = {
                accountSub: 1, // 子账户属性 1-拥有子账户 2-不拥有子账户
                accountnStatus: 1 // 账户状态 1-启用中，2-失效
            }
            try {
                let data = (await bankAccountQryAType(params)) || {}
                if (data.list) {
                    data.list.some(item => {
                        if (item.accountType === 9) {
                            // 优先综合账户
                            this.acceptTypeInfo = item
                            return true
                        } else if (
                            this.currency === '1' &&
                            item.accountType === 2
                        ) {
                            // 币种美元，则美元账户
                            this.acceptTypeInfo = item
                            return true
                        } else if (
                            this.currency === '2' &&
                            item.accountType === 1
                        ) {
                            // 币种港币，则港币账户
                            this.acceptTypeInfo = item
                            return true
                        }
                    })
                }
            } catch (e) {
                this.$toast(e.msg || '网络开小差，请稍后再试')
            }
        },
        async getCurrentUser() {
            try {
                let data = (await getCurrentUser()) || {}
                this.fundAccount = data.fundAccount
            } catch (e) {
                this.$toast(e.msg || '网络开小差，请稍后再试')
            }
        }
    },
    computed: {
        ...mapGetters({
            user: 'user',
            baseInfo: `deposit/baseInfo`
        }),
        stepData() {
            return this.$constant.subAccountStepData
        }
    },
    data() {
        return {
            active: 0,
            fundAccount: '',
            acceptTypeInfo: {}
        }
    },
    async created() {
        this.$loading()
        await this.getOpenAccountBasicInfo()
        await this.getCurrentUser()
        await this.bankAccountQryAType()
        this.$close()
    }
}
</script>

<style scoped lang="scss">
.bg-white {
    background: #fff;
}
.bg-bottom {
    background-color: $background-bottom-color;
}
.gap {
    width: 100%;
    height: 10px;
    background-color: $background-bottom-color;
}
.main-container {
    padding: 15px;
}
.top-img-box {
    padding-top: 38px;
    text-align: center;
    img {
        width: 90px;
        height: 90px;
    }
}
.tips-box {
    padding: 25px 6px 20px;
    .link {
        color: $text-link-color;
    }
}
.icon-font-style {
    color: $text-link-color;
}
</style>
