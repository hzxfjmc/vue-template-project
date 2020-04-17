<template lang="pug">
 .block__status--list
    .block__status--item
        em.iconfont.icon-icon-checkbox-selected
        .block__status--right
            p.title {{stepOne.label}}
            p.subtitle {{stepOne.time}}
        
    .block__status--item.block__after(v-if="successHide")
        em.iconfont.icon-icon-money
        .block__status--right
            p.title {{stepTwo.label}}
            p.subtitle {{stepTwo.time}}
</template>
<script>
export default {
    props: {
        successHide: {
            type: Boolean,
            default: true
        },
        stepOne: {
            type: Object,
            default: () => {}
        },
        stepTwo: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {}
    }
}
</script>
<style lang="scss" scoped>
.block__status--list {
    padding: 0 12px 14px 12px;
    .block__status--item {
        position: relative;
        display: flex;
        flex-direction: row;
        .block__status--right {
            .subtitle {
                font-size: 12px;
                margin: 6px 0 0 0;
                color: $text-color6;
            }
        }
    }
    em {
        width: 15px;
        color: #2f79ff;
        margin: -2px 10px 0 0;
        display: inline-block;
    }
    .block__after {
        margin: 46px 0 0 0;
    }
    .block__after:after {
        content: '';
        position: absolute;
        height: 56px;
        width: 1px;
        left: 7px;
        top: -62px;
        display: inline-block;
        background: #2f79ff;
    }
}
</style>
