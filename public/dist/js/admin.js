var launchAssignModal = function(el) {
    $('#assignModalTitle').html('Topic Assignment for ' + el.dataset.topicid);
    $('#topic-id-hidden').val(el.dataset.topicid);
    $('#project-id-hidden').val($('#projects').val());
    $('#assignModal').modal('show');
};
var launchDetailModal = function(el) {
    $('#detailModal').modal('show');
}
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
    console.log('summary widge');
    $('#notstarted-count').text($('#summary-table tr.bg-red').length);
    $('#inprogress-count').text($('#summary-table tr.bg-yellow').length);
    $('#completed-count').text($('#summary-table tr.bg-green').length);
}
var postAssignmentSuccess = function(data) {
    $('#assign-modal-content .overlay').addClass('hide');
    $('#assignModal').modal('hide');
    getTopicsSummary();
    dataTableMake('summary-table');
}
var postAssignmentError = function(err) {
    $('#assign-modal-content .overlay').addClass('hide');
}
var getTopicSummarySuccess = function(data) {
    var tp = document.getElementById('topic-summary');
    $('#topic-summary-box .overlay').addClass('hide');
    tp.innerHTML = Handlebars.templates.topicsummary({
        'pools': data
    });
    summaryWidgets();
    dataTableMake('summary-table');
}
var getTopicSummaryError = function(err) {
    var msg = {
        'title': 'Warning',
        'description': err.responseJSON.message
    };
    var tp = document.getElementById('topic-summary');
    $('#topic-summary-box .overlay').addClass('hide');
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
}
var dataTableMake = function(id) {
    if (!$.fn.dataTable.isDataTable('#' + id)) {
        $('#' + id).DataTable({
            "paging": false,
            "lengthChange": false,
            "searching": true,
            "ordering": true,
            "info": false,
            "autoWidth": false,
            columnDefs: [{
                orderable: false,
                targets: "no-sort"
            }]
        });
    }
}
var searchableMake = function(id) {
        $('#search-topic-id').on('keyup click', function() {
            console.log($(this).data('column'));
            console.log($(this).val());
            $('#' + id).DataTable().column($(this).data('column')).search($(this).val(), false, false).draw();
        });
    }
    //Query for topics 

var getTopicsSummary = function() {
    var pjId = document.getElementById('projects');
    $('#topic-summary-box .overlay').removeClass('hide');
    var data = {
        'projectid': pjId.value
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
        $('#assign-modal-content .overlay').removeClass('hide');
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
        $('#upload-box .overlay').removeClass('hide');
        //get the action-url of the form
        var actionurl = e.currentTarget.action;
        var fd = new FormData();
        var fileInput = document.getElementById('topic-file');
        fd.append('file', fileInput.files[0]);
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
    $('#detailModal').on('shown.bs.modal', function() {
        chartPrepare();
    });
    getTopicsSummary();
    searchableMake('summary-table');

});