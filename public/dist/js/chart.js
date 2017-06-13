var chartPrepare = function() {
    //-------------
    //- PIE CHART -
    //-------------
    // Get context with jQuery - using jQuery's .get() method.
    var pieChartCanvas = $("#pieChart").get(0).getContext("2d");
    var pieOptions = {
        title: {
            display: true,
            text: 'Usage of browsers'
        }
    };

    var PieData = {
        type: 'pie',
        data: {
            labels: ['Chrome', 'IE', 'Firefox', 'Safari', 'Opera', 'Navigator'],
            datasets: [{
                label: 'Usage of browsers',
                backgroundColor: ['#f56954', '#00a65a', '#f39c12', '#00c0ef', '#3c8dbc', '#d2d6de'],
                data: [700, 500, 400, 600, 300, 100]
            }]
        },
        options: pieOptions
    };
    var pieChart = new Chart(pieChartCanvas, PieData);
    //Create pie or douhnut chart
    // You can switch between pie and douhnut using the method below.
    //pieChart.Doughnut(PieData, pieOptions);
}