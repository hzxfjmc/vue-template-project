<template lang="pug">
.block-fund-index
    .block__swiper.block__fund_index_swiper
        van-swipe(:autoplay="3000") 
            van-swipe-item(v-for="(image, index) in images" :key="index") 
                img(:src="image") 
    .block__assets
        .block__left
            .block__left--label 
                span 基金总资产
                em(class="iconfont icon-icon-eye")
            .block__left--number
                .block--element--number 10000
                .block--element--select 
                    span 港币
                    em(class="iconfont icon-iconxiala")
                    em(class="iconfont icon-icon_fund_index_2")
        .block__right
            .block--hold  
                span 基金持仓
                em(class="iconfont icon-iconEBgengduoCopy")
            //- .block--label--list
            //-     span 10000,00 港币
            //-     span 近7日收益
    .block__tab
        .block__tab--list
            .block__tab--Item(v-for="(item,index) in tabList" :key="index") 
                img(:src="item.imgUrl") 
                span {{item.label}}
    .block__container
        FundList
        .block-bannar
            img(:src="require('@/assets/img/fund/img/1.png')")
        FundListItem(bgColor="#2B4F80")
        FundListItem(bgColor="#F1B92D")

    .canvas-list
        canvas(id="chartId")
</template>
<script>
import { Swipe, SwipeItem } from 'vant'
import FundList from './fund-list'
import FundListItem from './fund-list-item'
// import F2 from '@antv/f2'
export default {
    components: {
        [Swipe.name]: Swipe,
        [SwipeItem.name]: SwipeItem,
        FundList,
        FundListItem
    },
    data() {
        return {
            images: [
                'https://img.yzcdn.cn/vant/apple-1.jpg',
                'https://img.yzcdn.cn/vant/apple-2.jpg'
            ],
            tabList: [
                {
                    imgUrl: require('@/assets/img/fund/icon_money.png'),
                    label: '貨幣型'
                },
                {
                    imgUrl: require('@/assets/img/fund/icon_xunzhang.png'),
                    label: '債劵型'
                },
                {
                    imgUrl: require('@/assets/img/fund/icon_fenpei.png'),
                    label: '混合型'
                },
                {
                    imgUrl: require('@/assets/img/fund/icon_zhexian.png'),
                    label: '股票型'
                }
            ],
            imgUrl:
                'http://pic11.nipic.com/20101204/6349502_104413074997_2.jpg',
            fundlist: [{}, {}]
        }
    }
}
</script>
<style lang="scss" scoped>
.block-fund-index {
    width: 100%;
    float: left;
}
.block__swiper {
    width: 100%;
    height: 200px;
    overflow: hidden;
    img {
        width: 100%;
    }
}
.block__assets {
    width: 90%;
    height: 96px;
    padding: 15px;
    position: relative;
    z-index: 99999;
    margin: -48px 5% 0 5%;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    display: flex;
    flex-direction: row;
    .block__left {
        width: 60%;
        height: 100%;
        .block__left--label {
            font-size: 14px;
            width: 100%;
            display: flex;
            align-items: center;
            flex-direction: row;
            line-height: 20px;
            em {
                font-size: 20px;
                margin: 0px 0 0 5px;
            }
        }
        .block__left--number {
            display: flex;
            flex-direction: row;
            .block--element--number {
                font-size: 28px;
                line-height: 60px;
                font-weight: bold;
                font-family: yxFontDINPro-Bold;
                color: rgba(0, 145, 255, 1);
            }
            .block--element--select {
                line-height: 60px;
                font-size: 14px;
                font-weight: 600;
                color: rgba(0, 145, 255, 1);
                margin: 0 0 0 5px;
                .icon-iconxiala {
                    margin: 0 0 0 5px;
                    color: rgba(25, 25, 25, 0.65);
                }
                .icon-icon_fund_index_2 {
                    color: rgba(25, 25, 25, 0.65);
                    margin: 0 0 0 10px;
                }
            }
        }
    }
    .block__right {
        text-align: right;
        width: 40%;
        .block--hold {
            width: 90px;
            // height: 25px;
            border-radius: 15px;
            text-align: center;
            float: right;
            font-weight: 400;
            color: rgba(0, 145, 255, 1);
            line-height: 25px;
            margin: 0 0 10px 0;
            border: 1px solid rgba(0, 145, 255, 1);
            display: flex;
            align-items: center;
            justify-content: center;
            em {
                font-size: 20px;
            }
        }
        .block--label--list {
            text-align: right;
            display: flex;
            font-size: 14px;
            line-height: 18px;
            width: 100%;
            flex-direction: column;
            span {
                color: $text-color6;
            }
        }
    }
}
.block__tab {
    width: 100%;
    margin: 20px 0 0 0;
    .block__tab--list {
        display: flex;
        flex-direction: row;
        .block__tab--Item {
            width: 25%;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            img {
                width: 40px;
                height: 40px;
            }
            span {
                color: $text-color6;
            }
        }
    }
}
.block__container {
    width: 100%;
    background: #fff;
    padding: 0 0 20px 0;
    .block-bannar {
        width: 90%;
        margin: 0 5%;
        img {
            width: 100%;
        }
    }
}
.canvas-list {
    opacity: 0;
    position: fixed;
    top: 0;
}
</style>
