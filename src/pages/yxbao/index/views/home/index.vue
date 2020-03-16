<template lang="pug">
.block__yxbao--page
    .block__yxbao--header
        .block__yxbao--content
            .block__yxbao--tip 持有资产(港币)
            .block__yxbao--num ****
            .block__yxbao--numtip 
                p 昨日收益 
                    em ****
                    em 元
            .block__yxbao--list
                .block__yxbao--item
                    p 万元收益
                    p ****
                .block__yxbao--item
                    p 七日年化(%)
                    p 2.0304
                .block__yxbao--item
                    p 累计收益
                    p ****
            .block__yxbao-btn
                van-button 转出
                van-button 转入
               
</template>
<script>
export default {
    data() {
        return {}
    }
}
</script>
<style lang="scss" scoped>
.block__yxbao--header {
    width: 100%;
    height: 381px;
    display: flex;
    background: linear-gradient(
        360deg,
        rgba(31, 95, 155, 1) 0%,
        rgba(28, 99, 161, 1) 15%,
        rgba(15, 123, 196, 1) 100%
    );
    .block__yxbao--content {
        width: 351px;
        margin: 22px 12px;
        height: 299px;
        background: rgba(186, 211, 255, 0.22);
        box-shadow: -1px 1px 1px 0px rgba(255, 255, 255, 0.29);
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        color: #fff;
        .block__yxbao--list,
        .block__yxbao-btn {
            display: flex;
            flex-direction: row;
            width: 100%;
            align-items: center;
            justify-content: space-around;
            .block__yxbao--item {
            }
        }
        .block__yxbao-btn {
            margin: 20px 0 0 0;
        }
    }
}
</style>
