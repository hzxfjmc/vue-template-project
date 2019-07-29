<template lang="pug">
    transition(name="fadein")
        .edit-form-actionsheet(v-show="value" @click="$emit('input', false)")
            transition(name="fadeup")
                .popup(v-show="value" @click.stop)
                    .popup-wrap
                        .popup__title(v-if="title") {{ title }}
                        .popup__item(v-for="item in list" :key="item.name" @click="$emit('select', item)")
                            .popup__item-name {{ item.name }}
                            .popup__item-subname(v-if="item.subname") {{ item.subname }}
                        .popup__cancel(@click="$emit('input', false)") {{ $t('other.cancel') }}
</template>

<script>
export default {
    name: 'edit-form-actionsheet',
    props: {
        value: {
            type: Boolean,
            required: true
        },
        title: String,
        list: {
            type: Array,
            required: true
        }
    },
    mounted() {
        document.body.appendChild(this.$el)
    },
    beforeDestroy() {
        this.$emit('input', false)
        this.$el.remove()
    }
}
</script>

<style lang="scss" scoped>
.edit-form-actionsheet {
    background-color: rgba(#000, 0.3);
    z-index: 1000;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
}
.popup {
    position: absolute;
    left: 50%;
    bottom: 0;
    max-height: 100%;
    width: 100%;
    margin-left: -50%;
    overflow-y: auto;
}
.popup-wrap {
    width: 320px;
    margin: 30px auto;
    background: #fff;
    border-radius: 20px;
    text-align: center;
}
.popup__title {
    border-bottom: 1px solid #efefef;
    font-size: 12px;
    line-height: 36px;
    color: rgba(#393939, 0.4);
}
.popup__item {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    border-bottom: 1px solid #efefef;
    height: 60px;
    padding: 8px 6px;
}
.popup__item-name {
    width: 100%;
    font-size: 16px;
    margin-bottom: 2px;
}
.popup__item-subname {
    width: 100%;
    font-size: 12px;
    color: rgba(#393939, 0.4);
}
.popup__cancel {
    font-size: 16px;
    color: rgba(#393939, 0.6);
    line-height: 60px;
}
@import '../../0-style/transition/fadein.less';
@import '../../0-style/transition/fadeup.less';
</style>
