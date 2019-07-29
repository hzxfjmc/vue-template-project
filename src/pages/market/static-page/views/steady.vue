<template lang="pug">
    .static-page-steady(:class="{'is-lang-en': isLangEn}")
        img.title-baner(src="../img/steady/title-hk.png" v-if="isLangZhHk")
        img.title-baner(src="../img/steady/title-en.png" v-else-if="isLangEn")
        img.title-baner(src="../img/steady/title-cn.png" v-else)
        .intro-wrap {{ i18n.intro }}
        .section-title
            span {{ i18n.feature }}
        .feature.feature_1
            .feature__title {{ i18n.featureTitle_1 }}
            .feature__des {{ i18n.featureDes_1 }}
        .feature.feature_2
            .feature__title {{ i18n.featureTitle_2 }}
            .feature__des {{ i18n.featureDes_2 }}
        .feature.feature_3
            .feature__title {{ i18n.featureTitle_3 }}
            .feature__des {{ i18n.featureDes_3 }}
        .section-title
            span {{ i18n.history }}
        .history-des(v-html="i18n.historyDes")
        img.history-img(src="../img/steady/chart.png")
        .section-title
            span {{ i18n.service }}
        .service(v-html="i18n.serviceDes")
        .tips {{ i18n.tips }}
</template>

<script>
import config from '../../0-config'
export default {
    name: 'steady',
    data() {
        return {
            isLangZhHk: config.isLangZhHk,
            isLangEn: config.isLangEn
        }
    },
    computed: {
        i18n() {
            return this.$t('steady')
        }
    },
    mounted() {
        this.$html.setTitle(this.i18n.title)
    }
}
</script>

<style lang="scss" scoped>
.static-page-steady {
    background-image: url(../img/steady/bg.jpg);
    background-size: 100%;
    background-position: top center;
    padding-bottom: 30px;
}
.title-baner {
    width: 100%;
    margin-top: 118px;
}
.intro-wrap {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding-left: 5px;
    width: 302px;
    height: 115px;
    margin: 103px auto 57px;
    color: #1be5ff;
}
.section-title {
    text-align: center;
    span {
        position: relative;
        font-size: 16px;
        color: #41e9ff;
        &:before,
        &:after {
            content: '';
            position: absolute;
            width: 84px;
            height: 9px;
            top: 8px;
            background-image: url(../img/steady/divider.png);
            background-size: 100%;
        }
        &:before {
            right: 100%;
            margin-right: 8px;
        }
        &:after {
            left: 100%;
            margin-left: 8px;
            transform: rotate(180deg);
        }
    }
}
.feature {
    width: 320px;
    height: 100px;
    margin: 30px auto 0;
    padding: 0 8px 0 109px;
    box-sizing: border-box;
    background-size: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-wrap: wrap;
    &_1 {
        background-image: url(../img/steady/feature-1.png);
    }
    &_2 {
        background-image: url(../img/steady/feature-2.png);
    }
    &_3 {
        background-image: url(../img/steady/feature-3.png);
        margin-bottom: 60px;
    }
    &__title {
        color: #1be5ff;
        font-size: 0.32rem;
        margin-bottom: 4px;
    }
    &__des {
        color: #fff;
        font-size: 0.24rem;
    }
}
.history-img {
    width: 320px;
    display: block;
    margin: 0 auto 61px;
}
.service {
    width: 320px;
    margin: 13px auto 40px;
    color: #41e9ff;
    font-size: 12px;
}
.tips {
    width: 320px;
    margin: 0 auto;
    color: rgba(#fff, 0.4);
    font-size: 12px;
}
.is-lang-en {
    .intro-wrap {
        font-size: 0.24rem;
    }
    .feature {
        &__title {
            font-size: 0.24rem;
        }
        &__des {
            font-size: 0.24rem;
        }
    }
}
</style>

<style lang="scss">
.static-page-steady {
    .history-des {
        width: 320px;
        margin: 13px auto 30px;
        color: #41e9ff;
        span {
            color: #ff5284;
        }
        b {
            font-size: 18px;
            font-weight: normal;
        }
    }
}
</style>
