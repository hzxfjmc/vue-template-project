import { Checkbox, Button } from 'vant'
import { handleSelectProtocolInfo } from '@/pages/bond/index/tools'
import YxContainerBetter from '@/components/yx-container-better'
import { riskAssessResult } from '@/service/user-server.js'
import { getBondDetail } from '@/service/finance-info-server.js'
import { feePackageCurr } from '@/service/product-server.js'
import { i18nAppropriateData } from './risk-appropriate-result-i18n.js'
import { openBondFeePackage } from '@/service/finance-server'
import dayjs from 'dayjs'
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
    created() {
        // 等待预定请求完成后，执行下一步操作
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
                5: '进取型(A5)',
                '-1': '已过期'
            },
            isShowPage: false,
            userInfo: '',
            fundCode: '',
            number: 0, //剩余测评次数
            showRemainingNum: false, //剩余次数弹窗
            resetTime: '', //重置时间
            validTime: '', // 过期时间
            damagedStatus: 0 //是否为易受损用户
        }
    },
    computed: {
        ...mapGetters(['appType']),
        // 跳转路由前缀，为 hk 使用
        prev() {
            return this.appType.Hk ? '/hk' : ''
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
        // 底部按钮文案
        btnText() {
            if (this.userRiskLevel === 0 || this.userRiskLevel === '-1') {
                return this.$t('startRisk')
            } else if (this.userRiskLevel < this.bondRiskLevel) {
                return this.$t('againRisk')
            } else {
                return this.$t('sure')
            }
        }
    },
    methods: {
        // 将多个异步聚合为同步
        async handleSetupResult() {
            await Promise.all([
                this.handleGetBondDetail(),
                this.handleRiskAssessResult()
            ])
            if (this.userRiskLevel === 0 || this.userRiskLevel === '-1') {
                // 尚未风评 或者 已过期
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
                let res = (await riskAssessResult()) || {}
                this.userRiskLevel = res.assessResult || 0 // 用户风险测评等级
                this.assessResultName =
                    res.assessResultName || this.$t('riskTypeList')[0]
                this.number = res.validCount
                // this.number = 1
                this.resetTime = res.resetTime
                this.validTime =
                    res.validTime && res.validTime.replace(/-/g, '/') // ios 中短横线日期格式使用 Date 处理无效
                // this.validTime = '2010-1-5 12:00:00'.replace(/-/g, '/')
                this.damagedStatus = res.damagedStatus
                if (new Date().getTime() > new Date(this.validTime).getTime()) {
                    this.userRiskLevel = '-1'
                    this.assessResultName = this.$t('riskTypeList')['-1']
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
                // 获取 产品资料url
                if (bondEditableInfo && bondEditableInfo.productOverview) {
                    handleSelectProtocolInfo(
                        bondEditableInfo.productOverview,
                        res => {
                            this.productUrl = (res && res.protocolUrl) || ''
                        }
                    )
                }
                this.bondRiskLevel =
                    (bondEditableInfo && bondEditableInfo.riskLevelType) || 100 // 债券风险等级
                console.log('getBondDetail:data:>>> ', bondEditableInfo)
            } catch (error) {
                console.log('getBondDetail:error:>>> ', error)
            }
        },
        // 操作按钮
        async handleAction() {
            if (this.isDisabled) return
            this.$loading()
            try {
                if (this.userRiskLevel === 0) {
                    // 尚未风评，跳转到风险测评
                    this.$router.push({
                        path: this.prev + '/risk-assessment',
                        query: {
                            id: this.$route.query.id,
                            direction: this.$route.query.direction
                        }
                    })
                } else if (this.userRiskLevel < this.bondRiskLevel) {
                    // 风险等级不够 弹出剩余次数提示
                    this.showRemainingNum = true
                } else {
                    let direction =
                        (this.$route.query.direction &&
                            this.$route.query.direction) ||
                        1
                    let path =
                        direction == 2
                            ? '/transaction-sell'
                            : '/transaction-buy'

                    // 获取用户套餐
                    let feeData = await feePackageCurr({
                        stockBusinessType: 6,
                        userId: this.$store.state.user.userId - 0
                    })
                    console.log('feePackageCurr:data:>>> ', feeData)
                    // 当前为手机委托，过滤除手机委托外的其他套餐数据
                    feeData =
                        (feeData &&
                            feeData.filter(
                                feeItem => feeItem.entrustType === 2
                            )) ||
                        []
                    // 如果用户已经拥有套餐，直接跳转
                    if (feeData.length !== 0) {
                        this.$router.push({
                            path: `${this.prev}${path}`,
                            query: {
                                id: this.$route.query.id
                            }
                        })
                        return
                    }
                    // 没有开通套餐，静默开通用户债券费用套餐
                    let openData = await openBondFeePackage()
                    console.log('openBondFeePackage:data:>>> ', openData)

                    if (!openData) return

                    // 风评级别够了，可以购买，跳转到下单界面

                    this.$router.push({
                        path: `${this.prev}${path}`,
                        query: {
                            id: this.$route.query.id
                        }
                    })
                }
            } catch (e) {
                if (e.msg) {
                    await this.$toast(e.msg)
                }
                console.log('openBondFeePackage:error:>>> ', e)
            } finally {
                this.$close()
            }
        },
        // 开始测评或拨打客服电话
        startRiskHandle(number) {
            if (number === 0) {
                jsBridge.gotoCustomerService()
            } else {
                // 跳转到风险测评
                this.$router.push({
                    path: this.prev + '/risk-assessment',
                    query: {
                        id: this.$route.query.id,
                        direction: this.$route.query.direction
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
