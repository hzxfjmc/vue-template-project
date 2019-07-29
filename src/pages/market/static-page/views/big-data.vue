<template lang="pug">
    .static-page-big-data(:class="{ en: $ua.isEn }")
        .title {{i18n.title}}
        .summary {{i18n.summary}}

        diy-panel.description(:texture="false")
            | {{i18n.description}}

        // 策略逻辑
        diy-panel.logic(:texture="false")
            template(slot="header")
                diy-panel-header1(:title="i18n.logic.title")
            template(slot="default")
                .logic-line(v-for="(line, index) in i18n.logic.list")
                    img(:src="require(`../img/big-data/logic${index + 1}@2x.png`)")
                    .line-right
                        .line-title {{line.title}}
                        .line-description {{line.description}}

        // 核心优势
        diy-panel.kernel(:texture="false")
            template(slot="header")
                diy-panel-header1(:title="i18n.kernel.title")
            template(slot="default")
                .kernel-item(v-for="(item, index) in i18n.kernel.list")
                    img(:src="require(`../img/big-data/kernel${index + 1}@2x.png`)")
                    .item-description(v-html="item")

        // 历史表现
        diy-panel.history(:texture="false")
            template(slot="header")
                diy-panel-header1(:title="i18n.history.title")
            template(slot="default")
                img(src="../img/big-data/history@2x.png")
                .history-description(v-html="i18n.history.description")

        // 适合人群
        diy-panel.appropriate(:texture="false")
            template(slot="header")
                diy-panel-header1(:title="i18n.appropriate.title")
            template(slot="default")
                img(src="../img/big-data/appropriate@2x.png")
                span(
                    v-for="(item, index) in i18n.appropriate.list"
                    :class="{top: index === 0, right: index === 1, bottom: index === 2, left: index === 3}"
                    ) {{item}}

        // 尊享服务
        diy-panel.honour(:texture="false")
            template(slot="header")
                diy-panel-header1(:title="i18n.honour.title")
            template(slot="default")
                .honour-item(v-for="(item, index) in i18n.honour.list")
                    img(:src="require(`../img/big-data/honour${index + 1}@2x.png`)")
                    .honour-description(v-html="item")

        .tip {{i18n.tip}}
</template>

<script>
import DiyPanel from '../components/diy-panel'
import DiyPanelHeader1 from '../components/diy-panel-header1'
export default {
    name: 'big-data',
    components: {
        DiyPanelHeader1,
        DiyPanel
    },
    computed: {
        i18n() {
            return this.$t('bigData')
        }
    },
    mounted() {
        this.$html.setTitle(this.i18n.title)
    }
}
</script>

<style scoped lang="scss">
.static-page-big-data {
    width: 100%;
    min-height: 100%;
    padding: 0 15px 15px;
    background: #1a4f95 url('../img/big-data/banner@2x.png') no-repeat top;
    background-size: contain;

    .title {
        font-size: 45px;
        font-weight: normal;
        color: rgba(255, 255, 255, 1);
        line-height: 1.1;
        text-align: center;
        padding-top: 23px;
        margin-bottom: 3px;
    }

    .summary {
        font-size: 14px;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        line-height: 20px;
        text-align: center;
    }

    .description {
        margin-top: 353px;
    }

    .diy-panel {
        margin-bottom: 20px;
        font-size: 15px;
        font-weight: 400;
        color: rgba(57, 57, 57, 1);
        line-height: 28px;
    }

    .logic {
        /deep/ .content {
            padding: 0 18px 12px;
        }

        .logic-line {
            display: flex;
            align-items: center;
            margin-bottom: 18px;
        }

        img {
            height: 90px;
        }

        .line-right {
            flex-grow: 1;
            margin-left: 10px;

            .line-title {
                margin-bottom: 5px;
                font-size: 16px;
                font-weight: 500;
                color: rgba(31, 31, 108, 1);
                line-height: 24px;
            }

            .line-description {
                font-size: 13px;
                font-weight: 400;
                color: rgba(75, 76, 138, 1);
                line-height: 18px;
            }
        }
    }

    .kernel {
        /deep/ .content {
            display: flex;
            justify-content: space-between;
            padding: 0 28px 20px;
        }

        .kernel-item {
            text-align: center;
            img {
                height: 65px;
                margin-bottom: 10px;
            }

            .item-description {
                font-size: 14px;
                font-weight: 400;
                color: rgba(31, 31, 108, 1);
                line-height: 20px;
            }
        }
    }

    .history {
        img {
            width: 100%;
            margin-bottom: 12px;
        }

        .history-description {
            font-size: 14px;
            font-weight: 400;
            color: rgba(59, 59, 59, 1);
            line-height: 25px;
        }
    }

    .appropriate {
        /deep/ .content {
            position: relative;
            padding: 0 0 22px;
            text-align: center;
        }
        img {
            width: 52%;
        }
        span {
            display: inline-block;
            position: absolute;
            height: 30px;
            line-height: 30px;
            background: rgba(220, 233, 255, 1);
            border-radius: 10px;
            padding: 0 14px;

            font-size: 14px;
            font-weight: 400;
            color: rgba(31, 31, 108, 1);
        }
        .top {
            top: 10px;
            left: 20px;
            border-bottom-right-radius: 0;
        }
        .right {
            top: 27px;
            right: 20px;
            border-bottom-left-radius: 0;
        }
        .bottom {
            border-top-left-radius: 0;
            bottom: 20px;
            right: 20px;
        }
        .left {
            border-top-right-radius: 0;
            left: 20px;
            bottom: 48px;
        }
    }

    .honour {
        /deep/ .content {
            padding-top: 0;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            text-align: center;
        }

        .honour-item {
            img {
                height: 77px;
                margin-bottom: 20px;
            }

            .honour-description {
                font-size: 14px;
                font-weight: 400;
                color: rgba(31, 31, 108, 1);
                line-height: 20px;
            }
        }
    }

    .tip {
        font-size: 12px;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        line-height: 19px;
        margin-bottom: 71px;
    }

    &.en {
        .title {
            font-size: 26px;
        }

        .appropriate {
            span {
                max-width: 100px;
                height: auto;
                padding: 5px;
                line-height: 1.4;
                font-size: 12px;
            }

            .top {
                top: -10px;
                left: 31px;
            }

            .right {
                top: 9px;
                right: 16px;
            }

            .bottom {
                max-width: 160px;
                bottom: 2px;
                right: 14px;
            }
            .left {
                left: 21px;
                bottom: 46px;
            }
        }
    }
}
</style>
