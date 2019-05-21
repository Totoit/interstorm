var newmail;
var pass;
publicKey = "6LfPIgYTAAAAACEcTfYjFMr8y3GX6qYVLoK-2dML";
urlValidate = "/verifynewemail/?email=$ORGINAL_EMAIL$&key=";
var verifyEmailURL = location.origin + urlValidate;

var isCaptchaLoaded = false;

function onCapchaSubmit(token) {
    $('#captchaResponse').val(token);
}
function capchareset() {
    $('#captchaResponse').val('');
    $('#captcha').html('<span id="myrecaptcha" data-callback="onCapchaSubmit"></span>');
    grecaptcha.reset(grecaptcha.render(document.getElementById('myrecaptcha'), {
        'sitekey': publicKey,
        'callback': onCapchaSubmit,
        'theme': 'dark'
    }));
}
function validateChangePass2(pass) {
    var re = /(?=.*\d+)(?=.*[A-Za-z]+).{8,20}/;
    return re.test(pass);
}
function validateChangeEmail(eemail) {
    var ree = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return ree.test(eemail);
}
// Getting verification code
function getQueryString(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var parameters =
{
    verificationCode: getQueryString('key') // read the key from url
};

$(document).ready(function () {
    // $("#change_mail").on("submit", function () {
    //     c.doCall(sendVerificationEmailToNewMailbox);
    // });
    $("#change_mail_submit").click(function () {
        c.doCall(sendVerificationEmailToNewMailbox);
    });
});
function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
// load google reCAPTCHA
function loadCaptcha() {
    isCaptchaLoaded = true;
    Recaptcha.create(publicKey, "captcha_place_holder", { theme: "dark" });
}

function sendVerificationEmailToNewMailbox(session) {

    if (!validateEmail($('#email_change').val())) {
        if($('#email_change').val() == ""){
            swal({
                title: gettext("LANG_JS_WARNING"),
                text: gettext("LANG_JS_EMAIL_ADDRESS_CANNOT_BE_EMPTY"),
                icon: "warning",
                button: gettext("LANG_JS_OK"),
            });
        }else{
            swal({
                title: gettext("LANG_JS_WARNING"),
                text: gettext("LANG_JS_INVALID_EMAIL_FORMAT"),
                icon: "warning",
                button: gettext("LANG_JS_OK"),
            });
        }
        return false;
    }

    var parameters = {
        "culture": window._EM.language_code,
        "email": $('#email_change').val(),
        "password": $('#password_change').val(),
        "emailVerificationURL": verifyEmailURL,
        "captchaPublicKey": publicKey,
        "captchaChallenge": "",
        "captchaResponse": $('#captchaResponse').val()
    };

    if (isCaptchaLoaded) {
        parameters.captchaPublicKey = publicKey,
            parameters.captchaChallenge = Recaptcha.get_challenge(),
            parameters.captchaResponse = Recaptcha.get_response()
    }

    console.log('param',parameters);
    session.call("/user/email#sendVerificationEmailToNewMailbox", [], parameters).then(
        function (result) {
            if (result) { // succeed
                swal({
                    title: gettext("LANG_COMPLETED"),
                    text: gettext("LANG_PLEASE_VERIFY_YOUR_EMAIL"),
                    icon: "success",
                    buttons: { accept: gettext("LANG_JS_OK"), },
                },
                function(value){
                        if (value) {
                            window.location = window.location.origin;
                        }
                });
            } else { // chaptcha test is required
                loadCaptcha();
            }
            capchareset();
        }
        , function (err) {
            console.log(err);
            swal({
                title: gettext("LANG_JS_WARNING"),
                text: err.kwargs.desc,
                icon: "warning",
                button: gettext("LANG_JS_OK"),
            });
            capchareset();
        }
    );


    // call Recaptcha.reload() after you submit a reCAPTCHA, as challenges cannot be attempted multiple times.
    if (isCaptchaLoaded) Recaptcha.reload();
};
