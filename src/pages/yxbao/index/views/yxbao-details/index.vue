<template lang="pug">
.block__order--details
    .block__order--header.border-bottom
        img(:src="img") 
        p 转入成功
    .block__order-status.border-bottom
        p.title 订单状态
        transferStep
    .block__word--list.border-bottom
        .block__word--item
            p.word-color 转出方式
            p 普通转出
        .block__word--item
            p.word-color 转入金额
            p.num 4999.99港币

        .block__word--item
            p.word-color 转入金额
            p.num 0.01港币

    .block__footer--btn
        van-button() 完成
        
</template>
<script>
import transferStep from './transfer-step'
export default {
    components: {
        transferStep
    },
    data() {
        return {
            img: `${window.location.origin}/wealth/yxbao/zhuan-succed.png`
        }
    }
}
</script>
<style lang="scss" scoped>
.block__order--details {
    width: 100%;
    height: 100%;
    background: #fff;
    .block__order--header {
        width: 100%;
        height: 180px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        img {
            width: 99px;
            height: 99px;
        }
        p {
            font-size: 20px;
            margin: 12px 0 0 0;
        }
    }
}
.block__order-status {
    .title {
        margin: 14px 0 14px 12px;
    }
}
.block__word--list.border-bottom {
    padding: 14px 12px;
    display: flex;
    flex-direction: column;
    .block__word--item {
        display: flex;
        line-height: 22px;
        flex-direction: row;
        justify-content: space-between;
        .word-color {
            color: $text-color6;
        }
        .num {
            font-size: 16px;
        }
    }
    .block__word--item {
        margin: 10px 0 0 0;
    }
    .block__word--item:first-child {
        margin: 0 0 0 0;
    }
}
.block__footer--btn {
    .van-button {
        width: 343px;
        height: 48px;
        margin: 20px 16px 0 16px;
        background: rgba(13, 80, 216, 1);
        border-radius: 6px;
        color: #fff;
        font-size: 16px;
    }
}
</style>
