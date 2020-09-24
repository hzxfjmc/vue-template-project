<template lang="pug">
    .ipo__list(:class="lang")
        .product-item(v-for="item in productList")
            .card__item(@click="handleToDetail(item)" v-if="isPiAccount || item.viewPermission === 1")
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
import { listPiColumnMoreProductV1 } from '@/service/customer-relationship-server'
import { getInvestmentCerificationResult } from '@/service/user-account-server'
import { getCosUrl } from '@/utils/cos-utils'
import { jumpUrl } from '@/utils/tools.js'
import { mapGetters } from 'vuex'
import mixin from './mixins'
export default {
    name: 'ipo-list',
    mixins: [mixin],
    data() {
        return {
            productList: [],
            isPiAccount: false,
            pageNum: 1,
            pageSize: 20
        }
    },
    computed: {
        ...mapGetters(['isLogin', 'lang'])
    },
    created() {
        this.getProductList()
        this.getPiResult()
        setTimeout(() => {
            this.$setTitle(decodeURIComponent(this.$route.query.title))
        }, 0)
    },
    methods: {
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
                jumpUrl(3, item.jumpUrl)
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
            let param = {
                id: this.$route.query.id,
                pageNum: this.pageNum,
                pageSize: this.pageSize
            }
            try {
                let res = await listPiColumnMoreProductV1(param)
                if (res.length) {
                    await getCosUrl(res[0].productInfo.logUrl.cnLogo)
                }
                res.forEach(async item => {
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
                this.productList = res
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
</style>
