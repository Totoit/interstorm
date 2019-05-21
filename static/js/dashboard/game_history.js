// Created by Bass on 08/27/2018
var dt_object = new Date();
var month = dt_object.getMonth();
var year = dt_object.getFullYear();

function show_month(month){
    var month_name = new Array(12);
    month_name[0] = "Jan"
    month_name[1] = "Feb"
    month_name[2] = "March"
    month_name[3] = "April"
    month_name[4] = "May"
    month_name[5] = "June"
    month_name[6] = "July"
    month_name[7] = "Aug"
    month_name[8] = "Sept"
    month_name[9] = "Oct"
    month_name[10] = "Nov"
    month_name[11] = "Dec"

    return month_name[month];
}

function calMy(chm,chy,month,year){
    month = month + chm;
    year = year + chy;
    dt = new Date(year, month, 01);
    var year = dt.getFullYear();
    var display_month = dt.getMonth();
    var return_month = display_month + 1;
    var display_month_name = show_month(display_month);
    var first_day = dt.getDay();

    dt.setMonth(month+1,0);
    var last_date = dt.getDate();

    var str1 = "<table class='main'><tr><td><a onclick=show_cal(-1,0," + display_month + "," + year + ");><span class='glyphicon glyphicon-triangle-left' aria-hidden='true'></span></a></td>\n\
    <td style='padding-right:4px!important;' >"+ display_month_name +"<input type='hidden' id='transaction_month' value='"+return_month+"'></td>\n\
    <td id='transaction_year'  style='padding-left:4px!important;'>"+year+"</td>\n\
    <td align=right><a onclick=show_cal(1,0," + display_month + "," + year + ");><span class='glyphicon glyphicon-triangle-right' aria-hidden='true'></a> </td></tr></table>";

    return str1;
}

function show_cal(chm, chy,month,year) {
    document.getElementById('tb-filter-date').innerHTML = calMy(chm,chy,month,year);

    c.doCall(getTransactions);
}

/**
 * Created by Aum on 2/Aug/2018.
 */
var mode = '/user';

function fillDateForms() {
    //Gen months
    var thisMonth = new Date().getMonth();
    var monthlist = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    var months = [];
    var a = 0;
    var selected = "";
    for (i = 1; i < 13; i++) {
        if (i < 10) {
            i = ('0' + i).slice(-2);
        }
        if (thisMonth == a){ selected='selected' } else { selected = ""; }
        months.push('<option value="' + i + '" '+selected+'>'+ gettext(monthlist[a]) +'</option>');
        a++;
    }
    //Gen years
    var thisYear = new Date().getFullYear();
    var years = [];
    var a = 0;
    var selected = "";
    for (i = thisYear; i >= 2017; i--) {
        if (a == 0) {selected = " selected='selected' ";} else {selected = "";}
        years.push('<option value="' + (thisYear-a) + '" '+selected+'>' + (thisYear-a) + '</li>');
        a++;
    }
    $('.dropdown-menu-month').html(months);
    $('.dropdown-menu-year').html(years);
}

function getTransactionsList(value, index, array) {
    setDataShow(value);
}

function getTransactions(session) {
    $('.loading').show();
    $("#transactions_list").html('');
    $('#transactions_nodata').hide();
    $('#transactions_loading').show();
    var transaction_type = $('#transaction_type').val();
    var transaction_size = $('#transaction_size').val();
    // var transaction_year = $('#transaction_year').val();
    // var transaction_month = $('#transaction_month').val();
    var transaction_year = $('#transaction_year').text();
    var transaction_month = $('#transaction_month').val();
    var transaction_page = $('#transaction_page').val();
    var lastDay = new Date(transaction_year, transaction_month , 0);
    var payload = {
      "type": transaction_type,
      "startTime": transaction_year+"-"+transaction_month+"-01T00:00:00.000Z",
      "endTime": transaction_year+"-"+transaction_month+"-"+lastDay.getDate()+"T23:59:59.000Z",
      "pageIndex": transaction_page,
      "pageSize": transaction_size
    };
    session.call(mode + "#getTransactionHistory", [], payload).then(function (result) {
        $('.loading').hide();
        $('#transactions_loading').hide();
        var pages = [];
        var a = 0;
        var selected = "";
        for (i = 1; i <= result.kwargs.totalPageCount; i++) {
            if (i == result.kwargs.currentPageIndex) {selected = " selected='selected' ";} else {selected = "";}
            pages.push('<option value="' + i + '" '+selected+'>' + i + '</li>');
            a++;
        }
        $('.dropdown-menu-page').html(pages);
        if (result.kwargs.totalRecordCount == 0){
          $('#transactions_nodata').show();
          $('#transaction_page').html('<option value="1">1</option>');
        }
        getTransactionsList(result.kwargs.transactions);
    });
}
function setDataShow(response) {
    $.each(response, function (index, value) {
        if (value != null) {
          //console.log(value);
            $('#transactions_nodata').hide();
            var template_base = '/static/handlebars/dashboard/game_history.hbs';

            if (typeof value.credit !== 'undefined'){
              value.typename = "Win";
              value.color = "green";
              value.show_amount = value.credit.amount;
              value.show_currency = "+ "+value.credit.currency;
            } else {
              value.typename = "Loss";
              value.color = "red";
              value.show_amount = value.debit.amount;
              value.show_currency = "- "+value.debit.currency;
            }

            $.get(template_base, function (html) {

                var Template = Handlebars.compile(html);
                limitData = $.extend({}, value, '');

                var HTML = Template(limitData);
                $("#transactions_list").append(HTML);

            });
        }
    });
}

function sendRollback(session,id) {
    var payload = {
      "id": id
    };
    session.call(mode + "/withdraw#rollback", [], payload).then(function (result) {
        c.doCall(getTransactions);
    });
}

function rollback(id) {
    c.doCall(function (session) {
        sendRollback(session,id);
    });
}

$(function () {
      fillDateForms();
      c.doCall(getTransactions);
    //   $('#transaction_type,#transaction_size,#transaction_year,#transaction_month').change(function () {
    $('#transaction_type,#transaction_size').change(function () {
        $('#transaction_page').html('<option value="1">1</option>');
        $('#transactions_nodata').hide();
        c.doCall(getTransactions);
    });
    $('#transaction_page').change(function () {
        c.doCall(getTransactions);
    });

});
