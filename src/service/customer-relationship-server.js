import httpRequest from '@/utils/http-request'
const axios = new httpRequest()

// 大陆版活动
//   mgm活动接口
// 累计奖励
export const getTotalReward = id => {
    return axios.get(
        '/customer-relationship-server/web/get-my-mainland-reward/v1',
        {
            activityId: id
        }
    )
}
// 获取邀请记录
export const getRecord = params => {
    return axios.get(
        '/customer-relationship-server/web/list-mainland-invite-record/v1',
        params
    )
}
//拉新活动接口
// 滚动播报
export const getBroadcastData = id => {
    return axios.get(
        '/customer-relationship-server/web/list-recent-mainland-reward/v1',
        {
            activityId: id
        }
    )
}
// 用户获取奖励信息
export const getMyRewardInfo = id => {
    return axios.get(
        '/customer-relationship-server/web/list-mainland-newbie-reward/v1',
        {
            activityId: id
        }
    )
}
// 判断用户归属地 1：大陆 2：其它
export const getSource = () => {
    return axios.getForm(
        '/customer-relationship-server/web/get-user-attribution/v1'
    )
}
// 大陆版股票红包接口
// 获取我得奖励记录
export const getMyStock = () => {
    return axios.get('/customer-relationship-server/web/list-my-stocks/v1')
}
// 获取股票红包被获取记录
export const getStockRecord = redpacketId => {
    return axios.get(
        '/customer-relationship-server/web/list-stock-records/v1',
        {
            redpacketId: redpacketId
        }
    )
}
// 获取股票价格
export const getStockPrice = () => {
    return axios.get(
        '/customer-relationship-server/web/list-redpacket-stock-price/v1'
    )
}

// 港版活动
// 首页滚动播报信息
export const getBroadcastDatahk = id => {
    return axios.get(
        '/customer-relationship-server/web/list-recent-reward/v1',
        {
            activityId: id
        }
    )
}
// mgm活动接口
// 累计奖励
export const getTotalRewardhk = id => {
    return axios.get('/customer-relationship-server/web/get-my-reward/v1', {
        activityId: id
    })
}
// 获取邀请记录
export const getRecordhk = id => {
    return axios.get(
        '/customer-relationship-server/web/list-invite-record/v1',
        {
            activityId: id
        }
    )
}
// 获取用户注册开户入金信息
export const getCustomerStatus = () => {
    return axios.get('/customer-relationship-server/web/get-customer-status/v1')
}

// 获取用户客户经理信息
export const getUserManagerInfo = () => {
    return axios.getForm(
        '/customer-relationship-server/api/get-user-manager-info/v1'
    )
}

// 港版抽奖活动
// 获取抽奖次数
export const getLotteryCount = () => {
    return axios.get('/customer-relationship-server/web/get-lottery-count/v1')
}

// 获取活动参与状态
export const getLotteryStatus = () => {
    return axios.get('/customer-relationship-server/web/get-lottery-status/v1')
}

// 获取抽奖结果
export const getLotteryResult = () => {
    return axios.get('/customer-relationship-server/web/lottery/v1')
}

// 选择入金转仓的奖励
export const chooseReward = params => {
    return axios.get(
        '/customer-relationship-server/web/choose-reward/v1',
        params
    )
}
// 入金或者转仓金额是否达标
export const judgeCondition = () => {
    return axios.get(
        '/customer-relationship-server/web/reach-reward-condition/v1'
    )
}

// 获取抽奖活动信息
export const getLotteryInfo = () => {
    return axios.get('/customer-relationship-server/web/get-lottery-info/v1')
}
