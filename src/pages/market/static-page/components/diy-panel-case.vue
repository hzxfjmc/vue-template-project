<template lang="pug">
    diy-panel.diy-panel-case
        template(slot="header")
            header {{title}}

        .line
            span.name(:style="{fontSize: '16px'}") {{i18n.name}}
            span.code 01629.HK
        .line
            span.date
                span {{i18n.date}}
                span.value 2019-04-11
            span.stop
                span {{i18n.stop}}
                span.value 7.35
        .container(ref="chart")

        template(slot="footer")
            slot(name="footer")

</template>

<script>
import DiyPanel from './diy-panel'
import bodymovin from 'bodymovin'

export default {
    name: 'diy-panel-case',
    props: {
        title: String,
        case: Number
    },
    components: { DiyPanel },
    computed: {
        i18n() {
            return this.$t('casePanel')
        }
    },
    async mounted() {
        try {
            const { default: data } = await import(
                /*webpackChunkName: 'chart-data'*/ `../data/stronger/case${this.case}/data${this.$ua.lang}.json`
            )
            bodymovin.loadAnimation({
                container: this.$refs.chart,
                animationData: data
            })
        } catch (e) {
            console.log('获取图标数据失败（watch type）')
        }
    }
}
</script>

<style scoped lang="scss">
.diy-panel-case {
    header {
        padding-top: 26px;
        font-size: 18px;
        font-weight: 500;
        color: rgba(57, 57, 57, 1);
        line-height: 23px;

        &:before {
            content: '';
            display: inline-block;
            width: 4px;
            height: 12px;
            margin-right: 12px;
            background: rgba(57, 57, 57, 1);
        }
    }

    .line {
        font-size: 14px;
        font-weight: 400;
        color: rgba(57, 57, 57, 0.6);
        line-height: 23px;
        margin-bottom: 4px;

        .name {
            margin-right: 6px;
            font-size: 16px;
            color: rgba(57, 57, 57, 1);
        }

        &:after {
            content: ' ';
            display: block;
            height: 0;
            visibility: hidden;
            clear: both;
        }

        .date,
        .stop {
            float: left;
        }

        .date {
            margin-right: 26px;

            .value {
                color: rgba(57, 57, 57, 1);
            }
        }

        .stop {
            .value {
                color: rgba(253, 68, 105, 1);
            }
        }

        .value {
            margin-left: 16px;
        }
    }
}
</style>
