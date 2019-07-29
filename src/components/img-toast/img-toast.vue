<template lang="pug">
    .toast-wrapper(v-if="showWrapper")
        .layer(v-if="showLayer" :class="showContent ?'fadein':'fadeout'")
        .content(:class="showContent ?'fadein':'fadeout'")
            .img-box
                img(src="/webapp/open-account/open-account/icon/icon_success.png")
            .text-box
                span {{message}}
</template>
<script>
export default {
    data() {
        return {
            message: '',
            showLayer: true,
            showWrapper: true,
            showContent: true
        }
    }
}
</script>

<style scoped lang="scss">
.toast-wrapper {
    .layer {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.4);
        transition: 0.3s ease-out;
        z-index: 99999;
    }
    .content {
        position: fixed;
        top: 50%;
        left: 50%;
        max-height: 100%;
        width: 150px;
        height: 144px;
        border-radius: 4px;
        overflow-y: auto;
        background-color: #fff;
        -webkit-transition: 0.3s ease-out;
        transition: 0.3s ease-out;
        -webkit-overflow-scrolling: touch;
        -webkit-transform: translate3d(-50%, -50%, 0);
        transform: translate3d(-50%, -56%, 0);
        text-align: center;
        z-index: 999991;
        img {
            margin-top: 30px;
            width: 50px;
            height: 50px;
        }
        .text-box {
            margin-top: 10px;
        }
    }
    .fadein {
        animation: animate_in 0.25s;
    }
    .fadeout {
        animation: animate_out 0.25s;
        opacity: 0;
    }
    @keyframes animate_in {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }
    @keyframes animate_out {
        0% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }
}
</style>
