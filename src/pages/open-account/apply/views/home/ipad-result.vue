<template lang="pug">
    .apply-ipad-result
        .apply-main
            img.main( v-if="ipadOpenAccountStatus===3" src='/webapp/open-account/open-account/apply/problem.png')
            img.main( v-else src='/webapp/open-account/open-account/apply/doing.png')
            .result-text {{result[ipadOpenAccountStatus].textTop}}
            .result-text {{result[ipadOpenAccountStatus].textBottom}}
            .brand-list(v-if="ipadOpenAccountStatus!==3")
                .brand-item(v-for="item in spanList" :key="item.icon")
                    img.brand(:src="`/webapp/open-account/open-account/apply/${item.icon}.png`")
                    .brand-word {{item.text}}
        .apply-footer
            .footer-banner.common-radius
</template>

<script>
export default {
    props: {
        ipadOpenAccountStatus: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            result: {
                1: {
                    textTop: '我们已收到部分资料，',
                    textBottom: '请联系客户经理补充文件。'
                },
                2: {
                    textTop: '已收到你的开户申请，',
                    textBottom: '将在一至两个工作日完成开户'
                },
                3: {
                    textTop: '抱歉，开户审核没有通过，',
                    textBottom: '暂时不能为您完成开户'
                }
            },
            spanList: [
                { icon: 'quanshang', text: '持牌券商' },
                { icon: 'hangqing', text: '免费行情' },
                { icon: 'tougu', text: '智能投顾' }
            ]
        }
    }
}
</script>

<style lang="scss" scoped>
$content-box-color: rgba(#d8d8d8, 0.6);
.apply-ipad-result {
    .apply-main {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        img.main {
            width: 99px;
            height: 99px;
            margin-top: 35px;
            margin-bottom: 15px;
        }
        .result-text {
            color: $hk-text-color;
            font-size: 20px;
            line-height: 22px;
        }
        .brand-list {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 48px;
            padding: 0 40px;
            .brand-item {
                display: flex;
                align-items: center;
                flex-direction: column;
                justify-content: center;
                &.row-direction {
                    flex-direction: row;
                }
                img.brand {
                    width: 50px;
                    height: 50px;
                }
                .brand-word {
                    font-size: 14px;
                    line-height: 32px;
                    color: $primary-color;
                }
            }
        }
    }
    .apply-footer {
        padding: 0 16px 30px;
        .footer-banner {
            width: 100%;
            height: 94px;
            background-image: url('/webapp/open-account/open-account/apply/banner.png');
            background-position: center;
            background-size: cover;
            background-repeat: no-repeat;
        }
    }
}
</style>
