var currency = c.currency;
var min, max;
var payCardID = '';

function mobileSetBrTag() {
    var maxTime = 5000, // 5 seconds
        startTime = Date.now();

    var interval = setInterval(function () {
        if ($('tr.dps-data-append').is(':visible')) {
            // visible, do something
            if ($(window).width() <= 736) {
                // alert($('.mgl-5').text()+'_____');
                $('.mb-down').html('<br>');
            }
            clearInterval(interval);
        } else {
            // still hidden
            if (Date.now() - startTime > maxTime) {
                // hidden even after 'maxTime'. stop checking.
                clearInterval(interval);
            }
        }
    }, 100);
}

function getCategorizedPagmentMethods(session) {
    var payload = {
        "filterByCountry": "",
        "currency": currency
    }

    session.call("/user/deposit#getCategorizedPagmentMethods", [], payload).then(function (result) {
        console.log('%cgetCategorizedPagmentMethods :', 'backgroud-color:black;color:orange', result);
        result.kwargs.categories.forEach(setDataShow);
    });
}

function setDataShow(response) {
//   console.log('response BANK !!>',response);
    var Template;
    var device_width = $(window).width();
    var paymentCode = response.code;
    
    
    if (device_width <= 780) {
        var template_base = '/static/handlebars/dashboard/deposit_mobile.hbs';
    } else {
        var template_base = '/static/handlebars/dashboard/deposit.hbs';
    }

    console.log('device_width >>> '+device_width);

    $.get(template_base, function (html) {
        Template = Handlebars.compile(html);
        Handlebars.registerHelper('trans', function (title) {
            var t = gettext(title);
            return t;
        });
        console.log('response.paymentMethods !! >>>> ',response.paymentMethods);
        $.each(response.paymentMethods, function (index, value) {
            if (value != null && value.code != 'MoneyMatrix_Envoy_Qiwi') {
                var myRegex = /\<img.+src\s*=\s*"([^"]+)"/g;
                var test = value.icon;
                var src = myRegex.exec(test)[1];

                if (typeof src !== 'undefined') {
                    value.icon = src;
                }
            }
            
            value.depositLimit.symbol = getSymbol(value.depositLimit.currency);
            value.depositFee = (value.depositFee || 0) + "%";

            var limitData = $.extend({}, value, '');
            var HTML = Template(limitData);
    
            if (paymentCode == 'credit-card' || paymentCode == 'e-wallet' || paymentCode == 'bank-transfer') {
                $("#" + paymentCode).find('.panel-collapse .tb-report').append(HTML);
            } else {
                $("#other-payments").find('.panel-collapse .tb-report').append(HTML);
            }
    
            // if ($(".quicklist").length > 0) {
            //     $(".quicklist").append('<option value=' + value.code + '>' + value.name + '</option>');
            // }
        });
    });

    mobileSetBrTag();
}


function getPendingWithdrawal(session) {
    var null_payload;
    session.call("/user/hostedcashier#getPendingWithdrawal", [], null_payload).then(function (result) {
        var cashierUrl = result.kwargs.cashierUrl;
        // console.log('cashierUrl == '+ cashierUrl);
        $('#tb-pending-withdraw').attr('src',cashierUrl);
    });
}

$(function () {
    c.doCall(getCategorizedPagmentMethods);
    c.doCall(getPendingWithdrawal);
});

$(document).ready(function(){
    
    $('.panel-collapse').on('show.bs.collapse', function () {
        $(this).siblings('.panel-heading').addClass('active');
        $("#"+$(this).attr('id')).parent().addClass('active');
    });
    
    $('.panel-collapse').on('hide.bs.collapse', function () {
        $(this).siblings('.panel-heading').removeClass('active');
        $("#"+$(this).attr('id')).parent().removeClass('active');
    });

    $(document).delegate('#submit-deposit-step-1', 'click', function () {
        var currency = $('#deposit-step-1 #ddlCurrency').val();
        var amount = $('#deposit-step-1 #amount').val();
        var bonusCode = $('#deposit-step-1 #bonusCode').val();

        var parameters = {
            "fields": {
                "currency": currency,
                "amount": amount,
                "returnURL": window.location+"/deposit/status?pid={0}", 
                "cancelURL": window.location+"/deposit/status?pid={0}", 
                "postbackURL": "",
            },
            "bonusCode": bonusCode
        };
        
        c.doCall(function (session) {
            // console.log('!! parameters !!',parameters);
            session.call('/user/hostedcashier#deposit', [], parameters).then(function (result) {
                console.log('Result! : hostedcashier#deposit', result);
                var cashierUrl = result.kwargs.cashierUrl;
                // var pid = result.kwargs.pid;

                if(cashierUrl){
                    // $('.loader-page').show();
                    $('#deposit-i-box').append('<iframe id="i-deposit" src="'+cashierUrl+'" style="border:none;overflow:hidden;height:100%;width:100%;min-height:650px;"></iframe>');
                    $('#deposit-i-box').removeClass('hidden');
                    $('#deposit-form').addClass('hidden');
                }

            }, function (err) {
                console.log('ERROR! : hostedcashier#deposit', err.kwargs.desc, err.kwargs.detail);
            });
        });
    });


});