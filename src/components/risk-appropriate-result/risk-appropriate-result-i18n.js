export const i18nAppropriateData = {
    zhCHS: {
        followUpSet: '进行委托账户服务设置',
        openFollowUpAccount: '开通委托账户服务',
        matching: '匹配',
        noMatching: '不匹配',
        yoursAppropriate: '您的风评取向',
        suitable: '可以',
        noSuitable: '不适合',
        proRisk: '产品的风险',
        riskMeans: '什么是风险测评？',
        meansInfo:
            '为了给您提供更匹配的金融产品和服务，了解您的风险能力和偏好是非常必要的，通过风险测评可以了解您的风险承受能力和风险偏好。',
        hadRead: '我已阅读并知晓债券/基金相关风险，我已阅读产品资料',
        productOverview: '产品概览书',
        buyIt: '购买该产品',
        startRisk: '开始测评',
        againRisk: '重新测评',
        sure: '确认',
        leastNum: '剩余可测评次数：',
        yearsInfo: '重置',
        yearsInfoToCall: '如有调整，请联系客服',
        times: '次',
        toCall: '拨打客服电话',
        toCancel: '取消',
        toClose: '关闭',
        riskTypeList: {
            // 风险等级列表
            100: '--',
            0: '尚未风评',
            1: '保守型(A1)及以上可购买',
            2: '稳健型(A2)及以上可购买',
            3: '均衡型(A3)及以上可购买',
            4: '增长型(A4)及以上可购买',
            5: '进取型(A5)'
        },
        subscribe: '仍要继续申购>',
        leftTimes: (monthTimes, yearTimes) =>
            `本月剩余可测试次数：${monthTimes}次。本年剩余可测试次数：${yearTimes}次。`,
        retryNextMonth: '请于下个月1号重试。',
        timesLimit: '*每年可测评次数一共5次，每月可测评次数为3次'
    },
    zhCHT: {
        followUpSet: '進行委託帳戶服務設定',
        openFollowUpAccount: '開通委託賬戶服務',
        matching: '匹配',
        noMatching: '不匹配',
        yoursAppropriate: '您的風評取向',
        suitable: '可以',
        noSuitable: '不適合',
        proRisk: '產品的風險',
        riskMeans: '什麼是風險測評？',
        meansInfo:
            '為了給您提供更匹配的金融產品和服務，了解您的風險能力和偏好是非常必要的，通過風險測評可以了解您的風險承受能力和風險偏好。',
        hadRead: '我已閱讀並知曉債券/基金相關風險，我已閱讀產品資料',
        productOverview: '產品概覽書',
        buyIt: '購買該產品',
        startRisk: '開始測評',
        againRisk: '重新測評',
        sure: '確認',
        leastNum: '剩餘可測評次數：',
        yearsInfo: '重置',
        yearsInfoToCall: '如有調整，請聯繫客服',
        times: '次',
        toCall: '撥打客服電話',
        toCancel: '取消',
        toClose: '關閉',
        riskTypeList: {
            // 风险等级列表
            100: '--',
            0: '尚未進行風險評',
            1: '保守型(A1)及以上可購買',
            2: '穩健型(A2)及以上可購買',
            3: '均衡型(A3)及以上可購買',
            4: '增長型(A4)及以上可購買',
            5: '進取型(A5)'
        },
        subscribe: '仍要繼續申購>',
        leftTimes: (monthTimes, yearTimes) =>
            `本月剩餘可測試次數：${monthTimes}次。本年剩餘可測試次數：${yearTimes}次。`,
        retryNextMonth: '請於下個月1號重試',
        timesLimit: '*每年可測評次數一共5次，每月可測評次數為3次'
    },
    en: {
        followUpSet: 'Conduct Entrusted Account Setting',
        openFollowUpAccount: 'Open Entrusted Account',
        matching: 'Matched',
        noMatching: 'Not Matched',
        yoursAppropriate: 'Your Risk Profile',
        suitable: 'Confirm',
        noSuitable: 'Not Suitable',
        proRisk: 'Risk Of Product',
        riskMeans: 'What is risk profile?',
        meansInfo:
            'order to provide you with more matching financial products and services, it is necessary to understand your risk ability and preference. Through risk assessment, you can understand your risk tolerance and risk preference.',
        hadRead:
            'I have read and are aware of related risks of trading bonds / funds. I have read product information.',
        productOverview: 'Prospectus',
        buyIt: 'Buy this product',
        startRisk: 'Start The Assessment',
        againRisk: 'Assess Again',
        sure: 'Confirm',
        leastNum: 'Remaining Assessment Chance：',
        yearsInfo: 'Reset',
        yearsInfoToCall: 'Please contact CS if there is any adjustment',
        times: 'Times',
        toCall: 'Call CS',
        toCancel: 'Cancel',
        toClose: 'Close',
        riskTypeList: {
            // 风险等级列表
            100: '--',
            0: 'Risk assessment is not completed',
            1: 'Available for conservative (or more aggressive) investor',
            2: 'Available for steady (or more aggressive) investor',
            3: 'Available for balanced (or more aggressive) investor',
            4: 'Available for growth (or more aggressive) investor',
            5: 'Aggressive'
        },
        subscribe: 'Still Want to Continue Sub>',
        leftTimes: (monthTimes, yearTimes) =>
            `The remaining assessment times for this month: ${monthTimes} . The remaining assessment times for this year: ${yearTimes} .`,
        retryNextMonth: 'Please try again on the 1st of next month',
        timesLimit:
            '*A total of 5 assessments per year is available year while total of 3 assessments per month'
    }
}
