<template lang="pug">
.investment--block--wrapper
    .investment--header
        img(src="@/assets/img/fund/succed.svg")
        .header--title 设置定投成功
    .investment--container
        .investment--container--header
            em.iconfont
            span 定投计划
        .investmnet--container--list
            .investmnet--list--item
                .left 基金名称
                .right Pimco 亚洲投资级债券基金-A2
            .investmnet--list--item
                .left 时间金额
                .right 每周周三 定投 500.00 港币
            .investmnet--list--item
                .left 扣款方式
                .right 汇丰银行(1234) 自动换汇
            .investmnet--list--item
                .left 首次扣款日期
                .right 2020-02-12，如遇非交易日顺延
    
    .investment--footer
        van-button( color="#0D50D8") 完成
</template>
<script>
export default {
    data() {
        return {}
    }
}
</script>
<style lang="scss" scoped>
.investment--block--wrapper {
    display: flex;
    width: 100%;
    flex-direction: column;
    height: 100%;
    background: #fff;
}
.investment--header {
    display: flex;
    flex-direction: column;
    margin: 47px 0 24px 0;
    width: 100%;
    text-align: center;
    .header--title {
        margin: 12px 0 0 0;
        font-size: 20px;
        line-height: 22px;
    }
}

.investment--container {
    display: flex;
    margin: 0 12px;
    flex-direction: column;
    .investment--container--header {
        width: 100%;
        height: 34px;
        display: flex;
        background: rgba(235, 243, 255, 1);
        align-items: center;
        span {
            font-size: 16px;
            color: rgba(47, 121, 255, 1);
            margin: 0 0 0 2px;
        }
    }
    .investmnet--container--list {
        width: 100%;
        border: 1px solid rgba(244, 248, 255, 1);
        margin: 5px 0 0 0;
        .investmnet--list--item {
            margin: 10px 10px 10px 10px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            .left {
                color: $text-color5;
            }
        }
    }
}

.investment--footer {
    width: 343px;
    position: fixed;
    margin: 0 16px;
    bottom: 22px;
    .van-button {
        width: 100%;
        background: #0d50d8;
        color: #fff;
        font-size: 16px;
        height: 48px;
        line-height: 48px;
    }
}
</style>
