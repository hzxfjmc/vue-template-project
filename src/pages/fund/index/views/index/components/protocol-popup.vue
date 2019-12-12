<template lang="pug">
    yx-popup(
        v-model="popupVisible"
        position="bottom"
        class="protocol-popup"
    )
        .protocol-list
            .protocol__title.border-bottom {{$t('fundName')}}
            .protocol-list__body
                .protocol-list__text.border-bottom(@click="chooseFilePath(item)" 
                v-for="item in protocolFileList" 
                :key="item.createTime") {{item.fileName}}
            .protocol-list__footer
                .protocol-list__button(@click="hidePopup") {{$t('cancel')}}
</template>

<script>
export default {
    name: 'protocol-popup',
    i18n: {
        zhCHS: {
            cancel: '取消',
            fundName: '基金货币选择'
        },
        zhCHT: {
            cancel: '取消',
            fundName: '基金貨幣選擇'
        },
        en: {
            cancel: 'Cancel',
            fundName: 'Fund Currency'
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
        async chooseFilePath(item) {
            this.$emit('chooseFilePath', item)
            this.popupVisible = false
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
    .protocol__title {
        background: #fff;
        line-height: 30px;
        text-align: center;
    }
    background: $background-bottom-color;
    .protocol-list__body {
        .protocol-list__text {
            font-size: 16px;
            line-height: 36px;
            padding: 7px 0;
            text-align: center;
            color: #0091ff;
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
