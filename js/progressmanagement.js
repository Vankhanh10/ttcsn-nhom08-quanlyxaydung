document.addEventListener('DOMContentLoaded', function () {
    var data = [{
        x: ['Task 1', 'Task 2', 'Task 3', 'Task 4'],
        y: ['2023-10-01', '2023-10-15', '2023-10-20', '2023-11-05'],
        type: 'bar',
        orientation: 'h'
    }];

    var layout = {
        title: 'Biểu Đồ Gantt - Tiến Độ Dự Án',
        xaxis: {
            title: 'Ngày Bắt Đầu'
        },
        yaxis: {
            autorange: 'reversed',
            tickvals: [0, 1, 2, 3],
            ticktext: ['Task 1', 'Task 2', 'Task 3', 'Task 4']
        }
    };

    Plotly.newPlot('gantt', data, layout);
});