// var isLogin = false;
function login(session) {
    // var form = $('#login');

    //Get email
    email = $('#username').val();
    // emailrow = email.parent().parent();
    password = $('#password').val();
    // passwordrow = password.parent().parent();

    if(password === "" || email === ""){
        swal({
            title: ("Warning!"),
            text: ('Please enter username and password'),
            icon: "warning",
            button: ("OK"),
        });
        $('.loading').hide();
        return false
    }
    // bb = {
    //     blackbox: $('#iovationBlackBox').val(),
    //     finished: true
    // }
    //registrationPayload.iovationBlackBox = bb.blackbox;
    loginPayload = {
        usernameOrEmail: email,
        password: password,
        // iovationBlackBox: bb.blackbox
        //iovationBlackBox: ''
    };
    console.log("payload :", loginPayload);
    logUserIn(session, loginPayload);
    // $("#loginBtn").find('img').css("display", "none");
}

function logUserIn(session, payload) {

    session.call('/user#login', [], payload).then( //Validate credential validation
        function (result) {
            if(result.kwargs.isEmailVerified){
                if(result.kwargs.hasToSetUserConsent){
                    getConsentRequirements(session);
                    return false;
                }
                
                sessionInfo(session);
            }else{
                session.call("/user#logout", []).then(
                    function (result) {
                        swal({
                            title: ("Failed!"),
                            text: ('Please check your email to complete your registration and activate your account.'),
                            icon: "warning",
                            button: ("OK"),
                        });
                        $('.loading').hide();
                        c.conn.close();
                    }, function (err) {
                        console.log('err',err);
                        $('.loading').hide();
                    });
            }

        }, function (err) {
            console.log(err);
            var err_msg = err.kwargs.desc;
            console.log(err.kwargs.desc)
            swal({
                title: ("Failed!"),
                text: err_msg,
                icon: "warning",
                button: ("OK"),
            });
            $('.loading').hide();
            c.endCallAnimation();
        }
    );


}

function sessionInfo(session) {
    session.call("/user#getSessionInfo", []).then(
        function (result) {
            if (result.kwargs.isAuthenticated) { //User logged in, redirecting
                c.conn.close();
                window.location.reload();
            } else {
                login(session); //Tries to log user in
            }
        }
        , function (err) {
            console.log(err);
            c.conn.close();
        });
}

// function getUserGlobal(){
//     if (isLogin){
//       c.doCall(function (session) {
//           session.call("/user/account#getProfile", [], { }).then(function (result) {
//               console.log(result.kwargs)
//               $('#loginFrm').hide();
//           });
//           session.call("/user#getCmsSessionID", [], { }).then(function (result) {
//             //   setCookie('pwr_ss',result.kwargs.cmsSessionID,36500);
//             //   setFrameSport( getCookie("pwr_ss") );
//           });
//       });
//     }else{

//     }
//   }

$(function () {
    $('#loginFrm').submit(function() {
        $('.loading').show();
        // $(this).addClass('loader');
        // $(this).find('img').css("display", "block");
        c.doCall(sessionInfo);
        return false;
    })
    $('#login').click(function () {
        $('.loading').show();
        // $(this).addClass('loader');
        // $(this).find('img').css("display", "block");
        c.doCall(sessionInfo);
        return false;
    });
});