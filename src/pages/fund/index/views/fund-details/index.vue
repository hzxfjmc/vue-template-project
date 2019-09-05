<template lang="pug">
.fund-details
    .fund-content(slot="main")
        fundDetailsHeader(:fundHeaderInfoVO="fundHeaderInfoVO")
        
        fundDetailsEchart(
          @chooseTime = "getFundNetPrice"
          :initEchartList="initEchartList")

        HoldfundDetails(
            v-if="holdDetailsShow"
            :initState="holdInitState")

        fundDetailsList(
            :fundCorrelationFileList="fundCorrelationFileList"
            :fundTradeInfoVO = "fundTradeInfoVO"
            :positionStatus = "positionStatus"
            :fondCode = "fondCode"
            :fundOverviewInfoVO="fundOverviewInfoVO") 
    .fund-footer-content(v-if="btnShow")
        van-button(class="btn fund-check") {{$t('redeem')}}
        van-button(class="btn fund-buy") {{$t('append')}}

    .fund-footer-content(@click="handleBuyOrSell" v-if="btnShow1")
        van-button(class="fund-footer btn") {{$t('buy')}}
    
    
</template>
<script>
import fundDetailsHeader from './components/fund-details-header'
import fundDetailsEchart from './components/fund-details-echart'
import HoldfundDetails from './components/hold-fund-details'
import fundDetailsList from './components/fund-details-list'
import dayjs from 'dayjs'
import {
    getFundDetail,
    getFundNetPrice
} from '@/service/finance-info-server.js'
import { getCurrentUser } from '@/service/user-server.js'
import { transNumToThousandMark } from '@/utils/tools.js'
import { getFundPosition } from '@/service/finance-server.js'
import localStorage from '../../../../../utils/local-storage'
import { Button, Dialog } from 'vant'
import jsBridge from '@/utils/js-bridge'

export default {
    i18n: {
        zhCHS: {
            buy: '申购',
            redeem: '赎回',
            append: '追加'
        },
        zhCHT: {
            buy: '申購',
            redeem: '贖回',
            append: '追加'
        },
        en: {
            buy: '申购',
            redeem: '赎回',
            append: '追加'
        }
    },
    // keepalive: true,
    components: {
        fundDetailsHeader,
        fundDetailsEchart,
        HoldfundDetails,
        fundDetailsList,
        Button,
        Dialog
    },
    data() {
        return {
            fundHeaderInfoVO: {},
            fundOverviewInfoVO: {},
            fundCorrelationFileList: [],
            fundTradeInfoVO: {},
            initEchartList: [],
            holdInitState: {},
            positionStatus: {},
            holdDetailsShow: false,
            btnShow: false,
            btnShow1: true,
            fondCode: '',
            userInfo: null
        }
    },
    methods: {
        //跳申购页
        tofundSubscribe() {
            this.$router.push({
                path: '/fund-subscribe',
                query: this.fundHeaderInfoVO
            })
        },
        //获取基金详情
        async getFundDetail() {
            try {
                this.fundCorrelationFileList = []
                const res = await getFundDetail({
                    displayLocation: 1,
                    fundId: 1
                })
                this.fundHeaderInfoVO = res.fundHeaderInfoVO
                this.fondCode = this.fundHeaderInfoVO.fondCode
                this.fundHeaderInfoVO.apy = transNumToThousandMark(
                    this.fundHeaderInfoVO.apy
                )
                this.fundHeaderInfoVO.netPrice = transNumToThousandMark(
                    this.fundHeaderInfoVO.netPrice
                )
                this.fundHeaderInfoVO.initialInvestAmount = transNumToThousandMark(
                    this.fundHeaderInfoVO.initialInvestAmount
                )
                this.fundHeaderInfoVO.belongDay = dayjs(
                    this.fundHeaderInfoVO.belongDay
                ).format('YYYYMMDD')
                this.fundOverviewInfoVO = res.fundOverviewInfoVO
                this.fundCorrelationFileList = res.fundCorrelationFileList
                this.fundTradeInfoVO = res.fundTradeInfoVO
                this.positionStatus = res.positionStatus
                if (this.positionStatus.type != -1) {
                    this.holdDetailsShow = true
                    this.btnShow = true
                } else {
                    this.btnShow1 = true
                }
            } catch (e) {
                console.log('getFundDetail:error:>>>', e)
            }
        },
        //获取持仓数据
        async getFundPosition() {
            try {
                const res = await getFundPosition({
                    fundId: 1
                })
                this.holdInitState = res
            } catch (e) {
                console.log('getFundPosition:error:>>>', e)
            }
        },
        //echart图的数据获取
        async getFundNetPrice(time) {
            try {
                const res = await getFundNetPrice({
                    fundId: 1,
                    fundNetPriceDateType: time || 1
                })
                this.initEchartList = res
                this.initEchartList.map(item => {
                    item.belongDay = dayjs(item.belongDay).format('YYYY-MM-DD')
                })
            } catch (e) {
                console.log('getFundNetPrice:error:>>>', e)
            }
        },
        //获取用户信息
        async getCurrentUser() {
            try {
                const res = await getCurrentUser()
                this.userInfo = res
            } catch (e) {
                console.log('getCurrentUser:error:>>>', e)
            }
        },
        //用户是否能申购或者是否需要测评
        async handleBuyOrSell() {
            // 未登录或未开户
            if (!this.userInfo) {
                await this.$dialog.alert({
                    message: '用户信息丢失，请登陆'
                })
                jsBridge.gotoNativeModule('yxzq_goto://user_login')
                return
            }
            if (
                !this.userInfo.assessResult ||
                new Date().getTime() >
                    new Date(this.userInfo.validTime).getTime()
            ) {
                return this.$router.push({
                    path: '/risk-assessment',
                    query: {
                        extendStatusBit: this.extendStatusBit == 5
                    }
                })
            }
            if (!this.userInfo.openedAccount) {
                // 跳转到开户页面
                await this.$dialog.alert({
                    message: '未开户，请先去开户'
                })
                jsBridge.gotoNativeModule('yxzq_goto://main_trade')
                return
            }
        }
    },
    mounted() {
        this.getCurrentUser()
        localStorage.put(
            'userToken',
            'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzZXNzaW9uIjoiMWI0NWE1ZmQxNTIwNDhlYzgyN2Q3ZjJhZDBkOGQyNjUiLCJzb3VyY2UiOiJhcHAiLCJ1dWlkIjozNjQ0MDE0NDA3MDc2NjU5MjB9.JCRqIUb5DdsO0cTnohI-B9Cu20bqi7irY39lLHyvziA'
        )
        this.getFundNetPrice()
        this.getFundDetail()
        this.getFundPosition()
    }
}
</script>
<style lang="scss" scoped>
.fund-details {
    display: flex;
    flex-direction: column;
    height: 100%;
    -webkit-overflow-scrolling: touch;
    overflow: hidden;
    .fund-content {
        overflow: hidden;
        overflow-y: auto;
        flex: 1;
        height: 90%;
    }
    .fund-footer {
        width: 100%;
        background: $primary-color;
    }
    .btn {
        height: 50px;
        color: #fff;
        text-align: center;
        line-height: 50px;
        border-radius: 0;
        border: none;
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
    .van-button {
        border-radius: 0 !important;
    }
}
</style>
