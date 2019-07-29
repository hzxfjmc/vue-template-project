<template lang="pug">
    .detail 
        .timeLabel  活動時間:
        .time 2019年7月1日至2019年9月30日<br>(包括首尾兩天)
        .type 成功註冊、開戶、首次存款/轉倉
            p 所有新客戶凡成功註冊、開戶、首次存款/轉倉達至所需條件，即可參加迎新活動及獲得獎品。                 
        .type 成功註冊，及7天完成開戶
            p 所有新客戶凡成功註冊，及7天完成開戶即可享180日免佣免平台費優惠。
        .timeLabel.qualification 參加資格:
            span 此活動僅限香港地區客戶參與，客戶並不可同時參加其他迎新優惠。
        .type(v-if="hasSpecial") 活動詳情及細則
            p 1) 活動日期為2019年7月1日至2019年9月30日止 (包括首尾兩天)。
            p 2) 參加條件：只適用於活動期間，完成首次存款/轉倉(以單一存款計算) 的客戶，金額不少於港幣$20,000即符合條件可選擇幸運大抽獎或直接拎股票；活動只可2選1 ，不可重複參加。
            p 3) 當客戶提交了首次存款/轉倉申請，並符合上述條件時，即可參加活動。
            p 4) 活動只限首次存款用戶參與，不能重覆。若客戶使用其他個人資料另外開啟新帳號(如電話號碼)，經核實為同一身分後，亦作重覆申請處理，不可再次參加抽獎。
            p 5) 抽獎活動獎品為隨機分配，包括小米 (01810) 股票5股，匯豐銀行 (00005) 股票3股，港交所 (00388) 股票2股，蘋果公司 (AAPL) 美股2股，Alphabet Inc. (Google 母公司, GOOGL) 美股2股。每次均有中獎機會。無特殊排名亦不可指定選擇。
            p 6) 直接領取股票活動為首次存款/轉倉港幣$20,000 或以上，可獲匯豐銀行(00005)3股，港幣$50,000 或以上可獲港交所(00388)2股。 
            p 7) 得獎後，用戶可於「獎品中心」查看所得獎品，在確定存款/ 轉倉成功前，獎品狀態均為「未生效」；在確定成功存款後，股票券會自動生效，所得股票將於5個交易日內入賬。 
            p 8) 成功存款/轉倉的定義為，客戶所提交金額已入賬uSMART為準。如存款當中包括外幣，將根據uSMART所提供的匯率計算。
            p 9) 若經審核後用戶未能成功存款，股票券將自動失效。再存款時可重新參加活動。
            p 10) 如有任何爭議，友信證券有限公司保留活動最終決定權，並對所有人士具約束力。
            p 11) 如有任何涉嫌欺詐、違反任何法規或不恰當行為而被本公司終止其賬戶，所有將會給予客戶的回贈款項將不獲退還。本公司會保留向客戶追討因上述客戶之行為而產生之所有法律責任或損失。
            p 12) 上述優惠是有條件性的，在活動期內達到上述條件才可獲得，客戶如對上述優惠有任何查詢，歡迎致電 (852) 3018 4526與本公司銷售及客戶服務部聯絡。
            p 13) 如中英文條款有所差異，一概以中文版本為準。
</template>

<script>
export default {
    props: {
        hasSpecial: {
            type: Boolean,
            default: true
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../common.scss';
.detail {
    .timeLabel {
        @include font('PingFangHK-Medium', 0.28rem, 500, #ff7439);
        span {
            color: #193165;
            line-height: 20px;
        }
    }
    .qualification {
        margin-top: 20px;
        // margin-bottom: 20px;
    }
    .time {
        // height: 40px;
        margin-bottom: 20px;
        @include font('PingFangHK-Medium', 0.36rem, 500, #193165);
        line-height: 30px;
    }
    .type {
        @include font('PingFangHK-Medium', 0.36rem, 500, rgba(255, 116, 57, 1));
        line-height: 25px;
        margin-top: 20px;
        .gray {
            font-size: 0.28rem;
            color: rgba(25, 49, 101, 0.4);
            line-height: 20px;
        }
        p {
            @include font($size: 0.28rem, $color: rgba(25, 49, 101, 1));
            line-height: 20px;
            margin-top: 6px;
            margin-bottom: 6px;
            .huilv {
                display: inline-block;
                @include font('DIN Pro Bold', 0.32rem, 600, #ff7439);
            }
        }
    }
}
</style>
