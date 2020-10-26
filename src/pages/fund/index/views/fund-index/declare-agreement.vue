<template lang="pug">
.block__agreement--list
    .agreement__list--item
        h3 {{$t('disclaimerTitle')}}
        p {{$t('describe1')}}
        p {{$t('describe2')}}
    .agreement__list--item
        h3 {{$t('riskTitle')}}
        p {{$t('describe3')}}
        p {{$t('describe4')}}
</template>
<script>
import { Swipe, SwipeItem } from 'vant'
import { mapGetters } from 'vuex'
export default {
    i18n: {
        zhCHS: {
            disclaimerTitle: '免责声明',
            describe1:
                '本网页所载有及/或提供之数据仅供一般参考之用, 本公司无职责就任何交易的合适性为客户作出判断, 并不构成, 亦无意作为, 也不应被诠释为专业意见、要约、招揽或建议投资于此资料内所述之任何基金或投资产品。投资者须注意, 所有投资涉及风险(包括可能会失投资本金), 基金及投资产品之价格可升可跌, 而所呈列的过往表现资料并不表示将来亦会有类似的表现。投资者在作出任何投资决定前, 应详细阅读相关基金及投资产品之销售文件及条款细则(包括当中所载之风险因素之全文)。',
            describe2:
                '投资者须基于本身的财政状况、投资经验、投资目标、预期回报及合适性而做出投资决定, 在有需要的情况下, 作任何投资前咨询独立专业顾问。本网页信息由 uSMART盈立证券有限公司(“uSMART盈立证券”) 提供，保留随时修改而不作另行通知, 内容未经证券及期货事务监察委员会审阅。',
            riskTitle: '风险披露',
            describe3:
                '所有数据截至最新净值日期（除特殊标注外）,uSMART盈立证券对基金的业绩表现计算是按该时期的资产净值、相关类别货币计算。如有未显示年度/时期的表现，则指该年度/时期未有足够资料计算。',
            describe4:
                '有关于基金的信息资料，除非另行明确注明为其他来源，均来源于基金管理公司、基金服务提供供应商。我们并未对该等信息资料进行独立核证。基于技术性理由，部分由资料供应商提供的基金信息资料可能与各基金管理人所提供的基金信息资料有所差异。在法律允许的范围内且，我们对基金管理人及资料供应商提供的信息资料的准确性、可靠性、完整性、充分性以及信息资料的更新状况概不作出任何保证或认可；我们就此所提供的信息资料内容本身的任何错误、遗漏、不准确、不充分或资料供应商及基金管理人未及时向我们提供基金信息资料导致的未及时更新不承担任何责。'
        },
        zhCHT: {
            disclaimerTitle: '免責聲明',
            describe1:
                '本網頁所載有及/或提供之數據僅供一般參考之用, 本公司無職責就任何交易的合適性為客戶作出判斷, 並不構成, 亦無意作為, 也不應被詮釋為專業意見、要約、招攬或建議投資於此資料內所述之任何基金或投資產品。投資者須注意, 所有投資涉及風險(包括可能會失投資本金), 基金及投資產品之價格可升可跌, 而所呈列的過往表現資料並不表示將來亦會有類似的表現。投資者在作出任何投資決定前, 應詳細閱讀相關基金及投資產品之銷售文件及條款細則(包括當中所載之風險因素之全文)。',
            describe2:
                '投資者須基於本身的財政狀況、投資經驗、投資目標、預期回報及合適性而做出投資決定, 在有需要的情況下, 作任何投資前諮詢獨立專業顧問。本網頁信息由uSMART盈立證券有限公司(“uSMART盈立證券”) 提供，保留隨時修改而不作另行通知, 內容未經證券及期貨事務監察委員會審閱。',
            riskTitle: '風險披露',
            describe3:
                '所有數據截至最新淨值日期（除特殊標註外）,uSMART盈立證券對基金的業績表現計算是按該時期的資產淨值、相關類別貨幣計算。如有未顯示年度/時期的表現，則指該年度/時期未有足夠資料計算。',
            describe4:
                '有關於基金的信息資料，除非另行明確註明為其他來源，均來源於基金管理公司、基金服務提供供應商。我們並未對該等信息資料進行獨立核證。基於技術性理由，部分由資料供應商提供的基金信息資料可能與各基金管理人所提供的基金信息資料有所差異。在法律允許的範圍內且，我們對基金管理人及資料供應商提供的信息資料的準確性、可靠性、完整性、充分性以及信息資料的更新狀況概不作出任何保證或認可；我們就此所提供的信息資料內容本身的任何錯誤、遺漏、不准確、不充分或資料供應商及基金管理人未及時向我們提供基金信息資料導致的未及時更新不承擔任何責。'
        },
        en: {
            disclaimerTitle: 'Disclaimer',
            describe1:
                'Information provided on these webpages is for general information and reference only and USL does not owe the Client a duty to exercise judgment as to the suitability of any transaction. It does not constitute nor is it intended to be construed as any professional advice, offer, solicitation, or recommendation to deal in any funds or investment products. Investors should note that all investments involve risks (including the possibility of a loss of the capital invested), prices of funds and investment products may go up as well as down and past performance is not indicative of future performance. Investors should read the relevant investment offering documents and terms and conditions (including the full text of the risk factors stated therein) in detail before making any investment decision.',
            describe2:
                'Investors should make investment decision(s) based on his/her own financial situation, investment experience, investment objectives, expected return and suitability; and if necessary, should seek independent professional advice before making any investment decision(s). This webpage is issued by uSmart Securities Limited and uSmart reserves the right to make any amendments without prior notice.  The contents have not been reviewed by the Securities and Futures Commission.',
            riskTitle: 'Risk Disclosure',
            describe3:
                "All data are up to the date of the latest net worth (unless otherwise specified). uSMART calculates the fund's performance on a NAV-to-NAV basis in the relevant share class currency. Whenever there is no past performance shown, no sufficient data available in that year to calculate performance. uSMART calculates the fund's performance on a NAV-to-NAV basis in the relevant share class currency. Whenever there is no past performance shown, no sufficient data available in that year to calculate performance.",
            describe4:
                'Information about the fund, unless otherwise clearly indicated as other sources, are from fund management companies and fund service providers. We have not independently verified this information. For technical reasons, some fund information materials provided by data providers may be different from those provided by fund managers. To the extent permitted by law, we do not make any guarantees or approvals for the accuracy, reliability, completeness, adequacy, and update the status of the information provided by fund managers and data suppliers; we We will not be held liable for any errors, omissions, inaccuracies, insufficiency, or incompleteness caused by the information providers and fund managers who fail to provide us with the fund information in a timely manner.'
        }
    },
    components: {
        [Swipe.name]: Swipe,
        [SwipeItem.name]: SwipeItem
    },
    computed: {
        ...mapGetters(['lang'])
    },
    data() {
        return {}
    },
    methods: {},
    created() {}
}
</script>
<style lang="scss" scoped>
.block__agreement--list {
    background: #fff;
    padding: 20px 12px 30px;
    text-align: justify;
    h3 {
        font-weight: bold;
        margin-bottom: 10px;
    }
    p {
        font-size: 14px;
        margin-bottom: 10px;
    }
}
</style>
