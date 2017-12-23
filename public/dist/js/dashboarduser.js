var submitClick = function(){
    $('#relate-modal-form button[type=submit]').click(function(ev){
        console.log(ev);
        setClickAttr(ev.target);
    })
}
var setClickAttr = function(el){
    var sbmt = document.querySelectorAll('#relate-modal-form button[type=submit]');
    console.log(sbmt);
    sbmt.forEach(function(btn){
        $(btn).attr('clicked', false);
    });
    $(el).attr('clicked', true);
}
var postForm = function(){
    $('#relate-modal-form').submit(function(e) {
        
        e.preventDefault();
        debugger;
        var btn = $('#relate-modal-form button[type=submit][clicked=true]');
        //$('#upload-box .overlay').removeClass('hide');
        toggleOverLay('relate-modal','Assignment is being updated!');
        //get the action-url of the form
        var actionurl = e.currentTarget.action;

        $.ajax({
            url: actionurl,
            type: 'POST',
            data:$(e.currentTarget).serialize(),
            success: postFormSuccess(btn.hasClass('next')),
            error: postFormError
        });
    });
}
var postFormSuccess = function(hasNext){
    toggleOverLay('relate-modal');
    if(hasNext){
        var nxt = document.getElementById('next');
        jumpTo(nxt);
    }
}
var postFormError = function(){
    toggleOverLay('relate-modal');
}
var launchRelatedModal = function(el){
    var target = el.dataset.target;
    $(target).modal('show');
}
var getUserAssignmentSummary = function() {
    var pjId = getProjectID();
    var relation = $('#relations').val();
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
        'projectid': pjId,
        'relation' :relation
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
    $('#relate-modal').on('shown.bs.modal', function(ev) {
        var el = ev.relatedTarget;
        console.log('index',$(el).parent().closest("tr").index());
        var currentIndex = parseInt($(el).parent().closest("tr").index()+1);
        setIndex(currentIndex + 1, currentIndex - 1);
        getAssignmentDetail(el.dataset.assignmentid);
    });
    $('#relate-modal').on('hidden.bs.modal', function(ev) {
        getUserAssignmentSummary();
    });
}
var setRelatedSelectBox =  function(){
    var selectRelated = document.getElementsByName('is_related')[0];
    var existVal = document.getElementsByName('is_related_temp')[0].value;
    selectRelated.value = existVal;
}
var getAssignmentDetail = function(assignmentid){
    $.ajax({
        url: "member/topic?assignmentid="+assignmentid,
        type: "GET",
        contentType: false,
        processData: false,
        beforeSend: function(req){
            toggleOverLay('relate-modal','Assignment detail is loading!');
        },
        success: function(resp){
            getTopicSuccess(resp, assignmentid);
            
        },
        error: getTopicError
    });
}
var getSummary = function(){
    $.ajax({
        url: "/",
        type: "GET",
        contentType: false,
        processData: false,/*
        beforeSend: function(req){
            toggleOverLay('relate-modal','Assignment detail is loading!');
        },*/
        success: function(resp){
           console.log('Success summary',resp);
            
        },
        error: function(err){
            console.log('Errır summary', err);
        }
    });
}
var getTopicSuccess = function(resp,assignmentid){
    console.log('Get Topic Data = ',resp);
    var tp = document.querySelector('#relate-modal .box-body');
    var noDocMessage = {'title':'Warning!','description':'Document info has not been found! Please contact admin!'}
    tp.innerHTML = Handlebars.templates.topicdetail({
        'topic': resp.data.topic,
        'document': resp.data.document,
        'assign': resp.data.assign,
        'message':(resp.data.document && resp.data.document.DOCNO ? null : noDocMessage)
    });
    setRelatedSelectBox();
    toggleOverLay('relate-modal');
}
var getTopicError = function(err){
    console.log('Get Topic Data err = ',err);
    toggleOverLay('relate-modal');
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
    /* summaryWidgets(); */
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
        //nextAction.click();
        var index = parseInt(indx);
        setIndex(index + 1, index - 1);
        getAssignmentDetail(nextAction.data('assignmentid'), nextAction.data('topicid'),nextAction.data('documentid'));
    }else{
        $('#close').click();
    }
}
var setIndex = function(next, prev){
    $('#next').attr('index',parseInt(next));
    $('#previous').attr('index',parseInt(prev));
}


$(function() {
    getUserAssignmentSummary();
    relateModalOnShown();
    postForm();
    submitClick();
    Handlebars.registerPartial('warning',Handlebars.templates.warning);
});