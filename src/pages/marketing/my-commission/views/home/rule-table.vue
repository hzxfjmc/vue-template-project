<template lang="pug">
table.rule-table(cellspacing='1')
    tr(v-for="trItem in table")
        td(
            v-for="tdItem,index in trItem"
            :style="`${trItem.length == 3 ? 'width: 100px;' : ''}`"
            v-html="tdItem"
        )
</template>

<script>
import { Row, Col } from 'vant'
export default {
    components: {
        [Row.name]: Row,
        [Col.name]: Col
    },
    props: {
        table: {
            type: Array,
            default: () => []
        }
    }
}
</script>

<style lang="scss" scoped>
.rule-table {
    width: 100%;
    margin: 10px 0;
    font-size: 0.24rem;
    tr {
        background-color: rgba(0, 92, 229, 0.04);
    }
    tr {
        td:nth-child(1) {
            background: rgba(0, 92, 229, 0.06);
            width: 140px;
        }
        text-align: center;
        td {
            padding: 12px 3px;
        }
        border: #fff;
    }
    tr:nth-child(1) {
        td {
            background: rgba(0, 92, 229, 0.2);
        }
    }
    tr:first-child {
        td:first-child {
            border-radius: 4px 0 0 0;
        }
        td:last-child {
            border-radius: 0 4px 0 0;
        }
    }
    tr:last-child {
        td:first-child {
            border-radius: 0 0 0 4px;
        }
        td:last-child {
            border-radius: 0 0 4px 0;
        }
    }
}
</style>
