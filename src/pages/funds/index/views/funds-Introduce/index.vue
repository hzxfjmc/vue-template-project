<template lang="pug">
.funds-introduce
    .funds-introduce-header
        span 基金介绍
    
    .funds-introduce-content
        .funds-introduce-list(
            v-for="(item,index) of list"
            :key="item.label")
            span.left {{item.label}}
            span.right(:ref="item.refs" :class="[item.flag  == 1 ? 'hiddenClass' :'showClass',item.refs]") {{item.value}}
                span.active(v-show="item.flag == 1 || item.flag == 2" @click="foldItem(index)") {{item.flag == 1 ? '展开' : '收起'}}
</template>
<script>
import { Introducelit } from './funds-introduce'
export default {
    data() {
        return {
            list: Introducelit
        }
    },
    methods: {
        foldItem(index) {
            console.log()
            if (this.list[index].flag == 1) {
                this.list[index].flag = 2
            } else {
                this.list[index].flag = 1
            }
        }
    },
    mounted() {
        if (this.$refs.intd[0].offsetHeight > 96) this.list[8].flag = 1
        if (this.$refs.target[0].offsetHeight > 96) this.list[9].flag = 1
        console.log(this.list)
    }
}
</script>
<style lang="scss" scoped>
.funds-introduce {
    background: #fff;
    width: 100%;
    height: 100%;
    position: fixed;
    overflow-y: auto;
}
.funds-introduce-header {
    padding: 10px;
    //   margin: 0 0 20px 0;
    border-bottom: 1px solid #e1e1e1;
}
.funds-introduce-content {
    margin: 20px 0;
}
.funds-introduce-list {
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
