<template lang="pug">
    .exclusive-area
        .block__header(
            @click="handleToPiIntro"
        )
            img(:src="headBg" width="100%")
        .block__content
            .block__tab(v-if="isBooking")
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
            .block__card__swipe(
                v-for="ele in columnList"
                v-if="ele.products"
            )
                .block__title
                    p.title {{$t(ele.columnName)}}
                    p.more(
                        v-if="isPiAccount || !ele.permissionDenied"
                        @click="hnadleToIpoList(ele.id)"
                    ) {{$t('viewMore')}}
                        span.iconfont.icon-iconEBgengduoCopy
                van-swipe(v-if="isPiAccount || !ele.permissionDenied")
                    van-swipe-item(
                        v-for="item in ele.products"
                    )
                        .card__item
                            img(:src="item.productInfo.logUrl")
                            .info.item
                                p.title {{item.productInfo.productName}}
                                p.desc {{item.productInfo.productDesc}}
                .block__locked(v-else)
                    .card__item.hide
                        img(:src="ele.products[0].productInfo.logUrl")
                        .info.item
                            p.title {{ele.products[0].productInfo.productName}}
                            p.desc {{ele.products[0].productInfo.productDesc}}
                    .mask
                        img(:src="lockedImg")
                        p.tips {{$t('onlyPi')}}
                        p.btn(@click="handleToPiIntro") {{$t('authNow')}}
</template>
<script>
import { getInvestmentCerificationResult } from '@/service/user-account-server'
import { Swipe, SwipeItem } from 'vant'
import {
    listPiColumnAndProductV1,
    commitReserveProductRecordV1
} from '@/service/customer-relationship-server'
import { ipoRedPoint } from '@/service/stock-order-server'
import { jumpUrl } from '@/utils/tools.js'
import { mapGetters } from 'vuex'
export default {
    name: 'exclusive-area',
    components: {
        [Swipe.name]: Swipe,
        [SwipeItem.name]: SwipeItem
    },
    data() {
        return {
            lockedImg: require('@/assets/img/fund/locked.png'),
            headBg: require('@/assets/img/fund/pi_head_bg.png'),
            isPiAccount: false,
            isBooking: true,
            pageNum: 1,
            pageSize: 20,
            columnList: []
        }
    },
    i18n: {
        zhCHS: {
            subscription: '国际配售认购中',
            booking: '国际配售预约中',
            bookSucess: '预约成功',
            authNow: '立即认证',
            viewMore: '查看更多',
            onlyPi: '以下内容仅PI可见',
            bookInfo:
                '我们已经收到您的预约，您对应的专属客户经理会尽快和您取得联系'
        },
        zhCHT: {
            subscription: '國際配售認購中',
            booking: '國際配售預約中',
            authNow: '立即認證',
            viewMore: '查看更多',
            onlyPi: '以下內容僅PI可見',
            bookInfo:
                '我們已經收到您的預約，您對應的專屬客戶經理會盡快和您取得聯系'
        },
        en: {
            subscription: '國際配售認購中',
            booking: '國際配售預約中',
            authNow: '立即認證',
            viewMore: '查看更多',
            onlyPi: '以下內容僅PI可見',
            bookInfo:
                '我们已经收到您的预约，您对应的专属客户经理会尽快和您取得联系'
        }
    },
    created() {
        this.getColumnAndProduct()
        this.getPiResult()
        this.getIpoRedPoint()
    },
    computed: {
        ...mapGetters(['isLogin'])
    },
    methods: {
        hnadleToIpoList(id) {
            let url = `${window.location.origin}/wealth/fund/index.html#/column-product-list?id=${id}`
            jumpUrl(3, url)
        },
        handleToPiIntro() {
            let url = `${window.location.origin}/webapp/professional-investor/profession.html`
            jumpUrl(3, url)
        },
        handleBook() {
            this.$dialog.alert({
                title: this.$t('bookSucess'),
                message: this.$t('bookInfo'),
                confirmButtonText: this.$t('iknow'),
                confirmButtonColor: '#3c78fa'
            })
        },
        async getColumnAndProduct() {
            if (!this.isLogin) return
            let param = {
                pageNum: this.pageNum,
                pageSize: this.pageSize
            }
            try {
                let res = await listPiColumnAndProductV1(param)
                this.columnList = res
                this.columnList.forEach(item => {
                    item.columnName = Object.values(JSON.parse(item.columnName))
                    item.products.forEach(product => {
                        product.productInfo.productDesc =
                            product.productInfo.productDesc[this.$i18n.lang]
                        product.productInfo.productName =
                            product.productInfo.productName[this.$i18n.lang]
                        if (this.$i18n.lang == 'zhCHS') {
                            product.productInfo.logUrl =
                                product.productInfo.logUrl.cnLogo
                        } else if (this.$i18n.lang == 'zhCHT') {
                            product.productInfo.logUrl =
                                product.productInfo.logUrl.hkLogo
                        } else {
                            product.productInfo.logUrl =
                                product.productInfo.logUrl.enLogo
                        }
                    })
                })
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        async getPiResult() {
            if (!this.isLogin) return
            try {
                let data = await getInvestmentCerificationResult()
                if (data && data.auditStatus === 4) {
                    this.isPiAccount = true
                }
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        async productRecord(id) {
            try {
                await commitReserveProductRecordV1({ productId: id })
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        async getIpoRedPoint() {
            if (!this.isLogin) return
            try {
                let data = await ipoRedPoint()
                if (data.ecmApplingCount > 0) {
                    this.isBooking = false
                }
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
        img {
            width: 68px;
            height: 50px;
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
</style>
