<template lang="pug">
.track-wrap
    i.track-icon.iconfont.icon-correct(v-show="iconStatus === 1" style="color:#DADADA")
    i.track-icon.iconfont.icon-correct(v-show="iconStatus === 2" style="color:#41CA1E")
    i.track-icon.iconfont.icon-alert_icon(v-show="iconStatus === 3" style="color:#FA6112")
    img(v-show="iconStatus === 4" src="@/assets/img/open-account-hk/apply/online_icon.svg")
    .track-line(:style="`border-color:${lineColor}`")
</template>
<script>
export default {
    // 1已提交 2已通过 3驳回 4 线上核实身份进行中
    props: {
        iconStatus: {
            type: [Number, String],
            default: 1
        }
    },
    computed: {
        lineColor() {
            return this.iconStatus == 4
                ? 'rgba(1, 33, 220, 0.7)'
                : 'rgba(57, 57, 57, 0.2)'
        }
    }
}
</script>
<style lang="scss" scope>
.track-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    .track-icon {
        font-size: 18px;
    }
    .track-line {
        flex: 1;
        min-height: 119px;
        width: 0;
        border-left: 1px dashed rgba(57, 57, 57, 0.2);
        margin-top: 9px;
    }
}
</style>
