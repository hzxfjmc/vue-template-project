<template lang="pug">
    van-dialog.prompt-custom(v-model='isPromptDialog'  :show-confirm-button="false"
                :close-on-click-overlay="false")
                    img.close-icon(src='/webapp/marketing/lucky-draw/icon-close.png' @click='closeDialogHandle')
                    .dialog-title 未能參加此次活動
                    .message(v-html='promotMes')
                    .btnContainer
                        .btn(@click='jumpToHandle' v-if='isRecharge') 是
                        .btn(@click='closeHandle' v-if='isRecharge') 否 
                        .btn(v-if='isOverdue' @click='closeHandle') 返回 
</template>

<script>
import {
    getLotteryStatus,
    getSource
} from '@/service/customer-relationship-server.js'
import { mapGetters } from 'vuex'
export default {
    data() {
        return {
            isPromptDialog: false, //弹窗显示隐藏
            promotMes: '',
            isRecharge: false,
            isOverdue: false,
            promotMesList: {
                recharge: {
                    mesg: `很抱歉，你已非首次存款/轉倉，未 <br>
             能參加此次活動。多謝支持！<br>
             是否繼續入金？`
                },
                overdue: {
                    mesg: `很抱歉，活動已經結束，未能參加 <br>
             此次活動。多謝支持！`
                },
                isHkCus: {
                    mesg: `很抱歉，本活動僅支持香港地區用戶 <br>
             參與，未能參加此次活動。多謝支持！`
                }
            }
        }
    },
    created() {
        this.isLoginFun()
    },
    computed: {
        ...mapGetters(['user'])
    },
    methods: {
        closeDialogHandle() {
            this.isPromptDialog = false
            this.$jsBridge.callApp('command_close_webview')
            // this.$router.replace({ path: '/' })
        },
        // 判断是否登录
        isLoginFun() {
            if (this.user.userToken) {
                this.isGetSourceFun()
            } else {
                this.$jsBridge.callApp('command_close_webview')
                // 跳转登录
                this.goLogin()
            }
        },
        // 跳转到登录页
        async goLogin() {
            await this.$jsBridge.callApp('command_user_login')
            this.$store.dispatch('initAction')
            this.isLoginFun()
        },
        // 判断归属地 1：大陆 2：其它
        async isGetSourceFun() {
            try {
                this.$loading()
                let res = await getSource()
                this.$close()
                if (res.code === 1) {
                    this.isPromptDialog = true
                    this.promotMes = this.promotMesList['isHkCus'].mesg
                    this.isOverdue = true
                    return
                } else {
                    this.getLotteryStatusFun()
                }
            } catch (e) {
                if (e.msg) {
                    this.$toast(e.msg)
                }
            }
        },
        // 获取活动参与状态
        async getLotteryStatusFun() {
            try {
                this.$loading()
                let res = await getLotteryStatus()
                this.$close()
                // 是否开户 没有开户跳到开户
                if (!res.openAccount) {
                    this.$jsBridge.callApp('command_close_webview')
                    this.goAccount()
                    return
                }
                // 已入金或已转仓 即非首次入金、转仓
                if (res.recharge || res.transfer) {
                    this.isPromptDialog = true
                    this.promotMes = this.promotMesList['recharge'].mesg
                    this.isRecharge = true
                    return
                }
                // 活動已過期
                if (res.overdue) {
                    this.isPromptDialog = true
                    this.promotMes = this.promotMesList['overdue'].mesg
                    this.isOverdue = true
                    return
                }
                this.isPromptDialog = false
                // this.$jsBridge.callApp('command_close_webview')
                this.goGetGold()
            } catch (e) {
                if (e.msg) {
                    this.$toast(e.msg)
                }
            }
        },
        // 点击是
        jumpToHandle() {
            this.isPromptDialog = false
            // this.$jsBridge.callApp('command_close_webview')
            this.goGetGold()
        },
        // 点击否
        closeHandle() {
            this.isPromptDialog = false
            this.$jsBridge.callApp('command_close_webview')
            // this.$jsBridge.gotoNewWebview(
            //     window.location.origin + '/webapp/marketing/lucky-draw.html#/'
            // )
        },
        // 跳转到开户页（交易也是此页面）
        goAccount() {
            this.$jsBridge.gotoNativeModule('yxzq_goto://main_trade')
        },
        // 跳转到入金页面
        goGetGold() {
            // this.$jsBridge.gotoNativeModule(
            //     `yxzq_goto://webview?url=${encodeURIComponent(
            //         window.location.origin +
            //             '/webapp/open-account-hk/deposit.html'
            //     )}`
            // )
            window.location.replace(
                window.location.origin + '/webapp/open-account-hk/deposit.html'
            )
        }
    }
}
</script>

<style lang="scss" scoped>
.prompt-custom {
    width: 323px !important;
    height: 230px;
    background: #fff;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
    border-radius: 20px;
    padding: 0 26px;
    .close-icon {
        width: 20px;
        height: 20px;
        top: 18px;
        position: absolute;
        right: 17px;
    }
    .dialog-title {
        width: 271px;
        height: 23px;
        font-size: 18px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: $hk-title-color;
        line-height: 22px;
        margin-top: 50px;
        text-align: center;
    }
    .message {
        width: 271px;
        height: 89px;
        font-size: 16px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: $hk-text-color;
        line-height: 22px;
        margin-top: 14px;
        text-align: center;
    }
    .btnContainer {
        display: flex;
    }
    .btn {
        width: 120px;
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
    }
}
</style>
