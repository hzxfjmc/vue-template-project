<template lang="pug">
    .bank-list-box
        ul.inner
            li.bank-list-item(v-for="item in bankList" @click="$emit('clickHandle',item)")
                .bank-logo
                    img(:src="item.imgLoad ? item.logo :'/webapp/open-account/open-account/bank-icon/bank_normal@2x.png'")
                .bank-name {{item.bankName}}
                .bank-recommend(v-if="item.identification") {{item.identification}}
                .bank-last-used(v-if="item.lastUsed") {{lastUsedText}}
</template>

<script>
export default {
    props: {
        lastUsedText: {
            type: String,
            default: '上次使用'
        },
        bankList: {
            type: Array,
            default: () => {
                return []
            }
        }
    }
}
</script>

<style scoped lang="scss">
.bank-list-box {
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.06);
    border-radius: 10px;
    border: 1px solid rgba(235, 235, 235, 0.3);
    .inner {
        padding: 0px 20px;
    }
    .bank-list-item {
        position: relative;
        display: flex;
        display: -webkit-flex;
        line-height: 34px;
        padding: 18px 0 14px;
        &:not(:last-child) {
            border-bottom: 1px dashed rgba(57, 57, 57, 0.1012);
        }
        .bank-logo {
            width: 34px;
            height: 34px;
            border-radius: 50%;
            border: 1px solid rgba(225, 225, 225, 0.5);
            img {
                width: 100%;
                height: 100%;
            }
        }
        .bank-name {
            margin-left: 10px;
            max-width: 73%;
            overflow: hidden;
        }
        .bank-recommend {
            margin: 10px 0 0 7px;
            padding: 0 3px;
            max-width: 34%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-size: 10px;
            color: rgba(193, 158, 104, 1);
            line-height: 18px;
            text-align: center;
            height: 15px;
            line-height: 13px;
            border-radius: 1px;
            border: 1px solid rgba(193, 158, 104, 1);
        }
        .bank-last-used {
            margin: 10px 0 0 7px;
            padding: 0 3px;
            max-width: 34%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-size: 10px;
            color: $hk-primary-color;
            line-height: 18px;
            text-align: center;
            height: 15px;
            line-height: 13px;
            border-radius: 1px;
            border: 1px solid $hk-primary-color;
        }
    }
}
</style>
