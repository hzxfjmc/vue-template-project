// 客户归属对应
export const attributionMap = {
    // 大陆
    CH: 1,
    // 香港
    HK: 2
}

// ip地址对应
export const ipLocationMap = {
    // 国内
    CH: 1,
    // 境外
    OTHER: 2
}

// 行情类型
export const quotationTypeMap = {
    // 美股延时
    US_DELAYED: 0,
    // 美股level1
    US_LV1: 1,
    // 港股延时
    HK_DELAYED: 2,
    // 港股BMP
    HK_BMP: 3,
    // 港股大陆level2
    HK_CN_LV2: 4,
    // 港股全球level2
    HK_WORLD_LV2: 5
}

// 行情来源
export const sourceMap = {
    // 基准
    BASE: 0,
    // 客户购买
    BUY: 1,
    // 平台赠送
    FREE: 2,
    // 中台修改
    ADMIN: 3
}

// 行情订单状态
export const orderStatusMap = {
    CONFIRMING: [0, 1, 3],
    SUCCESS: 2,
    FAIL: 4
}

export const urls = {
    // 港股
    hk: {
        // 内地用户-ip在内地，基准行情
        CH_CH_BASE: {
            url1: '',
            url2: '',
            url3: ''
        },
        // 内地用户-ip在内地，购买获得的大陆lv2
        CH_CH_CH_LV2_BUY: {
            url1: '',
            url2: '',
            url3: ''
        },
        // 内地用户-ip在内地以外，没有LV2全球（基准）
        CH_OTHER_BASE: {
            url1: '',
            url2: '',
            url3: ''
        },
        // 香港用户，没有LV2全球（基准）
        HK_ALL_BASE: {
            url1: 'yxzq_goto://main_trade',
            url2: 'yxzq_goto://deposit',
            url3: ''
        },
        // 香港用户，有LV2全球
        HK_ALL_LV2: {
            url1: '',
            url2: '',
            url3: ''
        }
    },
    // 美股
    us: {
        // 内地用户，没有LV1
        CH_NO_LV1: {
            url1: '',
            url2: '',
            url3: ''
        },
        // 内地用户，有LV1
        CH_LV1: {
            url1: '',
            url2: '',
            url3: ''
        },
        // 香港用户，没LV1
        HK_NO_LV1: {
            url1: 'yxzq_goto://main_trade',
            url2: 'yxzq_goto://deposit',
            url3: ''
        },
        // 香港用户，没LV1
        HK_LV1: {
            url1: '',
            url2: '',
            url3: ''
        }
    }
}
