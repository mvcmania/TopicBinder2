var launchAssignModal = function(el) {
    $('#assignModal [role=assign-modal-title]').html('Topic Assignment for <strong>' + el.dataset.topicid + '</strong>');
    $('#assignModal [role=assign-modal-remain]').html(el.dataset.remain);
    $('#topic-id-hidden').val(el.dataset.topicid);
    $('#project-id-hidden').val(getProjectID());
    $('#assignModal').modal('show');
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
}
var getTopicSummaryError = function(err) {
    var msg = prepareMessage('Warning', err.responseJSON.message);
    var tp = document.getElementById('topic-summary');

    tp.innerHTML = Handlebars.templates.warning({
        'message': msg
    });
}
var uploadFileSuccess = function(data) {
    $('#upload-box .overlay .loading-text').text('You are redirecting. Please wait!');
    window.location.reload();
}
var uploadFileError = function(err) {
        $('#upload-box .overlay').addClass('hide');
        console.error('err',err);
        var msg = document.querySelector('#upload-box .box-footer');
        msg.innerHTML = Handlebars.templates.error({
            'message':{
                'title' : 'Error!',
                'description' : err.responseJSON.data.errmsg
            }
        });
}
    //Query for topics 

var getTopicsSummary = function() {
    var pjId = getProjectID();
    //$('#topic-summary-box .overlay').removeClass('hide');
    if (!pjId) {
        var tp = document.getElementById('topic-summary');
        var msg = prepareMessage('Warning', 'No project has been found!')
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
        var fileInput = document.getElementById('topic-file');
        var fileType = document.querySelector('input[name=fileType]:checked').value;
        fd.append('file', fileInput.files[0]);
        fd.append('fileType', fileType.replace(/'/g,''));
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
    getTopicsSummary();
    searchableMake('summary-table', 'search-topic-id');

});