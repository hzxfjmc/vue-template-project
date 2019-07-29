<template lang="pug">
Popup.action-sheet(
    v-model="show" 
    position="bottom")
    .as-title.text-color5 {{title}}
    .action-list
        .list-item(v-for='item in actionList' @click="item.action") {{item.text}}
    .cancel(@click="show = false") 取消
</template>

<script>
import { Popup } from 'vant'
export default {
    components: {
        Popup
    },
    computed: {
        show: {
            get() {
                return this.value
            },
            set(val) {
                this.$emit('input', val)
            }
        }
    },
    props: {
        value: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: '请选择联系客服方式'
        },
        actionList: {
            type: Array,
            default: () => {
                return []
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.action-sheet {
    text-align: center;
    background-color: #f1f3f8;
    .as-title {
        width: 100%;
        height: 32px;
        background: rgba(241, 243, 248, 1);
        line-height: 32px;
    }
    .cancel,
    .action-list .list-item {
        background-color: #fff;
        height: 48px;
        line-height: 48px;
        border-bottom: 1px solid #eeeeee;
    }
    .list-item:last-child() {
        border-bottom: none;
    }
    .cancel {
        margin-top: 10px;
    }
    .action-list {
    }
}
</style>
