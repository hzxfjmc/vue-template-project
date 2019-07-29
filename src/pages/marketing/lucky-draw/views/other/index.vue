<template lang="pug">
    .recharge-transfer-container   
        van-dialog.recharge-transfer(v-model='isShowDialog' :show-confirm-button="false" :close-on-click-overlay="false")
                        van-icon.close-icon( name="cross" @click='closeDialogHandle')
                        .dialog-title(v-if='isShowReward' v-html='rewardTitleMes')
                        .dialog-title(v-if='isShowNoReward' v-html='noRewardTitleMes')
                        .dialog-title(v-if='isShowOverdue' v-html='overdueTitleMes')
                        .message(v-if='isShowReward' v-html='rewardPromotMes' )
                        .message.mb26(v-if='isShowNoReward' v-html='noPromotMes' )
                        .message.mb26(v-if='isShowOverdue' v-html='isOverdue' )
                        .btn.mb26(v-if='isShowNoReward || isShowOverdue' @click='returnHandle') 返回
                        .btn.top( v-if='isShowReward' @click='joinDraw(1)') 參加抽獎
                        .btn.bottom( v-if='isShowReward' @click='joinDraw(2)') 領取股票
                        .notice(v-if='isShowReward') *確定選擇後便不可重覆參加其他首次存款/ 轉倉活動
</template>

<script>
import { Dialog, Icon, Loading } from 'vant'
import {
    chooseReward,
    getLotteryInfo
} from '@/service/customer-relationship-server.js'
export default {
    data() {
        return {
            isShowDialog: false,
            isShowReward: false,
            isShowNoReward: false,
            isShowOverdue: false,
            rewardTitleMes: `首次存款/ 轉倉<br>申請提交成功`,
            noRewardTitleMes: `未達到活動條件`,
            overdueTitleMes: `活動已過期`,
            rewardPromotMes: `你可以選擇參加以下活動(只限2選1): `,
            noPromotMes: `很抱歉，本次入金審核失敗，<br>
            不能參與此次活動。多謝支持！`,
            isOverdue: `很抱歉，活動已經結束，未能參加 <br>
             此次活動。多謝支持！`
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
        this.getLotteryInfoFun()
    },
    methods: {
        closeDialogHandle() {
            this.returnHandle()
        },
        // 获取活动抽奖信息
        async getLotteryInfoFun() {
            try {
                let res = await getLotteryInfo()
                // 没有参与资格
                if (!res.reachReward) {
                    this.isShowDialog = true
                    this.isShowNoReward = true
                    return
                }
                // 活动已过期
                if (res.overdue) {
                    this.isShowDialog = true
                    this.isShowOverdue = true
                    return
                }
                // 有资格且未选择未过期
                if (res.reachReward && !res.overdue && res.choice === 0) {
                    this.isShowDialog = true
                    this.isShowReward = true
                    return
                }
                // 有资格且选择抽奖 跳转到抽奖页面
                if (res.reachReward && !res.overdue && res.choice === 1) {
                    this.$router.replace({ path: '/result' })
                }
                // 有资格且选择了送股 跳转到奖励中心
                if (res.reachReward && !res.overdue && res.choice === 2) {
                    window.location.replace(
                        window.location.origin +
                            '/webapp/marketing/award-center.html#/ch'
                    )
                }
            } catch (e) {
                if (e.msg) {
                    this.$toast(e.msg)
                }
            }
        },
        // 点击参加抽奖
        async joinDraw(type) {
            try {
                let params = {
                    choice: type
                }
                await chooseReward(params)
                if (type === 1) {
                    this.$router.replace({ path: '/result' })
                } else {
                    window.location.replace(
                        window.location.origin +
                            '/webapp/marketing/award-center.html#/ch'
                    )
                }
            } catch (e) {
                if (e.msg) {
                    this.$toast(e.msg)
                }
            }
        },
        returnHandle() {
            this.isShowDialog = false
            this.$jsBridge.gotoNativeModule('yxzq_goto://main_optstocks')
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
            color: $hk-title-color;
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
