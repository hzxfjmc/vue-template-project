<template lang="pug">
    .message-panel(@click="gotoDetail")
        .time {{time}}
        .panel
            .title.overflow-ellipsis-2 {{title}}
            .thumb(v-if="imgUrl")
                .inner(:style="{'background-image': `url(${imgUrl})`}")
            .content {{content | parseHtml}}
            .footer.clear-fix(v-if="jumpParams.canJump")
                .pull-left {{$t('list.see_detail')}}
                .pull-right >
</template>

<script>
import mixins from '../mixins'

// 精选活动面板
export default {
    name: 'message-panel',
    mixins: [mixins],
    props: {
        time: {
            type: String,
            default: ''
        },
        title: {
            type: String,
            default: ''
        },
        content: {
            type: String,
            default: ''
        },
        imgUrl: {
            type: String,
            default: ''
        },
        jumpParams: {
            type: Object,
            default: () => {
                return {
                    canJump: 0, // 1可跳转，0不可跳转
                    jumpType: undefined, // 1app页面，2 web url跳转
                    jumpPage: undefined, // web url
                    jumpApp: undefined // app url(http://szwiki.youxin.com/pages/viewpage.action?pageId=1116777)
                }
            }
        }
    },
    methods: {
        /**
         * 跳转到详情页面
         */
        gotoDetail() {
            const toastText = 'The url is null!'

            if (!this.jumpParams.canJump) return

            if (+this.jumpParams.jumpType === 1) {
                if (this.jumpParams.jumpApp)
                    this.$jsBridge.gotoNativeModule(this.jumpParams.jumpApp)
                else this.$toast(toastText)
            } else if (+this.jumpParams.jumpType === 2) {
                if (this.jumpParams.jumpPage) {
                    if (
                        /^yxzq_goto:\/\/webview/.test(
                            this.jumpParams.jumpPage.trim()
                        )
                    ) {
                        this.$jsBridge.gotoNativeModule(
                            this.jumpParams.jumpPage
                        )
                    } else {
                        this.$jsBridge.gotoNewWebview(
                            decodeURIComponent(this.jumpParams.jumpPage)
                        )
                    }
                } else this.$toast(toastText)
            } else {
                this.$toast('Unknown type address')
            }
        }
    }
}
</script>

<style scoped lang="scss">
@import '../../0-style/mixin';
.message-panel {
    margin: 0 18px;

    .time {
        padding: 20px 0 10px;
        text-align: center;
        font-size: 14px;
        font-weight: 400;
        color: rgba(57, 57, 57, 0.6);
        line-height: 18px;
    }

    .panel {
        padding: 20px 14px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0 3px 4px 0 rgba(75, 75, 75, 0.03);
        border-radius: 10px;
        border: 1px solid rgba(247, 247, 247, 1);

        .title {
            margin-bottom: 10px;
            font-size: 18px;
            font-weight: 400;
            color: rgba(57, 57, 57, 1);
            line-height: 25px;
        }

        .thumb {
            @include thumb(311, 120);
            margin-bottom: 10px;

            .inner {
                background: no-repeat top center;
                background-size: cover;
            }
        }

        .content {
            font-size: 14px;
            font-weight: 400;
            color: rgba(57, 57, 57, 0.6);
            line-height: 20px;
            word-break: break-all;
            @include overflow-ellipsis(3);
        }

        .footer {
            padding-top: 10px;
            margin-top: 14px;
            border-top: 1px solid rgba(57, 57, 57, 0.09);
            font-size: 14px;
            font-weight: 400;
            color: rgba(57, 57, 57, 0.4);
            line-height: 20px;
        }
    }
}
</style>
