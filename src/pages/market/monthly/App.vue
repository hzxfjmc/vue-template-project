<template lang="pug">
    #app(:class="{'is-en-lang': $root.isLangEn}")
        keep-alive(:include="['index', 'list']")
            router-view
</template>

<script>
export default {
    name: 'App'
}
</script>

<style lang="less" scoped>
#app {
    color: #393939;
    overflow: auto;
    height: 100%;
    -webkit-overflow-scrolling: touch;
}
</style>
