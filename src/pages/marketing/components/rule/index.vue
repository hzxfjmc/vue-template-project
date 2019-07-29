<template lang="pug">
    van-popup.rule(v-model="showPopup")
        img.close(src="@/assets/img/marketing/recruit-new-ch/close.svg" @click="closePopup")
        img.title(src="@/assets/img/marketing/recruit-new-ch/ruleTitle.png")
        p
            span 1.活动时间：
            = '2019-07-08 00:00:00至2019-09-08 23:59:59'
        p
            span 2.活动资格：
            = '本活动仅限内地用户参与'
        p
            span 3.活动规则：
        p （1）新用户完成注册并绑定手机号（同一用户通过不同方式注册登录仅视为一次有效注册），获得180天高级行情（港股LV2行情&美股LV1行情）和股票红包1个；
        p （2）新用户完成开户，可获得港、美股永久免佣资格，享港、美股交易0佣金；
        p （3）新用户完成首次入金/转仓，达到如下标准，获得对应奖励：
        table
            tr
                th 金额
                    span （港币或等额美元）
                th 奖励
                    span （人民币现金）
            tr(v-for="item in list")
                td {{item.name}}
                td {{item.reward}}
        p （4）股票红包详细说明：
        p 1）新用户完成注册后，可获得1个股票红包，分享到微信和好友一起开启，有机会获得如下公司股票：腾讯控股、阿里巴巴、苹果、京东、中国平安、中国恒大、小米集团、腾讯音乐；
        p 2）每个股票红包内共有1000份股票，可供1000位用户领取；
        p 3）用户领取了自己红包内的股票后，还可领取好友分享的股票，最多可得3份股票；
        p 4）同一个股票红包，每位用户最多领取1股；
        p （5）奖励发放及领取：
        p 1）180天港股LV2行情：完成注册并绑定手机号后发放，即刻生效；
        p 2）180天美股LV1行情：完成注册并绑定手机号后发放，即刻生效；
        p 3）永久港、美股免佣：仅限活动期间完成开户的用户可得，即刻生效，用户可享永久港、美股交易0佣金；
        p 4）现金奖励：用户首次成功入金/转仓并达到奖励发放标准后，以现金券的形式发放到您的友信智投App“个人中心-奖励中心”，点击“立即使用”，前往微信服务号“友信智投”绑定您的友信账户，现金将以微信红包的方式发放到您的微信账户；
        p 5）股票奖励，用户领取股票后，即刻以股票卡的形式发放到您的友信智投账户，可在友信智投App“个人中心-奖励中心”中查看，入金≥1港元即可激活股票卡，成功使用股票卡后，股票将在5个交易日内存入您的股票账户；
        p （6）其他声明：
        p 1）兑换标准：1USD=7.75HKD；
        p 2）内地用户指拥有中国大陆身份证且常驻地在中国大陆的用户；
        p 3）活动所得港股LV2行情为内地版，仅限内地用户在中国大陆使用；
        p 4）首次入金金额以实际完成到账为准，首次转仓以发起转仓前一个交易日的收盘价格计算到账股票价值；
        p 5）入金/转仓必须来自用户于金融机构的同名个人账户，不接受第三者出入金/转仓；
        p 6）本优惠活动及相关的广告内容不构成任何证券、金融产品或工具的邀约、招揽、建议、意见或任何保证；
        p 7）其他疑问可拨打客服电话400-626-1888或通过在线客服咨询；
        p 8）友信智投享有对此活动的解释权及最终决定权。
</template>

<script>
import { Popup } from 'vant'

export default {
    data() {
        return {
            list: [
                {
                    name: 'HK$0 < 金额 < 10,000',
                    reward: '￥100'
                },
                {
                    name: 'HK$10,000 ≤ 金额 < 30,000',
                    reward: '￥200'
                },
                {
                    name: 'HK$30,000 ≤ 金额 < 100,000',
                    reward: '￥300'
                },
                {
                    name: 'HK$100,000 ≤ 金额 < 500,000',
                    reward: '￥500'
                },
                {
                    name: 'HK$500,000 ≤ 金额 < 1,000,000',
                    reward: '￥800'
                },
                {
                    name: 'HK$1,000,000及以上',
                    reward: '￥1000'
                }
            ]
        }
    },
    props: {
        value: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        showPopup: {
            get() {
                return this.value
            },
            set(val) {
                this.$emit('input', val)
            }
        }
    },
    components: {
        [Popup.name]: Popup
    },
    methods: {
        closePopup() {
            this.showPopup = false
        }
    }
}
</script>

<style scoped lang="scss">
.rule {
    width: 335px;
    height: 400px;
    padding: 14px 17px;
    border-radius: 20px;
    .close {
        float: right;
    }
    .title {
        display: block;
        width: 107px;
        margin: 6px auto 10px;
    }
    p {
        font-size: 12px;
        color: #4a1d1d;
        line-height: 20px;
        span {
            font-weight: 500;
        }
    }
    table {
        color: #4a1d1d;
        border-collapse: collapse;
        width: 100%;
        margin: 10px 0;
        tr {
            width: 100%;
            th {
                padding: 4px 0 6px;
                border: 1px solid #e9c3bb;
                line-height: 16px;
                text-align: center;
                span {
                    display: block;
                    font-size: 0.24rem;
                    line-height: 17px;
                    transform: scale(0.83);
                }
            }
            td {
                border: 1px solid #e9c3bb;
                padding: 2px 8px;
            }
        }
    }
}
</style>
