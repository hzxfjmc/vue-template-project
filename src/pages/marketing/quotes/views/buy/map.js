export const codeMap = {
    NO_OPEN_ACCOUNT: 1,
    NO_MONEY: 2,
    // NO_PASSWORD: 3,
    // INVALID_PASSWORD: 4,
    // ERROR_PASSWORD: 5,
    SUCCESS: 6,
    FAIL: 7,
    // 清算中
    COUNTING: 8
}

// 購買結果代碼
export const buyResultCodeMap = {
    // 未開戶
    [codeMap.NO_OPEN_ACCOUNT]: 'noOpenAccount',
    // 資金不足
    [codeMap.NO_MONEY]: 'noMoney',
    // // 未設置密碼
    // [codeMap.NO_PASSWORD]: 'noPassword',
    // // 密碼錯誤
    // [codeMap.INVALID_PASSWORD]: 'invalidPassword',
    // // 密碼錯誤達上限
    // [codeMap.ERROR_PASSWORD]: 'errorPassword',
    // 成功
    [codeMap.SUCCESS]: 'success',
    // 失敗（未知錯誤）
    [codeMap.FAIL]: 'fail',
    // 清算中
    [codeMap.COUNTING]: 'counting'
}
