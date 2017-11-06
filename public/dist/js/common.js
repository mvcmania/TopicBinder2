var prepareMessage = function(ttl, desc) {
    var msg = { title: ttl, description: desc };
    return msg;
}
var toggleOverLay = function(id, text) {
    if(text){
        $('#' + id + ' .overlay .loading-text').text(text);
    }
    $('#' + id + ' .overlay').toggleClass('hide');

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
var getProjectID = function() {
    var pjId = document.getElementById('projects');
    return pjId.value;
}
var searchableMake = function(id, inputid) {
    $('#' + inputid).on('keyup click', function() {
        if ($(this).data('column'))
            $('#' + id).DataTable().column($(this).data('column')).search($(this).val(), false, false).draw();
        else
            $('#' + id).DataTable().search($(this).val(), false, false).draw();
    });
}