//加载图表
function loadChart() {
    // 基于准备好的dom，初始化echarts实例
    var hisChart = echarts.init(document.getElementById('chart'));
    // 指定图表的配置项和数据
    var chartDdata = getChartData();
    var hisOption = {
        title: {
            text: '时期分布'
        },
        tooltip: {},
        xAxis: {
            data: ["初唐", "盛唐", "中唐", "晚唐"]
        },
        yAxis: {},
        series: [{
            name: '诗歌数量',
            type: 'bar',
            data: [chartDdata.chutangPoems, chartDdata.shengtangPoems, chartDdata.zhongtangPoems, chartDdata.wantangPoems]
        }]
    };
    // 使用刚指定的配置项和数据显示图表。
    hisChart.setOption(hisOption);
}

//加载词云图
function loadWordCloudByPeriodId(id) {
    var wordcloud = echarts.init(document.getElementById('wordcloud'));
    var wcData = getWordCloudDataByPeriodId(id);
    var wordOption = {
        tooltip: {},
        series: [{
            type: 'wordCloud',
            gridSize: 2,
            sizeRange: [12, 40],
            rotationRange: [0, 0], // 旋转范围
            shape: 'circle',
            width: 250,
            height: 250,
            drawOutOfBound: false,
            textStyle: {
                normal: {
                    color: function () {
                        return 'rgb(' + [
                            Math.round(Math.random() * 160),
                            Math.round(Math.random() * 160),
                            Math.round(Math.random() * 160)
                        ].join(',') + ')';
                    }
                },
                emphasis: {
                    shadowBlur: 10,
                    shadowColor: '#333'
                }
            },
            data: wcData
        }]
    };
    wordcloud.setOption(wordOption);
}
