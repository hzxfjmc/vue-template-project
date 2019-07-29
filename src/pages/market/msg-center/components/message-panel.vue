<template lang="pug">
    .message-panel(@click="gotoDetail")
        .time {{time}}
        .panel
            .title.overflow-ellipsis-2 {{title}}
            .content(v-html='parseContent' @click="jumpNativePage")
            .footer.clear-fix(v-if="jumpParams.canJump")
                .pull-left {{$t('list.see_detail')}}
                .pull-right >
</template>

<script>
// 系统公告、业务提醒面板
export default {
    name: 'message-panel',
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
    computed: {
        // 解析富文本内容中的a标签
        parseContent() {
            const container = document.createElement('div')

            container.innerHTML = this.content
            Array.from(container.getElementsByTagName('a')).forEach(a => {
                if (!a.getAttribute('data-href')) {
                    const split_refer = 'yxzq_goto://'
                    let href = a.href
                    let arr = href.split(split_refer)
                    if (href.indexOf(split_refer) > -1 && arr.length) {
                        href = `${split_refer}${arr[1]}`
                    }
                    a.setAttribute('data-href', href)
                }
                a.removeAttribute('href')
            })

            return container.innerHTML
        }
    },
    methods: {
        /**
         * 跳转到原生页面
         * @param e
         */
        jumpNativePage(e) {
            const target = e.target
            const tagName = target.tagName
            const href = target.getAttribute('data-href')
            if (href && tagName === 'A') {
                e.stopPropagation()
                try {
                    if (/^yxzq_goto:\/\//.test(href.trim())) {
                        this.$jsBridge.gotoNativeModule(href)
                    } else {
                        this.$jsBridge.gotoNewWebview(decodeURIComponent(href))
                    }
                } catch (e) {
                    this.$toast(`jump to ${href ? href : 'null'} fail!`)
                }
            }
        },
        /**
         * 跳转到详情页面
         */
        gotoDetail() {
            const toastText = 'The url is null!'

            if (!this.jumpParams.canJump) return

            if (+this.jumpParams.jumpType === 1) {
                if (this.jumpParams.jumpApp) {
                    this.$jsBridge.gotoNativeModule(this.jumpParams.jumpApp)
                } else this.$toast(toastText)
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

        .title {
            margin-bottom: 10px;
            font-size: 18px;
            font-weight: 400;
            color: rgba(57, 57, 57, 1);
            line-height: 25px;
        }

        .content {
            font-size: 14px;
            font-weight: 400;
            color: rgba(57, 57, 57, 0.6);
            line-height: 20px;
            word-break: break-all;

            /deep/ a {
                color: #0121dc;
            }
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
