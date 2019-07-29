<template lang="pug">
    .preview-container
        canvas(v-for="page in pages" :id="'the-canvas'+ page" :key="page")
</template>

<script>
import PDFJS from 'pdfjs-dist'
import { Toast } from 'vant'
import { setTitle } from '@/utils/html-utils'
import LS from '@/utils/local-storage.js'
// 视口设置
const viewport = {
    el: document.querySelector('meta[name=viewport]'),
    contentBak: document.querySelector('meta[name=viewport]').content,
    set() {
        this.el.content =
            'width=device-width,initial-scale=1, minimum-scale=1, user-scalable=yes'
    },
    reset() {
        this.el.content = this.contentBak
    }
}

export default {
    name: 'preview',
    data() {
        return {
            pdfDoc: null,
            pages: 0
        }
    },
    activated() {
        let url = LS.get('pdfUrl')
        alert(url)
        let title = ''
        viewport.set()
        url && this.loadFile(url)
        title && setTitle(title)
    },
    deactivated() {
        this.pdfDoc = null
        this.pages = 0
        viewport.reset()
    },
    destroyed() {
        viewport.reset()
    },
    methods: {
        /**
         * 渲染一页面pdf
         * @param num
         */
        renderPage(num) {
            this.pdfDoc.getPage(num).then(function(page) {
                const canvas = document.getElementById('the-canvas' + num)
                const ctx = canvas.getContext('2d')
                const dpr = window.devicePixelRatio || 1 // 物理像素和设备独立像素的比例（公式表示就是：window.devicePixelRatio = 物理像素 / dips）
                const bsr =
                    ctx.webkitBackingStorePixelRatio ||
                    ctx.mozBackingStorePixelRatio ||
                    ctx.msBackingStorePixelRatio ||
                    ctx.oBackingStorePixelRatio ||
                    ctx.backingStorePixelRatio ||
                    1 // 该属性的值决定了浏览器在渲染canvas之前会用几个像素来来存储画布信息
                const ratio = dpr / bsr
                const viewport = page.getViewport(
                    (screen.availWidth / page.getViewport(1).width) * ratio
                )

                canvas.width = viewport.width
                canvas.height = viewport.height
                canvas.style.width = viewport.width / ratio + 'px'
                canvas.style.height = viewport.height / ratio + 'px'
                // ctx.setTransform(ratio, 0, 0, ratio, 0, 0) // 重置并创建新的变换矩阵

                const renderContext = {
                    canvasContext: ctx,
                    viewport: viewport
                }
                page.render(renderContext)
            })
        },
        /**
         * 加载pdf文件
         * @param url
         */
        async loadFile(url) {
            const loading = Toast.loading({
                duration: 0,
                forbidClick: true
            })
            try {
                this.pdfDoc = await PDFJS.getDocument(url)
                this.pages = this.pdfDoc.numPages
                this.$nextTick(() => {
                    Promise.all(
                        Array(this.pages)
                            .fill(undefined)
                            .map((item, index) => {
                                this.renderPage(index + 1)
                            })
                    ).then(() => {
                        this.$nextTick(() => {
                            loading.clear()
                        })
                    })
                })
            } catch (e) {
                alert(e)
            }
        }
    }
}
</script>

<style scoped lang="scss"></style>
