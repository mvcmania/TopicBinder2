var toggleBox = function(el){
    $(el).parent().attr('toggle',el.checked);
    updateUser(el);
}
var saveUserSuccess = function(res){
    $('#main-alert').html(
        Handlebars.templates.success({
            message:{
                title : 'SUCCESS',
                description :'Saved!'
            }
        })
    );
    $('#main-alert').fadeIn();
    fadeOutDelay();
}
var saveUsererror = function(err){
    $('#main-alert').html(
        Handlebars.templates.error({
            message:{
                title : 'ERROR',
                description :'Error while saving!'
            }
        })
    );
    $('#main-alert').fadeIn();
    fadeOutDelay();
}
var fadeOutDelay = function(){
    $('#main-alert').delay(2000).fadeOut(400)
}   
var updateUser = function(el){
 var userid = $(el).data('id');
 var frm =  $('#user-management-form');
 var actionurl = $(frm).attr('action')+userid;
 var isAdmin = document.getElementById('isadmin_'+userid).checked;
 var isActive = document.getElementById('isactive_'+userid).checked;
 var fd =  [];
 fd.push({name:"isadmin", value:isAdmin});
 fd.push({name:"isactive", value:isActive});
 console.log(fd);
    $.ajax({
        url: actionurl,
        data: fd,
        type:  $(frm).attr('method'),
        success: saveUserSuccess,
        error: saveUsererror
    });
}
$(function(){
    $('#user-management-form').submit(function(e){
        e.preventDefault();
    });
});