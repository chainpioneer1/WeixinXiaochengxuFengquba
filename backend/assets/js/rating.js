
function confirmDelete(id) {
    $('#ratingId').html(id);
    $('#custom-confirm-delete-view').show();
}
function deleteUser(url) {
    var id = $('#ratingId').html();
    $.ajax({
        type: 'POST',
        url: url + 'rating/deleteRating',
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
