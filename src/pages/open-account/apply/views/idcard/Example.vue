<template lang="pug">
.ex-container.flex
    .ex-item(v-for='i in 4' :key="i")
        .img-box
            img(:src="`/webapp/open-account/open-account/idcard/card-${i}.png`")
        .ex-text
            span.iconfont(:class="i === 1 ? 'icon-correct' : 'icon-error'")
            span.ex-tips.text-color5 {{es[i]}}
</template>

<script>
export default {
    data() {
        return {
            es: {
                1: '正确示例',
                2: '边角缺失',
                3: '信息模糊',
                4: '闪光强烈'
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.ex-container {
    padding-top: 14px;
    .ex-item {
        .img-box {
            width: 80px;
            height: 56px;
            img {
                width: 100%;
            }
        }
        .ex-text {
            .icon-correct {
                color: #56c76a;
                font-size: 0.32rem;
            }
            .icon-error {
                color: #f63c61;
                font-size: 0.32rem;
            }
            .ex-tips {
                padding-left: 4px;
                font-size: 12px;
            }
        }
    }
}
</style>
