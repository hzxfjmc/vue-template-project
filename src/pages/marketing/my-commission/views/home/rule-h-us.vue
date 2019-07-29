<template lang="pug">
    .commission-rule
        template(v-if="$i18n.lang === 'zhCHS'")
            .rule__title 美股交易收费计划及规则说明
            .rule__content
                p.rule__content-h 1. 交易收费计划说明：
                p.rule__line.plan_name
                    span 常规收费计划
                p.rule__line
                    span 一世免佣计划(系统预设计划):
                    |  所有用户均可选择，享美股交易每笔订单0.00%佣金、固定每股0.005美元平台使用费(每笔订单最高收取交易金额的0.5%平台使用费；最低收取1.5美元平台使用费)及每股0.003美元交收费。

                p.rule__content-h 2. 代收费项目说明：
                rule-table(:table="$t(`tableUS`)")

                p.rule__content-h 3. 注意事项
                p 1) 本收费标准仅适用于香港地区用户；
                p 2) 交易低价股波动大且存在退市可能，投资者需要注意风险；为保护投资者利益，佣金、平台使用费最多只收取交易金额的0.5%；
                p 3) 买卖股票时，同一订单如被多次成交，只收取一次相关费用；
                p 4) 代收费项目，请以交易所及政府收费为准，详情请查看交易所网站。

        template(v-if="$i18n.lang === 'zhCHT'")
            .rule__title 美股交易收費計劃及規則說明
            .rule__content
                p.rule__content-h 1. 交易收費計劃說明:
                p.rule__line.plan_name
                    span 常規收費計劃
                p.rule__line
                    span 一世免佣計劃(系統預設計劃):
                    |  所有用戶均可選擇，享美股交易每筆訂單0.00%佣金、固定每股$0.005美元平台使用費(每筆訂單最高收取交易金額的0.5%平台使用費; 最低收取$1.5美元平台使用費)及每股$0.003美元交收費。

                p.rule__content-h 2. 代收費項目說明:
                rule-table(:table="$t(`tableUS`)")
                p.rule__content-h 3. 注意事項:
                p 1) 本收費標準僅適用於香港地區用戶；
                p 2) 交易細價股波動大且存在退市可能，投資者需要注意風險；為保護投資者利益，佣金、平台使用費最多只收取交易金額的0.5%；
                p 3) 買賣股票時，同一訂單如被多次成交，只收取一次相關費用；
                p 4) 代收費項目，請以交易所及政府收費為準，詳情請查看交易所網站。

        template(v-if="$i18n.lang === 'en'")
            .rule__title US Stock Commission Plan
            .rule__content
                p.rule__content-h 1. Details of Charges：
                p.rule__line.plan_name
                    span Regular Plan
                p.rule__line
                    span Lifetime $0 Commission Plan (Default plan):
                    | All users are eligible to enjoy 0.00% commission rate per US stock transaction, with a fixed US$0.005 platform usage fee per share, plus US$0.003 settlement fee per share.
                    <br>*Max. platform usage fee: 0.5% of transaction amount/ transaction
                    <br>Min. platform usage fee: US$1.5/ transaction



                p.rule__content-h 2. Pass through fees：
                rule-table(:table="$t(`tableUS`)")
                p.rule__content-h 3. Attentions:
                p 1) All charges are applicable to Hong Kong region users only.
                p 2) Investors should be aware of the risks of investing in penny stocks, including volatility and delisting. To protect investors, the maximum charges of commission fee and platform usage fee will be 0.5% of transaction amount.
                p 3) Fees and charges will only be applied for once when customers placed one single transaction order.
                p 4) Fees and charges determined and collected by the US SEC and FINRA. You may visit the official websites for reference.

</template>

<script>
import RuleTable from './rule-table.vue'
export default {
    i18n: {
        zhCHT: {
            tableUS: [
                [`類型`, `收費標準`, `收費方`],
                [
                    `證監會規費 <br>（僅賣單時收取）`,
                    `0.00207%*交易金額 <br> （不足$0.01美元亦作$0.01美元計算）`,
                    `美國證監會`
                ],
                [
                    `交易活動費 <br>（僅賣單時收取）`,
                    `$0.000119美元*賣出股票數量<br>（不足$0.01美元亦作$0.01美元計算）<br>（每筆訂單最高收取 $5.95 美元）`,
                    `美國金融業監管局`
                ]
            ]
        },
        zhCHS: {
            tableUS: [
                [`类型`, `收费标准`, `收费方`],
                [
                    `证监会规费 <br>（仅卖单时收取）`,
                    `0.00207%*交易金额 <br> （不足0.01美元亦作0.01美元计算）`,
                    `美国证监会`
                ],
                [
                    `交易活动费 <br>（仅卖单时收取）`,
                    `0.000119美元*卖出股票数量<br>（不足0.01美元亦作0.01美元计算）<br>（每笔订单最高收取5.95美元）`,
                    `美国金融业监管局`
                ]
            ]
        },
        en: {
            tableUS: [
                [`Category`, `Details of Charges`, `Payee`],
                [
                    `SEC fee <br> (Only applicable for sell orders)`,
                    `0.00207%*transaction amount<br>(Rounded up to the nearest US$0.01)`,
                    `US SEC`
                ],
                [
                    `Trading Activity Fee <br> (Only applicable for sell orders)`,
                    `US$0.000119 * shares sold<br>(Rounded up to the nearest US$0.01)<br>(Maximum charge US$5.95/ transaction)`,
                    `FINRA`
                ]
            ]
        }
    },
    components: {
        RuleTable
    }
}
</script>
