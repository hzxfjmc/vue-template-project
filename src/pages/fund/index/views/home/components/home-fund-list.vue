<template lang="pug">
.home-fund-list
    .fund-title-name
        .title 人气之选
        .subtitle 众多投资者的选择
    .fund-list-content
        .list-item
            .block-left
                span.block-num 4324.43%
                span.block-p 近一年收益率
            .block-right
                .block-top 基金放假看是否健康
                .block-content
                    van-tag(
                        color="#2177FF"
                        plain
                        ) 和地 
                .block-bottom 五星评级优质基金
</template>
<script>
import { Tag } from 'vant'
export default {
    components: {
        [Tag.name]: Tag
    },
    data() {
        return {}
    }
}
</script>
<style lang="scss" scoped>
.fund-title-name {
    width: 96%;
    margin: 14px 2% 10px 2%;
    .title {
        font-size: 0.36rem;
        font-weight: 500;
        line-height: 25px;
        float: left;
    }
    .subtitle {
        font-size: 0.28rem;
        margin: 0 0 0 10px;
        float: left;
        line-height: 26px;
    }
}
.fund-list-content {
    float: left;
    margin: 10px 0 0 0;
    width: 100%;
    .list-item {
        width: 96%;
        margin: 0 2%;
        padding: 20px 15px;
        background: #fff;
        display: flex;
        flex-direction: row;
        height: 110px;
        .block-left,
        .block-right {
            width: 40%;
            line-height: 30px;
            display: flex;
            justify-content: center;
            flex-direction: column;
            .block-num {
                font-size: 0.48rem;
                color: rgba(234, 61, 61, 1);
                line-height: 31px;
            }
        }
        .block-right {
            width: 60%;
            line-height: 27px;
        }
    }
}
</style>
