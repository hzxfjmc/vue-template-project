<template lang="pug">
    .bond-index-wrapper
        FundHeaderTitle(
            :assetType="assetTypetab"
            @handlerCuenrry="handlerCuenrry"
        )
        .fund__banner
            img(:src="bannarTitleUrl")
        .fund__banner2(v-if="code != 1 && bannerShow")
            img(:src="barnnarUrl")
        .bond-list
            div(
                v-for="(item, index) in list"
                :key="index"
            )
                Card(:info="item" :assetType="assetType" :currency="currency" @click.native="goNext(item.fundId)")
            //- .no-data(v-if="list.length !== 0") 没有更多基金
        .no-bond-box(v-if="load")
            .no-bond {{ $t('noFund') }}
</template>
<script>
import { Swipe, SwipeItem } from 'vant'
import { getFundListV2 } from '@/service/finance-info-server.js'
import Card from './components/fund-card/index.vue'
import FundHeaderTitle from './components/fund-header-title/index.vue'
import { gotoNewWebView } from '@/utils/js-bridge.js'
import { mapGetters } from 'vuex'
import { getSource } from '@/service/customer-relationship-server'
export default {
    i18n: {
        zhCHS: {
            noFund: '暂无基金'
        },
        zhCHT: {
            noFund: '暫無基金'
        },
        en: {
            noFund: 'No Data'
        }
    },
    computed: {
        ...mapGetters(['appType', 'lang'])
    },
    keepalive: true,
    name: 'index',
    components: {
        [Swipe.name]: Swipe,
        [SwipeItem.name]: SwipeItem,
        Card,
        FundHeaderTitle
    },
    created() {
        this.assetType = this.$route.query.type
        this.currency = this.$route.query.currency
        this.getFundListV2()
    },
    data() {
        return {
            barnnarUrl: require('@/assets/img/fund/icon_huobi.png'),
            load: false,
            bannerShow: false,
            bannerUrl: [],
            list: [],
            pageNum: 1,
            pageSize: 20,
            total: 0,
            currency: '',
            assetType: '',
            code: 0,
            assetTypetab: '',
            bannarTitleUrl: null
        }
    },
    mounted() {
        this.assetTypetab = this.$route.query.type
        this.getSource()
    },
    methods: {
        //获取用户归属 1大陆 2香港
        async getSource() {
            try {
                const { code } = await getSource()
                if (this.isLogin) {
                    this.code = code
                } else {
                    this.code = this.appType.Hk ? 2 : 1
                }
                console.log(this.code)
                this.bannarTitleUrl =
                    this.code != 1
                        ? require(`@/assets/img/fund/fundImg/${this.lang}/fundAll.png`)
                        : require(`@/assets/img/fund/fundImg/${this.lang}/fundAll1.png`)
                console.log(this.bannarTitleUrl)
                if (this.$route.query.type) {
                    this.changeBannarTitle()
                }
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        handlerCuenrry(data) {
            this.currency = data.currency
            this.assetType = data.assetType
            this.bannerShow = data.assetType === '4' || data.assetType === '2'
            this.barnnarUrl =
                data.assetType === '4'
                    ? require(`@/assets/img/fund/fundImg/${this.lang}/huobi.png`)
                    : require(`@/assets/img/fund/fundImg/${this.lang}/zhaiquan.png`)
            if (data.key) {
                this.bannarTitleUrl =
                    this.code != 1
                        ? require(`@/assets/img/fund/fundImg/${this.lang}/${data.key}.png`)
                        : require(`@/assets/img/fund/fundImg/${this.lang}/${data.key}1.png`)
            }
            this.getFundListV2()
        },
        // 获取基金列表
        async getFundListV2() {
            try {
                this.list = []
                const { list } = await getFundListV2({
                    displayLocation: 1,
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    assetType: this.assetType,
                    currency: this.currency
                })
                this.list = list
                this.load = this.list.length == 0
            } catch (e) {
                this.$toast(e.msg)
                console.log('getListFundInfo:error:>>>', e)
            }
        },
        goNext(fundId) {
            let url = `${window.location.origin}/wealth/fund/index.html#/fund-details?id=${fundId}`
            gotoNewWebView(url)
        },
        changeBannarTitle() {
            let bannarEmun = {
                1: 'fundShares',
                2: 'fundBond',
                3: 'fundBlend',
                4: 'fundCurrency'
            }
            this.bannarTitleUrl =
                this.code != 1
                    ? require(`@/assets/img/fund/fundImg/${this.lang}/${
                          bannarEmun[this.$route.query.type]
                      }.png`)
                    : require(`@/assets/img/fund/fundImg/${this.lang}/${
                          bannarEmun[this.$route.query.type]
                      }1.png`)
            this.bannerShow = this.assetType === '4' || this.assetType === '2'
            this.barnnarUrl =
                this.assetType === '4'
                    ? require(`@/assets/img/fund/fundImg/${this.lang}/huobi.png`)
                    : require(`@/assets/img/fund/fundImg/${this.lang}/zhaiquan.png`)
        }
    },
    watch: {
        $route(to, from) {
            if (
                from.path === '/home' ||
                from.path === '/fund-index' ||
                from.path === '/'
            ) {
                this.assetType = this.$route.query.type
                this.currency = this.$route.query.currency
                this.assetTypetab = this.$route.query.type
                this.getFundListV2()
                this.getSource()
                if (this.$route.query.type) {
                    this.changeBannarTitle()
                }
            }
        }
    }
    // beforeRouteEnter(to, from, next) {
    //     console.log(to)
    //     // to.meta.title = to.query.assetTypeName
    //     next()
    // }
}
</script>
<style lang="scss" scoped>
.bond-index-wrapper {
    min-height: 100%;
    padding-bottom: 77px;
    .banner {
        width: 375px;
        height: 150px;
        a {
            display: block;
            height: 100%;
            img {
                height: 100%;
                width: 100%;
            }
        }
    }
    .bond-list {
        padding: 0 10px;
    }
    .no-data {
        padding: 10px 0 7px;
        color: $text-color3;
        font-size: 0.24rem;
        line-height: 17px;
        text-align: center;
    }
    .no-bond-box {
        padding-top: 150px;
        .no-bond {
            width: 130px;
            height: 120px;
            margin: 0 auto;
            padding-top: 100px;
            background: url('~@/assets/img/bond/icon-nobond.png') center 15px
                no-repeat;
            background-size: 110px;
            color: $text-color3;
            font-size: 0.28rem;
            line-height: 20px;
            text-align: center;
            box-sizing: border-box;
        }
    }
}
.fund__banner {
    width: 100%;
    img {
        width: 100%;
    }
}
.fund__banner2 {
    width: 90%;
    margin: 17px 5%;
    img {
        width: 100%;
    }
}
</style>
