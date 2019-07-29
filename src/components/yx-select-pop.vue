<template lang="pug">
    vue-popper(
        trigger="click"
        :append-to-body="true"
        :options="popperOptions"
        ref="popper"
        class="select-pop"
    )
        ul.select-list(:style="{marginLeft: marginLeft + 'px'}")
            li.select-item(v-for="item in options" :key="item.value" :class="{cue: item.value === value}" @click="select(item)") {{ item.label }}
        span.label(slot="reference") {{ currLabel }}
</template>

<script>
import VuePopper from 'vue-popperjs'

// 弹出框选择器
export default {
    name: 'yxSelectPop',
    model: {
        prop: 'value',
        event: 'input'
    },
    data() {
        const _this = this
        return {
            popperOptions: {
                placement: 'bottom',
                modifiers: {
                    offset: { offset: '-50%,10px' },
                    applyStyle: {
                        onLoad(reference, popper) {
                            popper.parentElement.style.position = 'fixed'
                            popper.parentElement.style.zIndex = '100'
                            popper.parentElement.style.left = '0'
                            popper.parentElement.style.top = '0'
                            popper.parentElement.style.right = '0'
                            popper.parentElement.style.bottom = '0'
                            popper.parentElement.style.backgroundColor =
                                'rgba(11, 18, 31, 0.7)'
                            popper.parentElement.onclick = () =>
                                _this.$refs.popper.doClose()
                        }
                    }
                }
            }
        }
    },
    props: {
        // 当前选中的值，v-model使用
        value: {
            default: null
        },
        // 下拉列表，例：[{value: 1, label: '已发货'}]
        options: {
            type: Array,
            required: true
        },
        // 左边距，在超出屏幕时，可进行调整
        marginLeft: {
            type: Number,
            default: -47
        }
    },
    computed: {
        currLabel() {
            const index = this.options
                .map(item => item.value)
                .indexOf(this.value)
            return index > -1 ? this.options[index].label : ''
        }
    },
    methods: {
        select(item) {
            this.$refs.popper.doClose()
            // v-model修改value字段
            this.$emit('input', item.value)
        }
    },
    components: {
        VuePopper
    }
}
</script>

<style lang="scss" scoped>
.label {
    position: relative;
    display: inline-block;
    line-height: 100%;
    padding-right: 15px;
    &:after {
        content: '';
        position: absolute;
        right: 0;
        top: 5px;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 5px solid #9fb0ca;
    }
}
.select-list {
    min-width: 93px;
    background: #10192a;
    text-align: center;
    border-radius: 4px;
    .select-item {
        font-size: 14px;
        line-height: 20px;
        padding: 12px 0;
        margin: 0 5px;
        color: #9fb0ca;
        &.cue {
            color: #ebebeb;
        }
        & + .select-item {
            border-top: 1px solid #182234;
        }
    }
    &:after {
        content: '';
        position: absolute;
        top: -5px;
        left: 50%;
        margin-left: -6px;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-bottom: 6px solid #10192a;
    }
}
</style>
