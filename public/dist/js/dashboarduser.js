var globalSkip = 0;
var moreInfo = function(el){
    var relation = $(el).data('relation');
    $('#relations').val(relation);
    getUserAssignmentSummary();
}
var pagination = function(){
    $(document).on("click",".pagination button",function() {
        globalSkip = $(this).data('skip');
        console.log(globalSkip);
        getUserAssignmentSummary(globalSkip);
    });
}
var submitClick = function(){
    $('#relate-modal-form button[type=submit]').click(function(ev){
        console.info(ev);
        setClickAttr(ev.target);
    })
}
var setClickAttr = function(el){
    var sbmt = document.querySelectorAll('#relate-modal-form button[type=submit]');
    console.info(sbmt);
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
var getUserAssignmentSummary = function(skp) {
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
        'relation' :relation,
        'skip': (skp ? skp : 0)
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
        console.info('index',$(el).parent().closest("tr").index());
        var currentIndex = parseInt($(el).parent().closest("tr").index()+1);
        setIndex(currentIndex + 1, currentIndex - 1);
        getAssignmentDetail(el.dataset.assignmentid);
        document.addEventListener('keydown', keyDownListener);
    });
    $('#relate-modal').on('hidden.bs.modal', function(ev) {
        getUserAssignmentSummary(globalSkip);
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
           console.info('Success summary',resp);
            
        },
        error: function(err){
            console.info('Errır summary', err);
        }
    });
}
var getTopicSuccess = function(resp,assignmentid){
    console.info('Get Topic Data = ',resp);
    var tp = document.querySelector('#relate-modal .box-body');
    var noDocMessage = {'title':'<strong>'+resp.data.assign.document_no+'</strong> NOT FOUND!','description':'Document info is not found in the system! Please contact admin!'}
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
    console.info('Get Topic Data err = ',err);
    toggleOverLay('relate-modal');
}
var getUserAssignmentSummarySuccess = function(data) {
    var tp = document.getElementById('assignment-summary');
    console.info('Assignment summary',data);
    tp.innerHTML = Handlebars.templates.assignsummary({
        'assignments': data.assignments,
    });
    var paginationHtml = Handlebars.templates.pagination(data.pagination);
    var pageContainer= document.querySelectorAll('.user-dashboard-pagination');
    console.log('Container', pageContainer);
    pageContainer.forEach(element => {
        element.innerHTML = paginationHtml;
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
    console.info('#summary-table tr:eq('+indx+') td:last button');
    var nextAction = $('#summary-table tr:eq('+indx+') td:last button');

    if(nextAction.length > 0){
        console.info(nextAction);
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
        console.info('y was pressed');
        plist.value = 1;
    }
    else if(event.keyCode == 78) {//n
        console.info('n was pressed');
        plist.value = 0;
    }else if(event.keyCode == 13){//enter pressed
        console.info('Enter pressed');
        var btn = document.querySelector('button[type=submit].next')
        btn.click();
    }
}
var widgetButtonClick = function(){
    $(document).on("click",".btn-widget", function(){
        moreInfo(this);
    })
}
$(function() {
    getUserAssignmentSummary();
    relateModalOnShown();
    postForm();
    submitClick();
    pagination();
    widgetButtonClick();
    Handlebars.registerPartial('warning',Handlebars.templates.warning);
});