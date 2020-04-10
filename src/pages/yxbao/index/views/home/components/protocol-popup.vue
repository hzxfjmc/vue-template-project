<template lang="pug">
    yx-popup(
        v-model="popupVisible"
        position="bottom"
        class="protocol-popup"
    )
        .protocol-list
            .protocol-list__body
                .protocol-list__text.border-bottom(@click="openProtocol(item.filePath,item)" 
                v-for="item in protocolFileList" 
                :key="item.createTime") {{$t(item.fileName)}}
            .protocol-list__footer
                .protocol-list__button(@click="hidePopup") {{$t('cancel')}}
</template>

<script>
import './index.scss'
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
        async openProtocol(params, item) {
            let url
            if (item.fileName === 'AboutuMoeny') {
                url = `${window.location.origin}/marketing/template/index.html#/?pageNo=youxinbao`
            } else {
                url = `${window.location.origin}/wealth/yxbao/index.html#/${params}?id=${this.fundId}&displayLocation=3`
            }
            jumpUrl(3, url)
        },
        hidePopup() {
            this.popupVisible = false
        }
    }
}
</script>

<style scoped lang="scss"></style>
