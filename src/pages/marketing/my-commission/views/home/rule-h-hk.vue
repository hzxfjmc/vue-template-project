<template lang="pug">
    .commission-rule
        template(v-if="$i18n.lang === 'zhCHS'")
            .rule__title 港股交易收费计划及规则说明
            .rule__content
                p.rule__content-h 1. 交易收费计划说明：
                p.rule__line.plan_name
                    span 推广收费计划
                p.rule__line
                    span 1) 免佣免平台费计划:
                    |   计划有效期内，特定用户可选择免佣免平台费计划，享港股交易0佣金，0平台使用费；
                p.rule__line.plan_name
                    span 常规收费计划
                p.rule__line
                    span 1) 一世免佣计划(系统预设计划):
                    |    所有用户均可选择，享港股交易每笔订单0.00%佣金，及固定每笔订单12港元平台使用费；
                p.rule__line
                    span 2) 一世免平台费计划:
                    |    所有用户均可选择，享港股交易0平台使用费，佣金标准收费如下：
                rule-table(:table="$t(`hkTable`)")
                p.rule__line 备注1：客户在交易时，uSMART将会先统一收取0.05%佣金，于每个交易日结束后，按客户该交易日总资产值对应的佣金费率结算佣金总数，如有多收，将于该交易日结束后回赠差额。
                p.rule__line 备注2：总资产值为每个交易日结束后，按照客户当时账户内所有资产计算(包括但不限于港股、美股、ETF、窝轮、牛熊证等产品)。若资产当中包括外币，将根据uSMART所提供的汇率计算。
                p.rule__content-h 2. 代收费项目说明：
                rule-table(:table="$t(`hkTable1`)")
                p.rule__content-h 3. 常规收费计划切换规则：
                p 1) 用户每月有1次机会从现有收费计划切换为常规收费计划(一世免平台费计划/一世免佣计划)；
                p 2) 切换收费计划后，新的计划从下一个交易日开始生效；
                //- p.rule__content-h 4. 孖展费用说明：（暂没有孖展服务）
                //- p
                //- | 1) 孖展年利率为6.8%
                //- br
                //- | 2) 孖展日数以365天为一年，以每日为计息单位，富月月结收取利息（即持仓过夜收息，日内还款，不收利息）
                //- <br>利息计算公式：孖展金额*6.8%*实际借孖展日数/365天（利息尾数不足$0.01港元亦作$0.01港元计算）
                //- p.text-align-center 示例：假设借孖展$10,000港元，连续借孖展10天，
                //- p.text-align-center 利息计算为$10,000港元*6.8%*10/365=$18.63港元
                //- p.rule__content-h 4. 即时股票报价：
                //- p.rule__line 忠实客户免费升级股票报价
                //- p.rule__line 1) 新客户于注册7天内成功开户，即赏1个月美股LV1串流报价；
                //- p.rule__line 2) 首次成功存款或转仓达港币$20，000，即赏1个月港股LV2串流报价；
                p.rule__content-h 4. 注意事项
                p 1) 本收费标准仅适用于香港地区用户；
                p 2) 买卖股票时，同一订单如被多次成交，只收取一次相关费用；
                p 3) 代收费项目，请以交易所及政府收费为准，详情请查看交易所网站。

        template(v-if="$i18n.lang === 'zhCHT'")
            .rule__title 港股交易收費計劃及規則說明
            .rule__content
                p.rule__content-h 1. 交易收費計劃說明：
                p.rule__line.plan_name
                    span 推廣收費計劃
                p.rule__line
                    span 1) 免佣免平台費計劃:
                    |  計劃有效期內，特選用戶可選擇免佣免平台費計劃，享港股交易$0佣金，$0平台使用費；
                p.rule__line.plan_name
                    span 常規收費計劃
                p.rule__line
                    span 1) 一世免佣計劃(系統預設計劃):
                    |  所有用戶均可選擇，享港股交易每筆訂單0.00%佣金，及固定每筆訂單$12港元平台使用費；
                p.rule__line
                    span 2) 一世免平台費計劃:
                    |  所有用戶均可選擇，享港股交易$0平台使用費，佣金標準收費如下:
                rule-table(:table="$t(`hkTable`)")
                p.rule__line 備註1：客戶在交易時，uSMART將會先统一收取0.05%佣金，於每個交易日結束後，按客戶該交易日總資產值對應的佣金費率結算佣金總數，如有多收，將於該交易日結束後回贈差額。
                p.rule__line 備註2: 總資產值為每個交易日結束後，按照客戶當時賬戶內所有資產計算(包括但不限於港股、美股、ETF、窩輪、牛熊證等產品)。 若資產當中包括外幣，將根據uSMART所提供的匯率計算。
                p.rule__content-h 2. 代收費項目說明：
                rule-table(:table="$t(`hkTable1`)")
                p.rule__content-h 3. 常規收費計劃切換規則：
                p 1) 用戶每月有1次機會從現有收費計劃切換為常規收費計劃(一世免平台費計劃/一世免佣計劃)；
                p 2) 切換收費計劃後，新的計劃從下一個交易日開始生效；
                //- p.rule__content-h 4. 孖展費用說明: (暫沒有孖展服務)
                //- p
                //- | 1) 孖展年利率為6.8%
                //- br
                //- | 2) 孖展日數以365天為一年，以每日為計息單位，當月月結收取利息（即持倉過夜收息，日內還款，不收利息）
                //- <br>利息計算公式： 孖展金額*6.8%*實際借孖展日數/ 365天（利息尾數不足$0.01港元亦作$0.01港元計算）
                //- p.text-align-center 示例：假設借孖展$10,000港元，連續借孖展10天，
                //- p.text-align-center 利息計算為 $10,000港元*6.8%*10/365= $18.63港元
                //- p.rule__content-h 4. 即時股票報價：
                //- p.rule__line 忠實客戶免費升級股票報價
                //- p.rule__line 1) 新客戶於註冊7天內成功開戶，即賞1個月美股LV 1串流報價；
                //- p.rule__line 2) 首次成功存款或轉倉達 港幣$20,000，即賞1個月港股LV2 串流報價；
                p.rule__content-h 4. 注意事項
                p 1) 本收費標準僅適用於香港地區用戶；
                p 2) 買賣股票時，每筆訂單如被劃分成多次成交，只收取一次相關費用；
                p 3) 代收費項目，請以交易所及政府收費為準，詳情請查看交易所網站。

        template(v-if="$i18n.lang === 'en'")
            .rule__title HK Stock Commission Plan
            .rule__content
                p.rule__content-h 1. Details of Charges:
                p.rule__line.plan_name
                    span Promotion Plan
                p.rule__line
                    span 1) $0 Commission and $0 Platform fee plan:
                    |  During the promotion period,selected customers can enjoy HK$0 commission and HK$0 platform usage fee plan for HK stock transactions.
                p.rule__line.plan_name
                    span Regular Plan

                p.rule__line
                    span 1) Lifetime $0 commission plan (Default plan):
                    |  All users are eligible to this plan with 0.00% commission rate and a fixed platform usage fee HK$12/ transaction for HK stock transactions.

                p.rule__line
                    span 2) Lifetime $0 Platform Fee plan:
                    |  All users are eligible to this plan with HK$0 platform usage fee for HK stock transactions. And standard commission rate as below:

                rule-table(:table="$t(`hkTable`)")

                p.rule__line Remarks 1: uSMART will charge for commission rate 0.05% first, and the final commission rate will be adjusted according to the total account asset by the end of each transaction day, the value difference will be rebated to customer.

                p.rule__line Remarks 2: Total account asset will be calculated by the end of each transaction day, including but not limited to HK and US stocks, ETF, Warrant, CBBC, etc. in customer's account. (Foreign currencies exchange rates are determined by uSMART).

                p.rule__content-h 2. Pass through fees:

                rule-table(:table="$t(`hkTable1`)")

                p.rule__content-h 3. Switching to Regular Plan：
                p
                | 1) Users will have an opportunity to switch to regular plan every month (either Lifetime $0 Platform Fee/ Lifetime $0 Commission).
                br
                | 2) The new plan will be effective on the next trading date after the switch.
                //- p.rule__content-h 4. 孖展費用說明: (暫沒有孖展服務)
                //- p
                //- | 1) 孖展年利率為6.8%
                //- br
                //- | 2) 孖展日數以365天為一年，以每日為計息單位，當月月結收取利息（即持倉過夜收息，日內還款，不收利息）
                //- <br>利息計算公式： 孖展金額*6.8%*實際借孖展日數/ 365天（利息尾數不足$0.01港元亦作$0.01港元計算）
                //- p.text-align-center 示例：假設借孖展$10,000港元，連續借孖展10天，
                //- p.text-align-center 利息計算為 $10,000港元*6.8%*10/365= $18.63港元
                //- p.rule__content-h 4. Real-time quotation services:

                //- p.rule__line Free upgrade of real-time stock quotes for loyal customers

                //- p.rule__line 1) New customer who successfully opened an account within 7 days of registration, is entitled to enjoy free 1-month US Stock real-time quote Level 1 streaming service.

                //- p.rule__line 2) Customers who have successfully made first time deposit/ transfer of shares valued at HK$20,000 or above are entitled to enjoy both free HK Stock real-time quote Level 2 streaming service.

                p.rule__content-h 4. Attentions：
                p
                | 1) All charges are applicable to Hong Kong region users only.
                br
                | 2) Fees/ charges will only be applied for once when customers placed one single transaction order.
                br
                | 3) Fees and charges determined and collected by the Hong Kong SAR Government and HKEX. You may visit the HKEX website for reference.



</template>

<script>
import RuleTable from './rule-table.vue'
export default {
    i18n: {
        zhCHT: {
            hkTable: [
                [`賬戶總資產`, `佣金`, `最低佣金`, `平台使用費`],
                [`$0 - $99,999港元`, `0.05%`, `$1港元/筆`, `$0港元/筆`],
                [`$100,000港元或以上`, `0.03%`, `$1港元/筆`, `$0港元/筆`]
            ],
            hkTable1: [
                [`類型`, `收費標準`, `收費方`],
                [`交易系統使用費`, `每筆訂單$0.5港元`, `香港交易所`],
                [`交易費`, `交易金額的0.005%`, `香港交易所`],
                [
                    `結算交收費`,
                    `交易金額的0.002%<br>（最低$2港元，最高$100港元）`,
                    `香港結算所`
                ],
                [`交易徵費`, `交易金額的0.0027%`, `香港證監會`],
                [
                    `股票印花稅`,
                    `交易金額的0.1%<br>（不足$1港元亦作$1港元計算）`,
                    `香港政府`
                ]
            ]
        },
        zhCHS: {
            hkTable: [
                [`账户总资产`, `佣金`, `最低佣金`, `平台使用费`],
                [`0 - 99,999港元`, `0.05%`, `1港元/笔`, `0港元/笔`],
                [`100,000港元或以上`, `0.03%`, `1港元/笔`, `0港元/笔`]
            ],
            hkTable1: [
                [`类型`, `收费标准`, `收费方`],
                [`交易系统使用费`, `每笔订单0.5港元`, `香港交易所`],
                [`交易费`, `交易金额的0.005%`, `香港交易所`],
                [
                    `结算交收费`,
                    `交易金额的0.002%<br>（最低2港元，最高100港元）`,
                    `香港结算所`
                ],
                [`交易征费`, `交易金额的0.0027%`, `香港证监会`],
                [
                    `股票印花税`,
                    `交易金额的0.1%<br>（不足1港元亦作1港元计算）`,
                    `香港政府`
                ]
            ]
        },
        en: {
            hkTable: [
                [
                    `Total Account Asset`,
                    `Commission Rate`,
                    `Min. Commission`,
                    `Platform Usage Fee`
                ],
                [
                    `Between HK$0 - HK$99,999`,
                    `0.05%`,
                    `HK$1 / transaction`,
                    `HK$0 / transaction`
                ],
                [
                    `HK$100,000 or above `,
                    `0.03%`,
                    `HK$1 / transaction`,
                    `HK$0 / transaction`
                ]
            ],
            hkTable1: [
                [`Category`, `Details of Charges`, `Payee`],
                [`Trading Tariff`, `HK$0.5 /transaction`, `HKEX`],
                [`Trading Fee`, `0.005% of transaction amount`, `HKEX`],
                [
                    `Stock Settlement Fee`,
                    `0.002% of transaction amount<br>(Mini. HK$2, Max. HK$100)`,
                    `CCASS`
                ],
                [`Transaction Levy`, `0.0027% of transaction amount`, `SFC`],
                [
                    `Stamp Duty on Stock Transaction`,
                    `0.1% of transaction amount<br>(Rounded up to the nearest HK$1)`,
                    `Hong Kong SAR Government`
                ]
            ]
        }
    },
    components: {
        RuleTable
    }
}
</script>
<style lang="scss" scoped>
.commission-rule {
    font-family: PingFangSC-Regular;
}
</style>
