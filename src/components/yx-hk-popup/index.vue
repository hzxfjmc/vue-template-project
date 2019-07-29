<template lang="pug">
     van-popup.pop-select-hk(v-model="showSelectPop" v-bind="$attrs")
        .select-title(v-if="title") {{title}}
        .select-wrap(v-for="item, index in list" :key="index" v-if="!item.hide")
            .select-item-tip(v-if="item.tip" @click="checkedClick(item, index)")
                p.select-text {{item.text}}
                p.select-text-tip {{item.tip}}
            .select-item(v-else @click="checkedClick(item, index)") {{item.text}}
        .cancel-button(@click="cancelHandle") {{$t('popupCancelInfo')}}
</template>
<script>
import { Popup } from 'vant'
export default {
    i18n: {
        zhCHS: {
            popupCancelInfo: '取消'
        },
        zhCHT: {
            popupCancelInfo: '取消'
        },
        en: {
            popupCancelInfo: 'Cancel'
        }
    },
    inheritAttrs: false,
    components: {
        [Popup.name]: Popup
    },
    props: {
        list: {
            type: Array,
            default: () => []
        },
        title: {
            type: String,
            default: ''
        },
        value: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        showSelectPop: {
            get() {
                return this.value
            },
            set(val) {
                this.$emit('input', val)
            }
        }
    },
    methods: {
        checkedClick(item, index) {
            let params = { value: item, index }
            this.$emit('checkedHandle', params)
            this.$emit('check-handler-inland', item)
        },
        cancelHandle() {
            this.showSelectPop = false
        }
    }
}
</script>
<style lang="scss" scope>
.pop-select-hk {
    width: 335px;
    margin-bottom: 36px;
    background: rgba(255, 255, 255, 1);
    border-radius: 30px;
    font-family: PingFangHK-Regular;
    font-weight: 400;
    .select-title {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        font-size: 12px;
        font-family: PingFangHK-Medium;
        font-weight: 500;
        color: rgba(57, 57, 57, 0.4);
        line-height: 17px;
        border-bottom: 1px solid rgba(121, 121, 121, 0.2);
        padding: 11px 0 8px 0;
    }
    .select-item {
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: 20px 10px 17px 10px;
        font-size: 16px;
        color: $hk-primary-color;
        line-height: 22px;
        border-bottom: 1px solid rgba(121, 121, 121, 0.2);
    }
    .select-item-tip {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        padding: 9px 10px 8px 10px;
        .select-text {
            font-size: 16px;
            color: $hk-primary-color;
            line-height: 22px;
            text-align: center;
        }
        .select-text-tip {
            font-size: 12px;
            color: rgba(57, 57, 57, 0.4);
            line-height: 17px;
            text-align: center;
        }
        border-bottom: 1px solid rgba(121, 121, 121, 0.2);
    }
    .cancel-button {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        padding: 15px 0 23px 0;
        font-size: 16px;
        color: rgba(57, 57, 57, 0.5);
        line-height: 22px;
    }
}
</style>
