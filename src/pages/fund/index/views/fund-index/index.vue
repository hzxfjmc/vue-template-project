<template lang="pug">
.block-fund-index
    .block__swiper.block__fund_index_swiper
        van-swipe(:autoplay="3000") 
            van-swipe-item(v-for="(item, index) in barnnarList" :key="index") 
                img(:src="item.bannerUrl") 
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
            .block__tab--Item(v-for="(item,index) in tabList" :key="index") 
                img(:src="item.imgUrl") 
                span {{item.label}}
    .block__container
        FundList(
            v-if="choiceFundListShow"
            :fundlist="choiceFundList")
        .block-bannar
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
import dayjs from 'dayjs'
import F2 from '@antv/f2'
export default {
    components: {
        [Swipe.name]: Swipe,
        [SwipeItem.name]: SwipeItem,
        FundList,
        FundListItem
    },
    data() {
        return {
            currency: 0,
            moneyShow: true,
            barnnarList: [],
            chooseCurrencyShow: false,
            choiceFundListShow: false,
            blueChipFundListShow: false,
            robustFundListShow: false,
            tabList: [
                {
                    imgUrl: require('@/assets/img/fund/icon_money.png'),
                    label: '貨幣型'
                },
                {
                    imgUrl: require('@/assets/img/fund/icon_xunzhang.png'),
                    label: '債劵型'
                },
                {
                    imgUrl: require('@/assets/img/fund/icon_fenpei.png'),
                    label: '混合型'
                },
                {
                    imgUrl: require('@/assets/img/fund/icon_zhexian.png'),
                    label: '股票型'
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
        toRouterAccount() {
            this.$router.push({
                path: '/fund-account'
            })
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
                this.barnnarList = fundHomepageTwo
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
            chart.line().position('belongDay*pointData')
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
        this.getFundPositionListV3()
    }
}
</script>
<style lang="scss" scoped>
.block__swiper {
    width: 100%;
    height: 200px;
    overflow: hidden;
    img {
        width: 100%;
    }
}
.block__assets {
    width: 90%;
    height: 96px;
    padding: 0 15px;
    position: relative;
    z-index: 99999;
    margin: -48px 5% 0 5%;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    .block__left {
        width: 100%;
        display: flex;
        flex-direction: row;
        height: 40px;
        .block__left--label {
            font-size: 14px;
            width: 60%;
            display: flex;
            margin: 10px 0 0 0;
            align-items: center;
            flex-direction: row;
            line-height: 20px;
            em {
                font-size: 20px;
                margin: 0px 0 0 5px;
            }
        }
        .block__right {
            text-align: right;
            width: 40%;
            height: 40px;
            margin: 15px 0 0 0;
            .block--hold {
                width: 90px;
                // height: 25px;
                border-radius: 15px;
                text-align: center;
                float: right;
                font-weight: 400;
                color: rgba(0, 145, 255, 1);
                line-height: 25px;
                margin: 0 0 10px 0;
                border: 1px solid rgba(0, 145, 255, 1);
                display: flex;
                align-items: center;
                justify-content: center;
                em {
                    font-size: 20px;
                }
            }
            .block--label--list {
                text-align: right;
                display: flex;
                font-size: 14px;
                line-height: 18px;
                width: 100%;
                flex-direction: column;
                span {
                    color: $text-color6;
                }
            }
        }
    }
    .block__left--number {
        display: flex;
        flex-direction: row;
        height: 40px;
        width: 100%;
        .block--element--number {
            font-size: 28px;
            line-height: 50px;
            font-weight: bold;
            font-family: yxFontDINPro-Bold;
            color: rgba(0, 145, 255, 1);
        }
        .close--eye {
            line-height: 60px;
        }
        .block--element--select {
            line-height: 52px;
            font-size: 14px;
            font-weight: 600;
            color: rgba(0, 145, 255, 1);
            margin: 0 0 0 5px;
            position: relative;
            .icon-iconxiala {
                margin: 0 0 0 5px;
                color: rgba(25, 25, 25, 0.65);
            }
            .icon-icon_fund_index_2 {
                color: rgba(25, 25, 25, 0.65);
                margin: 0 0 0 10px;
            }
            .block--master {
                position: fixed;
                width: 100%;
                top: 0;
                left: 0;
                z-index: 99999;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
            }
            .block__currey {
                width: 120px;
                position: absolute;
                height: 100px;
                z-index: 9999999;
                border-radius: 10px;
                left: 0px;
                top: 55px;
                background: #fff;
                display: flex;
                justify-content: center;
                flex-direction: column;
                span {
                    color: #000;
                    width: 100px;
                    height: 50px;
                    line-height: 50px;
                    display: block;
                    margin: 0 10px;
                }
                .active {
                    color: #0091ff;
                }
            }
            .block__currey:before {
                content: '';
                width: 0px;
                height: 0px;
                top: -10px;
                left: 20px;
                border-left: 10px solid transparent;
                border-right: 10px solid transparent;
                border-bottom: 10px solid #fff;
                position: absolute;
            }
        }
    }
}
.block__tab {
    width: 100%;
    margin: 20px 0 0 0;
    .block__tab--list {
        display: flex;
        flex-direction: row;
        .block__tab--Item {
            width: 25%;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            img {
                width: 40px;
                height: 40px;
            }
            span {
                color: $text-color6;
            }
        }
    }
}
.block__container {
    width: 100%;
    background: #fff;
    padding: 0 0 20px 0;
    .block-bannar {
        width: 90%;
        margin: 0 5%;
        img {
            width: 100%;
        }
    }
}
.canvas-list {
    opacity: 0;
    position: fixed;
    top: 0;
}
</style>
