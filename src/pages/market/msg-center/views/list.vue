<template lang="pug">
    //- van-pull-refresh.message-center-list(
        //- v-model="isRefresh"
        //- :pulling-text="$t('common.pullTextStage1')"
        //- :loosing-text="$t('common.pullTextStage2')"
        //- :loading-text="$t('common.pullTextStage3')"
        //- @refresh="onRefresh"
    //- )

    .message-center-list
        van-list(
            v-model="moreLoading"
            :finished="finished"
            :error.sync="error"
            :finished-text="list.length ? i18n.loading_all : ''"
            :immediate-check="false"
            :offset="20"
            @load="onLoad"
        )
            .null(v-if="!list.length && !moreLoading && !isRefresh && !first" style="text-align: center;")
                img(src="../img/null@2x.png")
                .text {{i18n.null}}

            component(
                :is="item_component"
                v-for='(item, index) in list'
                :key='index',
                :title="item.title",
                :content="item.content",
                :time="item.time"
                :img-url="item.imgUrl"
                :jump-params="item.jumpParams"
            )
</template>

<script>
import { List, PullRefresh } from 'vant'
import { getMsgCenterDetailList } from '@market-service/market'
import mixins from '../mixins'

const page_size = 30 // 单页加载数据条数

// 业务类型映射
const types = {
    notice: 1, // 系统公告
    remind: 2, // 业务提醒
    activity: 3 // 精选活动
}

// 系统公告
export default {
    name: 'notice',
    components: {
        'message-panel': () => import('../components/message-panel'), // 系统公告、业务提醒使用组件
        'activity-panel': () => import('../components/activity-panel'), // 精选活动使用组件
        [List.name]: List,
        [PullRefresh.name]: PullRefresh
    },
    mixins: [mixins],
    data() {
        return {
            // 下拉刷新加载
            isRefresh: false,

            // 滚动加载相关
            moreLoading: false,
            finished: false,
            error: false,

            first: true,

            item_component: 'message-panel',
            list: []
        }
    },
    computed: {
        // 多语言
        i18n() {
            return this.$t('list')
        },
        // 业务类型id
        type() {
            const { type } = this.$route.params

            // 切换动态组件
            if (type === 'activity') {
                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                this.item_component = 'activity-panel'
            } else {
                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                this.item_component = 'message-panel'
            }

            return types[type] || 1
        }
    },
    activated() {
        this.$html.setTitle(this.$t('index.sub_titles')[this.type - 1])
        this.getMsgCenterDetailList().then(() => {
            this.first = false
        })
    },
    deactivated() {
        this.list = []
        this.moreLoading = false
        this.finished = false
        this.error = false
        this.isRefresh = false
        this.first = true
    },
    methods: {
        /**
         * 下拉刷新
         */
        onRefresh() {
            // this.moreLoading = false
            // this.error = false
            // this.finished = true
            console.log('onRefresh')
            this.getMsgCenterDetailList(
                Math.floor(new Date().getTime() / 1000)
            ).then(() => {
                this.isRefresh = false
            })
        },
        /**
         * 获取消息列表
         * @returns {Promise<void>}
         */
        async getMsgCenterDetailList(refer_time = undefined) {
            try {
                let time
                if (refer_time) {
                    time = refer_time
                } else {
                    time = this.list.length
                        ? this.list[this.list.length - 1].origin_time
                        : Math.floor(new Date().getTime() / 1000)
                }

                const { list = [] } = await getMsgCenterDetailList({
                    time,
                    msgtype: this.type,
                    count: page_size,
                    opt: 'before'
                })

                if (refer_time) {
                    this.list = []
                    // if (list.length >= page_size) {
                    //     this.finished = false
                    // }
                } else if (list.length < page_size) {
                    this.finished = true
                }

                this.moreLoading = false
                this.list = (refer_time ? [] : this.list).concat(
                    list.map(item => {
                        let imgUrl = ''
                        let jumpParams = {} // 详情页跳转相关

                        if (+item.contentType === 4) {
                            try {
                                const pushPoly = JSON.parse(item.pushPloy)
                                imgUrl = pushPoly.imgUrl
                                jumpParams = {
                                    canJump: +pushPoly.isJumpPage, // 1可跳转，0不可跳转
                                    jumpType: pushPoly.jumpPageType, // 1app页面，2 web url跳转
                                    jumpPage: pushPoly.jumpPageUrl, // web url
                                    jumpApp: pushPoly.showPageUrl // app url(http://szwiki.youxin.com/pages/viewpage.action?pageId=1116777)
                                }
                            } catch (e) {
                                imgUrl = ''
                                jumpParams = {
                                    canJump: 0, // 1可跳转，0不可跳转
                                    jumpType: undefined, // 1app页面，2 web url跳转
                                    jumpPage: undefined, // web url
                                    jumpApp: undefined // app url(http://szwiki.youxin.com/pages/viewpage.action?pageId=1116777)
                                }
                            }
                        }

                        return {
                            id: item.msgId,
                            title: item.title,
                            content: item.content,
                            time: this.formatTime(item.createTime),
                            origin_time: item.createTime,
                            imgUrl,
                            jumpParams
                        }
                    })
                )
                // eslint-disable-next-line no-empty
            } catch (e) {
                this.finished = true
                this.moreLoading = false
            }
        },
        /**
         * 滚动加载更多
         */
        onLoad() {
            if (this.isRefresh) {
                this.moreLoading = false
                return
            }
            console.log('onLoad')
            this.getMsgCenterDetailList()
        }
    }
}
</script>

<style scoped lang="scss">
.message-center-list {
    min-height: 100%;
    background: #f8f8f8;

    .null {
        img {
            width: 130px;
            height: 120px;
            margin-top: 61px;
        }

        .text {
            margin-top: 10px;
            font-size: 14px;
            font-weight: 400;
            color: rgba(57, 57, 57, 0.4);
            line-height: 20px;
        }
    }
}
</style>
