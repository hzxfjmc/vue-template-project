<template lang="pug">
    .static-page-alpha(:class="{'is-lang-en': isLangEn, 'is-lang-hk': isLangZhHk}")
        img.title-baner(src="../img/alpha/banner-hk.png" v-if="isLangZhHk")
        img.title-baner(src="../img/alpha/banner-en.png" v-else-if="isLangEn")
        img.title-baner(src="../img/alpha/banner-cn.png" v-else)
        .intro {{ i18n.intro }}
        .section-title.section-1 {{ i18n.advantage }}
        .advantage
            .advantage-item
                img(src="../img/alpha/indi-1.png")
                p(v-html="i18n.advantage_1")
            .advantage-item
                img(src="../img/alpha/indi-2.png")
                p(v-html="i18n.advantage_2")
            .advantage-item
                img(src="../img/alpha/indi-3.png")
                p(v-html="i18n.advantage_3")
        .section-title.section-2 {{ i18n.logic }}
        .logic
            .logic-item.logic-item-1 {{ i18n.logic_1 }}
            .logic-item.logic-item-2 {{ i18n.logic_2 }}
            .logic-item.logic-item-3 {{ i18n.logic_3 }}
            .logic-item.logic-item-4 {{ i18n.logic_4 }}
        .section-title.section-3 {{ i18n.service }}
        .service
            .service-item {{ i18n.service_1 }}
            .service-item {{ i18n.service_2 }}
            .service-item {{ i18n.service_3 }}
            .service-item {{ i18n.service_4 }}
        .section-title.section-4 {{ i18n.case }}
        table.table(cellspacing="0" cellpadding="0")
            thead
                tr
                    th(v-for="item in i18n.thead" :key="item" v-html="item")
            tbody
                tr(v-for="item in i18n.tbody" :key="item.col_1")
                    td(v-html="item.col_1")
                    td(v-html="item.col_2")
                    td(v-html="item.col_3")
                    td(v-html="item.col_4")
        .tips {{ i18n.tips }}
</template>

<script>
import config from '../../0-config'
export default {
    name: 'alpha',
    data() {
        return {
            isLangZhHk: config.isLangZhHk,
            isLangEn: config.isLangEn
        }
    },
    computed: {
        i18n() {
            return this.$t('alpha')
        }
    },
    mounted() {
        this.$html.setTitle(this.i18n.title)
    }
}
</script>

<style lang="scss" scoped>
.static-page-alpha {
    background-image: url(../img/alpha/bg.jpg);
    background-size: 100%;
    background-position: top center;
    background-color: #000;
    background-repeat: no-repeat;
    padding-bottom: 30px;
    padding-top: 1px;
    color: #fff;
}
.title-baner {
    width: 100%;
}
.intro {
    width: 342px;
    height: 149px;
    background-image: url(../img/alpha/wrap.png);
    background-size: 100%;
    margin: 13px auto 0;
    padding: 0 40px 0 33px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: 0.28rem;
    line-height: 1.8;
}
.section {
    &-title {
        height: 69px;
        line-height: 55px;
        background-size: 177px;
        background-repeat: no-repeat;
        box-sizing: border-box;
        font-size: 0.4rem;
        margin: 40px 0 15px;
        padding-left: 40px;
    }
    &-1 {
        background-image: url(../img/alpha/sec-1.png);
    }
    &-2 {
        background-image: url(../img/alpha/sec-2.png);
    }
    &-3 {
        background-image: url(../img/alpha/sec-3.png);
    }
    &-4 {
        background-image: url(../img/alpha/sec-4.png);
    }
}
.advantage {
    display: flex;
    justify-content: space-around;
    &-item {
        text-align: center;
        font-size: 0.28rem;
        img {
            width: 90px;
            height: 83px;
            margin-bottom: 13px;
        }
        &:first-child {
            img {
                transform: translateX(16px);
            }
        }
    }
}
.logic {
    position: relative;
    height: 171px;
    &-item {
        width: 194px;
        height: 69px;
        background-image: url(../img/alpha/logic.png);
        background-size: 100%;
        font-size: 0.28rem;
        text-align: center;
        box-sizing: border-box;
        padding: 0 15px 13px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        position: absolute;
        &-1 {
            left: 17px;
            top: 0;
        }
        &-2 {
            right: 0;
            top: 26px;
        }
        &-3 {
            left: 2px;
            top: 68px;
        }
        &-4 {
            right: 22px;
            top: 93px;
        }
    }
}
.service {
    margin: 0 35px;
    &-item {
        font-size: 0.28rem;
        background-image: url(../img/alpha/serv.png);
        background-size: 174px;
        background-repeat: no-repeat;
        padding: 7px 0 7px 19px;
        margin-bottom: 6px;
    }
}
.table {
    width: 347px;
    margin: 0 auto 13px;
    border: 1px solid #2d2b41;
    border-collapse: collapse;
    th,
    td {
        border: 1px solid #2d2b41;
        text-align: center;
    }
    th {
        color: rgba(#fff, 0.6);
        font-weight: normal;
        padding: 6px 0;
    }
    td {
        padding: 10px 0;
        &:last-child {
            color: #ff0f52;
        }
    }
}
.tips {
    font-size: 12px;
    color: rgba(#fff, 0.4);
    margin: 0 14px;
}
/*英文版*/
.is-lang-en {
    .intro {
        font-size: 0.24rem;
        line-height: 1.2;
    }
    .section-title {
        margin-top: 20px;
        margin-bottom: 6px;
    }
    .table {
        th {
            font-size: 0.28rem;
        }
        td {
            &:last-child {
                color: #00ef96;
            }
        }
    }
}
/*港版*/
.is-lang-hk {
    .table {
        td {
            &:last-child {
                color: #00ef96;
            }
        }
    }
}
</style>
