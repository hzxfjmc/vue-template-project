<template lang="pug">
.inverstment--block--wrapper
    van-tabs(
        color="#2F79FF"
        :line-width="width"
        title-inactive-color="#191919"
        title-active-color="#2F79FF"
        v-model="active" 
        sticky
        swipeable) 
        van-tab(title="定投计划")
            .inverstment--block--list(v-for="(item,index) in list")
                .block--item--header.bg-color.ellipse JP摩根中國A股市324324324機會基最多是这么多个…
                .block--item--content.border-bottom
                    .item--left 
                        .top 累计金额(港币）
                        .bottom 13,450.00
                    .item--left 
                        .top 已投期数
                        .bottom 100
                .block--item--footer
                    .flex-item
                        .top 下次扣款日期
                        .bottom 02-11(周一)
                    .flex-item
                        .top 扣款方式
                        .bottom 建设银行(0483)
                    .flex-item
                        .top 扣款金额
                        .bottom 5,0000.00
        van-tab(title="历史计划")
             .inverstment--block--list(v-for="(item,index) in list")
                .block--item--header.bg-uncolor.ellipse JP摩根中國A股市324324324機會基最多是这么多个…
                .block--item--content.border-bottom
                    .item--left 
                        .top 累计金额(港币）
                        .bottom 13,450.00
                    .item--left 
                        .top 已投期数
                        .bottom 100
                .block--item--footer
                    .flex-item
                        .top 下次扣款日期
                        .bottom 02-11(周一)
                    .flex-item
                        .top 扣款方式
                        .bottom 建设银行(0483)
                    .flex-item
                        .top 扣款金额
                        .bottom 5,0000.00
    .inverstment--footer--btn
        van-button.btn-left() 发现更多定投机会
        van-button.btn-right 我的持仓
</template>
<script>
export default {
    data() {
        return {
            width: 28,
            active: 1,
            list: [{}, {}, {}, {}]
        }
    }
}
</script>
<style lang="scss" scoped>
.inverstment--block--wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    .inverstment--footer--btn {
        margin: 0 16px 0 16px;
        flex-direction: row;
        position: fixed;
        bottom: 20px;
        justify-content: space-between;
        display: flex;
        .btn-left {
            width: 160px;
            background: #ffbf32;
            color: #fff;
            border: none;
        }
        .btn-right {
            width: 160px;
            background: #2f79ff;
            color: #fff;
            margin: 0 0 0 23px;
            border: none;
        }
    }
}
.inverstment--block--list {
    margin: 12px 12px 0 12px;
    background: #fff;
    height: 182px;
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.05);
    border-radius: 8px;
    overflow: hidden;
    .block--item--header {
        width: 100%;
        height: 46px;
        color: #fff;
        line-height: 46px;
        padding: 0 20px;
        font-size: 16px;
    }
    .bg-color {
        background: url('~@/assets/img/fund/investment-bg.png');
        background-size: 100% 100%;
    }
    .bg-uncolor {
        background: linear-gradient(
            8deg,
            rgba(228, 231, 236, 1) 0%,
            rgba(203, 205, 210, 1) 100%
        );
    }
    .block--item--content {
        margin: 14px 20px 0 20px;
        padding: 0 0 14px 0;
        display: flex;
        flex-direction: row;
        .item--left,
        .item--right {
            width: 50%;
            .top {
                color: rgba(25, 25, 25, 0.65);
            }
            .bottom {
                font-size: 20px;
            }
        }
    }
    .block--item--footer {
        margin: 0 20px;
        height: 60px;
        display: flex;
        flex-direction: row;
        align-items: center;
        text-align: center;
        justify-content: space-between;
        .top {
            font-size: 12px;
            color: rgba(25, 25, 25, 0.45);
        }
    }
}
.inverstment--block--list:last-child {
    margin: 12px 12px 80px 12px;
}
</style>
