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
        var $country = $('#create-country');
        var $phonePrefix = $('#create-phonePrefix');
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
                        $('#ddlCurrency').val(value.currency)
                        if($('#ddlCurrency').val() === null){
                            $('#ddlCurrency').val('EUR')
                        }else{
                            if(response.kwargs.currentIPCountry == "US"){
                                value.currency = "USD";
                            }
                            else if(response.kwargs.currentIPCountry == "KR"){
                                value.currency = "KRW";
                            }
                            if($currencies_language.includes(value.currency)){
                                $("#ddlCurrency>option[value="+value.currency+"]").prop('selected',true);
                            }else{
                                $('#ddlCurrency>option[value="EUR"]').prop('selected',true);
                            }
                        }
                    }else{
                        $Prefix = $("<option/>").attr("value", value.phonePrefix).text(value.phonePrefix).attr("data-id", value.code);
                    }
                    $phonePrefix.append($Prefix);
                }
                $country.append($countrie);
        });
        var country_options = $('select#create-country option');
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
        $("#create-country").val(response.kwargs.currentIPCountry);
        return response
    });
}

function getCurrencies(session) {
    session.call("/user/account#getCurrencies").then(function (response) {
        var $currencies = $('#ddlCurrency');
        response.kwargs.push({code: "JPY", name: "Japanese yen"});
        $(response.kwargs).each(function (index, value) {
            // console.log(index+' :> '+ value.code);
            // var $current = '';
            // var $custom_currencies = ['GBP','USD','CAD','EUR','NOK','SEK','CNY','KRW','JPY'];
            // if($custom_currencies.indexOf(value.code) != -1){
                if(value.code == 'EUR'){
                    $current = $("<option/>").attr({"value":value.code,"selected":"selected"}).text(value.code);
                }else{
                    $current = $("<option/>").attr("value", value.code).text(value.code);
                }
                $currencies.append($current);
            // }
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
        $('#create-password').attr({
            'pattern': response.kwargs.regularExpression,
            'title': ""
        });
    });
}

function diff_years(dt1) {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1;
    var yyyy = today.getFullYear();

    if(dd < 10) {
        dd = '0'+dd;
    }
    if(mm < 10) {
        mm = '0'+mm;
    }

    today = yyyy + '-' + mm + '-' + dd;
    dt2 = new Date(today);

    var diff =(dt2.getTime() - dt1.getTime()) / 1000;
    diff /= (60 * 60 * 24);

    return Math.abs(Math.round(diff/365.25));
}

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function isNumbers(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function register(session) {
    var urlValidate = "/activate";
    var form = $('#create-user');
    // console.log('Terms and conditions', form.find('#create-termsandconditions').prop('checked'));
    payload.emailVerificationURL = fetchMailUrl(urlValidate);
    // payload.email = form.find('#create-email').val();
    payload.email = form.find('#create-email').val();
   
    payload.password = form.find('#create-password').val();
    payload.currency = form.find('#ddlCurrency').val();
    payload.country = form.find('#create-country').val();
    payload.personalID = "";
    payload.mobilePrefix = form.find('#create-phonePrefix').val();
    payload.mobile = form.find('#create-mobile').val();
    payload.phone = "";
    payload.title = form.find("#create-sex").val();
    payload.username = form.find('#create-username').val();
    payload.alias = form.find('#create-username').val();
    payload.firstname = form.find('#create-firstname').val();
    payload.lastname = form.find('#create-surname').val();
    payload.birthday = form.find('#create-birthday').val();
    payload.city = form.find('#create-city').val();
    payload.address1 = form.find('#create-address').val();
    payload.address2 = "";
    payload.postalCode = form.find('#create-postcode').val();
    if(payload.language == ''){
        payload.language = 'en';
    }
    payload.securityQuestion = form.find('#create-question').val();
    payload.securityAnswer = form.find('#create-answer').val();
    payload.acceptNewsEmail = $("input[name='consent-email']:checked").attr("value"); 
    payload.acceptSMSOffer = $("input[name='consent-sms']:checked").attr("value"); 
    payload.gender = form.find('#create-sex').val();
    payload.legalAge = true;
    payload.acceptTC = true,
    // payload.language = window._EM.language_code;
    //payload.referrerID = form.find('#ddlCurrency').val();

    payload.userConsents = {
        "termsandconditions": $("input[name='consent-term']:checked").attr("value"), 
        "sms": true,
        "emailmarketing": true,
        "3rdparty": false,
    };

    // payload.culture = window._EM.language_code;
    // console.log('userConsents!!>>>',payload.userConsents);

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
            // console.log('ERROR !!',err.kwargs.desc);
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

    $('#showPattern').hover(function () {
        $("#showPatternBox").toggle();
    });

    $('.create-next').click(function () {
        var currentStep = $(this).attr('current');
        var nextStep = parseInt(currentStep) + 1;

        var validateSTATUS = 1;
        var inputID;
        var inputVAL;
        var selectID;
        var selectVAL;
        var textERROR;
        $('.regis-txt-error').text('');

        if(currentStep == 1) {

            var emailPattern = '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$';
            if( !$('#create-email').val().match(emailPattern) ) {
                $('#create-email-error').text('Invalid email address');
                validateSTATUS = 0;
            }

            var passPattern =  $('#create-password').attr('pattern');
            if( !$('#create-password').val().match(passPattern) ) {
                $('#create-password-error, #confirm-password-error').text('Password is too simple and does not match the pattern');
                validateSTATUS = 0;
            }

            $('#create-user #create-step1 input').each(function(){
                inputID = $(this).attr('id');
                inputVAL = $(this).val();
                textERROR = $(this).attr('txt-err');
    
                if(inputVAL == "" || inputVAL == null ){
                    $('#'+inputID+'-error').text(textERROR);
                    validateSTATUS = 0;
                }
            });
            
            $('#create-user #create-step1 select').each(function(){
                selectID = $(this).attr('id');
                selectVAL = $(this).val();
                textERROR = $(this).attr('txt-err');
                
                if(selectVAL == "" || selectVAL == null){
                    $('#'+selectID+'-error').text(textERROR);
                    validateSTATUS = 0;
                }
            });

            if($('#create-password').val() != $('#confirm-password').val()){
                $('#create-password-error, #confirm-password-error').text('password is not matching');
                validateSTATUS = 0;
            }

            var TandC = $('#create-step1').find("input[name='consent-term']:checked").attr('value');
            if(!TandC){
                $('#consent-term-error').text('Terms and conditions consent must be granted');
                validateSTATUS = 0;
            } else {
                if(TandC == 'false'){
                    $('#consent-term-error').text('Yes only');
                    validateSTATUS = 0;
                }
            }

        } else {

            $('#create-user #create-step2 input').each(function(){
                inputID = $(this).attr('id');
                inputVAL = $(this).val();
                textERROR = $(this).attr('txt-err');
    
                if(inputVAL == "" || inputVAL == null ){
                    $('#'+inputID+'-error').text(textERROR);
                    validateSTATUS = 0;
                }
            });
            
            $('#create-user #create-step2 select').each(function(){
                selectID = $(this).attr('id');
                selectVAL = $(this).val();
                textERROR = $(this).attr('txt-err');
                
                if(selectVAL == "" || selectVAL == null){
                    $('#'+selectID+'-error').text(textERROR);
                    validateSTATUS = 0;
                }
            });

            $('#create-user #create-step2 .onlynumber').each(function(){
                onlynumID = $(this).attr('id');
                onlynumVAL = $(this).val();
                if( onlynumVAL != "" || onlynumVAL == null){
                    if( !isNumbers(onlynumVAL) ){
                        $('#'+onlynumID+'-error').text('numbers only');
                        validateSTATUS = 0;
                    }
                }
            });

            var birthdate = $('#create-birthday').val(); 
            dt1 = new Date(birthdate);
            if( diff_years(dt1) < 18 ){
                $('#create-birthday-error').text('your age is less than 18 years old');
                validateSTATUS = 0;
            }

        }

        // console.log('> validateSTATUS = '+validateSTATUS);
        if(validateSTATUS == 1){
            $('#create-step'+currentStep).addClass('hidden');
            $('#create-step'+nextStep).removeClass('hidden');
        }
        
    });

    $("#create-user").submit(function (e) {
        e.preventDefault();
        var validateSTATUS = 1;
        var inputID;
        var inputVAL;
        var selectID;
        var selectVAL;
        var textERROR;

        $('.regis-txt-error').text('');

        $('#create-user #create-step3 input').each(function(){
            inputID = $(this).attr('id');
            inputVAL = $(this).val();
            textERROR = $(this).attr('txt-err');

            if(inputVAL == "" || inputVAL == null ){
                $('#'+inputID+'-error').text(textERROR);
                validateSTATUS = 0;
            }
        });

        $('#create-user #create-step3 select').each(function(){
            selectID = $(this).attr('id');
            selectVAL = $(this).val();
            textERROR = $(this).attr('txt-err');

            if(selectVAL == "" || selectVAL == null){
                $('#'+selectID+'-error').text(textERROR);
                validateSTATUS = 0;
            }
        });

        if( ! $('[name="consent-email"]').is(':checked') ){
            $('#consent-email-error').text('please set your preferences for email promotions');
            validateSTATUS = 0;
        }

        if( ! $('[name="consent-sms"]').is(':checked') ){
            $('#consent-sms-error').text('please set your preferences for sms');
            validateSTATUS = 0;
        }
        console.log('> validateSTATUS = '+validateSTATUS);

        if( validateSTATUS == 1 ){
            register();
        }
    });

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

    // $("#create-username").blur(function () {
    //     if ($(this).val().length > 0) {
    //         var payload = {
    //             // 'culture': changeLanguageCode(window._EM.language_code,true),
    //             'email': $(this).val()
    //         };
    //         // validateData(payload, 'Username');
    //         // console.log('test mail',changeLanguageCode(window._EM.language_code));
    //         validateData(payload, 'Email');
    //     }
    // });
    // $("#create-mobile").blur(function () {
    //     if ($(this).val().length > 0) {
    //         validateMobile($('#create-phonePrefix').val()+$(this).val());
    //     }
    // })
});
