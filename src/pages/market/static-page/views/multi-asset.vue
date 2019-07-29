<template lang="pug">
    .static-page-multi-asset(:class="{'is-lang-en': isLangEn}")
        img.title-baner(src="../img/multi-asset/title-en.png" v-if="isLangEn")
        img.title-baner(src="../img/multi-asset/title-hk.png" v-else-if="isLangZhHk")
        img.title-baner(src="../img/multi-asset/title-cn.png" v-else)
        .main
            .section.etf
                img(src="../img/multi-asset/icon-01.png")
                .section-title {{ i18n.etfTitle }}
                .section-des {{ i18n.etfDes }}
            .wrap.blue.index-to-more
                .wrap-title {{ i18n.wrap_1.title }}
                .wrap-content
                    .wrap-item(v-for="item in i18n.wrap_1.children" :key="item.name" @click="gotoStock(item)")
                        .wrap-item__name {{ item.name }}
                            span {{ item.stock }}
                        .wrap-item__des {{ item.des }}
                        img.wrap-item__arrow(src="../img/multi-asset/arrow.png")
            .wrap.blue.index-to-less
                .wrap-title {{ i18n.wrap_2.title }}
                .wrap-content
                    .wrap-item(v-for="item in i18n.wrap_2.children" :key="item.name" @click="gotoStock(item)")
                        .wrap-item__name {{ item.name }}
                            span {{ item.stock }}
                        .wrap-item__des {{ item.des }}
                        img.wrap-item__arrow(src="../img/multi-asset/arrow.png")
            .section.house
                img(src="../img/multi-asset/icon-02-en.png" v-if="isLangEn")
                img(src="../img/multi-asset/icon-02-hk.png" v-else-if="isLangZhHk")
                img(src="../img/multi-asset/icon-02-cn.png" v-else)
                .section-title {{ i18n.houseTitle }}
                .section-des {{ i18n.houseDes }}
            .wrap.red
                .wrap-title {{ i18n.wrap_3.title }}
                .wrap-content
                    .wrap-item(v-for="item in i18n.wrap_3.children" :key="item.name" @click="gotoStock(item)")
                        .wrap-item__name {{ item.name }}
                            span {{ item.stock }}
                        .wrap-item__des {{ item.des }}
                        img.wrap-item__arrow(src="../img/multi-asset/arrow.png")
            .section.bond
                img(src="../img/multi-asset/icon-03-en.png" v-if="isLangEn")
                img(src="../img/multi-asset/icon-03-hk.png" v-else-if="isLangZhHk")
                img(src="../img/multi-asset/icon-03-cn.png" v-else)
                .section-title {{ i18n.bondTitle }}
                .section-des {{ i18n.bondDes }}
            .wrap.yellow
                .wrap-title {{ i18n.wrap_4.title }}
                .wrap-content
                    .wrap-item(v-for="item in i18n.wrap_4.children" :key="item.name" @click="gotoStock(item)")
                        .wrap-item__name {{ item.name }}
                            span {{ item.stock }}
                        .wrap-item__des {{ item.des }}
                        img.wrap-item__arrow(src="../img/multi-asset/arrow.png")
            .tips {{ i18n.tips }}
</template>

<script>
import JSBridge from '@/utils/js-bridge'
import config from '../../0-config'
export default {
    name: 'multi-asset',
    data() {
        return {
            isLangZhHk: config.isLangZhHk,
            isLangEn: config.isLangEn
        }
    },
    computed: {
        i18n() {
            return this.$t('multiAsset')
        }
    },
    mounted() {
        this.$html.setTitle(this.i18n.title)
    },
    methods: {
        gotoStock(item) {
            let [code, market] = item.stock.split('.')
            market = market.toLowerCase()
            JSBridge.gotoNativeModule(
                `yxzq_goto://stock_quote?market=${market}&code=${code}`
            )
        }
    }
}
</script>

<style lang="scss" scoped>
.static-page-multi-asset {
    background-image: url(../img/multi-asset/bg.jpg);
    background-size: 100%;
    background-position: top center;
    background-repeat: no-repeat;
    background-color: #0e1f68;
    padding-bottom: 30px;
    padding-top: 1px;
}
.title-baner {
    display: block;
    width: 375px;
}
.main {
    margin: 0 14px;
}
.section {
    &-title {
        font-size: 0.36rem;
        color: #fff;
        margin-bottom: 6px;
        padding-top: 26px;
    }
    &-des {
        color: rgba(#fff, 0.8);
    }
}
.etf {
    position: relative;
    height: 154px;
    margin-top: 75px;
    margin-bottom: 5px;
    padding-left: 158px;
    img {
        position: absolute;
        top: 0;
        left: 0;
        width: 154px;
    }
}
.wrap {
    &.index-to-more {
        margin-bottom: 33px;
    }
    &.index-to-less {
        margin-bottom: 30px;
    }
    &.red {
        margin-bottom: 30px;
        .wrap-title {
            background: linear-gradient(rgba(#ff6c88, 0.4), rgba(#ed1baa, 0.4));
        }
        .wrap-item__name:before {
            background: linear-gradient(#ff6c88, #ed1baa);
        }
        .wrap-content {
            background-color: rgba(#ff6c88, 0.15);
        }
    }
    &.yellow {
        margin-bottom: 15px;
        .wrap-title {
            background: linear-gradient(rgba(#ffe754, 0.4), rgba(#ff7c34, 0.4));
        }
        .wrap-item__name:before {
            background: linear-gradient(#ffe754, #ff7c34);
        }
        .wrap-content {
            background-color: rgba(#ffe754, 0.15);
        }
    }
    &-title {
        font-size: 16px;
        color: #fff;
        padding: 9px 14px;
        background: linear-gradient(rgba(#51ccff, 0.4), rgba(#0036d4, 0.4));
    }
    &-content {
        background-color: rgba(#0036d4, 0.15);
        padding-bottom: 11px;
    }
    &-item {
        position: relative;
        padding-bottom: 9px;
        &__name {
            position: relative;
            color: #fff;
            padding: 15px 23px 5px 18px;
            &:before {
                content: '';
                position: absolute;
                left: 0;
                top: 19px;
                width: 4px;
                height: 15px;
                background: linear-gradient(#51ccff, #0036d4);
            }
            span {
                margin-left: 10px;
                font-size: 12px;
                color: rgba(#fff, 0.4);
            }
        }
        &__des {
            font-size: 12px;
            color: rgba(#fff, 0.7);
            padding: 0 18px;
        }
        &__arrow {
            position: absolute;
            right: 8px;
            top: 18px;
            width: 15px;
            height: 15px;
        }
    }
}
.house {
    padding-right: 154px;
    height: 161px;
    position: relative;
    margin-bottom: 5px;
    img {
        position: absolute;
        top: 0;
        right: 0;
        width: 295px;
    }
    .section-title {
        padding-top: 30px;
    }
}
.bond {
    padding-left: 156px;
    height: 155px;
    position: relative;
    margin-bottom: 5px;
    img {
        position: absolute;
        top: 0;
        left: 0;
        width: 155px;
    }
    .section-title {
        padding-top: 34px;
    }
}
.tips {
    font-size: 12px;
    color: rgba(#fff, 0.4);
}
/*英文版*/
.is-lang-en {
    .section-des {
        font-size: 12px;
    }
    .bond {
        .section-des {
            font-size: 10px;
        }
    }
}
</style>
