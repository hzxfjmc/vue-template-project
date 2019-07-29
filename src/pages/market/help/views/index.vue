<template lang="pug">
    .help-home
        .help-main
            banner(:list="bannerList")
            .help-main-content(:class="{'none-banner':bannerList.length===0}")
                search(v-model="value")
                .help-list-box
                    .help-list(v-for="(item) in list" :key="item.id")
                        .list-title
                            span.title-wrap(@click="goOneList(item)")
                                img(v-if="item.icon" :src="item.icon" class="icon")
                                span.title-text {{item.name}}
                            span(class="more-link" @click="goOneList(item)") {{$t('helpIndex.more')}}
                        .list-content
                            .content-list(
                                v-for="(childItem) in item.list"
                                :key="childItem.id"
                                @click="goDetail(childItem)"
                            )
                                .list-inner
                                    span.title-text {{childItem.title}}
                                    van-icon(name="arrow" class="icon")
            van-dialog(
                class="tel-dialog"
                v-model="telDialog"
                :show-confirm-button="false"
                :close-on-click-overlay="true"
            )
                .tel-dialog-title {{$t('helpIndex.telContact')}}
                .tel-dialog-content 400-870-0000
                .tel-dialog-footer
                    van-button(class="footer-btn" @click="cancel") {{$t('helpIndex.cancel')}}
                    a(href="tel:400-870-0000" class="footer-btn tel-btn") {{$t('helpIndex.contact')}}
        .help-bottom
            van-row
                van-col(:span="'12'")
                    a(@click="customService")
                        img(src="@/assets/img/market/help/kefu@2x.png" class="icon")
                        span(class="icon-text") {{$t('helpIndex.onlineService')}}
                <!--van-col(:span="'8'")-->
                    <!--a(@click="contact")-->
                        <!--img(src="@/assets/img/market/help/dianhua@2x.png" class="icon")-->
                        <!--span(class="icon-text") {{$t('helpIndex.telContact')}}-->
                van-col(:span="'12'")
                    a(@click="feedback")
                        img(src="@/assets/img/market/help/yijian@2x.png" class="icon")
                        span(class="icon-text") {{$t('helpIndex.feedback')}}
</template>

<script>
import config from '../../0-config'
import JSBridge from '@/utils/js-bridge'
import { Row, Col, Icon, Button, Toast } from 'vant'
import search from '../components/help-search.vue'
import banner from '../components/help-banner.vue'
import helpMixins from '../mixins/index'
import { getBanner, getHomePageList } from '../../0-service/help'

export default {
    mixins: [helpMixins],
    i18n: {
        zhCHS: {
            helpIndex: {
                more: '查看更多',
                telContact: '电话咨询',
                cancel: '取消',
                contact: '呼叫',
                onlineService: () => {
                    return config.isHK ? '联系客服' : '在线客服'
                },
                feedback: '意见反馈'
            }
        },
        zhCHT: {
            helpIndex: {
                more: '查看更多',
                telContact: '電話諮詢',
                cancel: '取消',
                contact: '致電',
                onlineService: () => {
                    return config.isHK ? '聯繫客服' : '線上客服'
                },
                feedback: '意見反映'
            }
        },
        en: {
            helpIndex: {
                more: 'View More',
                telContact: 'Call Us',
                cancel: 'Cancel',
                contact: 'Call',
                onlineService: () => {
                    return config.isHK
                        ? 'Contact CS'
                        : 'Online Customer Support'
                },
                feedback: 'Feedback'
            }
        }
    },
    data() {
        return {
            value: '',
            telDialog: false, //电话dialog
            bannerList: [],
            list: []
        }
    },
    created() {
        this.getBanner()
        this.getList()
    },
    methods: {
        async getBanner() {
            let params = {
                show_page: 9
            }
            try {
                let data = await getBanner(params)
                const { banner_list = [] } = data || {}
                let list = banner_list || []
                this.bannerList = [...list]
            } catch (e) {
                Toast(e.msg || this.$t('serveError'))
            }
        },
        async getList() {
            try {
                let data = await getHomePageList({})
                const { homepagelist = [] } = data || {}
                let list = homepagelist || []
                this.list = [...list]
            } catch (e) {
                Toast(e.msg || this.$t('serveError'))
            }
        },
        customService() {
            JSBridge.callApp('command_contact_service')
        },
        // 跳转个人中心意见反馈
        feedback() {
            JSBridge.gotoNativeModule('yxzq_goto://feedback')
        },
        // 电话弹窗
        contact() {
            this.telDialog = true
        },
        cancel() {
            this.telDialog = false
        },
        goOneList(item = {}) {
            this.$router.push({
                path: `list/${item.id}`,
                query: {
                    title: item.name
                }
            })
        }
    },
    components: {
        [Row.name]: Row,
        [Col.name]: Col,
        [Icon.name]: Icon,
        [Button.name]: Button,
        banner,
        search
    }
}
</script>

<style lang="scss">
$blue: #0155fe;
.help-home {
    display: flex;
    flex-direction: column;
    letter-spacing: 0.5px;
    height: 100%;
    .help-main {
        flex: 1;
        overflow: auto;
        -webkit-overflow-scrolling: touch;

        .help-main-content {
            position: relative;
            padding-top: 20px;
            &.none-banner {
                margin-top: 35px;
            }
            .help-search {
                position: absolute;
                left: 0;
                top: -20px;
                width: 100%;
                z-index: 1;
            }
            .help-list-box {
                padding: 0 28px;
                /*一级列表*/
                .help-list {
                    padding: 14px 0 10px;
                    & + .help-list {
                        border-top: 1px solid rgba(235, 235, 235, 0.5);
                    }

                    .list-title {
                        margin-bottom: 10px;
                        font-size: 18px;
                        line-height: 1.2;
                        color: $blue;
                        .title-text,
                        .icon {
                            display: inline-block;
                            vertical-align: middle;
                            font-weight: 500;
                        }
                        .title-text {
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            max-width: 60%;
                        }

                        .icon {
                            width: 22px;
                            max-height: 22px;
                            margin-right: 4px;
                            line-height: 1;
                        }

                        .more-link {
                            float: right;
                            font-size: 14px;
                            line-height: 22px;
                            color: rgba(#353547, 0.5);
                        }
                    }

                    .list-content {
                        /*三级列表*/
                        .content-list {
                            padding: 4px 0;
                            .list-inner {
                                position: relative;
                                display: block;
                                padding-right: 20px;
                                font-size: 14px;
                                line-height: 24px;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                .icon {
                                    position: absolute;
                                    right: 0;
                                    top: 50%;
                                    margin-top: -6px;
                                    color: rgba(#353547, 0.2);
                                }
                            }
                        }
                    }
                }
            }
        }
        .van-dialog {
            text-align: center;
            line-height: 22px;
            .tel-dialog-title {
                padding: 32px 0 26px;
                font-size: 16px;
            }
            .tel-dialog-content {
                padding-bottom: 39px;
                font-size: 20px;
            }
            .tel-dialog-footer {
                display: flex;
                align-items: stretch;
                border-top: 1px solid rgba(#e1e1e1, 0.5);
                color: #353547;
                .footer-btn {
                    flex: 1;
                    font-size: 14px;
                    line-height: 44px;
                    color: rgba(#353547, 0.7);
                    & + .footer-btn {
                        border-left: 1px solid rgba(#e1e1e1, 0.5);
                    }
                }
                .tel-btn {
                    color: #3c78fa;
                }
            }
        }
    }

    .help-bottom {
        text-align: center;
        box-shadow: 0px 2px 6px 0px rgba(161, 161, 161, 0.46);

        .van-col {
            position: relative;

            & + .van-col {
                &:before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 50%;
                    width: 1px;
                    height: 20px;
                    margin-top: -10px;
                    background: rgba(235, 235, 235, 1);
                }
            }
        }

        a {
            display: block;
            padding: 18px 10px;
            line-height: 1;
            color: $blue;

            .icon {
                display: inline-block;
                vertical-align: middle;
                width: 20px;
            }

            .icon-text {
                display: block;
                margin-top: 6px;
                font-size: 12px;
                line-height: 16px;
            }
        }
    }
}
</style>
