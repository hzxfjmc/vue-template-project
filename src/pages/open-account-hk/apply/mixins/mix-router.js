// infoEditStatus
// 1.选择开户方式
// 2.个人资料
// 3.财务背景
// 4.职业状态
// 5.信息确认
// 6.签名
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('apply')
import { webViewScreen } from '@/utils/burying-point'
import { buryingViewPage, openAccountType } from '../const/map'
export default {
    mounted() {
        this.$root.$on('buryingAction', () => {
            this.buryingPoint(this.$route)
        })
    },
    computed: {
        ...mapGetters(['approvalOpinion', 'identityOpinion']),
        step() {
            let currentStep
            if (this.$route.path.match(/\/step\/(\d)/)) {
                currentStep = this.$route.path.match(/\/step\/(\d)/)[1]
            }
            return currentStep
        },
        currentView() {
            return this.$store.getters['apply/currentView']
        }
    },
    watch: {
        $route: {
            handler(route) {
                this.buryingPoint(route)
            }
        },
        currentView() {
            this.buryingPoint(this.$route)
        }
    },
    methods: {
        buryingPoint(route) {
            this.$nextTick(() => {
                // TODO 用LS会有一个问题，开户之后第一次登录其他账号进入开户，会存上次开户的证件类型进埋点
                // 暂时处理为，进入首页不传证件类型
                // 开户证件类型
                let openType = this.$LS.get('identifyType')
                // 是否进入首页
                let isHomePage = route.path === '/home' || route.path === '/'
                // 开户页面类型
                let page = 'home'
                // 首页的currentView字段
                let currentView = this.$store.getters['apply/currentView']
                if (isHomePage) {
                    if (!currentView || currentView === 'home') {
                        page = 'home'
                    } else if (currentView === 'inland-result') {
                        page = 'inlandResult'
                    } else {
                        page = 'result'
                    }
                } else {
                    page = this.step ? this.step : ''
                }
                // 首页和选择证件类型，不传证件
                if (page === 'home' || page === '1') {
                    openType = 0
                }
                let openTypeObj = openAccountType[openType] || {}
                // 首页不传是否是驳回开户状态
                let isReOpen = page === 'home' ? '' : this.$LS.get('isReOpen')
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
