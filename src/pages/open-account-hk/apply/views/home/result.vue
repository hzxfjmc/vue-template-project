<template lang="pug">
    .hk-open-account-result(v-if="auditProcessStatus!==0")
        .hk-open-account-result-top
            .title {{ $t('result.title') }}
        .hk-open-account-result-main
            .top-wrap
                track-line.audit-track-line(:iconStatus="auditCurInfo.auditIconStatus")
                .open-result-top
                    result-text.audit-text(
                        v-if="auditProcessStatus===1 ||  auditProcessStatus===5"
                        @clickTextHandle="clickTextHandle"
                        :processStatus="auditProcessStatus"
                        :typeStatus="1"
                        :isShowDetail="proofOfAddressStatus===0 || proofOfAddressStatus===2 || proofOfAddressStatus ===5"
                        :alertContent="auditCurInfo.auditAlertContent"
                        :processTitle="auditCurInfo.auditProcessTitle")
                    result-panel.audit-result(
                        v-if="auditProcessStatus===6"
                        @clickPanelHandle="clickPanelHandle"
                        :typeStatus="1"
                        :processStatus="auditProcessStatus"
                        :processTitle="auditCurInfo.auditProcessTitle"
                        :rejectList="auditRejectList"
                    )
            .bottom-wrap
                track-line.check-track-line(:iconStatus="checkCurInfo.checkIconStatus")
                .open-result-bottom
                    result-text.check-text(
                        v-if="checkProcessStatus!==1 && checkProcessStatus!==4"
                        @clickTextHandle="clickTextHandle"
                        :typeStatus="2"
                        :processStatus="checkProcessStatus"
                        :alertContent="checkCurInfo.checkAlertContent"
                        :processTitle="checkCurInfo.checkProcessTitle"
                    )
                    result-panel.check-result(
                        v-else
                        @clickPanelHandle="clickPanelHandle"
                        :typeStatus="2"
                        :processStatus="checkProcessStatus"
                        :rejectList="checkRejectList"
                        :processTitle="checkCurInfo.checkProcessTitle"
                    )
            .finally-tip(v-if="isShowCheckTitle")
                .finally-tip-text(@click="clickCheckHandle") {{goCheckTitle}}
                .right-arrow
        .apply-footer
            .footerBanner(
                @click='toMarketingHandle'
                v-webp="" :class="$t('result.bannerSrc')"
                )
</template>
<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapMutations } = createNamespacedHelpers('apply')
import { getHkOpenAccountResult } from '@/service/user-account-server-hk.js'
import trackLine from '@/pages/open-account-hk/apply/views/home/components/track-line'
import resultPanel from '@/pages/open-account-hk/apply/views/home/components/result-panel'
import resultText from '@/pages/open-account-hk/apply/views/home/components/result-text'
import { isYouxinApp } from '@/utils/html-utils.js'
export default {
    i18n: {
        zhCHS: {
            result: {
                title: '开户',
                checkInTitle: '网上核实身份',
                checkInTip: '持有香港银行账户，转账港币$10,000',
                checkSlogan1: '最节省您的开户时间',
                checkSlogan2: '简单快捷',
                gotoShop: '或去门店亲身核实身份',
                onlineSubmit: '网上核实身份已提交',
                shopSubmit: '门店核实身份已提交',
                onlineApproved: '网上核实身份已通过',
                shopApproved: '门店核实身份已通过',
                errorOnline: '网上核实身份出错',
                editInformation: '资料待修改',
                address: '待补充通信地址',
                informationApproved: '资料已审核通过',
                informationSubmit: '资料审核中',
                errorNetwork: '网络开小差了,请稍后重试',
                bannerSrc: 'banner-dl webp-dl'
            }
        },
        zhCHT: {
            result: {
                title: '開戶',
                checkInTitle: '網上核實身份',
                checkInTip: '持有香港銀行賬戶，轉賬港幣$10,000',
                checkSlogan1: '最節省您的開戶時間',
                checkSlogan2: '簡單快捷',
                gotoShop: '或去門店親身核實身份',
                //gotoOnline: '或去網上核實身份',
                onlineSubmit: '網上核實身份已提交',
                shopSubmit: '门店核實身份已提交',
                onlineApproved: '網上核實身份已通過',
                shopApproved: '门店核實身份已通過',
                errorOnline: '網上核實身份出錯',
                //errorShop: '門店核實身份出錯',
                editInformation: '資料待修改',
                address: '待補充通信地址',
                informationApproved: '資料已審核通過',
                informationSubmit: '資料審核中',
                errorNetwork: '網絡開小差了，請稍後重試',
                bannerSrc: 'banner-hk webp-hk'
            }
        },
        en: {
            result: {
                title: 'Open Account',
                checkInTitle: 'Online identity verification',
                checkInTip:
                    'Transfer HKD10,000 from your Hong Kong bank account',
                checkSlogan1: 'Save Time',
                checkSlogan2: 'Simple and Fast',
                gotoShop: 'Or offline identity verification',
                //gotoOnline: '或去网上核实身份',
                onlineSubmit: 'Online Identity Verification Submitted',
                shopSubmit: 'Offline Identity Verification Submitted',
                onlineApproved: 'Online Identity Verification Approved',
                shopApproved: 'Offline Identity Verification Approved',
                errorOnline: 'Online identity verification failed',
                //errorShop: '门店核实身份出错',
                editInformation: 'Edit Information',
                address: 'Submit Address Proof',
                informationApproved: 'Information Approved',
                informationSubmit: 'Reviewing your information',
                errorNetwork: '网络开小差了,请稍后重试',
                bannerSrc: 'banner-eng webp-eng'
            }
        }
    },
    components: {
        trackLine,
        resultPanel,
        resultText
    },
    data() {
        return {
            checkInTitle: this.$t('result.checkInTitle'),
            checkInTip: this.$t('result.checkInTip'),
            checkSlogan1: this.$t('result.checkSlogan1'),
            checkSlogan2: this.$t('result.checkSlogan2'),
            // 副标题
            // 当前状态
            auditProcessStatus: 0,
            checkProcessStatus: 0,
            proofOfAddressStatus: '',
            // icon状态 1已提交 2已通过 3驳回 4 线上核实身份进行中
            // 拒绝列表
            auditRejectList: [],
            checkRejectList: [],
            // 副标题提示
            idInfoTitle: ''
        }
    },
    watch: {
        updateResult: {
            handler() {
                this.initAction()
            },
            deep: true
        }
    },
    props: {
        updateResult: {
            type: Object,
            default: () => {}
        }
    },
    computed: {
        ...mapGetters(['approvalOpinion', 'identityOpinion']),
        goCheckTitle() {
            if (
                this.checkProcessStatus === 1 ||
                this.checkProcessStatus === 4
            ) {
                return this.$t('result.gotoShop')
            }
            return ''
        },
        isShowCheckTitle() {
            if (
                this.checkProcessStatus === 1 ||
                this.checkProcessStatus === 4
            ) {
                return true
            }
            return false
        },
        getCheckStatusMap() {
            return {
                [2]: {
                    checkIconStatus: 1,
                    checkProcessTitle: this.$t('result.onlineSubmit'),
                    checkAlertContent: this.idInfoTitle
                },
                [5]: {
                    checkIconStatus: 1,
                    checkProcessTitle: this.$t('result.shopSubmit'),
                    checkAlertContent: this.idInfoTitle
                },
                [3]: {
                    checkIconStatus: 2,
                    checkProcessTitle: this.$t('result.onlineApproved'),
                    checkAlertContent: ''
                },
                [6]: {
                    checkIconStatus: 2,
                    checkProcessTitle: this.$t('result.shopApproved'),
                    checkAlertContent: ''
                },
                [4]: {
                    checkIconStatus: 3,
                    checkProcessTitle: this.$t('result.errorOnline'),
                    checkAlertContent: ''
                },
                [1]: {
                    checkIconStatus: 4,
                    checkProcessTitle: this.$t('result.checkInTitle'),
                    checkAlertContent: ''
                }
            }
        },
        checkCurInfo() {
            return this.getCheckStatusMap[this.checkProcessStatus] || {}
        },
        getAuditStatusMap() {
            return {
                [6]: {
                    auditProcessTitle: this.$t('result.editInformation'),
                    auditIconStatus: 3,
                    auditAlertContent: ''
                },
                [5]: {
                    auditProcessTitle: this.$t('result.informationApproved'),
                    auditIconStatus: 2,
                    auditAlertContent: ''
                },
                [1]: {
                    auditIconStatus: 1,
                    auditProcessTitle: this.$t('result.informationSubmit'),
                    auditAlertContent:
                        this.proofOfAddressStatus === 0 ||
                        this.proofOfAddressStatus === 2
                            ? this.$t('result.address')
                            : this.idInfoTitle
                }
            }
        },
        auditCurInfo() {
            return this.getAuditStatusMap[this.auditProcessStatus] || {}
        }
    },
    created() {
        this.initAction()
    },
    methods: {
        ...mapMutations(['setApprovalOpinion', 'setIdentityOpinion']),
        async initAction() {
            try {
                let data = await getHkOpenAccountResult()
                let {
                    approvalOpinion,
                    customerIdentityStatus,
                    idInfoTitle,
                    identityOpinion,
                    openAccountStatus,
                    proofOfAddressStatus
                } = data
                // 跳转到app持仓页面
                if (openAccountStatus === 10 && customerIdentityStatus === 10) {
                    this.$jsBridge.gotoNativeModule('yxzq_goto://hold_position')
                }
                this.idInfoTitle = idInfoTitle
                this.auditProcessStatus = openAccountStatus
                this.checkProcessStatus = customerIdentityStatus
                this.auditRejectList = this.handleRejectList(
                    approvalOpinion,
                    'approvalOpinion'
                )
                this.checkRejectList = this.handleRejectList(
                    identityOpinion,
                    'identityOpinion'
                )
                this.proofOfAddressStatus = proofOfAddressStatus
            } catch (e) {
                await this.$toast(e.msg || this.$t('result.errorNetwork'))
            }
        },
        handleRejectList(arr, flag) {
            // 收集整理驳回原因
            this.saveRejectList(arr, flag)
            let list = arr.map((item, index) => {
                if (arr.length > 1) {
                    return `${index + 1}、${item.rejectText}`
                } else {
                    return item.rejectText
                }
            })
            return list
        },
        saveRejectList(arr, flag) {
            let list = {}
            let step = ''
            let obj = {}
            arr.forEach(item => {
                if (item.step !== step) {
                    obj = { [item.step]: [] }
                    obj[item.step].push(item.rejectText)
                    Object.assign(list, obj)
                } else {
                    obj[item.step].push(item.rejectText)
                }
                step = item.step
            })
            if (flag === 'approvalOpinion') {
                this.setApprovalOpinion(list)
            } else {
                this.setIdentityOpinion(list)
            }
        },

        // TODO 待修改
        clickCheckHandle() {
            // this.$jsBridge.gotoNewWebview(
            //     window.location.origin + '/webapp/market/help.html'
            // )
            this.$jsBridge.gotoNewWebview(
                window.location.origin +
                    `/webapp/market/generator.html?key=XY0211`
            )
        },
        clickTextHandle(obj) {
            let { typeStatus, processStatus } = obj
            let { proofOfAddressStatus } = this
            // 补充通信地址
            if (
                typeStatus === 1 &&
                processStatus === 1 &&
                (proofOfAddressStatus === 0 || proofOfAddressStatus === 2)
            ) {
                this.goStep('step/7')
            }
            // 网上核实身份已提交 -> 查看提交记录
            if (typeStatus === 2 && processStatus === 2) {
                if (isYouxinApp) {
                    this.goStep('submit-record/log')
                } else {
                    this.$router.push({
                        name: 'submit-record',
                        params: { log: 'log' }
                    })
                }
            }
            // 网上核实身份已通过 -> 查看提交记录
            if (typeStatus === 2 && processStatus === 3) {
                if (isYouxinApp) {
                    this.goStep('submit-record/log', false)
                } else {
                    this.$router.push({
                        name: 'submit-record',
                        params: { log: 'log' }
                    })
                }
            }
        },
        clickPanelHandle(obj) {
            let { typeStatus, processStatus } = obj
            if (typeStatus === 1 && processStatus === 6) {
                let step = Object.keys(this.approvalOpinion)[0]
                if (isYouxinApp) {
                    this.goStep(`step/${step}`)
                } else {
                    this.$router.push(`/step/${step}`)
                }
            }
            if (
                typeStatus === 2 &&
                (processStatus === 1 || processStatus === 4)
            ) {
                this.goStep('select-bank')
            }
        },
        goStep(pageName) {
            this.$jsBridge.gotoNativeModule(
                `yxzq_goto://webview?url=${encodeURIComponent(
                    window.location.origin +
                        `/webapp/open-account-hk/apply.html#/${pageName}`
                )}`
            )
        },
        toMarketingHandle() {
            this.$jsBridge.gotoNewWebview(
                window.location.origin +
                    '/webapp/marketing/recruit-new.html?register-cid=12019061802#/'
            )
        }
    }
}
</script>
<style lang="scss" scope>
.hk-open-account-result {
    background-color: rgba(248, 248, 248, 1);
    .hk-open-account-result-top {
        padding: $global-padding;
        .title {
            font-size: 28px;
            font-family: PingFangHK-Medium;
            font-weight: 500;
            line-height: 40px;
            color: rgba(57, 57, 57, 1);
        }
    }
    .hk-open-account-result-main {
        padding: $global-padding;
        .top-wrap {
            display: flex;
            .audit-track-line {
                padding-top: 33px;
            }
            .open-result-top {
                .audit-text {
                    padding-top: 30px;
                    padding-left: 29px;
                }
                .audit-result {
                    margin-top: 16px;
                    margin-left: 6px;
                    margin-bottom: 10px;
                }
            }
        }
        .bottom-wrap {
            display: flex;
            font-weight: 400;
            .check-track-line {
                padding-top: 6px;
            }
            .open-result-bottom {
                .check-result {
                    margin-top: -6px;
                    margin-left: 6px;
                }
                .check-text {
                    padding-left: 29px;
                }
            }
        }
        .finally-tip {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 10px;
            .finally-tip-text {
                font-size: 14px;
                color: rgba(57, 57, 57, 0.4);
                line-height: 20px;
                padding-right: 6px;
            }
            .right-arrow {
                width: 7px;
                height: 7px;
                border-top: 1px solid rgba(57, 57, 57, 0.4);
                border-right: 1px solid rgba(57, 57, 57, 0.4);
                transform: rotate(45deg);
            }
        }
    }
    .apply-footer {
        .footerBanner {
            height: 94px;
            width: 100%;
            background-position: center;
            background-size: cover;
            background-repeat: no-repeat;
            &.banner-dl {
                background-image: url('/webapp/open-account-hk/result/open-result-jt.png');
            }
            &.banner-hk {
                background-image: url('/webapp/open-account-hk/result/open-result-ft.png');
            }
            &.banner-eng {
                background-image: url('/webapp/open-account-hk/result/open-result-eng.png');
            }
            &.webp.webp-dl {
                background-image: url('/webapp/open-account-hk/result/webp/open-result-jt.webp');
            }
            &.webp.webp-hk {
                background-image: url('/webapp/open-account-hk/result/webp/open-result-ft.webp');
            }
            &.webp.webp-eng {
                background-image: url('/webapp/open-account-hk/result/webp/open-result-eng.webp');
            }
        }
    }
}
</style>
