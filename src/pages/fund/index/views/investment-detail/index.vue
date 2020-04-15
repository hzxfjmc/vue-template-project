<template lang="pug">
.investment__detail__wrapper
    .investment__detail__header
        .investment__detail__header_info
            .header_info_left 
                .name Pimco 亚洲投资级债券基金-A2
                .code ISIN:LU0538203018
            .header_info_right
                img(src="@/assets/img/fund/icon-right.png")
        .investment__detail__header_amount
            .header_amount.left
                .title 累计金额(港币）
                .content 50000.00
            .header_amount.right
                .title 已投期数
                .content 15
    .investment__detail__card.card
        .card_title
            img(src="@/assets/img/fund/dingtou@2x.png")
            span 定投计划
        .card_content
            .card_content_item
                .left 时间金额
                .right 每周周三 定投 500.00 港币
            .card_content_item
                .left 扣款方式
                .right 汇丰银行(1234) 自动换汇
            .card_content_item
                .left 下次扣款日期
                .right 2020-02-12，如遇非交易日顺延
    .investment__detail__tag.card
        .investment__detail__tag_item(v-for="(item,index) in tagImgList" :key="index")
            img(:src="item.url")
            span {{item.text}}
    .investment__detail__record.card
        record


                

            

    

</template>
<script>
import record from './record'
export default {
    components: {
        record
    },
    data() {
        return {
            tagImgList: [
                {
                    url: require('@/assets/img/fund/icon-set.png'),
                    text: '修改计划'
                },
                {
                    url: require('@/assets/img/fund/icon-pause.png'),
                    text: '暂停定投'
                },
                {
                    url: require('@/assets/img/fund/icon-close.png'),
                    text: '终止定投'
                }
            ]
        }
    }
}
</script>
<style lang="scss" scoped>
.investment__detail__wrapper {
    display: flex;
    width: 100%;
    flex-direction: column;
    // height: 100%;
    background: $background-bottom-color;
    .investment__detail__header {
        padding: 0 12px;
        height: 240px;
        background: linear-gradient(
            360deg,
            rgba($primary-color-line, 0) 0%,
            rgba(#2971f7, 1) 28%,
            rgba($primary-color, 1) 100%
        );
        .investment__detail__header_info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 14px 0;
            border-bottom: 1px solid rgba($background-color, 0.05);
            .header_info_left {
                .name {
                    color: $background-color;
                    font-size: 16px;
                }
                .code {
                    color: rgba($background-color, 0.4);
                    font-size: 12px;
                }
            }
            .header_info_right {
                img {
                    width: 15px;
                    height: 15px;
                    color: $background-color;
                }
            }
        }
        .investment__detail__header_amount {
            display: flex;
            padding: 14px 0;
            .title {
                font-size: 12px;
                color: rgba($background-color, 0.6);
            }
            .content {
                font-size: 28px;
                color: $background-color;
            }
            .header_amount.left {
                margin-right: 50px;
            }
        }
    }
    .investment__detail__card {
        padding: 12px;
        min-height: 107px;
        z-index: 999;
        margin: -85px 12px 10px;
        .card_title {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            img {
                width: 17px;
                height: 19px;
                margin-right: 6px;
            }
            span {
                font-size: 16px;
                color: $text-link-color;
                font-weight: 500;
            }
        }
        .card_content {
            .card_content_item {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
                .left {
                    color: $text-color6;
                }
                .right {
                    color: $text-color;
                }
                &:last-of-type {
                    margin-bottom: 0;
                }
            }
        }
    }
    .investment__detail__tag {
        margin: 0 12px;
        display: flex;
        justify-content: space-around;
        .investment__detail__tag_item {
            display: flex;
            align-items: center;
            height: 48px;
            img {
                width: 15px;
                height: 15px;
                margin-right: 6px;
            }
            span {
                color: $text-link-color;
            }
        }
    }
    .investment__detail__record {
        margin: 15px 12px;
    }
}
.card {
    background: $background-color;
    box-shadow: 0px 0px 4px 0px rgba(#000, 0.05);
    border-radius: 6px;
}
</style>
