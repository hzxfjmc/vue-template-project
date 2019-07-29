<template lang="pug">
.result.full-height.flex-fixed.scroll-able
    .main-container.scroll-able.flex-fixed-container
        .success
            img(v-if="[1, 2, 3].indexOf(status) > -1"  src="@/assets/img/open-account/result/tijiao.png")
            img(v-if="status === 4 || status === 5"  src="@/assets/img/open-account/result/problem.png")
            img(v-if="status === 6"  src="@/assets/img/open-account/result/succed.png")
            img(v-if="status === 0"  src="@/assets/img/open-account/result/doing.png")
            p.r-title(v-if="curInfo.title" v-html="curInfo.title" @click="callKfHandler")
            p.r-tip.primary-color(v-if="curInfo.tip1" v-html="curInfo.tip1")
            p.r-tips(v-if="curInfo.tips" v-html="curInfo.tips")
            p.r-tip.primary-color(v-if="curInfo.tip" @click="commandOpenNotification" v-html="curInfo.tip")
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
        p.r-tips.bt-tips(v-html="curInfo.bottomTips")
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapMutations } = createNamespacedHelpers('apply')

// 0.提交资料中; 1. 待初审; 2. 待终审; 3. 开户失败； 4.开户驳回; 5.无法开户; 6. 开户成功
import { Swipe, SwipeItem } from 'vant'

export default {
    i18n: {
        zhCHS: {
            inlandResult: {
                continue: '继续开户',
                successSubmit: '您的开户申请已成功提交',
                completeTime: '预计1个交易日内完成审核',
                depositRecords: '查看入金记录',
                congratulations: '恭喜，账户已成功开通！',
                depositNow: '开始入金',
                sorryTip: '抱歉，开户审核暂未通过，请修改',
                editInformation: '修改开户资料',
                phoneAlarm: '开启手机通知提醒',
                openAccountNow: '0佣金，立即开户',
                complete: '您的开户申请已完成',
                // viewGuide: '查看入金指南',
                // cardAccount:
                //     '开户成功后，存入任意资金即可进行交易，大陆银行卡与香港银行卡均可入金',
                // freeCard: '专人对接，免费办理香港银行卡 >',
                anyYuan: '存入任意资金即可进行交易',
                reSubmit: '请修改资料后重新提交，我们将第一时间为您审核',
                sorryTip2: '抱歉，开户审核没有通过，<br>暂不能为您完成开户<br>',
                question: '如有疑问',
                connection: '请联系客服',
                // hkCard: '香港银行卡',
                // moreHign: '入金率更高',
                online: '在线客服',
                phone: '电话咨询'
            }
        },
        zhCHT: {
            inlandResult: {
                continue: '繼續開戶',
                successSubmit: '您的開戶申請已成功提交',
                completeTime: '預計1個交易日內完成審核',
                depositRecords: '查看入金記錄',
                congratulations: '恭喜，賬戶已成功開通',
                depositNow: '開始入金',
                sorryTip: '抱歉，開戶審核暫未通過，請修改',
                editInformation: '修改開戶資料',
                phoneAlarm: '開啟手機通知提醒',
                openAccountNow: '0佣金，立即開戶',
                complete: '您的開戶申請已完成',
                // viewGuide: '查看入金指南',
                // cardAccount:
                //     '開戶成功后，存入任意資金即可進行交易，大陸銀行卡與香港銀行卡均可入金',
                // freeCard: '專人對接，免費辦理香港銀行卡 >',
                anyYuan: '存入任意資金即可進行交易',
                reSubmit: '請修改資料後重新提交，我們將第一時間為您審核',
                sorryTip2: '抱歉，開戶審核沒有通過，<br>暫不能為您完成開戶<br>',
                question: '如有疑問',
                connection: '請聯繫客服',
                // hkCard: '香港銀行卡',
                // moreHign: '入金率更高',
                online: '線上客服',
                phone: '電話諮詢'
            }
        },
        en: {
            inlandResult: {
                continue: 'Continue The Application',
                successSubmit: 'Account Opening Application Submitted',
                completeTime: 'We will process it in 1 working day',
                depositRecords: 'View Deposit Records',
                congratulations: 'Congratulations, Account Is Opened',
                depositNow: 'Deposit Now',
                sorryTip: 'Sorry, you have to edit below information',
                editInformation: 'Edit Information',
                phoneAlarm: 'Turn on notifications',
                openAccountNow: '0 commission, open an account immediately',
                complete: 'Your account opening application has been completed',
                // viewGuide: '查看入金指南',
                // cardAccount:
                //     '开户成功后，存入任意资金即可进行交易，大陆银行卡与香港银行卡均可入金',
                // freeCard: '专人对接，免费办理香港银行卡 >',
                anyYuan: 'Deposit and trade',
                reSubmit:
                    'Please modify and submit the information again. We will review it for you as soon as possible.',
                sorryTip2:
                    'Sorry, we cannot approve your account opening application',
                question: 'if you have any question',
                connection: 'Please contact CS',
                // hkCard: '香港银行卡',
                // moreHign: '入金率更高',
                online: 'Online CS',
                phone: 'Call CS'
            }
        }
    },
    components: {
        [Swipe.name]: Swipe,
        [SwipeItem.name]: SwipeItem
    },
    computed: {
        ...mapGetters([`stepStatus`]),
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
            return `${this.$t(
                'inlandResult.phoneAlarm'
            )} <span class="iconfont icon-back right-icon"></span>`
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
                    buttonText: this.$t('inlandResult.openAccountNow'),
                    nextStep: () => {
                        this.goOpenAccount()
                    }
                },
                0: {
                    title: `${this.$t('inlandResult.complete')}${
                        this.currentStatus.precent
                    }%`,
                    tips: `${this.currentStatus.time}`,
                    buttonText: this.$t('inlandResult.continue'),
                    nextStep: () => {
                        this.goOpenAccount()
                    }
                },
                1: {
                    title: `${this.$t(
                        'inlandResult.successSubmit'
                    )}<br/>${this.$t('inlandResult.completeTime')}`,
                    tip: this.notofication,
                    nextStep: () => {
                        this.depositGuide()
                    }
                },
                2: {
                    title: `${this.$t(
                        'inlandResult.successSubmit'
                    )}<br/>${this.$t('inlandResult.completeTime')}`,
                    tip: this.notofication,
                    nextStep: () => {
                        this.depositGuide()
                    }
                },
                3: {
                    title: `${this.$t(
                        'inlandResult.successSubmit'
                    )}<br/>${this.$t('inlandResult.completeTime')}`,
                    tip: this.notofication,
                    nextStep: () => {
                        this.depositGuide()
                    }
                },
                6: {
                    title: this.$t('inlandResult.congratulations'),
                    tip1: this.$t('inlandResult.anyYuan'),
                    buttonText: this.$t('inlandResult.depositNow'),
                    logTips: `<p class="primary-color" style="text-align: center;padding-top: 15px;">${this.$t(
                        'inlandResult.depositRecords'
                    )}</p>`,
                    nextStep: () => {
                        this.goDeposit()
                    }
                },
                4: {
                    title: this.$t('inlandResult.sorryTip'),
                    buttonText: this.$t('inlandResult.editInformation'),
                    rejectTip: this.$t('inlandResult.reSubmit'),
                    nextStep: () => {
                        this.goOpenAccount()
                    }
                },
                5: {
                    title: `${this.$t('inlandResult.sorryTip2')}`,
                    tips: `<br>${this.$t(
                        'inlandResult.question'
                    )}，<span class="primary-color">${this.$t(
                        'inlandResult.connection'
                    )}</span>`
                }
            }
        },
        curInfo() {
            return this.statusMap[this.status]
        }
    },
    created() {
        this.$bus.$on('inland-init', () => {
            this.init()
        })
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
                    text: this.$t('inlandResult.online'),
                    action: () => {
                        console.log('客服')
                    }
                },
                {
                    text: this.$t('inlandResult.phone') + '：400-870-800',
                    action: () => {
                        window.location.href = 'tel:400-870-800'
                    }
                }
            ],
            bannerList: []
        }
    },
    methods: {
        ...mapMutations(['initMutation']),
        // 入金指南
        depositGuide() {
            this.$jsBridge.gotoNewWebview(
                window.location.origin +
                    `/webapp/market/generator.html?key=XY003`
            )
        },
        fundHistoryRecord() {
            this.$jsBridge.gotoNativeModule('yxzq_goto://fund_history_record')
        },
        goDeposit() {
            this.$jsBridge.gotoNativeModule(
                `yxzq_goto://webview?url=${encodeURIComponent(
                    window.location.origin +
                        '/webapp/open-account-hk/deposit.html'
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
                    await this.$store.dispatch('loginCommonAction')
                    this.resultStatus = await this.$accountService.getOpenAccountStatus()
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
            }
        },
        async goOpenAccount() {
            try {
                if (this.$jsBridge.isYouxinApp) {
                    // 未登录或者未绑定手机 先登录和邦定手机
                    // 登录成功后 如果是驳回则停留在本页面展示驳回信息 TODO
                    await this.$store.dispatch('loginCommonAction')
                    // 登录成功后需要重新查询一下状态
                    await this.init()
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
    min-height: 567px;
    background-color: #fff;
    .main-container {
        padding: 20px $global-padding;
        .bottom {
            padding-top: 80px;
        }
        .success {
            text-align: center;
            padding-bottom: 20px;
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
            padding-top: 6px;
            color: $primary-color;
            font-size: 12px;
        }
        .brand-list {
            .brand-item {
                width: 100%;
                height: 85px;
                background-color: $b-color;
                margin-right: 5px;
            }
            .brand-item:nth-child(3) {
                margin-right: 0;
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
        .h-operate {
            width: 100%;
            height: 127px;
            margin-top: 5px;
            background-color: $b-color;
            img {
                width: 100%;
                height: 127px;
            }
        }
        .open-btn {
            margin-top: 35px;
        }
    }
}
</style>
