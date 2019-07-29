<template lang="pug">
    .detail-chart
        .header
            .header__name {{ $t('incomeRate') }}(%)
            .header__labels
                .header__label {{ $t('strategy') }}
                .header__label.hengsheng(v-if="hengsheng") {{ $t('index', 1) }}
                .header__label.nasdaq(v-if="nasdaq") {{ $t('index', 2) }}
        canvas(ref="canvas" height="100")
</template>

<script>
import Chart from '../../0-utils/Chart'
export default {
    name: 'detail-chart',
    props: {
        data: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            hengsheng: false,
            nasdaq: false
        }
    },
    mounted() {
        // 香港版：策略：#ff7127，恒生指数：#393939，纳斯达克：rgba(57, 57, 57, 0.6)
        // 大陆版：策略：#ff7127，恒生指数：#9fb0ca，纳斯达克：#58687f
        const list = this.data.list
        const strategy = list.return_rate.map(x => 100 * x)
        const hengsheng = list.hk_index ? list.hk_index.map(x => 100 * x) : []
        const nasdaq = list.us_index ? list.us_index.map(x => 100 * x) : []
        const hengshengColor = this.$root.isMainland ? '#9fb0ca' : '#393939'
        const nasdaqColor = this.$root.isMainland
            ? '#58687f'
            : 'rgba(57, 57, 57, 0.6)'
        const options = {
            series: [{ type: 'line', data: strategy }],
            xAxisData: [this.data.start_date, this.data.end_date],
            color: ['#ff7127']
        }
        if (list.strategy_type === 1) {
            options.series.unshift({ type: 'line', data: hengsheng })
            options.series.unshift({ type: 'line', data: nasdaq })
            options.color.unshift(hengshengColor)
            options.color.unshift(nasdaqColor)
            this.hengsheng = true
            this.nasdaq = true
        } else {
            if (list.index_type === 1) {
                options.series.unshift({ type: 'line', data: hengsheng })
                options.color.unshift(hengshengColor)
                this.hengsheng = true
            } else if (list.index_type === 2) {
                options.series.unshift({ type: 'line', data: nasdaq })
                options.color.unshift(nasdaqColor)
                this.nasdaq = true
            }
        }
        if (this.$root.isMainland) {
            options.axisColor = 'rgba(235, 235, 235, 0.2)'
            options.axisValueColor = 'rgba(235, 235, 235, 0.4)'
        }
        new Chart(this.$refs.canvas, options)
    }
}
</script>

<style lang="less" scoped>
.detail-chart {
    padding: 0 18px;
    canvas {
        width: 100%;
        height: 200px;
    }
}
.header {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    margin-bottom: 12px;
    &__name {
        color: rgba(#393939, 0.4);
    }
    &__labels {
        display: flex;
    }
    &__label {
        margin-left: 14px;
        &:before {
            content: '';
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #ff7127;
            margin-right: 3px;
        }
        &.hengsheng:before {
            background: #393939;
        }
        &.nasdaq:before {
            background: rgba(57, 57, 57, 0.6);
        }
    }
}
.is-mainland {
    .detail-chart {
        padding-bottom: 10px;
    }
    .header {
        &__name {
            color: rgba(#ebebeb, 0.4);
        }
        &__label {
            color: #ebebeb;
            &:before {
                background: #ff7127;
            }
            &.hengsheng:before {
                background: #9fb0ca;
            }
            &.nasdaq:before {
                background: #58687f;
            }
        }
    }
}
</style>
