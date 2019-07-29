<template lang="pug">
    .know-more-wrap
        .title-head {{$t('thisMeasures')}}：
        .tip-text(v-for="item in text") {{item}}
        .title-bottom {{$t('knowNewMeasure')}}
</template>

<script>
export default {
    name: 'know-more',
    i18n: {
        zhCHS: {
            thisMeasures: 'uSMART的员工交易政策可能包括(但不限于)以下的措施',
            knowNewMeasure:
                '请您向uSMART的合规部门或客服了解最新的员工交易政策。',
            contentArrMsg: [
                '1. 员工帐户不可以和客户帐户或任何由uSMART所管理的基金或委托帐户进行交叉交易',
                '2. 如员工打算进行的交易，uSMART所管理的基金或委托账户在当天也有买卖盘等待执行，在基金或委托账户的买卖盘执行或撤回前，员工账户不得买入或卖出该投资',
                '3. 如员工知道uSMART所管理的基金或委托账户即将进行交易，员工账户不得在替基金或委托账户买卖某项投资的前后一天内，除非得到uSMART管理层或合规部的核准，不得买入或卖出该项投资',
                '4. 如员工知道uSMART即将作出一项推介，则在友信推介该项投资前后一天内，除非得到uSMART管理层或合规部的核准，不得买卖该投资',
                '5. 员工不可卖空任何由uSMART推介买入的证券',
                '6. 员工不可参与uSMART所管理的基金或委托账户或与其有关连人士可以认购的首次公开招股。员工亦不应该利用其职权，使自己或任何其他人士获得首次公开招股中所分配的新股',
                '7. 员工须持有其所持有私人投资项目最少30天，但事前获得合规部或uSMART的管理层所指定的人士书面批准提早出售者除外',
                '8. 在进行任何公开配售或私人配售时，员工账户将被给予在分派所获分配证券时的最低优先级(低于客户账户及公司账户)'
            ]
        },
        zhCHT: {
            thisMeasures: 'uSMART的員工交易政策可能包括(但不限於)以下的措施',
            knowNewMeasure:
                '請您向uSMART的合規部門或客服了解最新的員工交易政策。',
            contentArrMsg: [
                '1. 員工賬戶不可以和客戶賬戶或任何由uSMART所管理的基金或委託賬戶進行交叉交易',
                '2. 如員工打算進行的交易，uSMART所管理的基金或委託賬戶在當天也有買賣盤等待執行，在基金或委託賬戶的買賣盤執行或撤回前，員工賬戶不得買入或賣出該投資',
                '3. 如員工知道uSMART所管理的基金或委託賬戶即將進行交易，員工賬戶不得在替基金或委託賬戶買賣某項投資的前後一天內，除非得到uSMART管理層或合規部的核准，不得買入或賣出該項投資',
                '4. 如員工知道uSMART即將作出一項推介，則在友信推介該項投資前後一天內，除非得到uSMART管理層或合規部的核准，不得買賣該投資',
                '5. 員工不可賣空任何由uSMART推介買入的證券',
                '6. 員工不可參與uSMART所管理的基金或委託賬戶或與其有關連人士可以認購的首次公開招股。員工亦不應該利用其職權，使自己或任何其他人士獲得首次公開招股中所分配的新股',
                '7. 員工須持有其所持有私人投資專案最少30天，但事前獲得合規部或uSMART的管理層所指定的人士書面批准提早出售者除外',
                '8. 在進行任何公開配售或私人配售時，員工賬戶將被給予在分派所獲分配證券時的最低優先順序(低於客戶賬戶及公司賬戶)'
            ]
        },
        en: {
            thisMeasures:
                'uSMART employee trading policy may include (but is not limited to) the following',
            knowNewMeasure:
                "Please check with SMART's compliance department or customer service for the latest employee trading policy.",
            contentArrMsg: [
                '1. Employee accounts may not be cross-traded with customer accounts or any funds or commissioned accounts managed by uSMART',
                '2. Employee may not buy or sell an investment on a day in which any funds or commissioned accounts managed by uSMART have a pending “buy” or “sell” order in the same investment until that order is executed or withdrawn',
                '3. Employee may not buy or sell an investment for their personal account within one trading day before (if the employee is aware of a forthcoming fund or commissioned account transaction) or after trading in that investment on behalf of a fund or commissioned account managed by uSMART unless employee obtain prior written permission for personal account dealing from the compliance officer or other person designated by senior management',
                '4. Employee may not buy or sell an investment for their personal account within one trading day before (if the employee is aware of a forthcoming recommendation) or after a recommendation on that investment is made or proposed by uSMART unless employee obtain prior written permission for personal account dealing from the compliance officer or other person designated by senior management',
                '5. Employee may not short sell any securities recommended by SMART for purchase',
                '6. Employee should be prohibited from participating in initial public offerings available to any funds or commissioned accounts managed by uSMART, and should not use their positions to gain access to initial public offerings for themselves or any other person',
                '7. Employees are required to hold all personal investments for at least 30 days, unless prior written approval of the compliance officer or other persons designated by senior management is given for an earlier disposal',
                "8. Employee's account will be given the lowest priority (lower than client's and company's accounts) in any public offer shares or private placement"
            ]
        }
    },
    data() {
        return {
            text: this.$t('contentArrMsg')
        }
    }
}
</script>

<style scoped lang="scss">
.know-more-wrap {
    padding: $global-padding;
    background-color: rgba(47, 121, 255, 0.026);
    .title-head {
        font-size: 18px;
        line-height: 22px;
        padding-bottom: 15px;
    }
    .tip-text {
        padding: 5px;
    }
    .title-bottom {
        font-size: 16px;
        line-height: 22px;
        padding: 15px 0;
    }
}
</style>
