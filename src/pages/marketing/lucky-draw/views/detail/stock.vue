<template lang="pug">
    yx-container.activity-detail-container
        .activity-detail(slot='main')
            .logo
            img.title(src='/webapp/marketing/lucky-draw/detail/stock.png')  
            .activity-rule
                .activity-main
                    .title 活動規則
                    .title-tetx 活動簡介
                    .introduce-content
                        .content-item(v-for='item,index in introduceList')
                            .left-item {{index+1+')'}}
                            .right-item(v-html="item")
                    .attention(v-html='attentionText')
                    .activity-detail 活動詳情及細則
                    .detail-content
                        .content-item(v-for='item,index in detailList')
                            .left-item {{index+1+')'}}
                            .right-item(v-html="item")
            .responsibility
                .res-title 風險及免責聲明：
                .res-content(v-html="resContent")
</template>

<script>
export default {
    data() {
        return {
            introduceList: [
                `推廣期 2019年7月1日至2019年9月30日(包括 <br>
                首尾兩天)。`,
                `首次存款 /轉倉(以單一存款計算)  <br>
                港幣$20,000 可獲匯豐銀行3股， <br>
                港幣$50,000可獲港交所2股。`,
                `贈送股票活動只限首次成功存款/轉倉用戶參 <br>
                與，不能重覆。`
            ],
            attentionText: `注意：此活動僅限香港地區客戶參與，客戶並不可同時參加其他迎新優惠。`,
            detailList: [
                `活動日期為 2019年7月1 日至2019年9月30日 <br>
                止 (包括首尾兩天)。`,
                `參加條件：只適用於活動期間，首次存款/轉 <br>
                倉(以單一存款計算) 客戶，金額不少於 <br>
                港幣$20,000可獲匯豐銀行(00005)3股，<br>
                港幣$50,000可獲港交所(00388)2股。`,
                `當客戶提交了首次存款/轉倉申請，並符合上 <br>
                述條件時，即可參加活動。`,
                `活動只限首次存款用戶參與，不能重覆。若 <br>
                客戶使用其他個人資料另外開啟新帳號（如電 <br>
                話號碼），經核實為同一身分後，亦作重覆申<br>
                請處理，不可再次參加抽獎。`,
                `領獎後，用戶可於「獎品中心」查看所得獎 <br>
                品，在確定存款成功前，獎品狀態均為「未 <br>
                激活」；在確定成功存款後，股票券會自動 <br>
                激活，所得股票將於5個交易日內入賬。`,
                `成功存款/轉倉的定義為，客戶所提交金額已 <br>
                入賬 uSMART為準。如存款當中包括外幣，<br>
                將根據 uSMART 所提供的匯率計算。`,
                `若經審核後用戶未能成功存款，股票券將自 <br>
                動失效。再存款時可重新參加活動。`,
                `如有任何爭議，友信證券有限公司保留活動 <br>
                最終決定權，並對所有人士具約束力。`,
                `如有任何涉嫌欺詐、違反任何法規或不恰當 <br>
                行為而被本公司終止其賬戶，所有將會給予 <br>
                客戶的回贈款項將不獲退還。本公司會保留 <br>
                向客戶追討因上述客戶之行為而產生之所有 <br>
                法律責任或損失。`,
                `上述優惠是有條件性的，在活動期內達到上 <br>
                述條件才可獲得，客戶如對上述優惠有任何 <br>
                查詢，歡迎致電 (852) 3018 4526與本公司 <br>
                銷售及客戶服務部聯絡。`,
                `如中英文條款有所差異，一概以中文版本為 <br>
                準。 `
            ],
            resContent: `此活動由友信證券有限公司提供，以上所載資料及其內 <br>
            容僅供參考，並不構成任何金融產品或工具之要約、招 <br>
            攬或邀請。投資者應注意投資涉及風險，金融產品價格 <br>
            可升可跌，甚至變成毫無價值而招致損失。如對產品投 <br>
            資風險有不明白之處，應尋求獨立專業意見。`
        }
    },
    methods: {}
}
</script>

<style lang="scss" scoped>
.activity-detail-container {
    .activity-detail {
        padding-left: 16px;
        margin-top: 17px;
        .logo {
            width: 105px;
            height: 20px;
            background: url(/webapp/marketing/lucky-draw/detail/logo.png);
            background-position: center;
            background-size: cover;
            margin-bottom: 12px;
        }
        .title {
            width: 260px;
            height: 60px;
            margin: 0 auto 22px;
            display: flex;
            justify-content: center;
        }
        .activity-rule {
            border: 8px solid $detail-border-color;
            margin: 0 18px 19px 2px;
            padding-left: 17px;
            position: relative;
            .activity-main {
                .title {
                    width: 110px;
                    height: 30px;
                    font-size: 22px;
                    font-family: PingFangHK-Semibold;
                    font-weight: 600;
                    color: $hk-text-color;
                    line-height: 30px;
                    position: absolute;
                    top: -19px;
                    left: 114px;
                    background-color: #fff;
                }
                .title-tetx {
                    width: 274px;
                    height: 25px;
                    font-size: 18px;
                    font-family: PingFangHK-Medium;
                    font-weight: 700;
                    color: $active-color;
                    line-height: 25px;
                    margin: 34px 0 12px;
                }
                .activity-detail {
                    @extend .title-tetx;
                    margin-top: 20px;
                    padding-left: 0;
                }
                .introduce-content {
                    margin-bottom: 20px;
                }
                .detail-content {
                    margin-bottom: 22px;
                }
                .introduce-content,
                .detail-content {
                    .content-item {
                        display: flex;
                        margin-bottom: 10px;
                        .left-item {
                            width: 11px;
                            height: 20px;
                            font-size: 14px;
                            font-family: PingFangHK-Medium;
                            font-weight: 500;
                            color: $active-content;
                            margin-right: 10px;
                        }
                        .right-item {
                            flex: 1;
                            text-align: left;
                        }
                    }
                }
                .attention {
                    font-size: 14px;
                    font-family: PingFangHK-Medium;
                    color: $active-content;
                    line-height: 20px;
                }
                .activity-instruction {
                    width: 296px;
                    height: 40px;
                    font-size: 14px;
                    font-family: PingFangHK-Medium;
                    font-weight: 500;
                    color: $active-content;
                    line-height: 20px;
                }
            }
        }
        .responsibility {
            .res-title {
                font-size: 14px;
                font-family: PingFangHK-Regular;
                font-weight: 400;
                color: $active-content;
                line-height: 20px;
                text-align: left;
            }
            .res-content {
                @extend .res-title;
                margin-top: 10px;
                margin-bottom: 20px;
            }
        }
    }
}
</style>
