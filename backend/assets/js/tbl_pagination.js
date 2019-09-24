var currentShowedPage = 1;
var showedItems = 10;
var prevstr = '上一页';
var nextstr = '下一页';
var pager;

function Pager(tableName, itemsPerPage) {

    this.tableName = tableName;
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;
    this.pages = 0;
    this.inited = false;

    this.showRecords = function(from, to) {
        var rows = document.getElementById(tableName).rows;
        // i starts from 1 to skip table header row
        for (var i = 1; i < rows.length; i++) {
            if (i < from || i > to)
                rows[i].style.display = 'none';
            else
                rows[i].style.display = '';
        }
    }

    this.showPage = function(pageNumber) {
        if (! this.inited) {
            alert("not inited");
            return;
        }
        var oldPageAnchor = document.getElementById('pg'+this.currentPage);
        if( oldPageAnchor == undefined) return;
        oldPageAnchor.className = 'pg-normal';

        this.currentPage = pageNumber;
        var newPageAnchor = document.getElementById('pg'+this.currentPage);
        newPageAnchor.className = 'pg-selected';

        var from = (pageNumber - 1) * itemsPerPage + 1;
        var to = from + itemsPerPage - 1;
        this.showRecords(from, to);
    }

    this.prev = function() {
        if (this.currentPage > 1){

            currentShowedPage = this.currentPage - 1;
            this.showPage(this.currentPage - 1);
            var element = document.getElementById('cur_page_num');
            element.innerHTML = currentShowedPage;
        }

    }

    this.next = function() {
        if (this.currentPage < this.pages) {

            currentShowedPage = this.currentPage + 1;
            this.showPage(this.currentPage + 1);
            var element = document.getElementById('cur_page_num');
            element.innerHTML = currentShowedPage;
        }
    };

    this.init = function() {
        var rows = document.getElementById(tableName).rows;
        var records = (rows.length - 2);
        this.pages = Math.ceil(records / itemsPerPage);
        this.inited = true;
    }
    this.showPageNav = function(pagerName, positionId) {
        if (! this.inited) {
            alert("not inited");
            return;
        }
        if( this.pages < 1) return;
        var element = document.getElementById(positionId);


        var pagerHtml = '';
        pagerHtml += '<select id="pageCnt" style="margin-right: 20px;">';
        pagerHtml += '<option value="5" '+ ((showedItems == 5) ? 'selected' : '') +'>5</option>';
        pagerHtml += '<option value="10" '+ ((showedItems == 10) ? 'selected' : '') +'>10</option>';
        pagerHtml += '<option value="15" '+ ((showedItems == 15) ? 'selected' : '') +'>15</option>';
        pagerHtml += '<option value="30" '+ ((showedItems == 30) ? 'selected' : '') +'>30</option>';
        pagerHtml += '<option value="50" '+ ((showedItems == 50) ? 'selected' : '') +'>50</option>';
        pagerHtml += '<option value="100" '+ ((showedItems == 100) ? 'selected' : '') +'>100</option>';
        pagerHtml += '<option value="500" '+ ((showedItems == 500) ? 'selected' : '') +'>500</option>';
        pagerHtml += '</select>';

        pagerHtml += '<button class = "btn btn-primary" onclick="' + pagerName + '.prev();" class="pg-normal" style="padding: 5px;">'+prevstr+ '</button>  ';
        for (var page = 1; page <= this.pages; page++) {
            pagerHtml += '<button hidden id="pg' + page + '" class="pg-normal" onclick="' + pagerName + '.showPage(' + page + ');">' + page + '</button>  ';
        }

        pagerHtml += '<label  type="text" id= "cur_page_num" style="margin: 0px 5px; padding: 2px 5px; border: 1px solid #e0e0e0;">1</label>';
        pagerHtml += '<span>/</span>';
        pagerHtml += '<label  type="text" id= "all_page_num"  style="margin: 0px 5px; padding: 2px 5px; border: 1px solid #e0e0e0;">' + this.pages  + '</label>';
        pagerHtml += '<button  class = "btn btn-primary" onclick="'+pagerName+'.next();" class="pg-normal" style="padding: 5px;">'+nextstr+'</button>';

        element.innerHTML = pagerHtml;

        $('#pageCnt').on('change', function () {
            showedItems = parseInt($('#pageCnt :selected').val());
            executionPageNation();
        });
    }
}

//pager.showPageNav('pager', 'contentpageNavPosition');
//pager.showPage(currentShowedPage);
function executionPageNation()
{
    pager = new Pager('contentInfo_tbl', showedItems);
    pager.init();
    pager.showPageNav('pager', 'contentpageNavPosition');
    pager.showPage(currentShowedPage);
}

function setShowCounts(num){
    showedItems = num;
}
