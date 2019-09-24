
function confirmDelete(id) {
    $('#feedbackId').html(id);
    $('#custom-confirm-delete-view').show();
}
function deleteUser(url) {
    var id = $('#feedbackId').html();
    $.ajax({
        type: 'POST',
        url: url + 'message/deleteItem',
        dataType: 'json',
        data: {
            'id': id
        },
        success: function (data, textStatus, jqXHR) {
            if (JSON.parse(data['status']))
                location.reload();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Handle errors here
            console.log('ERRORS: ' + textStatus);
            // STOP LOADING SPINNER
        }
    });
}
