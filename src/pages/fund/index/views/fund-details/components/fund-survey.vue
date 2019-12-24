<template lang="pug">
.block__fund--survey
    .block__fundheader--survey
        em.iconfont.icon-icon-gaishu
        span.title 基金概况
        .block__list--right
            span 概況、分紅、文件
            em.iconfont.icon-iconEBgengduoCopy

    .block__fundcontent--list
        .block__fund--item
            .block__fund--title 基金公司
            p Pimco
</template>
<script>
export default {
    data() {
        return {}
    }
}
</script>
<style lang="scss" scoped>
.block__fund--survey {
    width: 100%;
    padding: 0 3%;
    margin: 10px 0 0 0;
    background: #fff;
    .block__fundheader--survey {
        display: flex;
        flex-direction: row;
        padding: 15px 0;
        line-height: 22px;
        .icon-icon-gaishu {
            font-size: 20px;
        }
        .title {
            font-size: 16px;
            margin: 0 0 0 10px;
        }
        .block__list--right {
            margin-right: auto;
            flex-grow: 1; //这三个元素只有它在有空余空间时可伸缩，也就是它占据了所有剩余空间
            display: flex; //将它设置为flex,就可以单独对他进行主轴右对齐
            justify-content: flex-end;
            text-align: right;
            span {
                font-size: 14px;
                color: #666666;
            }
            .iconfont {
                font-size: 15px;
                line-height: 25px;
            }
        }
    }
}
</style>
