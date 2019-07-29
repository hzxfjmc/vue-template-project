<template lang="pug">
  #app.full-height.flex-fixed
    .error-tips(v-if="errorTip.length > 0")
        .errorText
            p(v-for="item, index in errorTip" :key="item")
                span.iconfont.icon-laba(v-if="index === 0" )
                span.text(:class="{'no-padding': index === 0}") {{item}}
    keep-alive
        router-view
</template>

<script>
import jsBridge from '@/utils/js-bridge.js'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('apply')
import { webViewScreen } from '@/utils/burying-point'
import {
    buryingViewPage,
    openAccountType
} from '../../open-account/apply/const/map'

export default {
    data() {
        return {
            errorTip: []
        }
    },
    mounted() {
        this.$root.$on('buryingAction', () => {
            this.buryingPoint(this.$route)
        })
    },
    computed: {
        ...mapGetters([`stepStatus`, `infoEditStatus`, `initState`]),
        currentStatus() {
            return this.$PROCESS_STATUS[this.stepStatus]
        },
        step() {
            const routeMatch = this.$route.path.match(/\/step\/(\d)/)
            return routeMatch && routeMatch[1]
        },
        isRejectStatus() {
            // 是否是驳回状态
            return (
                this.initState.rejectInfoMap &&
                Object.keys(this.initState.rejectInfoMap).length > 0
            )
        },
        appType() {
            return this.$store.getters.appType
        }
        // currentView() {
        //     return this.$store.getters['apply/currentView']
        // },
        // inlandResultStatus() {
        //     return this.$store.getters['apply/inlandResultStatus']
        // }
    },
    watch: {
        // 状态变化一定伴随路由变化
        // 去掉immediate是因为进来会执行两遍
        $route: {
            handler: 'initGlobalCallBack',
            // immediate: true,
            deep: true
        }
        // inlandResultStatus: {
        //     handler() {
        //         this.buryingPoint(this.$route)
        //     }
        // },
        // // TODO 一个页面监听三个值变化，数据会刷三遍
        // currentView: {
        //     handler() {
        //         this.buryingPoint(this.$route)
        //     }
        // }
    },
    methods: {
        initGlobalCallBack(route) {
            this.buryingPoint(route)
            window.h5ClosePage = () => {
                this.closeHandler()
                return true
            }
            window.h5HistoryBack = () => {
                // 键盘bug处理
                setTimeout(() => {
                    document.body.scrollTop = document.body.scrollHeight
                }, 300)
                let step = this.step
                // 如果是香港app返回到香港的选择证件的步骤
                if (this.appType.Hk && step === '1') {
                    this.goHKStep(`/step/1`)
                } else if (step && step !== '0') {
                    step--
                    this.$router.replace(`/step/${step}`)
                } else {
                    this.closeHandler()
                }
                return true
            }
            this.errorTip =
                (this.initState.rejectInfoMap &&
                    this.initState.rejectInfoMap[this.step]) ||
                []
        },
        goHKStep(path) {
            window.location.href = `/webapp/open-account-hk/apply.html#${path}`
        },
        async closeHandler() {
            try {
                if (this.stepStatus === 0 || !this.step) {
                    jsBridge.callApp('command_close_webview')
                }
                await this.$confirm({
                    title: '确认退出开户吗？',
                    message: `您已完成${this.currentStatus.precent}%，${this.currentStatus.time}`,
                    confirmButtonText: '继续开户',
                    cancelButtonText: '退出'
                })
            } catch (e) {
                jsBridge.callApp('command_close_webview')
            }
        },
        buryingPoint(route) {
            this.$nextTick(() => {
                // 暂时处理为，进入首页不传证件类型
                // 开户证件类型
                let openType = this.$LS.get('identifyType')
                // 是否进入首页
                let isHomePage = route.path === '/home' || route.path === '/'
                // 开户页面类型
                let page = '0'
                // 首页的currentView字段
                // let inlandResultStatus = this.$store.getters[
                //     'apply/inlandResultStatus'
                // ]
                // let hkView = this.currentView === 'result'
                if (isHomePage) {
                    // if (hkView) {
                    //     page = 'result'
                    // } else {
                    //     let isInlandHome = inlandResultStatus === -1
                    //     if (isInlandHome) {
                    //         page = 'home'
                    //     } else {
                    //         page = 'inland-result'
                    //     }
                    // }
                    return
                } else {
                    page = this.step || ''
                }
                // 首页和选择证件类型，不传证件
                if (page === 'home' || page === '0') {
                    openType = 0
                }
                // 首页不传是否是驳回开户状态
                let isReOpen = page === 'home' ? '' : this.$LS.get('isReOpen')
                let openTypeObj = openAccountType[openType] || {}
                if (buryingViewPage[page] && buryingViewPage[page].id) {
                    webViewScreen(
                        buryingViewPage[page].id,
                        openTypeObj.id,
                        openTypeObj.name,
                        isReOpen
                    )
                }
            })
        }
    }
}
</script>

<style lang="scss">
@import '../../../../src/assets/styles/global.scss';
@import '../../../../src/assets/styles/common.scss';
@import '../../../../src/assets/styles/vant-reset.scss';
#app {
    .error-tips {
        background-color: #fb976b;
        color: #fff;
        justify-content: flex-start;
        padding: 6px;
        .icon-laba {
            font-size: 18px;
            line-height: 21px;
        }
        .errorText {
            p {
                .text {
                    padding-left: 28px;
                }
                .no-padding {
                    padding-left: 10px;
                }
            }
        }
    }
}
</style>
