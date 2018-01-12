var chartPrepare = function(data) {
    
    if(data.length  == 0 )
    return;
    
    showChartDiv
    //-------------
    //- PIE CHART -
    //-------------
    // Get context with jQuery - using jQuery's .get() method.
    var pieChartCanvas = $("#pieChart").get(0).getContext("2d");
    var pieOptions = {
        title: {
            display: true,
            text: 'Topic Assignment By Users',
            showTooltips: true,
            responsive:true
        },
        tooltips:{
            displayColors  : false
        }
    };
    var lbls = [], dataArr=[], bckColor = [];

    for(var k in data){
        var usr = data[k].user;
        if(usr.length > 0){
            lbls.push(usr[0].name);
            bckColor.push(usr[0].color);
        } 
        dataArr.push(data[k].count);
    }
    var PieData = {
        type: 'pie',
        data: {
            labels: lbls,
            datasets: [{
                data: dataArr,
                backgroundColor: bckColor,
                hoverBackgroundColor : bckColor,
                hoverBorderColor : bckColor,
                borderColor : bckColor
            }]
        },
        options :pieOptions
    };
    return new Chart(pieChartCanvas, PieData);
    //Create pie or douhnut chart
    // You can switch between pie and douhnut using the method below.
    //pieChart.Doughnut(PieData, pieOptions);
}
var chartPrepare2 = function(data) {
    
    if(data.length  == 0 )
    return;
    showChartDiv();
    //-------------
    //- PIE CHART -
    //-------------
    // Get context with jQuery - using jQuery's .get() method.
    var pieChartCanvas = $("#pieChart2").get(0).getContext("2d");
    var pieOptions = {
        title: {
            display: true,
            text: 'Topic Assignments By Status',
            showTooltips: true,
            responsive:true
        },
        tooltips:{
            displayColors  : false
        }
    };
    var dataMap = {"Not Started":0,"Related":0,"Not Related":0}, dataArr=[], bckColor = ["rgba(221, 75, 57, 1)","rgba(243, 156, 18, 1)","rgba(0, 166, 90, 1)"];

    for(var k in data){
        dataMap["Not Started"] += (data[k].notStartedCount);
        dataMap["Related"] += (data[k].relatedCount);
        dataMap["Not Related"] += (data[k].notRelatedCount);
    }
    dataArr = [dataMap["Not Started"], dataMap["Related"],  dataMap["Not Related"]];
    var PieData = {
        type: 'pie',
        data: {
            labels: Object.keys(dataMap),
            datasets: [{
                data: dataArr,
                backgroundColor: bckColor,
                hoverBackgroundColor : bckColor,
                hoverBorderColor : bckColor,
                borderColor : bckColor
            }]
        },
        options :pieOptions
    };
    return new Chart(pieChartCanvas, PieData);
    //Create pie or douhnut chart
    // You can switch between pie and douhnut using the method below.
    //pieChart.Doughnut(PieData, pieOptions);
}
var showChartDiv = function(){
    $('#chart-div').removeClass('hide');
}