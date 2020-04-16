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
