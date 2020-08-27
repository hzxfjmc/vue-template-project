<template lang="pug">
    .fund-colunm__content(:class="className") 
        .content__item  
                .content__item-title
                    .title {{$t(['十大持仓','十大持倉','TOP 10 Holdings'])}} ({{allPercent}}%)   
                .content__item-sub-title
                    .sub-title__item {{$t(['更新时间','更新時間','As of'])}} ：{{updateTime}}
                .content__item-sub-title(v-if="holdingsList.length")
                    .sub-title__item 
                        span {{$t(['名称','名稱','Name'])}}
                    .sub-title__item {{$t(['占比','佔比','Ratio'])}} 
                .content__item-percentage(:style="{'height':`${showMore?height*holdingsList.length:height*(holdingsList.length < 5 ? holdingsList.length:5)}px`}" v-if="holdingsList.length")
                    .percentage-item(v-for="item,index in holdingsList" :key="`${item.name}-${item.weighting}`" ref="percentage-item")
                        .item-top
                            .item-top__label(@click="handleGoStockDetail(item)") {{item.name}} {{item.ticker}}    
                            .item-top__value {{Number(item.weighting).toFixed(2)}}%   
                        .item-line(
                            :class="index<3?`bg-${index}`:'bg-3'" 
                            :style="{width:`${item.width}%`}")
                .content__item-btn(@click="handleShowMore" v-if="holdingsList.length && holdingsList.length>5")
                    span.label {{showMore ? $t(['收起','收起','Less']):$t(['展开更多','展開更多','More'])}}
                    span.iconfont.icon-iconxiala(:class="{'more':showMore}")  
                yx-no-list(v-if="!holdingsList.length")                       
</template>
<script>
/**
 * @description 基金详情页投资组合
 * @author Aaron Lam
 * @date 2020/07/30
 */
import { mapGetters } from 'vuex'
import { getFundTop10HoldingsV1 } from '@/service/finance-info-server.js'
import mixin from './mixin'
import { sliceDecimal } from '@/utils/tools'
import { jsBridge } from 'yx-base-h5'

export default {
    mixins: [mixin],
    components: {},
    props: {
        fundId: {
            type: [String, Number],
            default: ''
        },
        className: {
            type: String,
            default: ''
        }
    },
    computed: {
        ...mapGetters(['stockColorTypeClass', 'lang'])
    },
    data() {
        return {
            showMore: false,
            holdingsList: [],
            investmentData: {},
            allPercent: 0,
            height: '',
            updateTime: ''
        }
    },
    methods: {
        handleGoStockDetail(item) {
            if (!item.quotes) {
                this.$toast(
                    this.$t(['暂无行情数据', '暫無行情數據', 'No Market Data']),
                    'center'
                )
            } else {
                jsBridge.gotoNativeModule(
                    `yxzq_goto://stock_quote?market=${item.market}&code=${item.ticker}`
                )
            }
        },
        handleShowMore() {
            this.showMore = !this.showMore
        },
        handleGoDetail() {
            let queryString = ''
            ;['fundId', 'fundName', 'isin'].forEach(key => {
                queryString += `${key}=${encodeURIComponent(
                    this.fundHeaderInfoVO[key]
                )}&`
            })
            let url = `${
                window.location.origin
            }/wealth/fund/index.html#/fund-invest-combination?${queryString.slice(
                0,
                -1
            )}`
            if (this.$jsBridge.isYouxinApp) {
                this.$jsBridge.gotoNewWebview(url)
            } else {
                location.href = url
            }
        },
        async getFundTop10Holdings() {
            try {
                const params = {
                    fundId: this.fundId
                }
                const list = (await getFundTop10HoldingsV1(params)) || []
                let filterList = list.filter(item => item.weighting)
                filterList.forEach((item, index) => {
                    if (index === 0) {
                        item.width = 100
                    } else {
                        item.width = sliceDecimal(
                            (filterList[index].weighting /
                                filterList[0].weighting) *
                                100,
                            2
                        )
                    }
                    this.allPercent += +Number(item.weighting).toFixed(2)
                })
                this.allPercent = sliceDecimal(this.allPercent, 2)
                this.holdingsList = filterList
                this.updateTime = this.holdingsList.length
                    ? this.holdingsList[0].portfolioDate
                    : ''
            } catch (e) {
                this.$toast(e.msg)
            }
        }
    },
    async created() {
        await this.getFundTop10Holdings()
        this.$nextTick(() => {
            this.height = this.$refs['percentage-item']
                ? this.$refs['percentage-item'][0].clientHeight
                : 40
        })
    }
}
</script>
<style lang="scss" scoped>
.yx-no-list {
    padding-bottom: 10px;
}
.fund-colunm {
    margin-top: 6px;
    padding: 0 10px;
    background-color: $background-color;
}

.fund-colunm__content {
    .content__item {
        padding-top: 14px;
        .content__item-title {
            text-align: left;
            font-size: 16px;
            font-weight: 400;
            position: relative;
            &::before {
                content: ' ';
                position: absolute;
                width: 4px;
                left: -11px;
                height: 100%;
                background-color: $primary-color;
            }
        }
        .content__item-sub-title {
            display: flex;
            padding: 5px 0 0;
            justify-content: space-between;
            color: #666;
            font-size: 12px;
        }
        .content__item-percentage {
            height: 200px;
            overflow: hidden;
            padding-bottom: 10px;
            transition: all 0.3s ease-out;
            &.more {
                height: 400px;
            }
        }
        .content__item-btn {
            display: flex;
            padding: 20px 0;
            justify-content: center;
            align-items: center;
            font-size: 12px;
            color: #666;
            .label {
                padding-right: 6px;
            }
            .iconfont {
                transition: all 0.3s ease-out;
            }
            .icon-iconxiala.more {
                transform: rotate(180deg);
            }
        }
        .percentage-item {
            padding: 5px 0;
            .item-top {
                display: flex;
                justify-content: space-between;
                font-size: 12px;
            }
            .item-top__label {
                width: 85%;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
            .item-top__value {
                font-size: 14px;
                font-weight: 500;
            }
            .item-line {
                width: 50%;
                height: 9px;
                transition: all 0.3s ease-out;
                &.bg-0 {
                    background-color: #1d41a5;
                }
                &.bg-1 {
                    background-color: #0d50d8;
                }
                &.bg-2 {
                    background-color: #2f79ff;
                }
                &.bg-3 {
                    background-color: #249cff;
                }
            }
        }
    }
}
.fund-index {
    .content__item {
        .content__item-title {
            text-align: left;
            font-size: 16px;
            font-weight: 400;
            position: relative;
            &::before {
                content: ' ';
                position: absolute;
                width: 4px;
                left: -12px;
                height: 100%;
                background-color: $primary-color;
            }
        }
    }
}
</style>
