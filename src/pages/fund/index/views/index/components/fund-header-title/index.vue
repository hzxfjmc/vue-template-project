<template lang="pug">
.fund__header--nav
    .fund__header--title
        .fund__header--back(class='iconfont icon-back')
        .fund__header--subtitle
            span 全部
            span 港币基金
            span 美元基金
    .fund__header--subnav
        .fund__nav--item(
            v-for="(item,index) in navList" 
            @click="handerTab(item,index)"
            :class="[active===index ? 'active':'']"
            :key="index") {{item.label}}
    .fund__header--subnav
        .fund__nav--subitem(
            v-for="(item,index) in navList" 
            @click="handerTab(item,index)"
            :class="[active===index ? 'active1':'']"
            :key="index") {{item.label}}

</template>
<script>
import { Tab, Tabs } from 'vant'
export default {
    components: {
        [Tab.name]: Tab,
        [Tabs.name]: Tabs
    },
    data() {
        return {
            active: 0,
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
        handerTab(item, index) {
            console.log(item)
            this.active = index
        }
    }
}
</script>
<style lang="scss" scoped>
.fund__header--title {
    padding: 20px 0 0 0;
    background: #2b4f80;
    .fund__header--back {
        left: 15px;
        width: 20px;
        position: fixed;
        height: 44px;
        line-height: 44px;
        color: #fff;
        // float: left;
    }
    .fund__header--subtitle {
        width: 100%;
        height: 44px;
        color: #fff;
        background: #2b4f80;
        display: flex;
        justify-content: center;
        line-height: 44px;
        span {
            margin: 0 10px;
            font-size: 14px;
        }
    }
}
.fund__header--subnav {
    width: 96%;
    margin: 10px 2%;
    display: flex;
    flex-direction: row;
    height: 30px;
    line-height: 30px;
    .fund__nav--item {
        width: 25%;
        font-size: 16px;
        height: 30px;
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
