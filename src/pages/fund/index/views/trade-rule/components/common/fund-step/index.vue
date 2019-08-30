<template lang="pug">
.fund-step 
    .fund-step-left
        span.top {{oneStep.label}}
        div.content 
            span.point 
        span.bottom {{oneStep.value}}
    .fund-step-content
        span.top {{twoStep.label}}
        div.content 
            span.point
        span.bottom {{twoStep.value}}
    .fund-step-right
        span.top {{threeStep.label}}
        span.content 
            span.point
        span.bottom {{threeStep.value}}
        
</template>
<script>
export default {
    props: {
        oneStep: {
            type: Object
        },
        twoStep: {
            type: Object
        },
        threeStep: {
            type: Object
        }
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
            z-index: 999999;
        }
        .top {
            font-size: 0.28rem;
            line-height: 20px;
        }
        .bottom {
            color: $text-color5;
            font-size: 0.24rem;
        }
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
            z-index: 999;
            border: 1px solid #2f79ff;
            opacity: 0.5;
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
