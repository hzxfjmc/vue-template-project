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

    
</template>
<script>
export default {
    data() {
        return {}
    }
}
</script>
<style lang="scss" scoped>
.investment__detail__wrapper {
    display: flex;
    width: 100%;
    flex-direction: column;
    height: 100%;
    background: $background-color;
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
            padding-top: 14px;
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
}
</style>
