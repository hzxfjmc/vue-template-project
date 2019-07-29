<template lang="pug">
    .index-bluechip(@click="$emit('goto-stock')")
        .header
            .stock
                .stock__name {{ data.stockName }}
                .stock__code {{ data.stockCode }}
            .trend
                .trend__value(:class="{up: data.stockDetail.pctchng > 0, down: data.stockDetail.pctchng < 0, reverse: $root.stockColorType === '2'}")
                    | {{ data.stockDetail.pctchng | formatChg }}
                .trend__tips {{ $t('index.nearTrend', data.showTextValue) }}
        canvas.canvas(v-if="data.stockDetail.list" ref="canvas" height="50")
        .button(@click.stop="gotoCreate") {{ data.btnText }}
</template>

<script>
export default {
    name: 'index-bluechip',
    mounted() {
        // this.initChart([1430, 500, 752, 543, 970, 1000, 1141, 500, 424, 1170, 970, 1230])
        if (
            this.data.stockDetail.list &&
            this.data.stockDetail.list.length > 0
        ) {
            this.initChart(this.data.stockDetail.list.map(item => item.close))
        }
    },
    props: {
        data: {
            type: Object,
            required: true
        }
    },
    methods: {
        initChart(data) {
            const canvas = this.$refs.canvas
            const ctx = canvas.getContext('2d')
            const dpi = window.devicePixelRatio || 1

            const {
                width: cssWidth,
                height: cssHeight
            } = canvas.getBoundingClientRect()
            canvas.width = cssWidth * dpi
            canvas.height = cssHeight * dpi
            const width = canvas.width
            const height = canvas.height

            const topPadding = 20 * dpi
            const leftPadding = 0
            const rightPadding = 0
            const bottomPadding = 5 * dpi
            const dataLength = data.length
            const xLength =
                (width - leftPadding - rightPadding) / (dataLength - 1)
            const max = Math.max.apply(null, data)
            const min = Math.min.apply(null, data)
            const yLength = (height - topPadding - bottomPadding) / (max - min)
            // 清除重繪
            ctx.clearRect(0, 0, width, height)
            ctx.setLineDash([])
            ctx.strokeStyle = '#00c087'
            ctx.fillStyle = '#00c087'
            const list = []
            data.forEach((item, i) => {
                list[i] = {}
                list[i].left = leftPadding + xLength * i
                list[i].top = isFinite(yLength)
                    ? height - bottomPadding - (item - min) * yLength
                    : (height - bottomPadding - topPadding) / 2 + topPadding
                ctx.beginPath()
                if (i !== 0) {
                    ctx.moveTo(list[i].left, list[i].top)
                    ctx.lineTo(list[i - 1].left, list[i - 1].top)
                }
                ctx.stroke()
            })

            // 畫虛線
            ctx.beginPath()
            ctx.setLineDash([5, 10])
            ctx.moveTo(0, height - bottomPadding)
            ctx.lineTo(width, height - bottomPadding)
            ctx.stroke()
        },
        gotoCreate() {
            this.$router.push(
                `/edit/${this.data.stockCode}/${this.data.exchangeType}`
            )
        }
    },
    filters: {
        formatChg(val) {
            const sign = val > 0 ? '+' : ''
            return sign + val + '%'
        }
    }
}
</script>

<style lang="scss" scoped>
.index-bluechip {
    border: 1px solid #ececec;
    border-radius: 8px;
    padding: 14px 14px 20px;
    margin-bottom: 16px;
}
.header {
    display: flex;
    justify-content: space-between;
}
.stock__name {
    font-size: 16px;
    margin: 5px 0 3px;
}
.stock__code {
    font-size: 12px;
    color: rgba(#393939, 0.5);
}
.trend {
    text-align: right;
}
.trend__value {
    font-size: 24px;
    line-height: 32px;
    color: rgba(#393939, 0.6);
    &.up {
        color: #e72653;
    }
    &.down {
        color: #00c58d;
    }
    &.reverse {
        &.up {
            color: #00c58d;
        }
        &.down {
            color: #e72653;
        }
    }
}
.trend__tips {
    font-size: 12px;
    color: rgba(#393939, 0.5);
}
.canvas {
    width: 100%;
    height: 100px;
}
.button {
    text-align: center;
    width: 225px;
    height: 40px;
    font-size: 14px;
    line-height: 40px;
    color: #fff;
    border-radius: 4px;
    background: #0055ff;
    margin: 10px auto 0;
    &:active {
        background: rgba(#0055ff, 0.8);
    }
}
</style>
