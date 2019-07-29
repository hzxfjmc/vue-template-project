<template lang="pug">
    .full-height.flex-fixed
        yx-step(
        :data="stepData"
        :active="active")
        .gap
        .content-box.scroll-able.flex-fixed-container
            <!--.title 如您已汇款，请提交以下表单，方便我们查收入账-->
            .form-box
                .form-item(style="margin-top:0;")
                    .label 存入金额
                    .item-right.flex-box.flex-start.bd-b
                        <!--input(placeholder="请输入存入金额" v-model="form.applyAmount")-->
                        <!--.txt 港币-->
                        van-field(
                        v-model="form.applyAmount"
                        placeholder="请输入存入金额"
                        @input="checkInput"
                        )
                            span(slot="button" class="label-currency") {{currencyStr}}
                .form-item.align-top
                    .label 上传凭证
                    .item-right
                        .tips
                            p 请上传以下凭证：
                            p 1、银行官网、APP、线下营业厅等汇款成功截图，请包含：#[span.em 汇款时间、汇款账号、流水单号]
                            p 2、银行账户开户证明：银行结单、开户资料、银行卡（#[span.em 需要显示持卡人姓名]）
                        .img-box
                            ul.img-list
                                li.btn-add.flex-box(v-if="imgList.length <5")
                                    yx-upload-img(v-model="imgPath")
                                        div
                                            p
                                                img(src="@/assets/img/open-account/deposit/icon_add@2x.png" class="icon-add")
                                            p.btn-txt 最多5张
                                li.img(v-for="(item,index) in imgList" @click="imgPreview(item.url)")
                                    i.cls(@click.stop="delImg(index)")
                                        img(src="/webapp/open-account/open-account/deposit/icon_closed.png")
                                    img(:src="item.url")
                                li.bg-example(@click="imgPreview(certificateImg)")
                                    .eg
                                        div.rotate
                                            span.txt 示例
                                    img(:src="certificateImg")

            .service
                .title 温馨提示：
                div.content(v-html="kindlyReminderData.sceneType3" v-if="kindlyReminderData.sceneType3")
        van-dialog(
        v-model="show"
        show-confirm-button
        confirm-button-text="我知道了"
        :before-close="beforeClose"
        )
            .confirm-text-box
                p 抱歉，现在暂停处理入金业务，您的入金申请可能延迟处理
                p 如有疑问，请联系客服！
        van-button(
            size="large"
            type="primary"
            class="btn"
            :disabled="disabled"
            @click="submit"
        ) 通知友信收款
        recharge(v-if="showRecharge" @closeDialogHandle="closeDialogHandle" @notFirstCallback="notFirstCallback")
</template>
<script>
/**
 * 入金流程-入金通知
 * @ Author LINJAIJUN
 * @ Date 2018/12/29
 */
import jsBridge from '@/utils/js-bridge.js'
import { Dialog, ImagePreview } from 'vant'
import { mapGetters } from 'vuex'
import { getCosUrl } from '@/utils/cos-utils'
import { kindlyReminderSelect } from '@/service/config-manager'
import { getLotteryStatus } from '@/service/customer-relationship-server.js'
import recharge from '@/biz-components/recharge'
export default {
    components: {
        [Dialog.name]: Dialog,
        recharge
    },
    watch: {
        async imgPath(val) {
            let url = await getCosUrl(val)
            this.imgList.push({ path: val, url: url })
        },
        'form.applyAmount'(val) {
            if (val.includes('.')) {
                let fNum = val.split('.')[0]
                let lNum = val.split('.')[1]
                if (fNum.length > 17) {
                    this.form.applyAmount = fNum.slice(0, 17) + '.' + lNum
                }
            } else {
                if (val.length > 20) {
                    this.form.applyAmount = val.slice(0, 20)
                }
            }
        }
    },
    computed: {
        ...mapGetters({
            user: 'user',
            currency: `deposit/currency`,
            transferMethod: `deposit/transferMethod`,
            bankAttribute: `deposit/bankAttribute`,
            accountType: `deposit/accountType`
        }),
        transferMode() {
            return this.bankAttribute
        },
        stepData() {
            return this.queryData.fromPage === 'transfer-money-mainland'
                ? this.$constant.subAccountStepData
                : this.$constant.stepData
        },
        disabled() {
            return (
                Object.values(this.form).some(item => !item) ||
                this.imgList.length === 0
            )
        },
        currencyStr() {
            return this.$constant.currency[this.currency]
        }
    },
    methods: {
        notFirstCallback() {
            this.goNext()
        },
        closeDialogHandle() {
            this.goNext()
        },
        goNext() {
            jsBridge.gotoNativeModule('yxzq_goto://fund_history_record')
            jsBridge.callApp('command_close_webview') // 跳转历史记录页面后调用关闭，点返回则到入口页面
        },
        beforeClose(action, done) {
            if (action === 'confirm') {
                this.rechargeApply(true)
                done()
            } else {
                done()
            }
        },
        checkInput() {
            let regs = [
                ['^0(\\d+)$', '$1'], //禁止录入整数部分两位以上，但首位为0
                ['[^\\d\\.]+$', ''], //禁止录入任何非数字和点
                ['\\.(\\d?)\\.+', '.$1'], //禁止录入两个以上的点
                ['^(\\d+\\.\\d{2}).+', '$1'] //禁止录入小数点后两位以上
            ]
            for (let i = 0; i < regs.length; i++) {
                let reg = new RegExp(regs[i][0])
                this.form.applyAmount = this.form.applyAmount.replace(
                    reg,
                    regs[i][1]
                )
            }
        },
        delImg(index) {
            this.imgList.splice(index, 1)
        },
        imgPreview(url) {
            if (!url) return false
            ImagePreview([url])
        },
        submit() {
            if (!this.isClicked) {
                this.isClicked = true
                this.getAppSystem(this.rechargeApply)
            }
        },
        checkDepositCertificate() {
            // 银行归属地：1-香港银行卡 2-大陆银行卡
            if (this.bankAttribute === '1') {
                // 中国银行或者FPS
                if (this.queryData.bankCode === 'BKCH' || this.queryData.fps) {
                    this.certificateImg =
                        '/webapp/open-account/open-account/deposit/deposit-certificate-2.png'
                } else {
                    this.certificateImg =
                        '/webapp/open-account/open-account/deposit/deposit-certificate-1.png'
                }
            } else {
                this.certificateImg =
                    '/webapp/open-account/open-account/deposit/deposit-certificate-3.png'
            }
        },
        async kindlyReminderSelect() {
            try {
                let params = {
                    sceneType: 3 //应用场景 1-月供股 2-IPO 3-入金 4-出金 5-货币兑换 6-转股 7-公司行动
                }
                this.$loading()
                this.kindlyReminderData =
                    (await kindlyReminderSelect(params)) || {}
                this.$close()
            } catch (e) {
                this.$toast(e.msg || '网络开小差，请稍后再试')
            }
        },
        async getAppSystem(cb) {
            try {
                let params = {
                    serviceIdList: ['RJKG']
                }
                this.$loading()
                let data = await this.$depositService.getAppSystem(params)
                if (data.list && data.list.length) {
                    if (data.list[0].content === '禁止') {
                        this.show = true
                    } else if (data.list[0].content === '允许') {
                        cb()
                    }
                } else {
                    cb && cb()
                }
            } catch (e) {
                this.$close()
                this.isClicked = false
                this.$toast(e.msg || '网络开小差，请稍后再试')
            }
        },
        async getLotteryStatus() {
            try {
                let res = await getLotteryStatus()
                this.isRecharge = res.recharge || ''
            } catch (e) {
                this.isRecharge = true
            }
        },
        async rechargeApply(flag) {
            try {
                let {
                    bankName,
                    receivingBankCode,
                    accountId,
                    accountNo,
                    fps
                } = this.queryData
                let params = {
                    acceptBank: bankName, // 客户汇款银行
                    acceptBankCode: receivingBankCode, // 收款银行BankCode
                    accountType: this.accountType, // 入金银行账户类型1-港币 2-美元账户 9-综合账户
                    applyType: '1', // 发起类型1-客户前端申请 2-中台发起
                    applyAmount: this.form.applyAmount,
                    exchangeType: '1', // 1-电汇；2-支票
                    moneyType: this.currency, // 币种0-人民币;1-美元;2-港币
                    transferCompanyId: accountId, //  友信公司银行账户业务ID
                    transferAccount: accountNo, // 二级子账户对应的主账户
                    fps: fps, // 友信公司银行账户FPS
                    appType: 2, // 应用端1uSmart 2友信智投(默认)
                    transferMethod: this.transferMethod, // 入金方式。1汇款 /2跨境汇款 3跨境汇款 /FPS
                    transferMode: this.transferMode, // 入金方式。1-香港银行入金；2-大陆银行入金；9-银证转账入金
                    userId: this.user.userId || this.$constant.userId
                }
                // 入金申请
                let headers = {
                    RequestId: this.RequestId,
                    'X-Request-Id': this.RequestId
                }
                this.$loading()
                let data = await this.$depositService.rechargeApply(params, {
                    headers: headers
                })
                let atts = []
                this.imgList.forEach(item => {
                    atts.push({
                        attachmentLink: item.path,
                        attachmentRefId: data.tradeId, // 入金申请接口获取tradeId
                        attachmentType: '4', // 4-入金凭证
                        attachmentTypeName: '入金凭证'
                    })
                })
                // 保存附件
                await this.$depositService.recordAttachmentMultiple({
                    atts: atts
                })
                this.$close()
                this.isClicked = false
                if (!flag) {
                    // 正常流程非冻结
                    this.$imgToast({
                        message: '友信已收到通知',
                        cb: () => {
                            if (this.isRecharge) {
                                this.goNext()
                            } else {
                                this.showRecharge = true
                            }
                        }
                    })
                }
            } catch (e) {
                this.isClicked = false
                this.$close()
                this.$toast(e.msg || '网络开小差，请稍后再试')
            }
        }
    },
    data() {
        return {
            show: false,
            isClicked: false,
            showRecharge: false,
            isRecharge: false, // 是否首次入金 false-首次入金 true-已入金非首次
            RequestId: '',
            queryData: {},
            form: {
                applyAmount: ''
            },
            fps: '',
            acceptBankCode: '',
            transferCompanyId: '',
            imgList: [],
            acceptBank: '',
            accountNo: '',
            imgPath: '',
            active: 2,
            kindlyReminderData: {},
            certificateImg: ''
        }
    },
    created() {
        this.RequestId = this.$guid()
        this.queryData = this.$route.query
        this.active =
            this.queryData.fromPage === 'transfer-money-mainland' ? 3 : 2
        this.checkDepositCertificate()
        this.kindlyReminderSelect()
        this.getLotteryStatus()
    }
}
</script>
<style lang="scss">
.alert-box {
    .van-dialog__message {
        line-height: 2.5;
    }
}
.confirm-text-box {
    padding: 20px;
    text-align: center;
    font-size: 14px;
    font-weight: normal;
    p:last-child {
        margin-top: 10px;
    }
}
.service {
    margin-top: 44px;
    .title {
        font-size: 14px;
        opacity: 0.5;
    }
    overflow: auto;
    word-break: break-word;
    .content {
        font-size: 12px;
        line-height: 20px;
        color: rgba(53, 53, 71, 0.5);
    }
    a {
        color: $text-link-color;
    }
}
.content-box {
    .van-cell {
        padding-left: 0;
    }
    .van-field__control {
        font-size: 20px;
        &::-webkit-input-placeholder {
            font-size: 14px;
        }
    }
}
</style>
<style scoped lang="scss">
@import '~@/assets/styles/bank-icon.scss';
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
.flex-start {
    justify-content: flex-start;
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
.bd-b {
    border-bottom: 1px solid rgba(225, 225, 225, 0.5);
}
.icon-add {
    width: 25px;
    height: 25px;
}
.label-currency {
    opacity: 0.5;
}
.gap {
    width: 100%;
    height: 10px;
    background-color: $background-bottom-color;
}
.btn {
    border-radius: unset !important;
}
.content-box {
    padding: 14px;
    .form-box {
        .form-item {
            margin-top: 30px;
            display: flex;
            display: -webkit-flex;
            justify-content: flex-start;
            align-items: center;
            .label {
                flex: 1;
                opacity: 0.5;
            }
            .item-right {
                flex: 4;
                input {
                    width: 88%;
                }
            }
        }
        .form-item.align-top {
            align-items: flex-start;
        }
    }
    .img-list {
        li {
            float: left;
            position: relative;
            width: 75px;
            height: 75px;
            margin-bottom: 13px;
            margin-right: 13px;
            &:last-child {
                margin-right: 0;
            }
        }
        .img {
            background: #eee;
            img {
                width: 100%;
                height: 100%;
            }
        }
        .cls {
            position: absolute;
            width: 17px;
            height: 17px;
            top: -7px;
            right: -7px;
        }
        .btn-add {
            justify-content: center;
            text-align: center;
            border: 1px dotted rgba(218, 218, 218, 1);
            .btn-txt {
                font-size: 12px;
                padding-top: 2px;
                font-weight: 400;
                color: rgba(218, 218, 218, 1);
                line-height: 20px;
            }
        }
        .bg-example {
            img {
                width: 100%;
                height: 100%;
            }
        }
        .eg {
            width: 32px;
            height: 32px;
            position: absolute;
            top: 0;
            left: 0;
            background: url('~@/assets/img/open-account/deposit/eg.png')
                no-repeat;
            .rotate {
                transform: rotateZ(-45deg);
                text-align: center;
                position: relative;
                left: -7px;
            }
            .txt {
                font-size: 10px;
                color: #fff;
            }
        }
    }
    .tips {
        margin-bottom: 14px;
        p {
            font-size: 12px;
            color: rgba(53, 53, 71, 0.5);
            .em {
                color: rgba(251, 138, 103, 1);
            }
        }
    }
}
</style>
