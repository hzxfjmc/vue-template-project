<template>
    <div v-show="show" class="wd-img-preview-container" id="wrapper">
        <div class="wd-img-preview-bd" @click="show = false">
            <img
                :src="imgSrc"
                @mousedown="startHandler"
                @mouseup="endHandler"
                @touchend="endHandler"
                @touchstart="startHandler"
            />
        </div>
    </div>
</template>
<style scoped>
.wd-img-preview-container {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    overflow: hidden;
    z-index: 999999;
    background-color: #333;
}

.wd-img-preview-bd {
    position: absolute;
    z-index: 1;
    height: 100%;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    width: 100%;
    -webkit-transform: translateZ(0);
    -moz-transform: translateZ(0);
    -ms-transform: translateZ(0);
    -o-transform: translateZ(0);
    transform: translateZ(0);
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -webkit-text-size-adjust: none;
    -moz-text-size-adjust: none;
    -ms-text-size-adjust: none;
    -o-text-size-adjust: none;
    text-size-adjust: none;
}

.wd-img-preview-bd img {
    width: 100%;
    position: relative;
    top: 50%;
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    transform: translateY(-50%);
}

.noScroll {
    overflow-y: hidden;
}
</style>
<script>
import IScroll from 'iscroll/build/iscroll-zoom.js'

export default {
    props: ['imgSrc'],
    data() {
        return {
            show: false,
            startObj: {
                time: 0,
                x: 0,
                y: 0
            },
            endObj: {
                time: 0,
                x: 0,
                y: 0
            }
        }
    },
    watch: {
        show(val) {
            if (!val && this.myScrollZoom) {
                this.myScrollZoom.zoom(1, 0, 0)
            }
        },
        '$route.name'() {
            alert(1)
            this.closePrevImg()
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.myScrollZoom = new IScroll('#wrapper', {
                zoom: true,
                scrollX: true,
                scrollY: true,
                mouseWheel: true,
                wheelAction: 'zoom',
                preventDefault: false
            })
        })
    },
    methods: {
        endHandler(e) {
            e.preventDefault()
            this.endObj.time = e.timeStamp
            this.endObj.x = e.clientX || e.changedTouches[0].clientX
            this.endObj.y = e.clientY || e.changedTouches[0].clientY
            const intervalTm = this.endObj.time - this.startObj.time
            const xDistance = this.endObj.x - this.startObj.x
            const yDistance = this.endObj.y - this.startObj.y
            const distance = Math.sqrt(
                xDistance * xDistance + yDistance * yDistance
            )
            if (intervalTm > 80 && distance > 10) {
                console.log('drag')
            } else {
                this.closePrevImg()
            }
        },
        startHandler(e) {
            e.preventDefault()
            this.startObj.time = e.timeStamp
            this.startObj.x = e.clientX || e.touches[0].clientX
            this.startObj.y = e.clientY || e.touches[0].clientY
        },
        closePrevImg() {
            this.show = false
        }
    }
}
</script>
