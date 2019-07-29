<template lang="pug">
    .pick-entry.pop(v-show="show" @click="$emit('update:show', false)")
        .box(@click.stop)
            .section
                .title {{ $t('currencyType') }}
                .tags
                    .tag(
                        v-for="tag in tags"
                        :key="tag.name"
                        :class="{selected: value === tag.name}"
                        @click="selectTag(tag)"
                    ) {{ tag.name }}
                    .tag__empty
                    .tag__empty
</template>

<script>
export default {
    name: 'pick-entry',
    data() {
        return {
            tags: [{ name: 'HKD' }, { name: 'USD' }]
        }
    },
    props: {
        value: {
            type: String,
            required: true
        },
        show: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        selectTag(tag) {
            this.$emit('input', tag.name)
            this.$emit('update:show', false)
        }
    }
}
</script>

<style lang="less" scoped>
@import '../style/style.less';
.pick-entry.pop {
    top: 44px;
}
</style>
