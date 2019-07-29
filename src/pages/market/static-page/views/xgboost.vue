<template lang="pug">
    .static-page-xgboost(:class="{'is-lang-en': isLangEn}")
        .banner
            img.title(src="../img/xgboost/title.png" v-if="!isLangEn")
            img.title(src="../img/xgboost/title-en.png" v-else)
        .wrap {{ i18n.intro }}
        img.strategy(src="../img/xgboost/strategy-en.png" v-if="isLangEn")
        img.strategy(src="../img/xgboost/strategy-hk.png" v-else-if="isLangZhHk")
        img.strategy(src="../img/xgboost/strategy-cn.png" v-else)
        .section-title
            span {{ i18n.advantage }}
        .advantage-item.advantage-item-1
            .advantage-title {{ i18n.advantageTitle_1 }}
            .advantage-des {{ i18n.advantageDes_1 }}
        .advantage-item.advantage-item-2
            .advantage-title {{ i18n.advantageTitle_2 }}
            .advantage-des {{ i18n.advantageDes_2 }}
        .advantage-item.advantage-item-3
            .advantage-title {{ i18n.advantageTitle_3 }}
            .advantage-des {{ i18n.advantageDes_3 }}
        .section-title
            span {{ i18n.history }}
            .history-des {{ i18n.historyDes }}
            img.history-chart(src="../img/xgboost/chart.png")
        .section-title
            span {{ i18n.service }}
        .service
            .service-title {{ i18n.serviceTitle_1 }}
            .service-des {{ i18n.serviceDes_1 }}
            .service-title {{ i18n.serviceTitle_2 }}
            .service-des {{ i18n.serviceDes_2 }}
        .tips {{ i18n.tips }}
</template>

<script>
import config from '../../0-config'
export default {
    name: 'xgboost',
    data() {
        return {
            isLangZhHk: config.isLangZhHk,
            isLangEn: config.isLangEn
        }
    },
    computed: {
        i18n() {
            return this.$t('xgboost')
        }
    },
    mounted() {
        this.$html.setTitle(this.i18n.title)
    }
}
</script>

<style lang="scss" scoped>
.static-page-xgboost {
    background-image: url(../img/xgboost/banner.jpg);
    background-size: 100%;
    background-position: top center;
    background-repeat: no-repeat;
    background-color: #1000a3;
    padding-bottom: 30px;
    color: #fff;
}
.banner {
    height: 442px;
    text-align: center;
}
.title {
    width: 326px;
    margin-top: 37px;
}
.wrap {
    height: 121px;
    background-image: url(../img/xgboost/wrap.png);
    background-size: 100%;
    padding: 0 33px;
    margin-bottom: 82px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.strategy {
    width: 100%;
}
.section-title {
    margin: 55px 0 17px;
    text-align: center;
    span {
        position: relative;
        font-size: 18px;
        &:before,
        &:after {
            content: '';
            position: absolute;
            top: 11px;
            width: 55px;
            height: 6px;
            margin: 0 11px;
        }
        &:before {
            right: 100%;
            background: linear-gradient(to left, #02f1fe, rgba(#1c9bf0, 0));
        }
        &:after {
            left: 100%;
            background: linear-gradient(to right, #02f1fe, rgba(#1c9bf0, 0));
        }
    }
}
.advantage {
    &-item {
        min-height: 140px;
        background-size: 100%;
        background-repeat: no-repeat;
        box-sizing: border-box;
        padding: 40px 41px 0 142px;
        &-1 {
            background-image: url(../img/xgboost/advantage_1.png);
        }
        &-2 {
            min-height: 157px;
            background-image: url(../img/xgboost/advantage_2.png);
        }
        &-3 {
            background-image: url(../img/xgboost/advantage_3.png);
        }
    }
    &-title {
        font-size: 0.32rem;
        color: #14daff;
        margin-bottom: 3px;
    }
    &-des {
        font-size: 0.28rem;
        color: rgba(#fff, 0.8);
    }
}
.history {
    &-des {
        text-align: center;
        color: rgba(#fff, 0.8);
        margin: 10px 0 30px;
    }
    &-chart {
        width: 100%;
    }
}
.service {
    margin: 0 32px;
    &-title {
        font-size: 16px;
    }
    &-des {
        color: rgba(#fff, 0.8);
        margin-bottom: 14px;
    }
}
.tips {
    margin: 0 32px;
    font-size: 12px;
    color: rgba(#fff, 0.6);
}
/*英文版*/
.is-lang-en {
    .title {
        width: 335px;
        margin-top: 42px;
    }
    .wrap {
        line-height: 1.2;
    }
    .advantage {
        &-title {
            line-height: 1.2;
        }
        &-des {
            font-size: 0.24rem;
            line-height: 1.2;
            color: rgba(#fff, 0.8);
        }
        &-item-3 {
            .advantage-title {
                font-size: 0.28rem;
            }
            .advantage-des {
                font-size: 0.22rem;
            }
        }
    }
}
</style>
