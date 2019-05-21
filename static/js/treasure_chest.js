var TreasureChest = (function () {
    //set default degree (360*5)
    var degree = 1800;
    //number of clicks = 0
    var clicks = 0;
    var amount_spin = 0;

    // var data_test = [10,95,180,320,250,230];
    // var data_test = [10, 95, 180, 45, 250, 230, 300, 60];
    // var have_spin = 6;
    var board_game_pos = null;
    var board_game_h = null;
    var board_game_w = null;
    var marker_img_w = null;
    var marker_img_h = null;
    var marker_p_t = null;
    var marker_p_l = null;
    var ratio_w = null;
    var ratio_h = null;
    var box_ratio_w = null;
    var box_ratio_h = null;
    var isWheelRunning = false

    var userId = null,
        userEmail = null;
    var userSession = null;

    // get user session from everymatrix
    jQuery(function () {
        c.doCall(initUserSession);

        // debug stuff
        /*
        userId = 20;

        getAvailableSpins([], function() {
            showCurrentWheel();
        });
        */
    });
    function setPosition(params) {
        $.ajax({
            url: '/treasure_chest/get_position',
            type: 'POST',
            method: 'POST',
            data: {
                user_id: userId
            },
            success: function (data) {
                // alert('position'+data.position)
                board_game_pos = $('#game-board img').offset();
                board_game_h = $('#game-board img').height();
                board_game_w = $('#game-board img').width();
                
                marker_p_t = (board_game_pos.top + (board_game_pos.top + board_game_h)) / 2;
                marker_p_l = (board_game_pos.left + board_game_w);
                $('#marker').show()
                ratio_w = board_game_w / 1200;
                ratio_h = board_game_h / 936;
                $('#marker img').css('width',60*ratio_w*1.2);
                $('#marker img').css('height',76*ratio_h*1.2);
                $('#wheel').css('width',250*ratio_w*1.2)
                $('#wheel').css('height',250*ratio_w*1.2)
                $('#pin').css('width',114*ratio_w*1.2)
                $('#pin').css('height',114*ratio_w*1.2)
                $('#pin').css({'margin-top':-((114*ratio_w*1.2)/2),'margin-left':-((114*ratio_w*1.2)/2)})

                $('#spin').css('width',68*ratio_w*1.2)
                $('#spin').css('height',68*ratio_w*1.2)
                $('#shine').css('width',250*ratio_w*1.2)
                $('#shine').css('height',250*ratio_w*1.2)

                // mobile
                $('#wheel-mobile').css('width',250*ratio_w*1.5)
                $('#wheel-mobile').css('height',250*ratio_w*1.5)
                $('#pin-mobile').css('width',114*ratio_w*1.5)
                $('#pin-mobile').css('height',114*ratio_w*1.5)
                $('#pin-mobile').css({'margin-top':-((114*ratio_w*1.5)/2),'margin-left':-((114*ratio_w*1.5)/2)})

                $('#spin-mobile').css('width',68*ratio_w*1.5)
                $('#spin-mobile').css('height',68*ratio_w*1.5)
                $('#shine-mobile').css('width',250*ratio_w*1.5)
                $('#shine-mobile').css('height',250*ratio_w*1.5)
                $('.spiner').show()
                marker_img_w = $('#marker img').width();
                marker_img_h = $('#marker img').height();
                
                box_ratio_w = ((200 * ratio_w) + marker_img_w) / 2;
                box_ratio_h = ((140 * ratio_h) + marker_img_h) / 2;
                
                amount_spin = data.position
                
                var check_pos = 0;
                var top_tmp,left_tmp;
                if(data.position >=1 && data.position<= 5){
                    check_pos = data.position;
                    
                    top_tmp = (marker_p_t - marker_img_w)+(((Math.sqrt(Math.pow(200,2)+Math.pow(200,2))/2)*ratio_h)-marker_img_w)+((((Math.sqrt(Math.pow(200,2)+Math.pow(170,2))/2)*ratio_h)-marker_img_w)*(check_pos-1))
                    left_tmp = (marker_p_l - box_ratio_w)-(Math.sin(32*Math.PI /180.0)*170*ratio_w)-((Math.sin(32*Math.PI /180.0)*140*ratio_w)*(check_pos-1))
                    $('#marker').offset({ top: top_tmp, left: left_tmp }); 
                }else if(data.position == 6){
                    $('#marker').offset({ top: (board_game_pos.top + board_game_h)-marker_img_h-((140 * ratio_h)/2), left: board_game_pos.left + (board_game_w/2)-(marker_img_w/2) }); 
                }else if(data.position >=7 && data.position <= 11){
                    check_pos = data.position - 6;
                    // top_tmp = (board_game_pos.top + board_game_h)-marker_img_h-((140 * ratio_h)/2)-(check_pos*(59 * ratio_h))-(12*ratio_h)
                    // left_tmp = board_game_pos.left + (board_game_w/2)-(marker_img_w/2)-(check_pos*(72 * ratio_w))-(20*ratio_w)
                    top_tmp = (board_game_pos.top + board_game_h)-marker_img_h-((140 * ratio_h)/2)-(((Math.sqrt(Math.pow(200,2)+Math.pow(200,2))/2)*ratio_h)-marker_img_w)-((((Math.sqrt(Math.pow(200,2)+Math.pow(170,2))/2)*ratio_h)-marker_img_w)*(check_pos-1))
                    left_tmp = board_game_pos.left + (board_game_w/2)-(marker_img_w/2)-(Math.sin(32*Math.PI /180.0)*170*ratio_w)-((Math.sin(32*Math.PI /180.0)*140*ratio_w)*(check_pos-1))
                    $('#marker').offset({ top: top_tmp, left: left_tmp }); 

                }else if(data.position >=13 && data.position <= 17){
                    check_pos = data.position-12;
                    // top_tmp = (marker_p_t - box_ratio_h)-(check_pos*(59 * ratio_h))-(12*ratio_h)
                    // left_tmp = (board_game_pos.left + (((200 * ratio_w)/2) - (marker_img_w/2)))+(check_pos*(72 * ratio_w))+(20*ratio_w)
                    top_tmp = (marker_p_t - box_ratio_h)-(((Math.sqrt(Math.pow(200,2)+Math.pow(200,2))/2)*ratio_h)-marker_img_w)-((((Math.sqrt(Math.pow(200,2)+Math.pow(170,2))/2)*ratio_h)-marker_img_w)*(check_pos-1))
                    left_tmp = (board_game_pos.left + (((200 * ratio_w)/2) - (marker_img_w/2)))+(Math.sin(32*Math.PI /180.0)*170*ratio_w)+((Math.sin(32*Math.PI /180.0)*140*ratio_w)*(check_pos-1))
                    $('#marker').offset({ top: top_tmp, left: left_tmp }); 
                }else if(data.position == 18){
                    $('#marker').offset({ top: (board_game_pos.top), left: board_game_pos.left + (board_game_w/2)-(marker_img_w/2) }); 
                }else if(data.position >= 19 && data.position <= 23){
                    check_pos = data.position-18;
                    top_tmp = (board_game_pos.top)+(((Math.sqrt(Math.pow(200,2)+Math.pow(200,2))/2)*ratio_h)-marker_img_w)+((((Math.sqrt(Math.pow(200,2)+Math.pow(170,2))/2)*ratio_h)-marker_img_w)*(check_pos-1))
                    left_tmp = (board_game_pos.left + (board_game_w/2))-(marker_img_w/2)+((Math.sin(32*Math.PI /180.0)*170*ratio_w)+(marker_img_w/2))+((Math.sin(32*Math.PI /180.0)*140*ratio_w)*(check_pos-1))
                    $('#marker').offset({ top: top_tmp, left: left_tmp }); 
                }else{
                    // console.log('box_ratio_h',ratio_h)
                   $('#marker').offset({ top: marker_p_t-marker_img_w, left: marker_p_l - box_ratio_w }); 
                }
                $('#marker').css('width', marker_img_w)
                $('.loading').hide();
            },
            error: function (xhr, errmsg, err) {
                $('.loading').hide();
            }
        });
    }
    // wrapper for handling the user session, returned by everymatrix
    function initUserSession(session) {
        
        // $('#circle_spin').show();
        userSession = session;
        // logged in
        var authCallback = function (session, userData) {
            userId = userData.userID;
            userEmail = userData.email;
            // alert('login true')
            getTransactions(session, function (newTransactions) {
                getAvailableSpins(newTransactions,function () {
                    // showCurrentWheel(session);
                    $('.left-box').show();
                    setDepositExp(userId)
                    setPosition()
                    getNotifications(userId)
                });
            });
        };

        // not logged in
        var noAuthCallback = function () {
            // alert('login false')
            userId = null;
            userEmail = null;
            gameIsAvailable = false;
            $('.left-box').hide();
        };

        // check authentication. With callbacks to handle result
        checkAuthentication(session, authCallback, noAuthCallback);
    }

    // check user session
    function checkAuthentication(session, authCallback, noAuthCallback) {
        
        session.call("/user#getSessionInfo", []).then(
            function (result) {
                var userData = result.kwargs;
                if (userData.isAuthenticated) {
                    authCallback(session, userData);
                } else {
                    $('.loading').hide();
                    if (typeof noAuthCallback === 'function') {
                        noAuthCallback();
                    }
                }

            },
            function (err) {
                $('.loading').hide();
                console.log('Error loading session from everymatrix');
                if (typeof noAuthCallback === 'function') {
                    noAuthCallback();
                }
                //29052017 c.conn.close();
            }
        );
    }

    // get transactions from everymatrix
    function getTransactions(session, callback) {

        // first we check when the last transaction was logged
        $.ajax({
            url: '/treasure_chest/get_last_transaction',
            type: 'POST',
            method: 'POST',
            data: {
                user_id: userId
            },
            success: function (transaction) {
                var transactionStartTime = (transaction.transaction_date === null) || (typeof transaction.transaction_date === 'undefined') ? '2016-09-15T00:00:00.000Z' : transaction.transaction_date;
                getTransactionFromAPI(session, transactionStartTime);
            },
            error: function (xhr, errmsg, err) {
                $('.loading').hide();
            }
        });

        // get new transactions from everymatrix
        function getTransactionFromAPI(session, transactionStartTime) {

            var parameters = {
                "type": "Deposit",
                "startTime": transactionStartTime,
                "endTime": new Date().toISOString(),
                "pageIndex": 1,
                "pageSize": 100
            };

            session.call("/user#getTransactionHistory", [], parameters).then(function (result) {
                var response = result.kwargs;
                callback(response);
                return;
            }, function (err) {
                console.log(err)
            });
        }

    }

    function getAvailableSpins(newTransactions, callback) {
        if (!userId) {
            gameIsAvailable = false;
            $('.loading').hide();
            return;
        }

        var transactions = newTransactions || {};

        $.ajax({
            url: '/treasure_chest/get_spins',
            type: 'POST',
            method: 'POST',
            data: {
                user_id: userId,
                transactions: JSON.stringify(transactions),
                // game_type: deposit_lv
            },
            success: function (result) {
                console.log('result',result);
                // $('#circle_spin').hide();
                availableSpins = result.spins;
                console.log('dp', deposit_lv)
                console.log('availableSpins', availableSpins)
                // showSpinsText();
                gameIsAvailable = availableSpins.point>0 ? true : false;
                console.log('gameIsAvailable', gameIsAvailable)
                if (gameIsAvailable) {
                    if (availableSpins.point > 1) {
                        $('.spin-left-box').find('span').html(availableSpins.point + ' ' + gettext('LANG_JS_SPINS_LEFT'))
                    } else {
                        $('.spin-left-box').find('span').html(availableSpins.point + ' ' + gettext('LANG_JS_SPIN_LEFT'))
                    }
                }else{
                    $('.spin-left-box').find('span').html(gettext('LANG_JS_DONT_HAVE_SPIN'))
                }

                // if (gameIsAvailable && result.show_game) {
                //     showGame(true)
                // }

                if (typeof callback === 'function') {
                    callback();
                }
            },
            error: function (xhr, errmsg, err) {
                $('.loading').hide();
                gameIsAvailable = false;
            }
        });
    }

    

    // setup the event handlers we need
    function setup() {
        $('#spin').click(function () {
            // alert(isWheelRunning)
            if(!isWheelRunning){
                if(gameIsAvailable){c
                    run();
                    // alert("have spin")
                }else{
                    alert(gettext("LANG_JS_DONT_HAVE_SPIN"));
                }
            }

        });

        $('#spin-mobile').click(function () {
            // alert(isWheelRunning)
            if(!isWheelRunning){
                if(gameIsAvailable){
                    run();
                    // alert("have spin")
                }else{
                    alert(gettext("LANG_JS_DONT_HAVE_SPIN"));
                }
            }

        });

        $('.spin-mobile').click(function(){
            $('#overlay').show();
            $('.spiner-mobile').show();
        })

        $('#overlay').click(function(e){
            // console.log(e.target)
            // console.log($('.spiner-mobile').has(e.target).length)
            if($('.spiner-mobile').has(e.target).length === 0){
                $('#overlay').hide();
            }
        })

    }

    
    // run a spin
    function run() {
        isWheelRunning = true;

        // play the spin on the server
        $.ajax({
            url: '/treasure_chest/spin',
            type: 'POST',
            method: 'POST',
            data: {
                user_id: userId,
            },
            success: function (json) {
                console.log("Spin :", json)
                spinResult = json;
                runLoop(json)
                // setWinnings(json.winning, json.bonus, json.bonuscode, json.free_spins_machine);

            },
            error: function (xhr, errmsg, err) {
                spinResult = {
                    error: err
                };
                console.log("error :", err);
            }
        });

        // the spinning loop
        function runLoop(data) {
                //add 1 every click
                clicks++;

                /*multiply the degree by number of clicks
                generate random number between 1 - 360, 
                then add to the new degree*/
                var newDegree = degree * clicks;
                // data.spin*60
                var extraDegree = 0;
                // var extraDegree = data_test[clicks - 1];
                if(data.spin >= 2){
                    extraDegree = Math.floor(Math.random() * (data.spin*60-30 - (data.spin*60-60-30)-1)) + (data.spin*60-60-30);
                }else{
                    var temp_degree = [Math.floor(Math.random() * 30),Math.floor(Math.random() * (360-330))+330]
                    extraDegree = temp_degree[Math.round(Math.random())]
                }
                // console.log('extraDegree',extraDegree)
                totalDegree = newDegree + extraDegree;
                // console.log('totalDegree',totalDegree)

                // $('#pin').css({
                //     'transform': 'rotate(' + totalDegree + 'deg)'
                // });
                $({deg: newDegree}).animate({deg:totalDegree},{
                    duration: 3000,
                    step: function(now) {
                        $('#pin').css({
                            'transform': ' rotate(' + now + 'deg) '
                        });
                        $('#pin-mobile').css({
                            'transform': ' rotate(' + now + 'deg) '
                        });
                    },
                    complete:function () {
                        $('#overlay').hide();
                        move(data)
                        // isWheelRunning = false
                    }
                })
                // move(data.spin)
                // noY = t.offset().top;

        }

        // runs after the spin is complete
        // function onComplete(result, winningAngle) {
        //     currentAngle[activeWheel] = winningAngle;
        //     completeRun(result);

        // }
    }

    function completeRun(data) {
        getReward(data)
        // if (winBonusCode != '') {
        //     showInfoBox(spinResult);
        // }
        if (data.reward.rule_type == '1' || data.reward.rule_type == '5') {
            setTimeout(function () {
                giveUserBonusCode(data.bonuscode);
            }, 3000);
            
        } else {
            setTimeout(function () {
                hideInfoBox();
            }, 10000);
        }
        getAvailableSpins();
        getNotifications(userId)

        setTimeout(function () {
            isWheelRunning = false;
            console.log('test')
        }, 100);
    }

    function reset() {
        // var el = getWheelElement();
        // TweenMax.to(el, 0, { rotation: currentAngle[activeWheel], ease: Linear.easeNone });
        // resetBonus();
        // hideInfoBox();
    }
    // run setup
    jQuery(function () {
        $('.loading').show();
        setup();
        $(window).resize(function () {
            // setup();
            if (gameIsAvailable) setPosition()
        });
    });

    // public methods
    return {
        // run the currently active wheel
        run: function () {
            run();
        },

        // set the active wheel
        // setActive: function (wheel) {
        //     showWheel(wheel);
        // },

        // show/hide the game overlay
        // showGame: function (show) {
        //     showGame(show);
        // }
    }

    function move(data) {
        var c = 0;
        var n = data.spin;
        // alert(spin);
        // console.log('amount_spin',amount_spin);
        var interval = setInterval(function () {
            amount_spin++;
            c++;
            console.log('data',c ,' = ',n);
            if (c === n) {
                clearInterval(interval);
                completeRun(data)
                // getReward(data);
                // setTimeout(function () {
                //     hideInfoBox();
                //     if(data.reward.rule_type == '1' || data.reward.rule_type == '5'){
                //         giveUserBonusCode(data.bonuscode)
                //     }
                //     getAvailableSpins()
                //     isWheelRunning = false
                // }, 3000);
            }
            // console.log('c',c)
            var board_game_pos  = $('#game-board img').offset();
            var board_game_h = $('#game-board img').height();
            var board_game_w = $('#game-board img').width();
            var ratio_w = board_game_w / 1200;
            var ratio_h = board_game_h / 936;
            marker_p_t = (board_game_pos.top + (board_game_pos.top + board_game_h)) / 2;
            console.log('marker_img_h',marker_img_h)
            box_ratio_h = ((140 * ratio_h) + marker_img_h) / 2;
            // var marker_pos = $('#marker img').offset();
            var marker_pos = $('#marker img').position();
            var new_pos_t = 0;
            var new_pos_l = 0;
            // amount_spin = 1;
            // console.log(amount_spin)
            // console.log(marker_pos)
            if (amount_spin == 1) {
                $('#marker').animate({
                    // top: "+=" + (71 * ratio_h) + 'px',
                    top: "+=" + (((Math.sqrt(Math.pow(200,2)+Math.pow(200,2))/2)*ratio_h)-marker_img_w) + 'px',
                    
                }, {
                        'duration': 900,
                        'queue': false,
                        'easing': 'easeInQuint',

                    })
                //This is a linear animation by X axis
                $('#marker').animate({
                    // left: "-=" + (94 * ratio_w) + 'px'
                    left: "-=" + (Math.sin(32*Math.PI /180.0)*170*ratio_w) + 'px'
                    
                }, {
                        'duration': 900,
                        'queue': false,
                        'easing': 'linear',
                        /* 'step': drawSpot */
                    });
            } else if (amount_spin >= 2 && amount_spin < 6) {
                $('#marker').animate({
                    // top: "+=" + (59 * ratio_h) + 'px',
                    top: "+=" + (((Math.sqrt(Math.pow(200,2)+Math.pow(170,2))/2)*ratio_h)-marker_img_w) + 'px',
                }, {
                        'duration': 900,
                        'queue': false,
                        'easing': 'easeInQuint',

                    })
                //This is a linear animation by X axis
                $('#marker').animate({
                    // left: "-=" + (77 * ratio_w) + 'px'
                    left: "-=" + (Math.sin(32*Math.PI /180.0)*140*ratio_w) + 'px'
                    
                }, {
                        'duration': 900,
                        'queue': false,
                        'easing': 'linear',
                        /* 'step': drawSpot */
                    });
            } else if (amount_spin == 6) {
                // console.log('top -= ', (71 * ratio_h))
                // console.log('left -= ', ((94 * ratio_w)) - board_game_pos.left)
                // console.log('board_game_pos',board_game_pos);
                // console.log('board_game_h',board_game_h);
                // console.log('marker_img_h',marker_img_h);
                // console.log('board_game_w',board_game_w);
                // console.log('marker_img_w',marker_img_w);
                // alert('sss');
                // $('#marker').offset({ top: (board_game_pos.top + board_game_h)-marker_img_h-((140 * ratio_h)/2), left: board_game_pos.left + (board_game_w/2)-(marker_img_w/2) }); 
                // console.log('bf')
                // console.log($('#marker').offset())
                // console.log('top',((board_game_pos.top + board_game_h)-marker_img_h-((140 * ratio_h)/2)))

                // console.log('left',(board_game_pos.left + (board_game_w/2)-(marker_img_w/2)))
                // console.log(((board_game_pos.top + board_game_h)-marker_img_h-((140 * ratio_h)/2))-$('#marker').offset().top)
                $('#marker').animate({
                    // top: "+=" + (71 * ratio_h) + 'px',
                    top: "+=" + (((board_game_pos.top + board_game_h)-marker_img_h-((140 * ratio_h)/2))-$('#marker').offset().top) + 'px',
                    // top:(board_game_pos.top + board_game_h)-marker_img_h-((140 * ratio_h)/2)
                }, {
                        'duration': 900,
                        'queue': false,
                        'easing': 'easeInQuint',

                    })
                //This is a linear animation by X axis
                $('#marker').animate({
                    left: "-=" + ($('#marker').offset().left-(board_game_pos.left + (board_game_w/2)-(marker_img_w/2))) + 'px'
                    // left: (board_game_pos.left + (board_game_w/2)-(marker_img_w/2))
                }, {
                        'duration': 900,
                        'queue': false,
                        'easing': 'linear',
                    });
                    // console.log('af')
                    // console.log($('#marker').offset())
            } else if (amount_spin == 7) {
                $('#marker').animate({
                    // top: "-=" + (71 * ratio_h) + 'px',
                    top: "-=" + (((Math.sqrt(Math.pow(200,2)+Math.pow(200,2))/2)*ratio_h)-marker_img_w) + 'px',
                }, {
                        'duration': 900,
                        'queue': false,
                        'easing': 'easeOutQuint',

                    })
                //This is a linear animation by X axis
                $('#marker').animate({
                    // left: "-=" + (92 * ratio_w) + 'px'
                    left: "-=" + (Math.sin(32*Math.PI /180.0)*170*ratio_w) + 'px'
                }, {
                        'duration': 900,
                        'queue': false,
                        'easing': 'linear',
                        /* 'step': drawSpot */
                    });
            } else if (amount_spin >= 8 && amount_spin < 12) {
                $('#marker').animate({
                    // top: "-=" + (59 * ratio_h) + 'px',
                    top: "-=" + ((((Math.sqrt(Math.pow(200,2)+Math.pow(170,2))/2)*ratio_h)-marker_img_w)) + 'px',
                }, {
                        'duration': 900,
                        'queue': false,
                        'easing': 'easeOutQuint',

                    })
                //This is a linear animation by X axis
                $('#marker').animate({
                    // left: "-=" + (77 * ratio_w) + 'px'
                    left: "-=" + ((Math.sin(32*Math.PI /180.0)*140*ratio_w)) + "px"
                }, {
                        'duration': 900,
                        'queue': false,
                        'easing': 'linear',
                        /* 'step': drawSpot */
                    });
                // $('#marker').offset({top:marker_pos.top - (59*ratio_h),left:marker_pos.left-(77*ratio_w)});
            } else if (amount_spin == 12) {
                // console.log('marker_p_t',marker_p_t)
                // console.log('box_ratio_h',box_ratio_h)
                // console.log($('#marker').offset().top)
                // console.log(((marker_p_t - box_ratio_h)-$('#marker').offset().top))
                $('#marker').animate({
                    // top: "-=" + (71 * ratio_h) + 'px',
                    top: "-=" + ($('#marker').offset().top - (marker_p_t - box_ratio_h)) + "px"
                }, {
                        'duration': 900,
                        'queue': false,
                        'easing': 'easeOutQuint',

                    })
                //This is a linear animation by X axis
                $('#marker').animate({
                    // left: "-=" + (94 * ratio_w) + 'px'
                    left: "-=" + ($('#marker').offset().left - (board_game_pos.left + (((200 * ratio_w)/2) - (marker_img_w/2)))) + "px"
                }, {
                        'duration': 900,
                        'queue': false,
                        'easing': 'linear',
                        /* 'step': drawSpot */
                    });
                // $('#marker').offset({top:marker_pos.top - (71*ratio_h),left:marker_pos.left-(94*ratio_w)});
            }
            else if (amount_spin == 13) {
                $('#marker').animate({
                    // top: "-=" + (71 * ratio_h) + 'px',
                    top: "-=" + (((Math.sqrt(Math.pow(200,2)+Math.pow(200,2))/2)*ratio_h)-marker_img_w) + 'px',
                }, {
                        'duration': 900,
                        'queue': false,
                        'easing': 'easeOutQuint',

                    })
                //This is a linear animation by X axis
                $('#marker').animate({
                    // left: "+=" + (94 * ratio_w) + 'px'
                    left: "+=" + (Math.sin(32*Math.PI /180.0)*170*ratio_w) + 'px'
                }, {
                        'duration': 900,
                        'queue': false,
                        'easing': 'linear',
                        /* 'step': drawSpot */
                    });
                // $('#marker').offset({top:marker_pos.top - (71*ratio_h),left:marker_pos.left+(94*ratio_w)});
            } else if (amount_spin >= 14 && amount_spin < 18) {
                $('#marker').animate({
                    // top: "-=" + (59 * ratio_h) + 'px',
                    top: "-=" + ((((Math.sqrt(Math.pow(200,2)+Math.pow(170,2))/2)*ratio_h)-marker_img_w)) + 'px',
                }, {
                        'duration': 900,
                        'queue': false,
                        'easing': 'easeOutQuint',

                    })
                //This is a linear animation by X axis
                $('#marker').animate({
                    // left: "+=" + (77 * ratio_w) + 'px'
                    left: "+=" + ((Math.sin(32*Math.PI /180.0)*140*ratio_w)) + 'px'
                }, {
                        'duration': 900,
                        'queue': false,
                        'easing': 'linear',
                        /* 'step': drawSpot */
                    });
                // $('#marker').offset({top:marker_pos.top - (59*ratio_h),left:marker_pos.left+(77*ratio_w)});
            } else if (amount_spin == 18) {
                $('#marker').animate({
                    // top: "-=" + (71 * ratio_h) + 'px',
                    top: "-=" + ($('#marker').offset().top-board_game_pos.top) + 'px',
                }, {
                        'duration': 900,
                        'queue': false,
                        'easing': 'easeOutQuint',

                    })
                //This is a linear animation by X axis
                $('#marker').animate({
                    // left: "+=" + (94 * ratio_w) + 'px'
                    left: "+=" + ((board_game_pos.left + (board_game_w/2)-(marker_img_w/2))-$('#marker').offset().left) + 'px'
                }, {
                        'duration': 900,
                        'queue': false,
                        'easing': 'linear',
                        /* 'step': drawSpot */
                    });
                // $('#marker').offset({top:marker_pos.top - (71*ratio_h),left:marker_pos.left+(94*ratio_w)});
            } else if (amount_spin == 19) {
                // console.log('marker_img_w',marker_img_w)
                // console.log('ratio_h',ratio_h)
                // console.log('ratio_w',ratio_w)
                // $('#marker').offset({ top: (board_game_pos.top)+(((Math.sqrt(Math.pow(200,2)+Math.pow(200,2))/2)*ratio_h)-marker_img_w), left: (board_game_pos.left + (board_game_w/2))+(marker_img_w/2)+(Math.sin(32*Math.PI /180.0)*60*ratio_w) });
                // console.log('left',(Math.sin(32*Math.PI /180.0)*60*ratio_w))
                $('#marker').animate({
                    // top: "+=" + (71 * ratio_h) + 'px',
                    top: "+=" + (((Math.sqrt(Math.pow(200,2)+Math.pow(200,2))/2)*ratio_h)-marker_img_w) + 'px',
                }, {
                        'duration': 900,
                        'queue': false,
                        'easing': 'easeOutQuint',

                    })
                //This is a linear animation by X axis
                $('#marker').animate({
                    // left: "+=" + (94 * ratio_w) + 'px'
                    left: "+=" + ((Math.sin(32*Math.PI /180.0)*170*ratio_w)+(marker_img_w/2)) + "px"
                }, {
                        'duration': 900,
                        'queue': false,
                        'easing': 'linear',
                        /* 'step': drawSpot */
                    });
                // $('#marker').offset({top:marker_pos.top + (71*ratio_h),left:marker_pos.left+(94*ratio_w)});
            } else {
                if (amount_spin > 23) {
                    // console.log('amount_spin 1',amount_spin)
                    amount_spin = amount_spin - 24
                    // amount_spin = amount_spin + 1
                    n++;
                    // console.log('amount_spin 2',amount_spin)
                    // board_game_pos = $('#game-board img').offset();
                    // board_game_h = $('#game-board img').height();
                    // board_game_w = $('#game-board img').width();
                    // marker_img_w = $('#marker img').width();
                    // marker_img_h = $('#marker img').height();
                    // var marker_p_t = (board_game_pos.top + (board_game_pos.top + board_game_h)) / 2;
                    // var marker_p_l = (board_game_pos.left + board_game_w);
                    // var ratio_w = board_game_w / 1200;
                    // var ratio_h = board_game_h / 936;
                    // var box_ratio_w = ((200 * ratio_w) + marker_img_w) / 2;
                    // var box_ratio_h = ((140 * ratio_h) + marker_img_h) / 2;
                    // $('#marker').offset({ top: marker_p_t - box_ratio_h, left: marker_p_l - box_ratio_w });
                    // console.log('marker_p_t',marker_p_t)
                    // console.log('marker_img_w',marker_img_w)
                    // console.log('top',($('#marker').offset().top - (marker_p_t-marker_img_w)))
                    $('#marker').animate({
                        // top: "+=" + (59 * ratio_h) + 'px',
                        top: "+=" + ((marker_p_t-marker_img_w)-$('#marker').offset().top) + 'px',
                    }, {
                            'duration': 900,
                            'queue': false,
                            'easing': 'easeOutQuint',

                        })
                    //This is a linear animation by X axis
                    // console.log('marker_p_l',marker_p_l)
                    // console.log('box_ratio_w',box_ratio_w)
                    // console.log('left',((marker_p_l - box_ratio_w)-$('#marker').offset().left))
                    $('#marker').animate({
                        // left: "+=" + (77 * ratio_w) + 'px'
                        left: "+=" + ((marker_p_l - box_ratio_w)-$('#marker').offset().left) + "px"
                    }, {
                        'duration': 900,
                        'queue': false,
                        'easing': 'linear',
                        /* 'step': drawSpot */
                    });
                    // move(1);
                } else {
                    $('#marker').animate({
                        // top: "+=" + (59 * ratio_h) + 'px',
                        top: "+=" + (((Math.sqrt(Math.pow(200,2)+Math.pow(170,2))/2)*ratio_h)-marker_img_w) + 'px',
                    }, {
                            'duration': 900,
                            'queue': false,
                            'easing': 'easeOutQuint',

                        })
                    //This is a linear animation by X axis
                    $('#marker').animate({
                        // left: "+=" + (77 * ratio_w) + 'px'
                        left: "+=" + ((Math.sin(32*Math.PI /180.0)*140*ratio_w)) + "px"
                    }, {
                            'duration': 900,
                            'queue': false,
                            'easing': 'linear',
                            /* 'step': drawSpot */
                        });
                }
            }

        }, 1000);
    }

    function getReward(reward) {
        // console.log(reward)
        setTimeout(function () {
            // if(reward){
            // console.log('reward', reward);

            if (reward.reward.rule_type == '3') {
                // have_spin += reward.type.value;
                goBack(reward.reward.reward_no,reward)
            } else if (reward.reward.rule_type == '7') {
                toStart();
            } else {
                if(reward.reward.rule_type != '2'){
                    showInfoBox(reward.reward)
                }
            }
            // alert(have_spin);
            
            // }
        }, 1000)

    }
    
    // get the last recorded transaction
    function giveUserBonusCode(bonusCode) {
        //return; // this is commented out, because we no longer give the bonus code automatically. We send an email to admin who will give it manually.
        console.log('Bonussssssssss!!!!!')
        console.log('bonusCode',bonusCode)
        if (bonusCode === '') {
            hideInfoBox();
            swal({
                title: gettext("LANG_JS_WARNING"),
                text: gettext("LANG_JS_DONT_HAVE_BONUS"),
                icon: "warning",
                button: gettext("LANG_JS_OK"),
            });
            return;
        }

        var parameters = {
            'bonusCode': bonusCode
        };
        $('.waiting-api').css('display', 'inline');
        try {
            userSession.call("/user/bonus#apply", [], parameters).then(function (result) {
                console.log('bonus', result)
                $('.waiting-api').css('display', 'none');
                hideInfoBox();
            }, function (err) {
                $('.waiting-api').css('display', 'none');
                hideInfoBox();
                console.log(err)
                swal({
                    title: gettext("LANG_JS_WARNING"),
                    text: err.kwargs.desc + ' ' + gettext('LANG_JS_COULD_YOU_CONTACT'),
                    icon: "warning",
                    button: gettext("LANG_JS_OK"),
                });
            });
        } catch (e) {
            $('.waiting-api').css('display', 'none');
            hideInfoBox();
            swal({
                title: gettext("LANG_JS_WARNING"),
                text: gettext('LANG_JS_ERROR_GIVING_BONUS_CODE') + e + ' ' + gettext('LANG_JS_COULD_YOU_CONTACT'),
                icon: "warning",
                button: gettext("LANG_JS_OK"),
            });
            // console.log('error giving bonus code', e);
        }

    }

    function showInfoBox(result) {
        $('#reward-box').addClass("swal-overlay");
        $('#reward-box').addClass("swal-overlay--show-modal");
        $('.show-reward img').attr('class', '');
        $('.show-reward img').addClass('nomal-cal');
        $('.show-reward img').attr('src', '');
        if (result.icon != '') {
            $('.show-reward img').attr('src', result.icon);
        }
        $('#reward-box').css('display', 'inline');
        $('#reward-box').removeClass('hide');
        $('#reward-box').addClass('show');
        $('#reward-box img').css('display', 'inline');
        $('.text-reward-name').html(result.name);
        $('.text-reward').html(gettext('LANG_JS_CONGRATULATIONS_TO ' + result.name));
    }

    function hideInfoBox() {
        $('#reward-box').removeClass("swal-overlay");
        $('#reward-box').removeClass("swal-overlay--show-modal");
        $('#reward-box').removeClass('show');
        $('#reward-box').addClass('hide');
        $('#reward-box , #bg-jackpot-box , #bg-jackpot , #reward-box img').css({
            'display': 'none'
        });

    }

    function goBack(position,data) {
        console.log('data',data.reward)
        if(position == 4){
            $('#marker').animate({
                // top: "+=" + (59 * ratio_h) + 'px',
                top: "-=" + (((Math.sqrt(Math.pow(200,2)+Math.pow(170,2))/2)*ratio_h)-marker_img_w) + 'px',
            }, {
                'duration': 900,
                'queue': false,
                'easing': 'easeOutQuint',

            })
            //This is a linear animation by X axis
            $('#marker').animate({
                // left: "-=" + (77 * ratio_w) + 'px'
                left: "+=" + (Math.sin(32*Math.PI /180.0)*140*ratio_w) + 'px'
                
            }, {
                'duration': 900,
                'queue': false,
                'easing': 'linear',
                complete:function(){
                    data.reward = data.reward_back
                    console.log('data af',data)
                    getReward(data)
                }
            });
        }else{
            $('#marker').animate({
                // top: "+=" + (59 * ratio_h) + 'px',
                top: "-=" + (((Math.sqrt(Math.pow(200,2)+Math.pow(170,2))/2)*ratio_h)-marker_img_w) + 'px',
            }, {
                'duration': 900,
                'queue': false,
                'easing': 'easeInQuint',

            })
            //This is a linear animation by X axis
            $('#marker').animate({
                // left: "+=" + (77 * ratio_w) + 'px'
                left: "-=" + ((Math.sin(32*Math.PI /180.0)*140*ratio_w)) + "px"
            }, {
                'duration': 900,
                'queue': false,
                'easing': 'linear',
                complete:function(){
                    data.reward = data.reward_back
                    console.log('data af',data)
                    getReward(data)
                }
                /* 'step': drawSpot */
            });
        }
    }

    function toStart() {
        amount_spin = 0;
        marker_p_t = (board_game_pos.top + (board_game_pos.top + board_game_h)) / 2;
        marker_p_l = (board_game_pos.left + board_game_w);
        ratio_w = board_game_w / 1200;
        ratio_h = board_game_h / 936;
        box_ratio_w = ((200 * ratio_w) + marker_img_w) / 2;
        box_ratio_h = ((140 * ratio_h) + marker_img_h) / 2;
        $('#marker').offset({ top: marker_p_t-marker_img_w, left: marker_p_l - box_ratio_w });
        // $('#marker').offset({ top: marker_p_t - box_ratio_h, left: marker_p_l - box_ratio_w });
    }


    function pauseBlock() {
        have_spin = 0;
    }

    function getNotifications(data){
        console.log('data',data)
        $.ajax({
            type: 'POST',
            method: 'POST',
            url:"/treasure_chest/notifications",
            data: {
                'user_id': data // from form
            },
            success: function(result){
                // console.log(result)
                $('.notifacations-content').html('');
                $('.notifacations-content').append(result)
            },
            error: function (xhr, errmsg, err) {
                console.log('err',err)
                // $('.loading').hide();
                // gameIsAvailable = false;
            }
       });
    }

    function setDepositExp(data) {
        $.ajax({
            type: 'POST',
            method: 'POST',
            url:"/treasure_chest/deposit",
            data: {
                'user_id': data // from form
            },
            success: function(result){
                // console.log(result)
                // console.log(JSON.parse(result.sss))
                $('.exp-first>.inner').css({'width':result.roll+'%'});
                $('.exp-second>.inner').css({'width':result.every+'%'});
                // $('.notifacations-content').append(result)
            },
            error: function (xhr, errmsg, err) {
                console.log('err',err)
                // $('.loading').hide();
                // gameIsAvailable = false;
            }
       });
    }
})();
