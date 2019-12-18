<template lang="pug">
    .risk-assessment-wrapper
        risk-assessment(v-show='isriskAssessment')
</template>

<script>
import riskAssessment from '@/components/risk-assessment/index'
import { getCurrentUser } from '@/service/user-server.js'
export default {
    components: {
        riskAssessment
    },
    data() {
        return {
            isriskAssessment: false
        }
    },
    beforeRouteEnter(to, from, next) {
        next(async vm => {
            try {
                const res = await getCurrentUser()
                const userInfo = res
                if (
                    !vm.$route.query.id &&
                    userInfo.assessResult &&
                    !vm.$route.query.notFirstSubmit
                ) {
                    console.log(userInfo.assessResult)
                    window.location.replace(
                        location.origin +
                            '/wealth/fund/index.html#/risk-assessment-result'
                    )
                } else {
                    vm.isriskAssessment = true
                }
            } catch (e) {
                console.log('getCurrentUser:error:>>>', e)
            }
        })
    }
}
</script>

<style lang="scss" scoped>
.risk-assessment-wrapper {
    height: 100%;
}
</style>
