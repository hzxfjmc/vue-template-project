<template lang="pug">
    .reservation-guide-box.mb-48
        .top-title
            img(src="/open-account/bank/zhongxinbank.png")
        .step-info-box
            h2.title 开卡资格
            ul.list
                li #[p 1、年满18岁或以上的个人客户(不包括联名)]
                li #[p 2、申请人只限于中国公民]
                li #[p 3、申请人在内地中信银行账户须保有至少2万人民币资产]
        .step-info-box
            h2.title 开卡材料
            .bank-box
                p 1、本人有效身份证原件（有效期须大于半年）
                p 2、港澳通行证（有效期半年以上且含一年多次有效的签注）或护照

        .step-info-box.pb-30
            h2.title 办理流程
            h3.sub-title 1、预约开户
            p  建议您通过中信银行客服热线（ 95568）或网点联系电话预约办理香港银行卡开户业务
            h3.sub-title 2、亲临网点
            p  前往指定网点，若您没有内地中信银行卡，可在指定网点同时办理内地民生贵宾卡（当场存5万人民币即可）、U宝（手工费34.5元，用于中信香港银行卡转账）及中信香港账户，网点办理过程20分钟左右
            p
                a.link(href="javascrit:;") 网点查询 >
            h3.sub-title 3、成功开户
            p  中信香港为电子账户，在收到开通短信和电邮通知后，即可通过中信香港网银或手机银行进行操作
            h2.title 联系方式
            .contact-box
                p #[span 官方网站:] #[a.link(href="javascrit:;") http://hk.cmbc.com.cn]
                p #[span 客服热线:] #[a.link(href="javascrit:;") （内地）95568]
                p #[a.link(href="javascrit:;") （香港）852-25195568]
        .btn 预约办理(香港)中信银行卡
</template>

<script>
/**
 * 香港银行卡办理-办卡指南页
 * @ Author LINJAIJUN
 * @ Date 2018/12/25
 */
export default {
    data() {
        return {}
    }
}
</script>
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
.ml-55 {
    margin-left: 55px;
}
.pb-30 {
    padding-bottom: 30px;
}
.reservation-guide-box {
    width: 100%;
    padding: 26px 12px 0;
    background: #fff;
    .top-title {
        height: 37px;
        text-align: center;
    }
    .link {
        font-size: 14px;
        font-weight: 400;
        color: rgba(40, 90, 200, 1);
    }
    .btn {
        position: fixed;
        width: 100%;
        height: 48px;
        background: rgba(40, 90, 200, 1);
        text-align: center;
        line-height: 48px;
        cursor: pointer;
        color: #fff;
        font-size: 16px;
        bottom: 0;
        left: 0;
    }
}
.step-info-box {
    p {
        line-height: 24px;
        font-weight: 400;
    }
    .title {
        font-size: 18px;
        font-weight: 500;
        color: rgba(53, 53, 71, 1);
        line-height: 22px;
        margin-top: 27px;
        margin-bottom: 8px;
    }
    .sub-title {
        font-size: 14px;
        font-weight: 500;
        color: rgba(53, 53, 71, 1);
        line-height: 24px;
        margin-top: 8px;
    }
    .s-sub-title {
        margin-top: 10px;
    }
    .contact-box {
        span {
            position: absolute;
        }
        a {
            margin-left: 66px;
        }
    }
}
</style>
