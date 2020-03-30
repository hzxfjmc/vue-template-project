<template lang="pug">
    yx-popup(
        v-model="popupVisible"
        position="bottom"
        class="protocol-popup"
    )
        .protocol-list
            .protocol-list__body
                .protocol-list__text.border-bottom(@click="openProtocol(item.filePath)" 
                v-for="item in protocolFileList" 
                :key="item.createTime") {{item.fileName}}
            .protocol-list__footer
                .protocol-list__button(@click="hidePopup") {{$t('cancel')}}
</template>

<script>
import { jumpUrl } from '@/utils/tools.js'
export default {
    name: 'protocol-popup',
    i18n: {
        zhCHS: {
            cancel: '取消'
        },
        zhCHT: {
            cancel: '取消'
        },
        en: {
            cancel: 'Cancel'
        }
    },
    props: {
        value: {
            type: Boolean,
            default: false
        },
        protocolFileList: {
            type: Array,
            default: () => []
        },
        fundId: {
            type: String,
            default: ''
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
        async openProtocol(params) {
            let url = `${window.location.origin}/wealth/yxbao/index.html#/${params}?id=${this.fundId}&displayLocation=3`
            jumpUrl(3, url)
        },
        hidePopup() {
            this.popupVisible = false
        }
    }
}
</script>

<style scoped lang="scss">
.yx-popup.protocol-popup {
    .van-popup--bottom {
        width: 100%;
        top: auto;
        bottom: 0px;
        right: auto;
        border-radius: unset;
    }
}
.protocol-list {
    background: $background-bottom-color;
    .protocol-list__body {
        .protocol-list__text {
            font-size: 16px;
            line-height: 36px;
            padding: 7px 0;
            text-align: center;
            background: #fff;
            &:last-child {
                border-bottom: none;
            }
        }
    }
    .protocol-list__footer {
        .protocol-list__button {
            background: #fff;
            margin-top: 10px;
            font-size: 16px;
            line-height: 36px;
            padding: 7px 0;
            text-align: center;
        }
    }
}
</style>
