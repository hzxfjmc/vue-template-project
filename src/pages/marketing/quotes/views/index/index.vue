<template lang="pug">
    quotes-layout(:title="$t('index.title')").quotes-home
        .main(slot="main")
            banner-list
            content-box
            //video-box(v-if="isChUser")
</template>
<script>
import bannerList from '../../components/banner-list'
import videoBox from './video'
import contentBox from './content'
export default {
    components: {
        bannerList,
        videoBox,
        contentBox
    },
    computed: {
        isChUser() {
            return this.$store.getters.isChUser
        }
    }
}
</script>
<style lang="scss" scoped>
.main {
    padding: 0 $global-padding 53px;
}
</style>
