<template lang="pug">
    .fund-tag-risk( 
        v-if="title"
        :class="tagStyle"
        @click="handleClick"
    )  
        img(:src="require(`@/assets/img/fund/${tagStyle}.png`)" v-if="type")
        span {{title}}
</template>
<script>
export default {
    name: 'fund-tag-risk',
    props: {
        title: {
            type: String,
            default: ''
        },
        type: {
            type: Number,
            default: null
        }
    },
    computed: {
        tagStyle() {
            if (!this.type) return ''
            if (this.type <= 2) {
                return 'low-risk'
            } else if (this.type > 2 && this.type < 5) {
                return 'mide-risk'
            } else if (this.type === 5) {
                return 'high-risk'
            } else {
                return ''
            }
        }
    },
    methods: {
        handleClick() {
            this.$emit('toFundRisk')
            this.$emit('toFundType')
        }
    }
}
</script>
<style lang="scss">
.fund-tag-risk {
    display: flex;
    align-items: center;
    font-size: 10px;
    font-weight: 400;
    border-radius: 1px;
    padding: 1px 4px;
    background: rgba(47, 121, 255, 0.1);
    color: #2177ff;
    margin-right: 5px;
    &.low-risk {
        color: #fab553;
        background: #fef7e7;
    }
    &.mid-risk {
        color: #ffba00;
        background: #fef7e7;
    }
    &.high-risk {
        background: #fef7e7;
        color: #ee5c22;
    }
    img {
        width: 9px;
        height: 10px;
        margin-right: 2px;
    }
}
</style>
