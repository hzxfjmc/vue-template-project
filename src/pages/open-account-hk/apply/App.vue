<template lang="pug">
#app.full-height.flex-fixed
    .wrap-app-hk
        .error-tip(v-if="approvalOpinion[step]")
            ul
                li.li-wrap(v-for="item in approvalOpinion[step]")
                    i(class="iconfont  warning icon-warning")
                    span.error-list {{item}}
        van-dialog(
            :message="$t('app.sureExitOpen')"
            v-model="showExit"
            :confirm-button-text="$t('app.continueOpenAccount')"
            :cancelButtonText="$t('app.exit')"
            @cancel="quitHandle"
            show-cancel-button)
    keep-alive
        router-view
</template>

<script>
import Navbar from '@/components/yx-nav-bar/index.vue'
import jsBridge from '@/utils/js-bridge.js'
import { isYouxinApp } from '@/utils/html-utils.js'
export default {
    i18n: {
        zhCHS: {
            app: {
                sureExitOpen: '确认要退出开户吗？',
                continueOpenAccount: '继续开户',
                exit: '退出'
            }
        },
        zhCHT: {
            app: {
                sureExitOpen: '確認要退出開戶嗎？',
                continueOpenAccount: '繼續開戶',
                exit: '退出'
            }
        },
        en: {
            app: {
                sureExitOpen: 'Confirm to exit the application?',
                continueOpenAccount: 'Continue The Application',
                exit: 'exit'
            }
        }
    },
    mixins: [require('./mixins/mix-router.js').default],
    components: {
        Navbar
    },
    data() {
        return {
            errorTip: [],
            RequestId: '',
            data: [],
            showExit: false
        }
    },
    computed: {
        appType() {
            return this.$store.getters.appType
        }
    },
    watch: {
        // 状态变化一定伴随路由变化
        $route: {
            handler: 'initGlobalCallBack',
            immediate: true
        }
    },
    methods: {
        closeClickHandler() {
            if (this.step) {
                this.showExit = true
            } else {
                this.quitHandle()
            }
        },
        quitHandle() {
            jsBridge.callApp('command_close_webview')
        },
        backClickHandler() {
            let step = this.step
            if (step) {
                if (1 < step && step < 7) {
                    step--
                    this.$router.replace(`/step/${step}`)
                } else if (step === '1') {
                    this.showExit = true
                } else if (step === '7') {
                    // 跳转到结果页面
                    if (isYouxinApp) {
                        jsBridge.callApp('command_close_webview')
                    } else {
                        this.$router.push({ name: 'home' })
                    }
                }
                return true
            } else {
                return false
            }
        },
        goInlandStep(pageName) {
            window.location.href =
                window.location.origin +
                `/webapp/open-account/apply.html#${pageName}`
        },
        initGlobalCallBack() {
            window.h5ClosePage = () => {
                this.closeClickHandler()
                return true
            }
            window.h5HistoryBack = () => {
                return this.backClickHandler()
            }
        }
    }
}
</script>

<style lang="scss">
@import '../../../../src/assets/styles/global.scss';
@import '../../../../src/assets/styles/common.scss';
@import '../../../../src/assets/styles/common-hk.scss';
@import '../../../../src/assets/styles/vant-reset.scss';
@import '../../../../src/assets/styles/vant-reset-hk.scss';
#app {
    .wrap-app-hk {
        .error-tip {
            background: rgba(252, 112, 24, 1);
            padding: 7px 10px;
            font-size: 14px;
            font-family: PingFangHK-Regular;
            font-weight: 400;
            color: rgba(255, 255, 255, 1);
            line-height: 20px;
            .li-wrap {
                display: flex;
                .error-list {
                    padding-left: 6px;
                }
            }
        }
    }
}
.hk-open-account {
    .container-title {
        padding-top: 25px;
        font-size: 28px;
    }
}
#app {
    .bp-field.van-cell {
        padding: 0 15px 6px 0;
    }
}
</style>
