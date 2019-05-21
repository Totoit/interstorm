
/**
 * Created by MaDeaw on 2/27/2018.
 */
var payload = {};
function getCountries(session) {
    var payload = {
        "expectRegions": true,
        "excludeDenyRegistrationCountry": true
    };
    session.call("/user/account#getCountries", [], payload).then(function (response) {
        var $country = $('#m-create-country');
        var $phonePrefix = $('#m-create-phonePrefix');
        response.kwargs.countries.sort(function (o1, o2) {
            return o1.phonePrefix > o2.phonePrefix ? 1 : o1.phonePrefix < o2.phonePrefix ? -1 : 0;
        });
        $(response.kwargs.countries).each(function (index, value) {
                var $countrie = $("<option/>").attr("value", value.code).text(value.name);
                var $currencies_language = ['CAD','NOK','GBP','CNY','SEK','CHF','USD','KRW'];
                if (value.phonePrefix) {
                    var $Prefix = "";
                    if(value.code == "CA" && response.kwargs.currentIPCountry == "US"){
                        value.code = "US";
                    }
                    if(value.code == "CA" && response.kwargs.currentIPCountry == "KR"){
                        value.code = "KR";
                    }
                    if(value.code == response.kwargs.currentIPCountry){
                        if(value.code == "KR"){
                            value.phonePrefix = "+82";
                        }
                        $Prefix =  $("<option/>").attr("value", value.phonePrefix).text(value.phonePrefix).attr({"data-id": value.code,"selected":"selected"});
                        $('#m-create-currencies').val(value.currency)
                        if($('#m-create-currencies').val() === null){
                            $('#cm-reate-currencies').val('EUR')
                        }else{
                            if(response.kwargs.currentIPCountry == "US"){
                                value.currency = "USD";
                            }
                            else if(response.kwargs.currentIPCountry == "KR"){
                                value.currency = "KRW";
                            }
                            if($currencies_language.includes(value.currency)){
                                $("#m-create-currencies>option[value="+value.currency+"]").prop('selected',true);
                            }else{
                                $('#m-create-currencies>option[value="EUR"]').prop('selected',true);
                            }
                        }
                    }else{
                        $Prefix = $("<option/>").attr("value", value.phonePrefix).text(value.phonePrefix).attr("data-id", value.code);
                    }
                    $phonePrefix.append($Prefix);
                }
                $country.append($countrie);
        });
        var country_options = $('select#m-create-country option');
        var arr = country_options.map(function (_, o) {
            return { t: $(o).text(), v: o.value };
        }).get();
        arr.sort(function (o1, o2) {
            return o1.t > o2.t ? 1 : o1.t < o2.t ? -1 : 0;
        });
        country_options.each(function (i, o) {
            o.value = arr[i].v;
            $(o).text(arr[i].t);
        });
        return response
    }).then(function (response) {
        $("#m-create-country").val(response.kwargs.currentIPCountry);
        return response
    });
}
function getCurrencies(session) {
    session.call("/user/account#getCurrencies").then(function (response) {
        var $currencies = $('#m-create-currencies');
        response.kwargs.push({code: "JPY", name: "Japanese yen"});
        $(response.kwargs).each(function (index, value) {
            // console.log(index, value.code);
            var $current = '';
            var $custom_currencies = ['GBP','USD','CAD','EUR','NOK','SEK','CNY','KRW','JPY'];
            if($custom_currencies.indexOf(value.code) != -1){
                if(value.code == 'EUR'){
                    $current = $("<option/>").attr({"value":value.code,"selected":"selected"}).text(value.code);
                }else{
                    $current = $("<option/>").attr("value", value.code).text(value.code);
                }
                $currencies.append($current);
            }
        });
    });
}
function getLanguage(session) {
    session.call("/user/account#getLanguages").then(function (response) {
        // var $currencies = $('#ddlCurrency');
        var language_code = ''
        $(response.kwargs).each(function (index, value) {
            // console.log(index, value.code);
            // var $current = $("<option/>").attr("value", value.code).text(value.code);
            // $currencies.append($current);
            if(value.code == window._EM.language_code){
                language_code = window._EM.language_code;
            }
        });
        if(language_code == ''){
            language_code = changeLanguageCode(window._EM.language_code,false);
        }
        payload.language = language_code;

    });
}
function getPolicy(session, callback) {
    var payload = {
        culture: window._EM.language_code
    };
    session.call("/user/pwd#getPolicy", [], payload).then(function (response) {
        var regularExpression = response.kwargs.regularExpression;
        // console.log(response);
        $('#m-create-password').attr({
            'pattern': response.kwargs.regularExpression,
            'title': ""
        });
    });
}

function register_mobile(session) {
    var urlValidate = "/activate";
    var form = $('#create-user-mobile');

    payload.emailVerificationURL = fetchMailUrl(urlValidate);
    payload.email = form.find('#m-create-email').val();
    payload.password = form.find('#m-create-password').val();
    payload.currency = form.find('#m-ddlCurrency').val();
    payload.country = form.find('#m-create-country').val();
    payload.personalID = "";
    payload.mobilePrefix = form.find('#m-create-phonePrefix').val();
    payload.mobile = form.find('#m-create-mobile').val();
    payload.phone = "";
    payload.title = $("#m-create-sex").attr("title");
    payload.alias = "aaaaa"
    payload.firstname = form.find('#m-create-firstname').val();
    payload.lastname = form.find('#m-create-surname').val();
    payload.birthday = form.find('#m-create-birthday').val();
    payload.city = form.find('#m-create-city').val();
    payload.address1 = form.find('#m-create-address').val();
    payload.address2 = "";
    payload.postalCode = form.find('#m-create-postcode').val();
    if(payload.language == ''){
        payload.language = 'en';
    }
    payload.securityQuestion = "ucc";
    payload.securityAnswer = "ucc";
    payload.acceptNewsEmail = true;
    payload.acceptSMSOffer = true;
    payload.legalAge = true;
    payload.acceptTC = true,
    payload.gender = form.find('#m-create-sex').val();
    payload.username = form.find('#m-create-username').val();

    payload.userConsents = {
        "termsandconditions": true,
        "sms":  $("input[name='consent-email']:checked").data("value"),
        "emailmarketing":  $("input[name='consent-sms']:checked").data("value"),
        "3rdparty": false,
    };
    c.doCall(function (session) {
        registerUser(session);
    });
}

function registerUser(session) {
    console.log('payload>>>',payload);
    $('.loading').show();
    session.call('/user/account#register', [], payload).then( //Get password policy
        function (result) {
            console.log("completed");
            bb = ioGetBlackbox();
            $('.loading').hide();
            loginPayload = {
                usernameOrEmail: payload.email,
                password: payload.password,
                iovationBlackBox: bb.blackbox
                //iovationBlackBox: ''
            };
            // console.log("payload :", loginPayload);
            if (getCookie("pwr_btag") != null && getCookie("pwr_btag") != '' ){
              var _oldurlget = window.location.href;
              var _newurlget = _oldurlget.replace("btag="+getCookie("pwr_btag"), "");
              setCookie('pwr_btag','',36500);
              window.history.pushState("", "", _newurlget);
            }
            // logUserIn(session, loginPayload);
            window.location.href='/registersuccess';
        }, function (err) {
            $('.loading').hide();
            swal({
                title: gettext("LANG_JS_WARNING"),
                text: err.kwargs.desc,
                icon: "warning",
                button: gettext("LANG_JS_OK"),
            });
        }
    );
}
function validateData(payload, action) {
    console.log(payload);
    c.doCall(function (session) {
        session.call("/user/account#validate" + action, [], payload).then(function (response) {
            console.log('test',response.kwargs.isAvailable,action.toLowerCase());
            if (!response.kwargs.isAvailable) {
                document.getElementById("create-username").setCustomValidity(response.kwargs.error);
                $('div.msg').html(response.kwargs.error);
                $('#create-username').css('border-bottom','1px solid red');
                $('#msg-icon').html('<img src="/static/images/icons/red-error.png" class="vali-icon">');
                if($('#create-username').val() == ''){
                    $('div.msg').text(gettext('LANG_JS_PLEASE_ENTER_USERNAME_OR_EMAIL'));
                    $('#create-username').css('border-bottom','1px solid red');
                    $('#msg-icon').html('<img src="/static/images/icons/red-error.png" class="vali-icon">');
                }
                // //phone number
                // if($('#create-mobile').val() == ''){
                //     alert('null phone');
                //     $('#sms-error').text('Please enter your mobile number');
                //     $('#create-mobile').css('border-bottom','1px solid red');
                //     $('#phone-icon').html('<img src="/static/images/icons/red-error.png" class="vali-icon">');
                // }else{
                //     $('#sms-error').text('');
                //     $('#create-mobile').css('border-bottom','1px solid #28a745');
                //     $('#phone-icon').html('<img src="/static/images/icons/green-pass.png" class="vali-icon">');
                // }
            } else {
                // console.log('complete');
                document.getElementById("create-username").setCustomValidity('');
                    $('div.msg').html('');
                    $('#create-username').css('border-bottom','1px solid #28a745');
                    $('#msg-icon').html('<img src="/static/images/icons/green-pass.png" class="vali-icon">');
            }
        }).catch((e) => {
            // console.log('Do that',e);
            // console.log('payload.language_code',payload.culture);
            $('.msg').text(e.kwargs.desc);
            $('#create-username').css('border-bottom','1px solid red');
            $('#msg-icon').html('<img src="/static/images/icons/red-error.png" class="vali-icon">');
        });
    });
}

function validateMobile(mobile_number){
    console.log('mobile_number',mobile_number)
    $.ajax({
        type: "POST",
        url: "/api/check_mobile_number",
        data: {
            mobile_number: mobile_number
        },
        dataType: "json",
        cache: false,
    }).done(function (data) {
        // console.log(data.status);
        if (!data.status) {
            $('#sms-error').text(gettext('LANG_JS_MOBILE_ALREADY_EXITS'));
            $('#create-mobile').css('border-bottom','1px solid red');
            $('#phone-icon').html('<img src="/static/images/icons/red-error.png" class="vali-icon">');
            return false;
        }
        return true
    });
}

function changeLanguageCode(code,value_default){
    if(code == 'en-gb' || code == 'en-ca'){
        return 'en';
    }else if(code == 'zh'){
        return 'zh-cn';
    }else{
        if(value_default){
            return code
        }else{
            return 'en';

        }
    }
}

jQuery(function ($) {
    if ($('#registernewuser').length > 0) $('#registernewuser').attr('data-value', getCookie('btag'));
    var parsed_qs = parse_query_string(window.location.href);
    // console.log(parsed_qs);
    if (parsed_qs) {
        $.each(parsed_qs, function (key, value) {
            if (value != 'undefined') {
                console.log(key);
                // console.log(value);
                try {
                    // if (key != 'password'){
                    //     $('#create-' + key).val(value);
                    // }
                    if (key.indexOf('radio') > 0) {
                        var radios = document.getElementsByName(key);
                        for (var i = 0, length = radios.length; i < length; i++) {
                            //console.log(radios);
                            if (radios[i].defaultValue == value) {
                                radios[i].checked = true;
                                break;
                            }
                        }
                    } else {
                        $('#create-' + key).val(value);
                    }
                } catch (e) {

                }

            }
        });
    }
    c.doCall(function (session) {
        getCurrencies(session);
        getCountries(session);
        getPolicy(session);
        getLanguage(session)
    });
});

$("body").on('click', '#m-create-user', function() {
    // e.preventDefault();
    register_mobile();
});
