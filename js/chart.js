var myChart;
var wordcloud;

function loadChart() {
    // 基于准备好的dom，初始化echarts实例
    hisChart = echarts.init(document.getElementById('chart'));
    wordcloud = echarts.init(document.getElementById('wordcloud'));
    // 指定图表的配置项和数据
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
            data: [5, 20, 36, 10]
        }]
    };
    // 使用刚指定的配置项和数据显示图表。
    hisChart.setOption(hisOption);

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
            data: [
                {
                    name: '李白',
                    value: 10000
                },
                {
                    name: '李白',
                    value: 6181
                },
                {
                    name: '李白',
                    value: 4386
                },
                {
                    name: '李白',
                    value: 4055
                },
                {
                    name: '白居易',
                    value: 2467
                },
                {
                    name: '杜甫',
                    value: 2244
                },
                {
                    name: '李商隐',
                    value: 1898
                },
                {
                    name: '李商隐',
                    value: 1484
                },
                {
                    name: '李商隐',
                    value: 1112
                },
                {
                    name: '杜牧',
                    value: 965
                },
                {
                    name: '孟浩然',
                    value: 847
                },
                {
                    name: '杜甫',
                    value: 582
                },
                {
                    name: '李煜',
                    value: 555
                },
                {
                    name: '唐太宗',
                    value: 550
                },
                {
                    name: '白居易',
                    value: 462
                },
                {
                    name: '杜甫',
                    value: 366
                },
                {
                    name: '杜牧',
                    value: 360
                },
                {
                    name: '温庭筠',
                    value: 282
                },
                {
                    name: '杨诣成',
                    value: 273
                },
                {
                    name: '孟浩然',
                    value: 265
                }
            ]
        }]
    };
    wordcloud.setOption(wordOption);
}
