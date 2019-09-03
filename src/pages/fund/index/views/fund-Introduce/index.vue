<template lang="pug">
.fund-introduce
    .fund-introduce-header(class="border-bottom")
        span {{ $t('fundIntroduceTitle')}}
    
    .fund-introduce-content
        .fund-introduce-list(
            v-for="(item,index) of list"
            :key="item.label")
            span.left {{item.label}}
            span.right(:ref="item.refs" :class="[item.flag  == 1 ? 'hiddenClass' :'showClass',item.flag == 0 ? '' : item.refs]") {{item.value}}
                span.active(v-show="item.flag == 1 || item.flag == 2" @click="foldItem(index)") {{item.flag == 1 ? '展开' : '收起'}}
</template>
<script>
import { Introducelit, i18nIntroducelist } from './fund-introduce'
export default {
    i18n: i18nIntroducelist,
    data() {
        return {
            list: Introducelit
        }
    },
    methods: {
        foldItem(index) {
            this.list[index].flag = this.list[index].flag == 1 ? 2 : 1
        },
        initState() {
            for (let key in this.list) {
                this.list[key].value =
                    key == 'fundSize'
                        ? `HKD ${Number(this.$route.query[key]).toFixed(2)}`
                        : this.$route.query[key]
            }
            if (this.$refs.intd[0].offsetHeight > 96) {
                this.list.companyProfile.flag = 1
            }

            if (this.$refs.target[0].offsetHeight > 96) {
                this.list.investObjective.flag = 1
            }
            for (let key in this.list) {
                this.list[key].label = this.$t('list')[key].label
            }
        }
    },
    mounted() {
        this.initState()
    }
}
</script>
<style lang="scss" scoped>
.fund-introduce {
    background: #fff;
    width: 100%;
    height: 100%;
    position: fixed;
    overflow-y: auto;
}
.fund-introduce-header {
    padding: 10px;
}
.fund-introduce-content {
    margin: 20px 0;
}
.fund-introduce-list {
    padding: 5px 10px;
    float: left;
    span {
        display: inline;
        font-size: 0.24rem;
    }
    .left {
        width: 150px;
        color: $text-color5;
        float: left;
    }
    .right {
        float: right;
        text-align: right;
        width: 200px;
        line-height: 24px;
        display: block;
        position: relative;
        .active {
            position: absolute;
            bottom: 0;
            background: #fff;
            color: $text-link-color;
            display: inline-block;
            width: 40px;
            right: 0;
            text-align: right;
            line-height: 24px;
            height: 24px;
        }
    }

    .hiddenClass,
    .showClass {
        text-align: right;
    }
    .hiddenClass {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 4;
        overflow: hidden;
    }
    .intd,
    .target {
        text-align: left;
    }
}
</style>
