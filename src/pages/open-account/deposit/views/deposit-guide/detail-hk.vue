<template lang="pug">
    .guide-box
        .step-info-box.mb-10
            h2.title 友信智投支持两种入金方式
            .method-box
                .sub-title
                    span 1. FPS转数快
                    span.title-mark 推荐
                .sub-title-tips 什么是FPS转数快、优势
                .mark
                    span 极速到账
                    span 费用低
            .method-box
                .sub-title
                    span 2. 汇款
                .sub-title-tips 通过银行官网、APP、线下营业厅等向友信收款账户存入资金
                .mark
                    span 极速到账
                    span 费用低
        van-tabs(
        :line-width ="28"
        :line-height="2"
        v-model="active"
        :sticky ="true"
        )
            van-tab(title="FPS转数快")
            van-tab(title="汇款")
        .step-info-box.layout-1
            h2.title 支持银行
            .bank-box
                .top.flex-box
                    p 香港全部银行（xx和xx除外）
        .step-info-box.layout-1
            h2.title 费用和到账速度
            .bank-box
                .top.flex-box
                    p 优惠0费用
        .step-info-box.layout-2
            h2.title 步骤指南
            h3.sub-title 1、存入资金到您的友信账户
            .money-box
                a(href="javascript:;") 我要存入港币 >
                a(href="javascript:;") 我要存入美元 >
            h3.sub-title 2、通知友信智投
            p 汇款完成后，填写汇款通知，通知友信智投查收，加快入账速度
            h3.sub-title 3、友信智投收款
            h4.s-sub-title 3.1 银行流程
            p 大陆银行卡：由于跨境，一般需要1~3个工作日处理 香港银行卡：2个小时之内
            h4.s-sub-title 3.2 友信智投处理
            p 为了资金安全，友信智投会审核相关信息，1个工作日处理完成，到账后有短信和通知提醒您
        .mt-10.step-info-box.layout-3
            h2.title 常见问题
            .qa-box
                p Q:A为了资金安全，友信智投会审核相关信息，1个工作日处理完成，到账后有短信和通知提醒您
                p A:为了资金安全，友信智投会审核相关信息，1个工作日处理完成，到账后有短信和通知提醒您
</template>

<script>
/**
 * 香港银行卡入金指南
 * @ Author LINJAIJUN
 * @ Date 2018/12/25
 */
export default {
    data() {
        return {
            active: 0 // 0-fps 1-汇款
        }
    },
    created() {
        this.active = this.$route.query.type
    }
}
</script>
<style lang="scss">
.guide-box {
    .van-tab {
        font-size: 14px;
        color: #353547;
        font-weight: 400;
    }
    .van-tab--active {
        color: #3c78fa;
        font-weight: 500;
    }
    .van-tabs__line {
        background: rgba(60, 120, 250, 1);
        border-radius: 1px;
    }
}
</style>
<style scoped lang="scss">
.flex-box {
    display: flex;
    justify-content: space-between;
}
.mt-10 {
    margin-top: 10px;
}
.mb-10 {
    margin-bottom: 10px;
}
.mb-48 {
    margin-bottom: 48px;
}
.guide-box {
    width: 100%;
    background: rgba(238, 238, 238, 1);
}
.method-box {
    line-height: 24px;
    font-weight: 400;
    .sub-title {
        font-size: 14px;
        font-weight: 500;
        color: rgba(53, 53, 71, 1);
    }
    .sub-title-tips {
        font-size: 14px;
        color: rgba(53, 53, 71, 0.698);
    }
    .title-mark {
        height: 14px;
        line-height: 14px;
        font-size: 10px;
        color: rgba(255, 255, 255, 1);
        background: rgba(245, 93, 131, 1);
        border-radius: 2px;
        padding: 0 5px;
        position: relative;
        top: -1px;
        left: 5px;
    }
    .mark span {
        display: inline-block;
        font-size: 12px;
        line-height: 20px;
        color: rgba(78, 134, 255, 1);
        border: 1px solid rgba(60, 120, 250, 0.698);
        border-radius: 2px;
        padding: 0 3px;
        margin-right: 10px;
    }
}
.step-info-box {
    padding: 14px;
    background-color: #fff;
    p {
        line-height: 24px;
        font-weight: 400;
    }
    .title {
        font-size: 18px;
        font-weight: 500;
        color: rgba(53, 53, 71, 1);
        line-height: 22px;
    }
    .sub-title {
        font-size: 14px;
        font-weight: 500;
        color: rgba(53, 53, 71, 1);
        line-height: 24px;
        margin-top: 18px;
    }
    .s-sub-title {
        margin-top: 10px;
    }
    .list li {
        padding: 5px 0;
    }
    .prompt {
        width: 220px;
        height: 24px;
        background: rgba(60, 120, 250, 0.10339999999999999);
        border-radius: 12px;
        line-height: 24px;
        font-weight: 400;
        text-align: center;
        margin-top: 3px;
        span {
            font-weight: 400;
            font-size: 14px;
            color: #285ac8;
        }
    }
    .bank-box .top {
        margin-top: 4px;
    }
    .money-box a {
        font-size: 14px;
        font-weight: 400;
        color: rgba(40, 90, 200, 1);
        line-height: 24px;
        margin-right: 60px;
    }
    .qa-box p {
        margin-top: 13px;
    }
}
.layout-1 {
    padding: 14px;
}
.layout-2 {
    padding: 11px 16px;
}
.layout-3 {
    padding: 21px 16px;
}
</style>
