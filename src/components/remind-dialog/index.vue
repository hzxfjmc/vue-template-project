<template lang="pug">
    van-dialog.remind-dialog(
    v-model="isShow"
    :confirm-button-text="confirmButtonText"
    :cancel-button-text="cancelButtonText"
    :show-cancel-button="showCancelButton"
    v-on="listeners"
    :class="{'blue-cancel': blueCancel}"
    )
        .title(v-show="title") {{title}}
        .tip(v-show="tip") {{tip}}
        slot
</template>
<script>
export default {
    props: {
        value: {},
        cancelButtonText: {
            type: String,
            default: '取消'
        },
        confirmButtonText: {
            type: String,
            default: '确定'
        },
        title: {
            type: String,
            default: ''
        },
        tip: {
            type: String,
            default: ''
        },
        // 取消按鈕是否是藍色
        blueCancel: {
            type: Boolean,
            default: false
        },
        showCancelButton: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        isShow: {
            get() {
                return this.value
            },
            set(v) {
                this.$emit('input', v)
            }
        },
        listeners() {
            return {
                ...this.$listeners
            }
        }
    }
}
</script>
<style lang="scss">
.van-overlay {
    background-color: rgba(57, 57, 57, 0.2);
}
.remind-dialog {
    border-radius: 20px;
    &.van-dialog {
        width: 323px !important;
    }
    .van-dialog__content {
        padding: 33px 21px;
        word-break: break-word;
        text-align: center;
    }
    .title {
        color: $hk-text-color;
        font-size: 20px;
    }
    .tip {
        color: $hk-text-color5;
        font-size: 16px;
        margin-top: 10px;
    }
    &.blue-cancel {
        .van-dialog__cancel {
            color: $primary-color;
        }
    }
}
</style>
