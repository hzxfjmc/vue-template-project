<template lang="pug">
    .fund-card
        .left
            .rate-num {{ apy }}
            .annualized-returns 近一年收益率
        .right
            h2(:style="h2Style") {{ fundName }}
            .labels 
                .label {{ info.assetType }}
                .label {{ info.fundRisk  }}
            .feature {{ info.feature }}
</template>

<script>
import { Tag } from 'vant'
export default {
    name: 'BondCard',
    components: {
        [Tag.name]: Tag
    },
    props: {
        info: {
            type: Object,
            default: () => {}
        }
    },
    computed: {
        apy() {
            return (this.info && (this.info.apy - 0).toFixed(3) + '%') || '--'
        },
        fundName() {
            return this.info.fundName.length > 12
                ? this.info.fundName.slice(0, 12) + '...'
                : this.info.fundName
        },
        h2Style() {
            // 名称字体变化策略
            let fundName = this.info.fundName || ''
            if (fundName.length > 12) {
                return {
                    fontSize: '0.28rem'
                }
            }
            return {
                fontSize: '0.32rem'
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.fund-card {
    height: 110px;
    margin-top: 10px;
    padding: 15px 12px 22px;
    background-color: $background-color;
    border-radius: 4px;
    display: flex;
    align-items: center;
    .left {
        width: 143px;
        display: flex;
        flex-direction: column;
        .rate-num {
            margin-bottom: 4px;
            color: #ea3d3d;
            font-size: 0.48rem;
            line-height: 31px;
        }
        .annualized-returns {
            font-size: 0.24rem;
            color: $text-color3;
        }
    }
    .right {
        display: flex;
        flex-direction: column;
        h2 {
            overflow: hidden;
            margin-bottom: 6px;
            color: $title-color;
        }
        .feature {
            color: $text-color5;
            font-size: 0.24rem;
        }
        .labels {
            display: flex;
            justify-content: flex-start;
            margin-bottom: 6px;
            .label {
                overflow: hidden;
                color: $hk-text-line-color;
                font-size: 0.2rem;
                line-height: 0.2rem;
                border: 1px solid $hk-text-line-color;
                margin-right: 5px;
                padding: 2px 2px;
                border-radius: 1px;
            }
        }
    }
}
</style>
