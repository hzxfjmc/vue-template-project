<template lang="pug">
.block--picker--wrapper
    yx-popup(
        v-model="popupVisible"
        position="bottom"
        class="protocol-popup"
    )
        van-picker(
            show-toolbar 
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
import { mapGetters } from 'vuex'
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
            columns: [],
            MonthKeyValue: [],
            weekly: this.$t(['每周', '每週', 'Weekly']),
            Monthly: this.$t(['每月', '每月', 'Monthly'])
        }
    },
    computed: {
        ...mapGetters(['lang']),
        popupVisible: {
            get() {
                return this.value
            },
            set(val) {
                this.$emit('input', val)
            }
        }
    },
    created() {
        this.MonthKeyValue = MonthDay[this.lang]
        this.columns = [
            { values: Object.keys(this.MonthKeyValue) },
            { values: this.MonthKeyValue[this.weekly] }
        ]
    },
    methods: {
        cancel() {
            this.popupVisible = false
        },
        confirm(val) {
            let fixedCycleType = {}
            fixedCycleType.key = val
            fixedCycleType.type = val[0] === this.weekly ? 1 : 2
            let month = this.MonthKeyValue[this.Monthly].findIndex(item => {
                return item == val[1]
            })
            let week = this.MonthKeyValue[this.weekly].findIndex(item => {
                return item == val[1]
            })
            fixedCycleType.value =
                val[0] === this.weekly ? week + 1 : month == 28 ? 0 : month + 1
            this.$emit('handlerFixedCycleType', fixedCycleType)
            this.popupVisible = false
        },
        onChange(picker, values) {
            picker.setColumnValues(1, this.MonthKeyValue[values[0]])
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
