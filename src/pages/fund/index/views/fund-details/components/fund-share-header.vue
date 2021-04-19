<template lang="pug">
    .fund__sahre__header(v-if="!closed" :class='lang')
        van-swipe(:autoplay="3000")
            van-swipe-item(v-for="item in fundList" :key="item.fundId")
                .block__left
                    canvas(
                        :id="'chartId'+item.fundId" 
                        :ref="item.fundId"
                    )
                .block__center
                    .title.eclipse {{item.fundName}}
                    .info 
                        span.number +{{Number(item.apy * 100).toFixed(2)}}%
                        span.tag {{$t(['近3年涨跌幅','近3年漲跌幅','Three Year'])}}
                .block__right
                    button(type="button" @click="handleOpenApp") {{$t(['APP查看', 'APP查看', 'View in APP'])}}
                    span.iconfont.icon-close(@click="closed=true")
</template>
<script>
import { getShareFundRecommend } from '@/service/finance-info-server'
import { Swipe, SwipeItem } from 'vant'
import { mapGetters } from 'vuex'
import dayjs from 'dayjs'
import F2 from '@antv/f2'
export default {
    name: 'fund-share-header',
    components: {
        [Swipe.name]: Swipe,
        [SwipeItem.name]: SwipeItem
    },
    data() {
        return {
            closed: false,
            fundList: []
        }
    },
    computed: {
        ...mapGetters(['lang'])
    },
    updated() {
        this.$nextTick(() => {
            this.fundList.forEach(item => {
                this.draw(`chartId${item.fundId}`, item.fundPointList, item.apy)
            })
        })
    },
    created() {
        this.geFundInfo()
    },
    methods: {
        async geFundInfo() {
            try {
                let data = await getShareFundRecommend()
                this.fundList = data
            } catch (e) {
                this.message.error(e.msg || '网络开小差了，请稍后再试')
            }
        },
        handleOpenApp() {
            this.$emit('openApp')
        },
        draw(canvasId, data, apy) {
            const chart = new F2.Chart({
                id: canvasId
            })
            data.map(item => {
                item.pointData = Number(item.pointData)
            })
            chart.source(data, {
                pointData: {
                    formatter: function formatter(val) {
                        return Number(val).toFixed(2)
                    }
                },
                belongDay: {
                    type: 'timeCat',
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
            let stockColor = Number(apy) >= 0 ? '#ea3d3d' : '#04ba60'
            chart
                .area()
                .position('belongDay*pointData')
                .color(`${stockColor}`)
                .shape('smooth')
            chart
                .line()
                .position('belongDay*pointData')
                .color(`${stockColor}`)
                .shape('smooth')
                .style({
                    lineWidth: 10
                })
            chart.render()
        }
    }
}
</script>
<style lang="scss">
.fund__sahre__header {
    .van-swipe-item {
        display: flex;
        padding: 23px 12px 26px 10px;
        margin-bottom: 6px;
        justify-content: space-between;
        align-items: center;
        background: #fff;
    }
    .block__left {
        width: 95px;
        display: flex;
        align-items: center;
        canvas {
            width: 1000px;
            zoom: 0.1;
        }
    }
    .block__center {
        .title {
            width: 150px;
            font-size: 16px;
            line-height: 22px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }
        .info {
            display: flex;
            flex-direction: row;
            .number {
                color: #ea3d3d;
                font-size: 20px;
                font-family: yxFontDINPro-Medium;
                line-height: 23px;
            }
            .tag {
                font-size: 10px;
                line-height: 25px;
                padding: 0 0 0 4px;
                color: $text-color5; // 次标题颜色
            }
        }
    }
    .block__right {
        button {
            height: 30px;
            font-size: 16px;
            outline: none;
            border: none;
            font-weight: 400;
            color: #fff;
            background: #ff7127;
            border-radius: 3px;
        }
        .iconfont {
            font-size: 10px;
            position: absolute;
            right: 6px;
            top: 6px;
        }
    }
    &.en {
        button {
            font-size: 10px;
        }
    }
}
</style>
