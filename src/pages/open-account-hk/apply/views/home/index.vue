<template lang="pug">
    .home.full-height
        van-dialog.home-tip(
            :title="$t('index.title')"
            v-model="showNextFlag"
            :show-confirm-button="false")
            .content
                p {{ $t('index.title') }}
                van-button(type="primary" @click="showNextFlag = false") {{ $t('index.nextTodo') }}
        component(
            :identifyType="identifyType"
            v-show="isShowView"
            :is="currentView"
            :updateResult="updateResult"
            :openTip="openTip"
            :infoEditStatus="infoEditStatus"
            :ipadOpenAccountStatus="ipadOpenAccountStatus"
            @changeView="changeCurrentView"
            )
</template>

<script>
import { getHKOpenAccountInfo } from '@/service/user-account-server-hk.js'
import InlandResult from './inland-result.vue'
import home from './home.vue'
import result from './result.vue'
import noPass from './no-pass.vue'
import IpadResult from './ipad-result.vue'
export default {
    i18n: {
        zhCHS: {
            index: {
                title: '开户资料提交成功',
                contentP: '我们将在1个工作日完成审核',
                nextTodo: '接下來，核实身份完成开户',
                openTip: '立即开户',
                centerStatus: '继续开户'
            }
        },
        zhCHT: {
            index: {
                title: '開戶資料提交成功',
                contentP: '我們將在1個工作日完成審核',
                nextTodo: '接下來，核實身份完成開戶',
                openTip: '立即開戶',
                centerStatus: '繼續開戶'
            }
        },
        en: {
            index: {
                title: 'Information Submitted',
                contentP: 'We will process in 1 working day',
                nextTodo: 'Next, please verify identity',
                openTip: 'Open Account Now',
                centerStatus: 'Continue The Application'
            }
        }
    },
    components: {
        home,
        result,
        noPass,
        InlandResult,
        IpadResult
    },
    computed: {
        isLogin() {
            return this.$store.getters.isLogin
        }
    },
    data() {
        return {
            isShowView: false,
            showNextFlag: false,
            currentView: 'home',
            identifyType: 0,
            openTip: this.$t('index.openTip'),
            openTipMap: {
                initStatus: this.$t('index.openTip'),
                centerStatus: this.$t('index.centerStatus')
            },
            infoEditStatus: 0,
            updateResult: {
                customerIdentityStatus: 0,
                openAccountStatus: 0,
                proofOfAddressStatus: 0
            },
            ipadOpenAccountStatus: ''
        }
    },
    watch: {
        currentView: {
            handler(v) {
                this.$store.dispatch('apply/setCurrentView', v)
            },
            immediate: true
        }
        // updateResult: {
        //     handler(v) {
        //         this.$store.dispatch('apply/setUpdateResult', v)
        //     },
        //     immediate: true,
        //     deep: true
        // }
    },
    async created() {
        // 刚进来的时候，需要判断用户是否登录
        this.$loading()
        if (this.isLogin) {
            await this.jumpNextHandle()
        } else {
            this.$close()
            this.isShowView = true
            // 未登录，先进入home页面
            this.openTip = this.openTipMap.initStatus
        }
        this.$jsBridge.callAppNoPromise(
            'command_watch_activity_status',
            {},
            'appVisible',
            'appInvisible'
        )
        window.appVisible = async data => {
            let re = data
            if (typeof data === 'string') {
                re = JSON.parse(data)
            }
            if (re.data.status !== 'visible') {
                return
            }
            try {
                await this.$store.dispatch('apply/initApplyAction')
            } finally {
                if (this.isLogin) {
                    await this.jumpNextHandle()
                } else {
                    // 未登录，先进入home页面
                    this.currentView = 'home'
                    this.openTip = this.openTipMap.initStatus
                }
            }
        }
    },
    methods: {
        changeCurrentView(view) {
            this.currentView = view.page
            view.ipadOpenAccountStatus &&
                (this.ipadOpenAccountStatus = view.ipadOpenAccountStatus)
        },
        showDialogMethod() {
            if (this.$LS.get('showDialog')) {
                // 有问题 暂时先注释
                // this.showNextFlag = true
                this.$LS.remove('showDialog')
            }
        },
        // 是否是重新开户（被驳回）
        isReOpen() {
            // 区分大陆证件开户还是香港证件开户
            let reOpenAccountStatus = this.identifyType === 1 ? 4 : 6
            return (
                this.updateResult.customerIdentityStatus === 4 ||
                this.updateResult.openAccountStatus === reOpenAccountStatus ||
                this.updateResult.proofOfAddressStatus === 5
            )
        },
        async jumpNextHandle() {
            this.showDialogMethod()
            try {
                let {
                    infoEditStatus,
                    openAccountStatus,
                    customerIdentityStatus,
                    proofOfAddressStatus,
                    ipadOpened,
                    identifyType,
                    ipadOpenAccountStatus,
                    userId
                } = await getHKOpenAccountInfo()
                this.updateResult.proofOfAddressStatus = proofOfAddressStatus
                this.updateResult.customerIdentityStatus = customerIdentityStatus
                this.updateResult.openAccountStatus = openAccountStatus // 香港证件状态 {} 内地证件状态
                this.identifyType = identifyType
                this.$LS.put('identifyType', identifyType)
                this.$LS.put('isReOpen', this.isReOpen() ? 1 : 0)
                this.$LS.put('userId', userId)
                this.$root.$emit('buryingAction')
                // this.$store.dispatch('apply/setIdentifyType', identifyType)
                // ipad 开户状态
                this.ipadOpenAccountStatus = ipadOpenAccountStatus
                // 大陆开户审核状态
                //   EDITING(0, "提交资料中"),
                //   FIRST_VERIFY(1, "待初审"),
                //   FINAL_VERIFY(2, "待终审"),
                //   OPEN_ACCOUNT_FAILED(3, "开户失败"),
                //   REJECT_TO_CUSTOMER(4, "开户驳回"),
                //   UNABLE_OPEN_ACCOUNT(5, "无法开户"),
                //   FINISH(6, "开户成功"),
                //   REJECT_TO_FIRST(7, "待初审"),

                //                 港版开户审核状态
                //  EDITING(0, "提交资料中"),
                //   FIRST_VERIFY(1, "待初审资料"),
                //   WAIT_UPLOAD_PROOF_OF_ADRESS(2, "待传住址证明"),
                //   WAIT_VERIFY_PROOF_OF_ADRESS(3, "待审住址证明"),
                //   WAIT_AML_AUDIT(4, "反洗钱待复核"),
                //   PASS_FIRST_AUDIT(5, "开户资料通过"),
                //   REJECT_TO_CUSTOMER(6, "开户资料驳回至客户"),
                //   REJECT_TO_FIRST(7, "开户资料驳回至客服"),
                //   FINAL_VERIFY(8, "待终审"),
                //   WAIT_OPEN_HK_US_ACCOUNT(9, "待开港美股"),
                //   FINISH(10, "开户成功"),
                //   OPEN_ACCOUNT_FAILED(11, "开户失败"),
                //   UNABLE_OPEN_ACCOUNT(12, "无法开户");

                // ipad 开户状态
                // ipadOpened ===true 代表ipad开户
                this.infoEditStatus = infoEditStatus
                // 添加ipad 逻辑
                if (ipadOpened === true) {
                    this.currentView = 'ipad-result'
                    this.isShowView = true
                    this.$close()
                    return
                }
                // 如果是内地身份之开户除了继续开户 跳转到内地身份证开户首页
                if (identifyType === 1 && openAccountStatus !== 0) {
                    this.currentView = 'inland-result'
                    this.isShowView = true
                    this.$bus.$emit('inland-init')
                    this.$close()
                    return
                }
                // 没有开始走流程
                if (infoEditStatus === 0) {
                    this.currentView = 'home'
                    this.openTip = this.openTipMap.initStatus
                } else if (openAccountStatus === 12) {
                    // 开户流程走完，被驳回不允许再提交
                    this.currentView = 'no-pass'
                } else if (
                    // 开户流程走完，进入结果页
                    openAccountStatus !== 12 &&
                    openAccountStatus !== 0 &&
                    infoEditStatus !== 0
                ) {
                    this.currentView = 'result'
                } else if (
                    // 开户进行到一半退出
                    openAccountStatus === 0 &&
                    infoEditStatus !== 0
                ) {
                    this.currentView = 'home'
                    this.openTip = this.openTipMap.centerStatus
                }
                this.$close()
            } catch (e) {
                this.$toast(e.msg)
            } finally {
                this.isShowView = true
            }
        }
    }
}
</script>

<style lang="scss">
.home-tip {
    height: 210px;
    background: rgba(255, 255, 255, 1);
    border-radius: 14px;
    .van-dialog__header {
        font-size: 20px;
        padding-top: 45px;
    }
    .content {
        display: flex;
        flex-direction: column;
        padding: 7px 45px;
        justify-content: space-between;
        align-items: center;
        height: 110px;
        p {
            font-size: 12px;
            font-family: PingFangHK-Regular;
            font-weight: 400;
            color: $hk-text-color6;
            line-height: 17px;
        }
        .van-button {
            background-color: $hk-primary-color;
            span {
                font-size: 16px;
            }
        }
    }
}
</style>

<style lang="scss" scoped></style>
