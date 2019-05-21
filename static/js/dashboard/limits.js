function isNumbers(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function inputOnlyNumber(element) {
    element.keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
            // Allow: Ctrl+A, Command+A
            (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
            // Allow: home, end, left, right, down, up
            (e.keyCode >= 35 && e.keyCode <= 40)) {
            // let it happen, don't do anything
            return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });
}

function showSuccess() {
    swal({
        title: '',
        text: gettext('LANG_JS_THE_OPERATION_HAS_BEEN_COMPLETED'),
        icon: "success",
        type: 'success',
        showCancelButton: false,
        confirmButtonText: gettext('LANG_JS_CLOSE'),
    }).then(() => {
        setActiveLimitShow();
    });
}

var currency = "";
var base_return = "";

/* --------------------------------------------- */
function getProfile(session) {
    session.call('/user/account#getProfile', []).then(
        function (result) {
            $('.currency').text(getSymbol(result.kwargs.fields.currency))
            currency = result.kwargs.fields.currency;
            setActiveLimitShow();
        },
        function (e) {
            console.log(e);
            c.handleError(e);
        }
    );
}

function setActiveLimitShow() {
    c.doCall(function (session) {
        $('.loading').show();

        session.call('/user/limit#getLimits', [], {}).then(
            function (result) {

                console.log('getLimits !!!',result);

                if (typeof result.kwargs.deposit != 'undefined' || typeof result.kwargs.loss != 'undefined' || typeof result.kwargs.session != 'undefined' || typeof result.kwargs.wagering != 'undefined') {
                    base_return = result.kwargs;
                    console.log(base_return);
                    $("#showactive_limit").html('');
                
                    $.each(result.kwargs, function (index, value) {
                        
                        if (value != null) {
                            var $form = $('form[name=' + index + 'LimitForm]');
                            if (value.current) {
                                if (index.includes("session")) {
                                    $('input[name=' + index + '-limit-amount]').val(value.current.minute).prop('disabled', !value.updatable);
                                } else {
                                    $('input[name=' + index + '-limit-amount]').val(value.current.amount).prop('disabled', !value.updatable);
                                    $('input[name=' + index + '-limit-period]').prop('disabled', !value.updatable);
                                    $('input[name=' + index + '-limit-period][value=' + value.current.period + ']').prop('checked', true);
                                }

                                if(value.updatable) {
                                    $($form).find('.no-limit-btn').hide();
                                    $($form).find('.set-limit-btn').show();
                                }
                            }else{
                                $($form).find('.no-limit-btn').show();
                                $($form).find('.set-limit-btn').hide();
                            }
                        }
                    });
                }

                $('.loading').hide();
            },
            function (e) {
                $('.loading').hide();

                console.log(e);
                c.handleError(e);
            }
        );
    });
}

function saveDepositLimit(session) {
    var limitPeriod = "";
    var limitAmount = 0;
    var limitCurrency = "EUR";

    if (typeof $('input[name=deposit-limit-period]:checked').val() === 'undefined') {
        limitPeriod = "daily";
    } else {
        limitPeriod = $('input[name=deposit-limit-period]:checked').val();
    }

    if (typeof $("input[name=deposit-limit-amount]").val() !== 'undefined') {
        limitAmount = $("input[name=deposit-limit-amount]").val();
    }

    if (typeof currency !== 'undefined') {
        limitCurrency = currency;
    }

    var payload = {
        "period": limitPeriod,
        "amount": limitAmount,
        "currency": limitCurrency
    }

    session.call('/user/limit#setDepositLimit', [], payload).then(function (result) {
        showSuccess();
    }, function (e) {
        console.log(e);
        c.handleError(e);
    });
}

function setWageringLimit(session) {
    var limitPeriod = "";
    var limitAmount = 0;
    var limitCurrency = "EUR";

    if (typeof $('input[name=wagering-limit-period]:checked').val() === 'undefined') {
        limitPeriod = "daily";
    } else {
        limitPeriod = $('input[name=wagering-limit-period]:checked').val();
    }

    if (typeof $("input[name=wagering-limit-amount]").val() !== 'undefined') {
        limitAmount = $("input[name=wagering-limit-amount").val();
    }

    if (typeof currency !== 'undefined') {
        limitCurrency = currency;
    }

    var payload = {
        "period": limitPeriod,
        "amount": limitAmount,
        "currency": limitCurrency
    }

    session.call('/user/limit#setWageringLimit', [], payload).then(function (result) {
        showSuccess();
    }, function (e) {
        console.log(e);
        c.handleError(e);
    });
}

function setLossLimit(session) {
    var limitPeriod = "";
    var limitAmount = 0;
    var limitCurrency = "EUR";

    if (typeof $('input[name=loss-limit-period]:checked').val() === 'undefined') {
        limitPeriod = "daily";
    } else {
        limitPeriod = $('input[name=loss-limit-period]:checked').val();
    }

    if (typeof $("input[name=loss-limit-amount]").val() !== 'undefined') {
        limitAmount = $("input[name=loss-limit-amount]").val();
    }

    if (typeof currency !== 'undefined') {
        limitCurrency = currency;
    }

    var payload = {
        "period": limitPeriod,
        "amount": limitAmount,
        "currency": limitCurrency
    }

    session.call('/user/limit#setLossLimit', [], payload).then(function (result) {
        showSuccess();
    }, function (e) {
        console.log(e);
        c.handleError(e);
    });
}

function setSessionLimit(session) {
    var minutes = 0;

    if (typeof $("input[name=session-limit-amount]").val() !== 'undefined') {
        minutes = $("input[name=session-limit-amount]").val();
    }

    var payload = {
        "minutes": minutes
    }

    session.call('/user/limit#setSessionLimit', [], payload).then(function (result) {
        showSuccess();
    }, function (e) {
        console.log(e);
        c.handleError(e);
    });
}

function setCooloff(period) {
    c.doCall(function (session) {
        session.call('/user/coolOff#enable', [], {
            "reason": "I want to restrict my playing",
            "unsatisfiedReason": null,
            "period": period
        }).then(function (response) {
            console.log(response);
        }, function (err) {
            if (error_handler) {
                error_handler(err);
            }
        });
    });
}

function submitLimit(limitType) {
    clearInputError();

    if (limitType) {
        var limitAmount = $('input[name=' + limitType + '-limit-amount]').val();

        if (limitAmount != '') {
            console.log(limitAmount);

            if (isNumbers(limitAmount)) {
                switch (limitType) {
                    case 'deposit':
                        if (base_return.deposit.updatable) {
                            c.doCall(saveDepositLimit);
                        }
                        break;

                    case 'wagering':
                        if (base_return.wagering.updatable) {
                            c.doCall(setWageringLimit);
                        }
                        break;

                    case 'loss':
                        if (base_return.loss.updatable) {
                            c.doCall(setLossLimit);
                        }
                        break;

                    case 'session':
                        if (base_return.session.updatable) {
                            c.doCall(setSessionLimit);
                        }
                        break;

                    default:
                        break;
                }

                // if ($('.CoolOffFor24Hours').is(":checked")) {
                //     console.log("Set CoolOffFor24Hours");
                //     setCooloff('CoolOffFor24Hours');
                // }
                // if ($('.CoolOffFor7Days').is(":checked")) {
                //     console.log("SetCoolOffFor7Days");
                //     setCooloff('CoolOffFor7Days');
                // }
                // if ($('.CoolOffFor30Days').is(":checked")) {
                //     console.log("SetCoolOffFor30Days");
                //     setCooloff('CoolOffFor30Days');
                // }
            }else{
                showInputError($('input[name=' + limitType + '-limit-amount]'), gettext('LANG_JS_NUMBERS_ONLY'));
            }
        }
    }
}

function removeDepositLimit(session) {
    var payload = {
        "period": base_return.deposit.current.period,
    }

    session.call('/user/limit#removeDepositLimit', [], payload).then(function (result) {
        showSuccess();
    }, function (e) {
        console.log(e);
        c.handleError(e);
    });
}

function removeWageringLimit(session) {
    session.call('/user/limit#removeWageringLimit', [], {}).then(function (result) {
        showSuccess();
    }, function (e) {
        console.log(e);
        c.handleError(e);
    });
}

function removeLossLimit(session) {
    session.call('/user/limit#removeLossLimit', [], {}).then(function (result) {
        showSuccess();
    }, function (e) {
        console.log(e);
        c.handleError(e);
    });
}

function removeSessionLimit(session) {
    session.call('/user/limit#removeSessionLimit', [], {}).then(function (result) {
        showSuccess();
    }, function (e) {
        console.log(e);
        c.handleError(e);
    });
}

function removeLimit(limitType) {
    console.log(base_return);
    if (limitType) {
        switch (limitType) {
            case 'deposit':
                if (base_return.deposit.updatable) {
                    c.doCall(removeDepositLimit);
                }
                break;

            case 'wagering':
                if (base_return.wagering.updatable) {
                    c.doCall(removeWageringLimit);
                }
                break;

            case 'loss':
                if (base_return.loss.updatable) {
                    c.doCall(removeLossLimit);
                }
                break;

            case 'session':
                if (base_return.session.updatable) {
                    c.doCall(removeSessionLimit);
                }
                break;

            default:
                break;
        }
    }
}

$(function () {
    c.doCall(getProfile);
});
