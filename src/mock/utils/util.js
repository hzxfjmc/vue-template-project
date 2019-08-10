export const formatMockData = (
    mockData = {},
    codeStatus = 0,
    msg = '@cword(1,10)'
) => {
    let initFormatObj = {
        'code|0': codeStatus,
        data: mockData,
        msg: msg
    }
    return initFormatObj
}

// 组合数据
export const comp = function(value) {
    return [null, '', value]
}
