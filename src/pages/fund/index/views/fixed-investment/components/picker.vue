<template lang="pug">
    yx-popup(
        v-model="popupVisible"
        position="bottom"
        class="protocol-popup"
    )
        .protocol-wrapper
            .protocol-list__header.border-bottom
                .protocol--block--left 请选择转账账户
                .protocol--block--right(@click="hidePopup") 取消
                //- .protocol-list__button(@click="hidePopup") {{$t('cancel')}}
            .protocol-list__body
                .protocol-list--item
                    .list--left.iconfont.icon-unchecked
                    .list--right
                        p.title uSMART证券账户
                        p.desc 请保证扣款日当天证券账户中有足够资金
                            em 点此修改
                .protocol-list--item
                    .list--left.iconfont.icon-unchecked
                    .list--right
                        p.title uSMART证券账户
                        p.desc 请保证扣款日当天证券账户中有足够资金
                        p.desc 请保证扣款日当天证券账户中有足够资金
                .protocol-list--item.footer--add
                    .list--left.iconfont.icon-add
                    .list--right
                        p.title 新增银行账户(EDDA)
</template>

<script>
import jsBridge from '@/utils/js-bridge.js'
import { getCosUrl } from '@/utils/cos-utils'
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
        async openProtocol(url) {
            url = await getCosUrl(url)
            if (jsBridge.isYouxinApp) {
                jsBridge.gotoNewWebview(url)
            } else {
                location.href = url
            }
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
.protocol-list__header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    line-height: 40px;
    padding: 0 20px;
}
.protocol-list--item {
    display: flex;
    flex-direction: row;
    padding: 12px 12px;
    align-items: center;
    .list--left {
        font-size: 20px;
    }
    .list--right {
        margin: 0 0 0 6px;
        .desc {
            color: rgba(25, 25, 25, 0.65);
            font-size: 12px;
            em {
                color: #2f79ff;
                font-style: normal;
                margin: 0 0 0 6px;
            }
        }
    }
}
.footer--add {
    margin: 0 0 20px 0;
}
</style>
