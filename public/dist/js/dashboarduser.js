var submitClick = function(){
    $('#relate-modal-form button[type=submit]').click(function(ev){
        C.logger.info(ev);
        setClickAttr(ev.target);
    })
}
var setClickAttr = function(el){
    var sbmt = document.querySelectorAll('#relate-modal-form button[type=submit]');
    C.logger.info(sbmt);
    sbmt.forEach(function(btn){
        $(btn).attr('clicked', false);
    });
    $(el).attr('clicked', true);
}
var postForm = function(){
    $('#relate-modal-form').submit(function(e) {
        
        e.preventDefault();
        //debugger;
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
    $(target).modal(modalOptions);
}
var getUserAssignmentSummary = function() {
    var pjId = getProjectID();
    var relation = $('#relations').val();
    //$('#topic-summary-box .overlay').removeClass('hide');
    if (pjId=='') {
        var tp = document.getElementById('assignment-summary');
        var msg = prepareMessage('Warning', 'No track has been found!')
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
        C.logger.info('index',$(el).parent().closest("tr").index());
        var currentIndex = parseInt($(el).parent().closest("tr").index()+1);
        setIndex(currentIndex + 1, currentIndex - 1);
        getAssignmentDetail(el.dataset.assignmentid);
        document.addEventListener('keydown', keyDownListener);
    });
    $('#relate-modal').on('hidden.bs.modal', function(ev) {
        getUserAssignmentSummary();
        document.removeEventListener('keydown', keyDownListener, false);
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
           C.logger.info('Success summary',resp);
            
        },
        error: function(err){
            C.logger.info('Errır summary', err);
        }
    });
}
var getTopicSuccess = function(resp,assignmentid){
    C.logger.info('Get Topic Data = ',resp);
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
    C.logger.info('Get Topic Data err = ',err);
    toggleOverLay('relate-modal');
}
var getUserAssignmentSummarySuccess = function(data) {
    var tp = document.getElementById('assignment-summary');
    C.logger.info('Assignment summary',data);
    tp.innerHTML = Handlebars.templates.assignsummary({
        'assignments': data.assignments
    });
    summaryWidgets(data);
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
    dataTableMake('summary-table');
    searchableMake('summary-table', 'search-global');
}
var summaryWidgets = function(data) {
    var summ = document.getElementById('user-summary-widgets');
    summ.innerHTML = Handlebars.templates.usersummarywidgets({
        summary :  data.summary
    }); 
}
var jumpTo = function(el){
    var indx = $(el).attr('index');
    C.logger.info('#summary-table tr:eq('+indx+') td:last button');
    var nextAction = $('#summary-table tr:eq('+indx+') td:last button');

    if(nextAction.length > 0){
        C.logger.info(nextAction);
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
var keyDownListener = function(event){
   
    var plist = document.getElementById('is-related');
    if(event.keyCode == 89) {//y
        C.logger.info('y was pressed');
        plist.value = 1;
    }
    else if(event.keyCode == 78) {//n
        C.logger.info('n was pressed');
        plist.value = 2;
    }else if(event.keyCode == 13){//enter pressed
        C.logger.info('Enter pressed');
        var btn = document.querySelector('button[type=submit].next')
        btn.click();
    }
}

$(function() {
    getUserAssignmentSummary();
    relateModalOnShown();
    postForm();
    submitClick();
    Handlebars.registerPartial('warning',Handlebars.templates.warning);
});