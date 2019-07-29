<template lang="pug">
    .index-popularity(@click="$emit('goto-stock')")
        .stock
            span.stock__name {{ data.stockName }}
            span.stock__code {{ data.stockCode }}
        .description {{ data.publicizeText }}
        .data
            span {{ data.popularity }}%
            | {{ $t('index.userChoose') }}
        .button(@click.stop="gotoCreate") {{ data.btnText }}
</template>

<script>
export default {
    name: 'index-popularity',
    props: {
        data: {
            type: Object,
            required: true
        }
    },
    methods: {
        gotoCreate() {
            this.$router.push(
                `/edit/${this.data.stockCode}/${this.data.exchangeType}`
            )
        }
    }
}
</script>

<style lang="less" scoped>
.index-popularity {
    position: relative;
    border: 1px solid #ececec;
    border-radius: 8px;
    padding: 14px 14px 16px;
    margin-bottom: 16px;
}
.stock {
    margin-bottom: 3px;
}
.stock__name {
    margin-right: 6px;
    font-size: 16px;
}
.stock__code {
    font-size: 12px;
    color: rgba(#393939, 0.5);
}
.description {
    font-size: 14px;
    color: rgba(#393939, 0.6);
}
.data {
    font-size: 12px;
    margin-top: 15px;
    span {
        color: #fa6112;
        font-size: 26px;
        margin-right: 4px;
    }
}
.button {
    position: absolute;
    right: 10px;
    bottom: 13px;
    color: #fff;
    background: #0055ff;
    border-radius: 4px;
    line-height: 34px;
    height: 34px;
    padding: 0 6px;
    &:active {
        background: rgba(#0055ff, 0.8);
    }
}
</style>
