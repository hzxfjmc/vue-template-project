<template lang="pug">
    .fund-company-detail
        .fund-company
            .block__header
                .log
                    img(:src="companyInfo.logUrl")
                .name {{companyInfo.longName}}
            .block__content
                .desc(:class="{all: !showMore}") PImco太平洋投资管理有限公司由被称为业界称作债券之王的比尔·格罗斯（Bill Gross）创建。PIMCO公司主要业务包括洋投资管理有限公司由洋投资管理有洋投资管理有限公司限管理有限公司限
                .btn(@click="showMore=!showMore") {{showMore ? '展开' : '收起'}}
        .bond-index-wrapper
            .yx-scroll-container(
                :class="{bottom: isPhoneX}"
            )
                .scroll-header.border-bottom(:class="{'small-font': isEn}")
                    .scroll-header__fixed {{$t('A111')}}
                    .scroll-header__scroll(ref="headerScroll")
                        ul.scroll-header__scroll--content
                            li.scroll-header__scroll--item(
                                v-for="value,key in headerList"
                                :class="[isEn && !fundEarningsField.includes(key) ? 'en' : '']"
                            ) 
                                .item--text(@click="handlerSort(key)") {{value}}
                                    .item--sort
                                        SortIcon(
                                            :key="key"
                                            :value="sortMap[key]"
                                        )
                .scroll-main
                    .scroll-main-box(v-show="filterList && filterList.length > 0")
                        .scroll-main__fiexed 
                            .scroll-main__fiexed--item.border-bottom(
                                v-for="itemObj in filterList"
                                @click="goNext(itemObj.fundId, itemObj.fundName || itemObj.title)"
                            ) 
                                .fund-name.ellipse
                                    span.ellipse {{itemObj.fundName}}
                                .label
                                    fund-tag-type(:title="itemObj.fundRisk" :type="itemObj.fundRiskType")
                                    fund-tag-type(:title="$t(itemObj.currency.name)" v-if="$t(itemObj.currency.name)")
                        .scroll-main__scroll(ref="mainScroll" )
                            ul.scroll-main__scroll--content
                                li.scroll-main__row.border-bottom(
                                    v-for="item in filterList"
                                    @click="goNext(item.fundId, item.fundName || item.title)"
                                )
                                    template(v-for="key in fundEarningsField")
                                        .scroll-main__row--item(
                                            :class="[stockColorType === 1 ? 'number-red' : 'number-green']"
                                            v-if="item[key]>0"
                                        ) {{item[key] | formatNum}}%
                                        .scroll-main__row--item(
                                            :class="[stockColorType === 1 ? 'number-green' : 'number-red']"
                                            v-else-if="item[key]<0"
                                        ) {{item[key] | formatNum}}%
                                        .scroll-main__row--item(
                                            v-else
                                        ) {{item[key] || '--'}}
                                    .scroll-main__row--item.center(
                                        :class="{en:isEn}"
                                    ) {{item.morningRating || '--'}}
                                    template(v-for="key in fundAnalysisfield")
                                        .scroll-main__row--item(
                                            :class="[stockColorType === 1 ? 'number-red' : 'number-green', isEn?'en':'']"
                                            v-if="item[key]>0"
                                        ) +{{Number(item[key]).toFixed(2)}}{{key!='sharpeRatio3Yr'?'%':''}}
                                        .scroll-main__row--item(
                                            :class="[stockColorType === 1 ? 'number-green' : 'number-red', isEn?'en':'']"
                                            v-else-if="item[key]<0"
                                        ) {{Number(item[key]).toFixed(2)}}{{key!='sharpeRatio3Yr'?'%':''}}
                                        .scroll-main__row--item(
                                            :class="{en:isEn}"
                                            v-else
                                        ) {{item[key] || '--'}}
                .no-bond-box(v-if="load")
                    .no-bond {{ $t('noFund') }}
</template>
<script>
import { getFundListV2 } from '@/service/finance-info-server.js'
import { jumpUrl, debounce } from '@/utils/tools.js'
import { mapGetters } from 'vuex'
import SortIcon from './components/sort-icon.vue'
import fundTagType from '@/biz-components/fund-tag-type/index.vue'
import BScroll from 'better-scroll'
import { getStockColorType } from '@/utils/html-utils.js'
export default {
    i18n: {
        zhCHS: {
            noFund: '暂无基金'
        },
        zhCHT: {
            noFund: '暫無基金'
        },
        en: {
            noFund: 'No Data'
        }
    },
    filters: {
        formatNum(val) {
            return Number(val * 100).toFixed(2)
        }
    },
    computed: {
        ...mapGetters(['appType', 'lang', 'isLogin']),
        stockColorType() {
            return +getStockColorType()
        },
        isPhoneX() {
            return (
                /iphone/gi.test(window.navigator.userAgent) &&
                window.screen.height >= 812
            )
        },
        isEn() {
            return this.lang === 'en'
        },
        fundEarningsField() {
            return Object.keys(this.headerList).slice(0, 4)
        },
        fundAnalysisfield() {
            return Object.keys(this.headerList).slice(5)
        }
    },
    components: {
        SortIcon,
        'fund-tag-type': fundTagType
    },
    created() {
        this.getFundListV2()
    },
    data() {
        return {
            companyInfo: {},
            showMore: true,
            headerList: {
                threeYear: this.$t(['近三年', '近三年', '3Y']),
                twoYear: this.$t(['近两年', '近两年', '2Y']),
                oneYear: this.$t(['近一年', '近一年', '1Y']),
                toYear: this.$t(['今年来', '今年来', 'YTD']),
                morningRating: this.$t([
                    '晨星评级',
                    '晨星評級',
                    'MorningStar Rating'
                ]),
                sharpeRatio3Yr: this.$t([
                    '夏普比率',
                    '夏普比率',
                    'Sharpe Ratio'
                ]),
                maxDrawDown3Yr: this.$t([
                    '最大回撤',
                    '最大交易回落',
                    'Max Drawdown'
                ]),
                captureRatioUpside3Yr: this.$t([
                    '上行捕获比',
                    '上漲獲利比率',
                    'Upside Capture Ratio'
                ]),
                captureRatioDownside3Yr: this.$t([
                    '下行捕获比',
                    '下跌防禦比率',
                    'Downside Capture Ratio'
                ])
            },
            sortMap: {
                threeYear: 1,
                twoYear: 0,
                oneYear: 0,
                toYear: 0,
                morningRating: 0,
                sharpeRatio3Yr: 0,
                maxDrawDown3Yr: 0,
                captureRatioUpside3Yr: 0,
                captureRatioDownside3Yr: 0
            },
            load: false,
            list: [],
            filterList: [],
            pageNum: 1,
            pageSize: 1000,
            total: 0
        }
    },
    mounted() {
        this.$nextTick(() => {
            let headerScroll = new BScroll(this.$refs.headerScroll, {
                scrollX: true,
                // tap: 'tap',
                // bounce: false,
                // momentum: false,
                // useTransition: false,
                eventPassthrough: 'vertical',
                probeType: 3
            })
            let mainScroll = new BScroll(this.$refs.mainScroll, {
                scrollX: true,
                // tap: 'tap',
                // momentum: false,
                // bounce: false,
                // useTransition: false,
                eventPassthrough: 'vertical',
                probeType: 3
            })
            mainScroll.on('beforeScrollStart', () => {
                this.flag = 'main'
            })
            headerScroll.on('beforeScrollStart', () => {
                this.flag = 'header'
            })
            mainScroll.on('scroll', pos => {
                this.flag === 'main' && headerScroll.scrollTo(pos.x, 0)
            })
            headerScroll.on('scroll', pos => {
                this.flag === 'header' && mainScroll.scrollTo(pos.x, 0)
            })
        })
        this.getFundListV2()
    },
    methods: {
        handlerSort(key) {
            if (this.sortMap[key] === 0) {
                for (let obj in this.sortMap) {
                    if (obj == key) {
                        this.sortMap[obj] = 1
                    } else {
                        this.sortMap[obj] = 0
                    }
                }
                this.filterList.sort((a, b) => {
                    return b[key] - a[key]
                })
            } else if (this.sortMap[key] === 1) {
                for (let obj in this.sortMap) {
                    if (obj == key) {
                        this.sortMap[obj] = 2
                    } else {
                        this.sortMap[obj] = 0
                    }
                }
                this.filterList.sort((a, b) => {
                    return a[key] - b[key]
                })
            } else {
                this.resetSortMap()
                this.filterList.sort((a, b) => {
                    return b.threeYear - a.threeYear
                })
            }
        },
        resetSortMap() {
            this.sortMap = {
                threeYear: 1,
                twoYear: 0,
                oneYear: 0,
                toYear: 0,
                morningRating: 0,
                sharpeRatio3Yr: 0,
                maxDrawDown3Yr: 0,
                captureRatioUpside3Yr: 0,
                captureRatioDownside3Yr: 0
            }
        },
        // 获取基金列表
        async getFundListV2() {
            try {
                this.list = []
                const { list } = await getFundListV2({
                    displayLocation: 1,
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    assetType: this.assetType
                })
                this.list = list
                this.list.sort((a, b) => {
                    return b.threeYear - a.threeYear
                })
                this.filterList = this.list
                this.load = this.list.length == 0
            } catch (e) {
                this.$toast(e.msg)
                console.log('getListFundInfo:error:>>>', e)
            }
        },
        goNext(fundId, name) {
            let url = `${
                window.location.origin
            }/wealth/fund/index.html#/fund-details?id=${fundId}&name=${encodeURIComponent(
                name
            )}`
            debounce(jumpUrl(3, url), 300)
        }
    }
}
</script>
<style lang="scss" scoped>
$fixed-width: 179px;
$item-width: 105px;
$max-item-width: 150px;
$row-height: 60px;
$global-padding: 30px;
.bond-index-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    .no-data {
        padding: 10px 0 7px;
        color: $text-color3;
        font-size: 0.24rem;
        line-height: 17px;
        text-align: center;
    }
    .no-bond-box {
        padding-top: 150px;
        .no-bond {
            width: 130px;
            height: 120px;
            margin: 0 auto;
            padding-top: 100px;
            background: url('~@/assets/img/bond/icon-nobond.png') center 15px
                no-repeat;
            background-size: 110px;
            color: $text-color3;
            font-size: 0.28rem;
            line-height: 20px;
            text-align: center;
            box-sizing: border-box;
        }
    }
}

.yx-scroll-container {
    position: relative;
    top: 220px;
    display: flex;
    flex: 1;
    flex-direction: column;
    &.bottom {
        margin-bottom: 20px;
    }
    .scroll-header {
        position: fixed;
        background: #fff;
        width: 100%;
        display: flex;
        overflow: hidden;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        line-height: 20px;
        font-size: 14px;
        z-index: 999;
        &.small-font {
            font-size: 12px;
        }
        &__fixed {
            display: flex;
            align-items: center;
            padding-left: 12px;
            z-index: 1000;
            width: $fixed-width;
            color: $text-color5;
        }
        &__scroll {
            overflow: hidden;
            flex: 1;
            .scroll-header__scroll--content {
                padding-left: 10px;
                display: inline-block;
                vertical-align: top;
                text-align: center;
                white-space: nowrap;
                .scroll-header__scroll--item {
                    width: $item-width;
                    text-align: right;
                    padding-right: $global-padding;
                    display: inline-block;
                    &.en {
                        width: $max-item-width;
                    }
                    .item--text {
                        display: flex;
                        color: $text-color5;
                        justify-content: flex-end;
                        align-items: center;
                    }
                }
            }
        }
    }
    .scroll-main {
        margin-top: 40px;
        overflow: hidden;
        flex: 1;
        overflow: scroll;
        -webkit-overflow-scrolling: touch;
        background: #fff;
        .scroll-main-box {
            display: flex;
            flex: 1;
            font-size: 16px;
            .scroll-main__fiexed {
                display: inline-block;
                .scroll-main__fiexed--item {
                    width: $fixed-width;
                    height: $row-height;
                    padding-left: 12px;
                    display: flex;
                    justify-content: center;
                    flex-direction: column;
                    .fund-name {
                        align-items: center;
                        justify-content: flex-start;
                        line-height: 22px;
                    }
                    .label {
                        display: flex;
                    }
                }
            }
            .scroll-main__scroll {
                flex: 1;
                overflow: hidden;
                width: 100%;
                font-weight: 600;
                .scroll-main__scroll--content {
                    display: inline-block;
                    .scroll-main__row {
                        height: $row-height;
                        white-space: nowrap;
                        display: block;
                        &--item {
                            width: $item-width;
                            text-align: right;
                            line-height: 60px;
                            display: inline-block;
                            padding-right: $global-padding;
                            &.center {
                                text-align: center;
                            }
                            &.en {
                                width: $max-item-width;
                            }
                        }
                    }
                }
            }
        }
    }
}
.fund-company {
    position: fixed;
    z-index: 1000;
    .block__header {
        width: 100%;
        height: 147px;
        background: url('~@/assets/img/fund/fund_company_bg.png');
        background-size: 100% 100%;
        background-repeat: no-repeat;
    }
    .block__content {
        position: relative;
        display: flex;
        top: -35px;
        width: 100%;
        padding: 20px 14px;
        background: linear-gradient(180deg, #f3f3f3 0%, #ffffff 100%);
        border-radius: 10px 10px 0px 0px;
        .desc {
            width: 93%;
            line-height: 24px;
            text-align: justify;
            white-space: pre-line;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            overflow: hidden;
            &.all {
                display: flex;
            }
        }
        .btn {
            display: flex;
            color: #2177ff;
            font-size: 12px;
            align-items: flex-end;
        }
    }
}
.number-red {
    color: #ea3d3d;
}

.number-green {
    color: #04ba60;
}
</style>
