<template>
    <div>
        <TableDataTest/>
    </div>

</template>

<script>
import TableDataTest from '@components/TableDataTest'
export default {
    components: {
        TableDataTest
    },
    data() {
        return {
            chartVisible: true,
            tableData: [
                {
                    stock_a: '股票a1',
                    stock_b: '股票b1',
                    stock_c: '股票c1',
                    stock_d: '股票d1',
                    stock_e: '股票e1',
                    stock_f: '股票f1',
                },
                {
                    stock_a: '股票a1',
                    stock_b: '股票b1',
                    stock_c: '股票c1',
                    stock_d: '股票d1',
                    stock_e: '股票e1',
                    stock_f: '股票f1',
                },
                {
                    stock_a: '股票a1',
                    stock_b: '股票b1',
                    stock_c: '股票c1',
                    stock_d: '股票d1',
                    stock_e: '股票e1',
                    stock_f: '股票f1',
                },
                {
                    stock_a: '股票a1',
                    stock_b: '股票b1',
                    stock_c: '股票c1',
                    stock_d: '股票d1',
                    stock_e: '股票e1',
                    stock_f: '股票f1',
                },
                {
                    stock_a: '股票a1',
                    stock_b: '股票b1',
                    stock_c: '股票c1',
                    stock_d: '股票d1',
                    stock_e: '股票e1',
                    stock_f: '股票f1',
                },
                {
                    stock_a: '股票a1',
                    stock_b: '股票b1',
                    stock_c: '股票c1',
                    stock_d: '股票d1',
                    stock_e: '股票e1',
                    stock_f: '股票f1',
                },
                {
                    stock_a: '股票a1',
                    stock_b: '股票b1',
                    stock_c: '股票c1',
                    stock_d: '股票d1',
                    stock_e: '股票e1',
                    stock_f: '股票f1',
                },
                {
                    stock_a: '股票a1',
                    stock_b: '股票b1',
                    stock_c: '股票c1',
                    stock_d: '股票d1',
                    stock_e: '股票e1',
                    stock_f: '股票f1',
                },
                {
                    stock_a: '股票a1',
                    stock_b: '股票b1',
                    stock_c: '股票c1',
                    stock_d: '股票d1',
                    stock_e: '股票e1',
                    stock_f: '股票f1',
                },
                {
                    stock_a: '股票a1',
                    stock_b: '股票b1',
                    stock_c: '股票c1',
                    stock_d: '股票d1',
                    stock_e: '股票e1',
                    stock_f: '股票f1',
                },
                {
                    stock_a: '股票a1',
                    stock_b: '股票b1',
                    stock_c: '股票c1',
                    stock_d: '股票d1',
                    stock_e: '股票e1',
                    stock_f: '股票f1',
                },
                {
                    stock_a: '股票a1',
                    stock_b: '股票b1',
                    stock_c: '股票c1',
                    stock_d: '股票d1',
                    stock_e: '股票e1',
                    stock_f: '股票f1',
                },
            ],
            tableHead: [
                {
                    title: 'titleA',
                    dataIndex: 'stock_a',
                    fixed:left
                },
                {
                    title: 'titleB',
                    dataIndex: 'stock_b',
                },
                {
                    title: 'titleC',
                    dataIndex: 'stock_c',
                },
                {
                    title: 'titleD',
                    dataIndex: 'stock_d',
                },
                {
                    title: 'titleE',
                    dataIndex: 'stock_e',
                },
                {
                    title: 'titleF',
                    dataIndex: 'stock_f',
                },
            ]
        }
    },
    methods: {
        closeChartPop() {
            this.chartVisible = false
        }
    }
}
</script>