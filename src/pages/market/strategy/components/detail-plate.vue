<template lang="pug">
    .detail-plate
        .plate(@click="gotoIntro")
            .left
                .left__title {{ data.strategy_name }}
                .left__tags(v-if="tags.length > 0")
                    .left__tag(v-for="tag in tags" :key="tag") {{ tag }}
            .right
                .right__income {{ data.accureturn_rate | formatRate }}
                .right__subinfo(@click.stop="dialog($t('tipsCumulativeIncome'))")
                    | {{ $t('cumulativeIncome') }}
                    img(src="../../0-images/icon-05.png")
            .plate__info(:class="{arrow: data.introduction_url}") {{ data.strategy_instruction }}
        //.section-title
            | {{ $t('strategyReview') }}
            img(src="../../0-images/icon-03.png" v-if="$root.isHK" @click.stop="dialog($t('tipsWinningProbability'))")
            img(src="../../0-images/icon-04.png" v-else @click.stop="dialog($t('tipsWinningProbability'))")
        //.results
            .result
                .result__name {{ $t('closeIncome', 7) }}
                .result__value(:class="classUpDown(data.return_rate_7days)") {{ data.return_rate_7days | formatRate }}
            .result
                .result__name {{ $t('closeIncome', 30) }}
                .result__value(:class="classUpDown(data.return_rate_30days)") {{ data.return_rate_30days | formatRate }}
            .result
                .result__name {{ $t('winningProbability') }}
                .result__value(:class="classUpDown(data.win_rate)") {{ data.win_rate | formatRate }}
</template>

<script>
import JSBridge from '@/utils/js-bridge'
export default {
    name: 'detail-plate',
    props: {
        data: {
            type: Object,
            required: true
        }
    },
    computed: {
        tags() {
            if (!this.data.strategy_tags) {
                return []
            }
            return this.data.strategy_tags.split(',')
        }
    },
    methods: {
        async gotoIntro() {
            if (this.data.introduction_url) {
                if (JSBridge.isYouxinApp) {
                    await JSBridge.callApp('command_set_titlebar_button', {
                        type: 'hide',
                        position: 2,
                        text: '',
                        clickCallback: ''
                    })
                }
                location.href = this.data.introduction_url
            }
        },
        dialog(message) {
            // 埋点
            this.$buryingPoint({
                view_name: '符号',
                info_source: this.data.strategy_name,
                stock_id: ''
            })
            this.$dialog({
                message,
                confirmButtonText: this.$t('confirm')
            })
        },
        classUpDown(val) {
            const value = parseFloat(val)
            if (isNaN(value)) {
                return ''
            }
            if (value > 0) {
                return 'up'
            }
            if (value < 0) {
                return 'down'
            }
            return ''
        }
    }
}
</script>

<style lang="less" scoped>
.plate {
    position: relative;
    margin: 14px 18px 30px;
    padding: 16px 14px 14px;
    color: #fff;
    background: #6e9dff;
    border-radius: 10px;
    box-shadow: rgba(#9cbbe5, 0.5) 0 3px 6px;
}
.left {
    max-width: 200px;
    &__title {
        font-size: 18px;
        line-height: 25px;
        margin-bottom: 6px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    &__tag {
        display: inline-block;
        font-size: 12px;
        line-height: 18px;
        padding: 0 3px;
        border: 1px solid rgba(#fff, 0.2);
        border-radius: 2px;
        margin: 0 6px 4px 0;
    }
}
.right {
    position: absolute;
    top: 12px;
    right: 14px;
    text-align: right;
}
.right__income {
    font-size: 25px;
    margin-bottom: 2px;
}
.right__subinfo {
    font-size: 12px;
    line-height: 18px;
    color: rgba(#fff, 0.6);
    img {
        width: 15px;
        height: 15px;
        margin-left: 5px;
        position: relative;
        top: 2px;
    }
}
.plate__info {
    font-size: 12px;
    padding: 14px 0;
    color: rgba(#fff, 0.6);
    &.arrow {
        position: relative;
        padding-right: 20px;
        &:after {
            content: '';
            position: absolute;
            width: 15px;
            height: 15px;
            background-image: url(../../0-images/arrow-05.png);
            background-size: 15px;
            background-repeat: no-repeat;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            margin-top: 1px;
        }
    }
}
.results {
    display: flex;
    margin: 14px 18px 10px;
    justify-content: space-between;
    color: #393939;
}
.result {
    text-align: center;
    &:first-child {
        text-align: left;
    }
    &:last-child {
        text-align: right;
    }
}
.result__name {
    font-size: 12px;
    img {
        width: 15px;
        height: 15px;
        margin-left: 5px;
        vertical-align: middle;
    }
}
.result__value {
    font-size: 18px;
}
.section-title {
    img {
        float: right;
        width: 15px;
        height: 15px;
        margin-top: 9px;
    }
}
/*大陆版*/
.is-mainland {
    .detail-plate {
        &:after {
            content: '';
            display: block;
            height: 10px;
            background: #0a0f19;
            margin-bottom: 8px;
        }
    }
    .plate {
        box-shadow: none;
        background: #2f79ff;
    }
    .results {
        color: #fff;
    }
}
</style>
