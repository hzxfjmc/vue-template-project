<template lang="pug">
    yx-container.lucky-draw-container
        .draw-main(slot='main')
            .top-main
                .header
                    .top-main 
                .lucky-draw()
                    img.draw-out(src="/webapp/marketing/lucky-draw/draw-out.png")
                    img.draw(src="/webapp/marketing/lucky-draw/draw.png" :style="{transform:'rotate('+rotateAngle+'deg)',transition:rotateTransition == ''?'transform 4s ease-out':rotateTransition }")
                    img.spin-arrow(src="/webapp/marketing/lucky-draw/spin-arrow.png" )
                    img.now(src="/webapp/marketing/lucky-draw/now.png" @click="isAllowClick? pointer(): ''")
            .draw-number
                .title 你共有 
                    span.timesCount {{drawTime}} 
                    span 次抽獎機會
                .introduce
                    img.active-title(src='/webapp/marketing/lucky-draw/group-intro.png')
                    .active-content
                        .content-item(v-for='item,index in contentList')
                            .left-item {{index+1+'.'}}
                            .right-item(v-html="item")
            .detail-rule
                .title 活動詳情及細則：
                .rule-content
                    .rule-item(v-for='item,index in detailList')
                        .left-item {{index+1+'.'}}
                        .right-item(v-html="item")
                .attention 注意：客戶不可同時參加其他迎新優惠。
                .active-rule 活動詳情及細則：
                .instructions {{instructions}}
                .license-number 推廣生意的競賽牌照號碼 52235
        .footer-dialog(slot='bottom')
            van-dialog.get-winning(v-model='isShow'  :show-confirm-button="false"
                :close-on-click-overlay="false")
                van-icon.close(name="cross" @click='closeDialog')
                .title 恭喜你已中獎！
                .opportunity(v-if='this.drawTime>0') 你共有  
                    span.times {{drawTime}} 
                    span 次抽獎機會
                .thanks(v-if='this.drawTime==0') 感謝你參加這次抽獎機會
                .price-content
                    .stock-name {{stockName}}
                    .stock-code {{stockCode}}
                    .stock-num {{stockNum}} 
                    .contine(v-if='this.drawTime>0') 
                        span.contine-word(@click='continueDraw') 繼續抽獎
                    .to-prize-center(v-if='this.drawTime==0')
                        span.contine-word(@click='jumpPrize') 前往獎品中心
                .license-number 推廣生意的競賽牌照號碼 52235
</template>

<script>
import { Popup, Icon } from 'vant'
import { mapGetters } from 'vuex'
import {
    getLotteryCount,
    getLotteryResult
} from '@/service/customer-relationship-server.js'
import { setTimeout } from 'timers'
export default {
    components: {
        [Popup.name]: Popup,
        [Icon.name]: Icon
    },
    data() {
        return {
            isAllowClick: true, // 是否允许抽奖
            rotateAngle: 0, //将要旋转的角度
            startRotatingDegree: 0, //初始旋转角度
            rotateTransition: '', //控制过渡效果
            isShow: false, //中奖弹窗
            drawTime: 4,
            contentList: [
                '推廣期 2019年7月1日至2019年9月30日。',
                '首次存款 (包括轉倉)港幣 $20,000 可抽獎 2 次，港幣 $50,000 可抽獎 5 次，最多可抽獎 5 次。',
                ' 抽獎活動只限首次存款用戶參與，不能重覆。',
                `獎品為隨機分配，包括: <br>
                1810 小米股票5股; <br>
                0005 匯豐銀行股票３股; <br>
                0388 港交所股票２股; <br>
                AAPL Apple Inc. 蘋果公司美股２股; <br>
                GOOGL Alphabet Inc. 美股(Google 母公司)２股。`
            ],
            stockType: '',
            stockName: '',
            stockCode: '',
            stockNum: '',
            prize: [
                {
                    type: 0,
                    code: 'GOOGL',
                    name: 'Google股票',
                    count: '2股'
                },
                {
                    type: 1,
                    code: '01810',
                    name: '小米股票',
                    count: '5股'
                },
                {
                    type: 2,
                    code: 'AAPL',
                    name: '蘋果股票',
                    count: '2股'
                },
                {
                    type: 3,
                    code: '00388',
                    name: '港交所股票',
                    count: '2股'
                },
                {
                    type: 4,
                    code: '00005',
                    name: '匯豐股票',
                    count: '3股'
                }
            ],
            detailList: [
                '活動日期為 2019年7月1 日至2019年9月30日止 (包括首尾兩天)。',
                '參加條件：只適用於活動期間，首次存款/轉倉(以單一存款計算) 客戶，金額不少於港幣 $20,000即可獲2次抽獎機會；港幣 $50,000 為5次；多於港幣 $50,000 亦為5次，最多可獲 5次抽獎機會。',
                '當客戶提交了首次存款/轉倉申請，並符合上述條件時，即可參加抽獎。',
                '抽獎活動只限首次存款用戶參與，不能重覆。若客戶使用其他個人資料另外開啟新帳號（如電話號碼），經核實為同一身分後，亦作重覆申請處理，不可再次參加抽獎。',
                '獎品為隨機分配，包括小米 (01810) 股票5股，匯豐銀行 (00005) 股票3股，港交所 (00388) 股票2股，蘋果公司 (AAPL) 美股2股，Alphabet Inc. (Google 母公司, GOOGL) 美股2股。每次均有中獎機會。 無特殊排名亦不可指定選擇。',
                '抽獎後，用戶可於「獎品中心」查看所得獎品，在確定存款成功前，獎品狀態均為「未激活」；在確定成功存款後，股票券會自動激活，所得股票將於5個交易日內入賬。',
                '成功存款/轉倉的定義為，客戶所提交金額已入賬 uSMART為準。如存款當中包括外幣，將根據 uSMART 所提供的匯率計算。',
                '若經審核後用戶未能成功存款，股票券將自動失效。再存款時可重新參加抽獎。 ',
                '如有任何爭議，友信證券有限公司保留活動最終決定權，並對所有人士具約束力。 ',
                '如有任何涉嫌欺詐、違反任何法規或不恰當行為而被本公司終止其賬戶，所有將會給予客戶的回贈款項將不獲退還。本公司會保留向客戶追討因上述客戶之行為而產生之所有法律責任或損失。',
                '上述優惠是有條件性的，在活動期內達到上述條件才可獲得，客戶如對上述優惠有任何查詢，歡迎致電 (852) 3018 4526與本公司銷售及客戶服務部聯絡。',
                '如中英文條款有所差異，一概以中文版本為準。'
            ],
            instructions:
                '此活動由友信證券有限公司提供，以上所載資料及其內容僅供參考，並不構成任何金融產品或工具之要約、招攬或邀請。投資者應注意投資涉及風險，金融產品價格可升可跌，甚至變成毫無價值而招致損失。如對產品投資風險有不明白之處，應尋求獨立專業意見。'
        }
    },
    computed: {
        ...mapGetters(['user'])
    },
    created() {
        this.getLotteryCountFun()
    },
    methods: {
        // 获取抽奖次数
        async getLotteryCountFun() {
            try {
                let res = await getLotteryCount()
                this.drawTime = res.count
            } catch (e) {
                this.$toast(e.msg || '網絡開小差了，請稍後再試')
            }
        },
        // 获取抽奖结果
        async getLotteryResultFun() {
            try {
                let res = await getLotteryResult()
                this.prize.forEach(item => {
                    if (item.code === res.stockCode) {
                        this.stockType = item.type
                        this.stockName = item.name
                        this.stockCode = item.code
                        this.stockNum = item.count
                    }
                })
                this.rotate()
            } catch (e) {
                if (e.msg) {
                    this.$toast(e.msg)
                }
                this.isAllowClick = false
            }
        },
        // 点击立即抽奖
        pointer() {
            if (this.drawTime === 0) {
                this.$toast('抱歉，您的抽獎次數使用完了')
            } else {
                if (this.isAllowClick) {
                    this.isAllowClick = false
                    this.getLotteryResultFun()
                }
            }
        },
        // 转动
        rotate() {
            //转动转盘
            let type = 0 // 默认为 0  转盘转动
            let randCircle = 10 // 附加多转几圈
            let duringTime = 4 // 默认为 5s
            this.rotateAngle = '' //转动的角度
            switch (this.stockType) {
                case 0:
                    this.rotateAngle = randCircle * 360 + 0
                    break
                case 1:
                    this.rotateAngle = randCircle * 360 + 95
                    break
                case 2:
                    this.rotateAngle = randCircle * 360 + 190
                    break
                case 3:
                    this.rotateAngle = randCircle * 360 + 225
                    break
                case 4:
                    this.rotateAngle = randCircle * 360 + 300
                    break
            }
            this.isAllowClick = false // 旋转结束前，不允许再次触发
            if (type == 0) {
                // 转动盘子
                // this.rotateAngle =
                //     this.startRotatingDegree +
                //     this.rotateAngle -
                //     (this.startRotatingDegree % 360) //将要旋转的角度
                // this.startRotatingDegree = this.rotateAngle //改变初始旋转的角度
                // 旋转结束后允许再次触发
                setTimeout(() => {
                    this.gameOver()
                }, duringTime * 1000 + 200)
            }
        },
        // 游戏结束
        gameOver() {
            // 游戏结束,重置旋转初始位置
            this.rotateAngle = 0 //真正控制转动角度的,为0,回到初始位置
            this.rotateTransition = 'transform 0.05s ease-out' //控制转动过渡效果的
            setTimeout(() => {
                this.rotateTransition = ''
            }, 100)
            // 中奖弹窗提示
            this.isShow = true
            // 更新抽奖次数
            this.drawTime = this.drawTime - 1
            this.isAllowClick = true
        },
        // 点击x关闭弹窗
        closeDialog() {
            this.isShow = false
        },
        // 继续抽奖
        continueDraw() {
            this.isShow = false
        },
        // 前往奖品中心
        jumpPrize() {
            this.isShow = false
            window.location.replace(
                window.location.origin +
                    '/webapp/marketing/award-center.html#/ch'
            )
            // this.$jsBridge.gotoNewWebview(
            //     `${window.location.origin}/webapp/marketing/award-center.html#/ch`
            // )
        }
    }
}
</script>

<style lang="scss" scoped>
$lucky-bg: #ff7144;
$detail-bg: #eb643a;
$stock-code: #9b9b9b;
$color-4: #ffe36e;
.lucky-draw-container {
    .draw-main {
        .top-main {
            background-image: url(/webapp/marketing/lucky-draw/light.png),
                url(/webapp/marketing/lucky-draw/top-background.png);
            background-position: center;
            background-size: cover;
            .header {
                padding-top: 18px;
                .top-main {
                    margin: 0 21px 10px 24px;
                    width: 330px;
                    height: 171px;
                    background-image: url(/webapp/marketing/lucky-draw/top-main.png);
                    background-position: center;
                    background-size: cover;
                    background-repeat: no-repeat;
                }
            }
            .lucky-draw {
                height: 360px;
                width: 360px;
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
                margin: auto;
                img {
                    position: absolute;
                    &.draw-out {
                        width: 353px;
                        height: 366px;
                        z-index: 5;
                        padding-bottom: 12px;
                    }
                    &.draw {
                        width: 278px;
                        height: 279px;
                        z-index: 10;
                        top: 36px;
                        left: 39px;
                    }
                    &.spin-arrow {
                        width: 98px;
                        height: 120px;
                        z-index: 20;
                    }
                    &.now {
                        cursor: pointer;
                        width: 54px;
                        height: 54px;
                        top: 163.5px;
                        z-index: 30;
                    }
                }
            }
        }

        .draw-number {
            width: 100%;
            height: 365px;
            display: flex;
            flex-direction: column;
            align-items: center;
            background-color: $lucky-bg;
            .title {
                width: 310px;
                height: 40px;
                margin: 0 0 24px;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 18px;
                line-height: 25px;
                color: #fff;
                letter-spacing: 2px;
                background: linear-gradient(
                    180deg,
                    rgba(245, 166, 81, 1) 0%,
                    rgba(235, 82, 22, 1) 100%
                );
                box-shadow: 2px 2px 4px 0px rgba(183, 85, 18, 0.74);
                border-radius: 20px;
                .timesCount {
                    // width: 30px;
                    text-align: center;
                    color: $color-4;
                    letter-spacing: 3px;
                    font-size: 30px;
                }
            }
            .introduce {
                width: 310px;
                height: 283px;
                background: rgba(255, 255, 255, 1);
                box-shadow: 2px 2px 4px 0px rgba(183, 85, 18, 0.74);
                border-radius: 10px;

                .active-title {
                    width: 300px;
                    height: 35px;
                    margin: 10px 3px 12px 7px;
                }
                .active-content {
                    width: 100%;
                    height: 209px;
                    padding: 0 0 17px 9px;
                    font-size: 12px;
                    color: $hk-text-color;
                    .content-item {
                        display: flex;
                        margin-bottom: 12px;
                        .left-item {
                            width: 15px;
                            margin-right: 3px;
                        }
                        .right-item {
                            flex: 1;
                        }
                    }
                }
            }
        }
        .detail-rule {
            background-color: $detail-bg;
            padding: 18px 15px 56px 15px;
            color: #fff;
            .title {
                font-size: 12px;
                line-height: 17px;
                margin-bottom: 10px;
            }
            .rule-content {
                padding-bottom: 20px;
                .rule-item {
                    display: flex;
                    margin-bottom: 12px;
                    font-size: 11px;
                    .left-item {
                        width: 15px;
                        margin-right: 3px;
                    }
                    .right-item {
                        flex: 1;
                    }
                }
            }
            .attention {
                margin-bottom: 20px;
                font-size: 12px;
            }
            .active-rule {
                margin-bottom: 16px;
                font-size: 12px;
            }
            .instructions {
                font-size: 11px;
                margin-bottom: 20px;
            }
            .license-number {
                display: flex;
                justify-content: flex-end;
                font-size: 10px;
            }
        }
    }
    .footer-dialog {
        .get-winning {
            width: 323px !important;
            height: 393px;
            background: #fff;
            box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
            border-radius: 10px;
            .close {
                position: absolute;
                right: 13px;
                top: 11px;
            }
            .title {
                width: 271px;
                height: 30px;
                font-size: 18px;
                font-family: PingFangHK-Medium;
                font-weight: 500;
                color: $hk-text-color;
                line-height: 15px;
                margin: 50px auto 9px;
                text-align: center;
                line-height: 30px;
            }
            .opportunity,
            .thanks {
                width: 288px;
                height: 44px;
                font-size: 16px;
                letter-spacing: 2px;
                margin: 0 auto;
                color: #fff;
                background-image: url(/webapp/marketing/lucky-draw/rectangle.png);
                background-position: center;
                background-size: cover;
                background-repeat: no-repeat;
                display: flex;
                justify-content: center;
                align-items: center;
                .times {
                    // width: 30px;
                    text-align: center;
                    color: $color-4;
                    letter-spacing: 3px;
                    font-size: 30px;
                }
            }
            .price-content {
                width: 222px;
                height: 161px;
                background-image: url(/webapp/marketing/lucky-draw/ticket.png);
                background-position: center;
                background-size: cover;
                background-repeat: no-repeat;
                margin: 28px auto 33px;
                text-align: center;
                padding-top: 38px;
                .stock-name {
                    font-size: 22px;
                    font-family: PingFangHK-Medium;
                    color: $hk-text-color;
                    line-height: 30px;
                    margin-bottom: 2px;
                }
                .stock-code {
                    font-size: 14px;
                    font-family: DINPro-Medium;
                    color: $stock-code;
                    line-height: 17px;
                    margin-bottom: 2px;
                }
                .stock-num {
                    font-size: 14px;
                    font-family: PingFangHK-Medium;
                    color: $hk-text-color;
                    margin-bottom: 9px;
                }
                .contine {
                    width: 100px;
                    height: 24px;
                    background-image: url(/webapp/marketing/lucky-draw/btn.png);
                    background-position: center;
                    background-size: cover;
                    background-repeat: no-repeat;
                    margin: 0 auto;
                    line-height: 24px;
                    .contine-word {
                        display: block;
                        width: 100px;
                        font-family: LiGothicMed;
                        font-size: 13px;
                        letter-spacing: 2px;
                        color: #fff;
                        text-shadow: 2px 2px 3px rgba(183, 75, 41, 0.5);
                    }
                }
                .to-prize-center {
                    @extend .contine;
                    width: 130px;
                    padding-left: 7px;
                }
            }
            .license-number {
                text-align: center;
                font-size: 10px;
                font-family: PingFangHK-Medium;
                font-weight: 500;
                color: $stock-code;
                line-height: 15px;
            }
        }
    }
}
</style>
