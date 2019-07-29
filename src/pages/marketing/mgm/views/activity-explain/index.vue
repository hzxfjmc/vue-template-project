<template lang="pug">
    .explain
        img.logo(src="@/assets/img/marketing/mgm/logo.png")
        div
            .headImg
                img(src="@/assets/img/marketing/mgm/titleImg.png")
            .info
                .title 
                .detail 
                    .timeLabel 活動時間:
                    .time 2019年7月1日至2019年9月30日<br>(包括首尾兩天)
                    .timeLabel 活動地區:
                        span 香港地區期間限定活動
                    .titleImg 
                        img(src="@/assets/img/marketing/mgm/infoTitleImg2.png")
                    .type 如何邀請好友？
                        p.method 第一步：
                        p 進入邀請好友頁面，點擊分享按鈕即可分享至好友或者分享至社交媒體
                        p.method2 第二步：
                        p 好友在註冊階段，填寫邀請者的專屬邀請碼    
                        p.method2 第三步：
                        p 在邀請好友頁面可追蹤好友進度及查閱獎品信息                       
                    .type 獲得什麼獎勵？
                        p 1) 每成功邀請一位好友註冊，即可獲得HKD10
                        p 2) 每成功邀請一位好友開戶，即可獲得HKD50
                        p 3) 每成功邀請一位好友存款/轉倉，即可獲得HKD200
                        p 4) 活動期內，獎品可累計, 每位現有客戶最多推薦10個好友
                        p 5) 被邀請者可獲得同等獎勵              
                    .type 條款及細則
                        p 1) 活動日期為2019年7月1日至2019年9月30日止 (包括首尾兩天)。
                        p 2) 現有客戶成功推薦好友並成功註冊，本公司會即時發出現金劵，現金劵將於2個交易日內自動生效，並將現金存入閣下的股票賬戶內及可即時使用。如好友成功開戶及或首次成功存款/轉倉等值港幣 $10,000或以上 (金額是以結算當天扣款匯率為準)，本公司亦會即時發出相等價值的現金劵，並自動存入閣下的股票賬戶內。
                        p 3) 不論客戶在本公司持有多個證券賬戶，本公司亦只會視作一個證券賬戶並有權將上述優惠發放在其中一個證券賬戶內。
                        p 4) 每位現有客戶最多推薦10位好友，獎品可以累計，指定禮品不可兌換或換取其他優惠或禮品。
                        p 5) 現有客戶需持有本公司有效交易賬戶。 
                        p 6) 被邀請開戶的好友必須並未持有任何本公司的交易賬戶 (個人及聯名賬戶亦計算在內) 並且完成相當開戶程序，邀請人 (現有客戶) 方可獲得相關獎品。
                        p 7) 所有被邀請開戶的新客戶更可同時享有其他迎新優惠。 
                        p 8) 被邀請好友必須於香港進行註冊, 開戶及存款/轉倉。
                        p 9) 被邀請好友必須完成開戶程序方可獲得獎品。
                        p 10) 本公司保留隨時更改、暫停或終止上述優惠、條款及細則的權利，而毋須另行通知客戶，並一切均以本公司之解釋為準。 
                        p 11) 如有任何爭議，友信證券有限公司保留活動最終決定權，並對所有人士具約束力。 
                        p 12) 如有任何涉嫌欺詐、違反任何法規或不恰當行為而被本公司終止其賬戶，所有將會給予客戶的回贈款項將不獲退還。本公司會保留向客戶追討因上述客戶之行為而產生之所以法律責任或損失。
                        p 13) 上述優惠是有條件性的，在活動期內達到上述條件才可獲得，客戶如對上述優惠有任何查詢，歡迎致電 +852 3018 4526與本公司銷售及客戶服務部聯絡。
                        p 14) 如中英文條款有所差異，一概以中文版本為準。
        div(v-if="isInvitor")
            .headImg2.isInvitor
                img(src="@/assets/img/marketing/mgm/titleImg2.png")
            .info
                .title 
                .detail 
                    .timeLabel  活動時間:
                    .time 2019年7月1日至2019年9月30日<br>(包括首尾兩天)   
                    .type 成功註冊、開戶、首次存款/轉倉
                        p 所有新客戶凡成功註冊、開戶、首次存款/轉倉達至所需條件，即可參加迎新活動及獲得獎品。                 
                    .type 成功註冊，及7天完成開戶
                        p 所有新客戶凡成功註冊即可享180日免佣免平台費優惠。（若註冊起7天內成功開戶，更可享30天美股LV1串流報價。）
                    .timeLabel.qualification 參加資格:
                        span 此活動僅限香港地區客戶參與，客戶並不可同時參加其他迎新優惠。
                    .type 活動詳情及細則
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
        .special
            p 風險及免責聲明：
            p 此活動由友信證券有限公司提供，以上所載資料及其內容僅供參考，並不構成任何金融產品或工具之要約、招攬或邀請。投資者應注意投資涉及風險，金融產品價格可升可跌，甚至變成毫無價值而招致損失。如對產品投資風險有不明白之處，應尋求獨立專業意見。
</template>

<script>
import { Icon } from 'vant'
export default {
    data() {
        return {
            isInvitor: false
        }
    },
    created() {
        this.isInvitor = JSON.parse(this.$route.query.Inviter || 0)
    },
    computed: {
        inviteName() {
            return this.$store.getters.userInfo.inviteName
        }
    },
    components: {
        [Icon.name]: Icon
    },
    methods: {
        goBack() {
            this.$router.go(-1)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../components/common.scss';
.explain {
    background: #f8fbff;
    padding: 30px 0 0 18px;
    .logo {
        display: block;
        width: 100px;
        height: 19px;
    }
    .isInvitor {
        padding-top: 40px !important;
        padding-bottom: 40px !important;
    }
    .headImg2 {
        padding: 20px 0 38px 0;
        text-align: center;
        img {
            width: 270px;
        }
    }
    .headImg {
        padding: 20px 0 50px 0;
        text-align: center;
        img {
            width: 220px;
        }
    }
    .info {
        position: relative;
        width: 338px;
        padding: 28px 14px 32px 14px;
        border: 8px solid #2b4f80;
        .title {
            position: absolute;
            top: -26px;
            left: 77px;
            @include W-H(182px, 52px);
            background: #f8fbff
                url('~@/assets/img/marketing/recruit-new/infoTitleImg.png')
                no-repeat center center;
            background-size: contain;
        }
        .detail {
            .titleImg {
                img {
                    width: 182px;
                }
                margin-top: 30px;
                text-align: center;
            }
            .qualification {
                margin-top: 20px;
                // margin-bottom: 20px;
            }
            .timeLabel {
                @include font('PingFangHK-Medium', 0.28rem, 500, #ff7439);
                span {
                    color: #193165;
                    line-height: 20px;
                }
            }
            .time {
                // height: 40px;
                margin-bottom: 10px;
                line-height: 30px;
                @include font('PingFangHK-Medium', 0.36rem, 500, #193165);
            }
            .type {
                line-height: 25px;
                margin-top: 20px;
                @include font('PingFangHK-Medium', 0.36rem, 500, #ff7439);
                .method {
                    font-size: 0.36rem;
                    margin-top: 10px;
                }
                .method2 {
                    font-size: 0.36rem;
                    margin-top: 20px;
                }
                p {
                    line-height: 20px;
                    margin-top: 6px;
                    margin-bottom: 6px;
                    @include font($size: 0.28rem, $color: #193165);
                    span {
                        display: block;
                        line-height: 20px;
                    }
                    .huilv {
                        display: inline-block;
                        @include font('DINPro-Bold', 0.32rem, 600, #ff7439);
                    }
                }
            }
        }
    }
    .special {
        padding: 30px 20px 30px 0;
        p {
            @include font($size: 0.28rem, $color: #193165);
            line-height: 20px;
            &:nth-of-type(1) {
                margin-bottom: 10px;
            }
        }
    }
}
</style>
