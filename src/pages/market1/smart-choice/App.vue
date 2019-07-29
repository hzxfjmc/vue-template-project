<template lang="pug">
    #app
        img.banner(src="./images/banner-hk.jpg" v-if="isLangZhHk")
        img.banner(src="./images/banner-en.jpg" v-else-if="isLangEn")
        img.banner(src="./images/banner-cn.jpg" v-else)
        .why
            .why__question {{ $t('why') }}
            .why__answer {{ $t('whyAnswer1') }}
            .why__answer {{ $t('whyAnswer2') }}
        .benefit
            .benefit-item
                img.benefit-item__img(src="./images/icon-01.png")
                p.benefit-item__title {{ $t('benefitTitle1') }}
                p.benefit-item__description {{ $t('benefitDes1') }}
            .benefit-item
                img.benefit-item__img(src="./images/icon-02.png")
                p.benefit-item__title {{ $t('benefitTitle2') }}
                p.benefit-item__description {{ $t('benefitDes2') }}
            .benefit-item
                img.benefit-item__img(src="./images/icon-03.png")
                p.benefit-item__title {{ $t('benefitTitle3') }}
                p.benefit-item__description {{ $t('benefitDes3') }}
        .func
            .section-title
                span {{ $t('funcIntro') }}
            .func-wrap
                .func-wrap__title {{ $t('shortKing') }}
                .func-wrap__description
                    span 1
                    | {{ $t('funcDes1') }}
                .func-wrap__description
                    span 2
                    | {{ $t('funcDes2') }}
                .func-wrap__description
                    span 3
                    | {{ $t('funcDes3') }}
                .func-wrap__case {{ $t('case') }}
                .func-stock
                    .func-stock__name {{ $t('caseStock1') }}
                        span 01629
                    .func-stock__subline
                        | {{ $t('recommendDate') }}
                        span 04-11
                        br(v-if="isLangEn")
                        | {{ $t('suggestStop') }}
                        span.up 7.35
                    .fucn-stock__chart(ref="shortChart")
            .func-wrap
                .func-wrap__title {{ $t('sele') }}
                .func-wrap__description
                    span 1
                    | {{ $t('seleDes1') }}
                .func-wrap__description
                    span 2
                    | {{ $t('seleDes2') }}
                .func-wrap__description
                    span 3
                    | {{ $t('seleDes3') }}
                .func-wrap__case {{ $t('case') }}
                .func-stock
                    .func-stock__name {{ $t('caseStock2') }}
                        span 00242
                    .func-stock__subline
                        | {{ $t('inDate') }}
                        span 2019-04-01
                        br(v-if="isLangEn")
                        | {{ $t('outDate') }}
                        span 2019-04-30
                    .fucn-stock__chart(ref="longChart")
        .advantage
            .section-title
                span {{ $t('ourAdvantages') }}
            .advantage-tabs
                span(
                    v-for="(item, index) in advantages"
                    :key="item.title"
                    :class="{active: swipeIndex === index}"
                    @click="swipeTo(index)"
                ) {{ item.title }}
            van-swipe(
                ref="swipe"
                :show-indicators="false"
                :width="317 * widthRate"
                :loop="false"
                @change="swipeIndex = $event"
            )
                van-swipe-item(v-for="(item, index) in advantages" :key="item.title")
                    .advantage-wrap
                        img.advantage-wrap__img(v-if="index === 0" src="./images/icon-05.png")
                        img.advantage-wrap__img(v-if="index === 1" src="./images/icon-06.png")
                        img.advantage-wrap__img(v-if="index === 2" src="./images/icon-07.png")
                        img.advantage-wrap__img(v-if="index === 3" src="./images/icon-08.png")
                        .advantage-wrap__title {{ item.title }}
                        .advantage-wrap__description {{ item.description }}
        .risk-tips {{ $t('riskWarning') }}
</template>

<script>
import bodymovin from 'bodymovin'
import { Swipe, SwipeItem } from 'vant'
import config from '../0-config'
export default {
    name: 'App',
    components: {
        [Swipe.name]: Swipe,
        [SwipeItem.name]: SwipeItem
    },
    data() {
        return {
            isLangZhHk: config.isLangZhHk,
            isLangEn: config.isLangEn,
            widthRate: document.body.clientWidth / 375,
            swipeIndex: 0,
            advantages: [
                {
                    title: this.$t('adTitle1'),
                    description: this.$t('adDes1')
                },
                {
                    title: this.$t('adTitle2'),
                    description: config.isMainland
                        ? '友信投研团队拥有多名金融学博士、金融数学算法专家及港美股资深分析师。通过人工+智能方为用户提供全方位股票投资服务'
                        : this.$t('adDes2')
                },
                {
                    title: this.$t('adTitle3'),
                    description: config.isMainland
                        ? '友信策略专家团队，深谙云计算、深度学习、海量数据实时处理等前沿技术。轻松解析瞬息万变的行情，精准把握投资时机'
                        : this.$t('adDes3')
                },
                {
                    title: this.$t('adTitle4'),
                    description: this.$t('adDes4')
                }
            ]
        }
    },
    async mounted() {
        let long = {}
        let short = {}
        if (config.isLangZhHk) {
            long = await import('./data/long-hk')
            short = await import('./data/short-hk')
        } else if (config.isLangEn) {
            long = await import('./data/long-en')
            short = await import('./data/short-en')
        } else {
            long = await import('./data/long-cn')
            short = await import('./data/short-cn')
        }
        bodymovin.loadAnimation({
            container: this.$refs.shortChart,
            animationData: short
        })
        bodymovin.loadAnimation({
            container: this.$refs.longChart,
            animationData: long
        })
    },
    methods: {
        swipeTo(index) {
            this.swipeIndex = index
            this.$refs.swipe.swipeTo(index)
        }
    }
}
</script>

<style lang="less" scoped>
#app {
    color: #393939;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
}
.banner {
    width: 100%;
}
.why {
    text-align: center;
    color: #1f1f6c;
    margin: 30px 15px 15px;
    &__question {
        font-size: 22px;
        margin-bottom: 8px;
    }
    &__answer {
        font-size: 16px;
    }
}
.benefit {
    display: flex;
    justify-content: space-between;
    margin: 0 15px 21px;
    &-item {
        width: 120px;
        text-align: center;
        color: #1f1f6c;
        &__img {
            width: 90px;
        }
        &__title {
            font-size: 0.28rem;
            font-weight: bold;
        }
        &__description {
            font-size: 0.24rem;
        }
    }
}
.section-title {
    font-size: 20px;
    color: #1f1f6c;
    text-align: center;
    padding: 30px 0 14px;
    span {
        position: relative;
        &:before,
        &:after {
            content: '';
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 27px;
            height: 4px;
            background-image: url('./images/icon-04.png');
            background-size: 27px;
        }
        &:before {
            left: -8px;
            transform: translateX(-100%);
        }
        &:after {
            right: -8px;
            transform: translateX(100%) rotate(180deg);
        }
    }
}
.func {
    padding: 0 14px 16px;
    background: #f4f8ff;
    &-wrap {
        position: relative;
        background: #fff;
        border: 1px solid #f0f0f0;
        border-radius: 10px;
        padding: 65px 0 0;
        margin-bottom: 20px;
        &__title {
            position: absolute;
            top: 18px;
            left: -10px;
            font-size: 16px;
            line-height: 30px;
            min-width: 83px;
            padding: 0 5px;
            box-sizing: border-box;
            text-align: center;
            color: #fff;
            background: #3b6cf0;
            &:after {
                content: '';
                position: absolute;
                top: 100%;
                left: 0;
                border-width: 0 10px 10px 0;
                border-style: solid;
                border-color: transparent #2654cf transparent transparent;
            }
        }
        &__description {
            margin: 0 14px 8px;
            span {
                display: inline-block;
                line-height: 18px;
                width: 18px;
                text-align: center;
                font-size: 12px;
                border-radius: 50%;
                background: rgba(#3b6cf0, 0.1);
                margin-right: 10px;
            }
        }
        &__case {
            position: relative;
            font-size: 18px;
            margin: 25px 16px 13px;
            &:before {
                content: '';
                position: absolute;
                left: -16px;
                top: 50%;
                transform: translateY(-50%);
                width: 4px;
                height: 12px;
                background: #393939;
            }
        }
    }
    &-stock {
        margin-left: 16px;
        padding-bottom: 8px;
        &__name {
            font-size: 16px;
            margin-bottom: 4px;
            span {
                font-size: 14px;
                color: rgba(#393939, 0.6);
                margin-left: 6px;
            }
        }
        &__subline {
            font-size: 12px;
            color: rgba(#393939, 0.6);
            span {
                color: #393939;
                margin: 0 20px 0 10px;
                &.up {
                    color: #fd4469;
                }
            }
        }
    }
}
.advantage {
    &-tabs {
        display: flex;
        justify-content: space-around;
        margin-bottom: 23px;
        span {
            color: rgba(#1f1f6c, 0.4);
            &.active {
                position: relative;
                color: #1f1f6c;
                &:after {
                    content: '';
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    bottom: -3px;
                    width: 24px;
                    height: 2px;
                    background: #1f1f6c;
                    border-radius: 1px;
                }
            }
        }
    }
    &-wrap {
        width: 299px;
        min-height: 186px;
        box-sizing: border-box;
        border: 1px solid #fdfdfd;
        box-shadow: 0 2px 7px rgba(#8f8f8f, 0.15);
        border-radius: 10px;
        margin: 0 0 40px 18px;
        padding: 18px 16px 20px;
        text-align: center;
        &__img {
            width: 40px;
            margin-bottom: 8px;
        }
        &__title {
            font-size: 18px;
            color: #1f1f6c;
            margin-bottom: 10px;
        }
        &__description {
            color: rgba(#1f1f6c, 0.8);
        }
    }
}
.risk-tips {
    font-size: 12px;
    color: rgba(#1f1f6c, 0.3);
    margin: 0 18px 28px;
}
</style>
