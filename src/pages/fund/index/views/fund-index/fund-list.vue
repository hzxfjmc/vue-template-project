<template lang="pug">
    .block__fund
        .block__fund-title 精选基金
        .block__fund--list(v-for="(item,index) in fundlist" :key="index")
                img(class="element--left--img" :src="item.imgUrl")
                .element--fund--content
                    span.title 聚焦優質企業
                    .element--content-sub-content
                        .number +180.22%
                        .tag 近一年
                    .element--content-bottom
                        span 债券型
                        span 1000港幣起購 
                        span 20億美元
                .element--right
                    img(:src="imgUrl")
</template>
<script>
import F2 from '@antv/f2'
export default {
    data() {
        return {
            fundlist: [
                { imgUrl: require('@/assets/img/fund/icon_star1.png') },
                { imgUrl: require('@/assets/img/fund/icon_star.png') }
            ],
            imgUrl: 'http://pic11.nipic.com/20101204/6349502_104413074997_2.jpg'
        }
    },
    methods: {
        draw() {
            const data = [
                {
                    date: '2017-06-05',
                    value: 116
                },
                {
                    date: '2017-06-06',
                    value: 129
                },
                {
                    date: '2017-06-07',
                    value: 135
                },
                {
                    date: '2017-06-08',
                    value: 86
                },
                {
                    date: '2017-06-09',
                    value: 73
                },
                {
                    date: '2017-06-10',
                    value: 85
                },
                {
                    date: '2017-06-11',
                    value: 73
                },
                {
                    date: '2017-06-12',
                    value: 68
                },
                {
                    date: '2017-06-13',
                    value: 92
                },
                {
                    date: '2017-06-14',
                    value: 130
                },
                {
                    date: '2017-06-15',
                    value: 245
                },
                {
                    date: '2017-06-16',
                    value: 139
                },
                {
                    date: '2017-06-17',
                    value: 115
                },
                {
                    date: '2017-06-18',
                    value: 111
                },
                {
                    date: '2017-06-19',
                    value: 309
                },
                {
                    date: '2017-06-20',
                    value: 206
                },
                {
                    date: '2017-06-21',
                    value: 137
                },
                {
                    date: '2017-06-22',
                    value: 128
                },
                {
                    date: '2017-06-23',
                    value: 85
                },
                {
                    date: '2017-06-24',
                    value: 94
                },
                {
                    date: '2017-06-25',
                    value: 71
                },
                {
                    date: '2017-06-26',
                    value: 106
                },
                {
                    date: '2017-06-27',
                    value: 84
                },
                {
                    date: '2017-06-28',
                    value: 93
                },
                {
                    date: '2017-06-29',
                    value: 85
                },
                {
                    date: '2017-06-30',
                    value: 73
                },
                {
                    date: '2017-07-01',
                    value: 83
                },
                {
                    date: '2017-07-02',
                    value: 125
                },
                {
                    date: '2017-07-03',
                    value: 107
                },
                {
                    date: '2017-07-04',
                    value: 82
                },
                {
                    date: '2017-07-05',
                    value: 44
                },
                {
                    date: '2017-07-06',
                    value: 72
                }
            ]
            console.log(data)
            const chart = new F2.Chart({
                id: 'chartId',
                pixelRatio: window.devicePixelRatio
            })

            chart.source(data, {
                value: {
                    tickCount: 5,
                    min: 0
                },
                date: {
                    type: 'timeCat',
                    range: [0, 1],
                    tickCount: 3
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
            chart.line().position('date*value')
            chart.render()
            setTimeout(() => {
                this.imgUrl = document
                    .getElementById('chartId')
                    .toDataURL('image/png')
            }, 300)
        }
    },
    mounted() {
        this.draw()
    }
}
</script>
<style lang="scss" scoped>
.block__fund {
    width: 100%;
    margin: 20px 0 0 0;
    padding: 10px 5%;
    background: #fff;
    .block__fund-title {
        font-size: 20px;
    }
    .block__fund--list {
        width: 100%;
        height: 70px;
        display: flex;
        margin: 20px 0 0 0;
        flex-direction: row;
        .element--left--img {
            width: 20px;
            height: 20px;
            margin: 4px 0 0 0;
        }
        .element--fund--content {
            display: flex;
            flex-direction: column;
            width: 90%;
            padding: 0 0 0 10px;
            .title {
                font-size: 16px;
            }
            .element--content-sub-content {
                display: flex;
                flex-direction: row;
                .number {
                    font-size: 18px;
                    color: rgba(0, 197, 141, 1);
                    line-height: 23px;
                }
                .tag {
                    font-size: 10px;
                    line-height: 25px;
                    padding: 0 0 0 10px;
                    color: $text-color5; // 次标题颜色
                }
            }
            .element--content-bottom {
                span {
                    padding: 0 3px 0 3px;
                    font-size: 10px;
                    color: $text-color6;
                    border-right: 1px solid #e1e1e1;
                }
                span:first-child {
                    padding: 0 3px 0 0;
                }
                span:last-child {
                    border: none;
                }
            }
        }
        .element--right {
            width: 80px;
            height: 70px;
            img {
                width: 100%;
                height: 100%;
            }
        }
    }
}
</style>
