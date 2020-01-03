<template lang="pug">
    .bond-index-wrapper
        .block__fund--header
            FundHeaderTitle(
                :assetType="assetTypetab"
                @handlerCuenrry="handlerCuenrry"
            )
            .fund__banner
                img(:src="bannarTitleUrl" @click="goBarnner")
            .fund__banner2(v-if="code != 1 && bannerShow")
                img(:src="barnnarUrl")
            .block__fund--currey
                .block__fund--left
                    span {{$t('FeatureFund')}}
                .block__fund--right(@click="currencyShow=true")
                    span {{labelTitle||currencyList['fundAllType'].label}}
                    em.iconfont(:class="currencyShow?'icon-icon-top':'icon-icon-bottom'")
                .block__master(v-if="currencyShow")
                    .block__list--element.border-top(
                        :class="active === index ?'active':''"
                        @click="handlerType(item,index)"
                        v-for="(item,index) in currencyList")
                        .block__list--left {{item.label}}
                        .block__list--icon.iconfont.icon-tick-(v-if="active===index")
        .block__fund--master(
            v-if="currencyShow"
            @touchstart.prevent="currencyShow = !currencyShow")
        .bond-list
            div(
                v-for="(item, index) in list"
                :key="index"
            )
                Card(:info="item" :assetType="assetType" :currency="currency" @click.native="goNext(item.fundId)")
        .no-bond-box(v-if="load")
            .no-bond {{ $t('noFund') }}
</template>
<script>
import { Swipe, SwipeItem } from 'vant'
import { getFundListV2 } from '@/service/finance-info-server.js'
import Card from './components/fund-card/index.vue'
import FundHeaderTitle from './components/fund-header-title/index.vue'
// import { gotoNewWebView } from '@/utils/js-bridge.js'
import { jumpUrl } from '@/utils/tools.js'
import { mapGetters } from 'vuex'
import LS from '@/utils/local-storage'
import { getSource } from '@/service/customer-relationship-server'
export default {
    i18n: {
        zhCHS: {
            noFund: '暂无基金',
            fundAllType: '全部币种',
            fundHkdType: '港币基金',
            FeatureFund: '精选基金',
            fundUsdType: '美元基金'
        },
        zhCHT: {
            noFund: '暫無基金',
            fundAllType: '全部幣種',
            fundHkdType: '港幣基金',
            FeatureFund: '精選基金',
            fundUsdType: '美元基金'
        },
        en: {
            noFund: 'No Data',
            fundAllType: 'ALL CURR',
            fundHkdType: 'HKD Fund',
            FeatureFund: 'Feature Fund',
            fundUsdType: 'USD Fund'
        }
    },
    computed: {
        ...mapGetters(['appType', 'lang', 'isLogin'])
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
            currencyShow: false,
            barnnarUrl: require('@/assets/img/fund/icon_huobi.png'),
            load: false,
            bannerShow: false,
            bannerUrl: [],
            labelTitle: '',
            active: 'fundAllType',
            currencyList: {
                fundAllType: {
                    label: '全部币种',
                    value: null
                },
                fundHkdType: {
                    label: '港币基金',
                    value: 2
                },
                fundUsdType: {
                    label: '美元基金',
                    value: 1
                }
            },
            list: [],
            pageNum: 1,
            pageSize: 100,
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
        this.assetType = this.$route.query.type
        this.currency = this.$route.query.currency
        this.assetTypetab = this.$route.query.type
        this.getFundListV2()
        this.initI18nState()
        if (this.$route.query.type) {
            this.changeBannarTitle()
        }
        let tab = LS.get('fundListCurrencyTab')
        this.label =
            tab === 'fundUsdType'
                ? this.$t('fundUsdType')
                : tab === 'fundHkdType'
                ? this.$t('fundHkdType')
                : this.$t('fundAllType')
    },
    methods: {
        handlerType(item, index) {
            this.currency = item.value
            this.currencyShow = false
            this.active = index
            this.labelTitle = item.label
            LS.put('fundListCurrencyTab', index)
            this.getFundListV2()
        },
        goBarnner() {
            //大陆版本banner不跳转
            if (this.code === 1) {
                return
            }
            let jump_url = [
                `${window.location.origin}/marketing/smart-fund/index.html?tabsName=equity#/`,
                `${window.location.origin}/marketing/smart-fund/index.html?tabsName=equity#/`,
                `${window.location.origin}/marketing/smart-fund/index.html?tabsName=bond#/`,
                `${window.location.origin}/marketing/smart-fund/index.html?tabsName=balanced#/`,
                `${window.location.origin}/marketing/smart-fund/index.html?tabsName=moneyMarket#/`
            ]
            if (this.assetType) {
                // console.log(jump_url[this.assetType])
                jumpUrl(3, jump_url[this.assetType])
            } else {
                jumpUrl(3, jump_url[0])
            }
        },
        //获取用户归属 1大陆 2香港
        async getSource() {
            try {
                const { code } = await getSource()
                if (this.isLogin) {
                    this.code = code
                } else {
                    this.code = this.appType.Hk ? 2 : 1
                }
                this.bannarTitleUrl =
                    this.code != 1
                        ? require(`@/assets/img/fund/fundImg/${this.lang}/fundAll.png`)
                        : require(`@/assets/img/fund/fundImg/${this.lang}/fundAll1.png`)
                if (this.$route.query.type) {
                    this.changeBannarTitle()
                }
            } catch (e) {
                this.$toast(e.msg)
            }
        },
        handlerCuenrry(data) {
            this.currencyShow = false
            // 0：tab切换 1：货币切换
            if (data.flag !== '0') {
                this.assetType = data.assetType
            }
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
            jumpUrl(3, url)
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
        },
        initI18nState() {
            for (let key in this.currencyList) {
                this.currencyList[key].label = this.$t(key)
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.fund__banner {
    margin: 42px 0 0 0;
}
.block__fund--master {
    position: fixed;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
}
.block__fund--currey {
    padding: 0 10px;
    background: #fff;
    height: 40px;
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    .block__fund--left {
        width: 50%;
    }
    .block__fund--right {
        width: 50%;
        color: #0091ff;
        text-align: right;
    }
    .block__master {
        position: absolute;
        bottom: -150px;
        z-index: 999999;
        border-bottom-left-radius: 20px;
        border-bottom-right-radius: 20px;
        left: 0;
        background: #fff;
        width: 100%;
        padding: 0 10px;
        .active {
            color: #0091ff;
        }
        .block__list--element {
            line-height: 50px;
            display: flex;
            font-size: 14px;
            flex-direction: row;
            .block__list--left,
            .block__list--icon {
                width: 50%;
            }
            .block__list--icon {
                font-size: 10px;
            }
            .block__list--icon {
                text-align: right;
            }
        }
    }
}
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
