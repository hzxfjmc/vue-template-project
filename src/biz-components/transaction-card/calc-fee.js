/**
 * 百分比计费
 * @param feeVO 费用对象,包含相关计算属性
 * @param marketValue 交易金额 = 交易数量 * 最小交易面额 * 买入/卖出价
 * @return 费用
 */
export function calculatePercent(feeVO, marketValue) {
    if (!feeVO.feePercent) {
        // 百分比为空，返回 0
        return 0
    }
    let amount = (marketValue * feeVO.feePercent) / 100
    // 交易金额 * 费用比例 < 最低金额，且 < 最高金额，取最低金额
    if (feeVO.minFeeAmount && amount - feeVO.minFeeAmount < 0) {
        return feeVO.minFeeAmount()
    }
    // 交易金额 * 费用比例 > 最高金额，取最高金额
    if (feeVO.maxFeeAmount && amount - feeVO.maxFeeAmount > 0) {
        return feeVO.maxFeeAmount()
    }
    // 交易金额 * 费用比例 > 最低金额，且 < 最高金额，取交易金额 * 费用比例
    return amount
}

/**
 * amount方式计费
 * @param feeVO 费用对象,包含相关计算属性
 * @param marketValue 交易金额 = 交易数量 * 最小交易面额 * 买入/卖出价
 * @return 费用
 */
export function calculateAmount(feeVO, marketValue) {
    if (!feeVO.feeAmount) {
        // 费用金额为空，返回 0
        return 0
    }
    // 费用金额 > 交易金额 * 最高比例，取交易金额 * 最高比例
    if (
        feeVO.maxFeePercent &&
        feeVO.feeAmount - marketValue * feeVO.maxFeePercent > 0
    ) {
        return marketValue * feeVO.maxFeePercent
    }
    return feeVO.feeAmount
}

/**
 * amountPerQty方式计费
 * @param feeVO 费用
 * @return 费用
 */
export function calculateAmountPerQty(feeVO, marketValue, quantity) {
    if (!feeVO.feeAmount) {
        return 0
    }
    let commAmount
    if (feeVO.feeAmount == null) {
        return 0
    }
    //当最低金额、费用金额*股数和最低比例*交易金额均小于最高比例*交易金额和最高金额时，最低金额、费用金额*股数和最低比例*交易金额三者取最高值
    //当最低金额、费用金额*股数和最低比例*交易金额均大于最高比例*交易金额和最高金额时，最高比例*交易金额和最高金额取最高值
    //费用金额*股数和最低金额均小于最高比例*交易金额，取费用金额*股数和最低金额的孰高值；
    //若费用金额*股数大于等于最高比例*交易金额，取最高比例*交易金额费用金额*股数>最低金额，且费用金额*股数>最高比例*交易金额，
    //若最低金额<最高比例*交易金额，取最高比例*交易金额；若最低金额>最高比例*交易金额，取最低金额；应用场景为美股细价股
    let normalCommAmount = feeVO.feeAmount * quantity

    //最小佣金金额
    let minCommAmount = null
    //取佣金套餐中的最小金额
    if (feeVO.minFeeAmount != null) {
        minCommAmount = feeVO.minFeeAmount
    }
    //最小比例和最小金额都存在， 选择两者最大值作为最小佣金
    if (feeVO.minFeePercent != null) {
        let minPerAmount = marketValue * (feeVO.minFeePercent / 100)
        if (minCommAmount == null) {
            minCommAmount = minPerAmount
        } else {
            minCommAmount =
                minPerAmount - minCommAmount > 0 ? minPerAmount : minCommAmount
        }
    }

    let maxCommAmount = null
    //取佣金套餐中的最大金额
    if (feeVO.getMaxFeeAmount != null) {
        maxCommAmount = feeVO.maxFeeAmount
    }
    //最大比例和最大金额都存在， 选择两者最大值作为最大佣金
    if (feeVO.maxFeePercent != null) {
        let maxPerAmount = marketValue * (feeVO.maxFeePercent / 100)
        if (maxCommAmount == null) {
            maxCommAmount = maxPerAmount
        } else {
            maxCommAmount =
                maxPerAmount - maxCommAmount > 0 ? maxPerAmount : maxCommAmount
        }
    }
    commAmount = contrastFeeMinMax(
        minCommAmount,
        maxCommAmount,
        normalCommAmount
    )
    return commAmount
}

/**
 * 费用与最小费用，最大费用对比，得到一个最终费用
 * 只配置了最小：
 *   1.fee <= 最低金额
 *   应收金额 = 最低金额
 *   2.fee > 最低金额
 *   应收金额 = fee
 * 只配置了最大：
 *   1.fee <= 最大金额
 *   应收金额 = fee
 *   2.fee > 最大金额
 *   应收金额 = 最大金额
 * 最小最大都配置了：
 *   1、如果fee <= 最低金额 <= 最高金额
 *   应收金额 = 最低金额
 *   2、如果 最低金额 <= fee <= 最高金额
 *   应收金额 = fee
 *   3、如果 最低金额 <= 最高金额 <= fee
 *   应收金额 = 最高金额
 *   4、如果fee <= 最高金额 <= 最低金额
 *   应收金额 = 最高金额  20190806修改，取最低金额
 *   5、如果   最高金额 <= fee <= 最低金额
 *   应收金额 = 最高金额  20190806修改，取最低金额
 *   6、如果  最高金额 <= 最低金额 <= fee
 *   应收金额 =  最低金额  20190806修改，取fee  20190815修改最低金额
 * @param minFee
 * @param maxFee
 * @param fee
 * @return
 */
export function contrastFeeMinMax(minFee, maxFee, fee) {
    //最小值，最大值没有配置，或配置成小于等于0，相当于不生效,返回fee
    let finalMinFee = minFee == null || minFee - 0 <= 0
    let finalMaxFee = maxFee == null || maxFee - 0 <= 0
    //最大值，最小值均小于0
    if (finalMinFee && finalMaxFee) {
        return fee
    }
    //最大值无效，最小值有效
    if (!finalMinFee && finalMaxFee) {
        return minFee - fee > 0 ? minFee : fee
    }
    //最小值无效，最大值有效
    else if (finalMinFee && !finalMaxFee) {
        return maxFee - fee > 0 ? fee : maxFee
    }
    //最大值，最小值均存在
    else {
        //3最低金额 <= 最高金额 <= fee  应收金额 = 最高金额
        if (minFee - maxFee <= 0 && maxFee - fee <= 0) {
            return maxFee
        }
        //2如果 最低金额 <= fee <= 最高金额  应收金额 = fee
        else if (minFee - fee <= 0 && fee - maxFee <= 0) {
            return fee
        }
        //其他情况
        else {
            return minFee
        }
    }
}
