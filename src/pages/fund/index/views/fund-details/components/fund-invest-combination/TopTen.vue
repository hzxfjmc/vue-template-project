<template lang="pug">
    .fund-colunm__content 
        .content__item  
                .content__item-title {{$t(['十大持仓','十大持倉','TOP 10 Holdings'])}} ({{allPercent}}%）    
                .content__item-sub-title(v-if="holdingsList.length")
                    .sub-title__item 
                        span {{$t(['名称','名稱','Name'])}}
                    .sub-title__item {{$t(['占比','佔比','Ratio'])}} 
                .content__item-percentage(:class="{'more':showMore}" v-if="holdingsList.length")
                    .percentage-item(v-for="item,index in holdingsList" :key="`${item.name}-${item.weighting}`")
                        .item-top
                            .item-top__label {{item.name}}    
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
export default {
    mixins: [mixin],
    components: {},
    props: {
        fundId: {
            type: [String, Number],
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
            allPercent: 0
        }
    },
    methods: {
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
                list.forEach((item, index) => {
                    if (index === 0) {
                        item.width = 100
                    } else {
                        item.width = Number(
                            (list[index].weighting / list[0].weighting) * 100
                        ).toFixed(2)
                    }
                    this.allPercent += +Number(item.weighting).toFixed(2)
                })
                this.allPercent = Number(this.allPercent).toFixed(2)
                this.holdingsList = list
            } catch (e) {
                this.$toast(e.msg)
            }
        }
    },
    created() {
        this.getFundTop10Holdings()
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
        .content__item-title {
            padding-top: 14px;
            text-align: left;
            font-size: 16px;
            font-weight: 400;
        }
        .content__item-sub-title {
            display: flex;
            padding: 10px 0 10px;
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
            padding-bottom: 20px;
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
</style>
