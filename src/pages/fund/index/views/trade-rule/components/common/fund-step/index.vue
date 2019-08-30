<template lang="pug">
.fund-step 
    .fund-step-left
        span.top 买入提交
        div.content 
            span.point
        span.bottom 今日15点前
    .fund-step-content
        span.top 确认份额
        div.content 
            span.point
        span.bottom 06.23(星期五)
    .fund-step-right
        span.top 查看盈亏
        span.content 
            span.point
        span.bottom 06.28(星期五)
        
</template>
<script>
export default {
    data() {
        return {}
    }
}
</script>
<script>
export default {
    data() {
        return {}
    }
}
</script>
<style lang="scss" scoped>
.fund-step {
    padding: 0 10px;
    display: flex;

    .point {
        display: block;
        width: 6px;
        height: 6px;
        background: #2f79ff;
        border-radius: 6px;
    }
    .fund-step-left,
    .fund-step-content,
    .fund-step-right {
        // float:left;
        width: 33.33%;
        height: 80px;
        .top,
        .content,
        .bottom {
            float: left;
            display: block;
            width: 100%;
        }
        .content {
            margin: 5px 0;
            position: relative;
        }
        .top {
            font-size: 0.28rem;
            line-height: 20px;
        }
        .bottom {
            color: $text-color5;
            font-size: 0.24rem;
        }
        // text-align: center;
    }
    .fund-step-content {
        text-align: center;
        .point {
            margin: 0 auto;
        }
        .content::before,
        .content::after {
            position: absolute;
            top: 2px;
            content: '';
            width: 146%;
            border: 1px solid #2f79ff;
            display: inline-block;
        }
        .content::before {
            left: -100%;
        }
        .content::after {
            right: -100%;
        }
    }
    .fund-step-right {
        text-align: right;
        .content {
            display: flex;
            justify-content: flex-end;
        }
    }
}
</style>
