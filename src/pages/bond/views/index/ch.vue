<template lang="pug">
    .cancel-email.cancel-email-hk
        .logo
            img(src="@/assets/img/email/logo.png")
        .content
            p 当前订阅状态：
            .item
                img(src="@/assets/img/email/right.png")
                span 账户相关提醒：包括开户、入金、转仓等状态提醒，持仓股票公司行动提醒等
            .item
                img(src="@/assets/img/email/right.png")
                span 平台活动提醒：第一时间收到感兴趣的活动信息
            .confirm 确认取消订阅吗？
            .btn 确认退订
        .footer
            .item
                img(src="@/assets/img/email/1.png")
                .title 港美股持牌券商
            .item
                img(src="@/assets/img/email/2.png")
                .title 灵活佣金计划
            .item
                img(src="@/assets/img/email/3.png")
                .title AI智能选股
</template>
<style lang="scss" scoped>
@import '@/assets/styles/template/cancel-email.scss';
</style>
