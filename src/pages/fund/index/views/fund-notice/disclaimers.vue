<template lang="pug">
    .disclaimers
        .title {{$t('disclaimers')}}
        .info {{$t('describe1')}}
        .info {{$t('describe2')}}
        .info {{$t('describe3')}}
        .info {{$t('describe4')}}
</template>
<script>
export default {
    i18n: {
        zhCHS: {
            describe1:
                '本网页所载的信息及基金并不构成于香港以外的任何司法管辖区派发资料、发售或邀请认购任何证券。本网页所述的所有基金或投资产品均未获中华人民共和国香港特别行政区（下称「香港」）境外的任何机关准许发售或购买。本网页并不是为处于禁止本网站之发表或供用的任何司法管辖区的任何人（就其所属的司法管辖区，因其国籍、居留状况或其他理由而论）提供的。浏览本网页所载数据的任何人有责任遵守适用于当地的法例及法规。',
            describe2:
                '盈立证券有限公司及其联属公司(“ uSMART ”) 对于此网页所载数据的准确度或可靠性并无作出保证或承担任何责任。在任何情况下, 盈立证券概不就由第三方所提供之数据的来源、意见或陈述而引至的任何损失或破坏承担任何责任。',
            describe3:
                '本网页所载有及/或提供之数据仅供一般参考之用, 并不构成, 亦无意作为, 也不应被诠释为专业意见、要约、招揽或建议投资于此资料内所述之任何基金或投资产品。投资者须注意, 所有投资涉及风险(包括可能会失投资本金), 基金及投资产品之价格可升可跌, 而所呈列的过往表现资料并不表示将来亦会有类似的表现。投资者在作出任何投资决定前, 应详细阅读相关基金及投资产品之销售文件及条款细则(包括当中所载之风险因素之全文)。',
            describe4:
                '投资者须基于本身的财政状况、投资经验、投资目标及预期回报而作出投资决定, 在有需要的情况下, 作任何投资前咨询独立专业顾问。本网页由盈立证券有限公司刊发, 由未经证监会审阅。'
        },
        zhCHT: {
            describe1:
                '本網頁所載的資訊及基金並不構成於香港以外的任何司法管轄區派發資料、發售或邀請認購任何證券。本網頁所述的所有基金或投資產品均未獲中華人民共和國香港特別行政區（下稱「香港」）境外的任何機關准許發售或購買。本網頁並不是為處於禁止本網站之發表或供用的任何司法管轄區的任何人（就其所屬的司法管轄區，因其國籍、居留狀況或其他理由而論）提供的。瀏覽本網頁所載資料的任何人有責任遵守適用於當地的法例及法規。',
            describe2:
                '盈立證券有限公司及其聯屬公司(“ uSMART ”) 對於此網頁所載資料的準確度或可靠性並無作出保證或承擔任何責任。在任何情況下, 盈立證券概不就由第三方所提供之資料的來源、意見或陳述而引至的任何損失或破壞承擔任何責任。',
            describe3:
                '本網頁所載有及/或提供之資料僅供一般參考之用, 並不構成, 亦無意作為, 也不應被詮釋為專業意見、要約、招攬或建議投資於此資料內所述之任何基金或投資產品。投資者須注意, 所有投資涉及風險(包括可能會失投資本金), 基金及投資產品之價格可升可跌, 而所呈列的過往表現資料並不表示將來亦會有類似的表現。投資者在作出任何投資決定前, 應詳細閱讀相關基金及投資產品之銷售文件及條款細則(包括當中所載之風險因素之全文)。',
            describe4:
                '投資者須基於本身的財政狀況、投資經驗、投資目標及預期回報而作出投資決定, 在有需要的情況下, 作任何投資前諮詢獨立專業顧問。本網頁盈立證券有限公司刊發, 由未經證監會审閱。'
        },
        en: {
            describe1:
                'Any information and Fund contained in the webpages contained do not constitute the making of any offer or solicitation by anyone in any jurisdiction in which such distribution or offer is not authorized to any person of whom it is unlawful to distribute such information or making such an offer or solicitation. The funds mentioned herein might not be approved for sale or purchase by persons outside Hong Kong. This website is not targeting at any persons in any jurisdiction where (by reason of that person’s nationality, residence or otherwise) the publication or availability of this website is prohibited. It is the responsibility of any persons who access the information contained herein to observe all applicable laws and regulations of their relevant jurisdiction.',
            describe2:
                'uSmart Securities Limited and its affiliates (“uSMART”) neither endorses nor is responsible for the accuracy or reliability of, and under no circumstances will USL be liable for any loss or damage caused by any information source, produced and provided by third-party information providers.',
            describe3:
                'nformation provided on these webpages is for general information and reference only and does not constitute nor is it intended to be construed as any professional advice, offer, solicitation, or recommendation to deal in any funds or investment products. Investors should note that all investments involve risks (including the possibility of loss of the capital invested), prices of funds and investment products may go up as well as down and past performance is not indicative of future performance. Investors should read the relevant investment offering documents and terms and conditions (including the full text of the risk factors stated therein) in detail before making any investment decision.',
            describe4:
                'Investors should make investment decision(s) based on his/her own financial situation, investment experience, investment objectives, and expected return; and if necessary, should seek independent professional advice before making any investment decision(s). This website is issued by uSmart Securities Limited and has not been reviewed by the Securities and Futures Commission of Hong Kong.'
        }
    }
}
</script>
<style lang="scss">
.disclaimers {
    width: 100%;
    height: 100%;
    background: #fff;
    padding: 15px;
    .title {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 10px;
    }
}
</style>
