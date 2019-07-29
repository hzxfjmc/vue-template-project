// 埋点viewPage map
export const buryingViewPage = {
    home: {
        name: '开户首页',
        id: 'openmain1'
    },
    1: {
        name: '选择证件',
        id: 'openchoseIDhk2'
    },
    2: {
        name: '个人资料',
        id: 'openinfohk3'
    },
    3: {
        name: '财务状况',
        id: 'openassetshk4'
    },
    4: {
        name: '职业状况',
        id: 'openjobshk5'
    },
    5: {
        name: '信息确认',
        id: 'openinsurehk6'
    },
    6: {
        name: '签名',
        id: 'opensignhk7'
    },
    result: {
        name: '开户结果',
        id: 'openresulthk8'
    },
    inlandResult: {
        name: '开户结果',
        id: 'openresultch8'
    }
}

/**
 * 1 -> 大陆身份证
 * 2 -> 香港身份证
 * 3 -> 护照
 * 4 -> 香港永久居民身份证
 */
export const openAccountType = {
    '2': {
        id: 'hktemid',
        name: '香港临时身份证'
    },
    '4': {
        id: 'hkid',
        name: '香港身份证'
    },
    '1': {
        id: 'chinaid',
        name: '内地身份证'
    },
    '3': {
        id: 'passport',
        name: '护照'
    }
}
