<template lang="pug">
yx-container-better.sign-confirm
    .sign-confirm-top(slot="top")
        open-process(:process="85")
        van-dialog.aml-dialog-wrap(
                v-model="showAML"
                confirm-button-text="我知道了"
                @confirm="showAML = false")
                    .aml-content 您可以继续开户，但请知晓我们将对您的户口进行合规监控，并且您需要及同意遵守友信证券的员工交易政策
                    .aml-tip(@click="knowMoreHandle") 了解更多
    .sign-confirm-container(slot="main")
        .sc-title 信息确认
        van-checkbox-group(v-model='result')
            van-checkbox.yx-checkbox(
                v-for="item,index in list"
                :key="index"
                @click="toggleCurrent(index)"
                :name="index")
                img(slot="icon" slot-scope="props" :class="{unselected: !props.checked}" :src="`/webapp/open-account/open-account/sign/${props.checked ? '' : 'no'}confirm.png`")
                p(v-html="item")
                .index0-wrap(v-if="result.indexOf(0) === -1 && index === 0" @click.stop="() => {}")
                    yx-hk-field.field-name(
                        placeholder="请填写您的中央编号"
                        v-model="form.centralNumber")
                    .address
                        p 请提供开户许可信正本至以下地址：
                        p 上環德輔道中308號富衛金融中心26樓2606室
                .index2-wrap(v-if="result.indexOf(2) === -1 && index === 2" @click.stop="() => {}")
                    yx-hk-field.field-name(
                        placeholder="请输入董事或雇员姓名"
                        v-model="form.groupPersonnel")
                    yx-hk-field.field-name(
                        placeholder="请输入你们的关系，若为本人填写本人"
                            v-model="form.groupRelation")
        //- p.sc-tips.text-color5 本人声明：细收听风险披露录音，清楚明白并完全接受音频中本人已详细收听风险披露录音，清楚明白中本人已详细收听风险披露录音，清楚明白
        //- .customer-deal(@click="goCustProtocol") 《客户协议书》
        van-checkbox-group.check-protocal-wrap(v-model="read")
            van-checkbox(name="1") {{$t('hadReadInfo')}}
                img(slot="icon" slot-scope="props" :class="{unselected: !props.checked}" :src="`/webapp/open-account/open-account/sign/${props.checked ? '' : 'no'}confirm.png`")
                .check-tip 我已阅读并同意《
                    span.link-protocal(@click="goCustProtocol") 客户协议书及
                    span.link-protocal(@click="goAuthProtocol") 授权书》
                    span 内容， 并使用填入信息签署授权书
    van-button(
        slot="bottom"
        size="large"
        :disabled="!canSubmit"
        type="primary"
        @click="submitHandler"
        class="bottom-button" ) 确认，最后一步：签名
</template>

<script>
import { Checkbox, CheckboxGroup } from 'vant'
export default {
    mixins: [require('../../mixins/mix-router.js').default],
    data() {
        return {
            showAML: false,
            docStatus: 255,
            // 默认勾选
            read: ['1'],
            form: {
                groupPersonnel: '',
                groupRelation: '',
                centralNumber: ''
            }
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
    async created() {
        try {
            this.$loading()
            let {
                groupPersonnel,
                groupRelation,
                docStatus,
                centralNumber
            } = await this.$accountService.getRiskDisclosure()
            this.docStatus = docStatus
            this.form.groupPersonnel = groupPersonnel
            this.form.groupRelation = groupRelation
            this.form.centralNumber = centralNumber
        } finally {
            this.$close()
        }
    },
    methods: {
        goStep(pageName, projectName) {
            this.$jsBridge.gotoNativeModule(
                `yxzq_goto://webview?url=${encodeURIComponent(
                    window.location.origin +
                        `/webapp/${projectName}/apply.html#/${pageName}`
                )}`
            )
        },
        knowMoreHandle() {
            this.goStep('know-more', 'open-account-hk')
        },
        async submitHandler() {
            // 若 1和3 同时不勾线，提示，并且不能提交
            if (!this.result.includes(0) && !this.result.includes(2)) {
                this.$toast(
                    '选项1 和选项3 不可同时取消勾选，请确认身份后选择选项1和3'
                )
                return
            }
            try {
                if (!this.result.includes(0)) {
                    await this.$confirm({
                        title: '温馨提示',
                        message:
                            '持牌人或注册人雇员开户需提供开户许可信正本请邮件证本资料至以下地址：\n上環德輔道中308號富衛金融中心26樓2606室',
                        confirmButtonText: '确定',
                        cancelButtonText: '取消'
                    })
                }
                let params = Object.assign({}, this.form, {
                    docStatus: this.docStatus
                })
                await this.$accountService.finishInfoConfirm(params)
                this.goApplyStep()
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
        goAuthProtocol() {
            this.goStep('authorization', 'open-account')
        },
        async toggleCurrent(index) {
            if (!this.result.includes(index)) {
                // 取消勾选
                if (index === 2) {
                    this.showAML = true
                } else if ([0, 2].indexOf(index) === -1) {
                    try {
                        await this.$confirm({
                            message: '您有任何疑问可联系客服获得进一步说明',
                            confirmButtonText: '联系客服',
                            cancelButtonText: '我再看看'
                        })
                        this.$jsBridge.gotoCustomerService()
                        this.canNotSubmit
                    } catch (e) {
                        console.log(e)
                    }
                }
            }
        }
    },
    computed: {
        result: {
            get() {
                let re = []
                for (let i = 0; i < 7; i++) {
                    this.docStatus & Math.pow(2, i) && re.push(i)
                }
                return re
            },
            set(val) {
                let docStatus = 0
                console.log()
                val.forEach(i => {
                    docStatus += Math.pow(2, i)
                })
                this.docStatus = docStatus + 128
            }
        },
        canSubmit() {
            let { groupPersonnel, groupRelation, centralNumber } = this.form
            return (
                [1, 3, 4, 5, 6].every(i => this.result.includes(i)) &&
                this.read.length > 0 &&
                ((!this.result.includes(0) && centralNumber) ||
                    (!this.result.includes(2) &&
                        groupPersonnel &&
                        groupRelation) ||
                    [0, 1, 2, 3, 4, 5, 6].every(i => this.result.includes(i)))
            )
        },
        resultLength() {
            return this.result.length
        },
        list() {
            return [
                '本人<span>不是</span>证监会持牌人或注册人的雇员',
                '本人或直系亲属<span>不是</span>重要公职人员或与之有关联人士，如高级政府官员或国有企业高级行政人员等',
                '本人<span>不是</span>友信集团于香港证监会的持牌机构的职员（包括董事）或亲属',
                '本人<span>不是</span>法定的美国公民，居民，或税务居民（包括绿卡持有人）',
                '本人<span>是</span>该证券账户的最终且唯一的收益拥有人',
                '本人所属的税收居民国是中国，税务编号<span>是</span>' +
                    this.basicInfo.identifyCode,
                '本人确认友信证券已按所选语言提供客户协议书(包含风险披露声明，隐私政策及常设授权)，接受并同意有关条款及风险披露'
            ]
        }
    },
    components: {
        [Checkbox.name]: Checkbox,
        [CheckboxGroup.name]: CheckboxGroup
    }
}
</script>
<style lang="scss">
.sign-confirm {
    .aml-dialog-wrap {
        display: flex;
        flex-direction: column;
        text-align: center;
        font-size: 15px;
        .aml-tip {
            padding: 5px 0 15px;
            color: $primary-color;
            font-size: 12px;
        }
        .van-dialog__content {
            padding: 15px 15px 0;
        }
    }
    #app .van-button {
        border-radius: 0;
    }
    .sign-confirm-container {
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
        .yx-checkbox {
            p {
                span {
                    font-weight: bold;
                }
            }
        }
        .van-checkbox__icon,
        .van-checkbox__label {
            height: auto;
        }
    }
}
</style>

<style lang="scss" scoped>
.sign-confirm {
    .sign-confirm-container {
        padding: $global-padding;
        .primary-color {
            color: $primary-color;
        }
        .sc-title {
            height: 22px;
            font-size: 18px;
            font-weight: 500;
            line-height: 22px;
        }
        .yx-checkbox {
            padding-top: 20px;
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
        .check-protocal-wrap {
            font-size: 12px;
            padding-top: 20px;
            .link-protocal {
                color: $primary-color;
            }
        }
        .unselected {
            color: #e1e1e1;
        }
        .icon-confirm {
            color: $primary-color;
        }
        .sc-tips {
            padding-top: 16px;
            font-size: 12px;
        }
    }
}
</style>
