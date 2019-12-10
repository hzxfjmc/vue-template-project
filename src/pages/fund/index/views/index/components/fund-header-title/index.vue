<template lang="pug">
.fund__header--nav
    .fund__header--subnav(v-if="appType.Hk")
        .fund__nav--scroll(ref="navTransform")
            .fund__nav--item(
                v-for="(item,index) in navList" 
                @click="handerTab(item,index)"
                :class="[activeTab===index ? 'active':'']"
                :key="index") {{item.label}}
        .fund__nav--fixed(@click="handlerNavItem") 
            img(:src="IconPath")
            p {{fundTitle}}
        protocol-popup(
            v-model="protocolVisible"
            @chooseFilePath="chooseFilePath"
            :protocolFileList="sellProtocolFileList"
            )
    .fund__header--subnav(v-else)
        .fund__nav--scroll.fund__nav--scroll-d(ref="navTransform")
            .fund__nav--subitem(
                v-for="(item,index) in navList" 
                @click="handerTab(item,index)"
                :class="[activeTab==index ? 'active1':'']"
                :key="index") {{item.label}}
        .fund__nav--fixed.fund__nav--fixed-d
            p(@click="handlerNavItem") {{fundTitle}}
                em(class="iconfont icon-icon-bottom")
            .block--master(v-if="chooseCurrencyShow1" @click="chooseCurrencyShow1 = false")
            .block__currey(v-if="chooseCurrencyShow1")
                span.border-bottom(
                    v-for="(item,index) in sellProtocolFileList"
                    @click="chooseFilePath(item)") {{item.fileName}}
   

</template>
<script>
import { Tab, Tabs } from 'vant'
import protocolPopup from '../protocol-popup'
import { mapGetters } from 'vuex'
export default {
    props: {
        assetType: {
            type: String,
            defalut: ''
        }
    },
    i18n: {
        zhCHS: {
            fundAllType: '全部货币',
            fundHkdType: '港币基金',
            fundUsdType: '美元基金',
            fundAll: '全部',
            fundCurrency: '货币型',
            fundBond: '债券型',
            fundBlend: '混合型',
            fundShares: '股票型'
        },
        zhCHT: {
            fundAllType: '全部貨幣',
            fundHkdType: '港幣基金',
            fundUsdType: '美元基金',
            fundAll: '全部',
            fundCurrency: '貨幣型',
            fundBond: '債券型',
            fundBlend: '混合型',
            fundShares: '股票型'
        },
        en: {
            fundAllType: 'All Currencies',
            fundHkdType: 'HKD Funds',
            fundUsdType: 'USD Funds',
            fundAll: 'All',
            fundCurrency: 'Money Market',
            fundBond: 'Bond',
            fundBlend: 'Balanced',
            fundShares: 'Equity'
        }
    },
    components: {
        [Tab.name]: Tab,
        [Tabs.name]: Tabs,
        protocolPopup
    },
    computed: {
        ...mapGetters(['appType'])
    },
    watch: {
        assetType(val) {
            let obj = {
                1: 4,
                2: 2,
                3: 3,
                4: 1
            }
            this.activeTab = obj[val]
            this.$refs.navTransform.style.left =
                this.activeTab < 2 ? '0px' : '-30px'
            this.initI18n()
        }
    },
    data() {
        return {
            activeTab: 0,
            chooseCurrencyShow1: false,
            protocolVisible: false,
            fundTitle: '全部货币',
            IconPath: require('@/assets/img/fund/icon_qiu.png'),
            state: {
                currency: '',
                assetType: ''
            },
            sellProtocolFileList: [
                {
                    fileName: '全部基金',
                    iconPath: require('@/assets/img/fund/icon_qiu.png'),
                    key: 'fundAllType',
                    value: ''
                },
                {
                    fileName: '港币基金',
                    iconPath: require('@/assets/img/fund/icon_hkd.png'),
                    key: 'fundHkdType',
                    value: '2'
                },
                {
                    fileName: '美元基金',
                    key: 'fundUsdType',
                    iconPath: require('@/assets/img/fund/icon_usd.png'),
                    value: '1'
                }
            ],
            navList: [
                {
                    label: '全部货币',
                    key: 'fundAll',
                    value: ''
                },
                {
                    label: '货币型',
                    key: 'fundCurrency',
                    value: '4'
                },
                {
                    label: '债券型',
                    key: 'fundBond',
                    value: '2'
                },
                {
                    label: '混合型',
                    key: 'fundBlend',
                    value: '3'
                },
                {
                    label: '股票型',
                    key: 'fundShares',
                    value: '1'
                }
            ]
        }
    },
    methods: {
        initI18n() {
            this.navList.map(item => {
                item.label = this.$t(item.key)
            })
            this.sellProtocolFileList.map(item => {
                item.label = this.$t(item.key)
            })
            this.fundTitle = this.$t('fundAllType')
        },
        chooseFilePath(data) {
            this.IconPath = data.iconPath
            this.fundTitle =
                data.fileName === 'All Currencies' ? 'Currency' : data.fileName
            this.state.currency = data.value
            document.body.style.overflow = '' //出现滚动条
            document.removeEventListener(
                'touchmove',
                e => {
                    e.preventDefault()
                },
                false
            )
            this.protocolVisible = false
            this.chooseCurrencyShow1 = false
            this.$emit('handlerCuenrry', this.state)
        },
        handlerNavItem() {
            if (this.appType.Hk) {
                this.protocolVisible = true
            } else {
                document.body.style.overflow = 'hidden'
                document.addEventListener(
                    'touchmove',
                    e => {
                        e.preventDefault()
                    },
                    false
                ) //禁止页面滑动
                this.chooseCurrencyShow1 = true
            }
        },
        handerTab(item, index) {
            this.$refs.navTransform.style.left = index < 2 ? '0' : '-30px'
            this.state.assetType = item.value
            this.state.key = item.key
            this.activeTab = index
            this.$emit('handlerCuenrry', this.state)
        }
    }
}
</script>
<style lang="scss" scoped>
.fund__header--subnav {
    width: 100%;
    margin: 0 0;
    overflow: auto;
    background: rgba(255, 255, 255, 1);
    height: 42px;
    line-height: 42px;
    .fund__nav--scroll {
        width: 400px;
        height: 30px;
        display: flex;
        margin: 6px 0;
        padding: 0 50px 0 0;
        flex-direction: row;
        position: relative;
        // right: 0;
    }
    .fund__nav--scroll-d {
        padding: 0 70px 0 0;

        .fund__nav--subitem {
            font-size: 14px;
        }
    }
    .fund__nav--fixed {
        position: absolute;
        right: 0;
        top: 0;
        width: 55px;
        height: 40px;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.5);
        img {
            width: 20px;
            height: 20px;
            margin: 0 17px;
            text-align: center;
        }
        p {
            font-size: 10px;
            display: inline;
            line-height: 16px;
        }
    }
    .fund__nav--fixed-d {
        width: 72px;
        p {
            em {
                // display: block;
                padding: 0 0 0 5px;
            }
        }
    }
    .fund__nav--item {
        width: 110px;
        font-size: 16px;
        height: 30px;
        margin: 0 5px;
        line-height: 30px;
        text-align: center;
    }
    .active {
        background: #2b4f80;
        height: 30px;
        line-height: 30px;
        border-radius: 30px;
        color: #fff;
    }
    .fund__nav--subitem {
        width: 21%;
        margin: 0 2%;
        font-size: 16px;
        height: 30px;
        line-height: 30px;
        text-align: center;
    }
    .active1 {
        position: relative;
        color: #2f79ff;
        &::after {
            position: absolute;
            box-sizing: border-box;
            content: ' ';
            pointer-events: none;
            right: 0;
            bottom: 0;
            width: 30px;
            left: 10px;
            border-bottom: 2px solid #2f79ff;

            @media only screen and (min-resolution: 2dppx) {
                // 非标准的
                -webkit-transform: scaleY(0.5);
                transform: scaleY(0.5);
            }
        }
    }
}
.block--master {
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 99999;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
}
.block__currey {
    width: 103px;
    position: absolute;
    height: 122px;
    z-index: 9999999;
    border-radius: 10px;
    right: 12px;
    top: 55px;
    background: #fff;
    display: flex;
    justify-content: center;
    flex-direction: column;
    span {
        color: rgba(25, 25, 25, 0.65);
        width: 100px;
        height: 40px;
        line-height: 40px;
        display: block;
        // margin: 0 10px;
    }
    .active {
        color: #191919;
    }
}
.block__currey:before {
    content: '';
    width: 0px;
    height: 0px;
    top: -10px;
    left: 40px;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid #fff;
    position: absolute;
}
</style>
