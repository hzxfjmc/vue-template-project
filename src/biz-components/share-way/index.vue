<template lang="pug">
    .share-contain
        yx-popup(
            v-model="showShare"
            position='bottom'
            :overlay-class="overlayClass"
            @click-overlay="handleClickOverlay"
        )
            p.title(v-if="title") {{ title }}
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
export default {
    data() {
        return {
            shareText: ['微信', '朋友圈', 'QQ', '微博'],
            shareIcon: ['wechat', 'pengyouquan', 'qq', 'weibo']
        }
    },
    props: {
        value: {},
        overlayClass: {
            type: String,
            default: ''
        },
        title: {
            type: String,
            default: ''
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
    .yx-popup {
        .van-popup--bottom {
            width: 100%;
            bottom: 0;
            border-radius: 0;
        }
    }
}
</style>
