<template lang="pug">
    van-popup.customPicker(
        v-model="popupShow")
        .title {{pickerData.title}}
        ul.options
            li(
                v-for="item,index in pickerData.options" 
                :key="index"
                @click="handleChoose(item)")
                h5 {{item.name}}
                p {{item.description}}
        .cancel(@click="handleCancel") 取消
</template>
<script>
import { Popup } from 'vant'
export default {
    props: {
        value: {
            type: Boolean,
            default: false
        },
        pickerData: {
            type: Object,
            default: () => {}
        }
    },
    components: {
        [Popup.name]: Popup
    },
    computed: {
        popupShow: {
            get() {
                return this.value
            },
            set(val) {
                this.$emit('input', val)
            }
        }
    },
    methods: {
        handleChoose(data) {
            this.popupShow = false
            this.$emit('handleChoose', data)
        },
        handleCancel() {
            this.popupShow = false
        }
    }
}
</script>
<style lang="scss" scoped>
.customPicker {
    width: 335px;
    // max-height: 382px;
    border-radius: 30px;
    text-align: center;
    .title {
        font-size: 12px;
        font-weight: 500;
        color: rgba(57, 57, 57, 0.4);
        line-height: 36px;
    }
    .options {
        li {
            width: 100%;
            padding: 8px 0;
            border-top: 1px solid rgba(121, 121, 121, 0.2);
            h5 {
                font-size: 16px;
                color: rgba(0, 85, 255, 1);
                line-height: 22px;
            }
            p {
                font-size: 12px;
                color: rgba(57, 57, 57, 0.4);
                line-height: 17px;
            }
        }
    }
    .cancel {
        border-top: 1px solid rgba(121, 121, 121, 0.2);
        font-size: 16px;
        color: rgba(57, 57, 57, 0.6);
        line-height: 60px;
    }
}
</style>
