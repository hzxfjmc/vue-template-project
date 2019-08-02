<template lang="pug">
     .yx-cell
        .yx-cell__header {{ title }}
        .yx-cell__primary {{ desc }}
</template>

<script>
export default {
    name: 'YxCell'
}
</script>

<style lang="scss" scoped>
.yx-cell {
    display: flex;
}
.yx-cell__header {
}
.yx-cell__primary {
    flex: 1;
}
</style>
