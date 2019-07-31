export let formatMockData = (mockData = {}, codeStatus = 0, msg = '') => {
    let initFormatObj = {
        code: codeStatus,
        data: mockData,
        msg: msg
    }
    return initFormatObj
}
