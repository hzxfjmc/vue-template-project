<template lang="pug">
.init-router
</template>

<script>
export default {
    mixins: [require('../../mixins/mix-router.js').default],
    created() {
        this.goApplyStep('replace', 'skip')
    }
}
</script>
