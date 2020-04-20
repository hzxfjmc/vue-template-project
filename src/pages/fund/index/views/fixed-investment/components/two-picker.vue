<template lang="pug">
.block--picker--wrapper
    yx-popup(
        v-model="popupVisible"
        position="bottom"
        class="protocol-popup"
    )
        van-picker(
            show-toolbar 
            title="标题" 
            :value="monthDay"
            confirm-button-text="确认"
            cancel-button-text="取消"
            @change="onChange"
            @confirm="confirm"
            @cancel = "cancel"
            :columns="columns")
</template>
<script>
import { MonthDay } from './map'
export default {
    props: {
        value: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            monthDay: '',
            columns: [
                { values: Object.keys(MonthDay) },
                { values: MonthDay['每周'] }
            ]
        }
    },
    computed: {
        popupVisible: {
            get() {
                return this.value
            },
            set(val) {
                this.$emit('input', val)
            }
        }
    },
    methods: {
        cancel() {
            this.popupVisible = false
        },
        confirm(val) {
            let fixedCycleType = {}
            fixedCycleType.key = val
            fixedCycleType.type = val[0] === '每周' ? 1 : 2
            let month = MonthDay['每月'].findIndex(item => {
                return item == val[1]
            })
            let week = MonthDay['每周'].findIndex(item => {
                return item == val[1]
            })
            fixedCycleType.value =
                val[0] === '每周' ? week + 1 : month == 28 ? 0 : month + 1
            this.$emit('handlerFixedCycleType', fixedCycleType)
            this.popupVisible = false
        },
        onChange(picker, values) {
            picker.setColumnValues(1, MonthDay[values[0]])
        }
    }
}
</script>
<style lang="scss" scoped>
.block--picker--wrapper {
    position: fixed;
    width: 100%;
    bottom: 0;
}
</style>
