/*
 fileName:
 description: process Tourist Area
 */

// Code included inside $( document ).ready() will only run once the page Document Object Model (DOM) is ready for JavaScript code to execute
var tree_data;

$(document).ready(function () {
    $("div input").on('change', function(object)
    {
        console.log(object.currentTarget.id);
        if(object.currentTarget.checked){
            tree_data[object.currentTarget.id] = 1;
        }
        else{
            tree_data[object.currentTarget.id] = 0;
        }
    });
});


function makeContent(data){
    var content_html = '';
    if(data.length > 0){
        content_html += '<ul>';
        for(var i =0; i < data.length; i++){
            if( data[i]['id'] == '') {
                content_html += '<li>'+data[i]['text'];
            }else{
                content_html += '<li data-value="'+data[i]['id']+'">'+data[i]['text'];
            }
            if(data[i]['data'].length > 0){
                content_html += makeContent(data[i]['data']);
            }
            content_html += '</li>';
        }
        content_html += '</ul>'
    }
    return content_html;
}

function confirmDelete(id) {
    $('#roleId').html(id);
    $('#custom-confirm-delete-view').show();
}

function hideRoleEdit()
{
    $('#custom-generate-auth-view').hide();
}

function showRoleEdit(roleId) {
    $('#roleId').html(roleId);
    $.ajax({
        type: 'POST',
        url: baseURL + 'systemmanage/roleInfos',
        dataType: 'json',
        data:{
            id: roleId
        },
        success: function(data){
            tree_data = JSON.parse(data.result[0].permission);
            console.log(tree_data);
            if(tree_data.p_10==1){
                $("#p_10").attr('checked', true);
            }
            else{
                $("#p_10").attr('checked', false);
            }
            if(tree_data.p_20==1){
                $("#p_20").attr('checked', true);
            }
            else{
                $("#p_20").attr('checked', false);
            }
            if(tree_data.p_30==1){
                $("#p_30").attr('checked', true);
                console.log("here");
            }
            else{
                $("#p_30").attr('checked', false);
            }
            if(tree_data.p_40==1){
                $("#p_40").attr('checked', true);
            }
            else{
                $("#p_40").attr('checked', false);
            }
            if(tree_data.p_50==1){
                $("#p_50").attr('checked', true);
            }
            else{
                $("#p_50").attr('checked', false);
            }
            if(tree_data.p_60==1){
                $("#p_60").attr('checked', true);
            }
            else{
                $("#p_60").attr('checked', false);
            }
            if(tree_data.p_70==1){
                $("#p_70").attr('checked', true);
            }
            else{
                $("#p_70").attr('checked', false);
            }
            if(tree_data.p_80==1){
                $("#p_80").attr('checked', true);
            }
            else{
                $("#p_80").attr('checked', false);
            }
            if(tree_data.p_90==1){
                $("#p_90").attr('checked', true);
            }
            else{
                $("#p_90").attr('checked', false);
            }
            if(tree_data.p_100==1){
                $("#p_100").attr('checked', true);
            }
            else{
                $("#p_100").attr('checked', false);
            }
            if(tree_data.p_110==1){
                $("#p_110").attr('checked', true);
            }
            else{
                $("#p_110").attr('checked', false);
            }
            if(tree_data.p_120==1){
                $("#p_120").attr('checked', true);
            }
            else{
                $("#p_120").attr('checked', false);
            }
        }
    });
    $('#custom-generate-auth-view').show();
}

function updateRole(url) {
    var roleId = $('#roleId').html();
    console.log(JSON.stringify(tree_data));
    console.log(roleId);
    $.ajax({
        type: 'POST',
        url: url + 'systemmanage/updateRole',
        dataType: 'json',
        data: {
            'id': roleId,
            'permission': JSON.stringify(tree_data)
        },
        success: function (data, textStatus, jqXHR) {
            console.log(data);
            if (data.status) {
                location.reload();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Handle errors here
            console.log('ERRORS: ' + textStatus);
            // STOP LOADING SPINNER
        }
    });
}
function addRole(url) {
    var roleName = $('#rolename').val();
    if (roleName == '' || roleName.length > 10) {
        $('#alertmsg').html("不超过10个字符；名称不允许相同.");
        $('#alertmsg').show();
        return;
    } else {
        $('#alertmsg').html("");
        $('#alertmsg').hide();
    }
    $('#custom-generate-auth-count-view').hide();
    $.ajax({
        type: 'POST',
        url: url + 'systemmanage/addRole',
        dataType: 'json',
        data: {
            'roleName': roleName
        },
        success: function (data, textStatus, jqXHR) {
            if (JSON.parse(data['status'])) {
                location.reload();
            } else {
                $('#alertmsg').html("不超过10个角色.");
                $('#alertmsg').show();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Handle errors here
            console.log('ERRORS: ' + textStatus);
            // STOP LOADING SPINNER
        }
    });
}
function deleteRole(url) {
    var roleId = $('#roleId').html();
    location.href = url + 'systemmanage/deleteRole/' + roleId;
}
