<template lang="pug">
yx-container-better.confirm-info
    .confirm-info-top(slot="top")
        van-dialog(
            :message="$t('connectionToHelp')"
            v-model="showContactCustomer"
            :confirm-button-text="$t('customerService')"
            @confirm="contactCustomer"
            @cancel="cancelCustomer"
            :cancel-button-text="$t('cancelButtonInfo')"
            show-cancel-button)
        van-dialog(
            :title="$t('soliOpinions')"
            :message="$t('addjustionInfo')"
            v-model="showRiskTip"
            :confirm-button-text="$t('okToSure')"
            @confirm="cancelRiskTip")
        van-dialog.aml-dialog-wrap(
            v-model="showAML"
            :confirm-button-text="$t('okToSure')"
            @confirm="cancelAML")
                .aml-content {{$t('continueOpenAccount')}}
                .aml-tip(@click="knowMoreHandle") {{$t('knowMoreInfo')}}
        yx-hk-popup(
            v-model="showHaveQuestion"
            position="bottom"
            :list="selectList"
            :title="$t('thisWayToHelp')"
            @checkedHandle="checkedInvestTarget")
    .confirm-info-container(slot="main")
        .confirm-info-title {{$t('declarationInfo')}}
        van-checkbox-group(v-model="result")
            van-checkbox.yx-checkbox(
                v-for="item,index in list"
                :key="index"
                @click="toggleCurrent(index)"
                :name="index")
                img(
                    slot="icon"
                    slot-scope="props"
                    :class="{unselected: !props.checked}"
                    :src="`/webapp/open-account/open-account/sign/${props.checked ? '' : 'no'}confirm.png`")
                p(v-html="item")
                .index0-wrap(v-if="result.indexOf(0) === -1 && index === 0" @click.stop="() => {}")
                    yx-hk-field.field-name(
                        :placeholder='$t("centerCode")'
                        v-model="form.centralNumber")
                    .address
                        p {{$t('addressName')}}：
                        p {{$t('address')}}
                .index2-wrap(v-if="result.indexOf(2) === -1 && index === 2" @click.stop="() => {}")
                    yx-hk-field.field-name(
                        :placeholder='$t("inputBoss")'
                        v-model="form.groupPersonnel")
                    yx-hk-field.field-name(
                        :placeholder='$t("relationshi")'
                        v-model="form.groupRelation")
            .customer-deal(@click="goCustProtocol") {{$t('agreementInfo')}}
        .risk-disclosure-fixed
            .confirm-info-title {{$t('riskTipInfo')}}
            .info
                .img(style="background-image: url(/webapp/open-account/head.png)")
                .info-container
                    p {{$t('representative')}}：NG Wing Hoi {{$t('representativeName')}}
                    p {{$t('plateNumber')}}：ASH955
        .content(ref="scrollContent")
            p.title {{$t('readContentInfo')}}
            p.text-color7(v-html="content")
        .primary-color(@click="hasQuestion") {{$t('anyQuestionsInfo')}}
        van-checkbox-group.yx-xieyi(v-model="read")
            van-checkbox(name="1") {{$t('hadReadInfo')}}
                img(slot="icon" slot-scope="props" :class="{unselected: !props.checked}" :src="`/webapp/open-account/open-account/sign/${props.checked ? '' : 'no'}confirm.png`")
    van-button(
        slot="bottom"
        size="large"
        :disabled="!canSubmit"
        type="primary"
        @click="submitHandler"
        class="bottom-button" ) {{$t('lastStep')}}
</template>

<script>
import { Checkbox, CheckboxGroup } from 'vant'
import {
    getHKDisclosureRisk,
    confirmHKDisclosureRish
} from '@/service/user-account-server-hk.js'
import { customerStatusSelect } from '@/service/config-manager.js'
export default {
    i18n: {
        zhCHS: {
            connectionToHelp: '您有任何疑问可联系客服获得进一步帮助',
            customerService: '联系客服',
            soliOpinions: '就风险提示征求独立的意见',
            addjustionInfo:
                '您可联系其他独立人士，如独立持牌的投资顾问等，就风险提示征求独立的意见',
            okToSure: '我知道了',
            continueOpenAccount:
                '您可以继续开户，但请知晓我们将对您的户口进行合规监控，并且您需要及同意遵守友信证券的员工交易政策',
            knowMoreInfo: '了解更多',
            thisWayToHelp: '您可通过以下方式寻求帮助',
            declarationInfo: '资料披露',
            agreementInfo: '《客户协议书》',
            riskTipInfo: '风险提示',
            representative: '持牌代表',
            plateNumber: '牌照号',
            readContentInfo: '为了降低您的风险，请您完整阅读风险披露内容',
            anyQuestionsInfo: '我有疑问?',
            hadReadInfo: '我已阅读并理解',
            lastStep: '确认，最后一步：签名',
            riskContentInfo:
                '证券价格有时可能会非常波动。证券价格可升可跌，甚至变成毫无价值。买卖证券未必一定能够赚取利润，反而可能会招致损失。在作出投资决定前，阁下应仔细考虑投资产品是否适合您的财务状况，投资目标和经验，风险承受能力，以及其他有关情况，亦应了解投资产品所涉及的相关风险。阁下必须详阅载于证券交易协议书中的风险披露声明。友信证券并不是亦不能被视为阁下的财务顾问。阁下在进行任何交易前如有需要应咨询阁下自己的独立法律、税务或财务顾问。',
            callCustomerInfo: '拨打客服电话',
            connetOnlineCus: '联系在线客服',
            askForAddjust: '征求第三方的独立意见',
            contentArrInfo: [
                '本人<span>不是</span>证监会持牌人或注册人的雇员',
                '本人<span>不是</span>重要公职人员、政党干事、国际组织的重要人员，或上述人员的直系亲属或与其关系密切的人',
                '本人<span>不是</span>友信集团于香港证监会的持牌机构的职员(包括董事)或其亲属',
                '本人<span>不是</span>法定的美国公民，居民，或税务居民(包括绿卡持有人)',
                '本人<span>是</span>该证券账户的最终且唯一的收益拥有人',
                `本人确认友信证券已按所选语言提供客户协议书(包含风险披露声明，隐私政策及常设授权)，接受并同意有关条款及风险披露 <br>`
            ],
            representativeName: '吴泳恺',
            centerCode: '请填写您的中央编号',
            addressName: '请提供开户许可信正本至以下地址',
            address: '上环德辅道中308号富卫金融中心26楼2606室',
            inputBoss: '请输入董事或雇员姓名',
            relationshi: '请输入你们的关系，若为本人填写本人',
            choose13:
                '选项1 和选项3 不可同时取消勾选，请确认身份后选择选项1和3',
            license:
                '持牌人或注册人雇员开户需提供开户许可信正本请邮件证本资料至以下地址：\n上環德輔道中308號富衛金融中心26樓2606室'
        },
        zhCHT: {
            connectionToHelp: '您有任何疑問可聯繫客服獲得進一步幫助',
            customerService: '聯繫客服',
            soliOpinions: '就風險提示征求獨立的意見',
            addjustionInfo:
                '您可聯繫其他獨立人士，如獨立持牌的投資顧問等，就風險提示徵求獨立的意見',
            okToSure: '我知道了',
            continueOpenAccount:
                '您可以繼續開戶，但請知曉我們將對您的戶口進行合規監控，並且您需要及同意遵守uSMART的員工交易政策',
            knowMoreInfo: '了解更多',
            thisWayToHelp: '您可通過以下方式尋求幫助',
            declarationInfo: '資料披露',
            agreementInfo: '《客戶協議書》',
            riskTipInfo: '風險提示',
            representative: '持牌代表',
            plateNumber: '牌照號',
            readContentInfo: '為了降低您的風險，請您完整閱讀風險披露內容',
            anyQuestionsInfo: '我有疑問?',
            hadReadInfo: '我已閱讀並理解',
            lastStep: '確認，最後一步：簽名',
            riskContentInfo:
                '證券價格有時可能會非常波動。證券價格可升可跌，甚至變成毫無價值。買賣證券未必一定能夠賺取利潤，反而可能會招致損失。在作出投資決定前，閣下應仔細考慮投資產品是否適合您的財務狀況，投資目標和經驗，風險承受能力，以及其他有關情況，亦應了解投資產品所涉及的相關風險。閣下必須詳閱載於證券交易協議書中的風險披露聲明，友信證券並不是亦不能被視為閣下的財務顧問。閣下在進行任何交易前如有需要應諮詢閣下自己的獨立法律，稅務或財務顧問。',
            callCustomerInfo: '聯絡客戶服務',
            connetOnlineCus: '聯繫線上客服',
            askForAddjust: '徵求第三方的獨立意見',
            contentArrInfo: [
                '本人<span>不是</span>證監會持牌人或註冊人的雇員',
                '本人<span>不是</span>重要公職人員、政黨幹事、國際組織的重要人員，或上述人員的直系親屬或與其關係密切的人',
                '本人<span>不是</span>友信集團于香港證監會的持牌機構的職員(包括董事)或其親屬',
                '本人<span>不是</span>法定的美國公民，居民，或稅務居民(包括綠卡持有人)',
                '本人<span>是</span>該證券帳戶的最終且唯一的收益擁有人',
                `本人確認uSMART已按所選語言提供客戶協議書(包含風險披露聲明，隱私政策及常設授權)，接受並同意有關條款及風險披露<br>`
            ],
            representativeName: '吳泳愷',
            centerCode: '請填寫您的中央編號',
            addressName: '請邮寄僱主書面同意書 至以下地址',
            address: '上環德輔道中308號富衛金融中心26樓2606室',
            inputBoss: '请输入董事或雇员姓名',
            relationshi: ' 请输入你们的关系，若为本人填写本人',
            choose13: '選項1和選項3不可同時取消勾選，請確認身份後選擇選項1和3',
            license:
                '持牌人或注册人雇員開戶需邮寄僱主書面同意書 至以下地址：\n上環德輔道中308號富衛金融中心26樓2606室'
        },
        en: {
            connectionToHelp:
                'If you have any questions, please contact customer service for further assistance.',
            customerService: 'Contact Customer Service',
            soliOpinions: 'For independent advice on risk warnings',
            addjustionInfo:
                'You can contact other independent sources, such as independent licensed investment advisers, for independent advice on risk warnings.',
            okToSure: 'OK',
            continueOpenAccount:
                "You can continue to open an account, but please be aware that we will monitor your account for compliance and you need and agree to abide by uSMART's employee trading policy.",
            knowMoreInfo: 'Learn More',
            thisWayToHelp: 'You can ask for help in the following ways',
            declarationInfo: 'Declaration',
            agreementInfo: 'Customer Agreement',
            riskTipInfo: 'Risk Warning',
            representative: 'Licensed Representative',
            plateNumber: 'License Number',
            readContentInfo:
                'In order to reduce your risk, please read the risk disclosure content.',
            anyQuestionsInfo: 'I have question?',
            hadReadInfo: 'I have read and understood',
            lastStep: 'Confirm, the last step: signature',
            riskContentInfo:
                'The prices of securities fluctuate, sometimes dramatically. The price of a security may move up or down, and may become valueless. It is as likely that losses will be incurred rather than profit made as a result of buying and selling securities. Before making investment decisions, you should carefully consider whether investment products are suitable in light of your financial position, investment objectives and experiences, risk tolerance and other relevant circumstances. Meanwhile, You should also understand the risks associated with investment products. You should read the Risk Disclosure Statement contained in the Client Agreement for Securities Trading carefully. uSmart Securities is not acting as your financial advisor and you must not regard it as so acting. If necessary, you should consult your independent legal, tax or financial advisor prior to entering into any transaction.',
            callCustomerInfo: 'Call CS',
            connetOnlineCus: 'Contact Online CS',
            askForAddjust: 'Seek independent advice from third parties',
            contentArrInfo: [
                'I am <span>not</span> an employee of the Licensed or Registered Persons',
                'I am <span>not</span> an important public official, a political party officer, an important member of an international organization, or an immediate family member of the such person or a person close to them',
                "I am <span>not</span> staff (including director) of Youxin group and the licensee of the Hong Kong Securities and Futures Commission or such persons' relatives",
                'I am <span>not</span>  US citizen, resident, or tax resident (including green card holder)',
                'I <span>am</span> the ultimate and sole beneficial owner of the securities account',
                `I confirm that uSMART has provided a customer agreement (including risk disclosure statement, privacy policy and standing authority) in the selected language, I accept and agree to the terms and risks disclosure <br>`
            ],
            representativeName: '吳泳愷',
            centerCode: 'Please fill in CE.NO',
            addressName: 'Please send us consent letter to following address',
            address:
                'Room 2606, 26th Floor,FWD Financial Centre, 308-320 Des Voeux Road Central, Sheung Wan',
            inputBoss: 'Relationship Name',
            relationshi: 'What kind of Relationshi',
            choose13: 'Pls confirm  option 1 and 3, and select 1 of them',
            license:
                'Please send us consent letter to following address to  Room 2606, 26th Floor,FWD Financial Centre, 308-320 Des Voeux Road Central, Sheung Wan'
        }
    },
    components: {
        [Checkbox.name]: Checkbox,
        [CheckboxGroup.name]: CheckboxGroup
    },
    data() {
        return {
            showRiskTip: false,
            showHaveQuestion: false,
            showAML: false,
            showContactCustomer: false,
            docStatus: 63,
            read: [],
            content: this.$t('riskContentInfo'),
            customerServiceInfo: {},
            form: {
                groupPersonnel: '',
                groupRelation: '',
                centralNumber: ''
            }
        }
    },
    async created() {
        try {
            this.$loading()
            let data = await getHKDisclosureRisk()
            if (data && data.docStatus) {
                let {
                    groupPersonnel,
                    groupRelation,
                    docStatus,
                    centralNumber
                } = data
                this.docStatus = docStatus
                this.form.groupPersonnel = groupPersonnel
                this.form.groupRelation = groupRelation
                this.form.centralNumber = centralNumber
                if (this.docStatus & Math.pow(2, 9)) {
                    this.read = ['1'] // 第十位判断是否选中 是则默认选择已阅读
                }
            }
            this.customerServiceInfo = (await customerStatusSelect()) || {}
            this.$close()
        } catch (e) {
            this.$toast(e.msg)
        }
    },
    watch: {
        result(newV) {
            if (newV.indexOf(0) === 0) {
                this.form.centralNumber = ''
            }
            if (newV.indexOf(2) === 2) {
                this.form.groupPersonnel = ''
                this.form.groupRelation = ''
            }
        }
    },
    computed: {
        selectList() {
            return [
                {
                    text: this.$t('callCustomerInfo'),
                    tip: this.customerServiceInfo.telTime,
                    hide: [1, 3].indexOf(this.customerServiceInfo.showType) < 0,
                    type: 0
                },
                {
                    text: this.$t('connetOnlineCus'),
                    tip: this.customerServiceInfo.onlineTime,
                    hide: [2, 3].indexOf(this.customerServiceInfo.showType) < 0,
                    type: 1
                },
                {
                    text: this.$t('askForAddjust'),
                    type: 2
                }
            ]
        },
        canSubmit() {
            let { groupPersonnel, groupRelation, centralNumber } = this.form
            return (
                this.read.length > 0 &&
                [1, 3, 4, 5].every(i => this.result.includes(i)) &&
                ((!this.result.includes(0) && centralNumber) ||
                    (!this.result.includes(2) &&
                        groupPersonnel &&
                        groupRelation) ||
                    [0, 1, 2, 3, 4, 5].every(i => this.result.includes(i)))
            )
        },
        result: {
            get() {
                let re = []
                for (let i = 0; i < 6; i++) {
                    this.docStatus & Math.pow(2, i) && re.push(i)
                }
                return re
            },
            set(val) {
                this.docStatus = 0
                val.forEach(i => {
                    this.docStatus += Math.pow(2, i)
                })
            }
        },
        list() {
            return this.$t('contentArrInfo')
        }
    },
    methods: {
        cancelRiskTip() {
            this.showRiskTip = false
        },
        checkedInvestTarget(item) {
            if (item.value.type === 2) {
                // 征求第三方意见
                this.showHaveQuestion = false
                this.showRiskTip = true
            } else if (item.value.type === 0) {
                window.location.href =
                    'tel:' + this.customerServiceInfo.customerTel
            } else {
                this.$jsBridge.gotoNativeModule('yxzq_goto://customer_service')
                // 联系在线客服
            }
        },
        // 有疑问
        hasQuestion() {
            this.showHaveQuestion = true
        },
        // 跳转到客户协议书
        knowMoreHandle() {
            this.goStep('know-more', true)
        },
        cancelAML() {
            this.showAML = false
        },
        contactCustomer() {
            this.$jsBridge.gotoCustomerService()
        },
        cancelCustomer() {
            this.showContactCustomer = false
        },
        toggleCurrent(index) {
            if (!this.result.includes(index)) {
                // 取消勾选
                if (index === 2) {
                    this.showAML = true
                } else if ([0, 2].indexOf(index) === -1) {
                    this.showContactCustomer = true
                }
            }
        },
        async submitHandler() {
            // 若 1和3 同时不勾线，提示，并且不能提交
            if (!this.result.includes(0) && !this.result.includes(2)) {
                this.$toast(this.$t('choose13'))
                return
            }
            try {
                if (!this.result.includes(0)) {
                    await this.$confirm({
                        title: '温馨提示',
                        message: this.$t('license'),
                        confirmButtonText: this.$t('confirmButtonInfo'),
                        cancelButtonText: this.$t('cancelButtonInfo')
                    })
                }
                let params = Object.assign({}, this.form, {
                    docStatus: this.docStatus
                })
                await confirmHKDisclosureRish(params)
                // sign
                this.$router.push(`/step/6`)
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        goCustProtocol() {
            this.$jsBridge.gotoNewWebview(
                window.location.origin +
                    `/webapp/market/generator.html?key=AGR001`
            )
        },
        goStep(pageName, showBarTitle) {
            this.$jsBridge.gotoNativeModule(
                `yxzq_goto://webview?url=${encodeURIComponent(
                    window.location.origin +
                        `/webapp/open-account-hk/apply.html#/${pageName}`
                )}&titleBarVisible=${showBarTitle}`
            )
        }
    }
}
</script>
<style lang="scss">
.confirm-info {
    .confirm-info-container {
        // .van-checkbox__icon {
        //     display: flex;
        //     justify-content: center;
        //     align-items: center;
        // }
        .yx-checkbox {
            p {
                span {
                    font-weight: bold;
                }
            }
        }
    }
}
</style>

<style lang="scss">
.confirm-info {
    .aml-dialog-wrap {
        display: flex;
        flex-direction: column;
        padding: 15px 15px 0px 15px;
        text-align: center;
        font-size: 15px;
        .aml-tip {
            padding: 10px 0;
            color: $primary-color;
        }
    }
    .confirm-info-container {
        padding: 0 $global-padding 0;
        .customer-deal {
            font-weight: normal !important;
            display: inline-block;
            padding-top: 6px;
            padding-left: 15px;
            font-size: 14px;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: rgba(40, 90, 200, 1);
            line-height: 20px;
        }
        .confirm-info-title {
            padding: 2 * $global-padding 0 $global-padding;
            font-size: 28px;
            font-weight: 500;
            line-height: 22px;
        }
        .info {
            padding: 14px 0 20px;
            display: flex;
            .img {
                margin-right: 20px;
                width: 68px;
                height: 68px;
                border-radius: 2px;
                background-size: cover;
                line-height: 20px;
                background-repeat: no-repeat;
            }
        }
        .content {
            width: 347px;
            flex: 1;
            overflow: hidden;
            overflow-y: auto;
            line-height: 24px;
        }
        .primary-color {
            color: $hk-primary-color;
        }
        .yx-checkbox {
            padding-top: 20px;
            p {
                span {
                    font-weight: bold;
                }
            }
            .index0-wrap {
                .address {
                    padding-top: 5px;
                }
            }
        }
        .van-checkbox {
            display: flex;
            img {
                width: 16px;
            }
            // .van-checkbox__icon {
            //     display: flex;
            //     align-items: center;
            // }
        }
        .yx-xieyi {
            margin: $global-padding 0 2 * $global-padding;
            padding-bottom: $global-padding;
        }
        .unselected {
            color: #e1e1e1;
        }
        .icon-confirm {
            color: $hk-primary-color;
        }
        .sc-tips {
            padding-top: 16px;
            font-size: 12px;
        }
    }
}
</style>
