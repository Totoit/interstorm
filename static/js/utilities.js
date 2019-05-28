window.c = (function (em) {
    "use strict";
    if (!em) {
        console.error('EveryMatrix settings is missing!');
    }
    var _Q = [];
    var _T;

    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    /* This Singleton was constructed in order to wrap all calls in a cookieverfication so that a user won't have to log in multiple times */
    function AutoBahnSingleton() {

        var cid = getCookie("$client_id$");
        this.WEBSOCKET_API_URL = cid ? `wss://` + em.url + `?cid=${encodeURIComponent(cid)}` : 'wss://' + em.url;
        this.DOMAIN_PREFIX = em.domain;
        //this.DOMAIN_PREFIX = 'https://willycasino.dk/';
        this.conn = new autobahn.Connection({
            transports: [{
                'type': 'websocket',
                'url': this.WEBSOCKET_API_URL,
                'max_retries': 3
            }],
            realm: this.DOMAIN_PREFIX,

        });
        this.cookieName = '$client_id$';
        this.language = em.language_code; //language used for game languages
        this._running = false;
        //console.log('api url:' + this.WEBSOCKET_API_URL);
        //console.log('domain prefix:' + this.DOMAIN_PREFIX);
        var currency;
        var ipCountry;
    }

    // Methods
    // Gets the cookie
    AutoBahnSingleton.prototype.fetchCookie = function () {
        if (document.cookie.length > 0) {
            var c_start = document.cookie.indexOf(this.cookieName + "=");
            if (c_start != -1) {
                c_start = c_start + this.cookieName.length + 1;
                var c_end = document.cookie.indexOf(";", c_start);
                if (c_end == -1) {
                    c_end = document.cookie.length;
                }
                return unescape(document.cookie.substring(c_start, c_end));
            }
        }
        return "";
    };
    AutoBahnSingleton.prototype.handleError = function (error) {
        if (error.kwargs.desc.match(/reCAPTCHA.*/)) {
            willyModal.error(gettext("Please try again"));
            location.reload();
        }
        this.endCallAnimation();
    };
    //If no cookie is present, sets a cookie. Uses this cookie to verify user in all subsequent calls
    AutoBahnSingleton.prototype.verifyUser = function (session, callback) {
        var self = this;
        var parameters = {
            culture: self.language
        };
        session.call("/user/basicConfig#get", [], parameters).then(function (result) {
            console.log('a',result.kwargs);
        });
        session.call("/connection#getClientIdentity", [], parameters).then(function (result) {
            console.log('b',result);

            self.checkIdentity(session, callback);
            // save the client identity to cookie
            document.cookie = "$client_id$=" + result.kwargs.cid + "; path=/";
        }, function (err) {
            console.log(err);
            console.log('RPC call failed, error = ' + err.desc);
        });
        // session.call("/user#getSessionInfo", []).then(function (result) {
        //     // console.log("isAuthenticated", result.kwargs);
        //     self.currency = result.kwargs.currency;
        //     self.ipCountry = result.kwargs.ipCountry;
        //     self.userCountry = result.kwargs.userCountry;
        //     if (!result.kwargs.isAuthenticated) {
        //         console.log('c')
        //         // showTablogin()
        //     //     calllogout(function (res) {
        //     //     if (res.result) {
        //     //         window.location.href = "/";
        //     //         // location.reload();
        //     //     }
        //     // });
        //     }else{
        //         console.log('d')
        //     }
        //     // showTablogin()
        // });

    };
    AutoBahnSingleton.prototype.checkIdentity = function (session, callback) { //Checks if the user is logged in
        session.subscribe('/sessionStateChange', function (args, kwargs, details) {
            console.log('Event is fired with data = %o', kwargs);
            // if (kwargs.code == 0){ isLogin = true;  } else { isLogin = false;}
            // if (kwargs.code > 0 && kwargs.code != 2) {
            //     // alert('>0')
            //     // calllogout(function (res) {
            //     //     if (res.result) {
            //     //         // $('#loginModal').modal({
            //     //         //     show:true,
            //     //         //     backdrop:'static'
            //     //         //   }
            //     //         // );
            //     //         // $('#loginModal').on('hidden.bs.modal', function () {
            //     //         // //   location.reload();
            //     //         //     window.location.href = "/";
            //     //         // })
            //     //     }
            //     // });
            // } else if (kwargs.code == 2) {
            //     // alert('2')
            //     // calllogout(function (res) {
            //     //         if (res.result) {
            //     //             // location.reload();
            //     //             window.location.href = "/";
            //     //         }
            //     //     }
            //     // );
            // }
        });
        callback(session);
    };
    AutoBahnSingleton.prototype._doCall = function () {
        var self = this;
        if (this._running) {
            return;
        }
        this._running = true;

        function _execute(session) {
            //console.log('queue', _Q.length);

            while (_Q.length > 0) {
                var _i = _Q.pop();
                var nestedCall = _i[0];
                var payload = _i[1];
                //console.log('ex:', payload);
                nestedCall(session, payload);
            }


            _T = setTimeout(function () {
                self.conn.close();
            }, 30 * 60 * 1000); //Increased from 30 sec to 10 min to prevent timeout when signing in with nemid
            //SKOL SET new timeout    }, 10 * 60 * 1000);
            self._running = false;
        }

        clearTimeout(_T);
        //console.log("Web Socket Connected :", this.conn.isConnected);
        try {
            if (!this.conn.isConnected) { //No connection is OPEN
                this.conn.onopen = function (session) {
                    console.log('Connection is established. Session ID = %o', session.id);
                    self.verifyUser(session, function (session) {
                        _execute(session);
                    });
                };
                try {
                    this.conn.open();
                } catch (err) {
                    location.reload();
                }

            } else { // Wait for calls to be OPEN and ESTABLISHED
                var _I = setInterval(function () {
                    if (self.conn.isOpen) {
                        // The calls are now OPEN and ESTABLISHED
                        clearInterval(_I);
                        _execute(self.conn.session);
                    }
                }, 1);
            }
        } catch (err) {
            // calllogout(function(res){
            //     window.location.href = "/";
            // });
        }
    };
    //Wraps all calls in a verification, so that users won't have to log in multiple times
    AutoBahnSingleton.prototype.doCall = function (nestedCall, payload) {
        var par = {"culture": em.language_code};
        payload = $.extend({}, par, payload);
        _Q.push([nestedCall, payload]);
        this._doCall();
    };
    AutoBahnSingleton.prototype.request = function autobahn_request(request, options) {
        var defaults = {
            payload: {"culture": em.language_code},
            success: undefined,
            error: undefined
        };
        var kwargs = $.extend({}, defaults, options);
        this.doCall(function (session) {
            session.call(request, [], kwargs.payload).then(function (response) {
                if (kwargs.success) {
                    kwargs.success(response);
                }
            }, function (error) {
                if (kwargs.error) {
                    kwargs.error(error);
                }
            });
        });
    };
    AutoBahnSingleton.prototype.doCallAnimation = function (nestedCall, payload) {
        $('a.btn.btn-primary').addClass('loader');
        this.doCall(nestedCall, payload);
    };
    //Alternative to c.conn.close() - Also removes the loader from the buttons
    AutoBahnSingleton.prototype.endCallAnimation = function () {
        $('a.btn.btn-primary').removeClass('loader');
    };
    //Instantiate singleton
    return new AutoBahnSingleton();
})
(window._EM);

//Creates a verfication url. Used to send a verification mail in auth.js and forgotpassword.js
function fetchMailUrl(url) {
    var originURL = location.origin.replace(/([a-zA-Z+.\-]+):\/\/([^\/]+):([0-9]+)\//, "$1://$2/"); // http or https
    return originURL + "/" + url + "/?key=";
}
$(document).ready(function () {
    function getSessionInfo(session) {
        session.call("/user#getSessionInfo", []).then(function (result) {
            //console.log("isAuthenticated", result.kwargs.isAuthenticated);
            if (!result.kwargs.isAuthenticated) {
                // $('.banner .btnRegister').show();
                // $('.banner .btnDeposit').hide();
                // calllogout(function (res) {
                //     if (res.result) {
                //         // location.reload();
                //         window.location.href = "/";
                //     }
                // });
            }else{
                // $('.banner .btnRegister').hide();
                // $('.banner .btnDeposit').show();
            }

        });
    }

    function basicConfig(session) {
        var parameters = {
            culture: self.language
        };
        session.call("/user/basicConfig#get", [], parameters).then(function (result) {
            console.log(result);
        });
        session.call("/connection#getClientIdentity", [], parameters).then(function (result) {
            console.log(result);
            // save the client identity to cookie
            document.cookie = "$client_id$=" + result.kwargs.cid + "; path=/";
        }, function (err) {
            console.log(err);
            console.log('RPC call failed, error = ' + err.desc);
        });
    }

    try {
        c.doCall(getSessionInfo);
    } catch (err) {
        location.reload();
    }

});
