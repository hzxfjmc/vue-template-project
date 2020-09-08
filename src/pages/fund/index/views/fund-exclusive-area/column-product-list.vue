<template lang="pug">
    .ipo__list
        .block__card(v-for="item in productList")
            .block__top
                img(:src="item.productInfo.logUrl")
                .info
                    p.title {{item.productInfo.productName}}
                    p.desc {{item.productInfo.productDesc}}
            .block__btn
                .btn--left(
                    v-if="isPiAccount || item.viewPermission === 1"
                    @click="handleBook(item.id)"
                ) {{$t('reserveNow')}}
                .btn--left(
                    v-else
                    @click="handleToPiAuth"
                ) {{$t('verifyNow')}}
                .btn--right(@click="handleToDetail(item)") {{$t('detail')}}
</template>
<script>
import { listPiColumnMoreProductV1 } from '@/service/customer-relationship-server'
import { commitReserveProductRecordV1 } from '@/service/customer-relationship-server'
import { getInvestmentCerificationResult } from '@/service/user-account-server'
import { getCosUrl } from '@/utils/cos-utils'
import { jumpUrl } from '@/utils/tools.js'
import { mapGetters } from 'vuex'
export default {
    name: 'ipo-list',
    data() {
        return {
            productList: [],
            isPiAccount: false,
            pageNum: 1,
            pageSize: 20
        }
    },
    i18n: {
        zhCHS: {
            reserveNow: '即刻预约',
            verifyNow: '立即认证',
            detail: '查看详情',
            reserveSuccessful: '预约成功',
            bookInfo:
                '我们已经收到您的预约，您对应的专属客户经理会尽快和您取得联系'
        },
        zhCHT: {
            reserveNow: '即刻預約',
            verifyNow: '立即認證',
            detail: '查看詳情',
            reserveSuccessful: '預約成功',
            bookInfo:
                '我們已經收到您的預約，您對應的專屬客戶經理會盡快和您取得聯系'
        },
        en: {
            reserveNow: 'Reserve Now',
            verifyNow: 'Verify Now',
            detail: 'Detail',
            reserveSuccessful: 'Reserve Successful',
            bookInfo: 'The following content is visible only to PI'
        }
    },
    computed: {
        ...mapGetters(['isLogin'])
    },
    created() {
        this.getProductList()
        this.getPiResult()
    },
    methods: {
        async handleBook(id) {
            try {
                await commitReserveProductRecordV1({ productId: id })
                this.$dialog.alert({
                    title: this.$t('reserveSuccessful'),
                    message: this.$t('bookInfo'),
                    confirmButtonText: this.$t('iknow'),
                    confirmButtonColor: '#3c78fa'
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
        handleToDetail(item) {
            if (item.jumpType === 0) {
                return
            } else if (item.jumpType === 1) {
                let url = `${window.location.origin}/${item.jumpUrl}`
                jumpUrl(3, url)
            } else {
                this.toJumpLink(item.jumpUrl)
            }
        },
        handleToPiAuth() {
            this.$jsBridge.gotoNewWebview(
                window.location.origin +
                    '/webapp/professional-investor/profession.html'
            )
        },
        async getProductList() {
            if (!this.isLogin) return
            let param = {
                id: this.$route.query.id,
                pageNum: this.pageNum,
                pageSize: this.pageSize
            }
            try {
                let res = await listPiColumnMoreProductV1(param)
                this.productList = res
                this.productList.forEach(async item => {
                    if (this.$i18n.lang == 'zhCHS') {
                        item.productInfo.productName =
                            item.productInfo.productName.zhCHS
                        item.productInfo.productDesc =
                            item.productInfo.productDesc.zhCHS
                        let url = await getCosUrl(
                            item.productInfo.logUrl.cnLogo
                        )
                        item.productInfo.logUrl = url
                    } else if (this.$i18n.lang == 'zhCHT') {
                        item.productInfo.productName =
                            item.productInfo.productName.zhCHT
                        item.productInfo.productDesc =
                            item.productInfo.productDesc.zhCHT
                        let url = await getCosUrl(
                            item.productInfo.logUrl.hkLogo
                        )
                        item.productInfo.logUrl = url
                    } else {
                        item.productInfo.productName =
                            item.productInfo.productName.en
                        item.productInfo.productDesc =
                            item.productInfo.productDesc.en
                        let url = await getCosUrl(
                            item.productInfo.logUrl.enLogo
                        )
                        item.productInfo.logUrl = url
                    }
                })
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        async toJumpLink(item) {
            try {
                const res = await getCosUrl(item)
                window.location.href = res
            } catch (e) {
                console.log(e)
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.ipo__list {
    padding: 12px;
}
.block__card {
    margin-bottom: 8px;
    border-radius: 4px;
    background: $background-color;
    box-shadow: 0px 2px 6px 0px rgba(25, 25, 25, 0.2);
    .block__top {
        padding: 12px;
        display: flex;
        .info {
            padding-left: 8px;
            .title {
                padding-bottom: 4px;
                font-weight: 600;
            }
            .desc {
                font-size: 12px;
                color: $text-color6;
            }
        }
    }
    .block__btn {
        display: flex;
        .btn--left,
        .btn--right {
            flex: 1;
            padding: 4px 8px;
            font-size: 12px;
            text-align: center;
        }
        .btn--left {
            background: $sell-color;
        }
        .btn--right {
            background: $primary-color;
        }
    }
    img {
        width: 91px;
        height: 51px;
        border-radius: 2px;
    }
}
</style>
