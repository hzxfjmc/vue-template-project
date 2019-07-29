// infoEditStatus
// 1.上传身份证是否完成
// 2.确认身份信息是否完成（四要素）
// 3.职业联系信息是否完成
// 4.财务投资是否完成
// 5.风险披露是否完成
// 6.活体认证
// 7.确认&签名是否完成
// 8.CA证书签名是否完成
// 返回最前未完成的步骤
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapMutations } = createNamespacedHelpers('apply')
export default {
    data() {
        return {
            loading: false,
            step:
                this.$route.path.match(/\/step\/(\d)/) &&
                this.$route.path.match(/\/step\/(\d)/)[1]
        }
    },
    computed: {
        ...mapGetters([`stepStatus`, `basicInfo`, `routerStatus`, `initState`]),
        submited() {
            return this.routerStatus[this.step]
        },
        userId() {
            return this.$store.getters.user.userId
        }
    },
    async created() {
        // 活体认证之后且certSN不存在则执行
        if (
            this.$route.name !== 'result' &&
            this.stepStatus > 6 &&
            !this.initState.ca.certSN &&
            !this.initState.ca.pending
        ) {
            try {
                this.caInitAction()
            } catch (e) {
                e && e.msg && this.$toast(e.msg)
            }
        }
    },
    methods: {
        async caInitAction() {
            try {
                let { getCertP10 } = await import('../utils/ca.js')
                let ca = {
                    pending: true
                }
                this.initMutation({ ca })
                let { certDN } = await this.$accountService.getCaCertdn()
                let { certP10, privateKeyPem } = await getCertP10(certDN)
                if (!certP10) {
                    ca = { errorSubmit: 'certP10获取失败', pending: false }
                    this.initMutation({ ca })
                    return
                }
                let { certSN } = await this.$accountService.getCaCertSn(
                    certDN,
                    certP10
                )
                ca = {
                    certDN,
                    certSN,
                    privateKeyPem,
                    errorSubmit: false,
                    pending: false
                }
                this.initMutation({ ca })
            } catch (e) {
                let ca = { errorSubmit: e.msg, pending: false }
                this.initMutation({ ca })
                throw e
            }
        },
        ...mapMutations(['setBasicInfo', 'initMutation']),
        async goApplyStep(type = 'push', stepType = 'next') {
            if (this.loading) {
                return
            }
            this.loading = true
            if (typeof type === 'object') {
                type = 'push'
            }
            let infoEditStatus, identifyType
            try {
                let data = await this.$accountService.getCustomerOpInfoEditStatus()
                infoEditStatus = data.infoEditStatus
                identifyType = data.identifyType
                // 未登录的时候 默认是到第一步
            } catch (e) {
                infoEditStatus = 0
            } finally {
                this.loading = false
            }
            this.setBasicInfo({ infoEditStatus })

            // 如果已经审核通过则需要跳过此步骤
            if (stepType !== 'skip') {
                let step = this.step
                step++
                this.$router[type](`/step/${step}`)
                return
            }
            // 直接skip跳到对应的步骤
            // 未选择证件类型或者选择的非大陆身份证
            if (identifyType !== 1) {
                this.$router[type](`/step/0`)
            } else if (this.stepStatus === 0) {
                // 如果是完成则关闭当前webview
                this.$jsBridge.callApp('command_close_webview')
            } else {
                this.$router[type](`/step/${this.stepStatus}`)
            }
        }
    }
}
