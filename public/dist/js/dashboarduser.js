var launchRelatedModal = function(el){
    var target = el.dataset.target;
    $(target).modal('show');
}
var getUserAssignmentSummary = function() {
    var pjId = getProjectID();
    //$('#topic-summary-box .overlay').removeClass('hide');
    if (pjId=='') {
        var tp = document.getElementById('assignment-summary');
        var msg = prepareMessage('Warning', 'No project has been found!')
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
var relateModalOnShown = function(){
    $('#relateModal').on('shown.bs.modal', function(ev) {
        var el = ev.relatedTarget;
        $('#next').attr('index',parseInt(el.dataset.index)+1);
        $('#previous').attr('index',el.dataset.index-1);
        $.ajax({
            url: "member/topic?topicid="+el.dataset.topicid,
            type: "GET",
            contentType: false,
            processData: false,
            beforeSend: function(req){
                toggleOverLay('relateModal');
            },
            success: function(resp){
                getTopicSuccess(resp, el);
                
            },
            error: getTopicError
        });
    });
}
var getTopicSuccess = function(resp,el){
    console.log('Get Topic Data = ',resp);
    var tp = document.querySelector('#relateModal .modal-body');

    tp.innerHTML = Handlebars.templates.topicdetail({
        'topic': resp.data,
        'document':{'name':el.dataset.document}
    });
    toggleOverLay('relateModal');
}
var getTopicError = function(err){
    console.log('Get Topic Data err = ',err);
    toggleOverLay('relateModal');
}
var getUserAssignmentSummarySuccess = function(data) {
    var tp = document.getElementById('assignment-summary');
    console.log('Assignment summary',data);
    tp.innerHTML = Handlebars.templates.assignsummary({
        'assignments': data
    });
    afterGetUserAssignmentSummary();

}
var getUserAssignmentSummaryError = function(err) {
    var msg = prepareMessage('Warning', err.responseJSON.message);
    var tp = document.getElementById('assignment-summary');

    tp.innerHTML = Handlebars.templates.warning({
        'message': msg
    });
    afterGetUserAssignmentSummary();
}
var afterGetUserAssignmentSummary = function() {
    toggleOverLay('assignment-summary-box');
    summaryWidgets();
    dataTableMake('summary-table');
    searchableMake('summary-table', 'search-global');
}
var summaryWidgets = function() {
    $('#total-topic-count').text($('#summary-table tr[aria-describedby=topic-row]').length);
    $('#total-related-topic-count').text($('#summary-table td[aria-describedby=1]').length);
    $('#total-not-started-topic-count').text($('#summary-table td[aria-describedby=0]').length);
    $('#total-not-related-topic-count').text($('#summary-table td[aria-describedby=2]').length);
}
var jumpTo = function(el){
    var indx = $(el).attr('index');
    console.log('#summary-table tr:eq('+indx+') td:last button');
    var nextAction = $('#summary-table tr:eq('+indx+') td:last button');

    if(nextAction.length > 0){
        console.log(nextAction);
        $(nextAction).click();
    }else{
        $('#close').click();
    }
}
$(function() {
    getUserAssignmentSummary();
    relateModalOnShown();
});