<template lang="pug">
.fund-account-container
    fundAccountHeader(
        @toRouterPath = "toRouterPath"
        @changeEyeTab = "changeEyeTab"
        @handlerCurrency="handlerCurrency"
        :code ="code"
        :investmentWhiteBit="investmentWhiteBit"
        :inTransitOrder="inTransitOrder"
        :holdData="holdData")
    .fund--list--wrapper
        fundList(
            slot="fundList"
            bgColor="#0091FF"
            :investmentWhiteBit="investmentWhiteBit"
            currency="2"
            :title = "$t('fundHkdType')"
            v-if="!noMoreShow"
            :code = "code"
            :eyeTab="eyeTab"       
            :amount="hkdPositionAmount"
            :fundList="hkPositionList")
        fundList(
            slot="fundList"
            bgColor="#FFBA00"
            :investmentWhiteBit="investmentWhiteBit"
            currency="1"
            :title = "$t('fundUsdType')"
            v-if="!noMoreShow"
            :code = "code"
            :eyeTab="eyeTab"    
            :amount="usdPositionAmount"
            :fundList="usPositionList")
    .block-element-nomore(v-if="noMoreShow")
        img.img(src="@/assets/img/fund/empty.png") 
        .no-record-box {{$t('nomore')}}

</template>
<script>
import fundAccountHeader from './components/fund-account-header'
import fundList from './components/fund-list'
import { getFundPositionListV3 } from '@/service/finance-server'
import { transNumToThousandMark } from '@/utils/tools.js'
import LS from '@/utils/local-storage'
import { gotoNewWebView } from '@/utils/js-bridge.js'
import { getFundUserInfo } from '@/service/user-server.js'
import { enumCurrency } from '@/pages/fund/index/map'
import { getSource } from '@/service/customer-relationship-server'
export default {
    data() {
        return {
            holdData: {},
            fundList: [],
            usdPositionAmount: '',
            hkdPositionAmount: '',
            currency: 2,
            noMoreShow: false,
            code: 0,
            hkPositionList: [],
            usPositionList: [],
            userInfo: {},
            investmentWhiteBit: false,
            inTransitOrder: '',
            eyeTab: LS.get('showMoney')
        }
    },
    i18n: {
        zhCHS: {
            fundHkdType: '港币基金',
            fundUsdType: '美元基金',
            nomore: '暂无持仓'
        },
        zhCHT: {
            fundHkdType: '港幣基金',
            fundUsdType: '美元基金',
            nomore: '暫無持倉'
        },
        en: {
            fundHkdType: 'HKD Fund',
            fundUsdType: 'USD Fund',
            nomore: 'No Holdings'
        }
    },
    components: {
        fundAccountHeader,
        fundList
    },
    methods: {
        //获取用户信息
        async getFundUserInfo() {
            try {
                const res = await getFundUserInfo()
                this.userInfo = res
                //白名单

                let investmentUserBit = this.userInfo.grayStatusBit
                    .toString(2)
                    .split('')
                    .reverse()
                    .join('')[9]

                if (investmentUserBit === '1') {
                    this.investmentWhiteBit = true
                }
            } catch (e) {
                this.$toast(e.msg)
                console.log('getFundUserInfo:error:>>>', e)
            }
        },
        toRouterPath(path) {
            let url = `${window.location.origin}/wealth/fund/index.html#${path}?currency=${this.currency}`
            gotoNewWebView(url)
        },
        changeEyeTab(data) {
            this.eyeTab = data
        },
        //切换货币
        handlerCurrency(currency) {
            this.currency = currency
            this.getFundPositionListV3()
        },
        async getFundPositionListV3() {
            const {
                hkPositionList,
                hkSummary,
                usPositionList,
                usSummary,
                hkdPositionAmount,
                usdPositionAmount,
                inTransitOrder
            } = await getFundPositionListV3()
            this.hkPositionList = hkPositionList
            this.usPositionList = usPositionList
            this.inTransitOrder = inTransitOrder || '0'
            this.holdData = {
                hkSummary: hkSummary,
                usSummary: usSummary
            }
            this.usdPositionAmount = transNumToThousandMark(usdPositionAmount)
            this.hkdPositionAmount = transNumToThousandMark(hkdPositionAmount)
            console.log(this.hkPositionList)
        },
        //获取用户归属 1大陆 2香港
        async getSource() {
            try {
                const { code } = await getSource()
                this.code = code
            } catch (e) {
                this.$toast(e.msg)
            }
        }
    },
    created() {
        this.currency =
            LS.get('activeTab') === 0 ? enumCurrency.HKD : enumCurrency.USD
        this.getFundPositionListV3()
        this.getSource()
        this.getFundUserInfo()
    }
}
</script>
<style lang="scss" scoped>
.fund-account-container {
    width: 100%;
    height: 284px;
    background: linear-gradient(
        360deg,
        rgba(47, 121, 255, 0) 0%,
        rgba(69, 152, 253, 1) 28%,
        rgba(36, 108, 239, 1) 100%
    );
}
.block-element-nomore {
    width: 100%;
    text-align: center;
    margin: 100px 0 0 0;
    img {
        width: 130px;
    }
    .no-record-box {
        color: rgba(25, 25, 25, 0.5);
        margin: 10px 0 0 0;
    }
}
</style>
