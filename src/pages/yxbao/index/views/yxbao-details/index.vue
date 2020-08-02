<template lang="pug">
.fund-details
    .fund-content(slot="main" ref="content")
        yxbaoDetailsHeader(
            :price="price"
            :revenue="revenue"
            :tagShow="tagShow"
            :tagsShow="tagsShow"
            :fundHeaderInfoVO="fundHeaderInfoVO")
        
        yxbaoDetailsEchart(
          @chooseTime = "getFundApyPointV1"
          :step="step"
          :timeList="timeList"
          :tabObj="tabObj"
          :historyList="historyList"
          :fundHeaderInfoVO="fundHeaderInfoVO"
          :initEchartList="initEchartList")
        .block__fundheader--tips(
            v-if="isLogin && openedAccount"
            @click="jumpPage('order-list',1)")
            em.iconfont.icon-iconEBshoucang
            span.title {{$t('cashFlow')}}
            .block__list--right
                em.iconfont.icon-iconEBgengduoCopy
        .block__fundheader--tips(
            v-if="isLogin && openedAccount"
            @click="jumpPage('income-details'), 1")
            em.iconfont.icon-icon-money
            span.title {{$t('returnDetails')}}
            .block__list--right
                em.iconfont.icon-iconEBgengduoCopy
        yxbaoSurvey(:fundOverviewInfoVO="fundOverviewInfoVO")
        yxbaoTradingRules(:fundTradeInfoVO="fundTradeInfoVO")
        .block__fundheader--tips(@click="toRouterGenerator('/generator')")
            em.iconfont.icon-iconEBshoucang2
            span.title {{$t('risk')}}
            .block__list--right
                em.iconfont.icon-iconEBgengduoCopy

        .block__tips--msg
            p {{$t('msg')}}
            p.more {{$t('msg1')}}
    .fund-footer-content
        .block__button(v-if="!Number(availableBaoBalance)")
            van-button.btn-color-r(
                @click="jumpPageIntoOut('fund-subscribe',1)"
                :text="$t('C9')"
                ) {{$t('C9')}}
        .block__button(v-else)
            van-button.btn-color-l(
                :text="$t('C8')"
                @click="jumpPageIntoOut('transfer-out',1)"
            )
            van-button.btn-color-r(
                @click="jumpPageIntoOut('fund-subscribe',1)"
                :text="$t('C9')"
            )
            
</template>
<script>
import yxbaoDetailsHeader from './components/yxbao-details-header'
import yxbaoDetailsEchart from './components/yxbao-details-echart'
import yxbaoSurvey from './components/yxbao-survey'
import yxbaoTradingRules from './components/yxbao-trading-rules'
import yxbaoCardList from './components/yxbao-card-list'
import dayjs from 'dayjs'
import {
    getFundDetail,
    getFundPerformanceHistory,
    getFundApyPointV1,
    getFundNetPriceHistoryV1
} from '@/service/finance-info-server.js'
import { getBaoPostionV2 } from '@/service/finance-server.js'
import { getSource } from '@/service/customer-relationship-server'
import { transNumToThousandMark, jumpUrl } from '@/utils/tools.js'
import { Button, Dialog } from 'vant'
import jsBridge from '@/utils/js-bridge'
import { browseFundDetails, clickFundDetails } from '@/utils/burying-point'
import { mapGetters } from 'vuex'
import { debounce } from '@/utils/tools.js'
import { getStockColorType } from '@/utils/html-utils.js'
export default {
    i18n: {
        zhCHS: {
            format: 'DD天 HH:mm:ss',
            aloneScribe: '独自申购',
            togetherScribe: '[同行申购]',
            Surplus: '剩余',
            describe: '还差5人,申购费最高可返50%',
            buy: '申购',
            buyHk: '申购',
            redeem: '赎回',
            risk: '风险提示',
            append: '追加',
            trade: '交易记录',
            login: '请登录后进行操作 ',
            loginBtn: '立即登录',
            openAccountBtn: '立即开户',
            openAccount: '您尚未开户，开户成功即可交易',
            timeTranslation: {
                oneWeek: '近一周',
                oneMonth: '近一月',
                threeMonth: '近三月',
                sixMonth: '近六月',
                oneYear: '近一年',
                twoYear: '近两年',
                threeYear: '近三年',
                fiveYear: '近五年',
                all: '成立来'
            },
            msg:
                '*本页面资料来源于基金管理公司、基金服务提供供应商。所有数据截至最新净值日期（除特殊标注外）,友信对基金的业绩表现计算是按该时期的资产净值、相关类别货币计算。如有未显示年度/时期的表现，则指该年度/时期未有足够资料计算。',
            msg1:
                '相关数据仅供参考，本页面非任何法律文件，投资前请阅读基金合同，招募说明书。基金过往业绩不预示未来表现，不构成投资建议，市场有风险,投资需谨慎。',
            describe3: '拼团成功，团队规模3人，尊享70%申购费返还',
            Subscribenow: '立即认购',
            riskTip: '风险提示',
            continueButton: '继续操作',
            cancelButton: '取消',
            cashFlow: '资金流水',
            returnDetails: '收益明细',
            resultList: {
                1: {
                    registration: 'A1',
                    riskStyle: '保守型',
                    suitPro: '低风险产品'
                },
                2: {
                    registration: 'A2',
                    riskStyle: '稳健型',
                    suitPro: '中低风险产品'
                },
                3: {
                    registration: 'A3',
                    riskStyle: '均衡型',
                    suitPro: '中风险产品'
                },
                4: {
                    registration: 'A4',
                    riskStyle: '增长型',
                    suitPro: '中高风险产品'
                },
                5: {
                    registration: 'A5',
                    riskStyle: '进取型',
                    suitPro: '高风险产品'
                }
            }
        },
        zhCHT: {
            format: 'DD天 HH:mm:ss',
            aloneScribe: '獨自認購',
            togetherScribe: '「同行」認購',
            Surplus: '剩餘',
            describe: '還差5人，最高可享申購費50%折扣',
            buy: '申購',
            buyHk: '認購',
            redeem: '贖回',
            risk: '風險提示',
            append: '續投',
            trade: '交易記錄',
            login: '請登入後進行操作 ',
            loginBtn: '立即登入',
            openAccountBtn: '立即開戶',
            openAccount: '您尚未開戶，開戶成功即可交易',
            timeTranslation: {
                oneWeek: '近一周',
                oneMonth: '近一月',
                threeMonth: '近三月',
                sixMonth: '近六月',
                oneYear: '近一年',
                twoYear: '近两年',
                threeYear: '近三年',
                fiveYear: '近五年',
                all: '成立来'
            },
            msg:
                '*本頁面資料來源於基金管理公司、基金服務提供供應商。所有數據截至最新淨值日期（除特殊標註外）,友信對基金的業績表現計算是按該時期的資產淨值、相關類別貨幣計算。如有未顯示年度/時期的表現，則指該年度/時期未有足夠資料計算。',
            msg1:
                '相關數據僅供參考，本頁面非任何法律文件，投資前請閱讀基金合同，招募說明書。基金過往業績不預示未來表現，不構成投資建議，市場有風險,投資需謹慎。',
            describe3: '3人「同行」成功，尊享70%申購費折扣',
            Subscribenow: '立即認購',
            riskTip: '風險提示',
            continueButton: '繼續操作',
            cancelButton: '取消',
            cashFlow: '資金流水',
            returnDetails: '收益明細',
            resultList: {
                1: {
                    registration: 'A1',
                    riskStyle: '保守型',
                    suitPro: '低風險產品'
                },
                2: {
                    registration: 'A2',
                    riskStyle: '穩健型',
                    suitPro: '中低風險產品'
                },
                3: {
                    registration: 'A3',
                    riskStyle: '均衡型',
                    suitPro: '中風險產品'
                },
                4: {
                    registration: 'A4',
                    riskStyle: '增長型',
                    suitPro: '中高風險產品'
                },
                5: {
                    registration: 'A5',
                    riskStyle: '進取型',
                    suitPro: '高風險產品'
                }
            }
        },
        en: {
            format: 'DDD HH:mm:ss',
            aloneScribe: 'Subscribe',
            togetherScribe: 'Susb. with Group',
            Surplus: '',
            describe:
                'X people needed to get the 50% discounton subscription fee.',
            buy: 'Subscribe',
            buyHk: 'Subscribe',
            redeem: 'Redemption',
            risk: 'Risk Disclosure',
            trade: 'Transaction Records',
            append: 'Incremental',
            login: 'Please login in',
            loginBtn: 'Login',
            openAccountBtn: 'Open account',
            openAccount: 'Please open your account to continue the trade',
            timeTranslation: {
                oneWeek: 'Last 1-Week',
                oneMonth: 'Last 1-Month',
                threeMonth: 'Last 3-Month',
                sixMonth: 'Last 6-Month',
                oneYear: 'Last 1-Year',
                twoYear: 'Last 2-Year',
                threeYear: 'Last 3-Year',
                fiveYear: 'Last 5-Year',
                all: 'Since Inception'
            },
            msg:
                "* The information on this page comes from fund management companies and fund service providers. All data are up to the date of the latest net worth (unless otherwise specified). uSMART calculates the fund's performance on a NAV-to-NAV basis in the relevant share class currency. Whenever there is no past performance shown, no sufficient data available in that year to calculate performance.",
            msg1:
                'The relevant data is for reference only. This page is not a legal document. Please carefully read the fund’s prospectus before investing. Past performance is not an indicator of future performance. All investments involve risk. Investors should consider all available information before making any investment decisions.',
            describe3:
                'You entitled Group Discount, you will get Y% discount on subscription fee.',
            Subscribenow: 'Subscribe now',
            riskTip: 'Risk Tip',
            continueButton: 'Continue',
            cancelButton: 'Cancel',
            cashFlow: 'Cash Flow',
            returnDetails: 'Return Details',
            resultList: {
                1: {
                    registration: 'A1',
                    riskStyle: 'Conservative',
                    suitPro: 'Low Risk Products'
                },
                2: {
                    registration: 'A2',
                    riskStyle: 'Stable',
                    suitPro: 'Low - Medium Risk Products'
                },
                3: {
                    registration: 'A3',
                    riskStyle: 'Balanced',
                    suitPro: 'Medium Risk Products'
                },
                4: {
                    registration: 'A4',
                    riskStyle: 'Growth',
                    suitPro: 'Medium - High Risk Products'
                },
                5: {
                    registration: 'A5',
                    riskStyle: 'Aggressive',
                    suitPro: 'High Risk Products'
                }
            }
        }
    },
    keepalive: true,
    components: {
        yxbaoDetailsHeader,
        yxbaoDetailsEchart,
        Button,
        Dialog,
        yxbaoSurvey,
        yxbaoCardList,
        yxbaoTradingRules
    },
    computed: {
        stockColorType() {
            return +getStockColorType()
        },
        ...mapGetters(['isLogin', 'appType', 'openedAccount', 'lang'])
    },
    data() {
        return {
            code: null,
            tagsShow: false,
            tagShow: false,
            tabObj: {
                label: '',
                value: ''
            },
            fundHeaderInfoVO: {
                apy: 0.0,
                netPrice: 0.0
            },
            id: '',
            fundOverviewInfoVO: {},
            recommendList: [], //推荐基金
            fundCorrelationFileList: [],
            historyList: [],
            fundTradeInfoVO: {},
            initEchartList: [],
            copyinitEchartList: [],
            holdInitState: {
                yesterdayEarnings: null,
                positionShare: null,
                positionMarketValue: null,
                positionEarnings: null,
                inTransitAmount: null
            },
            fundCode: '',
            fundRiskType: '',
            price: '',
            revenue: '',
            step: 0,
            forbidPrompt: '',
            availableBaoBalance: '',
            timeList: {
                oneWeek: {
                    label: '近一周',
                    value: '·'
                },
                oneMonth: {
                    label: '近一個月',
                    value: '·'
                },
                threeMonth: {
                    label: '近三個月',
                    value: '·'
                },
                sixMonth: {
                    label: '近六個',
                    value: '·'
                },
                oneYear: {
                    label: '近一年',
                    value: '·'
                }
            },
            timeLists: {
                oneWeek: {
                    label: '近一周',
                    value: ''
                },
                oneMonth: {
                    label: '近一個月',
                    value: ''
                },
                threeMonth: {
                    label: '近三個月',
                    value: ''
                },
                sixMonth: {
                    label: '近六個',
                    value: ''
                },
                oneYear: {
                    label: '近一年',
                    value: ''
                },
                twoYear: {
                    label: '近两年',
                    value: ''
                },
                threeYear: {
                    label: '近三年',
                    value: ''
                },
                fiveYear: {
                    label: '近五年',
                    value: ''
                },
                all: {
                    label: '成立来',
                    value: ''
                }
            }
        }
    },
    methods: {
        sliceDeci(s, l) {
            let deci = s.split('.')[1].slice(0, l)
            return s.split('.')[0] + '.' + deci
        },
        //获取基金净值历史
        async getFundNetPriceHistoryV1() {
            try {
                const { list } = await getFundNetPriceHistoryV1({
                    fundId: this.id,
                    pageNum: 1,
                    pageSize: 6
                })
                list.forEach((item, index) => {
                    item.belongDay = dayjs(item.belongDay).format('YYYY-MM-DD')
                    item.netPrice = this.sliceDeci(item.netPrice, 4)
                    if (index === list.length - 1) {
                        list[list.length - 1].price = '0.00' // 最后一项涨跌幅无法则算为0
                        list[list.length - 1].revenue = '0.00' // 最后一项涨跌幅无法则算为0
                    } else {
                        if (Number(list[index + 1].netPrice) !== 0) {
                            item.price =
                                ((list[index].netPrice -
                                    list[index + 1].netPrice) /
                                    list[index + 1].netPrice) *
                                100
                            item.price =
                                this.fundHeaderInfoVO.assetType != 4
                                    ? Number(item.price).toFixed(2)
                                    : Number(item.price).toFixed(4)
                            item.revenue = Number(
                                Number(item.price).toFixed(4) * 100
                            ).toFixed(2)
                        } else {
                            item.price = '0.00'
                        }
                    }
                })
                this.price = list[0].price
                this.revenue = list[0].revenue
                this.historyList = list.slice(0, 5)
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        toRouterGenerator(data) {
            let url
            if (data === '/generator') {
                url = `${window.location.origin}/webapp/market/generator.html?key=${this.fundHeaderInfoVO.fundCode}`
            } else {
                url = `${window.location.origin}/wealth/fund/index.html#${data}?id=${this.id}&currencyType=${this.fundTradeInfoVO.currency.type}`
            }
            jumpUrl(3, url)
        },
        async jumpPageIntoOut(path, type) {
            // 未登录或未开户
            if (!this.isLogin) {
                await this.$dialog.alert({
                    message: this.$t('login'),
                    confirmButtonText: this.$t('loginBtn'),
                    closeOnClickOverlay: true
                })
                jsBridge.gotoNativeModule('yxzq_goto://user_login')
                return
            }
            if (!this.openedAccount) {
                // 跳转到开户页面
                await this.$dialog.alert({
                    message: this.$t('openAccount'),
                    confirmButtonText: this.$t('openAccountBtn'),
                    closeOnClickOverlay: true
                })
                jsBridge.gotoNativeModule('yxzq_goto://main_trade')
                return
            }
            jumpUrl(
                type,
                `${window.location.origin}/wealth/yxbao/index.html#/${path}?id=${this.$route.query.id}`
            )
        },
        // 跳转到现金+ 资金流水 收益明细
        jumpPage(path, type) {
            let url = `${window.location.origin}/wealth/yxbao/index.html#/${path}?id=${this.$route.query.id}`
            jumpUrl(type, url)
        },
        async getFundPerformanceHistory() {
            try {
                const res = await getFundPerformanceHistory({
                    fundId: this.id
                })
                for (let key in this.timeList) {
                    if (!res[key] && res[key] != 0) {
                        this.timeList[key].value = '--'
                    } else {
                        this.timeList[key].value = (res[key] * 100).toFixed(2)
                    }
                }
                for (let key in this.timeLists) {
                    this.timeLists[key].value = (res[key] * 100).toFixed(2)
                }
                this.tabObj.label = this.timeList['oneMonth'].label
                this.tabObj.value = this.timeList['oneMonth'].value
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        //获取基金详情
        async getFundDetail() {
            try {
                this.fundCorrelationFileList = []
                const res = await getFundDetail({
                    displayLocation: this.$route.query.displayLocation || 1,
                    fundId: this.$route.query.id || this.id,
                    isin: this.$route.query.isin
                })
                this.fundHeaderInfoVO = res.fundHeaderInfoVO
                this.id = res.fundHeaderInfoVO.fundId
                this.fundHeaderInfoVO.isin = res.fundOverviewInfoVO.isin
                this.fundHeaderInfoVO.derivativeType =
                    res.fundOverviewInfoVO.derivativeType
                this.fundCode = this.fundHeaderInfoVO.fundCode
                let flag = this.fundHeaderInfoVO.apy < 0
                this.fundHeaderInfoVO.apy =
                    this.fundHeaderInfoVO.assetType === 4
                        ? (
                              Math.floor(
                                  Math.abs(this.fundHeaderInfoVO.apy) * 1000000
                              ) / 10000
                          ).toFixed(4)
                        : (
                              Math.floor(
                                  Math.abs(this.fundHeaderInfoVO.apy) * 10000
                              ) / 100
                          ).toFixed(2)
                this.fundHeaderInfoVO.apy = flag
                    ? -this.fundHeaderInfoVO.apy
                    : this.fundHeaderInfoVO.apy
                this.fundHeaderInfoVO.netPrice = transNumToThousandMark(
                    this.fundHeaderInfoVO.netPrice,
                    4
                )
                this.forbidPrompt = res.fundOverviewInfoVO.forbidPrompt
                this.fundHeaderInfoVO.currencyType =
                    res.fundTradeInfoVO.currency.name
                this.fundHeaderInfoVO.initialInvestAmount = transNumToThousandMark(
                    this.fundHeaderInfoVO.initialInvestAmount
                )
                this.fundHeaderInfoVO.belongDay = dayjs(
                    this.fundHeaderInfoVO.belongDay
                ).format('YYYY-MM-DD')
                this.fundOverviewInfoVO = res.fundOverviewInfoVO
                this.fundCorrelationFileList = res.fundCorrelationFileList
                this.fundOverviewInfoVO.fundId = res.fundHeaderInfoVO.fundId
                this.fundTradeInfoVO = res.fundTradeInfoVO
                this.fundTradeInfoVO.fundId = res.fundHeaderInfoVO.fundId
                this.fundTradeInfoVO.assetType = res.fundHeaderInfoVO.assetType
                this.fundRiskType = res.fundOverviewInfoVO.fundRiskType
                this.fundOverviewInfoVO.currencyName = this.fundOverviewInfoVO.currency.name
                //合规信息
                this.tagShow = this.fundHeaderInfoVO.derivativeType !== 1
                this.tagsShow = this.fundHeaderInfoVO.derivativeType !== 3
                browseFundDetails(
                    'fund_detail',
                    res.fundHeaderInfoVO.fundId,
                    res.fundHeaderInfoVO.fundName
                )
            } catch (e) {
                this.$toast(e.msg)
                console.log('getFundDetail:error:>>>', e)
            }
        },
        //echart图的数据获取
        async getFundApyPointV1(time) {
            try {
                const res = await getFundApyPointV1({
                    fundId: this.id,
                    apyType: time || 1
                })
                this.copyinitEchartList = res
                this.initEchartList = res
                this.initEchartList.map(item => {
                    item.pointData = Number(item.pointData * 100)
                })
                let month = {
                    1: '1个月',
                    2: '3个月',
                    3: '6个月',
                    4: '1年'
                }

                let monthEmun = {
                    1: 'oneMonth',
                    2: 'threeMonth',
                    3: 'sixMonth',
                    4: 'oneYear',
                    5: 'threeYear',
                    9: 'all'
                }
                if (time) {
                    this.tabObj.label = this.timeLists[monthEmun[time]].label
                    this.tabObj.value = this.timeLists[monthEmun[time]].value
                }
                if (time <= 4) {
                    clickFundDetails(
                        'fund_detail',
                        month[time],
                        this.fundHeaderInfoVO.fundId,
                        this.fundHeaderInfoVO.fundName
                    )
                }
            } catch (e) {
                console.log('getFundApyPointV1:error:>>>', e)
            }
        },
        async appVisibleHandle(data) {
            let re = data
            if (typeof data === 'string') {
                re = JSON.parse(data)
            }
            if (re.data.status !== 'visible') {
                return
            }
            await this.$store.dispatch('initAction')
        },
        init18inState() {
            for (let key in this.timeList) {
                this.timeList[key].label = this.$t('timeTranslation')[key]
            }
            for (let key in this.timeLists) {
                this.timeLists[key].label = this.$t('timeTranslation')[key]
            }
        },

        //获取用户归属 1大陆 2香港
        async getSource() {
            try {
                const { code } = await getSource()
                this.code = code
                this.fundHeaderInfoVO.code = code
                this.fundTradeInfoVO.code = code
                this.holdInitState.code = code
                if (!this.isLogin) {
                    this.code = this.appType.Hk ? 2 : 1
                }
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        //获取现金+持仓
        async getBaoPostionV2() {
            if (!this.isLogin) return
            try {
                const { baoPositionList } = await getBaoPostionV2()
                baoPositionList.forEach(item => {
                    if (item.fundId == this.$route.query.id) {
                        this.availableBaoBalance = item.availableBaoBalance
                    }
                })
            } catch (e) {
                this.$toast(e.msg)
            }
        }
    },
    async created() {
        this.init18inState()
        await this.getFundDetail()
        this.getFundNetPriceHistoryV1()
        this.getFundPerformanceHistory()
        this.getFundApyPointV1()
        this.getBaoPostionV2()
        this.getSource()
        jsBridge.callAppNoPromise(
            'command_watch_activity_status',
            {},
            'appVisible',
            'appInvisible'
        )
        // 解决ios系统快速切换tab后，报网络开小差的情况
        window.appVisible = debounce(this.appVisibleHandle, 100)
    }
}
</script>
<style lang="scss" scoped>
.block__tips--msg {
    margin: 20px 12px 17px 12px;
    color: $text-color5;
    font-size: 12px;
    .more {
        margin: 10px 0 0 0;
    }
}
.fund___list--p {
    width: 90%;
    margin: 20px 5%;
    p {
        font-size: 12px;
        line-height: 17px;
        text-align: justify;
        color: #999999;
    }
}
.fund-footer-hk {
    .block__list--header-hk {
        background: rgba(0, 145, 255, 0.05);
        display: flex;
        flex-direction: row;
        padding: 6px 18px 0 18px;
        height: 62px;
        .block__footer-left {
            width: 60%;
            font-size: 13px;
            padding: 5px 0 0 0;
        }
        .block__footer-right {
            width: 100px;
            height: 30px;
            .van-button {
                width: 100% !important;
                border-radius: 4px !important;
                line-height: 30px;
                margin: 10px 0 0 40px;
                background: #1e93f3;
                font-size: 10px;
                color: #fff;
                height: 100% !important;
            }
        }
    }
    .block__buy-hk {
        width: 100%;
        line-height: 48px;
        .van-button {
            width: 100% !important;
            background: linear-gradient(
                153deg,
                rgba(14, 192, 241, 1) 0%,
                rgba(83, 90, 240, 1) 100%
            );
            font-size: 10px;
            color: #fff;
            height: 100% !important;
        }
        .btn {
            font-size: 16px;
            line-height: 48px;
        }
    }
    .block__fight--btn-hk {
        height: 65px;
        display: flex;
        flex-direction: row;
        background: linear-gradient(
            153deg,
            rgba(14, 192, 241, 1) 0%,
            rgba(83, 90, 240, 1) 100%
        );
        .block__fight--left {
            // width: 30%;
            img {
                width: 40px;
                height: 40px;
                border-radius: 40px;
                margin: 12px 30px 12px 12px;
                // border: 1px solid red;
            }
        }
        .block__fight--right {
            display: flex;
            width: 70%;
            flex-direction: column;
            color: #fff;
            align-items: item;
            .block__fight--top {
                width: 100%;
                display: flex;
                margin: 10px 0 0px 0;
                font-size: 14px;
                justify-content: center;
                flex-direction: row;
                text-align: center;
                .van-count-down {
                    color: #fff;
                    font-size: 16px !important;
                    margin: 0px 3px 0 3px;
                }
            }
            .block__fight--bottom {
                width: 100%;
                display: flex;
                justify-content: center;
                flex-direction: row;
                text-align: center;
            }
        }
    }
}
.block__fundheader--tips {
    display: flex;
    flex-direction: row;
    padding: 15px 10px;
    margin: 6px 0 0 0;
    background: #fff;
    line-height: 22px;
    height: 50px;
    .icon-icon-gaishu {
        font-size: 20px;
    }
    .title {
        font-size: 16px;
        margin: 0 0 0 10px;
    }
    .block__list--right {
        margin-right: auto;
        flex-grow: 1; //这三个元素只有它在有空余空间时可伸缩，也就是它占据了所有剩余空间
        display: flex; //将它设置为flex,就可以单独对他进行主轴右对齐
        justify-content: flex-end;
        text-align: right;
        span {
            font-size: 14px;
            color: #666666;
        }
        .iconfont {
            font-size: 15px;
            line-height: 25px;
        }
    }
    .iconfont {
        font-size: 20px;
    }
}
.fund-details {
    display: flex;
    flex-direction: column;
    background: #f3f3f3;
    height: 100%;
    -webkit-overflow-scrolling: touch;
    overflow: hidden;
    .fund-content {
        overflow: hidden;
        overflow-y: auto;
        flex-direction: column;
    }
    .button-width {
        width: 100%;
    }
    .button-width1 {
        width: 50%;
    }
    .fund-footer {
        background: $primary-color;
    }
    .fund-footer1 {
        background: #ea3d3d;
    }
    .fund-footer2 {
        background: #c7c7c7;
    }
    .btn {
        height: 50px;
        color: #fff;
        text-align: center;
        line-height: 50px;
        font-size: 0.32rem;
        border-radius: 0;
        border: none;
    }
    .block__fight--btn {
        width: 50%;
        height: 48px;
        // background: #ea3d3d;
        display: flex;
        flex-direction: column;
        span {
            line-height: 30px;
            font-size: 16px;
            font-weight: 500;
        }
        em {
            font-size: 12px;
            line-height: 10px;
            font-style: normal;
        }
    }
    .block__fight--btn1 {
        width: 100%;
        height: 48px;
        display: flex;
        background: #ea3d3d;
        flex-direction: column;
        span {
            line-height: 30px;
            font-size: 16px;
            font-weight: 500;
        }
        em {
            font-size: 12px;
            line-height: 10px;
            font-style: normal;
        }
    }
    .fund-check,
    .fund-buy {
        width: 50%;
    }
    .fund-check {
        background: $primary-color;
    }
    .fund-buy {
        background: rgb(255, 191, 50);
    }
    .fund-no {
        background: rgba(25, 25, 25, 0.2);
    }
    .button-5width {
        width: 50%;
    }
    .button-left {
        border-right: 1px solid #e1e1e1;
    }
    .van-button {
        border-radius: 0 !important;
    }
}
.fund-footer-content {
    width: 100%;
    .block__list--header {
        width: 100%;
        height: 60px;
        padding: 0 12px;
        background: #fef5f5;
        display: flex;
        flex-direction: row;
        align-items: center;
        .block__footer--content {
            width: 60%;
            line-height: 22px;
            display: flex;
            flex-direction: column;
            .block__footer--top,
            .block__footer--bottom {
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
            }

            .van-count-down {
                font-size: 16px;
                margin: 0 6px;
                font-family: yxFontDINPro-Medium;
                color: rgba(234, 61, 61, 1);
                border-radius: 5px;
                line-height: 24px;
            }
        }
        .block__footer-avat {
            margin: 0 10px 0 0;
            img {
                width: 40px;
                border-radius: 40px;
                height: 40px;
            }
        }
        .block__footer-right {
            width: 100px;
            height: 36px;
            .van-button {
                height: 36px !important;
                line-height: 28px;
                color: #fff;
                border-radius: 5px !important;
                background: #ea3d3d;
                width: 100%;
            }
        }
    }
}
.block__button {
    display: flex;
    flex-direction: row;
    .van-button {
        flex: 1;
        color: #fff;
        border: 0;
    }
    .btn-color-l {
        background: #0d50d8;
    }
    .btn-color-r {
        background: #ff744a;
    }
}
</style>
