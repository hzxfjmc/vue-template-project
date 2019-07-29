<template lang="pug">
  .sign-draw-content(ref='signBox')
    .sign-canvas(id='canvasBox')
      .sign-canvas-content
        .canvas-bottom(id='top')
          .canvas-button-left
            van-button.button-rotate.cancel(@click='canvasShow' plain  type="default") 返回
          .canvas-button-right
            van-button.button-rotate(@click='reset' plain  type="default") 清空
            van-button.button-rotate.submit(@click='confirmHandler' :disabled="lastX === -1" type="primary") 确定
        .canvas-box
            .sign-tips(@touchmove="onTouchMove" @touchstart="onTouchStart" @touchend="onTouchEnd" v-if="lastX === -1")
                p 请在区域手写签名：{{basicInfo.realName}}
            canvas(ref="sign" @touchmove="onTouchMove" @touchstart="onTouchStart" @touchend="onTouchEnd")
            canvas(ref="rotate" v-show="false")
</template>

<script>
export default {
    mixins: [require('../../mixins/mix-router.js').default],
    data() {
        return {
            lastX: -1,
            lastY: -1,
            ctx: {},
            offsetTop: 0,
            offsetLeft: 0,
            canvas: {},
            signShow: true,
            xyArray: []
        }
    },
    computed: {
        privateKeyPem() {
            return this.initState.ca.privateKeyPem
        },
        certSN() {
            return this.initState.ca.certSN
        },
        caPending() {
            return this.initState.ca.pending
        },
        certDN() {
            return this.initState.ca.certDN
        },
        errorSubmit() {
            return this.initState.ca.errorSubmit
        }
    },
    mounted() {
        addEventListener('load', () => {
            window.onorientationchange = () => {
                setTimeout(() => {
                    this.init()
                }, 300)
            }
        })
        this.init()
    },
    methods: {
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
            this.$router.push('/step/7')
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
        // 图片压缩()
        compressImage(base64, quality) {
            return new Promise((resolve, reject) => {
                // 高250px 宽100px
                const img = new Image()
                img.src = base64
                img.onload = () => {
                    //生成canvas
                    const canvas = document.createElement('canvas')
                    const ctx = canvas.getContext('2d')
                    canvas.width = img.naturalWidth / quality
                    canvas.height = img.naturalHeight / quality
                    ctx.fillStyle = '#fff'
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
                    const newBase64 = canvas.toDataURL('image/jpeg')
                    resolve(newBase64)
                }
                img.error = e => {
                    reject(e)
                }
            })
        },
        confirmHandler() {
            if (this.lastX === -1) {
                // 当没有签名的时候确认按钮不可用
                return
            }
            let img = new Image()
            img.src = this.canvas.toDataURL('image/png')
            img.onload = async () => {
                let height = img.height
                let width = img.width
                let canvas = this.$refs.rotate
                let ctx = canvas.getContext('2d')
                let quality
                if (height / width > 2.5) {
                    quality = height / 250
                } else {
                    quality = width / 110
                }
                canvas.width = height
                canvas.height = width
                ctx.rotate((-1 * 90 * Math.PI) / 180)
                ctx.drawImage(img, -width, 0, width, height)
                let base64 = canvas.toDataURL('image/png')
                base64 = await this.compressImage(base64, quality)
                let times = 1
                this.$loading('信息校验中···')
                let timer = setInterval(async () => {
                    // ca流程出错了
                    if (this.errorSubmit) {
                        await this.$alert(this.errorSubmit)
                        this.caInitAction()
                        this.$close()
                        clearInterval(timer)
                        return
                    }
                    // 在请求中：没有拿到certDN 且在pending状态 !this.certDN || !this.certSN
                    if (this.caPending) {
                        times++
                        if (times > 100) {
                            this.$close()
                            clearInterval(timer)
                            this.caInitAction()
                        }
                        return
                    }
                    // 非请求中 其中一个为空 则重试
                    if (!this.certDN || !this.certSN) {
                        this.caInitAction()
                        return
                    }
                    clearInterval(timer)
                    try {
                        let {
                            fileHash,
                            fileId
                        } = await this.$accountService.caPdfSign(
                            this.certDN,
                            this.certSN,
                            base64.split(',')[1]
                        )
                        // 得到一个hash 然后得到p1
                        let { getP1SignData } = await import(
                            '../../utils/ca.js'
                        )
                        let P1SignData = await getP1SignData(
                            fileHash,
                            this.privateKeyPem
                        )
                        await this.$accountService.finishCaSign(
                            this.certDN,
                            this.certSN,
                            fileId,
                            P1SignData
                        )
                        if (this.$jsBridge.hasBridge) {
                            this.$jsBridge.callApp('command_close_webview')
                        } else {
                            this.$router.replace({
                                name: 'result'
                            })
                        }
                        this.$close()
                    } catch (e) {
                        this.caInitAction()
                        this.$toast(e.msg)
                    }
                }, 300)
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
                    // display: flex;
                    // justify-content: center;
                    // align-items: center;
                    .sign-tips {
                        // display: flex;
                        // justify-content: center;
                        // align-items: center;
                        height: 30px;
                        width: 220px;
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        margin-top: -15px;
                        margin-left: -110px;
                        text-align: center;
                        transform: rotate(90deg);
                        color: $text-color5;
                    }
                    height: 100%;
                    width: 294px;
                    background-color: #fff;
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
