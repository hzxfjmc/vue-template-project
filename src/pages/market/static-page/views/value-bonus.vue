<template lang="pug">
    .static-page-value-bonus(:class="{'is-lang-en': isLangEn}")
        img.title-baner(src="../img/value-bonus/title-en.png" v-if="isLangEn")
        img.title-baner(src="../img/value-bonus/title-hk.png" v-else)
        .intro {{ i18n.intro }}
        .wrap.logic
            .section-title {{ i18n.logic }}
            .logic-item
                img(src="../img/value-bonus/logic-1.png")
                .logic-title {{ i18n.logicTitle_1 }}
                .logic-des {{ i18n.logicDes_1 }}
            .logic-item
                img(src="../img/value-bonus/logic-2.png")
                .logic-title {{ i18n.logicTitle_2 }}
                .logic-des {{ i18n.logicDes_2 }}
            .logic-item
                img(src="../img/value-bonus/logic-3.png")
                .logic-title {{ i18n.logicTitle_3 }}
                .logic-des {{ i18n.logicDes_3 }}
        .wrap.history
            .section-title {{ i18n.history }}
            .chart-sec
                span.chart-sec-1 {{ i18n.hostoryItem_1 }}
                span.income {{ i18n.hostoryItem_2 }}
            img.chart(src="../img/value-bonus/chart.png")
        .wrap.famous
            .section-title {{ i18n.famous }}
            .famous-item
                img(src="../img/value-bonus/famous-1.png")
                .famous-name {{ i18n.famousPerson_1 }}
                .famous-des {{ i18n.famousDes_1 }}
            .famous-item.right
                img(src="../img/value-bonus/famous-2.png")
                .famous-name {{ i18n.famousPerson_2 }}
                .famous-des {{ i18n.famousDes_2 }}
        .wrap.suit
            .section-title {{ i18n.suit }}
            .suit-center
            .suit-text.suit-1 {{ i18n.suit_1 }}
            .suit-text.suit-2 {{ i18n.suit_2 }}
            .suit-text.suit-3 {{ i18n.suit_3 }}
            .suit-text.suit-4 {{ i18n.suit_4 }}
        .tips {{ i18n.tips }}
</template>

<script>
import config from '../../0-config'
export default {
    name: 'value-bonus',
    data() {
        return {
            isLangZhHk: config.isLangZhHk,
            isLangEn: config.isLangEn
        }
    },
    computed: {
        i18n() {
            return this.$t('valueBonus')
        }
    },
    mounted() {
        this.$html.setTitle(this.i18n.title)
    }
}
</script>

<style lang="scss" scoped>
.static-page-value-bonus {
    background-image: url(../img/value-bonus/bg.jpg);
    background-size: 100%;
    background-position: top center;
    padding-bottom: 30px;
    padding-top: 1px;
}
.title-baner {
    display: block;
    width: 325px;
    height: 77px;
    margin: 20px auto 375px;
}
.section-title {
    text-align: center;
    font-size: 0.36rem;
    color: #e9e5ff;
    margin-bottom: 16px;
    line-height: 32px;
}
.intro {
    display: flex;
    align-items: center;
    width: 338px;
    height: 141px;
    margin: 0 auto 18px;
    padding: 16px 15px 14px 19px;
    box-sizing: border-box;
    background-image: url(../img/value-bonus/intro.png);
    background-size: 100%;
    color: #e5ddff;
}
.wrap {
    width: 338px;
    margin: 0 auto 16px;
    background-size: 100%;
    background-repeat: no-repeat;
}
.logic {
    height: 395px;
    background-image: url(../img/value-bonus/wrap-1.png);
    &-item {
        height: 89px;
        margin: 0 16px 18px 23px;
        padding-left: 90px;
        position: relative;
        display: flex;
        justify-content: center;
        flex-direction: column;
        img {
            position: absolute;
            left: 0;
            top: 0;
            width: 82px;
            height: 89px;
        }
    }
    &-title {
        font-size: 16px;
        color: #fff;
    }
    &-des {
        font-size: 13px;
        color: #c3b1ff;
    }
}
.history {
    height: 345px;
    background-image: url(../img/value-bonus/wrap-2.png);
}
.chart-sec {
    text-align: center;
    margin-bottom: 6px;
    span {
        color: #c3b1ff;
        &:after {
            content: '';
            display: inline-block;
            width: 23px;
            height: 2px;
            background: #ff8f35;
            vertical-align: middle;
            margin-left: 5px;
        }
        + span {
            margin-left: 20px;
            &:after {
                background: #2262ff;
            }
        }
    }
}
.chart {
    width: 302px;
    margin-left: 18px;
}
.famous {
    height: 251px;
    background-image: url(../img/value-bonus/wrap-3.png);
    &-item {
        position: relative;
        margin: 0 10px 30px 20px;
        padding: 0 0 0 75px;
        img {
            position: absolute;
            left: 0;
            width: 60px;
        }
        &.right {
            text-align: right;
            padding: 0 75px 0 0;
            img {
                left: auto;
                right: 0;
            }
        }
    }
    &-name {
        font-size: 16px;
        color: #fff;
    }
    &-des {
        font-size: 13px;
        color: #c3b1ff;
    }
}
.suit {
    position: relative;
    height: 252px;
    background-image: url(../img/value-bonus/wrap-4.png);
    &-center {
        position: absolute;
        width: 180px;
        height: 180px;
        background-image: url(../img/value-bonus/suit.png);
        background-size: 100%;
        left: 50%;
        transform: translateX(-50%);
    }
    &-text {
        position: absolute;
        color: #e5ddff;
        font-size: 0.28rem;
        line-height: 18px;
        text-align: center;
        padding: 6px 4px;
        background-color: #5624ff;
    }
    &-1 {
        width: 112px;
        right: 210px;
        bottom: 166px;
        border-radius: 10px 10px 0 10px;
    }
    &-2 {
        width: 90px;
        left: 231px;
        bottom: 140px;
        border-radius: 10px 10px 10px 0;
    }
    &-3 {
        width: 100px;
        left: 16px;
        top: 170px;
        border-radius: 10px 0 10px 10px;
    }
    &-4 {
        width: 132px;
        left: 185px;
        top: 200px;
        border-radius: 0 10px 10px 10px;
    }
}
.tips {
    width: 340px;
    color: rgba(#c3b1ff, 0.8);
    font-size: 12px;
    margin: 0 auto;
}
/*英文版*/
.is-lang-en {
    .title-baner {
        width: 349px;
        height: 50px;
        margin: 38px auto 383px;
    }
    .intro {
        font-size: 12px;
        line-height: 1.3;
    }
    .logic-des {
        font-size: 12px;
    }
    .famous {
        .section-title {
            font-size: 0.28rem;
        }
        &-item {
            margin-bottom: 0;
        }
        &-des {
            font-size: 0.24rem;
            color: #c3b1ff;
        }
    }
    .suit-1 {
        font-size: 0.24rem;
        padding: 3px 2px;
        width: 120px;
    }
    .suit-4 {
        font-size: 0.24rem;
        padding: 3px 4px;
    }
}
</style>
