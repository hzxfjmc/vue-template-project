<template lang="pug">
    div.bg-w.pb-48
        yx-step(
        :data="stepData"
        :active="active")
        .gap
        .bank-transfer-box
            .flex-box.inner.space-between
                .item
                    .title 本人同名银行账户
                    .flex-box.start
                        .bank-icon
                            img(:src="bankInfo.logo ? bankInfo.logo : '/webapp/open-account/open-account/bank-icon/bank_default@2x.png'")
                        .bank-title {{bankInfo.bankName}}
                .item
                    p 存入{{currencyStr}}
                    p
                        img(src="@/assets/img/open-account/deposit/arrow@2x.png" class="icon-arrow")
                .item
                    .title 友信证券银行托管账户
                    .flex-box.start
                        .bank-icon
                            img(:src="accountInfo.bankLogo" v-if="accountInfo.bankLogo")
                        .bank-title {{bankInfo.receivingBankName}}
            .txt.flex-box.start
                p
                    span.label 手续费：
                    span {{currency =='2'? bankInfo.hkdPoundage : bankInfo.usdPoundage}}
                p
                    span.label 预计到账时间：
                    span {{bankInfo.accountingDate}}
        .gap
        .account-box
            .mask-box(v-if="subAccountStatusView !== 'success'")
                div(:class="{'mt-24':subAccountStatusView === 'fail'}")
                    img(:src="statusImg" class="img-status" v-if="statusImg")
                .status {{statusTitle}}
                .tips
                    p {{statusSubTitle}}
                .btn-box(v-if="subAccountStatusView && subAccountStatusView!=='fail'")
                    van-button(
                    size="large"
                    type="primary"
                    :disabled="disabled"
                    @click="subAccountApply"
                    ) {{submitTitle}}
            .title {{title}}
            .info-box
                ul
                    li.flex-box.start(v-for="item in map" @click="copy(item.extendValue || accountInfo[item.key])")
                        .item-left
                            span.label {{item.value}}
                        .item-right(v-if="subAccountStatusView === 'success'") {{item.extendValue||accountInfo[item.key] || '-'}}
                        .item-right(v-else) *********
            .btn-copy(v-if="subAccountStatusView !== 'fail'") 点击信息可复制
        .gap
        guide-box(:isSubAccount="true" :isSubAccountGuideLine="true" :bankName="bankInfo.bankName" :appRemittanceGuidelines="bankInfo.appRemittanceGuidelines" :webRemittanceGuidelines="bankInfo.webRemittanceGuidelines")
        van-button(
        v-if="subAccountStatusView === 'success'"
        size="large"
        type="primary"
        class="btn"
        @click="redirect"
        ) 我已入金，通知友信

</template>
<script>
/**
 * 入金流程-香港汇款/跨境汇款
 * @ Author LINJAIJUN
 * @ Date 2019/01/05
 */
import { mapGetters, mapActions } from 'vuex'
import LS from '@/utils/local-storage.js'
import guideBox from '../../components/guide-box'
import common from '../../util/common'
import { getCosUrl } from '@/utils/cos-utils'
export default {
    components: {
        guideBox
    },
    methods: {
        ...mapActions({
            getOpenAccountBasicInfo: 'deposit/getOpenAccountBasicInfo'
        }),
        copy(content) {
            common.copy(content)
        },
        redirect() {
            this.$router.push({
                name: 'deposit-notice',
                query: {
                    bankName: this.bankInfo.bankName,
                    receivingBankCode: this.bankInfo.receivingBankCode,
                    accountId: this.accountInfo.accountId, // 对应收款银行账号
                    accountNo: this.acceptTypeInfo.accountNo, // 二级子账户对应的主账户
                    fromPage: 'transfer-money-mainland'
                }
            })
        },
        async getCurrentUser() {
            try {
                let data = await this.$depositService.getCurrentUser()
                this.fundAccount = data.fundAccount
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        // 查询自己的二级账户状态(有效账户)
        async subAccountQueryValid() {
            let params = {
                userId: this.user.userId || this.$constant.userId
            }
            try {
                let data = await this.$depositService.subAccountQueryValid(
                    params
                )
                if (data.showStatus) {
                    this.subAccountStatus = data.showStatus // 前端APP显示状态1:待开通,2:开通失败,4:已开通,8:已冻结;9:已关闭；10-已重启；11-已修改"
                    this.subAccountInfo = data
                } else {
                    this.subAccountStatus = 0
                }
            } catch (e) {
                if (e.code === 408983) {
                    // 客户没有开通子账户，待分配
                    this.subAccountStatus = 2
                } else {
                    this.$toast(e.msg)
                }
            }
        },
        // 申请分配二级账户
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
            // let shortBankChineseName = this.acceptTypeInfo.accountShortName
            // let shortBankEnglishName = this.acceptTypeInfo.accountShortName
            let fundAccount = this.fundAccount
            let params = {
                accountName: this.acceptTypeInfo.accountName, // 公司账户全称。立即生效必输
                accountNo: this.acceptTypeInfo.accountNo, // 主账户账号。立即生效必输
                bankChineseName: bankChineseName, // 主账户银行中文名称
                bankEnglishName: bankEnglishName, // 主账户银行英文名称
                bankRtgs: '', //主账户RTGS
                bankSwift: this.accountInfo.bankSwift, // 收款账户SWIFT码
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
                await this.$depositService.subAccountApply(params)
                this.$toast('提交成功')
                this.subAccountStatus = 1
            } catch (e) {
                this.$toast('提交失败')
            }
        },
        async queryAccountBankRef() {
            try {
                let params = {
                    bankCode: this.bankInfo.receivingBankCode,
                    moneyType: this.currency
                }
                this.$loading()
                let data = await this.$depositService.queryAccountBankRef(
                    params
                )
                let res = data && data.length ? data[0] : {}
                res.accountNo = this.subAccountInfo.subAcctNo || '-'
                res.accountName = this.subAccountInfo.subAcctNameEn || '-'
                if (res.bankLogo) {
                    await getCosUrl(res.bankLogo).then(url => {
                        res.bankLogo = url
                    })
                }
                this.accountInfo = res
                this.$close()
            } catch (e) {
                this.$close()
                this.$toast(e.msg || '网络开小差，请稍后再试')
            }
        },
        // 查询申请二级子账户相关信息
        async queryAppOrderAcctype() {
            let params = {
                accountSub: 1, // 子账户属性 1-拥有子账户 2-不拥有子账户
                accountnStatus: 1 // 账户状态 1-启用中，2-失效
            }
            try {
                let data = await this.$depositService.queryAppOrderAcctype(
                    params
                )
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
        }
    },
    watch: {
        subAccountStatus(val) {
            val += ''
            this.statusSubTitle =
                '由于银行内部分配，预计最长1个工作日完成处理， 成功后会短信通知到您'
            switch (val) {
                case '0':
                case '2':
                    this.subAccountStatusView = 'unSubmit'
                    this.statusTitle = '待开通'
                    this.statusImg =
                        '/webapp/open-account/open-account/deposit/icon_fenpei@2x.png'
                    this.disabled = false
                    this.submitTitle = '开通子账户'
                    break
                case '1':
                    this.subAccountStatusView = 'dealing'
                    this.statusTitle = '处理中'
                    this.statusImg =
                        '/webapp/open-account/open-account/deposit/icon_chuli@2x.png'
                    this.disabled = true
                    this.submitTitle = '提交成功，处理中'
                    break
                case '4':
                case '10':
                case '11':
                    this.subAccountStatusView = 'success'
                    break
                case '8':
                case '9':
                    this.subAccountStatusView = 'fail'
                    this.statusImg =
                        '/webapp/open-account/open-account/deposit/icon_zantin@2x.png'
                    this.statusTitle = '抱歉，账户暂停使用'
                    this.statusSubTitle = '如有问题，请联系客服'
                    break
            }
        }
    },
    computed: {
        ...mapGetters({
            user: 'user',
            currency: `deposit/currency`,
            bankAttribute: `deposit/bankAttribute`,
            baseInfo: `deposit/baseInfo`
        }),
        currencyStr() {
            return this.$constant.currency[this.currency]
        },
        title() {
            return this.$constant.title[this.bankAttribute]
        },
        stepData() {
            return this.$constant.subAccountStepData
        }
    },
    data() {
        return {
            map: [
                { key: 'accountName', value: '收款人姓名' },
                { key: 'accountNo', value: '收款人账户' },
                { key: '', value: '收款人国家/地区', extendValue: 'HONGKONG' },
                {
                    key: '',
                    value: '收款人地址',
                    extendValue:
                        'Room 2606, 26th Floor,FWD Financial Centre, 308-320 Des Voeux Road Central, Sheung Wan'
                },
                {
                    key: 'bankName',
                    value: '收款银行名称',
                    extendValue: 'Bank of Communications Co., Ltd.'
                },
                { key: 'bankSwift', value: 'Swift代码' },
                { key: 'bankRtgs', value: '银行编号' },
                {
                    key: '',
                    value: '收款银行国家/地区',
                    extendValue: 'HONGKONG'
                },
                { key: 'bankAddress', value: '收款银行地址' }
            ],
            subAccountStatus: '', // 状态1:待开通,2:开通失败,3:待修改,4:已开通,5:待注销,6:已注销,7:待冻结,8:已冻结,9:已关闭;
            subAccountStatusView: '', // unSubmit-未开通（无数据） 'success'已分配（4-已开通）  'dealing'-处理中（1-待开通）  'fail'-暂停使用（8-已冻结）
            statusTitle: '',
            statusSubTitle: '',
            submitTitle: '',
            statusImg: '',
            disabled: false,
            accountInfo: {},
            subAccountInfo: {},
            type: '',
            active: 2,
            fundAccount: '',
            bankInfo: {
                bankName: '',
                receivingBankName: '',
                accountingDate: ''
            },
            acceptTypeInfo: {}
        }
    },
    async created() {
        this.bankInfo = LS.get('bankData') || this.$route.params.bankData
        this.$loading()
        await this.getCurrentUser()
        await this.subAccountQueryValid()
        await this.getOpenAccountBasicInfo()
        await this.queryAccountBankRef()
        if ([0, 2].includes(this.subAccountStatus)) {
            await this.queryAppOrderAcctype()
        }
        this.$close()
    }
}
</script>

<style lang="scss"></style>
<style scoped lang="scss">
@import '~@/assets/styles/bank-icon.scss';
.flex-box {
    display: flex;
    display: -webkit-flex;
    align-items: center;
}
.space-between {
    justify-content: space-between;
}
.start {
    justify-content: start;
}
.bg-w {
    background: #fff;
}
.flex-box {
    display: flex;
    display: -webkit-flex;
    align-items: center;
}
.space-between {
    justify-content: space-between;
}
.start {
    justify-content: start;
}
.mt-10 {
    margin-top: 10px;
}
.mt-24 {
    margin-top: 24px;
}
.pb-48 {
    padding-bottom: 48px;
}
.gap {
    width: 100%;
    height: 10px;
    background-color: $background-bottom-color;
}
.btn {
    position: fixed;
    width: 100%;
    height: 48px;
    background: rgba(40, 90, 200, 1);
    text-align: center;
    border-radius: unset !important;
    line-height: 48px;
    cursor: pointer;
    color: #fff;
    font-size: 16px;
    bottom: 0;
    left: 0;
}

.bank-transfer-box {
    height: 111px;
    .bank-icon {
        width: 22px;
        height: 22px;
    }
    .bank-title {
        font-size: 12px;
        opacity: 0.5;
        margin-left: 5px;
    }
    .txt {
        padding: 0 14px;
        p {
            &:last-child {
                margin-left: 30px;
            }
            .label {
                opacity: 0.5;
            }
        }
    }
    p {
        font-size: 12px;
        line-height: 20px;
        text-align: center;
        img {
            margin-top: 5px;
        }
    }
    .inner {
        padding: 14px 14px 15px;
    }
    .title {
        font-size: 14px;
        line-height: 24px;
        font-weight: 500;
        color: rgba(53, 53, 71, 1);
    }
}
.mask-box {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(255, 255, 255, 0.95);
    z-index: 2;
    text-align: center;
    img {
        width: 80px;
        height: 70px;
    }
    .status {
        font-size: 20px;
        font-weight: 400;
        color: rgba(53, 53, 71, 1);
        line-height: 22px;
        margin: 14px 0 6px;
    }
    .tips {
        padding: 0 30px 10px;
        p {
            font-size: 14px;
            opacity: 0.5;
        }
    }
    .btn-box {
        padding: 0 16px;
    }
}
.account-box {
    position: relative;
    padding: 14px;
    .title {
        font-size: 18px;
        font-weight: 500;
        color: rgba(53, 53, 71, 1);
        line-height: 22px;
    }
    .fps-title {
        margin-top: 24px;
        text-align: center;
        font-size: 14px;
        font-weight: 400;
        color: rgba(53, 53, 71, 0.5);
        line-height: 20px;
    }
    .fps-code {
        text-align: center;
        font-size: 28px;
        font-weight: 500;
        color: rgba(47, 121, 255, 1);
        line-height: 40px;
    }
    .btn-copy {
        margin-top: 12px;
        text-align: center;
        font-size: 12px;
        font-weight: 400;
        color: rgba(53, 53, 71, 0.5);
        line-height: 20px;
    }
}
.info-box {
    ul li {
        align-items: baseline;
        padding-top: 12px;
        &:first-child {
            padding-top: 16px;
        }
    }
    .item-left {
        flex: 2;
        .label {
            opacity: 0.5;
        }
    }
    .item-right {
        flex: 3;
    }
}

.icon-arrow {
    width: 31px;
    height: 11px;
}
</style>
