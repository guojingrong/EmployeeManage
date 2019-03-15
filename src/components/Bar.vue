<template>
    <div class="charts">
        <div ref="myChart" :style="{width:'400px',height: '400px'}"></div>
    </div>
</template>

<script>
    import echarts from 'echarts'
    // 引入基本模板
    let echart = require('echarts/lib/echarts')
    // 引入柱状图组件
    require('echarts/lib/chart/bar')
    // 引入提示框和title组件
    require('echarts/lib/component/tooltip')
    require('echarts/lib/component/title')

    export default {
        name: "chartBar",
        props: {
            title: String,
            xData: Array,
            yData: Array
        },
        data() {
            return {}
        },
        mounted() {
            this.initBar();
        },
        methods: {
            initBar() {
                // 基于准备好的dom，初始化echarts实例
                let myChart = echarts.init(this.$refs.myChart);
                myChart.setOption({
                    title: {
                        text: this.title
                    },
                    tooltip: {
                        trigger: "axis"
                    },
                    xAxis: {
                        data: this.xData,
                        type: 'category', //category
                    },
                    yAxis: {
                        type: "value"
                    },
                    series: {
                        data: this.yData,
                        type: "bar",
                        itemStyle: {
                            normal: {
                                color: '#3366FF'
                            }
                        }
                    }
                });
            },
            //ajax获取后bind需要二次初始化
            SecInitBar(x_data, y_data,title) {
                // 基于准备好的dom，初始化echarts实例
                let myChart = echarts.init(this.$refs.myChart);
                myChart.setOption({
                    title: {
                        text: title || this.title
                    },
                    tooltip: {
                        trigger: "axis"
                    },
                    xAxis: {
                        data: x_data,
                        type: 'category', //category
                    },
                    yAxis: {
                        type: "value"
                    },
                    series: {
                        data: y_data,
                        type: "bar",
                        itemStyle: {
                            normal: {
                                color: '#3366FF'
                            }
                        }
                    }
                });
            }
        }
    }
</script>