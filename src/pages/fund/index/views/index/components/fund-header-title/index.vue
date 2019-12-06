<template lang="pug">
.fund__header--nav
    .fund__header--subnav(v-if="navShow")
        .fund__nav--scroll(ref="navTransform")
            .fund__nav--item(
                v-for="(item,index) in navList" 
                @click="handerTab(item,index)"
                :class="[active===index ? 'active':'']"
                :key="index") {{item.label}}
        .fund__nav--fixed(@click="handlerNavItem") 
            img(:src="IconPath")
            p {{fundTitle}}
    .fund__header--subnav(v-else)
        .fund__nav--scroll
            .fund__nav--subitem(
                v-for="(item,index) in navList" 
                @click="handerTab(item,index)"
                :class="[active===index ? 'active1':'']"
                :key="index") {{item.label}}
    protocol-popup(
        v-model="protocolVisible"
        @chooseFilePath="chooseFilePath"
        :protocolFileList="sellProtocolFileList"
        )

</template>
<script>
import { Tab, Tabs } from 'vant'
import protocolPopup from '../protocol-popup'
export default {
    components: {
        [Tab.name]: Tab,
        [Tabs.name]: Tabs,
        protocolPopup
    },
    data() {
        return {
            active: 0,
            protocolVisible: false,
            fundTitle: '全部',
            IconPath: require('@/assets/img/fund/icon_qiu.png'),
            sellProtocolFileList: [
                {
                    fileName: '全部',
                    iconPath: require('@/assets/img/fund/icon_qiu.png')
                },
                {
                    fileName: '港币基金',
                    iconPath: require('@/assets/img/fund/icon_hkd.png')
                },
                {
                    fileName: '美元基金',
                    iconPath: require('@/assets/img/fund/icon_usd.png')
                }
            ],
            navShow: true,
            navList: [
                {
                    label: '全部'
                },
                {
                    label: '货币型'
                },
                {
                    label: '债券型'
                },
                {
                    label: '混合型'
                },
                {
                    label: '股票型'
                }
            ]
        }
    },
    methods: {
        chooseFilePath(data) {
            console.log(data)
            this.IconPath = data.iconPath
            this.fundTitle = data.fileName
        },
        handlerNavItem() {
            this.protocolVisible = true
        },
        handerTab(item, index) {
            this.$refs.navTransform.style.left = index < 2 ? '0px' : '-30px'
            this.active = index
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
        right: 0;
        position: relative;
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
        &::after {
            position: absolute;
            box-sizing: border-box;
            content: ' ';
            pointer-events: none;
            right: 0;
            bottom: 0;
            left: 0;
            border-bottom: 2px solid red;

            @media only screen and (min-resolution: 2dppx) {
                // 非标准的
                -webkit-transform: scaleY(0.5);
                transform: scaleY(0.5);
            }
        }
    }
}
</style>
