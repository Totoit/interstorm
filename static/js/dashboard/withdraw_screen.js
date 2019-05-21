/**
 * Created by Aum on 7/26/2018.
 */
let searchParams = new URLSearchParams(window.location.search);
var currency = "";
function setError(err) {
  $('#updateresult').html('<font color=red>' + err + '</font>');
}

function confirmWithdraw(session, args) {
  session.call('/user/withdraw#confirm', [], args).then(function(result) {
    session.call('/user/withdraw#getTransactionInfo', [], {pid: result.kwargs.pid}).then(function(result) {
      $("#withdraw_step3").html(gettext("LANG_JS_SUCCESS"));
      $("#withdraw_step2").hide();
      $("#withdraw_step3").show();
    }, function(err) {
      console.log(err);
      setError(err.kwargs.desc);
    });

  }, function(err) {
    console.log(err);
    setError(err.kwargs.desc);
  });
}

function setDataShow(response) {
  value = response;
  if (value != null) {
    var myRegex = /\<img.+src\s*=\s*"([^"]+)"/g;
    var test = value.icon;
    var src = myRegex.exec(test)[1];
    if (typeof src !== 'undefined') {
      value.icon = src;
    }

    var amountarr = [];
    $.each(value.fields.amount.limits, function(index, value) {
      amountarr[index] = value;
    });

    value.mycurrency = currency;
    value.minlimit = amountarr['NOK'].min;
    value.maxlimit = amountarr['NOK'].max;

    data_get = value;
    var template_base = '/static/handlebars/dashboard/withdraw_screen.hbs';
    $.get(template_base, function(html) {
      var Template = Handlebars.compile(html);
      limitData = $.extend({}, value, '');
      Handlebars.registerHelper('inputselect', function(conditional, options) {
        if (conditional !== undefined && conditional != "") {
          return options.fn(this);
        } else {
          return options.inverse(this);
        }
      });
      Handlebars.registerHelper('trans', function(title) {
        var t = gettext(title);
        return t;
      });
      var HTML = Template(limitData);
      $("#withdraw_screen").append(HTML);

      $("#currency").val(currency);
      if (value.paymentMethodCode == "MoneyMatrix_CreditCard") {}
    });
  }
}

function getPaymentMethodCfg(session, args) {
  session.call('/user/withdraw#getPaymentMethodCfg', [], args).then( //Validate credential validation
      function(result) {
    var res = result.kwargs;
    session.call('/user/account#getProfile', []).then( //Validate credential validation
        function(result) {
      currency = result.kwargs.fields.currency;
      setDataShow(res);
    }, function(e) {
      c.handleError(e);
    });
  }, function(err) {
    console.log(err);
  });
}

function prepareWithdraw(session, args) {
  var param = {
    "paymentMethodCode": value.paymentMethodCode,
    "fields": args
  }
  session.call('/user/withdraw#prepare', [], param).then(function(result) {
    var value_prepare = result.kwargs;
    var template_base = '/static/handlebars/dashboard/withdraw_screen_prepare.hbs';
    $.get(template_base, function(html) {
      var Template2 = Handlebars.compile(html);
      var limitData2 = $.extend({}, value_prepare, '');
      Handlebars.registerHelper('trans', function(title) {
        var t = gettext(title);
        return t;
      });
      var HTML2 = Template2(limitData2);
      $("#withdraw_screen_prepare").html(HTML2);
      $("#withdraw_step1,#withdraw_step3").hide();
      $("#withdraw_step2").show();
    });
  }, function(err) {
    console.log(err);
    setError(err.kwargs.desc);
  });
}

function setWithdraw(session, args) {
  c.doCall(function(session) {
    prepareWithdraw(session, args);
  });
  return false;
}
$(function() {
  c.doCall(function(session) {
    getPaymentMethodCfg(session, {
      paymentMethodCode: slug,
      payCardID: searchParams.get('payCardID')
    });
  });
  $("[name='withdrawForm']").submit(function(event) {
    $('#updateresult').html('');
    var formObj = {};
    var inputs = $('#withdrawForm').serializeArray();
    $.each(inputs, function(i, input) {
      formObj[input.name] = input.value;
    });
    c.doCall(function(session) {
      setWithdraw(session, formObj);
    });
  });
  $("[name='withdrawPrepareForm']").submit(function(event) {
    var formObj = {
      pid: $("#pid").val()
    };
    c.doCall(function(session) {
      confirmWithdraw(session, formObj);
    });
  });
});
