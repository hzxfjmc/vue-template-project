<template lang="pug">
.fund-introduce
    .fund-introduce-header(class="border-bottom")
        span.title {{ $t('fundIntroduceTitle')}}
    
    .fund-introduce-content
        .fund-introduce-list(
            v-for="(item,index) of list"
            :class="[item.flag == 2 ? 'activelist':'']"
            :key="item.label")
            span.left {{item.label}}
            span.right(:ref="item.refs" :class="[item.flag  == 1 ? 'hiddenClass' :'showClass',item.flag == 0 ? '' : item.refs]") {{item.value}}
                span.active(
                    v-show="item.flag == 1 || item.flag == 2" 
                    @click="foldItem(index)" 
                    :class="[item.flag == 2 ? 'activeShow':'']") {{item.flag == 1 ? '展开' : '收起'}}
</template>
<script>
import { Introducelit, i18nIntroducelist } from './fund-introduce'
import { transNumToThousandMark } from '@/utils/tools.js'
export default {
    i18n: i18nIntroducelist,
    data() {
        return {
            list: JSON.parse(JSON.stringify(Introducelit))
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
                        ? `HKD ${transNumToThousandMark(
                              this.$route.query[key]
                          )}`
                        : this.$route.query[key]
            }
        },
        initOffsetHeight() {
            if (this.$refs.intd[0].offsetHeight > 120) {
                this.list.companyProfile.flag = 1
            }
            if (this.$refs.target[0].offsetHeight > 120) {
                this.list.investObjective.flag = 1
            }
            for (let key in this.list) {
                this.list[key].label = this.$t('list')[key].label
            }
        }
    },
    mounted() {
        this.initState()
        setTimeout(() => {
            this.initOffsetHeight()
        }, 100)
        console.log(this.$route.query)
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
    .title {
        font-size: 0.32rem;
    }
}
.fund-introduce-content {
    margin: 5px 0 0 0;
}
.fund-introduce-list {
    padding: 5px 10px;
    float: left;
    span {
        display: inline;
        font-size: 0.28rem;
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
        // overflow: hidden;
        word-break: break-all;
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
        .activeShow {
            bottom: -24px;
        }
    }

    .hiddenClass,
    .showClass {
        text-align: right;
    }
    .hiddenClass {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 5;
        word-break: break-all;
        overflow: hidden;
    }
    .intd,
    .target {
        text-align: left;
    }
}
.activelist {
    margin: 0 0 20px 0;
}
</style>
