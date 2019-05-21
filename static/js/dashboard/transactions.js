function defaultDate(){

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    
    today = yyyy + '/' + mm + '/' + dd;

    var days = 7; // Days you want to subtract
    var date = new Date();
    var last = new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
    var day = last.getDate();
    var month = last.getMonth()+1;

    subtractDate = yyyy + '/' + month + '/' + day;

    $('#startTime').val(subtractDate);
    $('#endTime').val(today);
}

function setDataShow(response) {
    // console.log('DATA !!!',response);

    var device_width = $( window ).width(); 
    $("#transaction-list, #transactions_list_mobile").html('');
    // console.log('response.length = '+response.length);
    
    if(response.length < 1){
      if( device_width <= 780 ){
        $('#transactions_mobile_nodata').show();
      }else{
        $('#transactions_nodata').show();
      }

    }else{
      $.each(response, function(index, value) {
        if (value != null) {
          $('#transactions_nodata').hide();
    
          if( device_width <= 780 ){
            var template_base = '/static/handlebars/dashboard/transactions_mobile.hbs';
          }else{
            var template_base = '/static/handlebars/dashboard/transactions.hbs';
          }
    
          value.typename = $('#transaction_type').val();
          if (value.typename == "deposit") {
            value.methodname = value.debit.name;
            value.show_amount = value.credit.amount;
            value.show_currency = value.credit.currency;
            value.show_status = "Success";
          } else {
            value.methodname = value.credit.name;
            value.show_amount = value.debit.amount;
            value.show_currency = value.debit.currency;
            value.show_status = value.status;
          }

          var DateTimeArr = value.time.split("T");
          var showDate = DateTimeArr[0];
          var showTime = DateTimeArr[1].substring(0, DateTimeArr[1].indexOf('.'));
          value.showDate = showDate;
          value.showTime = showTime;

          $.get(template_base, function(html) {
            var Template = Handlebars.compile(html);
            limitData = $.extend({}, value, '');
            Handlebars.registerHelper('trans', function(title) {
              var t = gettext(title);
              return t;
            });
            var HTML = Template(limitData);
    
            if( device_width <= 780 ){
              $("#transactions_list_mobile").append(HTML);
            }else{
              $("#transaction-list").append(HTML);
            }
    
          });
        }
      });
    }

  }

function getTransactions(session) {
    // $('.loading').show();
    // $("#transactions_list").html('');
    // $('#transactions_nodata').hide();
    // $('#transactions_loading').show();
    var transaction_type = $('#transaction_type').val();
    var startTime = $('#startTime').val();
    var endTime = $('#endTime').val();
    var transaction_page = $('#transaction_page').val();

    startTime = startTime.replace(/\//g, "-");
    endTime = endTime.replace(/\//g, "-");
  
    var payload = {
      "type": transaction_type,
      "startTime": startTime + "T17:00:00.000Z",
      "endTime": endTime + "T16:59:00.000Z",
      "pageIndex": transaction_page,
      "pageSize": 10
    };
    // console.log('>> Trans payload <<',payload);

    session.call("/user#getTransactionHistory", [], payload).then(function(result) {
      // $('.loading').hide();
      $('#transactions_loading').hide();
    //   console.log('getTransactionHistory result !!!',result);
      var pages = [];
      var a = 0;
      var selected = "";
      for (i = 1; i <= result.kwargs.totalPageCount; i++) {
        if (i == result.kwargs.currentPageIndex) {
          selected = " selected='selected' ";
        } else {
          selected = "";
        }
        pages.push('<option value="' + i + '" ' + selected + '>' + i + '</li>');
        a++;
      }
      $('.dropdown-menu-page').html(pages);
      if (result.kwargs.totalRecordCount == 0) {
        $('#transactions_nodata').show();
        $('#transaction_page').html('<option value="1">1</option>');
      }
      setDataShow(result.kwargs.transactions);
    });
  }

$(function() {
    defaultDate();
    c.doCall(getTransactions);

    $('#filter-transaction').click(function() {
        c.doCall(getTransactions);
    });
        
    $('#transaction_type,#transaction_page').change(function() {
        c.doCall(getTransactions);
    });

});