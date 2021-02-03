<template lang="pug">
.fund__header--nav
    .fund__header--subnav(v-if="chShow")
        .fund__nav--scroll(ref="navTransform")
            .fund__nav--item(
                v-for="(item,index) in navList" 
                @click="handerTab(item,index)"
                :class="[activeTab==index  ? 'active':'']"
                :key="index") {{item.label}}
            .fund__nav--subitem(
                @click="handleFilterShow"
            )
                span.iconfont.icon-fundFilter
    .fund__header--subnav(v-if="hkShow")
        .fund__nav--scroll.fund__nav--scroll-d(ref="navTransform")
            .fund__nav--subitem(
                v-for="(item,index) in navList" 
                @click="handerTab(item,index)"
                :class="[activeTab==index ? 'active1':'']"
                :key="index") {{item.label}}
            .fund__nav--subitem(
                @click="handleFilterShow"
            )
                span.iconfont.icon-fundFilter
</template>
<script>
import { Tab, Tabs } from 'vant'
import protocolPopup from '../protocol-popup'
import { getSource } from '@/service/customer-relationship-server'
import { mapGetters } from 'vuex'
export default {
    props: {
        assetType: {
            type: String,
            defalut: ''
        }
    },
    computed: {
        ...mapGetters(['appType', 'isLogin'])
    },
    i18n: {
        zhCHS: {
            fundAllType: '全部货币',
            fundHkdType: '港币基金',
            fundUsdType: '美元基金',
            fundAll: '全部',
            fundCurrency: '货币',
            fundBond: '债券',
            fundBlend: '混合',
            fundShares: '股票'
        },
        zhCHT: {
            fundAllType: '全部貨幣',
            fundHkdType: '港幣基金',
            fundUsdType: '美元基金',
            fundAll: '全部',
            fundCurrency: '貨幣',
            fundBond: '債券',
            fundBlend: '混合',
            fundShares: '股票'
        },
        en: {
            fundAllType: 'All CURR',
            fundHkdType: 'HKD',
            fundUsdType: 'USD',
            fundAll: 'All',
            fundCurrency: 'MMF',
            fundBond: 'Bond',
            fundBlend: 'Allocation',
            fundShares: 'Equity'
        }
    },
    components: {
        [Tab.name]: Tab,
        [Tabs.name]: Tabs,
        protocolPopup
    },
    watch: {
        assetType(val) {
            let obj = {
                1: 1,
                2: 2,
                3: 3,
                4: 4
            }
            this.activeTab = obj[val]
            if (val === '0') {
                this.activeTab = 0
            }
            // this.$refs.navTransform.style.left =
            //     this.activeTab < 2 ? '0px' : '-30px'
            this.initI18n()
        }
    },
    data() {
        return {
            activeTab: 0,
            hkShow: false,
            chShow: false,
            chooseCurrencyShow1: false,
            protocolVisible: false,
            activeFilter: false,
            fundTitle: '全部货币',
            IconPath: require('@/assets/img/fund/icon_qiu.png'),
            state: {
                currency: '',
                assetType: ''
            },
            sellProtocolFileList: [
                {
                    fileName: '全部货币',
                    fileName1: '全部',
                    iconPath: require('@/assets/img/fund/icon_qiu.png'),
                    key: 'fundAllType',
                    value: ''
                },
                {
                    fileName: '港币基金',
                    fileName1: '港币',
                    iconPath: require('@/assets/img/fund/icon_hkd.png'),
                    key: 'fundHkdType',
                    value: '2'
                },
                {
                    fileName: '美元基金',
                    fileName1: '美元',
                    key: 'fundUsdType',
                    iconPath: require('@/assets/img/fund/icon_usd.png'),
                    value: '1'
                }
            ],
            navList: [
                {
                    label: '全部',
                    key: 'fundAll',
                    value: ''
                },
                {
                    label: '股票',
                    key: 'fundShares',
                    value: '1'
                },

                {
                    label: '债券',
                    key: 'fundBond',
                    value: '2'
                },
                {
                    label: '混合',
                    key: 'fundBlend',
                    value: '3'
                },
                {
                    label: '货币',
                    key: 'fundCurrency',
                    value: '4'
                }
            ],
            code: 0
        }
    },
    methods: {
        initI18n() {
            this.navList.map(item => {
                item.label = this.$t(item.key)
            })
            this.sellProtocolFileList.map(item => {
                item.fileName = this.$t(item.key)
            })
            this.fundTitle =
                this.$t('fundAllType') === 'All Currencies'
                    ? 'Currency'
                    : this.code != 1
                    ? this.$t('fundAllType')
                    : '全部'
        },
        chooseFilePath(data) {
            this.IconPath = data.iconPath
            this.fundTitle =
                data.fileName === 'All Currencies'
                    ? 'Currency'
                    : this.code != 1
                    ? data.fileName
                    : data.fileName1
            this.state.currency = data.value
            this.protocolVisible = false
            //切换货币
            this.state.flag = '0'
            this.chooseCurrencyShow1 = false
            this.$emit('handlerCuenrry', this.state)
        },
        handlerNavItem() {
            if (this.code != 1) {
                this.protocolVisible = true
            } else {
                this.chooseCurrencyShow1 = true
            }
        },
        handerTab(item, index) {
            // this.$refs.navTransform.style.left = index < 2 ? '0' : '-30px'
            this.state.assetType = item.value
            this.state.key = item.key
            this.activeTab = index

            //tab切换
            this.activeFilter = false
            this.state.flag = '1'
            this.$emit('handlerCuenrry', this.state)
        },
        handleFilterShow() {
            this.$emit('handleFilterShow')
        },
        //获取用户归属 1大陆 2香港
        async getSource() {
            try {
                const { code } = await getSource()
                this.code = code
                if (this.isLogin) {
                    this.code = code
                } else {
                    this.code = this.appType.Hk ? 2 : 1
                }
                this.hkShow = this.code != 1
                this.chShow = this.code === 1
                this.initI18n()
            } catch (e) {
                this.$toast(e.msg)
            }
        }
    },
    mounted() {
        this.getSource()
    }
}
</script>
<style lang="scss" scoped>
.fund__header--nav {
    // position: fixed;
    // top: 0;
    // z-index: 9999;
    // width: 100%;
}
.fund__header--subnav {
    width: 100%;
    margin: 0 0;
    overflow: auto;
    background: rgba(255, 255, 255, 1);
    height: 42px;
    line-height: 42px;
    .fund__nav--scroll {
        width: 100%;
        height: 30px;
        display: flex;
        margin: 6px 0;
        // padding: 0 50px 0 0;
        flex-direction: row;
        position: relative;
        // right: 0;
    }
    .fund__nav--scroll-d {
        .fund__nav--subitem {
            font-size: 14px;
        }
        .iconfont {
            font-size: 18px;
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
        width: 25%;
        font-size: 16px;
        height: 30px;
        line-height: 30px;
        text-align: center;
    }
    .active1 {
        position: relative;
        color: #2f79ff;
        font-weight: bolder;
        &::after {
            position: absolute;
            box-sizing: border-box;
            content: ' ';
            pointer-events: none;
            right: 0;
            bottom: -6px;
            width: 31px;
            left: 15px;
            border-bottom: 4px solid #2f79ff;
            @media only screen and (min-resolution: 2dppx) {
                // 非标准的
                -webkit-transform: scaleY(0.5);
                transform: scaleY(0.5);
            }
        }
    }
}
.inner-container::-webkit-scrollbar {
    display: none;
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
body[data-theme='pro-theme'] {
    .active1 {
        color: #daaf6f;
        &::after {
            border-bottom: 4px solid #daaf6f;
        }
    }
}
</style>
