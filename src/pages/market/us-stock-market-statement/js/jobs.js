/**
 * 职业状态列表
 */
export default {
    // 大陆版
    mainland: [
        {
            id: 1001,
            name: ['受雇', '受僱', 'Employed'],
            mustCompany: true
        },
        {
            id: 1002,
            name: ['创业', '創業', 'Running Own Business'],
            mustCompany: true
        },
        {
            id: 1003,
            name: ['自由职业', '自由職業', 'Freelance'],
            mustCompany: false
        },
        {
            id: 1004,
            name: ['学生', '學生', 'Student'],
            mustCompany: false
        },
        {
            id: 1005,
            name: ['退休', '退休', 'Retired'],
            mustCompany: false
        }
    ],
    // 港版
    hk: [
        {
            id: 1001,
            name: ['受雇', '受僱', 'Employed'],
            example: [
                '例如就职于公司',
                '例如就職於公司',
                'Such as Employed By A Company'
            ],
            mustCompany: true
        },
        {
            id: 1002,
            name: ['自雇', '自僱', 'Self-Employed'],
            example: [
                '例如创业、自由职业、店铺经营',
                '例如創業、自由職業、店鋪經營',
                'Such as Starting A Business, Freelance, Running Own Shop'
            ],
            mustCompany: true
        },
        {
            id: 1003,
            name: ['待业', '待業', 'Unemployed'],
            mustCompany: false
        },
        {
            id: 1004,
            name: ['家庭主妇', '家庭主婦', 'Housewife'],
            mustCompany: false
        },
        {
            id: 1005,
            name: ['学生', '學生', 'Student'],
            mustCompany: false
        },
        {
            id: 1006,
            name: ['退休', '退休', 'Retired'],
            mustCompany: false
        }
    ]
}
