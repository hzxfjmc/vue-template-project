<template lang="pug">
    .exclusive-area(:class="lang")
        .block__header(
            @click="handleToPiIntro"
        )
            img(:src="$t('bg')" width="100%")
        .block__content
            .block__tab(v-if="isApplying")
                p.left
                    span.iconfont(:class="['icon-download']")
                    span {{ $t('ecmSubscribing')}}
                p.right(@click="handleToIpo")
                    span {{$t('viewNow')}}
                    span.iconfont.icon-iconEBgengduoCopy
            .block__tab(v-else-if="isSubscribing")
                p.left
                    span.iconfont(:class="['icon-iconEBshoucang']")
                    span {{$t('ipoReservation')}}
                p.right(@click="handleToIpo")
                    span {{$t('viewNow')}}
                    span.iconfont.icon-iconEBgengduoCopy
            .block__card__swipe(
                v-for="ele in columnList"
                v-if="ele.products"
                :key="ele.id"
            )
                .block__title
                    p.title {{$t(ele.columnName)}}
                    p.more(
                        v-if="isPiAccount && !ele.permissionDenied"
                        @click="hnadleToIpoList(ele.id)"
                    ) {{$t('more')}}
                        span.iconfont.icon-iconEBgengduoCopy
                .column-item(v-if="isPiAccount && !ele.permissionDenied")
                    .product-item(
                        v-for="item,index in ele.products" 
                        :key="item.id")
                        .card__item(@click="handleToDetail(item)" v-if="index<3")
                            .item-left
                                img(:src="item.productInfo.logUrl")
                                .info.item
                                    p.title {{item.productInfo.productName}}
                                    p.desc {{item.productInfo.productDesc}}
                            .item-right
                                .btn(v-if="isPiAccount"  @click.stop="handleBook(item.id)") {{$t('reserveNow')}}       
                                .btn(v-else  @click.stop="handleToPiIntro") {{$t('verifyNow')}}       
                .block__locked(v-else)
                    .card__item.hide
                        img(:src="ele.products[0].productInfo.logUrl")
                        .info.item
                            p.title {{ele.products[0].productInfo.productName}}
                            p.desc {{ele.products[0].productInfo.productDesc}}
                    .mask
                        img(:src="lockedImg")
                        p.tips {{$t('onlyPi')}}
                        p.btn(@click="handleToPiIntro") {{$t('verifyNow')}}
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
import { getCosUrl } from '@/utils/cos-utils'
import { mapGetters } from 'vuex'
import jsBridge from '@/utils/js-bridge.js'
import mixin from './mixins'
export default {
    name: 'exclusive-area',
    mixins: [mixin],
    components: {
        [Swipe.name]: Swipe,
        [SwipeItem.name]: SwipeItem
    },
    data() {
        return {
            lockedImg: require('@/assets/img/fund/locked.png'),
            headBg: require('@/assets/img/fund/pi_head_bg.png'),
            isPiAccount: false,
            isApplying: false,
            isSubscribing: false,
            pageNum: 1,
            pageSize: 20,
            columnList: []
        }
    },
    created() {
        this.getColumnAndProduct()
        this.getPiResult()
        this.getIpoRedPoint()
    },
    computed: {
        ...mapGetters(['isLogin', 'lang'])
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
        handleToDetail(item) {
            //0: '不跳转',
            //1: '跳转到对应链接',
            //2: '跳转到对应文档'
            if (item.jumpType === 0) {
                return
            } else if (item.jumpType === 1) {
                let url = `${item.jumpUrl}`
                jumpUrl(3, url)
            } else {
                this.toJumpLink(item.jumpUrl)
            }
        },
        async toJumpLink(item) {
            try {
                const res = await getCosUrl(item)
                window.location.href = res
            } catch (e) {
                console.log(e)
            }
        },
        handleToIpo() {
            jsBridge.gotoNativeModule('yxzq_goto://ipo_center')
        },
        async getColumnAndProduct() {
            //if (!this.isLogin) return
            let param = {
                pageNum: this.pageNum,
                pageSize: this.pageSize
            }
            try {
                let res = await listPiColumnAndProductV1(param)
                this.columnList = res
                this.columnList.forEach(item => {
                    item.columnName = Object.values(JSON.parse(item.columnName))
                    if (item.products) {
                        item.products.forEach(async product => {
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
                            let url = await getCosUrl(
                                product.productInfo.logUrl
                            )
                            product.productInfo.logUrl = url
                        })
                    }
                })
            } catch (e) {
                e.msg && this.$toast(e.msg)
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
                e.msg && this.$toast(e.msg)
            }
        },
        async productRecord(id) {
            try {
                await commitReserveProductRecordV1({ productId: id })
            } catch (e) {
                e.msg && this.$toast(e.msg)
            }
        },
        async getIpoRedPoint() {
            try {
                let data = await ipoRedPoint()
                this.isSubscribing = data.ecmSubCount > 0
                this.isApplying = data.ecmApplingCount > 0
            } catch (e) {
                e.msg && this.$toast(e.msg)
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
    &:first-child {
        margin-bottom: 4px;
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
    justify-content: space-between;
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
    margin-bottom: 12px;
    .item-left {
        display: flex;
        align-items: center;
    }
    .btn {
        border: 1px solid #cf9562;
        font-size: 12px;
        color: #cf9562;
        padding: 4px 5px;
        border-radius: 4px;
    }
}
.en {
    .card__item {
        .btn {
            font-size: 10px;
        }
    }
}
.info {
    padding-left: 16px;
    .title {
        padding-bottom: 4px;
        font-weight: 600;
        max-width: 110px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .desc {
        font-size: 12px;
        color: $text-color6;
        max-width: 110px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}
.en {
    .info {
        .title {
            max-width: 100px;
        }
        .desc {
            max-width: 100px;
        }
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
