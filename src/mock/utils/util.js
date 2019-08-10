export let formatMockData = (
    mockData = {},
    codeStatus = 0,
    msg = '@cword(1,10)'
) => {
    let initFormatObj = {
        'code|0-10': codeStatus,
        data: mockData,
        msg: msg
    }
    return initFormatObj
}
