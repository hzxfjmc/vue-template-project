<template lang="pug">
    #app(:class="{'is-hk': isHK}")
        keep-alive
            router-view
</template>

<script>
import config from '../0-config'
export default {
    name: 'app',
    data() {
        return {
            isHK: config.isHK
        }
    }
}
</script>
