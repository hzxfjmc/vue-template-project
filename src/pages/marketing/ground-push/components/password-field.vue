<template lang="pug">
    van-field(
    :type="pType"
    :clearable="clearable"
    :placeholder="placeholder"
    :label="label"
    v-model="password"
    )
        .vc-btn(slot="button")
            img(
            src="@/assets/img/open-account/bind-phone/view.png"
            v-if="pType === 'password'"
            @click="pType = 'text'"
            )
            img(
            src="@/assets/img/open-account/bind-phone/hide.png"
            @click="pType = 'password'"
            v-else)
</template>
<script>
export default {
    data: () => ({
        pType: 'password'
    }),
    props: {
        clearable: {
            type: Boolean,
            default: false
        },
        label: {
            type: String,
            default: '密码：'
        },
        placeholder: {
            type: String,
            default: '请输入密码'
        },
        value: {}
    },
    computed: {
        password: {
            get() {
                return this.value
            },
            set(val) {
                this.$emit('input', val)
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.vc-btn {
    display: flex;
}
</style>
