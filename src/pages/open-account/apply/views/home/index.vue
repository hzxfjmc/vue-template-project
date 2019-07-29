<template lang="pug">
    .home.full-height
        van-dialog.home-tip(
            title="开户资料提交成功"
            v-model="showNextFlag"
            :show-confirm-button="false")
            .content
                p 我们将在1个工作日完成审核
                van-button(type="primary" @click="showNextFlag = false") 接下來，核实身份完成开户
        .component-wrap
            component(
                v-show="isShowView"
                :is="currentView"
                :updateResult="updateResult"
                :openTip="openTip"
                :infoEditStatus="infoEditStatus"
                :identifyType="identifyType"
                :ipadOpenAccountStatus="ipadOpenAccountStatus"
                @changeView="changeCurrentView"
                )
            .yx-company-provide(v-if="appType.Ch") *证券交易服务由友信证券有限公司提供
                p(v-if="showStatement") 美股交易清算服务由JuniorChina Securities提供
</template>

<script>
import { getHKOpenAccountInfo } from '@/service/user-account-server-hk.js'
import InlandResult from './inland-result.vue'
import result from './result.vue'
import noPass from './no-pass.vue'
import ipadResult from './ipad-result.vue'
import { appType, channelId } from '@/utils/html-utils.js'
import { getAppSystem } from '@/service/config-manager.js'
export default {
    components: {
        result,
        noPass,
        InlandResult,
        ipadResult
    },
    computed: {
        isLogin() {
            return this.$store.getters.isLogin
        }
    },
    data() {
        return {
            showStatement: false,
            appType: appType,
            ipadOpenAccountStatus: '',
            isShowView: false,
            showNextFlag: false,
            currentView: 'inland-result',
            openTip: '立即开户',
            openTipMap: {
                initStatus: '立即开户'
            },
            identifyType: 1,
            infoEditStatus: 0,
            updateResult: {
                customerIdentityStatus: 0,
                openAccountStatus: 0,
                proofOfAddressStatus: 0
            }
        }
    },
    async created() {
        // 刚进来的时候，需要判断用户是否登录
        this.$loading()
        if (this.isLogin) {
            await this.jumpNextHandle()
        } else {
            this.$close()
            this.isShowView = true
            // 未登陆，进inland-result页
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
                    this.jumpNextHandle()
                } else {
                    // 未登录，先进入home页面
                    Object.assign(this.$data, this.$options.data())
                    this.currentView = 'inland-result'
                    this.$bus.$emit('inland-init')
                    this.openTip = this.openTipMap.initStatus
                    this.isShowView = true
                }
            }
        }
        this.getAppSystem()
    },
    methods: {
        async getAppSystem() {
            try {
                // vivo是否显示提示
                let { list } = (await getAppSystem(['VIVO-US-STATEMENT'])) || []
                if (
                    list.length > 0 &&
                    list[0].content === '允许' &&
                    channelId &&
                    channelId.indexOf('vivo') > -1
                ) {
                    this.showStatement = true
                }
            } catch {
                console.log('VIVO-US-STATEMENT')
            }
        },
        changeCurrentView(view) {
            this.currentView = view
        },
        showDialogMethod() {
            if (this.$LS.get('showDialog')) {
                // this.showNextFlag = true // 先注释
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
                    identifyType,
                    ipadOpened,
                    ipadOpenAccountStatus,
                    userId
                } = await getHKOpenAccountInfo()
                this.updateResult.proofOfAddressStatus = proofOfAddressStatus
                this.updateResult.customerIdentityStatus = customerIdentityStatus
                this.updateResult.openAccountStatus = openAccountStatus
                this.infoEditStatus = infoEditStatus
                this.identifyType = identifyType
                this.ipadOpenAccountStatus = ipadOpenAccountStatus
                this.$LS.put('identifyType', identifyType)
                this.$LS.put('isReOpen', this.isReOpen() ? 1 : 0)
                this.$LS.put('userId', userId)
                this.$root.$emit('buryingAction')
                // ipad开户逻辑
                if (ipadOpened === true) {
                    this.currentView = 'ipad-result'
                    this.isShowView = true
                    this.$close()
                    return
                }
                // 如果是内地身份之开户 跳转到内地身份证开户首页
                if (identifyType === 1) {
                    this.currentView = 'inland-result'
                    this.isShowView = true
                    this.$bus.$emit('inland-init')
                    this.$close()
                    return
                }
                // 没有开始走流程 或者走到一半未完成
                if (
                    infoEditStatus === 0 ||
                    (openAccountStatus === 0 && infoEditStatus !== 0)
                ) {
                    this.currentView = 'inland-result'
                    this.openTip = this.openTipMap.initStatus
                    this.$bus.$emit('inland-init')
                } else if (openAccountStatus === 12) {
                    // 开户流程走完，被驳回
                    this.currentView = 'no-pass'
                } else if (
                    // 开户流程走完，进入结果页
                    openAccountStatus !== 12 &&
                    openAccountStatus !== 0 &&
                    infoEditStatus !== 0
                ) {
                    this.currentView = 'result'
                }
                this.$close()
                this.isShowView = true
            } catch (e) {
                this.$toast(e.msg)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.component-wrap {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
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
                font-size: 0.32rem;
            }
        }
    }
}
</style>
