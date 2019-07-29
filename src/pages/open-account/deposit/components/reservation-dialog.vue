<template>
    <div v-if="showFlag">
        <div
            class="van-dialog dialog-box dialog-bounce-enter-active"
            style="z-index: 2005"
            v-bind:class="{ 'van-dialog-bounce-enter': !showFlag }"
        >
            <div class="van-dialog__content">
                <div class="van-dialog__message">
                    <div class="dialog-content-box">
                        <img :src="imgSrc" />
                        <h2 class="title">预约成功</h2>
                        <div class="content-box">{{ options.content }}</div>
                        <div class="sub-title">
                            <p>客户经理将在指定时间与您联系，请保持手机畅通</p>
                        </div>
                        <div class="btn" @click="close">好的</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="van-overlay" style="z-index: 2004;" v-if="showFlag"></div>
    </div>
</template>

<script>
// 临时弹窗
export default {
    data() {
        return {
            imgSrc: '/webapp/open-account/open-account/deposit/tijiao.png',
            showFlag: false,
            options: {}
        }
    },
    methods: {
        close() {
            this.showFlag = false
            if (this.options.closeCallback) {
                this.options.closeCallback()
            }
        },
        show(options) {
            this.showFlag = true
            this.options = options
        }
    }
}
</script>
<style lang="scss">
.van-dialog__message {
    padding: 20px 10px;
}
</style>
<style scoped lang="scss">
.dialog-box {
    text-align: center;
    .dialog-content-box {
        line-height: 22px;
        img {
            width: 90px;
            height: 90px;
        }
        .title {
            font-size: 20px;
            padding: 10px;
        }
        .content-box {
            font-size: 16px;
            opacity: 0.7;
        }
        .sub-title {
            padding-top: 10px;
            font-size: 12px;
            opacity: 0.5;
        }
        .btn {
            margin: 20px 10px 0;
            height: 47px;
            line-height: 47px;
            background: #285ac8;
            border-radius: 4px;
            color: #fff;
        }
    }
}
</style>
