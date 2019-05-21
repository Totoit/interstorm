function logMeOut() {
    gettext = window.gettext || function (s) { return s; };
    $('.loading').show();
    c.doCall(logUserOut);
}

function logUserOut(session) {
    try {
        session.call("/user#logout", []).then(
            function (result) {
                c.conn.close();
                console.log('logout:',result);
                // calllogout(function (res) {
                //     if (res.result) {
                //         $('.loading').hide();
                //         // 
                //         var userAgent = navigator.userAgent || navigator.vendor || window.opera;
                //         if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || userAgent.match(/iPod/i) || userAgent.match(/Android/i)) {
                //            $('body').html('');
                //            window.location.href = "/login";
                //         }
                //     }
                // });
                $('.loading').hide();
                var userAgent = navigator.userAgent || navigator.vendor || window.opera;
                if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || userAgent.match(/iPod/i) || userAgent.match(/Android/i)) {
                    $('body').html('');
                    window.location.href = "/login";
                }else{
                    location.reload();
                }
            }, function (err) {
                $('.loading').hide();
                swal({
                    title: gettext("LANG_JS_WARNING"),
                    text: err.kwargs.desc,
                    icon: "warning",
                    button: gettext("LANG_JS_OK"),
                });
            });
    } catch (ex) {
        //window.location = redirect;
    }
}
