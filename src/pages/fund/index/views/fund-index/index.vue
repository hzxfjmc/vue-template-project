<template lang="pug">
.block-fund-index
    .block__swiper.block__fund_index_swiper
        <van-swipe :autoplay="3000">
            <van-swipe-item v-for="(image, index) in images" :key="index">
                <img v-lazy="image" :src="image"/>
            </van-swipe-item>
        </van-swipe>
    .block__assets
        .block__left
            .block__left--label 基金总资产
            .block__left--number
                .block--element--number 10000
                .block--element--select 港币
        .block__right
            .block--hold  基金持仓
            .block--label--list
                span 10000,00 港币
                span 近7日收益
    .block__tab
        .block__tab--list
            .block__tab--Item
                span 货币型
</template>
<script>
import { Swipe, SwipeItem } from 'vant'
export default {
    components: {
        [Swipe.name]: Swipe,
        [SwipeItem.name]: SwipeItem
    },
    data() {
        return {
            images: [
                'https://img.yzcdn.cn/vant/apple-1.jpg',
                'https://img.yzcdn.cn/vant/apple-2.jpg'
            ]
        }
    }
}
</script>
<style lang="scss" scoped>
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
    margin: 0 5%;
    height: 96px;
    padding: 15px;
    position: relative;
    z-index: 99999;
    top: -48px;
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
            line-height: 20px;
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
        }
        .block--label--list {
            text-align: right;
            display: flex;
            font-size: 14px;
            color: rgba(25, 25, 25, 1);
            line-height: 18px;
            width: 100%;
            flex-direction: column;
        }
    }
}
</style>
