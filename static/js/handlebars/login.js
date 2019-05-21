var sub = null;
var loginPayload = null;
var nemIDPayload = {};
var password = "";
var pid = "";
var action = "Login";
var cpr = '';
const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
var registrationPayload = [];
var email = "";
var userID = "";
var loginfirst = false;
var userConsentsPopup = {};
var checkConsents = 0;
function _registerUser(session) {
    // console.log(session);
    session.call('/user/account#register', [], registrationPayload).then( //Get password policy
        function (result) {

        }, function (err) {
            console.log(registrationPayload);
            console.log(err);
            console.log("err");
            /*           setTimeout(function () {
             window.location = $('#login').attr("data-href");
             }, 2000);*/
            c.endCallAnimation();
        }
    );
}
function addLoginEntry(session) {

    var form = $('#login');
    password = form.find('#password').val();

    var payload = {
        "referrerID": pid,
        "password": password
    };
    session.call('/user/externalAuth#addLoginEntry', [], payload).then( //Validate credential validation
        function (isCaptchaEnabled) {
            if (isCaptchaEnabled) {
                console.log("Succes");
                if ($('.form-login#profile').length > 0) {
                    $('.form-login#profile').addClass('hidden');
                    $('.form-login#success').removeClass('hidden');
                } else {
                    var _txt = $(".success").html();
                    setTimeout(function () {
                        window.location = $('#login').attr("data-href");
                    }, 7000);
                }
            } else {
                sessionInfo(session);
            }

        }, function (err) {
            console.log(err);

            /*           setTimeout(function () {
             window.location = $('#login').attr("data-href");
             }, 2000);*/
        }
    );

}
function loginNemID(session) {

    var params = {
        action: action,	//String
        authParty: 'NemID',	//String
        usernameOrEmail: email
    };

    session.call('/user/externalAuth#getRedirectionForm', [], params).then( //Validate credential validation
        function (result) {
            subscribeExternalAuth(session);
            if (loginfirst == true) {
                $('#login .hidden-form').html(result.kwargs.redirectionForm);
                $('#login .hidden-form form').attr('target', "nemID");
                $('#login .hidden-form form').submit();
                $('.iframe-container').addClass('loaded');
                pid = result.kwargs.referrerID;
                console.log("login referrerID :", pid);
                loginfirst = false;
            } else {
                pid = "";
                $('.iframe-container').removeClass('loaded');
                $('#login .hidden-form').html(result.kwargs.redirectionForm);
                $('#login .hidden-form form').attr('target', "nemIDverify");
                $('#login .hidden-form form').submit();
                $('.iframe-container-verify').addClass('loaded');
                pid = result.kwargs.referrerID;
                console.log("verify referrerID :", pid);
            }
        }, function (err) {
            console.log();
            if (err.kwargs.desc === "You are already logged-in.") {//No status codes using string in flow to determine error
                /*setTimeout(function () {
                 window.location = $('#login').attr("data-href");
                 }, 1000);*/
            }
        }
    );

}

function closeConnection() {
    console.log("Close connection called");
    sub.unsubscribe().then(
        function (gone) {
            //loginUserNemID(c.conn.session);
            c.doCall(loginUserNemID);

            // successfully unsubscribed sub1
            //c.conn.close()
            console.log('conn closed');
        },
        function (error) {
            console.log(error);
            // unsubscribe failed
        }
    );
    //c.conn.close();
    //c.doCall(registerUser);
    //console.log(session);
}


function onEvent(args, kwargs, details, subscription) {
    //console.log("Event received ", args, kwargs, details);
    console.log(sub);
    console.log(kwargs);
    console.log(details);
    console.log(args);
    console.log(kwargs.status);
    if (kwargs.status == "error") {
        $('#externalAuth').modal('hide');
        //location.reload();
        setTimeout(function () {
            location.reload();
        }, 5000);

    } else if (kwargs.status == "register") { //Validation succes registers the user

        $('#externalAuth').modal('hide');
        sub.unsubscribe().then(
            function (gone) {
                registrationPayload.referrerID = kwargs.referrerID;
                registrationPayload.country = 'DK';
                registrationPayload.email = email;
                _registerUser(c.conn.session);
            }, function (error) {
                console.log(error);
            }
        );
    } else if (kwargs.status == "login") {

        $('#externalAuth').modal('hide');
        console.log(kwargs.referrerID);
        nemIDPayload.referrerID = kwargs.referrerID;
        console.log(nemIDPayload);
        closeConnection();

    } else if (kwargs.status == "associate") {

        $('#externalAuth').modal('hide');
        sub.unsubscribe().then(
            function (gone) {
                $(".nemid-wrapper").addClass("hidden");
                $(".accept-password").removeClass("hidden");
                // c.doCall(addLoginEntry);
                // console.log('conn closed');
            },
            function (error) {
                console.log(error);
            }
        );
    } else {
        /*var url = $('.links.hidden #_home-url').attr("href");
         window.location = url;*/

        /*if (c.language == 'en') {
         window.location = "/en/_home";
         } else {
         window.location = "/da/hjem";
         }*/
    }

}

function subscribeExternalAuth(session) {
    session.subscribe('/externalAuth/statusChanged', onEvent).then( //Validate credential validation
        function (subscribtion) {
            sub = subscribtion;
            console.log("subscribtion success :", sub);
        }, function (err) {
            console.log(err);
        });
}

//Checks if user is already logged in
function sessionInfo(session) {
    session.call("/user#getSessionInfo", []).then(
        function (result) {
            if (result.kwargs.isAuthenticated) { //User logged in, redirecting
                c.conn.close();
                var returnuser = {
                    'username': result.kwargs.username,
                    'firstname': result.kwargs.firstname
                };
                localStorage.setItem("returning-user", JSON.stringify(returnuser));
                result.kwargs.mobile = _telephone
                calllogin(result.kwargs, function (rea) {
                    // loadpage()
                    // console.log('res',rea);
                    // redirect(result);
                    if ($('.mobile-email-input-check').length > 0) {
                        window.location.href = "/";//mobile login
                    } else {
                        window.location.reload();
                    }
                });
            } else {
                // $('#login').loading('stop');
                // alert('a')
                login(session); //Tries to log user in
            }
        }
        , function (err) {
            console.log(err);
            c.conn.close();
        });
}

function sessionPopupInfo(session) {
    session.call("/user#getSessionInfo", []).then(
        function (result) {
            if (result.kwargs.isAuthenticated) { //User logged in, redirecting
                c.conn.close();
                var returnuser = {
                    'username': result.kwargs.username,
                    'firstname': result.kwargs.firstname
                };
                localStorage.setItem("returning-user", JSON.stringify(returnuser));
                result.kwargs.mobile = _telephone
                calllogin(result.kwargs, function (rea) {
                    // loadpage()
                    // console.log('res',result);
                    // redirect(result);
                    window.location.reload();
                });

            } else {
                // $('#login').loading('stop');
                loginPopup(session); //Tries to log user in
            }
        }
        , function (err) {
            console.log(err);
            c.conn.close();
        });
}

function redirect(result) {
    if (result.kwargs.isProfileIncomplete) {
        redirect = $('#login').attr("data-href") + '?profile=incomplete';
    } else {
        redirect = $('#login').attr("data-href");
    }
    window.location = redirect;
}

function login(session) {

    console.log('$(window).width() !! == '+$(window).width());

    if( $(window).width() < 576 ){
        form = $('#loginModal');
    } else {
        form = $('#login');
    }

    console.log('form ID === '+form.attr('id'));

    //Get email
    email = form.find('#email');
    emailrow = email.parent().parent();
    password = form.find('#password');
    passwordrow = password.parent().parent();
    //Make sure email is not empty
    // if (email.val() === "") {
    //     if ($('.mobile-container').length <= 0) {
    //         emailrow.popover({content: gettext("Du mangler at udfylde et felt")});
    //         emailrow.popover('show');
    //     }
    //     $('#email').parents('.form-group').addClass('error');
    //     $('#email').next('p').text(gettext("Du mangler at udfylde et felt"));
    //     $("#loginBtn").find('img').css("display", "none");
    //     return false;
    // } else {
    //     emailrow.popover('hide');
    //     $('#email').parents('.form-group').removeClass('error');
    // }

    // //Get password
    // // password = form.find('#password');
    // // passwordrow = password.parent().parent();

    // //Make sure password is not empty
    // if (password.val() === "") {
    //     if ($('.mobile-container').length <= 0) {
    //         passwordrow.popover({content: gettext("Du mangler at udfylde et felt")});
    //         passwordrow.popover('show');
    //     }
    //     $('#password').parents('.form-group').addClass('error');
    //     $('#password').next('p').text(gettext("Du mangler at udfylde et felt"));
    //     $("#loginBtn").find('img').css("display", "none");
    //     return false;
    // } else {
    //     passwordrow.popover('hide');
    //     $('#password').parents('.form-group').removeClass('error');
    // }

    if (password.val() === "" || email.val() === "") {
        swal({
            title: gettext("LANG_JS_WARNING"),
            text: gettext('LANG_JS_PLEASE_ENTER_USERNAME_AND_PASSWORD'),
            icon: "warning",
            button: gettext("LANG_JS_OK"),
        });
        $('.loading').hide();
        return false
    }
    bb = ioGetBlackbox();
    //registrationPayload.iovationBlackBox = bb.blackbox;
    loginPayload = {
        usernameOrEmail: email.val(),
        password: password.val(),
        iovationBlackBox: bb.blackbox
        //iovationBlackBox: ''
    };
    console.log("payload :", loginPayload);
    logUserIn(session, loginPayload);
    $("#loginBtn").find('img').css("display", "none");
}

function loginPopup(session) {
    var form = $('#loginPopup');

    //Get email
    email = form.find('#email_popup');
    emailrow = email.parent().parent();
    password = form.find('#password_popup');
    passwordrow = password.parent().parent();

    if (password.val() === "" || email.val() === "") {
        swal({
            title: gettext("LANG_JS_WARNING"),
            text: gettext('LANG_JS_PLEASE_ENTER_USERNAME_AND_PASSWORD'),
            icon: "warning",
            button: gettext("LANG_JS_OK"),
        });
        $('.loading').hide();
        return false
    }

    bb = ioGetBlackbox();
    //registrationPayload.iovationBlackBox = bb.blackbox;
    loginPayload = {
        usernameOrEmail: email.val(),
        password: password.val(),
        iovationBlackBox: bb.blackbox
        //iovationBlackBox: ''
    };
    // console.log("payload :", loginPayload);
    logUserIn(session, loginPayload);
    // $("#loginBtn").find('img').css("display", "none");
}

function logUserIn(session, payload) {

    session.call('/user#login', [], payload).then( //Validate credential validation
        function (result) {
            // console.log('login',result);

            if (result.kwargs.isEmailVerified) {
                if (result.kwargs.hasToSetUserConsent) {
                    getConsentRequirements(session);
                    return false;
                }

                //c.conn.close();
                //redirect(result);
                // var obj = result.kwargs.roles.filter(function (obj) {
                //     return obj === 'NemID Not Provided';
                // })[0];
                // if (obj === undefined) {
                //     localStorage.setItem("NemID", true);
                //     nemidshowlable = true;
                //     localStorage.setItem("remainDay", 0);
                // } else {
                //     if (obj.length > 0) {
                //         localStorage.setItem("NemID", false);
                //         var one_day = 1000 * 60 * 60 * 24;
                //         var timelogin = Date.parse(result.kwargs.lastLoginTime);
                //         var timereg = Date.parse(result.kwargs.registrationTime);
                //         var timeremain = (timelogin - timereg) / one_day;
                //         var remainDay = Number(30) - Math.ceil(timeremain);
                //         console.log("remainDay :", remainDay);
                //         if (isNaN(remainDay)) remainDay = 30;
                //         //alert("");
                //         localStorage.setItem("remainDay", remainDay);

                //         if (timeremain > 30) {
                //             logoutBeforeLogin(session);
                //         }
                //     } else {
                //         localStorage.setItem("NemID", true);

                //     }
                //     if (result.kwargs.majorChangeInTC == "true") {
                //         console.log("Major change in TC")
                //     }
                // }
                sessionInfo(session);
            } else {
                session.call("/user#logout", []).then(
                    function (result) {
                        swal({
                            title: gettext("LANG_JS_FAILED"),
                            text: gettext('LANG_JS_PLEASE_CHECK_YOUR_EMAIL_TO_COMPLETE'),
                            icon: "warning",
                            button: gettext("LANG_JS_OK"),
                        });
                        $('.loading').hide();
                        c.conn.close();
                    }, function (err) {
                        console.log('err', err);
                        $('.loading').hide();
                    });
            }



        }, function (err) {
            console.log(err);
            var err_msg = err.kwargs.desc;
            console.log(err.kwargs.desc)


            if (err_msg.indexOf("You are not allowed to login because you are from a restricted country. If you have any problem, please contact support.") != -1) {
                err_msg = gettext('LANG_JS_YOU_ARE_NOT_ALLOWED_TO_LOGIN');
            } else {
                if (err_msg.indexOf("contact support") != -1) {
                    err_msg.replace("contact support", "contact support on live chat or send email to support@uniclubcasino.com");
                }
            }
            swal({
                title: gettext("LANG_JS_FAILED"),
                text: err_msg,
                icon: "warning",
                button: gettext("LANG_JS_OK"),
                button: gettext("LANG_JS_OK"),
            });
            $('.loading').hide();
            // $('#loginBtnPopup').loading('stop');
            // $('.form-row.email').popover({content: err.kwargs.desc});
            // $('.form-row.email').popover('show');
            // if ($('._home-mobile').length) {
            //     var error_text = err.kwargs.desc;
            //     $('.text-error').text(gettext(error_text));
            //     $('#modalerror').modal('show');
            // }
            c.endCallAnimation();
        }
    );


}

function loginUserNemID(session) {
    // console.log(session);
    session.call('/user#login', [], nemIDPayload).then( //Get password policy


        function (result) {
            // console.log('login',result);
            redirect(result);


            //
        }, function (err) {
            console.log(err);
            c.endCallAnimation();
        }
    );

}
/*
 function validateUsername() {
 var username =
 session.call('/user/account#validateUsername', [], {username: }).then(

 )
 }*/
function extar_register() {
    var country = "DK";
    var form = $('#login');
    email = form.find('#email').val();
    cpr = "";
    action = "login";
}

function _verifyEmail(session) {
    if (!c.conn.isConnected) {
        c.conn.open();
    }
    console.log("email :", email);

    session.call('/user/account#validateEmail', [], { email: email }).then( //Validate credential validation
        function (result) {

            if (!result.kwargs.isAvailable) { //Credential is validated

                extar_register();
                $('.iframe-container').addClass('hidden');
                $('.iframe-container-verify').removeClass('hidden');
                c.doCall(loginNemID);
                $('.nemid-verify').addClass("hidden");
                $('#showverify').addClass("hidden");
                $('.nemid-wrapper').removeClass("hidden");
                $('#externalAuth').removeClass("hidden");
            } else {
                $('.form-row.email').attr('data-content', gettext("LANG_JS_KUN_VED_MOBIL"));
                //$('.form-row.email').popover({content: gettext("You forgot to write your email address")});
                $('.form-row.email').popover('show');
                $('#verifyBtn').removeClass('loader');
                $('#verifyBtn').removeClass("disabled");
            }

        }, function (err) {
            $('.form-row.email').attr('data-content', gettext("LANG_JS_KUN_VED_MOBIL"));
            //$('.form-row.email').popover({content: gettext("You forgot to write your email address")});
            $('.form-row.email').popover('show');
            console.log(err);
            $('#verifyBtn').removeClass('loader');
            $('#verifyBtn').removeClass('disabled');
            c.endCallAnimation();
        }
    );

}

$(function () {
    //Normal login flow
    if (window._EM.language_code != 'da') {
        $('#loginBtn , #loginModal .login').click(function () {
            // return false;
            $('.loading').show();
            $(this).addClass('loader');
            $(this).find('img').css("display", "block");
            c.doCall(sessionInfo);

            return false;
        });

        $('#email , #email_popup , #password , #password_popup').keyup(function (e) {
            if (e.keyCode == 13) {
                $('.loading').show();
                c.doCall(sessionInfo);
                return false;
            }
        });

        $('#loginBtnPopup').click(function () {
            $('.loading').show();

            setTimeout(() => {
                c.doCall(sessionPopupInfo);
            }, 300);

            return false;
        });
    } else {
        c.doCall(loginNemID);
    }

    $('#loginBtnMobile').click(function () {
        $('#loginModal').toggleClass('active');
    });

    $('#balanceBtnMobile').click(function () {
        $('#balanceModal').toggleClass('active');
    });

    $('#registerModal').on('show.bs.modal', function () {
        $('#loginModal').modal('hide');
        if (getCookie("pwr_btag") != null && getCookie("pwr_btag") != '') {
            $('#affiliateMarker').val(getCookie("pwr_btag"));
        }
    });

    $("#linkverify").click(function () {
        if (c.conn.isConnected) {
            c.conn.close();
        }
        $(".nemid-wrapper").addClass("hidden");
        $(".nemid-verify").removeClass("hidden");
    });

    $('#verifyBtn').click(function () {
        var form = $('#login');
        email = form.find('#email').val();
        $(this).addClass('loader');
        $(this).addClass("disabled");
        c.doCall(_verifyEmail);
    });

    $('#verifypass').click(function () {
        c.doCall(addLoginEntry);
    });

    $('#submitconsent').click(function () {
        var obj = {}
        var check_error = 0;

        $('form#consentPopup input[type=checkbox]').each(function () {
            if (($(this).attr('data-accept') == 'true') && ($(this).prop('checked') === false)) {
                $('#' + $(this).attr('name') + '-error').html($(this).attr('name') + ' ' + gettext('LANG_JS_CONSENT_MUST_BE_GRANTED'));
                check_error++;
            } else {
                $('#' + $(this).attr('name') + '-error').html('');
            }
            obj[$(this).attr('name')] = $(this).prop('checked');
        })
        if (check_error == 0) {
            userConsentsPopup['userConsents'] = obj;
            c.doCall(setUserConsents);
        }

    });

    $('#consentModal').on('hidden.bs.modal', function () {
        if (checkConsents == 1) {
            location.reload();
        }

        if (checkConsents == 0) {
            c.doCall(logoutOfConsent);
        }
    });

    window.onresize = function (event) {
        $('#loginModal').removeClass('active');
    }
});

function deleteAllCookies() {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}

function getConsentRequirements(session) {
    // c.doCall(function(session){
    // var params = [
    //     {
    //         "code": "termsandconditions",
    //         "mustAccept": true,
    //         "type": 1,
    //         "title": "termsandconditions",
    //         "description": "Needed to prove user accepted terms and conditions"
    //     },
    //     {
    //         "code": "emailmarketing",
    //         "mustAccept": false,
    //         "type": 2,
    //         "title": "emailmarketing",
    //         "description": "Needed to prove email marketing consent"
    //     },
    //     {
    //         "code": "sms",
    //         "mustAccept": false,
    //         "type": 2,
    //         "title": "sms",
    //         "description": "Needed to prove sms marketing consent"
    //     },
    //     {
    //         "code": "3rdparty",
    //         "mustAccept": false,
    //         "type": 2,
    //         "title": "3rdparty",
    //         "description": "Needed to prove 3rd party marketing consent"
    //     }
    // ]
    // showUserConsent(params);
    session.call('/user/account#getConsentRequirements', [], { action: 2 }).then(
        function (result) {
            // console.log('res',result);
            // if(!result.kwargs.mandatory){
            //     setUserConsents(session);
            // }
            showUserConsent(result.kwargs)
        }, function (err) {
            swal({
                title: gettext("LANG_JS_FAILED"),
                text: err.kwargs.desc,
                icon: "warning",
                button: gettext("LANG_JS_OK"),
            });
            $('.loading').hide();
            c.endCallAnimation();
        }
    );
    // })
}

function setUserConsents(session) {
    session.call('/user#setUserConsents', [], userConsentsPopup).then(
        function (result) {
            checkConsents = 1;
            $('#consentModal').modal('hide');
        }, function (err) {
            console.log('err', err)
            swal({
                title: gettext("LANG_JS_FAILED"),
                text: err.kwargs.desc,
                icon: "warning",
                button: gettext("LANG_JS_OK"),
            });
            $('.loading').hide();
            c.endCallAnimation();
        }
    );
}

function showUserConsent(data) {
    value = data;
    if (value != null) {
        var template_base = '';
        template_base = '/static/handlebars/dashboard/user_consent.hbs';
        $.get(template_base, function (html) {
            var Template = Handlebars.compile(html);
            var template_hook = function (res) {
                return { consent: res };
            };
            var content = template_hook(value);
            Handlebars.registerHelper('inputselect', function (conditional, options) {
                if (conditional !== undefined && conditional != "") {
                    return options.fn(this);
                } else {
                    return options.inverse(this);
                }
            });
            Handlebars.registerHelper('trans', function (title) {
                var t = gettext(title);
                return t;
            });
            Handlebars.registerHelper('ifvalue', function (conditional, options) {
                if (options.hash.value === conditional) {
                    return options.fn(this)
                } else {
                    return options.inverse(this);
                }
            });
            var HTML = Template(content);

            $("#consents_popup_row").html(HTML);

            $('#consentModal').modal({
                show: true,
                backdrop: 'static'
            });
            $('#submitconsent').show();

            $('.loading').hide();

        });
    }

}

function logoutOfConsent(session) {
    session.call("/user#logout", []).then(
        function (result) {
            location.reload();
        }, function (err) {
            console.log('err', err);
            $('.loading').hide();
        });
}
