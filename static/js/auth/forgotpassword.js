//  var publicKey = "6LcJ7e4SAAAAAOaigpBV8fDtQlWIDrRPNFHjQRqn";
var publicKey = "6LfPIgYTAAAAACEcTfYjFMr8y3GX6qYVLoK-2dML";
var gettext = window.gettext || function (s) { return s; };

function AlertErrorCap() {
    var ask = window.confirm("Are you sure you want to delete this post?");
    if (ask) {
        window.alert("This post was successfully deleted.");
        document.location.href = "window-location.html";
    }
}
function validateEmail(email) {
    console.log(email);
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function checkUpper(strings){

    // var i=0;
    // var character='';
    // var result = false;
    // while (i <= strings.length){
    //     character = strings.charAt(i);
    //     if (!isNaN(character * 1)){
    //         alert('character is numeric');
    //     }else{
    //         if(result != true)
    //             if (character == character.toUpperCase()) {
    //                 result = true;
    //             }
    //         else{
    //             result = true;
    //         }
    //     }
    // }
    // return result;
    result = true;
}


$(function () {
    $('#submit_forgot').on('click', function () {
        // alert($('.g-recaptcha').val());

        if (!validateEmail($('#email_forgot').val())) {
            if($('#email_forgot').val() == ""){
                swal({
                    title: gettext("LANG_JS_WARNING"),
                    text: gettext("LANG_JS_EMAIL_ADDRESS_CANNOT_BE_EMPTY"),
                    icon: "warning",
                    button: gettext("LANG_JS_OK"),
                    className: "warning-alert"
                });
            }else{
                swal({
                    title: gettext("LANG_JS_SUCCESS"),
                    text: gettext("LANG_JS_INVALID_EMAIL_FORMAT"),
                    icon: "success",
                    button: gettext("LANG_JS_OK"),
                    className: "warning-success"
                });
            }
            return false;
        }
        c.doCall(resetPwd);
        return false;
    });

    $('#forgot-pass-page').on('click', function () {
        // alert($('.g-recaptcha').val());

        if (!validateEmail($('#forgot-pass').find('#email_forgot').val())) {
            if(('#forgot-pass').find('#email_forgot').val() == ""){
                swal({
                    title: gettext("LANG_JS_WARNING"),
                    text: gettext("LANG_JS_EMAIL_ADDRESS_CANNOT_BE_EMPTY"),
                    icon: "warning",
                    button: gettext("LANG_JS_OK"),
                    className: "warning-alert"
                });
            }else{
                swal({
                    title: gettext("LANG_JS_SUCCESS"),
                    text: gettext("LANG_JS_INVALID_EMAIL_FORMAT"),
                    icon: "success",
                    button: gettext("LANG_JS_OK"),
                    className: "warning-success"
                });
            }
            return false;
        }
        c.doCall(resetPwdPage);
        return false;
    });

    $('#reset_password').on('click', function () {
        c.doCall(reset_confirmPwd);
        return false;
        // RPC call "/user/pwd#reset".  parameters = {
        //     "key": "280ecefb-eb7a-4b65-afa8-98c99ea3d119",
        //     "password": "TThejiw03."
        // }
    });
    // $('#submit_change').on('click', function () {
    //     c.doCall(changePwd);
    //     return false;
    // });


    function changePwd(session) {
        var url = fetchMailUrl();
        console.log("session", session);
        // key=0afa433c-68e7-4d13-9e9e-33dc0ce711fd
        var parameters = {};
        var url_string = window.location.href;
        // console.log(url_string);
        var url = new URL(url_string);
        var redirect = window.location.origin;
        parameters.oldPassword = $('#old_password').val();
        parameters.newPassword = $('#new_password').val();
        // RPC call "/user/pwd#change". parameters = {
        //     "oldPassword": "Haha1303.",
        //     "newPassword": "Thejiw03."
        // }
        if (new_password == parameters.password) {
            session.call("/user/pwd#change", [], parameters).then(function (result) {
                swal("Hello world!");
                setTimeout(function () {
                    window.location = redirect;
                }, 1000);
            }, function (e) {
                console.log(e);
                swal({
                    title: gettext("LANG_JS_WARNING"),
                    text: e.kwargs.desc,
                    icon: "warning",
                    button: gettext("LANG_JS_OK"),
                });
                c.endCallAnimation();
            });
        } else {
            alert(gettext("LANG_JS_PASSWORD_NOT_MATCHING"));
        }
    }


    function reset_confirmPwd(session) {
        var url = fetchMailUrl();
        console.log("session", session);
        // key=0afa433c-68e7-4d13-9e9e-33dc0ce711fd
        var parameters = {};
        var url_string = window.location.href;
        // console.log(url_string);
        var url = new URL(url_string);
        var new_password = $('#new_password').val();
        var redirect = window.location.origin;
        parameters.key = url.searchParams.get("key");
        parameters.password = $('#confirm_password').val();
        console.log(parameters);
        // RPC call "/user/pwd#reset".  parameters = {
        //     "key": "280ecefb-eb7a-4b65-afa8-98c99ea3d119",
        //     "password": "TThejiw03."
        // }
        if (new_password == parameters.password) {
            var format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
            if(new_password.length < 7){
                swal({
                    title: 'Validation',
                    text: 'Password must have 7 character',
                    icon: "warning",
                    button: "OK",
                    className: "warning-alert"
                });
                return false;
            }else if(new_password == new_password.toLowerCase()){
                swal({
                    title: 'Validation',
                    text: 'Password must have uppercase',
                    icon: "warning",
                    button: 'OK',
                    className: "warning-alert"
                });
                return false;
            }else if(!format.test(new_password)){
                swal({
                    title: 'Validation',
                    text:'Password must have special',
                    icon: "warning",
                    button: gettext("LANG_JS_OK"),
                    className: "warning-alert"
                });
                return false;
            }

            session.call("/user/pwd#reset", [], parameters).then(function (result) {
                console.log('RESET result !',result);
                swal({
                    title: 'Completed',
                    text: 'Password has changed',
                    icon: "success",  
                    buttons: true,
                    className: "success-alert" 
                })
                .then((value) => {
                    if (value) {
                        window.location = redirect; 
                    } 
                });
            }, function (e) {
                console.log('RESET ERROR !',e.kwargs.desc);
                swal({
                    title: 'Error',
                    text: e.kwargs.desc,
                    icon: "error", 
                    button: 'OK',
                    className: "error-alert" 
                });

                c.endCallAnimation();
            });
        } else {
            swal({
                title: 'Validation',
                text: 'Password not matching',
                icon: "warning",
                button: 'OK',
                className: "warning-alert" 
            });
        }
    }

    function resetPwdPage(session) {
        var url = fetchMailUrl();
        var parameters = {};
        urlValidate = "reset";
        fullUrl = window.location.href;

        var url_string = window.location.origin;
        // console.log(url_string);
        url = new URL(url_string);

        if (fullUrl.indexOf("/en") > 0) {
            urlValidate = "en/reset";
        } else if (fullUrl.indexOf("/da") > 0) {
            urlValidate = "da/reset";
        } else {
            urlValidate = "reset";
        }

        parameters.changePwdURL = fetchMailUrl(urlValidate);
        parameters.email = $('#forgot-pass').find('#email_forgot').val();
        parameters.captchaPublicKey = publicKey;
        parameters.captchaResponse = grecaptcha.getResponse();
        parameters.captchaChallenge = "";
        session.call("/user/pwd#sendResetPwdEmail", [], parameters).then(function (result) {
            swal({
                title: 'Sent reset password?',
                text: 'Please check email when your click ok',
                icon: "warning",  
                buttons: true
            })
            .then((value) => {
                if (value) {
                    document.location.href = "/";
                } 
            });
        }, function (e) {
            swal({
                title: 'Error',
                text: e.kwargs.desc,
                icon: "error",  
                button: 'OK',
                className: "error-alert" 
            });
            grecaptcha.reset();
            c.endCallAnimation();
        });

    }

    function resetPwd(session) {
        var url = fetchMailUrl();
        var parameters = {};
        urlValidate = "reset";
        fullUrl = window.location.href;

        var url_string = window.location.origin;
        // console.log(url_string);
        url = new URL(url_string);

        if (fullUrl.indexOf("/en") > 0) {
            urlValidate = "en/reset";
        } else if (fullUrl.indexOf("/da") > 0) {
            urlValidate = "da/reset";
        } else {
            urlValidate = "reset";
        }

        parameters.changePwdURL = fetchMailUrl(urlValidate);
        parameters.email = $('#email_forgot').val();
        parameters.captchaPublicKey = publicKey;
        parameters.captchaResponse = grecaptcha.getResponse();
        parameters.captchaChallenge = "";
        session.call("/user/pwd#sendResetPwdEmail", [], parameters).then(function (result) {
            swal({
                title: 'Sent reset password?',
                text: 'Please check email when your click ok',
                icon: "warning",  
                buttons: true
            })
            .then((value) => {
                if (value) {
                    document.location.href = "/";
                } 
            });
        }, function (e) {
            swal({
                title: 'Error',
                text: e.kwargs.desc,
                icon: "error",  
                button: 'OK',
                className: "error-alert" 
            });
            grecaptcha.reset();
            c.endCallAnimation();
        });

    }

    $('#forgotpwd').click(function () {
        console.log('clicky');
        //resetPwd();
        c.doCallAnimation(resetPwd);

        return false;
    });
});

//$(document).ready(function() {

function onloadCallback() {
    //willyModal.alert(publicKey);
    grecaptcha.render('captcha_place_holder', { 'sitekey': publicKey, 'theme': 'light' });
    // willyModal.alert(publicKey);
}
 //});
