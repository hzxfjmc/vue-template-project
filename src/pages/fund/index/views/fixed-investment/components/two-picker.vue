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
            confirm-button-text="确认"
            cancel-button-text="取消"
            :columns="columns")
</template>
<script>
export default {
    props: {
        value: {
            type: Boolean,
            default: false
        },
        protocolFileList: {
            type: Array,
            default: () => []
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
    data() {
        return {
            columns: [
                // 第一列
                {
                    values: ['周一', '周二', '周三', '周四', '周五'],
                    defaultIndex: 2
                },
                // 第二列
                {
                    values: ['上午', '下午', '晚上'],
                    defaultIndex: 1
                }
            ]
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
