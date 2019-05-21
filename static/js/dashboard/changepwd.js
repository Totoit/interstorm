var oldpw;
var newpw;
var renewpw;
var mail;
var isCaptchaLoaded = false;

urlValidate = "/verifynewemail/?email=$ORGINAL_EMAIL$&key=";
fullUrl = window.location.href;
var verifyEmailURL = location.origin + urlValidate;
publicKey = "6LfPIgYTAAAAACEcTfYjFMr8y3GX6qYVLoK-2dML";


function onCapchaSubmit(token) {
    $('#captchaResponse').val(token);
}

function capchareset() {
    $('#captcha').show();
    $('#captchaResponse').val('');
    $('#captcha').html('<span id="myrecaptcha" data-callback="onCapchaSubmit"></span>');
    grecaptcha.reset(grecaptcha.render(document.getElementById('myrecaptcha'), {
        'sitekey': publicKey,
        'callback': onCapchaSubmit,
        'theme': 'dark'
    }));
}

function validateChangePass(pass) {
    var re = /(?=.*\d+)(?=.*[A-Za-z]+).{8,20}/;
    return re.test(pass);
}

$(document).ready(function () {
    var form = $('#dashboard_form');
    var gettext = window.gettext || function (s) {
        return s;
    }

    form.find('#current').keypress(function (e) {
        $(this).popover('hide');
    });

    form.find('#new').keypress(function (e) {
        $(this).popover('hide');
    });
  
    $("#changepass").click(function (e) {
        oldpw = form.find("#current").val();
        newpw = form.find('#new').val();
        renewpw = form.find('#renew').val();

        if (newpw != renewpw) {
            console.log('password not matching');
            swal({
                title: 'Error',
                text: 'Password not matching',
                icon: "warning",  
                button: 'OK',
                className: "warning-alert"
            });

            return false;
        }

        c.doCall(changePassword);
    });
});

// Load google reCAPTCHA
function loadCaptcha() {
    isCaptchaLoaded = true;

    $('#myrecaptcha').create(publicKey, "captcha_place_holder", {theme: "dark"});
}

function changePassword(session) {
    var form = $('#dashboard_form');
    var parameters = {
        "oldPassword": oldpw,
        "newPassword": newpw,
        "isCaptchaEnable": false,
        "captchaPublicKey": publicKey,
        "captchaChallenge": "",
        "captchaResponse": $('#captchaResponse').val()
    };
    
    // console.log(parameters);
    session.call('/user/pwd#change', [], parameters).then(function (result) {
        // console.log(result);
        if (result.kwargs.isCaptchaEnabled) {
            capchareset();
        } else {
            form.find('#changepass').removeClass('loader');
            
            swal({
                title: 'Completed',
                text: 'Password has changed',
                icon: "success",  
                buttons: true,
                className: "success-alert" 
            })
            .then((value) => {
                if (value) {
                    document.location.href = "/";
                } 
            });
        }
    }, function (err) {
        console.log(err);
        swal({
            title: 'Error',
            text: err.kwargs.desc,
            icon: "error", 
            button: 'OK',
            className: "error-alert" 
        });
        c.conn.close();
    });
}
