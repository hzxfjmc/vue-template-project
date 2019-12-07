<template lang="pug">
.block-fund-index
    .block__swiper.block__fund_index_swiper
        van-swipe(:autoplay="3000") 
            van-swipe-item(v-for="(item, index) in barnnarHkList" :key="index") 
                img(:src="item.picture_url") 
    .block__assets
        .block__left
            .block__left--label 
                span 基金总资产
                em(
                    class="iconfont" 
                    @click="moneyShow=!moneyShow"
                    :class="[moneyShow?'icon-icon-eye':'icon-icon-eye-hide']")
            .block__right
                .block--hold(@click="toRouterAccount")  
                    span 基金持仓
                    em(class="iconfont icon-iconEBgengduoCopy")
        .block__left--number
            .block--element--number(v-if="moneyShow") {{positionAmount}}
            .block--element--number.close--eye(v-else) ******
            .block--element--select 
                span(@click="handlerCurrency") {{currency===0?'港币':'美元'}}
                em(class="iconfont icon-iconxiala" @click="handlerCurrency")
                em(class="iconfont icon-icon_fund_index_2")
                .block--master(v-if="chooseCurrencyShow")
                .block__currey(v-if="chooseCurrencyShow")
                    span.border-bottom(
                        @click="chooseCurrency(0)"
                        :class="[currency === 0 ? 'active' :'']") 港币
                    span(
                        @click="chooseCurrency(1)"
                        :class="[currency === 1 ? 'active' :'']") 美元
        
    .block__tab
        .block__tab--list
            .block__tab--Item(
                @click="handlerNavItem(item)"
                v-for="(item,index) in tabList" 
                :key="index") 
                img(:src="item.imgUrl") 
                span {{item.label}}
    .block__container
        FundList(
            v-if="choiceFundListShow"
            :fundlist="choiceFundList")
        .block-bannar-sub
            van-swipe(:autoplay="3000") 
                van-swipe-item(v-for="(item, index) in barnnarList" :key="index") 
                    img(:src="item.bannerUrl") 
            //- img(:src="require('@/assets/img/fund/img/1.png')")
        FundListItem(
            bgColor="#2B4F80"
            title="穩健精選"
            v-if="robustFundListShow"
            :fundlist="robustFundList")
        FundListItem(
            :fundlist="blueChipFundList"
            title="績優精選"
            v-if="blueChipFundListShow"
            bgColor="#F1B92D")

        .block-bannar-sub
            van-swipe(:autoplay="3000") 
                van-swipe-item(v-for="(item, index) in barnnarUsList" :key="index") 
                    img(:src="item.picture_url") 
    .fund-echart-render(ref="renderEchart")
</template>
<script>
import { Swipe, SwipeItem } from 'vant'
import FundList from './fund-list'
import FundListItem from './fund-list-item'
import { getFundHomepageInfo } from '@/service/finance-info-server'
import { getFundPositionListV3 } from '@/service/finance-server'
import { CURRENCY_NAME } from '@/pages/fund/index/map'
import { transNumToThousandMark } from '@/utils/tools.js'
import { bannerAdvertisement } from '@/service/news-configserver.js'
import { getStockColorType } from '@/utils/html-utils.js'
import dayjs from 'dayjs'
import F2 from '@antv/f2'
import { mapGetters } from 'vuex'
export default {
    components: {
        [Swipe.name]: Swipe,
        [SwipeItem.name]: SwipeItem,
        FundList,
        FundListItem
    },
    i18n: {
        zhCHS: {
            accountTotal: '基金总资产',
            fundHold: '基金持仓',
            hkd: '港币',
            usd: '美元',
            fundTitle: '穩健精選',
            fundTitle1: '績優精選',
            fundCurrency: '货币型',
            fundBond: '债券型',
            fundBlend: '混合型',
            fundShares: '股票型'
        },
        zhCHT: {
            accountTotal: '基金总资产',
            fundHold: '基金持仓',
            hkd: '港币',
            usd: '美元',
            fundTitle: '穩健精選',
            fundTitle1: '績優精選',
            fundCurrency: '货币型',
            fundBond: '债券型',
            fundBlend: '混合型',
            fundShares: '股票型'
        },
        en: {
            accountTotal: '基金总资产',
            fundHold: '基金持仓',
            hkd: '港币',
            usd: '美元',
            fundTitle: '穩健精選',
            fundTitle1: '績優精選',
            fundCurrency: '货币型',
            fundBond: '债券型',
            fundBlend: '混合型',
            fundShares: '股票型'
        }
    },
    computed: {
        stockColorType() {
            return +getStockColorType()
        },
        ...mapGetters(['appType'])
    },
    data() {
        return {
            currency: 0,
            moneyShow: true,
            barnnarList: [],
            barnnarUsList: [],
            barnnarHkList: [],
            chooseCurrencyShow: false,
            choiceFundListShow: false,
            blueChipFundListShow: false,
            robustFundListShow: false,
            tabList: [
                {
                    imgUrl: require('@/assets/img/fund/icon_money.png'),
                    label: '貨幣型',
                    value: '4'
                },
                {
                    imgUrl: require('@/assets/img/fund/icon_xunzhang.png'),
                    label: '債劵型',
                    value: '2'
                },
                {
                    imgUrl: require('@/assets/img/fund/icon_fenpei.png'),
                    label: '混合型',
                    value: '3'
                },
                {
                    imgUrl: require('@/assets/img/fund/icon_zhexian.png'),
                    label: '股票型',
                    value: '1'
                }
            ],
            choiceFundList: {}, //精选基金
            blueChipFundList: {}, //绩优基金
            robustFundList: {}, //稳健基金
            hkSummary: {},
            usSummary: {},
            positionAmount: 0,
            imgUrl:
                'http://pic11.nipic.com/20101204/6349502_104413074997_2.jpg',
            fundlist: [{}, {}]
        }
    },
    methods: {
        //跳转
        handlerNavItem(item) {
            this.$router.push({
                path: '/index',
                query: { type: item.value }
            })
        },
        toRouterAccount() {
            this.$router.push({
                path: '/fund-account'
            })
        },
        //获取轮播
        async bannerAdvertisement() {
            try {
                const res = await bannerAdvertisement(26)
                const res1 = await bannerAdvertisement(27)
                this.barnnarHkList = res.banner_list
                this.barnnarUsList = res1.banner_list
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        //获取持仓
        async getFundPositionListV3() {
            try {
                const { usSummary, hkSummary } = await getFundPositionListV3()
                this.hkSummary = hkSummary
                this.usSummary = usSummary
                this.positionAmount = transNumToThousandMark(
                    hkSummary.positionAmount,
                    2
                )
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        handlerCurrency() {
            this.chooseCurrencyShow = true
            document.body.style.overflow = 'hidden'
            document.addEventListener(
                'touchmove',
                e => {
                    e.preventDefault()
                },
                false
            ) //禁止页面滑动
        },
        chooseCurrency(data) {
            this.currency = data
            this.positionAmount =
                data === 0
                    ? transNumToThousandMark(this.hkSummary.positionAmount, 2)
                    : transNumToThousandMark(this.usSummary.positionAmount, 2)
            this.chooseCurrencyShow = false
            document.body.style.overflow = '' //出现滚动条
            document.removeEventListener(
                'touchmove',
                e => {
                    e.preventDefault()
                },
                false
            )
        },
        async getFundHomepageInfo() {
            try {
                const {
                    fundHomepageTwo,
                    fundHomepageThree,
                    fundHomepageOne,
                    fundHomepageFour
                } = await getFundHomepageInfo({
                    moduleBitmap: 15
                })
                this.barnnarList = fundHomepageTwo.data
                this.choiceFundList = fundHomepageOne
                this.blueChipFundList = fundHomepageFour
                this.robustFundList = fundHomepageThree
                this.factoryMap_('choiceFundList')
                this.factoryMap_('blueChipFundList')
                this.factoryMap_('robustFundList')
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        //工厂模式批量生成图片并插入数组中
        factoryMap_(type) {
            let arr_ = {
                choiceFundList: this.choiceFundList,
                blueChipFundList: this.blueChipFundList,
                robustFundList: this.robustFundList
            }
            arr_[type].data.map(item => {
                item.initialInvestAmount = Math.floor(item.initialInvestAmount)
                item.fundSize = Math.floor(item.fundSize)
                item.tradeCurrency = CURRENCY_NAME['zhCHS'][item.tradeCurrency]
                item.fundSizeCurrency =
                    CURRENCY_NAME['zhCHS'][item.fundSizeCurrency]
                let cavas = document.createElement('canvas')
                cavas.style.position = 'fixed'
                cavas.style.top = '0'
                cavas.style.opacity = 0
                cavas.id = `chartId${item.fundId}`
                this.$refs.renderEchart.appendChild(cavas)
                this.draw(
                    `chartId${item.fundId}`,
                    item.fundHomepagePointList,
                    res => {
                        item.imgUrl = res
                        if (type === 'choiceFundList') {
                            this.choiceFundList.data[0].iconUrl = require('@/assets/img/fund/icon_star1.png')
                            this.choiceFundList.data[1].iconUrl = require('@/assets/img/fund/icon_star.png')
                        }
                        setTimeout(() => {
                            this.choiceFundListShow = true
                            this.blueChipFundListShow = true
                            this.robustFundListShow = true
                        }, 200)
                    }
                )
            })
        },
        //创建echart图并生成图片回调出来
        draw(canvasId, data, callback) {
            const chart = new F2.Chart({
                id: canvasId,
                pixelRatio: window.devicePixelRatio
            })
            chart.source(data, {
                pointData: {
                    tickCount: 5,
                    min: 0,
                    formatter: function formatter(val) {
                        return Number(val).toFixed(2)
                    }
                },
                belongDay: {
                    type: 'timeCat',
                    range: [0, 1],
                    tickCount: 3,
                    formatter: function formatter(val) {
                        return dayjs(val).format('YYYY-MM-DD')
                    }
                }
            })
            chart.tooltip({
                custom: true,
                showXTip: true,
                showYTip: true,
                snap: true,
                crosshairsType: 'xy',
                crosshairsStyle: {
                    lineDash: [2]
                }
            })
            chart.axis(false)
            chart
                .line()
                .position('belongDay*pointData')
                .color(`${this.stockColorType === 1 ? '#ea3d3d' : '#04ba60'}`)

            chart.render()
            setTimeout(() => {
                let imgUrl = document
                    .getElementById(canvasId)
                    .toDataURL('image/png')
                callback(imgUrl)
            }, 500)
        }
    },
    mounted() {
        this.$refs.renderEchart.innerHTML = ''
        this.getFundHomepageInfo()
        this.bannerAdvertisement()
        this.getFundPositionListV3()
    }
}
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>
