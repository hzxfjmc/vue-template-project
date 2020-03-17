<template lang="pug">
.block__order--details
    .block__order--header.border-bottom
        img(:src="img") 
        p 转入成功
    .block__order-status.border-bottom
        p.title 订单状态
        .block__status--list
            .block__status--item
                .block__status--icon
                .block__status--right
                    p 提交转出申请成功，可立即购买股票
                    p 2020-03-09 12:20:29
             
            .block__status--item
                .block__status--icon
                .block__status--right
                    p 提交转出申请成功，可立即购买股票
                    p 2020-03-09 12:20:29
    .block__word--list.border-bottom
        .block__word--item
            p.word-color 转出方法
            p 普通转出
        .block__word--item
            p.word-color 转入金额
            p.num 4999.99港币

    .block__footer--btn
        van-button() 完成
        
</template>
<script>
export default {
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
    .block__status--list {
        padding: 0 12px 14px 12px;
    }
    .block__status--item {
        position: relative;
        display: flex;
        flex-direction: row;
    }
    .block__status--icon {
        width: 15px;
        margin: 4px 10px 0 0;
        height: 15px;
        border: 1px solid red;
    }
    .block__status--item:last-child {
        margin: 46px 0 0 0;
    }
    .block__status--item:first-child:after {
        content: '';
        position: absolute;
        height: 56px;
        width: 1px;
        left: 7px;
        top: 26px;
        display: inline-block;
        background: red;
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
    .block__word--item:last-child {
        margin: 10px 0 0 0;
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
