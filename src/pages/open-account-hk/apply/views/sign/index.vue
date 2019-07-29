<template lang="pug">
  .sign-draw-content(ref='signBox')
    .sign-canvas(id='canvasBox')
      .sign-canvas-content
        .canvas-bottom(id='top')
          .canvas-button-left
            van-button.button-rotate.cancel(@click='canvasShow' plain  type="default") {{$t('backInfo')}}
          .canvas-button-right
            van-button.button-rotate(@click='reset' plain  type="default") {{$t('clearInfo')}}
            van-button.button-rotate.submit(@click='confirmHandler' :disabled="lastX === -1" type="primary") {{$t('sureInfo')}}
        .canvas-box
            .sign-tips(@touchmove="onTouchMove" @touchstart="onTouchStart" @touchend="onTouchEnd" v-if="lastX === -1")
                p {{$t('handleWrite')}}
            canvas(ref="sign" @touchmove="onTouchMove" @touchstart="onTouchStart" @touchend="onTouchEnd")
            canvas(ref="rotate" v-show="false")
</template>

<script>
import {
    addHKCustomerSign,
    getHKOpenAccountInfo
} from '@/service/user-account-server-hk.js'
import uploadMix from '@/biz-components/upload/upload-file.js'
export default {
    i18n: {
        zhCHS: {
            backInfo: '返回',
            clearInfo: '清空',
            sureInfo: '确定',
            handleWrite: '请在区域内手写签名，和开户姓名保持一致',
            submitSuccess: '提交成功'
        },
        zhCHT: {
            backInfo: '返回',
            clearInfo: '清空',
            sureInfo: '確定',
            handleWrite: '請在區域內手寫簽名，和開戶姓名保持一致',
            submitSuccess: '提交成功'
        },
        en: {
            backInfo: 'Back',
            clearInfo: 'Clear',
            sureInfo: 'Confirm',
            handleWrite: 'Sign your name (as written on your ID / Passport)',
            submitSuccess: 'Submit successfully'
        }
    },
    mixins: [uploadMix],
    data() {
        return {
            lastX: -1,
            lastY: -1,
            ctx: {},
            offsetTop: 0,
            offsetLeft: 0,
            canvas: {},
            signShow: true,
            xyArray: [],
            openAccountStatus: 0
        }
    },
    mounted() {
        this.getUserOpenAccountInfo()
        this.init()
    },
    computed: {
        userId() {
            return this.$store.getters.user.userId
        }
    },
    methods: {
        async getUserOpenAccountInfo() {
            let { openAccountStatus } = await getHKOpenAccountInfo()
            this.openAccountStatus = openAccountStatus
        },
        initCanvasByArray(arr) {
            this.ctx.beginPath()
            this.ctx.lineWidth = 2
            this.ctx.lineCap = 'round'
            this.ctx.strokeStyle = '#353547'
            arr.forEach(item => {
                this.lastX = item.x
                this.lastY = item.y
                this.ctx.lineTo(
                    this.lastX - this.offsetLeft,
                    this.lastY - this.offsetTop
                ) // 不画线
                this.ctx.lineTo(
                    item.x - this.offsetLeft,
                    item.y - this.offsetTop
                ) // 画线
            })
            this.ctx.stroke()
        },
        init() {
            this.$nextTick(() => {
                this.initDraw()
                this.xyArray = this.$LS.get(`${this.userId}xyArray`) || []
                this.xyArray.forEach(item => {
                    this.initCanvasByArray(item)
                })
            })
            this.$nextTick(() => {
                this.$refs.signBox.addEventListener(
                    'touchmove',
                    this.preventDefault,
                    true
                ) // 禁用滚动
            })
        },
        preventDefault(e) {
            e.preventDefault()
        },
        canvasShow() {
            this.$router.push('/step/5')
        },
        onTouchMove(e) {
            this.drawLine(e.changedTouches[0])
            this.lastX = e.changedTouches[0].pageX
            this.lastY = e.changedTouches[0].pageY
            this.xyArray[this.xyArray.length - 1].push({
                x: e.changedTouches[0].pageX,
                y: e.changedTouches[0].pageY
            })
            this.$LS.put(`${this.userId}xyArray`, this.xyArray)
            e.stopPropagation()
        },
        onTouchStart(e) {
            this.lastX = e.changedTouches[0].pageX
            this.lastY = e.changedTouches[0].pageY
            this.xyArray[this.xyArray.length] = []
            this.xyArray[this.xyArray.length - 1].push({
                x: e.changedTouches[0].pageX,
                y: e.changedTouches[0].pageY
            })
        },
        onTouchEnd(e) {
            this.drawLine(e.changedTouches[0])
        },
        drawLine(touches) {
            this.ctx.beginPath()
            this.ctx.lineWidth = 2
            this.ctx.lineCap = 'round'
            this.ctx.strokeStyle = '#353547'
            this.ctx.lineTo(
                this.lastX - this.offsetLeft,
                this.lastY - this.offsetTop
            ) // 不画线
            this.ctx.lineTo(
                touches.pageX - this.offsetLeft,
                touches.pageY - this.offsetTop
            ) // 画线
            this.ctx.stroke()
        },
        reset() {
            this.lastX = -1 // 清空初始化
            this.lastY = -1
            this.ctx.fillStyle = '#fff'
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
            this.xyArray = []
            this.$LS.remove(`${this.userId}xyArray`)
        },
        confirmHandler() {
            window.h5HistoryBack = () => {
                return true
            }
            window.h5ClosePage = () => {
                return true
            }
            if (this.lastX === -1) {
                // 当没有签名的时候确认按钮不可用
                return
            }
            let img = new Image()
            img.src = this.canvas.toDataURL('image/png')
            img.onload = async () => {
                this.$loading()
                let height = img.height
                let width = img.width
                let canvas = this.$refs.rotate
                let ctx = canvas.getContext('2d')
                canvas.width = height
                canvas.height = width
                ctx.rotate((-1 * 90 * Math.PI) / 180)
                ctx.drawImage(img, -width, 0, width, height)
                let base64 = canvas.toDataURL('image/png')
                let url = await this.uploadFileBybase64(base64)
                try {
                    await addHKCustomerSign(url)
                    await this.$toast(this.$t('submitSuccess'))
                    if (this.openAccountStatus !== 6) {
                        this.$LS.put('showDialog', true)
                    }
                    this.$jsBridge.callApp('command_close_webview')
                    this.$close()
                } catch (e) {
                    this.$toast(e.msg || '网络开小差了，请稍后重试')
                }
            }
        },
        initDraw() {
            this.canvas = this.$refs.sign
            this.offsetTop = this.canvas.parentElement.offsetTop
            this.offsetLeft = this.canvas.parentElement.offsetLeft
            this.canvas.setAttribute(
                'width',
                this.canvas.parentElement.clientWidth
            )
            this.canvas.setAttribute(
                'height',
                this.canvas.parentElement.clientHeight
            )
            this.ctx = this.canvas.getContext('2d')
            // 背景色 背景填充
            this.ctx.fillStyle = '#fff'
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
            this.signShow = false
        }
    }
}
</script>
<style lang="scss" scope>
.van-button--normal {
    padding: 0 10px;
}
</style>
<style lang="scss" rel="stylesheet/less">
$back: #f1f3f8;
.sign-draw-content {
    .button-rotate {
        border: none;
        width: 69px;
        height: 34px !important;
        line-height: 34px;
    }
    .van-button--default {
        background-color: $back;
        border: 1px solid #ebedf0;
    }
}
@media screen and (orientation: portrait) {
    .sign-draw-content {
        .sign-canvas {
            position: fixed;
            padding: 28px 20px 28px 0;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            z-index: 199;
            background-color: $back;
            .sign-canvas-content {
                width: 100%;
                display: flex;
                flex: 1;
                height: 100%;
                .canvas-bottom {
                    height: 100%;
                    display: flex;
                    width: 61px;
                    padding: 18px 0 18px;
                    flex-direction: column;
                    align-items: center;
                    justify-content: space-between;
                    .canvas-button-right {
                        display: flex;
                        justify-content: flex-end;
                        flex-direction: column;
                        height: 200px;
                        .button-rotate {
                            margin-top: 60px;
                        }
                    }
                    .button-rotate {
                        transform: rotate(90deg);
                    }
                }
                .canvas-box {
                    position: relative;
                    .sign-tips {
                        height: 30px;
                        width: 420px;
                        position: absolute;
                        font-size: 18px;
                        top: 50%;
                        left: 50%;
                        margin-top: -15px;
                        margin-left: -210px;
                        text-align: center;
                        transform: rotate(90deg);
                        color: rgba(57, 57, 57, 0.4);
                    }
                }
            }
        }
    }
}
@media screen and (orientation: landscape) {
    html {
        font-size: 13.33333vmin;
    }
    .sign-draw-content {
        .sign-canvas {
            position: fixed;
            padding: 20px 28px 0 28px;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            z-index: 9999;
            background-color: #f8f8f8;
            .sign-canvas-content {
                display: flex;
                flex-direction: column-reverse;
                .canvas-bottom {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    height: 61px;
                    .canvas-button-right {
                        button {
                            margin-left: 21px;
                        }
                    }
                }
                .canvas-box {
                    width: 100%;
                    height: 294px;
                    background-color: #fff;
                }
            }
        }
    }
}
</style>
