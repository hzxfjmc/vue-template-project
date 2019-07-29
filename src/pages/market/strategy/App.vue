<template lang="pug">
    #app(:class="{'is-mainland': $root.isMainland, 'reverse': $root.stockColorType === '2'}")
        keep-alive
            router-view
</template>

<script>
export default {
    name: 'App'
}
</script>

<style lang="less">
// 股票涨跌颜色，默认：红涨绿跌，大陆版与香港版色调不同
#app {
    background: #fff;
    .up {
        color: #e72653;
    }
    .down {
        color: #00c58d;
    }
    &.reverse {
        .up {
            color: #00c58d;
        }
        .down {
            color: #e72653;
        }
    }
    &.is-mainland {
        background: #0b121f;
        .up {
            color: #ff0f52;
        }
        .down {
            color: #01ae66;
        }
    }
}
</style>
