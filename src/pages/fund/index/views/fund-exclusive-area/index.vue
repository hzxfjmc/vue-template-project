<template lang="pug">
    .exclusive-area
        .block__header
            img(:src="img2" width="100%")
        .block__content
            .block__tab(v-if="true")
                p.left
                    span.iconfont.icon-iconEBshoucang
                    span {{$t('booking')}}
                p.right
                    span.iconfont.icon-iconEBgengduoCopy
            .block__tab(v-else)
                p.left
                    span.iconfont.icon-download
                    span {{$t('subscription')}}
                p.right
                    span.iconfont.icon-iconEBgengduoCopy
            .block__card__swipe
                .block__title
                    p.title {{$t('ipoTitle')}}
                    p.more(@click="hnadleToIpoList") {{$t('viewMore')}}
                        span.iconfont.icon-iconEBgengduoCopy
                van-swipe(
                    :show-indicators="false"
                )
                    van-swipe-item(v-for="i in 3")
                        .card__item
                            img(:src="img2" width="136px" height="76px")
                            .info.item
                                p.title 农夫山泉IPO锚定基金
                                p.desc 这个基金有点“甜
            .block__card
                .left
                    img(:src="img2")
                    .info
                        p.title 农夫山泉IPO锚定基金
                        p.desc 这个基金有点“甜
                .btn(@click="handleBook") {{$t('bookNow')}}
            .block__locked
                .card__item.hide
                    img(:src="img2" width="136px" height="76px")
                    .info.item
                        p.title 农夫山泉IPO锚定基金
                        p.desc 这个基金有点“甜
                .mask
                    img(:src="img1" width="68px" height="50px")
                    p.tips {{$t('onlyPi')}}
                    p.btn {{$t('authNow')}}
            .block__title
                p.title {{$t('exclusive')}}
            .block__ipo__card
                .card__header
                    .head__left
                        img(:src="img2" width="40px" height="40px")
                        .card__info
                            p.title 五矿国际信托有限公司
                            p.desc 我是一句话一句话一句
                    .head__right 募集中
                .card__content
                    .content__left
                        p.top 近一年表现
                        p.num +22.33%
                    .content__right 
                        p.top 封闭期
                        p.num 3个月
                .card__tabs
                    van-tag(
                        plain
                        color="#CF9562"
                    ) {{$t('viewNow')}}
</template>
<script>
import jsBridge from '@/utils/js-bridge'
import { Swipe, SwipeItem, Tag } from 'vant'
import fundTag from '@/biz-components/fund-tag/index.vue'
import { listPiColumnMoreProductV1 } from '@/service/customer-relationship-server'
export default {
    name: 'exclusive-area',
    components: {
        [Swipe.name]: Swipe,
        [SwipeItem.name]: SwipeItem,
        [Tag.name]: Tag,
        'fund-tag': fundTag
    },
    data() {
        return {
            img1: require('@/assets/img/fund/locked.png'),
            img2: require('@/assets/img/fund/img/2.png'),
            pageNum: 1,
            pageSize: 20
        }
    },
    i18n: {
        zhCHS: {
            subscription: '国际配售认购中',
            booking: '国际配售预约中',
            viewNow: '立即查看',
            bookNow: '即刻预约',
            bookSucess: '预约成功',
            authNow: '立即认证',
            viewMore: '查看更多',
            ipoTitle: '优质企业IPO锚定基金',
            onlyPi: '以下内容仅PI可见',
            exclusive: '尊享产品',
            bookInfo:
                '我们已经收到您的预约，您对应的专属客户经理会尽快和您取得联系'
        },
        zhCHT: {
            subscription: '国际配售认购中',
            booking: '国际配售预约中',
            viewNow: '立即查看',
            bookNow: '即可预约',
            authNow: '立即认证',
            viewMore: '查看更多',
            ipoTitle: '优质企业IPO锚定基金',
            onlyPi: '以下内容仅PI可见'
        },
        en: {
            subscription: '国际配售认购中',
            booking: '国际配售预约中',
            viewNow: '立即查看',
            bookNow: '立即预约',
            viewMore: '查看更多',
            ipoTitle: '优质企业IPO锚定基金',
            onlyPi: '以下内容仅PI可见'
        }
    },
    created() {
        this.getProductList()
    },
    methods: {
        hnadleToIpoList() {
            let url = `${window.location.origin}/wealth/fund/index.html#/fund-ipo-list`
            this.openWebView(url)
        },
        async openWebView(url) {
            if (jsBridge.isYouxinApp) {
                jsBridge.gotoNewWebview(url)
            } else {
                location.href = url
            }
        },
        handleBook() {
            this.$dialog.alert({
                title: this.$t('bookSucess'),
                message: this.$t('bookInfo'),
                confirmButtonText: this.$t('iknow'),
                confirmButtonColor: '#3c78fa'
            })
        },
        async getProductList() {
            let param = {
                pageNum: this.pageNum,
                pageSize: this.pageSize
            }
            try {
                let res = await listPiColumnMoreProductV1(param)
                this.productList = res
            } catch (e) {
                this.$toast(e.msg)
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.block__content {
    padding: 12px;
}
.block__tab {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px;
    color: #cf9562;
    background: $background-color;
    border-radius: 4px;
    .left {
        font-size: 15px;
        .iconfont {
            font-size: 18px;
            padding-right: 3px;
        }
    }
}
.block__title {
    margin: 20px 0 12px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title {
        font-size: 18px;
        font-weight: 600;
        line-height: 25px;
        color: #622e01;
    }
    .more {
        font-size: 10px;
        line-height: 14px;
        color: $text-color6;
        .iconfont {
            font-size: 12px;
        }
    }
}

.card__item {
    padding: 12px;
    display: flex;
    align-items: center;
    border-radius: 4px;
    background: $background-color;
    box-shadow: 0px 2px 6px 0px rgba(25, 25, 25, 0.05);
    &.hide {
        filter: blur(2px);
        opacity: 0.2;
        padding: 25px 12px;
    }
    img {
        width: 136px;
        height: 76px;
        border-radius: 4px;
    }
}
.info {
    padding-left: 8px;
    &.item {
        padding-left: 16px;
    }
    .title {
        padding-bottom: 4px;
        font-weight: 600;
    }
    .desc {
        font-size: 12px;
        color: $text-color6;
    }
}
.block__locked {
    margin-top: 10px;
    .mask {
        position: relative;
        width: 100%;
        height: 126px;
        margin-top: -126px;
        padding: 7px 0 12px 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        z-index: 999;
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.6);
        .tips {
            font-weight: 600;
        }
    }
    .btn {
        padding: 4px 8px;
        font-size: 12px;
        color: #fff;
        border-radius: 4px;
        background: #cf9562;
    }
}
.block__card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 12px;
    padding: 12px;
    border-radius: 4px;
    background: $background-color;
    box-shadow: 0px 2px 6px 0px rgba(25, 25, 25, 0.05);
    .left {
        display: flex;
        align-items: center;
    }
    .btn {
        padding: 4px 8px;
        font-size: 12px;
        border: 1px solid #cf9562;
        border-radius: 4px;
    }
    img {
        width: 91px;
        height: 51px;
        border-radius: 2px;
    }
}
.block__ipo__card {
    position: relative;
    height: 212px;
    background: url('~@/assets/img/fund/pi_bg.png');
    background-size: 359px 216px;
    background-position: bottom -4px left -4px;
    box-shadow: 0px 2px 4px 0px rgba(25, 25, 25, 0.05);
    border-radius: 6px;
    .card__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 0 12px 15px;
        img {
            width: 40px;
            height: 40px;
            border-radius: 6px;
        }
    }
    .head__left {
        display: flex;
    }
    .card__info {
        padding-left: 4px;
        .title {
            font-size: 16px;
            font-weight: 600;
            color: #622e01;
        }
        .desc {
            color: #d09967;
        }
    }
    .head__right {
        padding: 5px 16px 5px 12px;
        background: #fbe0a8;
        font-size: 12px;
        line-height: 17px;
        border-radius: 100px 0px 0px 100px;
    }
    .card__content {
        display: flex;
        padding: 19px 0 0 12px;
        border-top: 1px solid rgba(220, 208, 195, 0.24);
    }
    .content__left,
    .content__right {
        .top {
            font-size: 12px;
            color: #d09967;
        }
        .num {
            font-size: 28px;
            color: #622e01;
        }
    }
    .content__right {
        margin-left: 48px;
    }
    .card__tabs {
        position: absolute;
        bottom: 15px;
        margin-left: 16px;
    }
    .van-tag--plain {
        font-size: 10px;
        padding: 1px 5px;
        text-align: center;
    }
}
</style>
