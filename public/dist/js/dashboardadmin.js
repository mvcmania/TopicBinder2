var confirmDataSet = function(el){
    var val = el.checked;
    if(val){
        $('#create-pool-form .form-group').show();
        $('#create-pool').show();
    }else{
        $('#create-pool-form .form-group').hide();
        $('#create-pool').hide();
    }
}
var createPoolSuccess = function(result){
    toggleOverLay('createpool-modal-content');

    $('#create-pool').popover('destroy');
    $('#createPoolModal').modal('hide');
    //var msg = prepareMessage('Error Occured!', 'Something Wrong' + JSON.stringify(err));
    $('#createPoolModal  div[role=message]').html(
        Handlebars.templates.success({
            'message': {title:'Success', description:result}
        })
    );
    getTopicsSummary();
    
}
var createPoolError = function(err){
    toggleOverLay('createpool-modal-content');
    var msg = prepareMessage('Error Occured!', 'Something Wrong' + JSON.stringify(err.responseText));
    $('#createPoolModal  div[role=message]').html(
        Handlebars.templates.error({
            'message': msg
        })
    );
    
}
var confirm = function(el){
    $(el).popover('toggle');
}
var launchCreatePoolModal = function(el){
    $('#createPoolModal #project-home').text(getProjectID());
    $('#createPoolModal').modal(modalOptions);
    var content = Handlebars.templates.createpoolconfirm({});
    $('#create-pool').popover({
        placement :'top',
        html: true,
        title:'Please confirm <a href="#" class="close cancel" data-dismiss="alert">&times',
        content: content,
        trigger: 'manual'
    });
}
var launchAssignModal = function(el) {
    $('#assignModal [role=assign-modal-title]').html('Topic Assignment for <strong>' + el.dataset.topicid + '</strong>');
    $('#assignModal [role=assign-modal-remain]').html(el.dataset.remain);
    $('#assignModal #number-of-topic').attr('max',el.dataset.remain);
    $('#topic-id-hidden').val(el.dataset.topicid);
    $('#project-id-hidden').val(getProjectID());
    $('#assignModal').modal(modalOptions);
};
var postAssignment = function() {
    var el = document.getElementById('assignment-form');
    $(el).submit();
}
var postUploadForm = function() {
    var el = document.getElementById('upload-form');
    $(el).submit();
}
var tpCheckBox = function() {
    //Enable iCheck plugin for checkboxes
    //iCheck for checkbox and radio inputs
    $('#topic-summary input[type="checkbox"]').iCheck({
        checkboxClass: 'icheckbox_flat-blue',
        radioClass: 'iradio_flat-blue'
    });
}
var summaryWidgets = function() {
    $('#notstarted-count').text($('#summary-table td label.bg-red').length);
    $('#inprogress-count').text($('#summary-table td label.bg-yellow').length);
    $('#completed-count').text($('#summary-table td label.bg-green').length);
}
var postAssignmentSuccess = function(data) {
    toggleOverLay('assign-modal-content');
    $('#assignModal').modal('hide');
    getTopicsSummary();
    dataTableMake('summary-table');
}
var postAssignmentError = function(err) {
    toggleOverLay('assign-modal-content');
    C.logger.info(err);
    var msg = prepareMessage('Error!', err.responseJSON.message);
    $('#assignModal div[role=detail-modal]  div[role=message]').html(
        Handlebars.templates.error({
            'message': msg
        })
    );
}
var pieChart;
var pieChart2;
var detailLoadingSuccess = function(data) {
    if (!data || data.length == 0) {
        var msg = prepareMessage('No Data!', 'There is no assignment yet!');
        $('#assignModal div[role=detail-modal]  div[role=message]').html(
            Handlebars.templates.warning({
                'message': msg
            })
        );
        $('#pieChart,#pieChart2').css({
            height: 0
        });
    } else {
        $('#pieChart,#pieChart2').css({
            height: 'auto'
        });
        $('#assignModal div[role=detail-modal]  div[role=message]').html('');
        pieChart = chartPrepare(data);
        pieChart2 = chartPrepare2(data);
    }
}
var detailLoadingError = function(err) {
    var msg = prepareMessage('Error Occured!', 'Something Wrong' + JSON.stringify(err));
    $('#assignModal div[role=detail-modal]  div[role=message]').html(
        Handlebars.templates.error({
            'message': msg
        })
    );
    $('#pieChart').css({
        height: 0
    });

}
var getTopicSummarySuccess = function(data) {
    var tp = document.getElementById('topic-summary');
    toggleOverLay('topic-summary-box');
    tp.innerHTML = Handlebars.templates.topicsummary({
        'pools': data
    });
    summaryWidgets();
    dataTableMake('summary-table');
    makeExportVisible();
    triggerFileManager();
}

var getTopicSummaryError = function(err) {
    var msg = prepareMessage('Warning', err.responseJSON.message);
    var tp = document.getElementById('topic-summary');

    tp.innerHTML = Handlebars.templates.warning({
        'message': msg
    });
}
var triggerFileManager = function(){
    var ang = angular.element(document.getElementById('file-manager-controller'));
    ang.scope().triggerHashChange();
}
var makeExportVisible = function(){
    var makeVisible = $('#summary-table td[data-order=bg-red],#summary-table td[data-order=bg-yellow]').length > 0 ? false : true;
    var poolVisible = $('#summary-table td[data-order]').length > 0 ? false : true;
    var projectid = getProjectID();
    if(makeVisible && !poolVisible){
        $('#export-form').show();
        $('#project-to-export').val(projectid);
    }else{
        $('#export-form').hide();
        $('#project-to-export').val('');
    }
    if(makeVisible){
        $('#pool-form').show();
    }else{
        $('#pool-form').hide();
    }
    
}
var uploadFileSuccess = function(data) {
    $('#upload-box .overlay .loading-text').text('You are redirecting. Please wait!');
    window.location.reload();
}
var uploadFileError = function(err) {
        $('#upload-box .overlay').addClass('hide');
        console.error('err',err.responseJSON);
        var msg = document.querySelector('#upload-box .box-footer');
        msg.innerHTML = Handlebars.templates.error({
            'message':{
                'title' : 'Error!',
                'description' : err.responseJSON.message
            }
        });
}
    //Query for topics 

var getTopicsSummary = function() {
    var pjId = getProjectID();
    //$('#topic-summary-box .overlay').removeClass('hide');
    if (!pjId) {
        var tp = document.getElementById('topic-summary');
        var msg = prepareMessage('Warning', 'No track has been found!')
        tp.innerHTML = Handlebars.templates.warning({
            'message': msg
        });
        return;
    }
    toggleOverLay('topic-summary-box');
    var data = {
        'projectid': pjId
    };
    $.ajax({
        url: "admin/topicsummary",
        type: "GET",
        data: data,
        success: getTopicSummarySuccess,
        error: getTopicSummaryError
    });
}
var selectFolder = function(e) {
   /*  for (var i = 0; i < e.target.files.length; i++) {
       var s = e.target.files[i].name + '\n';
       s += e.target.files[i].size + ' Bytes\n';
       s += e.target.files[i].type;
       //alert(s);
    } */
 }
$(function() {
    $('#assignment-form').submit(function(e) {
        e.preventDefault();
        toggleOverLay('assign-modal-content');
        //get the action-url of the form
        var actionurl = e.currentTarget.action;
        $.ajax({
            url: actionurl,
            type: 'POST',
            data: $(e.currentTarget).serialize(),
            success: postAssignmentSuccess,
            error: postAssignmentError
        });
    });
    $('#upload-form').submit(function(e) {
        e.preventDefault();
        //$('#upload-box .overlay').removeClass('hide');
        toggleOverLay('upload-box');
        //get the action-url of the form
        var actionurl = e.currentTarget.action;
        var fd = new FormData();
        var values = {};
        $.each($('#upload-form').serializeArray(), function(i, field) {
            fd.append(field.name, field.value);
        });
        
        //var projectFile = document.getElementById('project-file');
        var topicFile = document.getElementById('topic-file');
        //var inputFile = document.getElementById('input-file');
        //C.logger.info('files=',typeof(projectFile.files));
        //fd.append('projectFile', projectFile.files[0]);
        $.each(topicFile.files,(index,element) => {
            fd.append('topicFile_'+index, element);
        });
        
        /* $.each(inputFile.files,function(index,elem){
            fd.append('inputFile_'+index, elem);
        }); */
        
        $.ajax({
            url: actionurl,
            type: 'POST',
            data: fd,
            contentType: false,
            processData: false,
            success: uploadFileSuccess,
            error: uploadFileError
        });
    });
    $('#assignModal').on('shown.bs.modal', function() {
        var tp = encodeURIComponent($('#topic-id-hidden').val());
        var pt = encodeURIComponent($('#project-id-hidden').val());
        $.ajax({
            url: '/admin/assignmentsummary?projectid=' + pt + '&topicid=' + (typeof(tp) == "string" ? parseInt(tp) : tp),
            type: 'POST',
            contentType: false,
            processData: false,
            success: detailLoadingSuccess,
            error: detailLoadingError
        });
    });
    $('#assignModal').on('hidden.bs.modal', function() {
        if (pieChart && pieChart.destroy) pieChart.destroy();
        if (pieChart2 && pieChart2.destroy) pieChart2.destroy();
    });
     $('button[role=pool]').click(function(){
        launchCreatePoolModal();
    });
    $('#create-pool-form').submit(function(e){
        e.preventDefault();
        $('#create-pool').popover('hide');
        toggleOverLay('createpool-modal-content');
        var projectid = getProjectID();
        var fd =  $(e.currentTarget).serializeArray();
        fd.push({ name :'project' , value: projectid});
        console.log('fd',fd);
        $.ajax({
            url: e.currentTarget.action,
            type: 'POST',
            data: fd,
            success: createPoolSuccess,
            error: createPoolError
        });
    })
    $('#createPoolModal').on('hide.bs.modal', function() {
        var cnf = document.getElementById('confirm-dataset');
        cnf.checked = false;
        confirmDataSet(cnf);
    });
    getTopicsSummary();
    searchableMake('summary-table', 'search-topic-id');
});
