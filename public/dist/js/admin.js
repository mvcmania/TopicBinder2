//Query for topics 

var getTopicsSummary = function() {
         var pjId = document.getElementById('projects');
         $('#topic-summary-box .overlay').removeClass('hide');
         var data ={'projectid':pjId.value};
        $.ajax({
            url: "admin/topicsummary",
            type: "GET",
            data: data,
            success: function(data) {
                var tp = document.getElementById('topic-summary');
                $('#topic-summary-box .overlay').addClass('hide');
                tp.innerHTML = Handlebars.templates.topicsummary({'pools':data});
                tpCheckBox();
            },
            error : function(err){
                console.log('topicsummary error',err);
                var msg ={'title':'Warning','description':err.responseJSON.message};
                var tp = document.getElementById('topic-summary');
                $('#topic-summary-box .overlay').addClass('hide');
                tp.innerHTML = Handlebars.templates.warning({'message':msg});
            }
        });
 }
 $(function() {   
    $('#assignment-form').submit(function(e){
        e.preventDefault();
        //get the action-url of the form
        var actionurl = e.currentTarget.action;
        $.ajax({
                url: actionurl,
                type: 'POST',
                data: $(e.currentTarget).serialize(),
                success: function(data) {
                    var tpid = data.topic_id;
                    var nofRec = data.result.nModified;
                },
                error : function(err){
                    console.log(err);
                }
        });
    });
     $('#upload-form').submit(function(e){
        e.preventDefault();
        $('#upload-box .overlay').removeClass('hide');
        //get the action-url of the form
        var actionurl = e.currentTarget.action;
        var fd = new FormData();    
        var fileInput = document.getElementById('topic-file');
        fd.append( 'file', fileInput.files[0] );
        $.ajax({
                url: actionurl,
                type: 'POST',
                data: fd,
                contentType: false,
                processData : false,   
                uploadProgress : function(data){
                    console.log('Upload progress event!');
                },
                success: function(data) {
                     console.log('Upload success event!');
                    $('#upload-box .overlay .loading-text').text('You are redirecting. Please wait!');
                    window.location.reload();
                },
                error : function(err){
                    $('#upload-box .overlay').addClass('hide');
                }
        });
    });
    getTopicsSummary();
    
});
var launchAssignModal = function(el){
        $('#assignModalTitle').html('Topic Assignment for '+el.dataset.topicid);
        $('#topic-id-hidden').val(el.dataset.topicid);
        $('#assignModal').modal('show');
};
var postAssignment = function(){
    var el = document.getElementById('assignment-form');
    $(el).submit();
}
var postUploadForm = function(){
    var el = document.getElementById('upload-form');
    $(el).submit();
}
var tpCheckBox = function(){
    //Enable iCheck plugin for checkboxes
    //iCheck for checkbox and radio inputs
    $('#topic-summary input[type="checkbox"]').iCheck({
      checkboxClass: 'icheckbox_flat-blue',
      radioClass: 'iradio_flat-blue'
    });
}
