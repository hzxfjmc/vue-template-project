<template lang="pug">
    .box-layout
        .item-box.flex-box
            .item-left(@click="redirect('hk')")
                h2.title 我有香港银行卡 #[i.tips 极速到证]
                h3.sub-title 支持银证转账
                a.handle-link(href="javascript:;" @click.stop="goBankCardProcess") 没有香港银行卡？大陆可直接办理
            .item-right
                img(src="/webapp/open-account/open-account/deposit/bg_HK.png",alt="HK")
        .item-box.flex-box
            .item-left(@click="redirect('mainland')")
                h2.title 我有大陆银行卡
                .recommend-box
                    h3.sub-title 推荐使用:
                    .recommend-bank 中信银行、中国银行、建设银行、民生银行、光大银行
            .item-right
                img(src="/webapp/open-account/open-account/deposit/bg_China.png",alt="China")
</template>
<script>
/**
 * 入金指南
 * @ Author LINJAIJUN
 * @ Date 2018/12/24
 */
export default {
    methods: {
        redirect(type) {
            let name = ''
            let query = {}
            switch (type) {
                case 'hk':
                    name = 'guide-detail-hk'
                    query = {
                        type: '0'
                    }
                    break
                case 'mainland':
                    name = 'guide-detail-mainland'
                    break
            }
            this.$router.push({
                name: name,
                query: query
            })
        },
        goBankCardProcess() {
            this.$router.push({ name: 'bank-card-processing' })
        }
    }
}
</script>

<style scoped lang="scss">
.box-layout {
    padding: 20px 10px;
}
.item-box {
    position: relative;
    width: 100%;
    height: 150px;
    border: 1px solid $border-color;
    margin-bottom: 20px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 12px;
    img {
        width: 100%;
        height: 100%;
    }
    .title {
        font-size: 18px;
        color: $text-color;
        font-weight: 500;
        line-height: 25px;
    }
    .sub-title {
        font-size: 12px;
        color: $text-color;
        font-weight: 400;
        line-height: 17px;
    }
}

.item-left {
    padding: 20px 0 20px 20px;
}
.flex-box {
    display: flex;
    justify-content: space-between;
}
.tips {
    display: inline-block;
    position: relative;
    top: -2px;
    left: 5px;
    width: 68px;
    height: 19px;
    font-size: 12px;
    font-weight: 400;
    text-align: center;
    color: rgba(255, 255, 255, 1);
    line-height: 19px;
    background: url('~@/assets/img/open-account/deposit/account.png');
    background-size: cover;
}
.handle-link {
    position: absolute;
    font-size: 12px;
    color: #285ac8;
    bottom: 34px;
}
.recommend-box {
    position: absolute;
    width: 54%;
    top: 73px;
}
.recommend-bank {
    margin-top: 6px;
    font-size: 12px;
    line-height: 17px;
    color: $text-color;
}
</style>
