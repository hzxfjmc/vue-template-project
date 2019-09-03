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
            :fundOverviewInfoVO="fundOverviewInfoVO") 
    .fund-footer-content(v-if="btnShow")
        van-button(class="btn fund-check") {{$t('redeem')}}
        van-button(class="btn fund-buy") {{$t('append')}}

    .fund-footer-content(@click="tofundSubscribe" v-if="btnShow1")
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
import { transNumToThousandMark } from '@/utils/tools.js'
import { getFundPosition } from '@/service/finance-server.js'
import localStorage from '../../../../../utils/local-storage'
import { Button, Dialog } from 'vant'

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
            btnShow1: false
        }
    },
    methods: {
        tofundSubscribe() {
            this.$router.push({
                path: '/fund-subscribe',
                query: this.fundHeaderInfoVO
            })
        },
        async getFundDetail() {
            try {
                const res = await getFundDetail({
                    displayLocation: 1,
                    fundId: 1
                })
                this.fundHeaderInfoVO = res.fundHeaderInfoVO
                this.fundHeaderInfoVO.apy = transNumToThousandMark(
                    this.fundHeaderInfoVO.apy
                )
                this.fundHeaderInfoVO.netPrice = transNumToThousandMark(
                    this.fundHeaderInfoVO.netPrice
                )
                this.fundHeaderInfoVO.initialInvestAmount = Number(
                    this.fundHeaderInfoVO.initialInvestAmount
                ).toFixed(2)
                this.fundHeaderInfoVO.belongDay = dayjs(
                    this.fundHeaderInfoVO.belongDay
                ).format('YYYY-MM-DD')
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
                // Dialog.alert({
                //     title: '标题',
                //     message: '弹窗内容'
                // }).then(() => {
                //     // on close
                //     console.log(`关闭了`)
                // })
            } catch (e) {
                console.log('getFundDetail:error:>>>', e)
            }
        },
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
        }
    },
    mounted() {
        localStorage.put(
            'userToken',
            'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzZXNzaW9uIjoiMTk5ZGIwMzI2Mjc0NDE4ZDk4YmJjYTNmNjBkZWYxMTEiLCJzb3VyY2UiOiJhcHAiLCJ1dWlkIjozNTQ3MDQ1NjQxMTE2NTA4MTZ9.9wfTLuPWptnvId694okt7kIP54ZW33eGJtFGhequsO0'
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
