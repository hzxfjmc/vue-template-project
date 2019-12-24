<template lang="pug">
.fund__details--list   
    .fund__list--title 更多基金
    .fund__list--content
        .fund__list--item
            .block__left
                .fund_time 近一年
                .fund_number + 323.32%
            .block__right
                .fund_name 返回电话费打瞌睡客服号返回几点开始房贷发 
                .fund__list--tag
                    .fund_tag
                        em.iconfont.icon-iconsjijinfengxiancopy-copy 
                        span 混合
                    .fund_tag
                        em.iconfont.icon-iconsjijinfengxian
                        span 中高风险
                    .fund_tag
                        em.iconfont.icon-iconsjijinfengxiancopy-copy1
                        span 分红型
                p 我只是一句被配置的文案
                    

    .fund___list--p
        p 以上資料來源於基金公司及第三方數據商，相關數據僅供參考本頁面非任何法律文件，投資前請閱讀基金合同，招募說明書基金過往業績不預示未來表現，不構成投資建議，市場有風險投資需謹慎。
</template>
<script>
export default {
    data() {
        return {}
    }
}
</script>
<style lang="scss" scoped>
.fund__list--item {
    display: flex;
    flex-direction: row;
    background: #fff;
    padding: 14px 10px 10px 10px;
    .block__left {
        width: 40%;
        .fund_time {
            font-size: 12px;
            color: #999999;
            line-height: 20px;
            // padding: 8px 0 0 0;
        }

        .fund_number {
            font-size: 26px;
            font-family: yxFontDINPro-Medium;
            // line-height: 40px;
            padding: 8px 0 0 0;
        }
    }
    .block__right {
        width: 60%;
        display: flex;
        flex-direction: column;
        .fund_name {
            font-size: 14px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            line-height: 17px;
        }
        .fund__list--tag {
            display: flex;
            font-size: 10px;
            color: #666666;
            margin: 5px 0;
            flex-direction: row;
            .fund_tag {
                margin: 0 8px 0 0;
                display: flex;
                flex-direction: row;
                span {
                    line-height: 25px;
                }
            }
            .iconfont {
                font-size: 16px;
            }
            .icon-iconsjijinfengxiancopy-copy {
                color: #b38c23;
            }
            .icon-iconsjijinfengxian {
                color: #d0524a;
            }
            .icon-iconsjijinfengxiancopy-copy1 {
                color: #f8d61c;
            }
        }
        p {
            font-size: 12px;
            color: #666666;
        }
    }
}
.fund__details--list {
    width: 90%;
    margin: 0 5%;
    .fund___list--p {
        margin: 10px 0;
        p {
            font-size: 12px;
            line-height: 17px;
            color: #999999;
        }
    }
}
.fund__list--title {
    line-height: 50px;
    text-align: center;
}
</style>
