<template lang="pug">
    .share-contain
        van-popup(
            v-model="showShare"
            :position="position"
            :closeable="true"
            @close="closePopup"
            @click-overlay="handleClickOverlay"
        )
            p.title(v-if="title" v-html="title")
            ul
                li(
                v-for="(item,index) in 4"
                :key="index"
                @click="toShare(index)"
                )
                    img(:src="require(`@/assets/img/fund/share/${shareIcon[index]}.png`)")
                    p.way {{shareText[index]}}
</template>

<script>
import { Popup } from 'vant'
import { appType } from '@/utils/html-utils.js'
export default {
    props: {
        value: {},
        title: {
            type: String,
            default: ''
        },
        position: {
            type: String,
            default: 'center'
        }
    },
    components: {
        [Popup.name]: Popup
    },
    data() {
        return {
            shareText: appType.Hk
                ? [
                      'WhatsApp',
                      'Facebook',
                      'WeChat',
                      this.$t(['朋友圈', '朋友圈', 'WeChat Moments'])
                  ]
                : ['微信', '朋友圈', 'QQ', '微博'],
            shareIcon: appType.Hk
                ? [
                      'whatsapp',
                      'facebook',
                      'wechat_friend',
                      'wechat_friends_circle'
                  ]
                : ['wechat', 'pengyouquan', 'qq', 'weibo']
        }
    },
    computed: {
        showShare: {
            get() {
                return this.value
            },
            set(val) {
                this.$emit('input', val)
            }
        }
    },
    methods: {
        handleClickOverlay() {
            this.$emit('clickOverlay')
        },
        toShare(_index) {
            this.$emit('handleShare', _index)
        },
        closePopup() {
            this.$emit('closePopup')
        }
    }
}
</script>

<style lang="scss" scoped>
.share-contain {
    .title {
        text-align: center;
        padding-top: 20px;
    }
    ul {
        display: flex;
        padding-bottom: constant(safe-area-inset-bottom); /* 兼容 iOS < 11.2 */
        padding-bottom: env(safe-area-inset-bottom); /* 兼容 iOS >= 11.2 */
        li {
            flex: 1;
            text-align: center;
            padding: 30px 0 20px;

            img {
                width: 57px;
                height: 57px;
            }
            .way {
                margin-top: 10px;
            }
        }
    }
}
</style>
<style lang="scss">
.share-contain {
    .van-popup {
        width: 80%;
        border-radius: 10px;
    }
}
</style>
