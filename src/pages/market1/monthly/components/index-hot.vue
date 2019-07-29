<template lang="pug">
    .index-hot(@click="$emit('goto-stock')")
        .name {{ data.stockName }}
        .decription {{ data.publicizeText }}
        .tags(v-if="data.labelList && data.labelList.length > 0")
            .tag(v-for="item in data.labelList") {{ item.name }}
        template(v-if="data.showTextType === 1")
            .change(:class="{up: data.showTextValue > 0, down: data.showTextValue < 0, reverse: $root.stockColorType === '2'}")
                | {{ data.showTextValue | formatChg }}
            .change-tips {{ $t('index.nearChg', data.monthCount) }}
        template(v-else)
            .change {{ data.showTextValue }}
            .change-tips {{ data.showTextTitle }}
        .button(@click.stop="gotoCreate") {{ data.btnText }}
</template>

<script>
export default {
    name: 'index-hot',
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
    },
    filters: {
        formatChg(val) {
            const sign = val > 0 ? '+' : ''
            return sign + val + '%'
        }
    }
}
</script>

<style lang="less" scoped>
.index-hot {
    border: 1px solid #ececec;
    border-radius: 8px;
    text-align: center;
    padding: 12px 14px 13px;
    margin-bottom: 16px;
}
.name {
    font-size: 20px;
}
.decription {
    font-size: 12px;
    color: rgba(#393939, 0.4);
}
.tags {
    margin: 7px 0 5px;
}
.tag {
    display: inline-block;
    font-size: 12px;
    line-height: 22px;
    border-radius: 11px;
    padding: 0 11px;
    color: #0055ff;
    background: rgba(#0055ff, 0.05);
    margin-bottom: 5px;
    + .tag {
        margin-left: 12px;
    }
}
.change {
    font-size: 28px;
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
.change-tips {
    font-size: 12px;
    color: rgba(#393939, 0.4);
    margin-bottom: 10px;
}
.button {
    width: 225px;
    height: 40px;
    font-size: 14px;
    line-height: 40px;
    color: #fff;
    border-radius: 4px;
    background: #0055ff;
    margin: 0 auto;
    &:active {
        background: rgba(#0055ff, 0.8);
    }
}
</style>
