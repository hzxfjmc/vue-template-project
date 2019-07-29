<template lang="pug">
    section
        p(v-for="(item, index) in i18n.content") {{`${index + 1}、${item}`}}
</template>

<script>
import { setTitle } from '@/utils/html-utils'

export default {
    name: 'statement',
    computed: {
        i18n() {
            return this.$t('statement')
        }
    },
    mounted() {
        setTitle('美股行情聲明')
    }
}
</script>

<style scoped lang="scss">
section {
    padding: 20px;

    p {
        margin-bottom: 20px;
    }
}
</style>
