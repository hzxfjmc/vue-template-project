<template lang="pug">
    .pick-daterange.pop(v-show="show" @click="cancelHandler" :style="'top: ' + top + 'px'" :class="{'is-lang-en': isLangEn}")
        .box(@click.stop)
            .section
                .title {{ $t('timeRange') }}
                .tags
                    .tag(
                        v-for="tag in tags"
                        :key="tag.name"
                        :class="{selected: tag.selected}"
                        @click="selectTag(tag)"
                    ) {{ tag.name }}
            .section
                .title {{ $t('customize') }}
                .date-bar
                    input.date(
                        v-model="dateRange.value[0]"
                        type="text"
                        :placeholder="$t('startTime')"
                        readonly="readonly"
                        @click="selectedInput(0, $event)"
                        :class="{selected: selectedInputIndex === 0}"
                    )
                    span.separate {{ $t('to') }}
                    input.date(
                        v-model="dateRange.value[1]"
                        type="text"
                        :placeholder="$t('endTime')"
                        readonly="readonly"
                        @click="selectedInput(1, $event)"
                        :class="{selected: selectedInputIndex === 1}"
                    )
            van-datetime-picker.datepicker(
                v-if="[0, 1].includes(selectedInputIndex)"
                v-model="currentDate"
                :min-date="minDate"
                :max-date="maxDate"
                @change="changeDate"
                type="date"
                :show-toolbar="false"
                :formatter="formatter"
                :visible-item-count="3"
            )
            .button-wrap(v-if="showButton")
                .button(@click="cancelHandler") {{ $t('cancel') }}
                .button.blue(@click="submitHandler") {{ $t('confirm') }}
</template>

<script>
import dayjs from 'dayjs'
import { DatetimePicker } from 'vant'
import config from '../../../0-config'
export default {
    name: 'pick-daterange',
    components: {
        [DatetimePicker.name]: DatetimePicker
    },
    data() {
        return {
            isLangEn: config.isLangEn,
            tags: [
                {
                    name: this.$t('all'),
                    value: [null, null],
                    type: -1, // -1：全部，0：近一个月，1：近三个月，2：近一年，3：今年，9：自定义
                    selected: true
                },
                {
                    name: this.$t('near1month'),
                    value: [
                        dayjs()
                            .subtract(1, 'month')
                            .format('YYYY-MM-DD'),
                        dayjs().format('YYYY-MM-DD')
                    ],
                    type: 0
                },
                {
                    name: this.$t('near3month'),
                    value: [
                        dayjs()
                            .subtract(3, 'month')
                            .format('YYYY-MM-DD'),
                        dayjs().format('YYYY-MM-DD')
                    ],
                    type: 1
                },
                {
                    name: this.$t('near1year'),
                    value: [
                        dayjs()
                            .subtract(1, 'year')
                            .format('YYYY-MM-DD'),
                        dayjs().format('YYYY-MM-DD')
                    ],
                    type: 2
                },
                {
                    name: this.$t('thisYear'),
                    value: [
                        dayjs().format('YYYY-01-01'),
                        dayjs().format('YYYY-MM-DD')
                    ],
                    type: 3
                }
            ],
            selectedInputIndex: null,
            dateRange: {
                value: [
                    dayjs().format('YYYY-MM-DD'),
                    dayjs().format('YYYY-MM-DD')
                ],
                type: 9
            },
            currentDate: null,
            top: 0,
            show: false
        }
    },
    computed: {
        selectedTag() {
            return this.tags.find(tag => tag.selected)
        },
        showButton() {
            return (
                this.selectedTag ||
                ([0, 1].includes(this.selectedInputIndex) &&
                    this.dateRange.value[0] &&
                    this.dateRange.value[1])
            )
        },
        // 日期选择器最小日期限制
        minDate() {
            const minLimit = '2019-01-01'
            const fiveYearsAgo = dayjs()
                .subtract(5, 'year')
                .format('YYYY-MM-DD')
            let minDate = fiveYearsAgo > minLimit ? fiveYearsAgo : minLimit
            if (this.selectedInputIndex === 1 && this.dateRange.value[0]) {
                minDate =
                    this.dateRange.value[0] > minDate
                        ? this.dateRange.value[0]
                        : minDate
            }
            return new Date(minDate)
        },
        // 日期选择器最大日期限制
        maxDate() {
            let maxDate =
                this.selectedInputIndex === 0
                    ? this.dateRange.value[1]
                    : dayjs().format('YYYY-12-31')
            return new Date(maxDate)
        }
    },
    methods: {
        // 选中tag
        selectTag(tag) {
            this.tags.forEach(tag => this.$set(tag, 'selected', false))
            this.selectedInputIndex = null
            this.$set(tag, 'selected', true)
        },
        // 选中input
        selectedInput(index, ev) {
            ev.target.blur()
            this.tags.forEach(tag => this.$set(tag, 'selected', false))
            this.selectedInputIndex = index
            const date = this.dateRange.value[index]
            if (date) {
                this.currentDate = new Date(date)
            }
        },
        // 日期选择器格式化
        formatter(type, value) {
            return this.$t('daterangeFormat', type, value)
        },
        // 日期选择器切换日期
        changeDate(instance) {
            let date = instance
                .getValues()
                .join('')
                .match(/\d+/g)
                .join('-')
            date = dayjs(date).format('YYYY-MM-DD')
            if ([0, 1].includes(this.selectedInputIndex)) {
                this.$set(this.dateRange.value, this.selectedInputIndex, date)
            }
        },
        // 取消
        cancelHandler() {
            this.show = false
            this.$emit('cancel')
        },
        // 提交
        submitHandler() {
            this.show = false
            const isCustom = [0, 1].includes(this.selectedInputIndex)
            const value = isCustom ? this.dateRange : this.selectedTag
            this.$emit('confirm', value)
        }
    }
}
</script>

<style lang="less" scoped>
.date-bar {
    display: flex;
    justify-content: space-between;
}
.date {
    width: 130px;
    height: 36px;
    text-align: center;
    outline: none;
    border: 1px solid rgba(#393939, 0.1);
    border-radius: 4px;
}

@import '../../style/style.less';

.separate {
    line-height: 36px;
}
.datepicker {
    margin-bottom: 30px;
}
.button-wrap {
    display: flex;
    justify-content: space-between;
    margin: 30px 14px;
}
.button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 160px;
    height: 48px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    font-size: 16px;
    color: rgba(#393939, 0.4);
    outline: none;
    &.blue {
        border: none;
        color: #fff;
        background: #0055ff;
        &:active {
            background: #004be0;
        }
    }
}
/*英文版*/
.is-lang-en {
    .tags {
        &:after {
            content: '';
            display: block;
            width: 32%;
        }
    }
    .tag {
        width: 32%;
    }
}
</style>
