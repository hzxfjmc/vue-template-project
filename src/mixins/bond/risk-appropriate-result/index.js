import { Checkbox } from 'vant'
import FixedOperateBtn from '@/biz-components/fix-operate-button/index.vue'
import { riskAssessResult, getCurrentUser } from '@/service/user-server.js'
import { getBondDetail } from '@/service/finance-info-server.js'
import { i18nData } from './i18n.js'

export default {
    i18n: i18nData,
    name: 'RiskAppropriateResult',
    components: {
        FixedOperateBtn,
        [Checkbox.name]: Checkbox
    },
    created() {
        console.log(this.bondRiskLevel, '0000')
        // 等待预定请求完成后，执行下一步操作
        this.getCurrentUser()
        if (!this.$route.query.fundRiskType) {
            this.handleGetBondDetail()
        }
        this.handleSetupResult()
    },
    data() {
        return {
            isReadProductInfo: true, // 是否阅读了产品资料
            isDisabled: false, // 是否禁止按钮
            riskMatchResult: 1, // 风险匹配结果
            productUrl: '', // 产品资料url
            riskTypeList: {
                // 风险等级列表
                100: '--',
                0: '尚未风评',
                1: '低风险及以上可购买',
                2: '中低风险及以上可购买',
                3: '中风险及以上可购买',
                4: '中高风险及以上可购买',
                5: '高风险'
            },
            userRiskLevel: 0, // 用户风险测评等级
            assessResultName: '', //测评结果文案
            bondRiskLevel: this.$route.query.fundRiskType || 100, // 债券/基金风险等级
            btnText: '',
            isShowPage: false,
            userInfo: '',
            fundCode: ''
        }
    },
    methods: {
        // 将多个异步聚合为同步
        async handleSetupResult() {
            await Promise.resolve(this.handleRiskAssessResult())
            if (this.userRiskLevel === 0) {
                // 尚未风评
                this.riskMatchResult = 1
                this.btnText = this.$t('startRisk')
            } else if (this.userRiskLevel < this.bondRiskLevel) {
                // 风评级别不够
                this.riskMatchResult = 2
                this.btnText = this.$t('againRisk')
            } else {
                // 风评级别够了，可以购买
                this.riskMatchResult = 3
                this.btnText = this.$t('sure')
            }
            this.isShowPage = true
        },
        // 拉取风险测评结果
        async handleRiskAssessResult() {
            try {
                let res = await riskAssessResult()
                this.userRiskLevel = res.assessResult || 0 // 用户风险测评等级
                this.assessResultName = res.assessResultName
                console.log(
                    'riskAssessResult:data:>>> ',
                    res.assessResult,
                    this.assessResultName
                )
            } catch (e) {
                if (e.msg) {
                    this.$alert(e.msg)
                }
                console.log('riskAssessResult:error:>>>', e)
            }
        },
        // 获取债券信息
        async handleGetBondDetail() {
            try {
                let { bondEditableInfo } = await getBondDetail(
                    this.$route.query.id - 0
                )
                this.productUrl =
                    bondEditableInfo && bondEditableInfo.productOverview // 产品资料url
                this.bondRiskLevel =
                    (bondEditableInfo &&
                        bondEditableInfo.riskLevel &&
                        bondEditableInfo.riskLevel.type) ||
                    100 // 债券风险等级
                console.log('getBondDetail:data:>>> ', bondEditableInfo)
            } catch (error) {
                console.log('getBondDetail:error:>>> ', error)
            }
        },
        // 操作按钮
        handleAction() {
            if (this.isDisabled) return
            if (
                this.userRiskLevel === 0 ||
                this.userRiskLevel < this.bondRiskLevel
            ) {
                // 尚未风评，跳转到风险测评，或者等级不够
                this.$router.push({
                    path: '/risk-assessment',
                    query: {
                        id: this.$route.query.id,
                        fundRiskType: this.$route.query.fundRiskType
                    }
                })
            } else {
                // 风评级别够了，可以购买，跳转到下单界面
                if (this.$route.query.direction) {
                    let direction =
                        (this.$route.query.direction &&
                            this.$route.query.direction) ||
                        1
                    let path =
                        direction == 2 ? 'transaction-sell' : 'transaction-buy'
                    this.$router.push({
                        path: `/${path}`,
                        query: {
                            id: this.$route.query.id
                        }
                    })
                } else {
                    let data = {
                        query: {
                            id: this.$route.query.id,
                            currencyType: this.$route.query.currencyType,
                            assessResult:
                                this.userInfo && this.userInfo.assessResult,
                            fundCode: this.fundCode
                        }
                    }
                    data.path =
                        (31 & this.userInfo.extendStatusBit) > 0
                            ? '/fund-subscribe'
                            : '/open-permissions'
                    this.$router.push(data)
                }
            }
        },
        //获取用户信息
        async getCurrentUser() {
            try {
                const res = await getCurrentUser()
                this.userInfo = res
                console.log(this.userInfo)
            } catch (e) {
                console.log('getCurrentUser:error:>>>', e)
            }
        }
    },
    watch: {
        isReadProductInfo() {
            if (this.isReadProductInfo) {
                this.isDisabled = false
            } else {
                this.isDisabled = true
            }
        }
    }
}
