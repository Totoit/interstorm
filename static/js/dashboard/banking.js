var currency = c.currency;
var min, max;
var mode = '/user/deposit';
var payCardID = '';
var paymentMethodsCode = '';

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

    session.call(mode + "#getCategorizedPagmentMethods", [], payload).then(function (result) {
        // console.log('%cgetCategorizedPagmentMethods :', 'backgroud-color:black;color:orange', result);
        result.kwargs.categories.forEach(setDataShow);
    });
}

function setDataShow(response) {
    var Template;
    var device_width = $(window).width();
    var paymentCode = response.code;
    
    if (device_width <= 780) {
        var template_base = '/static/handlebars/dashboard/deposit_mobile.hbs';
    } else {
        var template_base = '/static/handlebars/dashboard/deposit.hbs';
    }

    $.get(template_base, function (html) {
        Template = Handlebars.compile(html);
        Handlebars.registerHelper('trans', function (title) {
            var t = gettext(title);
            return t;
        });
        
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

$(function () {
    // c.doCall(getCategorizedPagmentMethods);
});


