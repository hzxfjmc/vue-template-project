<template lang="pug">
    //- van-pull-refresh.message-center-index(
        //- v-model="isLoading"
        //- :pulling-text="$t('common.pullTextStage1')"
        //- :loosing-text="$t('common.pullTextStage2')"
        //- :loading-text="$t('common.pullTextStage3')"
        //- @refresh="onRefresh"
    //- )

    .message-center-index
        van-notice-bar(
            v-if="showNoticeBar"
            :text="i18n.tip"
            mode="closeable"
            @close="closeNotice()",
            background="#538fff"
            color="white"
        )
        .open(v-if="showNoticeBar" @click="permitNotice()") {{i18n.open}}

        no-data(v-if="!list.length && !listFirstLoading" text="")

        message-type-item(
            v-for="item in list"
            :key="item.id"
            :title="item.title"
            :content="item.content"
            :icon="item.icon"
            :time="item.time",
            :border='item.border',
            :class='item.id'
            :has-new='item.new'
            @click.native="openList(item.id)"
        )
</template>

<script>
import { NoticeBar, PullRefresh, Toast } from 'vant'
import MessageTypeItem from '../components/message-type-item'
import { getMsgCenterIndex, markAllMessageRead } from '@market-service/market'
import mixins from '../mixins'
import NoData from '@market-components/no-data'

// 消息类型列表默认数据
const list_default = [
    {
        id: 'notice',
        title: '系統通知',
        icon: 'notice',
        border: true
    },
    {
        id: 'remind',
        title: '業務提醒',
        icon: 'remind',
        border: true
    },
    {
        id: 'activity',
        title: '精選活動',
        icon: 'activity'
    },
    {
        id: 'service',
        title: '在線客服',
        icon: 'service'
    }
]

// 消息中心首页
export default {
    name: 'index',
    components: {
        [NoticeBar.name]: NoticeBar,
        [PullRefresh.name]: PullRefresh,
        'message-type-item': MessageTypeItem,
        NoData
    },
    mixins: [mixins],
    data() {
        return {
            isLoading: false,
            showNoticeBar: false,
            listFirstLoading: true,
            list: [] // 消息类型列表
        }
    },
    computed: {
        i18n() {
            return this.$t('index')
        }
    },
    activated() {
        this.$html.setTitle(this.i18n.title)
        this.setTitleBar()
        this.getMsgCenterIndex()

        this.setNotificationBar()
        this.$jsBridge.watchPageActivity(this.setNotificationBar)
    },
    deactivated() {
        this.clearTitleBar()
    },
    methods: {
        /**
         * 下拉刷新
         */
        onRefresh() {
            this.getMsgCenterIndex().then(() => {
                this.isLoading = false
            })
        },
        /**
         * 隐藏通知栏
         */
        closeNotice() {
            localStorage.setItem(
                'system-notice-close-time',
                new Date().getTime().toString()
            )
            this.showNoticeBar = false
        },
        /**
         * 开通通知
         */
        permitNotice() {
            this.$jsBridge.callApp('command_open_notification')
        },
        /**
         * 打开通知列表
         * @param type
         */
        openList(type) {
            // 客服页面
            if (type === 'service') {
                try {
                    this.$jsBridge.gotoNativeModule(
                        'yxzq_goto://customer_service'
                    )
                } catch (e) {
                    location.href =
                        'https://shenzhenudesk2018.udesk.cn/im_client/?web_plugin_id=58977&group_id=92058'
                }
            } else {
                // 系统公告、业务提醒、精选活动
                this.$router.push(`/list/${type}`)

                this.$messageBuriedPoint({
                    prop_view_name: new Map([
                        ['notice', '系统公告'],
                        ['remind', '业务提醒'],
                        ['activity', '精选活动']
                    ]).get(type)
                })
            }
        },
        /**
         * 获取消息中心主页消息
         * @returns {Promise<void>}
         */
        async getMsgCenterIndex() {
            try {
                const data = await getMsgCenterIndex()
                let hasNew = false

                // 系统通知、业务提醒、精选活动
                for (let i = 0; i < 3; i++) {
                    let key = `type${i + 1}`
                    const _hasNew = !!+data[key].newFlag
                    this.$set(this.list, i, {
                        ...list_default[i],
                        time: this.formatTime(data[key].createTime),
                        content: data[key].content,
                        new: _hasNew,
                        title: this.i18n.sub_titles[i]
                    })
                    if (_hasNew) hasNew = true
                }

                // 通知客户端有未读消息
                this.noticeAppMessageStatus(!hasNew)

                //// 在线客服
                // this.$set(this.list, 3, {
                //     ...list_default[3],
                //     time: '',
                //     content: this.i18n.service_tip,
                //     new: false,
                //     title: this.i18n.sub_titles[3]
                //// })

                this.listFirstLoading = false
            } catch (e) {
                this.listFirstLoading = false
                console.log('获取消息中心主页消息失败:', e)
            }
        },
        /**
         *  全部标记已读
         */
        async markAllMessageRead() {
            const user = await this.$jsBridge.callApp('get_user_info')

            // 未登录
            if (!user.userToken) {
                this.$jsBridge.callApp('command_user_login')
                return
            }

            try {
                await markAllMessageRead()

                this.list = this.list.map(item => {
                    return {
                        ...item,
                        new: false
                    }
                })
                Toast(this.i18n.flag_success)

                this.noticeAppMessageStatus(true)

                this.$messageBuriedPoint({
                    prop_view_name: '标记已读'
                })
            } catch (e) {
                Toast(this.i18n.flag_error)
            }
        },
        /**
         * 设置头部消息已读
         */
        setTitleBar() {
            this.$jsBridge.registerFn('messageReadMarkHandler', () => {
                this.markAllMessageRead()
            })

            this.$jsBridge.callApp('command_set_titlebar_button', {
                type: 'text',
                position: 2,
                text: this.i18n.button_text,
                clickCallback: 'messageReadMarkHandler'
            })
        },
        /**
         * 清空菜单栏菜单
         */
        clearTitleBar() {
            if (!this.$jsBridge.isYouxinApp) return

            this.$jsBridge.unregisterFn('messageReadMarkHandler')
            this.$jsBridge.callApp('command_set_titlebar_button', {
                type: 'hide',
                position: 2,
                text: '',
                clickCallback: ''
            })
        },
        /**
         * 點擊“x”，小黃條文案消失隱藏，如系統檢測未開啟，需每隔3天再次提示，如10-01关闭，10-04需再次提示；
         * @returns {boolean}
         */
        needReshowNotice() {
            const time = localStorage.getItem('system-notice-close-time') || 0,
                current = new Date().getTime()
            let need = false

            if (current - time > 3 * 24 * 60 * 60 * 1000) {
                need = true
            }
            return need
        },
        /**
         * 通知客户端消息状态
         * @param status true: 全部已读，false: 有未读消息
         */
        noticeAppMessageStatus(status) {
            this.$jsBridge.callApp('command_all_msg_read', {
                read: status
            })
        },
        /**
         * 设置通知栏显隐
         */
        setNotificationBar() {
            this.$jsBridge.callApp('get_notification_status').then(res => {
                if (res.status === 'false' || !res.status) {
                    if (this.needReshowNotice()) {
                        this.showNoticeBar = true
                    }
                } else {
                    this.showNoticeBar = false
                }
            })
        }
    }
}
</script>

<style scoped lang="scss">
.message-center-index {
    width: 100%;
    min-height: 100%;
    background: #f8f8f8;

    .open {
        position: absolute;
        top: 5px;
        right: 43px;
        font-size: 14px;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
    }

    .van-notice-bar {
        height: 32px;
        padding-right: 120px;
    }

    .service {
        margin-top: 10px;
    }
}
</style>
