var data = [
    { task: "Task 1", start: new Date("2023-10-01"), endPlanned: new Date("2023-10-05"), endActual: new Date("2023-10-07"), completed: true },
    { task: "Task 2", start: new Date("2023-10-03"), endPlanned: new Date("2023-10-08"), endActual: new Date("2023-10-05"), completed: true },
    { task: "Task 3", start: new Date("2023-10-06"), endPlanned: new Date("2023-10-10"), endActual: new Date("2023-10-08"), completed: false },
    { task: "Task 4", start: new Date("2023-10-11"), endPlanned: new Date("2023-10-15"), endActual: new Date("2023-10-16"), completed: false },
    // Thêm các công việc khác vào đây
    { task: "Task 5", start: new Date("2023-10-11"), endPlanned: new Date("2023-10-15"), endActual: new Date("2023-10-14"), completed: false }
];

var currentDate = new Date(); // Thời gian hiện tại

var margin = { top: 20, right: 10, bottom: 30, left: 40 };
var width = 800 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;

var svg = d3.select("#gantt").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var xScale = d3.scaleTime()
    .domain([d3.min(data, function (d) { return d.start; }), d3.max(data, function (d) { return d.endActual; })])
    .range([0, width]);

var yScale = d3.scaleBand()
    .domain(data.map(function (d) { return d.task; }))
    .range([0, height])
    .padding(0.1);

svg.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", function (d) {
        var plannedEnd = new Date(d.endPlanned);
        var actualEnd = new Date(d.endActual);
        if (d.completed && actualEnd <= plannedEnd) {
            return "bar completed-on-time";
        } else if (d.completed && actualEnd > plannedEnd) {
            return "bar completed-overdue";
        } else if (!d.completed && actualEnd <= plannedEnd) {
            var progressPercentage = ((actualEnd - d.start) / (plannedEnd - d.start)) * 100;
            return "bar incomplete-on-time progress-" + Math.round(progressPercentage);
        } else {
            var overdueDays = (actualEnd - plannedEnd) / (1000 * 60 * 60 * 24); // Số ngày quá hạn
            var progressPercentage = ((actualEnd - d.start) / (plannedEnd - d.start)) * 100;
            return "bar incomplete-overdue progress-" + Math.round(progressPercentage) + " overdue-" + Math.round(overdueDays);
        }
    })
    .attr("x", function (d) { return xScale(d.start); })
    .attr("y", function (d) { return yScale(d.task); })
    .attr("width", function (d) { return xScale(d.endActual) - xScale(d.start); })
    .attr("height", yScale.bandwidth());

svg.selectAll(".bar-text")
    .data(data)
    .enter().append("text")
    .attr("class", "bar-text")
    .attr("x", function (d) { return xScale(d.start) + (xScale(d.endActual) - xScale(d.start)) / 2; })
    .attr("y", function (d) { return yScale(d.task) + yScale.bandwidth() / 2; })
    .attr("dy", "0.35em")
    .text(function (d) {
        var startDate = d.start.getDate() + "/" + (d.start.getMonth() + 1);
        var endDate = d.endActual.getDate() + "/" + (d.endActual.getMonth() + 1);
        return startDate + " - " + endDate;
    });

svg.append("g")
    .attr("class", "axis-x")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%d/%m")))
    .selectAll("text")
    .style("text-anchor", "middle");

svg.append("g")
    .attr("class", "axis-y")
    .call(d3.axisLeft(yScale));

// Thêm nhãn trục và tiêu đề biểu đồ
svg.append("text")
    .attr("x", width / 2)
    .attr("y", height + margin.top + 10)
    .style("text-anchor", "middle")
    .text("Thời Gian");

svg.append("text")
    .attr("x", 5)
    .attr("y", -6)
    .style("text-anchor", "middle")
    .text("Công Việc")
    .attr("transform", "rotate(0)");