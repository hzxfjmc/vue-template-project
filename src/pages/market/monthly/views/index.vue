<template lang="pug">
    .index
        .title
            | {{ $t('common.monthlyStock') }}
            .title__enter(@click="gotoMine") {{ $t('index.myMonthly') }}
        index-banner(v-if="bannerList.length > 0" :list="bannerList")
        template(v-for="(item, index) in list")
            .subtitle(v-if="index===0 || item.moduleName !== list[index-1].moduleName") {{ item.moduleName }}
            index-hot(v-if="item.moduleType === 1" :data="item" @goto-stock="gotoStock(item)")
            index-popularity(v-if="item.moduleType === 2" :data="item" @goto-stock="gotoStock(item)")
            index-bluechip(v-if="item.moduleType === 3" :data="item" @goto-stock="gotoStock(item)")
        // 全部月供
        router-link.all-monthly(to="/list")
            | {{ $t('index.allMonthly') }}
            span
</template>

<script>
import IndexBanner from '../components/index-banner'
import IndexHot from '../components/index-hot'
import IndexPopularity from '../components/index-popularity'
import IndexBluechip from '../components/index-bluechip'
import JSBridge from '@/utils/js-bridge'
import {
    getRecommendStock,
    getMonthlyStockTrend,
    getOrderDicInfo,
    getMonthlyStockBanner
} from '../../0-service/market'
import { Toast } from 'vant'
export default {
    name: 'index',
    components: {
        IndexBanner,
        IndexHot,
        IndexPopularity,
        IndexBluechip
    },
    data() {
        return {
            bannerList: [],
            list: [],
            dic: new Map()
        }
    },
    async mounted() {
        this.getBanner()
        this.getStockList()
    },
    activated() {
        if (JSBridge.isYouxinApp) {
            this.setTitlebar()
        }
    },
    deactivated() {
        if (JSBridge.isYouxinApp) {
            JSBridge.callApp('command_set_titlebar_button', {
                position: 2,
                type: 'hide'
            })
        }
    },
    methods: {
        setTitlebar() {
            // 跳转客服中心
            window.GOTO_MESSAGE_CENTER = function() {
                JSBridge.gotoNativeModule('yxzq_goto://message_center')
            }
            JSBridge.callApp('command_set_titlebar_button', {
                position: 2,
                type: 'icon',
                icon: 'message',
                clickCallback: 'GOTO_MESSAGE_CENTER'
            })
        },
        // 获取banner
        async getBanner() {
            try {
                const data = await getMonthlyStockBanner({
                    show_page: 10
                })
                this.bannerList = data.banner_list
            } catch (e) {
                if (e.msg) {
                    Toast(e.msg)
                }
            }
        },
        // 获取字典信息
        async getDic() {
            const data = await getOrderDicInfo({
                module: 'exchangeType'
            })
            this.dic = new Map(data.map(tp => [tp.value, tp.msg.toLowerCase()]))
        },
        async getStockList() {
            try {
                // 获取月供股列表
                await this.getDic()
                const list = await getRecommendStock()
                list.forEach(item => {
                    item.monthCount = item.showTextValue
                    item.market = this.dic.get(item.exchangeType)
                })

                const map = new Map([
                    ['3', 0],
                    ['6', 1],
                    ['9', 2],
                    ['12', 3],
                    ['24', 4],
                    ['36', 5]
                ])

                // 热门股
                const listHot = list.filter(
                    item => item.moduleType === 1 && item.showTextType === 1
                )
                if (listHot.length > 0) {
                    const { list: stocksHotData } = await getMonthlyStockTrend({
                        idtyps: listHot.map(item => ({
                            id: item.market + item.stockCode,
                            type: map.get(item.showTextValue)
                        })),
                        kline: '0'
                    })
                    stocksHotData.forEach(item => {
                        list.forEach(citem => {
                            const flag =
                                citem.stockCode === item.symbol && // 股票先同
                                citem.moduleType === 1 && // 热门股
                                citem.showTextType === 1 // 需要获取行情数据的
                            if (flag) {
                                citem.showTextValue = item.pctchng
                            }
                        })
                    })
                }

                // 蓝筹股
                const listBluechip = list.filter(item => item.moduleType === 3)
                if (listBluechip.length > 0) {
                    const {
                        list: stocksBluechipData
                    } = await getMonthlyStockTrend({
                        idtyps: listBluechip.map(item => ({
                            id: item.market + item.stockCode,
                            type: map.get(item.showTextValue)
                        })),
                        kline: '1',
                        level: '3'
                    })
                    stocksBluechipData.forEach(item => {
                        list.forEach(citem => {
                            const flag =
                                citem.stockCode === item.symbol && // 股票相同
                                citem.moduleType === 3 // 蓝筹股
                            if (flag) {
                                citem.stockDetail = item
                            }
                        })
                    })
                }

                this.list = list
            } catch (e) {
                Toast(e.msg || this.$t('common.errorTips'))
            }
        },
        gotoStock(item) {
            JSBridge.gotoNativeModule(
                `yxzq_goto://stock_quote?market=${item.market}&code=${
                    item.stockCode
                }`
            )
        },
        async gotoMine() {
            if (JSBridge.isYouxinApp) {
                const user = await JSBridge.callApp('get_user_info')
                if (user.userToken) {
                    this.$router.push('/mine')
                } else {
                    JSBridge.callApp('command_user_login')
                }
            } else {
                Toast(this.$t('index.notApp'))
            }
        }
    }
}
</script>

<style lang="less" scoped>
.index {
    margin: 0 18px 60px;
}
.title {
    margin: 14px 0;
    font-size: 28px;
    line-height: 40px;
    .title__enter {
        font-size: 14px;
        color: #393939;
        float: right;
    }
}
.subtitle {
    margin: 30px 0 14px;
    font-size: 20px;
}
.all-monthly {
    display: block;
    margin-top: 30px;
    font-size: 20px;
    color: #393939;
    span {
        float: right;
        width: 15px;
        height: 15px;
        background: url(../../0-images/arrow-04.png);
        background-repeat: no-repeat;
        background-size: 15px;
        transform: rotate(-90deg);
        margin-top: 10px;
    }
}
</style>
