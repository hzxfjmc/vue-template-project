<template lang="pug">
.home-fund-list
    .fund-title-name
        .title 人气之选
        .subtitle 众多投资者的选择
    .fund-list-content
        .list-item(v-for="(item,index) in fundList" :key="index")
            .block-left
                span.block-num(v-if="item.msg == 0") {{item.apy}}%
                span.block-black(v-if="item.msg == 1") {{item.apy}}%
                span.element-msg(v-if="item.msg == 2") {{item.apy}}%
                span.block-p 近一年收益率
            .block-right
                .block-top {{item.fundName}}
                .block-content
                    van-tag(
                        color="#2177FF"
                        plain
                        ) {{item.fundRisk}} 
                    van-tag(
                        color="#2177FF"
                        plain
                        ) {{item.assetTypeName}}
                    van-tag(
                        color="#2177FF"
                        plain
                        ) {{item.earningsTypeName}}
                .block-bottom {{item.feature}}
                .block-position 
            .block-element-msg(v-if="item.havePosition") 已持仓
</template>
<script>
import { Tag } from 'vant'
export default {
    components: {
        [Tag.name]: Tag
    },
    props: {
        fundList: {
            type: Array,
            default: () => {}
        }
    }
}
</script>
<style lang="scss" scoped>
.home-fund-list {
    margin: 0 0 20px 0;
    float: left;
    width: 100%;
}
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
    // margin: 10px 0 0 0;
    width: 100%;
    .list-item {
        width: 96%;
        margin: 10px 2% 0 2%;
        padding: 20px 15px;
        background: #fff;
        position: relative;
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
            .block-black,
            .block-num,
            .element-msg {
                font-size: 0.48rem;
                line-height: 31px;
            }
            .block-num {
                color: rgba(234, 61, 61, 1);
            }
            .block-black {
                color: #04ba60;
            }
        }
        .block-right {
            width: 60%;
            line-height: 27px;
        }
        .block-element-msg {
            position: absolute;
            background: $primary-color-line;
            bottom: 10px;
            right: 0;
            width: 43px;
            height: 20px;
            font-size: 10px;
            border-top-left-radius: 20px;
            color: #fff;
            text-align: center;
            line-height: 20px;
            border-bottom-left-radius: 20px;
        }
    }
}
</style>
