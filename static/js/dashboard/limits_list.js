function isNumbers(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function changeDateFormat(date) {
    var d = new Date(date);
    
    return date ? d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear() : false;
}

var currency = "";
var base_return = "";

function base_call(endpoint, payload, callback, error_handler) {
    payload = payload || {};

    c.doCall(function (session) {
        session.call(endpoint, [], payload).then(function (response) {
            //console.log(response.kwargs);
            base_return = response.kwargs;

            if (callback) {
                callback(response);
            }
        }, function (err) {
            $('.loading').hide();

            if (error_handler) {
                error_handler(err);
            }
        });
    });
}

/* --------------------------------------------- */
function fetch_deposit_limit(callback) {
    base_call('/user/limit#getLimits', null, callback);
}

function getProfile(session) {
    $('.loading').show();
    session.call('/user/account#getProfile', []).then( //Validate credential validation
        function (result) {
            currency = result.kwargs.fields.currency;
            fetch_deposit_limit(setDataShow);
        },
        function (e) {
            $('.loading').hide();

            console.log(e);
            c.handleError(e);
        }
    );
}

function setDataShow(response) {
    console.log('list response',response);
    var device_width = $(window).width();
    var getSymbolIcon = getSymbol(currency);
    var getPeriodLabel = function(period){
        switch (period) {
            case 'daily':
                return gettext('LANG_JS_DAY').toLowerCase();
                break;

            case 'weekly':
                return gettext('LANG_JS_WEEK').toLowerCase();
                break;

            case 'monthly':
                return gettext('LANG_JS_MONTH').toLowerCase();
                break;
        
            default:
                break;
        }
    }

    $("#limits-list").empty();

    $.each(response.kwargs, function (index, value) {
        //console.log(index);
        if (value != null) {
            $("#submitLimit").show();
            var template_base;

            if (device_width <= 780) {
                // template_base = '/static/handlebars/dashboard/limits_list_mobile.hbs';
                template_base = 'https://aurumstage.s3.amazonaws.com/static/handlebars/dashboard/limits_list_mobile.hbs';
            } else {
                // template_base = '/static/handlebars/dashboard/limits_list.hbs';
                template_base = 'https://aurumstage.s3.amazonaws.com/static/handlebars/dashboard/limits_list.hbs';
            }

            var periodLabel = value.current ? getPeriodLabel(value.current.period) : '';

            if (index.includes("deposit")) {
                var type = {
                    type: index,
                    currency: currency,
                    symbol: getSymbolIcon,
                    typename: 'Deposit Limit',
                    periodLabel: periodLabel,
                    url: "/deposit",
                    expiryDate: value.current ? changeDateFormat(value.current.expiryDate) : '',
                    inputperiod: true
                };
            } else if (index.includes("wagering")) {
                var type = {
                    type: index,
                    currency: currency,
                    symbol: getSymbolIcon,
                    typename: 'Wagering Limit',
                    periodLabel: periodLabel,
                    url: "/wager",
                    expiryDate: value.current ? changeDateFormat(value.current.expiryDate) : '',
                    inputperiod: true
                };
            } else if (index.includes("loss")) {
                var type = {
                    type: index,
                    currency: currency,
                    symbol: getSymbolIcon,
                    typename: 'Loss Limit',
                    periodLabel: periodLabel,
                    url: "/loss",
                    expiryDate: value.current ? changeDateFormat(value.current.expiryDate) : '',
                    inputperiod: true
                };
            } else if (index.includes("session")) {
                var type = {
                    type: index,
                    currency: currency,
                    symbol: getSymbolIcon,
                    url: "/session",
                    expiryDate: value.current ? changeDateFormat(value.current.expiryDate) : '',
                    typename: 'Session Time Limit'
                };
            } else if (index.includes("stake")) {
                var type = {
                    type: index,
                    currency: currency,
                    symbol: getSymbolIcon,
                    url: "/stake",
                    expiryDate: value.current ? changeDateFormat(value.current.expiryDate) : '',
                    typename: 'Stake Limit'
                };
            }else {
                var type = {
                    type: index,
                    currency: currency,
                    symbol: getSymbolIcon
                };
            }

            if (value.current) {
                if (value.current.period == 'daily') {
                    type.daily = ' checked ';
                } else if (value.current.period == 'weekly') {
                    type.weekly = ' checked ';
                } else if (value.current.period == 'monthly') {
                    type.monthly = ' checked ';
                }
            }

            $.get(template_base, function (html) {
                var Template = Handlebars.compile(html);
                limitData = $.extend({}, value, type);

                Handlebars.registerHelper('trans', function (title) {
                    var t = gettext(title.toLowerCase());
                    return t;
                });

                var HTML = Template(limitData);
                if (device_width <= 780) {
                    $("#limits-list-mobile").append(HTML);
                } else {
                    $("#limits-list").append(HTML);
                }
            });
        }
    });

    $('.loading').hide();
}

$(function () {
    c.doCall(getProfile);
});
