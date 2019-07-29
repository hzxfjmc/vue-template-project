<template lang="pug">
.result
    .result-top
        yx-action-sheet(
            v-model="showSheet"
            :actionList='actionList'
            )
    .main-contariner-main
        .main-container
            .success
                img(v-if="status === 1 || status === 2"  src="@/assets/img/open-account/result/tijiao.png")
                img(v-if="status === 4 || status === 5"  src="@/assets/img/open-account/result/problem.png")
                img(v-if="status === 6"  src="@/assets/img/open-account/result/succed.png")
                img(v-if="status === 0"  src="@/assets/img/open-account/result/doing.png")
                p.r-title(v-if="curInfo.title" v-html="curInfo.title" @click="callKfHandler")
                p.r-tip.primary-color(v-if="curInfo.tip1" v-html="curInfo.tip1")
                p.r-tips(v-if="curInfo.tips" v-html="curInfo.tips")
                p.r-tip.primary-color(v-if="curInfo.tip" @click="commandOpenNotification" v-html="curInfo.tip")
            .kh-px(v-if="unStared" @click="goNewHandler")
            template(v-if="showAd")
                .brand-list.flex(v-if="[1,2,-1].indexOf(status) === -1" :class="{'row-direction': status !== -1}")
                    .brand-item(v-for="item in spanList" :key="item.icon")
                        img(:src="`/webapp/open-account/open-account/apply/${item.icon}.png`")
                        .brand-word {{item.text}}
            template(v-if="status === 4")
                ul.warn.text-color7
                    li(v-for="item,index in rejectItems" :key="item")
                        span {{index+1}}
                        p {{item}}
            p.reject-tips(v-if="curInfo.rejectTip" v-html="curInfo.rejectTip")
            van-button.open-btn(
                type="primary"
                v-if="curInfo.buttonText"
                @click="curInfo.nextStep" size="large") {{curInfo.buttonText}}
            p.r-tips.bt-tips(
                v-if="curInfo.logTips"
                v-html="curInfo.logTips"
                @click="fundHistoryRecord")
            p.r-tips.bt-tips(v-if="curInfo.bottomTips" v-html="curInfo.bottomTips")
            p.duijie(v-if="curInfo.duijie" @click="duijieHandler") {{curInfo.duijie}}
            //- BottomTips.bottom(v-show="status === -1")
        customer-info(v-if="curInfo.customer")
        .h-operate.common-radius(
            v-if="!unStared"
            :style="`background-image:url(/webapp/open-account/open-account/apply/${unStared ? 'banner' : 'goon-banner'}.png)`"
        )
</template>

<script>
import { getHKOpenAccountInfo } from '@/service/user-account-server-hk.js'
import { buryingViewPage, openAccountType } from '../../const/map'
import { webViewScreen } from '@/utils/burying-point'
// 0.提交资料中; 1. 待初审; 2. 待终审; 3. 开户失败； 4.开户驳回; 5.无法开户; 6. 开户成功
import BottomTips from './bottom-tip.vue'
import CustomerInfo from './components/customer-info/index.vue'
import { Swipe, SwipeItem } from 'vant'
export default {
    props: {
        identifyType: {
            type: Number,
            default: 1
        }
    },
    components: {
        CustomerInfo,
        BottomTips,
        [Swipe.name]: Swipe,
        [SwipeItem.name]: SwipeItem
    },
    mixins: [require('../../mixins/mix-router.js').default],
    computed: {
        unStared() {
            return this.status === -1
        },
        showAd() {
            return [4, 5].indexOf(this.status) === -1
        },
        approvalOpinion() {
            return this.resultStatus.approvalOpinion || {}
        },
        rejectItems() {
            return Object.keys(this.resultStatus.approvalOpinion)
        },
        status() {
            if (!this.resultStatus.infoEditStatus) {
                return -1
            }
            return this.resultStatus.openAccountStatus
        },
        notofication() {
            if (this.notoficationStatus) {
                return ''
            }
            return `开启手机通知提醒 <span class="iconfont icon-back right-icon"></span>`
        },
        isLogin() {
            return this.$store.getters.isLogin
        },
        phoneNumber() {
            return this.$store.getters.phoneNumber
        },
        currentStatus() {
            return this.$PROCESS_STATUS[this.stepStatus] || {}
        },
        statusMap() {
            return {
                [-1]: {
                    buttonText: '0佣金，立即开户',
                    nextStep: () => {
                        this.goOpenAccount()
                    }
                },
                0: {
                    title: `您的开户申请已完成${this.currentStatus.precent}%`,
                    tips: `${this.currentStatus.time}`,
                    buttonText: `继续开户`,
                    nextStep: () => {
                        this.goOpenAccount()
                    }
                },
                1: {
                    title: `您的开户申请已成功提交<br/>预计1个交易日内完成审核`,
                    tip: this.notofication,
                    buttonText: `查看入金指南`,
                    bottomTips: `开户成功后，存入任意资金即可进行交易，大陆银行卡与香港银行卡均可入金，
                    <span class="card">香港银行卡</span>入金成功率更高`,
                    duijie: '专人对接，免费办理香港银行卡 >',
                    nextStep: () => {
                        this.depositGuide()
                    },
                    customer: true
                },
                2: {
                    title: `您的开户申请已成功提交<br/>预计1个交易日内完成审核`,
                    tip: this.notofication,
                    buttonText: `查看入金指南`,
                    bottomTips: `开户成功后，存入任意资金即可进行交易，大陆银行卡与香港银行卡均可入金，
                    <span class="card">香港银行卡</span>入金成功率更高`,
                    duijie: '专人对接，免费办理香港银行卡 >',
                    nextStep: () => {
                        this.depositGuide()
                    },
                    customer: true
                },
                3: {
                    title: `您的开户申请已成功提交<br/>预计1个交易日内完成审核`,
                    tip: this.notofication,
                    buttonText: `查看入金指南`,
                    bottomTips: `开户成功后，存入任意资金即可进行交易，大陆银行卡与香港银行卡均可入金，
                    <span class="card">香港银行卡</span>入金成功率更高`,
                    duijie: '专人对接，免费办理香港银行卡 >',
                    nextStep: () => {
                        this.depositGuide()
                    },
                    customer: true
                },
                6: {
                    title: `恭喜，账户已成功开通！`,
                    tip1: `存入任意资金即可进行交易`,
                    buttonText: `开始入金`,
                    logTips: `<p class="primary-color" style="text-align: center;">查看入金记录</p>`,
                    nextStep: () => {
                        this.goDeposit()
                    },
                    customer: true
                },
                4: {
                    title: `抱歉，开户审核暂未通过，请修改`,
                    buttonText: `修改开户资料`,
                    rejectTip: '请修改资料后重新提交，我们将第一时间为您审核',
                    nextStep: () => {
                        this.goOpenAccount()
                    }
                },
                5: {
                    title: '抱歉，开户审核没有通过，<br>暂不能为您完成开户<br>',
                    tips: `<br>如有疑问，<span class="primary-color">请联系客服</span>`
                }
            }
        },
        curInfo() {
            if (this.identifyType !== 1 && this.identifyType !== 0) {
                return {
                    title: '您的开户申请未完成',
                    buttonText: `继续开户`,
                    nextStep: () => {
                        this.goHkOpenAccount()
                    }
                }
            }
            return this.statusMap[this.status]
        }
    },
    // watch: {
    //     status: {
    //         handler(v) {
    //             this.$store.dispatch('apply/setInlandResultStatus', v)
    //         },
    //         immediate: true
    //     }
    // },
    created() {
        this.$bus.$on('inland-init', () => {
            this.init()
        })
        this.$jsBridge.callAppNoPromise(
            'command_watch_activity_status',
            {},
            'appVisible',
            'appInvisible'
        )
        this.init()
    },
    data() {
        return {
            notoficationStatus: true,
            resultStatus: {
                approvalOpinion: {},
                bindTelephone: true,
                infoEditStatus: null,
                openAccountStatus: -1
            },
            showSheet: false,
            actionList: [
                {
                    text: '在线客服',
                    action: () => {
                        console.log('客服')
                    }
                },
                {
                    text: '电话咨询：400-870-800',
                    action: () => {
                        window.location.href = 'tel:400-870-800'
                    }
                }
            ],
            spanList: [
                { icon: 'quanshang', text: '持牌券商' },
                { icon: 'hangqing', text: '免费行情' },
                { icon: 'tougu', text: '智能投顾' }
            ]
        }
    },
    methods: {
        goNewHandler() {
            this.$jsBridge.gotoNewWebview(
                window.location.origin +
                    `/webapp/marketing/recruit-new-ch.html?id=1009#/`
            )
        },
        // 入金指南
        depositGuide() {
            this.$jsBridge.gotoNewWebview(
                window.location.origin +
                    `/webapp/market/generator.html?key=XY003`
            )
        },
        // 入金记录
        fundHistoryRecord() {
            this.$jsBridge.gotoNativeModule('yxzq_goto://fund_history_record')
        },
        // 对接银行卡
        duijieHandler() {
            this.$jsBridge.gotoNativeModule(
                `yxzq_goto://webview?url=${encodeURIComponent(
                    window.location.origin +
                        '/webapp/open-account/deposit.html#/bank-card-processing?referrer=openAccount'
                )}`
            )
        },
        // 去入金
        goDeposit() {
            this.$jsBridge.gotoNativeModule(
                `yxzq_goto://webview?url=${encodeURIComponent(
                    window.location.origin + '/webapp/open-account/deposit.html'
                )}`
            )
        },
        async getNoticationStatus() {
            try {
                let data = await this.$jsBridge.callApp(
                    'get_notification_status'
                )
                if (data.status === 'false') {
                    this.notoficationStatus = false
                }
            } catch (e) {
                this.notoficationStatus = false
            }
        },
        commandOpenNotification() {
            this.$jsBridge.callApp('command_open_notification')
        },
        async init() {
            try {
                if (this.isLogin && this.phoneNumber) {
                    // 登录成功后 如果是驳回则停留在本页面展示驳回信息 TODO
                    this.resultStatus = await this.$accountService.getOpenAccountStatus()
                    // 强制将7（终审驳回客服）改为1，都是初审
                    if (this.resultStatus.openAccountStatus === 7) {
                        this.resultStatus.openAccountStatus = 1
                    }
                    let rejectInfoMap = {}
                    Object.keys(this.approvalOpinion).forEach(key => {
                        this.approvalOpinion[key].split('|').forEach(cItem => {
                            rejectInfoMap[cItem] = rejectInfoMap[cItem] || []
                            rejectInfoMap[cItem].push(key)
                        })
                    })
                    this.initMutation({
                        rejectInfoMap
                    })
                    // 调试数据 TODO: 发布代码前这里需求删除
                    // this.resultStatus = {
                    //     approvalOpinion: {},
                    //     bindTelephone: true,
                    //     infoEditStatus: 127,
                    //     openAccountStatus: 0
                    // }

                    this.getNoticationStatus()
                } else {
                    // webview显示 初始化数据
                    this.resultStatus = {
                        approvalOpinion: {},
                        bindTelephone: true,
                        infoEditStatus: null,
                        openAccountStatus: -1
                    }
                }
                this.initMutation({
                    infoEditStatus: this.resultStatus.infoEditStatus
                })
            } catch (e) {
                console.log(e)
            } finally {
                let isNoOpen = this.status === -1
                if (isNoOpen) {
                    webViewScreen(buryingViewPage.home.id)
                } else {
                    let openType = this.$LS.get('identifyType')
                    let openTypeObj = openAccountType[openType] || {}
                    webViewScreen(
                        buryingViewPage['inland-result'].id,
                        openTypeObj.id,
                        openTypeObj.name
                    )
                }
            }
        },
        async goOpenAccount() {
            try {
                if (this.$jsBridge.isYouxinApp) {
                    let unlogin = !this.isLogin
                    // 未登录或者未绑定手机 先登录和邦定手机
                    // 登录成功后 如果是驳回则停留在本页面展示驳回信息 TODO
                    await this.$store.dispatch('loginCommonAction')
                    this.$loading()
                    // 登录成功后需要重新查询一下状态
                    await this.init()
                    // 如果是ipad开户则停留在当前页面
                    if (unlogin) {
                        let { ipadOpened } = await getHKOpenAccountInfo()
                        if (ipadOpened) {
                            return
                        }
                    }

                    // 登录成功后只有未开户 或者待开户才跳转到开户页面
                    if (
                        this.status === 0 ||
                        this.status === -1 ||
                        this.status === 4
                    ) {
                        this.$jsBridge.gotoNativeModule(
                            'yxzq_goto://open_account'
                        )
                    }
                } else {
                    this.goApplyStep('push', 'skip')
                }
            } catch (e) {
                console.log(e)
            } finally {
                this.$close()
            }
        },
        async goHkOpenAccount() {
            try {
                this.$loading()
                let {
                    infoEditStatus,
                    openAccountStatus
                } = await getHKOpenAccountInfo()
                this.infoEditStatus = infoEditStatus
                // 更新步骤
                let step = this.transNum(infoEditStatus)
                if (infoEditStatus === 0) {
                    // 登录回来之后，直接跳转到第一步进行开户
                    this.goHKStep(`step/1`)
                } else if (openAccountStatus === 12) {
                    // 已经开户，到结果页
                    this.$emit('changeView', 'no-pass')
                } else if (
                    openAccountStatus !== 12 &&
                    openAccountStatus !== 0
                ) {
                    this.$emit('changeView', 'result')
                } else if (openAccountStatus === 0 && infoEditStatus > 0) {
                    this.goHKStep(`step/${step}`)
                }
                this.$close()
            } catch (e) {
                await this.$toast(e.msg || '网络开小差了,请稍后重试')
            }
        },
        goHKStep(pageName) {
            this.$jsBridge.gotoNativeModule(
                `yxzq_goto://webview?url=${encodeURIComponent(
                    window.location.origin +
                        `/webapp/open-account-hk/apply.html#/${pageName}`
                )}`
            )
        },
        transNum(infoEditStatus) {
            let sum = 1
            for (let i = 1; i <= 6; i++) {
                // 返回到还没有完成的那一步
                if ((infoEditStatus & sum) === 0) {
                    return i
                }
                sum *= 2
            }
        },
        callKfHandler() {
            if (this.status === 'reject') {
                this.showSheet = true
            }
        },
        handleBannerClick(item) {
            item.jump_url &&
                this.$jsBridge.gotoNativeModule(
                    `yxzq_goto://webview?url=${encodeURIComponent(
                        item.jump_url
                    )}`
                )
        }
    }
}
</script>

<style lang="scss">
.result {
    .card {
        color: $text-color;
        font-weight: bold;
    }
    .right-icon {
        font-size: 12px;
        line-height: 1.5;
    }
}
</style>

<style lang="scss" scoped>
$b-color: #d8d8d8;
.result {
    flex-direction: column;
    background-color: #fff;
    .main-container {
        padding: $global-padding $global-padding 10px;
        .kh-px {
            width: 345px;
            height: 407px;
            background-image: url('/webapp/open-account/kh-px.png');
            background-position: center;
            background-size: contain;
        }
        .bottom {
            padding-top: 10px;
        }
        .success {
            padding-top: 10px;
            text-align: center;
            img {
                width: 99px;
            }
            .r-title {
                font-size: 20px;
                font-weight: 400;
                padding: 10px 0 6px;
            }
        }
        .r-tips {
            font-size: 12px;
            color: $text-color5;
        }
        .bt-tips {
            padding-top: 10px;
        }
        .r-tip {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            color: $primary-color;
        }
        .reject-tips {
            font-size: 12px;
            color: $warn-color;
            text-align: center;
            padding-top: 10px;
        }
        .duijie {
            padding: 6px 0 0;
            color: $primary-color;
            font-size: 12px;
        }
        .brand-list {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 10px 30px 0;
            align-items: center;
            &.row-direction {
                flex-direction: row;
            }
            .brand-item {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                img {
                    width: 50px;
                    height: 50px;
                }
                .brand-word {
                    font-size: 14px;
                    line-height: 32px;
                    color: $primary-color;
                }
            }
        }
        .deposit-log {
            color: $primary-color;
            text-align: center;
            padding-top: 10px;
        }
        .warn {
            width: 343px;
            background: rgba(60, 120, 250, 0.06);
            border-radius: 10px;
            padding: $global-padding $global-padding 0;
            border: 1px solid rgba(60, 120, 250, 0.12);
            li {
                display: flex;
                margin-bottom: 20px;
                span {
                    font-size: 10px;
                    margin-right: 10px;
                    display: flex;
                    height: 16px;
                    align-items: center;
                    justify-content: center;
                    margin-top: 3px;
                    width: 16px;
                    background-color: rgba(60, 120, 250, 0.35);
                    color: #fff;
                    border-radius: 100%;
                }
                p {
                    flex: 1;
                    word-break: break-all;
                }
            }
        }
        .open-btn {
            margin-top: 15px;
        }
    }
    .h-operate {
        width: 359px;
        height: 90px;
        margin: 20px 8px 0px 8px;
        background-image: url(/webapp/open-account/open-account/apply/banner.png);
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
        background-color: #fff;
    }
}
</style>
