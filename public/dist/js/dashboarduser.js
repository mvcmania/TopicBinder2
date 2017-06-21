var getUserAssignmentSummary = function() {
    var pjId = getProjectID();
    //$('#topic-summary-box .overlay').removeClass('hide');
    if(!pjId){
        var tp = document.getElementById('topic-summary');
        var msg =  prepareMessage('Warning','No project has been found!')
        tp.innerHTML = Handlebars.templates.warning({
            'message': msg
        });
        return;
    }
    toggleOverLay('assignment-summary-box');
    var data = {
        'projectid': pjId
    };
    $.ajax({
        url: "member/assignmentsummary",
        type: "GET",
        data: data,
        success: getUserAssignmentSummarySuccess,
        error: getUserAssignmentSummaryError
    });
}
var getProjectID = function(){
    var pjId = document.getElementById('projects');
    return pjId.value;
}
var getUserAssignmentSummarySuccess = function(data) {
    var tp = document.getElementById('assignment-summary');
    tp.innerHTML = Handlebars.templates.assignsummary({
        'assignments': data
    });
    //dataTableMake('summary-table');
    toggleOverLay('assignment-summary-box');
    summaryWidgets();
}
var getUserAssignmentSummaryError = function(err) {
    var msg = prepareMessage('Warning',err.responseJSON.message);
    var tp = document.getElementById('topic-summary');
    
    tp.innerHTML = Handlebars.templates.warning({
        'message': msg
    });
    toggleOverLay('assignment-summary-box');
    summaryWidgets();
}
var summaryWidgets = function() {
    $('#total-topic-count').text($('#summary-table tr[aria-describedby=topic-row]').length);
    $('#total-related-topic-count').text($('#summary-table td[aria-describedby=1]').length);
    $('#total-not-started-topic-count').text($('#summary-table td[aria-describedby=0]').length);
    $('#total-not-related-topic-count').text($('#summary-table td[aria-describedby=2]').length);
}
var prepareMessage =  function(ttl,desc){
    var msg = {title :ttl , description : desc};
    return msg;
}
var toggleOverLay = function(id,text){
    $('#'+id+' .overlay').toggleClass('hide');
}
$(function(){
    getUserAssignmentSummary();
});