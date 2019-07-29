<template lang="pug">
    .static-page-strong(:class="{ en: $ua.isEn }" :style="{ 'background-image': `url(${banner})` }")
        .description {{i18n.description}}

        // 选股逻辑
        diy-panel.select-stock-logic
            template(slot="header")
                diy-panel-header(:title="i18n.logic.title")
            | {{i18n.logic.description}}

        // 历史表现
        // diy-panel.select-stock-history
            template(slot="header")
                diy-panel-header(:title="i18n.history.title")
            img(:src="historyImg")
            | {{i18n.history.description}}

        // 服务说明
        diy-panel.select-stock-service
            template(slot="header")
                diy-panel-header(:title="i18n.service.title")

            p(v-for="(item, index) in i18n.service.details" :index="index + 1") {{item}}

            .process
                template(v-for="(item, index) in i18n.service.process")
                    span.item(v-html="item")
                    img.arrow(v-if="index + 1 < i18n.service.process.length" src="../img/stronger/arrow@2x.png")

            template(slot="footer")
                diy-panel-footer

        // 案例一，止盈
        diy-panel-case.select-stock-case(:title="i18n.case[0].title" :case="1")
            template(slot="footer")
                //diy-panel-footer

        // 案例二，未止盈
        //diy-panel-case.select-stock-case(:title="i18n.case[1].title" :case="2")

        // 团队介绍
        diy-panel.select-stock-team
            template(slot="header")
                diy-panel-header(:title="i18n.team.title")
            p(v-for="item in i18n.team.description") {{item}}

        .tip {{i18n.tip}}
</template>

<script>
import DiyPanel from '../components/diy-panel'
import DiyPanelHeader from '../components/diy-panel-header'
import DiyPanelCase from '../components/diy-panel-case'
import DiyPanelFooter from '../components/diy-panel-footer'

export default {
    name: 'stronger',
    components: {
        DiyPanelFooter,
        DiyPanelCase,
        DiyPanelHeader,
        DiyPanel
    },
    computed: {
        i18n() {
            return this.$t('stronger')
        },
        // banner图
        banner() {
            return require(`../img/stronger/banner${this.$ua.lang}@2x.jpg`)
        },
        // 历史表现图
        historyImg() {
            return require(`../img/stronger/history${this.$ua.lang}@2x.png`)
        }
    },
    mounted() {
        this.$html.setTitle(this.i18n.title)
    }
}
</script>

<style scoped lang="scss">
.static-page-strong {
    width: 100%;
    min-height: 100%;
    padding: 400px 15px 15px;
    background: rgba(194, 2, 23, 1) no-repeat top;
    background-size: contain;

    .description {
        width: 100%;
        position: absolute;
        top: 90px;
        left: 0;
        font-size: 15px;
        font-weight: 400;
        color: rgba(255, 246, 216, 1);
        line-height: 1.4;
        text-align: center;
    }

    .diy-panel {
        margin-bottom: 22px;
        font-size: 14px;
        font-weight: 400;
        color: rgba(57, 57, 57, 1);
        line-height: 24px;
    }

    .select-stock-history {
        img {
            width: 100%;
            margin-bottom: 12px;
        }
    }

    .select-stock-service {
        p {
            color: rgba(59, 59, 59, 1);
            line-height: 28px;

            &:before {
                content: attr(index);
                display: inline-block;
                width: 18px;
                height: 18px;
                margin-right: 10px;
                line-height: 18px;
                text-align: center;
                background: rgba(194, 2, 23, 0.0519);
                border-radius: 100%;

                font-size: 12px;
                font-weight: 400;
                color: rgba(194, 2, 23, 1);
            }
        }

        .process {
            display: flex;
            justify-content: left;
            align-items: center;
            margin-top: 10px;

            .item {
                display: table-cell;
                vertical-align: middle;
                text-align: center;

                padding: 8px 5px 6px;
                background: rgba(249, 230, 232, 1);
                border-radius: 5px;

                font-size: 12px;
                font-weight: 400;
                color: rgba(194, 2, 23, 0.8);
                line-height: 17px;
            }

            .arrow {
                width: 20px;
                height: 12px;
                margin: 0 3px;
            }
        }
    }

    /*.select-stock-team {*/
    /*    p:first-child {*/
    /*        margin-bottom: 30px;*/
    /*    }*/
    /*}*/

    .tip {
        margin-bottom: 58px;
        font-size: 12px;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.6);
        line-height: 19px;
    }

    &.en {
        .select-stock-service {
            .process {
                .item {
                    text-align: left;
                    padding: 5px 5px 5px 10px;
                }
            }
        }
    }
}
</style>
