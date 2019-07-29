<template lang="pug">
    .recharge-transfer-container   
        van-dialog.recharge-transfer(v-model='isShowDialog' :show-confirm-button="false" :close-on-click-overlay="false")
                        van-icon.close-icon( name="cross" @click='closeDialogHandle')
                        van-loading.loading-container(type="spinner" v-show='isShowLoading' color="#0EC0F1" size='70px')
                        .dialog-title(v-if='isShowYes' v-html='yesTitleMes')
                        .message(v-if='isShowYes' v-html='yesPromotMes' )
                        .message.loading(v-if='isShowLoading') 存款提交中
                        .btn.top( v-if='isShowYes' @click='joinDraw(1)') 參加抽獎
                        .btn.bottom( v-if='isShowYes' @click='joinDraw(2)') 領取股票
                        .notice(v-if='isShowYes') *確定選擇後便不可重覆參加其他首次存款/ 轉倉活動
</template>

<script>
import { Dialog, Icon, Loading } from 'vant'
import {
    judgeCondition,
    chooseReward,
    getSource,
    getLotteryStatus
} from '@/service/customer-relationship-server.js'

export default {
    data() {
        return {
            isShowDialog: false,
            isShowLoading: false,
            isShowYes: false,
            yesTitleMes: `首次存款/ 轉倉<br>申請提交成功`,
            yesPromotMes: `你可以選擇參加以下活動(只限2選1): `,
            timer: ''
        }
    },
    props: {
        value: {
            type: Boolean,
            default: false
        }
    },
    components: {
        [Dialog.name]: Dialog,
        [Icon.name]: Icon,
        [Loading.name]: Loading
    },
    computed: {},
    created() {
        this.isGetSourceFun()
    },
    methods: {
        _renderInit() {
            this.timer = setInterval(() => {
                this.judgeConditionFun()
            }, 2000)
        },
        // 判断归属地 1：大陆 2：其它
        async isGetSourceFun() {
            try {
                let res = await getSource()
                if (res.code === 1) {
                    this.isShowLoading = false
                    this.isShowDialog = false
                    this.$emit('notFirstCallback')
                } else {
                    this.isShowDialog = true
                    this.isShowLoading = true
                    this._renderInit()
                }
            } catch (e) {
                if (e.msg) {
                    this.$toast(e.msg)
                }
            }
        },
        // 判断是否首次入金
        async getLotteryStatusFun() {
            try {
                let res = await getLotteryStatus()
                if (res.recharge || res.transfer) {
                    this.isShowLoading = false
                    this.isShowDialog = false
                    this.$emit('notFirstCallback')
                    return
                } else {
                    this.isShowLoading = true
                    this.isShowDialog = true
                }
            } catch (e) {
                if (e.msg) {
                    this.$toast(e.msg)
                }
            }
        },
        closeDialogHandle() {
            this.isShowDialog = false
            this.$emit('closeDialogHandle')
        },

        jumpToHandle() {
            this.closeDialogHandle()
        },
        // 入金/转仓是否达标
        async judgeConditionFun() {
            try {
                let res = await judgeCondition()
                // 有结果了 清除定时器和loading
                if (res) {
                    clearInterval(this.timer)
                    this.isShowLoading = false
                }
                if (res.reachReward) {
                    this.isShowYes = true
                } else {
                    this.isShowDialog = false
                    this.$emit('closeDialogHandle')
                }
            } catch (e) {
                //clearInterval(this.timer)
            }
        },
        // 点击参加抽奖
        async joinDraw(type) {
            try {
                let params = {
                    choice: type
                }
                await chooseReward(params)
                this.isShowDialog = false
                if (type === 1) {
                    window.location.replace(
                        window.location.origin +
                            '/webapp/marketing/lucky-draw.html#/result'
                    )
                    // this.$jsBridge.gotoNewWebview(
                    //     `${window.location.origin}//webapp/marketing/lucky-draw.html#/result`
                    // )
                    // setTimeout(() => {
                    //     this.$jsBridge.callApp('command_close_webview')
                    // }, 1500)
                } else {
                    window.location.replace(
                        window.location.origin +
                            '/webapp/marketing/award-center.html#/ch'
                    )
                    // this.$jsBridge.gotoNewWebview(
                    //     `${window.location.origin}/webapp/marketing/award-center.html#/ch`
                    // )
                    // setTimeout(() => {
                    //     this.$jsBridge.callApp('command_close_webview')
                    // }, 1500)
                }
            } catch (e) {
                if (e.msg) {
                    this.$toast(e.msg)
                }
            }
        },
        returnHandle() {
            this.isShowDialog = false
        }
    }
}
</script>

<style lang="scss">
.recharge-transfer-container {
    .recharge-transfer {
        width: 323px !important;
        height: 291px;
        background: #fff;
        box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
        border-radius: 20px;
        padding: 0 26px;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        .dialog-title {
            width: 271px;
            font-size: 18px;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: $hk-title-color;
            line-height: 22px;
            margin-top: 50px;
            text-align: center;
        }
        .loading-container {
            position: static;
            margin: 53px auto 24px;
        }
        .message,
        .loading {
            font-size: 18px;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: $hk-text-color;
            line-height: 22px;
        }
        .message {
            width: 271px;
            font-size: 16px;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: $hk-text-color;
            line-height: 22px;
            margin: 14px 0 20px;
        }
        .btn {
            width: 130px;
            height: 40px;
            background: linear-gradient(
                45deg,
                rgba(109, 165, 249, 1) 0%,
                rgba(43, 79, 128, 1) 100%
            );
            border-radius: 6px;
            text-align: center;
            line-height: 40px;
            font-size: 18px;
            font-family: PingFangHK-Medium;
            font-weight: 500;
            color: #fff;
            margin: 0 auto;
            &.top {
                margin-bottom: 10px;
            }
            &.bottom {
                margin-bottom: 20px;
            }
        }
        .notice {
            width: 284px;
            height: 25px;
            font-size: 11px;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: $hk-text-color;
            line-height: 22px;
            margin-bottom: 6px;
        }
        .mb26 {
            margin-bottom: 26px;
            margin-top: 42px;
        }
    }
    .close-icon {
        width: 20px;
        height: 20px;
        font-size: 20px;
        top: 18px;
        position: absolute;
        right: 17px;
    }
}
</style>
