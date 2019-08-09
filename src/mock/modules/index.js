// finance-info-server
import bondDetail from './finance-info-server/get-bond-detail'
import bondList from './finance-info-server/get-bond-list'
import bondPrices from './finance-info-server/get-bond-prices'
import bondCurrentPrices from './finance-info-server/get-current-bond-prices'
import bondOrder from './finance-server/bond-order'

// user-server
import bondRiskAutograph from './user-server/bond-risk-autograph'
import riskAssessAnswer from './user-server/risk-assess-answer'
import riskAssessResult from './user-server/risk-assess-result'
import riskAssessSubject from './user-server/risk-assess-subject'

// config-manager
import selectProtocolInfo from './config-manager/select-protocol-info'
export default {
    bondDetail,
    bondList,
    bondPrices,
    bondCurrentPrices,
    bondOrder,

    bondRiskAutograph,
    riskAssessAnswer,
    riskAssessResult,
    riskAssessSubject,

    selectProtocolInfo
}
