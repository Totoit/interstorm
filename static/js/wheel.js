
var WHEEL = (function () {
    var goldWheel = null,
        blueWheel = null;

    var userId = null,
        userEmail = null;


    // positions for the wheel for the various winnings
    var positions = {
        blue: {
            'giftbox': [42.5, 207.5],
            'money': [152.5, 317.5],
            'shift': [97.5, 262.5],
            'jackpot': [0]
        },
        // gold: {
        //     '50': [-45, -135, 45, 135],
        //     '500': [-90, 90],
        //     '5000': [180],
        //     'trip': [0]
        // }

    };
    // the posible values the bonus game can land on
    var possibleBonuses = ['giftbox', 'monney', 'shift'];
    var gameIsAvailable = false;
    var availableSpins = {
        blue: 0,
        gold: 0
    };

    // setup the event handlers we need
    function setup() {
        //goldWheel = document.getElementById('wheel-gold');
        blueWheel = document.getElementById('wheel-blue');

        jQuery('#wheel-game-close').off('click').on('click', function () {
            showGame(false);
        });

        jQuery('#wheel-blue-spin-button, #wheel-gold-spin-button')
            .off('click')
            .on('click', function () {
                if (gameIsAvailable) {
                    if (isLogin) {
                        if (gameIsAvailable) {
                            run();
                        }
                    } else {
                        $('#loginModal').modal('show');
                        return false;
                    }
                }
            });

    }


    //////////////////////////////////
    // USER HANDLING
    //////////////////////////////////

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

    function getAvailableSpins(newTransactions, callback) {
        if (!userId) {
            gameIsAvailable = false;
            // $('.loading').hide();
            return;
        }

        var transactions = newTransactions || {};

        $.ajax({
            url: '/wheel/get_spins',
            type: 'POST',
            method: 'POST',
            data: {
                user_id: userId,
                transactions: JSON.stringify(transactions),
                game_type: deposit_lv
            },
            success: function (result) {
                availableSpins = result.spins;
                console.log('dp', deposit_lv)
                console.log('availableSpins', availableSpins)
                showSpinsText();
                gameIsAvailable = canPlayWheel() ? true : false;
                console.log('gameIsAvailable', gameIsAvailable)

                if (gameIsAvailable && result.show_game) {
                    showGame(true)
                }

                if (typeof callback === 'function') {
                    callback();
                }
            },
            error: function (xhr, errmsg, err) {
                // $('.loading').hide();
                gameIsAvailable = false;
            }
        });
    }

    function hasSpinsLeft(moreThan) {
        var moreThanNumberOfSpins = moreThan || 0; // typically to check if there are more than 1 left
        return (availableSpins['gold'] + availableSpins['blue']) > moreThanNumberOfSpins;
    }

    function showSpinsText() {
        var numLeft = 0;

        if (availableSpins['gold'] > 0) {
            numLeft = availableSpins['gold'];
        } else if (availableSpins['blue'] > 0) {
            numLeft = availableSpins['blue'];
        }

        if (numLeft > 0) {
            var text = jQuery('#wheel-spinsleft-text-template').text();
            var spinsLeftText = text.replace("[spins]", numLeft);

            jQuery('#wheel-spinsleft-text').text(spinsLeftText).show();
            jQuery('#wheel-teaser-text').hide();
        } else {
            jQuery('#wheel-spinsleft-text').hide();
            jQuery('#wheel-teaser-text').show();
        }
    }

    function canPlayWheel() {
        return availableSpins['level_3'] > 0 || availableSpins['level_2'] > 0 || availableSpins['level_1'] > 0;
    }

    function showCurrentWheel(session) {
        // var numLeft = 0;

        // if (availableSpins['gold'] > 0) {
        //     numLeft = availableSpins['gold'];
        //     showWheel('gold');
        // } else if (availableSpins['blue'] > 0) {
        //     numLeft = availableSpins['blue'];
        //     showWheel('blue');
        // }

        // var rawText;
        // if (numLeft === 1) {
        //     rawText = wheelInfoBoxText['spinsleft']['single'];
        // } else {
        //     rawText = wheelInfoBoxText['spinsleft']['plural'];
        // }


        // var spinsLeftText = rawText.replace("[spins]", numLeft);
        // jQuery('.spins-left').text(spinsLeftText);
        var _totalDeposits = 0;
        session.call("/user#getNetDeposit", [], {}).then(function (result) {
            var currencyTextDeposit = "";
            currencyTextDeposit = result.kwargs.depositCurrency;
            _totalDeposits = result.kwargs.totalDeposits;
            /* CONVERSE CURRENCY POWERBAR */
            var deposit_euro = 0;
            deposit_lv = 1;
            if (currencyTextDeposit == 'USD') {
                deposit_euro = (_totalDeposits * (0.86588));
            } else if (currencyTextDeposit == 'GBP') {
                deposit_euro = (_totalDeposits * (1.12495));
            } else if (currencyTextDeposit == 'CAD') {
                deposit_euro = (_totalDeposits * (0.67542));
            } else if (currencyTextDeposit == 'NOK') {
                deposit_euro = (_totalDeposits * (0.10591));
            } else if (currencyTextDeposit == 'SEK') {
                deposit_euro = (_totalDeposits * (0.09631));
            } else if (currencyTextDeposit == 'ARS') {
                deposit_euro = (_totalDeposits * (0.02228));
            } else if (currencyTextDeposit == 'ITL') {
                deposit_euro = (_totalDeposits * (0.00052));
            } else if (currencyTextDeposit == 'CNH') {
                deposit_euro = (_totalDeposits * (0.12574));
            } else if (currencyTextDeposit == 'KRW') {
                deposit_euro = (_totalDeposits * (0.00077));
            } else if (currencyTextDeposit == 'JPY') {
                deposit_euro = (_totalDeposits * (0.00761));
            } else {
                deposit_euro = _totalDeposits;
            }
            if (deposit_euro < 500) {
                deposit_lv = 1;
            } else if (deposit_euro >= 500 && deposit_euro < 2000) {
                deposit_lv = 2;
            } else {
                deposit_lv = 3;
            }
            if ($('.wheel-reward-img').length > 0) {
                $('.wheel-reward-img').attr('src', '/static/images/wheel/wheel-desktop_LV' + deposit_lv + '.png');
                $('.wheel-button-img').attr('src', '/static/images/wheel/point-desktop_LV' + deposit_lv + '.png');
            }
            $('.wheel-reward-img').show();
            $('.wheel-button-img').show();
            /* END CONVERSE CURRENCY POWERBAR */
            // $('.loading').hide();
        }, function (err) {
            // $('.loading').hide();
        });

    }

    // wrapper for handling the user session, returned by everymatrix
    function initUserSession(session) {
        // $('.loading').show();
        userSession = session;
        // logged in
        var authCallback = function (session, userData) {
            userId = userData.userID;
            userEmail = userData.email;


            getTransactions(session, function (newTransactions) {
                getAvailableSpins(newTransactions, function () {
                    showCurrentWheel(session);
                });
            });
        };

        // not logged in
        var noAuthCallback = function () {
            userId = null;
            userEmail = null;
            gameIsAvailable = false;
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
                    // $('.loading').hide();
                    if (typeof noAuthCallback === 'function') {
                        noAuthCallback();
                    }
                }

            },
            function (err) {
                // $('.loading').hide();
                console.log('Error loading session from everymatrix');
                if (typeof noAuthCallback === 'function') {
                    noAuthCallback();
                }
                //29052017 c.conn.close();
            }
        );
    }


    // get the last recorded transaction
    function giveUserBonusCode(bonusCode) {
        //return; // this is commented out, because we no longer give the bonus code automatically. We send an email to admin who will give it manually.

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

    // get transactions from everymatrix
    function getTransactions(session, callback) {

        // first we check when the last transaction was logged
        $.ajax({
            url: '/wheel/get_last_transaction',
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
                // $('.loading').hide();
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

                // temp stuff, need real data. Remove this when we have real data
                /*
                var response = {
                    "transactions": [
                        {
                            "transactionID": "1683418",
                            "time": "2015-03-14T06:01:07.503",
                            "debit": {
                                "currency": "DKK",
                                "amount": 3540,
                                "name": "Neteller"
                            },
                            "credit": {
                                "currency": "DKK",
                                "amount": 2000,
                                "name": "Casino"
                            },
                            "fees": [
                                {
                                    "currency": "EUR",
                                    "amount": 186.199475308
                                }
                            ]
                        }, {
                            "transactionID": "1683417",
                            "time": "2014-03-13T05:41:10.783",
                            "debit": {
                                "currency": "NOK",
                                "amount": 111,
                                "name": "Neteller"
                            },
                            "credit": {
                                "currency": "NOK",
                                "amount": 111,
                                "name": "Casino"
                            },
                            "fees": []
                        }
                    ],
                    "currentPageIndex": 1,
                    "totalRecordCount": 46,
                    "totalPageCount": 3
                }


                callback(response);

                */

            }, function (err) {
                console.log(err)
            });
        }

    }


    //////////////////////////////////
    // WHEEL GAME
    //////////////////////////////////

    var activeWheel = 'blue';
    var isWheelRunning = false;
    var possibleStopPositions = [0];
    var currentAngle = {};
    var bonusPrize = '',
        winBonusCode = '',
        winnings = '',
        freeSpinsOnMachine = '';

    // run a spin
    function run() {
        // if (isWheelRunning || availableSpins[activeWheel] < 1) {
        if (isWheelRunning) {
            return;
        }
        reset();
        isWheelRunning = true;

        var el = getWheelElement();
        var spinFullRound = 360,
            nextRotation = spinFullRound;

        TweenMax.to(el, 1, { rotation: nextRotation, ease: Power1.easeIn, onComplete: runLoop });

        var spinResult = null;
        // play the spin on the server
        $.ajax({
            url: '/wheel/spin',
            type: 'POST',
            method: 'POST',
            data: {
                wheel: deposit_lv,
                user_id: userId,
                user_email: userEmail,
                lv: deposit_lv
            },
            success: function (json) {
                console.log("Spin :", json)
                spinResult = json;
                setWinnings(json.winning, json.bonus, json.bonuscode, json.free_spins_machine);

            },
            error: function (xhr, errmsg, err) {
                spinResult = {
                    error: err
                };
                console.log("error :", err);
            }
        });

        // the spinning loop
        function runLoop() {

            if (spinResult) {
                // we got the result back from the server

                if (!spinResult.error) {
                    var rotations = 10,
                        winningAngle = possibleStopPositions[Math.floor(Math.random() * possibleStopPositions.length)];

                    // give it a few more spins and calc the final position
                    nextRotation += spinFullRound * rotations + winningAngle;


                    var rotationTween = TweenMax.to(el, 5, { rotation: nextRotation, ease: Linear.easeNone });

                    // slow down to stop at final position
                    TweenLite.delayedCall(2.5, function () {
                        TweenLite.to(rotationTween, 6, {
                            progress: 1, ease: Power1.easeOut, onComplete: function () {
                                onComplete(spinResult, winningAngle);
                            }
                        });
                    });

                } else {
                    // alert('An error occurred. Game cancelled.');
                    swal({
                        title: gettext("LANG_JS_ERROR"),
                        text: gettext('LANG_JS_AN_ERROR_OCCURRED'),
                        icon: "warning",
                        button: gettext("LANG_JS_OK"),
                    });
                    reset();
                    isWheelRunning = false;
                }

            } else {
                // rotate the wheel while we wait for the server response
                nextRotation += spinFullRound;

                TweenMax.to(el, 0.5, {
                    rotation: nextRotation, ease: Linear.easeNone, onComplete: function () {
                        runLoop();
                    }
                });

            }

        }

        // runs after the spin is complete
        function onComplete(result, winningAngle) {
            currentAngle[activeWheel] = winningAngle;

            // if (activeWheel === 'blue' && winnings === 'bonus') {
            //     // if we hit the bonus field, run the bonus game
            //     runBonus(result);
            // } else {
            //     completeRun(result);
            // }
            completeRun(result);
            // var reward = result.winning;
            // // reward = 'jackpot';
            // if(reward){
            //     if(reward == 'giftbox'){
            //         $('#reward-box img').attr('src','/static/images/wheel/box2.png');
            //     }else if(reward == 'money'){
            //         $('#reward-box img').attr('src','/static/images/wheel/coins2.png');
            //     }else if(reward == 'shift'){
            //         $('#reward-box img').attr('src','/static/images/wheel/chips2.png');
            //     }else{
            //         $('#reward-box , #bg-jackpot-box , #bg-jackpot').css({
            //             'display': 'inline'
            //         });
            //         $('#reward-box img').css({
            //             'margin-top': '0',
            //             'animation': 'none',
            //             'width': '350px'
            //         });
            //         $('#reward-box img').attr('src','/static/images/wheel/jackpot2.png');
            //     }
            //     $('#reward-box').css('display','inline');
            //     $('#reward-box').removeClass('hide');
            //     $('#reward-box').addClass('show');
            //     $('#reward-box img').css('display','inline');
            // }

        }
    }

    // the spin is done
    function completeRun(spinResult) {
        if (winBonusCode != '') {
            showInfoBox(spinResult);
        }
        if (spinResult.winning != 'jackpot') {
            giveUserBonusCode(winBonusCode);
        } else {
            setTimeout(function () {
                hideInfoBox();
            }, 10000);
        }
        getAvailableSpins();

        setTimeout(function () {
            isWheelRunning = false;
            console.log('test')
        }, 100);
    }

    // reset the game for next spin
    function reset() {
        var el = getWheelElement();
        TweenMax.to(el, 0, { rotation: currentAngle[activeWheel], ease: Linear.easeNone });
        resetBonus();
        hideInfoBox();
    }

    // animation for changing the wheel, if the overlay is open while we need to do that
    function showWheel(wheel) {
        if (activeWheel === wheel) {
            return;
        }

        if (wheel === 'gold') {
            // start the gold wheel animation
            goldWheelAnimation();
        }

        var currentWheel = jQuery(getWheelElement()).parent();
        activeWheel = wheel;
        var newWheel = jQuery(getWheelElement()).parent();

        currentWheel.fadeOut(function () {
            newWheel.fadeIn();
        });

    }

    // helper for getting the active wheel
    function getWheelElement(wheelType) {
        return (activeWheel === 'gold') ? goldWheel : blueWheel;
    }

    // set what has been won
    function setWinnings(win, bonus, bonusCode, freeSpinsMachine) {
        if (typeof positions[activeWheel] === 'undefined' || positions[activeWheel][win] === 'undefined') {
            possibleStopPositions = [0];
        } else {
            freeSpinsOnMachine = freeSpinsMachine;
            winnings = win;
            possibleStopPositions = positions[activeWheel][win];

            if (activeWheel === 'blue' && win === 'bonus') {
                bonusPrize = $.inArray(bonus + '', possibleBonuses) ? bonus + '' : 'dud';
            } else {
                bonusPrize = '';
            }

            winBonusCode = bonusCode;
            console.log('winBonusCode', winBonusCode);
        }
    }

    // animations for the gold wheel
    function goldWheelAnimation() {
        var currentLightAnimation = 1,
            currentArrowAnimation = 1,
            goldLights = document.getElementById('wheel-gold-lights'),
            goldArrow = document.getElementById('wheel-gold-arrow');

        function lightAnimation() {
            currentLightAnimation++;
            if (currentLightAnimation > 3) {
                currentLightAnimation = 1;
            }
            goldLights.className = 'wheel-gold-lights__' + currentLightAnimation;
        }

        function arrowAnimation() {
            currentArrowAnimation++;
            if (currentArrowAnimation > 8) {
                currentArrowAnimation = 1;
            }
            goldArrow.className = 'wheel-gold-arrow__' + currentArrowAnimation;
        }

        setInterval(arrowAnimation, 200);
        setInterval(lightAnimation, 300);
    }

    //////////////////////////////////
    // GAME OVERLAY
    //////////////////////////////////

    // show/hide the game overlay
    function showGame(show) {
        if (show && jQuery('#wheel-game-wrapper').is(':visible')) {
            return;
        }

        var game = jQuery('#wheel-game-wrapper'),
            overlay = jQuery('#wheel-game-overlay');

        //game.show();
        var gameHeight = jQuery('#wheel-game').height();


        jQuery('.content_wrapper').first().css('minHeight', gameHeight + 'px');

        var closedTopPosition = -gameHeight - 150;

        if (show) {

            game.css({
                top: closedTopPosition + 'px',
                overflowY: 'scroll'
            });
            game.show();
            game.animate({ 'top': 0 }, 600);

            jQuery('body').css({
                overflow: 'hidden'
            });

            //
            overlay.fadeIn();
            //


        } else {
            jQuery('body').css({
                overflow: 'auto'
            });

            game.css({
                overflowY: 'hidden'
            });
            game.animate({ 'top': closedTopPosition }, 600, function () {
                game.hide();
            });
            overlay.fadeOut();


        }
    }


    //////////////////////////////////
    // BONUS GAME
    //////////////////////////////////

    // the bonus game
    function runBonus(spinResult) {

        var currentBonusAnimation = -1,
            bonus = document.getElementById('wheel-blue-bonus-prizes'),
            prizes = shuffleArray(jQuery(bonus).find('.wheel-blue-prize')),
            shuffleRuns = 0; // number of highlights

        // method for running the bonus game
        function shuffle(stopNow, stopAtBonus) {
            // remove the last highlighted
            if (currentBonusAnimation != -1) {
                jQuery(prizes[currentBonusAnimation]).removeClass('on');
            }

            // make sure we get the next bonus in the array
            currentBonusAnimation++;
            if (currentBonusAnimation > 7) {
                currentBonusAnimation = 0;
            }
            var currentBonus = jQuery(prizes[currentBonusAnimation])

            // hightligt it
            currentBonus.addClass('on');

            // determine if we should stop at the bonus field
            var foundStopBonus = false;
            if (stopNow && currentBonus.attr('data-prize') === stopAtBonus) {
                foundStopBonus = true;
            }

            // keep running until we have run the required amount of times or found the one we needed
            shuffleRuns++;
            var minRuns = 14;
            if (shuffleRuns < minRuns || !foundStopBonus) {

                // run it again
                setTimeout(function () {
                    shuffle(shuffleRuns >= minRuns, stopAtBonus);
                }, 200);

            } else {
                completeRun(spinResult);
            }
        }

        // start the bonus game
        shuffle(false, bonusPrize);

    }

    // helper needed to shuffle elements
    function shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    // reset the bonus game
    function resetBonus() {
        jQuery('#wheel-blue-bonus-prizes').find('.wheel-blue-prize.on').each(function () {
            jQuery(this).removeClass('on');
        })
    }


    //////////////////////////////////
    // INFO BOX
    //////////////////////////////////


    var runWinAnimations = false;

    // shows the info box which shows what the wheel stopped on
    // function showInfoBox() {
    //     var box = jQuery('#wheel-prize-info-box');
    //     if (box.is(':visible')) {
    //         return;
    //     }

    //     box.find('.wheel-prize-info-box-button')
    //         .off('click')
    //         .on('click', hideInfoBox);


    //     var getText = function (wheel, winning, bonus) {
    //         var text = '';
    //         if (typeof wheelInfoBoxText[wheel] !== 'undefined' && typeof wheelInfoBoxText[wheel][winning] !== 'undefined') {
    //             if (winning === 'bonus') {
    //                 if (typeof wheelInfoBoxText[wheel][winning][bonus] !== 'undefined') {
    //                     text = wheelInfoBoxText[wheel][winning][bonus];
    //                 }
    //             } else {
    //                 text = wheelInfoBoxText[wheel][winning];
    //             }
    //         }

    //         return text;
    //     };

    //     // prepare the relevant text and show the box
    //     var winText = getText(activeWheel, winnings, bonusPrize);
    //     winText = winText.replace("[free_spins_machine]", freeSpinsOnMachine);

    //     box.find('.win-text').html(winText)


    //     var spinResult = (winnings === 'dud' || bonusPrize === 'dud') ? 'lose' : 'win';
    //     box.removeClass('win lose').addClass(spinResult);

    //     // check if there are more than 1 (the one just used) left and show the appropriate text
    //     if (hasSpinsLeft(1)) {
    //         box.find('.no-more-spins-text').hide();
    //     } else {
    //         // this was the last spin
    //         box.find('.no-more-spins-text').show();
    //     }

    //     box.show();

    //     // show win animation if the user won
    //     if (spinResult === 'win') {
    //         runWinAnimations = true;
    //         for (var i = 0; i < 30; i++) {
    //             setTimeout(function () {
    //                 createInfoBoxWinAnimation();
    //             }, (100 * (i + 2)))
    //         }
    //     }

    // }

    function showInfoBox(result) {
        var reward = result.winning;
        // reward = 'jackpot';
        //  var bonuscode = 'FFFACAAD'
        if (reward) {
            $('.show-reward img').attr('class', '');
            if (reward == 'giftbox') {
                $('.show-reward img').addClass('nomal-cal');
                $('#reward-box img').attr('src', '/static/images/wheel/box2.png');
            } else if (reward == 'money') {
                $('.show-reward img').addClass('nomal-cal');
                $('#reward-box img').attr('src', '/static/images/wheel/coins2.png');
            } else if (reward == 'shift') {
                $('.show-reward img').addClass('nomal-cal');
                $('#reward-box img').attr('src', '/static/images/wheel/chips2.png');
            } else {
                $('.show-reward img').addClass('jp-cal');
                $('.swal-overlay').css('background-color', 'rgba(0,0,0,.6)');
                $('#reward-box img').attr('src', '/static/images/wheel/jackpot3.gif');
            }
            $('#reward-box').css('display', 'inline');
            $('#reward-box').removeClass('hide');
            $('#reward-box').addClass('show');
            $('#reward-box img').css('display', 'inline');
            if (reward == 'jackpot') {
                $('.text-reward').html(gettext('LANG_JS_CONGRATULATIONS_TO' + ' ' + reward + '<br>Your bonus bode ' + result.bonuscode + '<br> Please contact to pwr for claim jackpot <br> You can check the bonus in the inbox.'));
            } else {
                $('.text-reward').html(gettext('LANG_JS_CONGRATULATIONS_TO' + ' ' + reward + '<br>Your bonus bode ' + result.bonuscode + '<br> You can check the bonus in the inbox.'));
            }
        }

    }

    // hides the info box
    function hideInfoBox() {
        // jQuery('#wheel-prize-info-box').hide();
        // runWinAnimations = false;

        // if (canPlayWheel()) {
        //     showCurrentWheel();
        // } else {
        //     showCurrentWheel();
        //     showGame(false);
        // }
        $('#reward-box').removeClass('show');
        $('#reward-box').addClass('hide');
        $('#reward-box , #bg-jackpot-box , #bg-jackpot , #reward-box img').css({
            'display': 'none'
        });

    }

    // animation for the info box
    function createInfoBoxWinAnimation() {

        var box = jQuery('#wheel-prize-info-box'),
            boxWidth = box.width(),
            parentWidth = box.parent().width(),
            parentHeight = box.parent().height();

        // create coin animation
        (function () {
            var ani = jQuery('<div />');

            // random positioning
            var randomX = Math.random() * (parentWidth / 2),
                randomY = Math.random() * (parentHeight / 2);

            randomX += (Math.random() > 0.5) ? boxWidth / 2 : -boxWidth / 2;

            ani.css({
                position: 'absolute',
                top: randomY,
                left: randomX,
            });

            // insert the animation
            box.after(ani);

            // loop to run the animation
            var currentLightAnimation = 0;

            function runAnimation() {

                ani.attr('class', 'wheel-win-gold wheel-win-gold__' + currentLightAnimation);

                currentLightAnimation++;
                if (currentLightAnimation > 50) {
                    // when the animation is done, remove it and create a new one
                    ani.remove();
                    createInfoBoxWinAnimation();
                } else {

                    // keep looping the animation as long as boolean is not false
                    if (runWinAnimations) {
                        setTimeout(runAnimation, 50);
                    } else {
                        // if bool is false, remove the animation
                        ani.remove();
                    }
                }
            }

            // start the animation
            runAnimation();
        })();


    }


    // run setup
    jQuery(function () {
        setup();
    });

    // public methods
    return {
        // run the currently active wheel
        run: function () {
            run();
        },

        // set the active wheel
        setActive: function (wheel) {
            showWheel(wheel);
        },

        // show/hide the game overlay
        showGame: function (show) {
            showGame(show);
        }
    }

})();

jQuery(function () {
    jQuery('#open-wheel').on('click', function (e) {
        e.preventDefault();
        WHEEL.showGame(true);
    })
});
