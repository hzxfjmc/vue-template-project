<template lang="pug">
  .notify-container(v-if="msgList.length ")
    .left-item
        img(src="/webapp/open-account/open-account/deposit/icon_notice@2x.png")
    .swiper-container(v-if="flag")
        .swiper-wrapper
            .swiper-slide(v-for="(item,index) in msgList")
                .content-box(@click="clickResult(item)") {{item.Content}}
                .icon-box(v-if="item.CustomContent && [2,3].includes(item.CustomContent.clickResult)")
                    i.iconfont.icon-back
                .icon-box(v-if="item.CustomContent && item.CustomContent.clickClose === 1")
                    i.iconfont.icon-error(@click="closeMsg(item,index)")
</template>

<script>
import httpRequest from '@/utils/http-request'
import jsBridge from '@/utils/js-bridge.js'
import { API_BASE_URL } from '@/utils/DOMAIN.js'
import 'swiper/dist/css/swiper.css'
import { mapGetters } from 'vuex'
import Swiper from 'swiper'
const axios = new httpRequest(API_BASE_URL.HZ)
export default {
    props: ['url', 'method'],
    data() {
        return {
            msgList: [],
            flag: true
        }
    },
    computed: {
        ...mapGetters([`user`])
    },
    methods: {
        // 点击效果
        clickResult(item) {
            let result = item.CustomContent && item.CustomContent.clickResult // 1-纯文本展示 2-点击后弹窗提示 3-跳转页面
            if ([2, 3].includes(result)) {
                switch (result) {
                    case 2:
                        if (!item.CustomContent.resultSupplement) return false
                        this.$alert({
                            message: item.CustomContent.resultSupplement,
                            confirmButtonText: '我知道了'
                        }).then(() => {
                            this.markMsg(item.MsgId)
                        })
                        break
                    case 3:
                        if (!item.CustomContent.jumpPageUrl) return false
                        jsBridge.gotoNativeModule(
                            `yxzq_goto://webview?url=${item.CustomContent.jumpPageUrl}`
                        )
                        break
                }
            }
        },
        // 删除消息
        closeMsg(item, index) {
            this.flag = false
            this.$nextTick(async () => {
                this.flag = true
                this.msgList.splice(index, 1)
                await this.$nextTick()
                this.initSwiper()
            })
            this.markMsg(item.MsgId)
        },
        // 获取消息
        async getNoteMsg(params) {
            try {
                let config = {
                    headers: {
                        'X-Uid': this.user.userId || this.$constant.userId
                    }
                }
                let data = await axios.get(
                    this.method || `/message-center/api/v1/getnotemsg`,
                    params,
                    config
                )
                if (data && data.list) {
                    data.list.forEach(item => {
                        if (item.CustomContent) {
                            item.CustomContent = JSON.parse(item.CustomContent)
                        }
                    })
                }
                this.msgList = data.list || []
                this.$nextTick(() => {
                    this.initSwiper()
                })
            } catch (e) {
                console.log(e)
                //this.$toast(e.msg)
            }
        },
        // 标记已读
        markMsg(msgId) {
            if (!msgId) return false
            let config = {
                headers: {
                    'X-Uid': this.user.userId || this.$constant.userId
                }
            }
            let params = {
                msgid: msgId
            }
            axios.put(
                `/message-center/api/v1/msgoper/markmsg?msgid=${msgId}`,
                params,
                config
            )
        },
        // 轮播初始化
        initSwiper() {
            if (this.msgList.length < 1) return false
            new Swiper('.swiper-container', {
                direction: 'vertical', // 垂直切换选项
                loop: true, // 循环模式选项
                speed: 1000,
                autoplay: {
                    delay: 3000
                }
            })
        }
    },
    created() {
        let params = {
            url: this.url || location.href
        }
        this.getNoteMsg(params)
    },
    beforeDestroy() {
        this.msgList = []
    }
}
</script>

<style scoped lang="scss">
.swiper-slide {
    display: -webkit-flex;
    display: flex;
}
.content-box {
    color: rgba(235, 235, 235, 1);
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    flex-grow: 1;
    min-width: 300px;
}
.icon-box {
    margin-right: 2px;
    transform: rotate(180deg) scale(0.7);
    color: #fff;
}
.notify-container {
    display: -webkit-flex;
    display: flex;
    justify-content: flex-start;
    height: 32px;
    line-height: 32px;
    background: rgba(60, 120, 250, 0.8029000000000001);
    .left-item {
        padding: 10px 8px 0 10px;
        text-align: center;
        img {
            width: 15px;
            height: 12px;
        }
    }
    .right-item {
        padding-right: 5px;
        text-align: center;
    }
}
</style>
