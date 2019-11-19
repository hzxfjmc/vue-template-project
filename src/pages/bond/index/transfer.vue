<template lang="pug">
    keep-alive
        router-view
</template>
<script>
export default {
    created() {
        window.h5HistoryBack = function() {
            console.log('111 :', 111)
        }
    }
}
</script>
