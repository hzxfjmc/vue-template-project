import { Checkbox, Button } from 'vant'
import YxContainerBetter from '@/components/yx-container-better'
import { riskAssessResult, getCurrentUser } from '@/service/user-server.js'
import { getBondDetail, getFundDetail } from '@/service/finance-info-server.js'
import dayjs from 'dayjs'
import { i18nAppropriateData } from './risk-appropriate-result-i18n.js'
import jsBridge from '@/utils/js-bridge.js'
import { mapGetters } from 'vuex'
export default {
    name: 'RiskAppropriateResult',
    i18n: i18nAppropriateData,
    components: {
        YxContainerBetter,
        [Checkbox.name]: Checkbox,
        [Button.name]: Button
    },
    computed: {
        ...mapGetters(['appType']),
        wealthPage() {
            return this.appType.Ch ? 'bond' : 'bond-hk'
        },
        resetTimes() {
            return {
                zhCHS: dayjs(this.resetTime).format('YYYY年MM月DD日') + '重置',
                zhCHT: dayjs(this.resetTime).format('YYYY年MM月DD日') + '重置',
                en:
                    'Resert on 1st January, ' +
                    dayjs(this.resetTime).format('YYYY')
            }[this.$i18n.lang]
        },
        btnText() {
            if (this.userRiskLevel === 0) {
                return this.$t('startRisk')
            } else if (this.userRiskLevel < this.bondRiskLevel) {
                return this.$t('againRisk')
            } else {
                return this.$t('sure')
            }
        }
    },
    created() {
        console.log(this.bondRiskLevel, '0000')
        // 等待预定请求完成后，执行下一步操作
        this.getCurrentUser()
        // if (!this.$route.query.fundRiskType) {
        //     this.handleGetBondDetail()
        // }
        this.handleSetupResult()
    },
    data() {
        return {
            isReadProductInfo: true, // 是否阅读了产品资料
            isDisabled: false, // 是否禁止按钮
            riskMatchResult: 0, // 风险匹配结果
            productUrl: '', // 产品资料url
            userRiskLevel: 0, // 用户风险测评等级
            assessResultName: '', //测评结果文案
            bondRiskLevel: this.$route.query.fundRiskType || 100, // 债券/基金风险等级
            // btnText: '',
            riskTypeList: {
                // 风险等级列表
                100: '--',
                0: '尚未风评',
                1: '保守型(A1)及以上可购买',
                2: '稳健型(A2)及以上可购买',
                3: '均衡型(A3)及以上可购买',
                4: '增长型(A4)及以上可购买',
                5: '进取型(A5)'
            },
            isShowPage: false,
            userInfo: '',
            fundCode: '',
            number: 0, //剩余测评次数
            showRemainingNum: false, //剩余次数弹窗
            resetTime: '', //重置时间
            damagedStatus: 0 //是否为易受损用户
        }
    },
    methods: {
        // 将多个异步聚合为同步
        async handleSetupResult() {
            await Promise.all([
                this.handleGetBondDetail(),
                this.handleRiskAssessResult()
            ])
            if (this.userRiskLevel === 0) {
                // 尚未风评
                this.riskMatchResult = 1
                // this.btnText = this.$t('startRisk')
            } else if (this.userRiskLevel < this.bondRiskLevel) {
                console.log(this.bondRiskLevel, 'bondRiskLevel')
                // 风评级别不够
                this.riskMatchResult = 2
                // this.btnText = this.$t('againRisk')
            } else {
                // 风评级别够了，可以购买
                this.riskMatchResult = 3
                // this.btnText = this.$t('sure')
            }
            this.isShowPage = true
        },
        // 拉取风险测评结果
        async handleRiskAssessResult() {
            try {
                let res = await riskAssessResult()
                this.userRiskLevel = res.assessResult || 0 // 用户风险测评等级
                this.assessResultName = res.assessResultName
                this.number = res.validCount
                this.resetTime = res.resetTime
                this.damagedStatus = res.damagedStatus
                if (res.damagedStatus === 1) {
                    let url =
                        window.location.origin +
                        `/wealth/fund/index.html#/risk-assessment-result?id=${this.$route.query.id}&fundRiskType=${this.bondRiskLevel}&wealthPage=${this.wealthPage}`
                    window.location.replace(url)
                    // this.$router.replace({
                    //     path: '/risk-assessment-result',
                    //     query: {
                    //         id: this.$route.query.id,
                    //         fundRiskType: this.bondRiskLevel
                    //     }
                    // })
                }
                console.log(this.damagedStatus, 'this.damagedStatus')
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
                    (bondEditableInfo && bondEditableInfo.riskLevelType) || 100 // 债券风险等级
                console.log('getBondDetail:data:>>> ', bondEditableInfo)
            } catch (error) {
                console.log('getBondDetail:error:>>> ', error)
            }
        },
        // 获取基金信息
        async getFundDetailFun() {
            let res = await getFundDetail({
                displayLocation: 1,
                fundId: this.$route.query.id
            })
            console.log(this.$route.query.id, 'id')
            this.bondRiskLevel = res.fundHeaderInfoVO.fundRiskType
        },
        // 操作按钮
        handleAction() {
            if (this.isDisabled) return
            if (this.userRiskLevel === 0) {
                // 尚未风评，跳转到风险测评
                let url =
                    window.location.origin +
                    `/wealth/fund/index.html#/risk-assessment?id=${this.$route.query.id}&direction=${this.$route.query.direction}&fundRiskType=${this.bondRiskLevel}&wealthPage=${this.wealthPage}`
                window.location.replace(url)
                // this.$router.push({
                //     path: '/risk-assessment',
                //     query: {
                //         id: this.$route.query.id,
                //         fundRiskType: this.$route.query.fundRiskType
                //     }
                // })
            } else if (this.userRiskLevel < this.bondRiskLevel) {
                // 风险等级不够 弹出剩余次数提示
                this.showRemainingNum = true
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
                        (this.userInfo.extendStatusBit & 16) > 0
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
        },
        // 开始测评或拨打客服电话
        startRiskHandle(number) {
            if (number === 0) {
                jsBridge.gotoCustomerService()
            } else {
                // 跳转到风险测评
                this.$router.push({
                    path: '/risk-assessment',
                    query: {
                        id: this.$route.query.id,
                        fundRiskType: this.$route.query.fundRiskType
                    }
                })
            }
        },
        // 关闭
        callOrCancel() {
            this.showRemainingNum = false
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
