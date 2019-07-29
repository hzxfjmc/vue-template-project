export const validatorCheck = function(validator, obj) {
    return !Object.keys(validator).find(key => {
        return validator[key].find(item => {
            let isInvalid = !item.validator(obj[key], this.$reg, obj)
            if (isInvalid) {
                this.$toast(item.message)
            }
            return isInvalid
        })
    })
}

// 申请地推的验证
export const applyValidator = {
    name: [
        {
            message: '姓名不能为空',
            validator: (value, $reg) => $reg.empty(value)
        }
    ],
    email: [
        {
            message: '联系邮箱不能为空',
            validator: (value, $reg) => $reg.empty(value)
        },
        {
            message: '邮箱格式不正确',
            validator: (value, $reg) => $reg.email(value)
        }
    ],
    phone: [
        {
            message: '手机号不能为空',
            validator: (value, $reg) => $reg.empty(value)
        },
        {
            message: '手机号格式不正确',
            validator: (value, $reg) => $reg.mobile(value)
        }
    ],
    verifyCode: [
        {
            message: '验证码不能为空',
            validator: (value, $reg) => $reg.empty(value)
        },
        {
            message: '验证码格式不正确',
            validator: (value, $reg) => $reg.captcha(value)
        }
    ],
    photoUrl: [
        {
            message: '个人图片不能为空',
            validator: (value, $reg) => $reg.empty(value)
        }
    ],
    idCardInfoUrl: [
        {
            message: '身份证明信息不能为空',
            validator: (value, $reg) => $reg.empty(value)
        }
    ]
}

// 修改密码的验证
export const modifyPwdValidator = {
    phone: [
        {
            message: '手机号不能为空',
            validator: (value, $reg) => $reg.empty(value)
        },
        {
            message: '手机号格式不正确',
            validator: (value, $reg) => $reg.mobile(value)
        }
    ],
    verifyCode: [
        {
            message: '验证码不能为空',
            validator: (value, $reg) => $reg.empty(value)
        },
        {
            message: '验证码格式不正确',
            validator: (value, $reg) => $reg.captcha(value)
        }
    ],
    newPwd: [
        {
            message: '新密码不能为空',
            validator: (value, $reg) => $reg.empty(value)
        },
        {
            message: '密码长度不小于六位',
            validator: value => value.length >= 6
        }
    ],
    confirmPwd: [
        {
            message: '请填写确认新密码',
            validator: (value, $reg) => $reg.empty(value)
        },
        {
            message: '密码长度不小于六位',
            validator: value => value.length >= 6
        },
        {
            message: '确认新密码与新密码不同',
            validator: (value, $reg, obj) => obj.newPwd === value
        }
    ]
}
