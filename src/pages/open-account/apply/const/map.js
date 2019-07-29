// 埋点viewPage map
export const buryingViewPage = {
    home: {
        name: '开户首页',
        id: 'openmain1'
    },
    0: {
        name: '选择证件',
        id: 'openchoseIDcn2'
    },
    1: {
        name: '上传身份证',
        id: 'openIDcn3'
    },
    2: {
        name: '输入银行卡',
        id: 'openbankcardcn4'
    },
    3: {
        name: '职业信息',
        id: 'openjobscn5'
    },
    4: {
        name: '资产状况',
        id: 'openassetscn6'
    },
    5: {
        name: '风险披露',
        id: 'openriskcn7'
    },
    6: {
        name: '活体识别',
        id: 'openverifycn8'
    },
    7: {
        name: '签名',
        id: 'opensigncn9'
    },
    8: {
        name: '资料确认',
        id: 'openinsurecn10'
    },
    'inland-result': {
        name: '大陆开户结果',
        id: 'openresultcn11'
    },
    result: {
        name: '香港开户结果',
        id: 'openresulthk11'
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
