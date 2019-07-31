export let formatMockData = (codeStatus = 0, msg = '', mockData = {}) => {
    let initFormatObj = {
        code: codeStatus,
        data: mockData,
        msg: msg
    }
    return initFormatObj
}
