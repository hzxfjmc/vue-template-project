<template lang="pug">
.block__agreement--list
    .agreement__list--item
        h3 {{$t('disclaimerTitle')}}
        p {{$t('describe1')}}
        p {{$t('describe2')}}
    .agreement__list--item
        h3 {{$t('riskTitle')}}
        p {{$t('describe3')}}
        p {{$t('describe4')}}
</template>
<script>
import { Swipe, SwipeItem } from 'vant'
import { mapGetters } from 'vuex'
export default {
    i18n: {},
    components: {
        [Swipe.name]: Swipe,
        [SwipeItem.name]: SwipeItem
    },
    computed: {
        ...mapGetters(['lang'])
    },
    data() {
        return {}
    },
    methods: {},
    created() {}
}
</script>
<style lang="scss" scoped></style>
