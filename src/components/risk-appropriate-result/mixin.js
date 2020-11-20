import { Checkbox, Button } from 'vant'
import YxContainerBetter from '@/components/yx-container-better'
import {
    riskAssessResult,
    getFundUserInfo,
    checkRiskAssessTimes
} from '@/service/user-server.js'
import { getBondDetail, getFundDetail } from '@/service/finance-info-server.js'
// import dayjs from 'dayjs'
import jsBridge from '@/utils/js-bridge.js'
import '../risk-assessment-result/remain-dialog.scss'

export default {
    name: 'RiskAppropriateResult',
    components: {
        YxContainerBetter,
        [Checkbox.name]: Checkbox,
        [Button.name]: Button
    },
    computed: {
        allowSubscribeShow() {
            return (
                this.userInfo.damagedStatus != 1 &&
                this.fundOverviewInfoVO.derivativeType === 1 &&
                this.userInfo.assessResult
            )
        }
        // resetTimes() {
        //     return {
        //         zhCHS: dayjs(this.resetTime).format('YYYY年MM月DD日') + '重置',
        //         zhCHT: dayjs(this.resetTime).format('YYYY年MM月DD日') + '重置',
        //         en:
        //             'Resert on 1st January, ' +
        //             dayjs(this.resetTime).format('YYYY')
        //     }[this.$i18n.lang]
        // },
    },
    created() {
        console.log(this.productRiskLevel, '0000')
        // 等待预定请求完成后，执行下一步操作
        console.log(window.location.href)
        if (this.$route.query.direction) {
            this.handleGetBondDetail()
        } else {
            this.getFundDetailFun()
        }
        this.getFundUserInfo()
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
            productRiskLevel: this.$route.query.fundRiskType || 100, // 债券/基金风险等级
            fundRiskTypeLevel: this.$route.query.fundRiskType || 100,
            btnText: '',
            isShowPage: false,
            allowSubscribe: false,
            fundOverviewInfoVO: {},
            userInfo: {},
            fundCode: '',
            // number: 0, //剩余测评次数
            // showRemainingNum: false, //剩余次数弹窗
            // resetTime: '', //重置时间
            fundType: 0, //0基金1债券
            damagedStatus: 0, //是否为易受损用户
            fundHeaderInfoVO: {}
        }
    },
    methods: {
        // 将多个异步聚合为同步
        async handleSetupResult() {
            let pArr = [this.handleRiskAssessResult()]
            if (this.$route.query.direction) {
                pArr.push(this.handleGetBondDetail())
            } else {
                pArr.push(this.getFundDetailFun())
            }

            await Promise.all(pArr)
            if (this.userRiskLevel === 0) {
                // 尚未风评
                this.riskMatchResult = 1
                this.btnText = this.$t('startRisk')
            } else if (this.userRiskLevel < this.productRiskLevel) {
                console.log(this.productRiskLevel, 'productRiskLevel')
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
                let res = (await riskAssessResult()) || {}
                this.userRiskLevel = res.assessResult || 0 // 用户风险测评等级
                this.assessResultName = res.assessResultName
                // this.number = res.validCount
                // this.resetTime = res.resetTime
                this.damagedStatus = res.damagedStatus
                if (res.damagedStatus === 1) {
                    this.$router.replace({
                        path: '/risk-assessment-result',
                        query: {
                            id: this.$route.query.id,
                            fundRiskType: this.productRiskLevel
                        }
                    })
                }
                console.log(this.damagedStatus, 'this.damagedStatus')
            } catch (e) {
                if (e.msg) {
                    this.$alert(e.msg)
                }
                console.log('riskAssessResult:error:>>>', e)
            }
        },
        //去申购页面
        async toSubscribePage() {
            let riskTipContent = this.$t([
                `该产品为${this.fundHeaderInfoVO.fundRisk}（R${
                    this.fundHeaderInfoVO.fundRiskType
                }），超出您当前的风险承受能力${
                    this.$t('resultList')[this.userInfo.assessResult].riskStyle
                }（A${
                    this.userInfo.assessResult
                }）。点击继续操作视为您确认自愿承担该产品风险，且uSMART并未主动向您推荐该产品`,
                `該產品為${this.fundHeaderInfoVO.fundRisk}（R${
                    this.fundHeaderInfoVO.fundRiskType
                }），超出您當前的風險承受能力${
                    this.$t('resultList')[this.userInfo.assessResult].riskStyle
                }（A${
                    this.userInfo.assessResult
                }）。點擊繼續操作視為您確認自願承擔該產品風險，且uSMART並未主動向您推薦該產品`,
                `The risk level of this product is R${
                    this.fundHeaderInfoVO.fundRiskType
                }(${
                    this.fundHeaderInfoVO.fundRisk
                }), which exceeds your current risk tolerance is A${
                    this.userInfo.assessResult
                }(${
                    this.$t('resultList')[this.userInfo.assessResult].riskStyle
                }). Click Continue to operate as if you confirm that you voluntarily bear the risk of this product, and uSMART does not actively recommend this product to you.`
            ])
            try {
                await this.$confirm({
                    title: this.$t('riskTip'),
                    message: riskTipContent,
                    confirmButtonText: this.$t('continueButton'),
                    cancelButtonText: this.$t('cancelButton'),
                    confirmButtonColor: '#0D50D8',
                    cancelButtonColor: '#D1D1D1'
                })
                let data = {
                    query: {
                        id: this.$route.query.id,
                        currencyType: this.$route.query.currencyType,
                        assessResult:
                            this.userInfo && this.userInfo.assessResult,
                        fundCode: this.fundCode,
                        code: this.$route.query.code
                    }
                }
                if (this.$route.query.code == 4) {
                    data.path =
                        (this.userInfo.extendStatusBit & 16) > 0
                            ? '/fixed-investment'
                            : '/open-permissions?code=4'
                } else {
                    data.path =
                        (this.userInfo.extendStatusBit & 16) > 0
                            ? '/fund-subscribe'
                            : '/open-permissions'
                }
                console.log(data)

                this.$router.push(data)
            } catch (e) {
                console.log(e)
                return
            }
        },
        // 获取债券信息
        async handleGetBondDetail() {
            try {
                let { bondEditableInfo } = await getBondDetail(
                    this.$route.query.id - 0
                )
                this.fundType = 1
                this.productUrl =
                    bondEditableInfo && bondEditableInfo.productOverview // 产品资料url
                this.productRiskLevel =
                    (bondEditableInfo && bondEditableInfo.riskLevelType) || 100 // 债券风险等级
                console.log('getBondDetail:data:>>> ', bondEditableInfo)
            } catch (error) {
                console.log('getBondDetail:error:>>> ', error)
            }
        },
        // 获取基金信息
        async getFundDetailFun() {
            let res = await getFundDetail({
                displayLocation: this.$route.query.displayLocation || 1,
                fundId: this.$route.query.id
            })
            this.fundType = 0
            this.fundOverviewInfoVO = res.fundOverviewInfoVO
            this.fundHeaderInfoVO = res.fundHeaderInfoVO
            this.fundRiskTypeLevel = `${res.fundHeaderInfoVO.fundRisk}(R${res.fundHeaderInfoVO.fundRiskType})`
            this.productRiskLevel = `${res.fundHeaderInfoVO.fundRiskType}`
        },
        // 操作按钮
        async handleAction() {
            if (this.isDisabled) return
            if (this.userRiskLevel === 0) {
                // 尚未风评，跳转到风险测评
                this.$router.push({
                    path: '/risk-assessment',
                    query: {
                        id: this.$route.query.id,
                        direction: this.$route.query.direction,
                        fundRiskType: this.$route.query.fundRiskType,
                        displayLocation: this.$route.query.displayLocation
                    }
                })
            } else if (this.userRiskLevel < 5) {
                // 风险等级不够 弹出剩余次数提示
                // this.showRemainingNum = true
                try {
                    let { monthTimes, yearTimes } = await checkRiskAssessTimes()
                    // let monthTimes = 1,
                    //     yearTimes = 1
                    if (yearTimes <= 0) {
                        this.$confirm({
                            className: 'remaining-container',
                            message: `
                            <div class="title center">${this.$t(
                                'leastNum'
                            )} 0 ${this.$t('times')}</div>
                            <div class="years-info">${this.$t(
                                'yearsInfoToCall'
                            )}</div>
                            `,
                            closeOnClickOverlay: true,
                            confirmButtonText: this.$t('toCall'),
                            cancelButtonText: this.$t('toClose')
                        }).then(() => {
                            // 拨打客服电话
                            jsBridge.gotoCustomerService()
                        })
                    } else {
                        if (monthTimes <= 0) {
                            this.$confirm({
                                className: 'remaining-container',
                                message: `
                            <div class="years-info">${this.$t(
                                'leftTimes',
                                monthTimes,
                                yearTimes
                            )}${this.$t('retryNextMonth')}</div>
                            `,
                                showConfirmButton: false,
                                cancelButtonText: this.$t('iKnow'),
                                cancelButtonColor: '#0D50D8',
                                closeOnClickOverlay: true
                            })
                        } else {
                            this.$confirm({
                                className: 'remaining-container',
                                message: `
                            <div class="title">${this.$t(
                                'leftTimes',
                                monthTimes,
                                yearTimes
                            )}</div>
                            <div class="text">${this.$t('timesLimit')}</div>
                            `,
                                confirmButtonText: this.$t('startRisk'),
                                cancelButtonText: this.$t('toCancel'),
                                closeOnClickOverlay: true
                            }).then(() => {
                                // 开始测评
                                // 跳转到风险测评
                                this.$router.push({
                                    path: '/risk-assessment',
                                    query: {
                                        ...this.$route.query,
                                        notFirstSubmit: true
                                    }
                                })
                            })
                        }
                    }
                    // this.showRemainingNum = true
                } catch (e) {
                    console.log(e)
                    e.msg && this.$toast(e.msg)
                }
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
                    if (this.$route.query.code == 4) {
                        data.path =
                            (this.userInfo.extendStatusBit & 16) > 0
                                ? '/fixed-investment'
                                : '/open-permissions?code=4'
                    } else {
                        data.path =
                            (this.userInfo.extendStatusBit & 16) > 0
                                ? '/fund-subscribe'
                                : '/open-permissions'
                    }
                    // data.path =
                    //     (this.userInfo.extendStatusBit & 16) > 0
                    //         ? '/fund-subscribe'
                    //         : '/open-permissions'
                    this.$router.push(data)
                }
            }
        },
        //获取用户信息
        async getFundUserInfo() {
            try {
                const res = await getFundUserInfo()
                this.userInfo = res || {}
            } catch (e) {
                this.$toast(e.msg)
                console.log('getFundUserInfo:error:>>>', e)
            }
        }
        // 开始测评或拨打客服电话
        // startRiskHandle(number) {
        //     if (number === 0) {
        //         jsBridge.gotoCustomerService()
        //     } else {
        //         // 跳转到风险测评
        //         this.$router.push({
        //             path: '/risk-assessment',
        //             query: {
        //                 id: this.$route.query.id,
        //                 fundRiskType: this.$route.query.fundRiskType
        //             }
        //         })
        //     }
        // },
        // 关闭
        // callOrCancel() {
        //     this.showRemainingNum = false
        // }
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
