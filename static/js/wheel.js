
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
                run();
                // if (gameIsAvailable) {
                //     if (isLogin) {
                //         if (gameIsAvailable) {
                //             run();
                //         }
                //     } else {
                //         $('#loginModal').modal('show');
                //         return false;
                //     }
                // }
            });

    }


    //////////////////////////////////
    // USER HANDLING
    //////////////////////////////////

    var userSession = null;

    // get user session from everymatrix
    jQuery(function () {
        c.doCall(initUserSession);
        // $.ajax({
        //     url: '/api/get_bonus_code',
        //     type: 'POST',
        //     method: 'POST',
        //     data: {
        //         // user_id: userID
        //     },
        //     success: function (result) {
        //         // inbox_result.list = JSON.parse(result);
        //         console.log('inbox_result',result)
        //         // setDataShowInbox(inbox_result);
        //     },
        //     error: function (xhr, errmsg, err) {
        //         console.log(err);
        //     }
        // });
    });

    function getAvailableSpins(newTransactions, callback) {
        if (!userId) {
            gameIsAvailable = false;
            $('.loading').hide();
            return;
        }
        
        var transactions = newTransactions || {};

        $.ajax({
            url: '/api/get_spins',
            type: 'POST',
            method: 'POST',
            data: {
                user_id: userId,
                transactions: JSON.stringify(transactions),
                vendor:vendor,
                // game_type: deposit_lv
            },
            success: function (result) {
                console.log('result',result);
                // $('#circle_spin').hide();
                // availableSpins = result.spins;
                // console.log('dp', deposit_lv)
                // console.log('availableSpins', availableSpins)
                // showSpinsText();
                // gameIsAvailable = canPlayWheel() ? true : false;
                // console.log('gameIsAvailable', gameIsAvailable)
                // if (gameIsAvailable) {
                //     if (availableSpins['level_' + deposit_lv] > 1) {
                //         $('.txt-available').find('span').html(gettext('You have ') + availableSpins['level_' + deposit_lv] + ' ' + gettext('spins'))
                //     } else {
                //         $('.txt-available').find('span').html(gettext('You have ') + availableSpins['level_' + deposit_lv] + ' ' + gettext('spin'))
                //     }
                // }

                // if (gameIsAvailable && result.show_game) {
                //     showGame(true)
                // }

                // if (typeof callback === 'function') {
                //     callback();
                // }
            },
            error: function (xhr, errmsg, err) {
                $('.loading').hide();
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

    function showCurrentWheel(session,transaction) {
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
                $('.wheel-reward-img').attr('src', cdn_link + '/static/images/wheel/wheel-desktop_LV' + deposit_lv + '.png');
                $('.wheel-button-img').attr('src', cdn_link + '/static/images/wheel/point-desktop_LV' + deposit_lv + '.png');
            }
            $('.wheel-reward-img').show();
            $('.wheel-button-img').show();
            /* END CONVERSE CURRENCY POWERBAR */
            // $('.loading').hide();
            getAvailableSpins(transaction)
        }, function (err) {
            $('.loading').hide();
        });

    }

    // wrapper for handling the user session, returned by everymatrix
    function initUserSession(session) {
        $('.loading').show();
        // $('#circle_spin').show();
        userSession = session;
        // logged in
        var authCallback = function (session, userData) {
            userId = userData.userID;
            userEmail = userData.email;

            console.log('login true');
            getTransactions(session, function (newTransactions) {
                getAvailableSpins(newTransactions, function () {
                    // showCurrentWheel(session,newTransactions);
                });
            });
        };

        // not logged in
        var noAuthCallback = function () {
            userId = null;
            userEmail = null;
            gameIsAvailable = false;
            console.log('login fales')
        };
        
        if(session_id != 'Anonymous'){
            var parameters = {
                'sessionID': session_id
            };
            console.log('param',parameters)
            session.call("/user#loginWithCmsSessionID", [],parameters).then(
                function (result) {
                    // console.log('result',result)
                    checkAuthentication(session, authCallback, noAuthCallback);
                },
                function (err) {
                    // console.log('err',err)
                    checkAuthentication(session, authCallback, noAuthCallback);
                }
            );
        }else{
            checkAuthentication(session, authCallback, noAuthCallback);
        }
        // check authentication. With callbacks to handle result
        // checkAuthentication(session, authCallback, noAuthCallback);
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


    // get the last recorded transaction
    function giveUserBonusCode(bonusCode) {
        //return; // this is commented out, because we no longer give the bonus code automatically. We send an email to admin who will give it manually.

        if (bonusCode === '') {
            hideInfoBox();
            swal({
                title: gettext("Warning!"),
                text: gettext("Don't have bonus code. Could you contact PWR.bet"),
                icon: "warning",
                button: gettext("OK"),
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
                    title: gettext("Warning!"),
                    text: err.kwargs.desc + ' ' + gettext('Could you contact PWR.bet'),
                    icon: "warning",
                    button: gettext("OK"),
                });
            });
        } catch (e) {
            $('.waiting-api').css('display', 'none');
            hideInfoBox();
            swal({
                title: gettext("Warning!"),
                text: gettext('Error giving bonus code') + e + ' ' + gettext('Could you contact PWR.bet'),
                icon: "warning",
                button: gettext("OK"),
            });
            // console.log('error giving bonus code', e);
        }

    }

    // get transactions from everymatrix
    function getTransactions(session, callback) {

        // first we check when the last transaction was logged
        $.ajax({
            url: '/api/get_last_transaction',
            type: 'POST',
            method: 'POST',
            data: {
                user_id: userId,
                vendor:vendor
            },
            success: function (transaction) {
                var transactionStartTime = (transaction.transaction_date === null) || (typeof transaction.transaction_date === 'undefined') ? '2016-09-15T00:00:00.000Z' : transaction.transaction_date;
                getTransactionFromAPI(session, transactionStartTime);
            },
            error: function (xhr, errmsg, err) {
                $('.loading').hide();
            }
        });
        // var transactionStartTime = '2016-09-15T00:00:00.000Z';
        // getTransactionFromAPI(session, transactionStartTime);

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
                console.log('trrassad',response)
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

        TweenMax.to(el, 2, { rotation: nextRotation, ease: Power1.easeIn, onComplete: runLoop });

        var spinResult = null;
        // play the spin on the server
        // $.ajax({
        //     url: '/wheel/spin',
        //     type: 'POST',
        //     method: 'POST',
        //     data: {
        //         wheel: deposit_lv,
        //         user_id: userId,
        //         user_email: userEmail,
        //         lv: deposit_lv
        //     },
        //     success: function (json) {
        //         console.log("Spin :", json)
        //         spinResult = json;
        //         setWinnings(json.winning, json.bonus, json.bonuscode, json.free_spins_machine);

        //     },
        //     error: function (xhr, errmsg, err) {
        //         spinResult = {
        //             error: err
        //         };
        //         console.log("error :", err);
        //     }
        // });
        setTimeout(function(){
            spinResult = {
                data:'ssss'
            }
            data_win = ['giftbox', 'money', 'shift','jackpot']
            // Math.floor(Math.random() * 4) + 1  ;
            // possibleBonuses
            random_bonus = data_win[(Math.floor(Math.random() * data_win.length) + 1)-1]
            console.log('rand bonus',random_bonus)
            setWinnings(random_bonus,'','','')
        },1000)

        // the spinning loop
        function runLoop() {

            if (spinResult) {
                // we got the result back from the server

                if (!spinResult.error) {
                    console.log('possibleStopPositions',possibleStopPositions)
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
                        title: gettext("Error!"),
                        text: gettext('An error occurred. Game cancelled.'),
                        icon: "warning",
                        button: gettext("OK"),
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
            // completeRun(result);
            setTimeout(function () {
                isWheelRunning = false;
            }, 100);

        }
    }

    // the spin is done
    function completeRun(spinResult) {
        if (winBonusCode != '') {
            showInfoBox(spinResult);
        }
        giveUserBonusCode(winBonusCode);
        getAvailableSpins();

        setTimeout(function () {
            isWheelRunning = false;
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
            // alert(win)
            freeSpinsOnMachine = freeSpinsMachine;
            winnings = win;
            possibleStopPositions = positions[activeWheel][win];

            if (activeWheel === 'blue' && win === 'bonus') {
                bonusPrize = $.inArray(bonus + '', possibleBonuses) ? bonus + '' : 'dud';
            } else {
                bonusPrize = '';
            }
            console.log('possibleStopPositions setwin',positions)
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

    

    function showInfoBox(result) {
        var reward = result.winning;
        // reward = 'jackpot';
        //  var bonuscode = 'FFFACAAD'
        if (reward) {
            $('.show-reward img').attr('class', '');
            if (reward == 'giftbox') {
                $('.show-reward img').addClass('nomal-cal');
                $('#reward-box img').attr('src', cdn_link + '/static/images/wheel/box2.png');
            } else if (reward == 'money') {
                $('.show-reward img').addClass('nomal-cal');
                $('#reward-box img').attr('src', cdn_link + '/static/images/wheel/coins2.png');
            } else if (reward == 'shift') {
                $('.show-reward img').addClass('nomal-cal');
                $('#reward-box img').attr('src', cdn_link + '/static/images/wheel/chips2.png');
            } else {
                $('.show-reward img').addClass('jp-cal');
                $('.swal-overlay').css('background-color', 'rgba(0,0,0,.6)');
                $('#reward-box img').attr('src', cdn_link + '/static/images/wheel/jackpot3.gif');
            }
            $('#reward-box').css('display', 'inline');
            $('#reward-box').removeClass('hide');
            $('#reward-box').addClass('show');
            $('#reward-box img').css('display', 'inline');
            if (reward == 'jackpot') {
                $('.text-reward').html(gettext('Congratulations to ' + reward +  '<br> Please contact to pwr for claim jackpot <br> You can check the bonus in the inbox.'));
            } else {
                $('.text-reward').html(gettext('Congratulations to ' + reward +  '<br> You can check the bonus in the inbox.'));
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

// jQuery(function () {
//     jQuery('#open-wheel').on('click', function (e) {
//         e.preventDefault();
//         WHEEL.showGame(true);
//     })
// });
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
jQuery(function () {
    var csrftoken = getCookie('csrftoken');
     $('[name="csrfmiddlewaretoken"]').val(csrftoken)
     $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
                // Only send the token to relative URLs i.e. locally.
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });
    var winWidth = $(window).width();
    var winHeight = $(window).height();
    var navHeight = $('.fixed-nav.bg-dark').height();
    var fixHeight = winHeight - navHeight;
    var padding = 0;
    var paddingTop = 0;
    var paddingHeight = 0;
    if (winWidth <= 2000 && winWidth > 1600) {
        padding = 90;
        paddingTop = padding / 2;
    } else if (winWidth <= 1600 && winWidth > 1300) {
        padding = 80;
        paddingTop = padding / 2;
    } else if (winWidth <= 1300 && winWidth > 768) {
        padding = 60;
        paddingTop = padding / 2;
    } else if (winWidth <= 768 && winWidth > 414) {
        fixHeight = fixHeight - 68;
        padding = 50;
        paddingTop = padding / 2;
    } else if (winWidth <= 414 && winWidth > 375) {
        fixHeight = fixHeight - 68;
        padding = 50;
        paddingTop = padding / 2;
        if (window.orientation == 0) {
            $('#wheel-blue').css('margin-left', '50px');
        } else {
            $('#wheel-blue').css('margin-left', '0px');
        }
    } else if (winWidth <= 375 && winWidth > 360) {
        fixHeight = fixHeight - 68;
        padding = 50;
        paddingTop = padding / 2;
        if (window.orientation == 0) {
            $('#wheel-blue').css('margin-left', '50px');
        } else {
            $('#wheel-blue').css('margin-left', '0px');
        }
    } else if (winWidth <= 360 && winWidth > 320) {
        fixHeight = fixHeight - 68;
        padding = 50;
        paddingTop = padding / 2;
        if (window.orientation == 0) {
            $('#wheel-blue').css('margin-left', '50px');
        } else {
            $('#wheel-blue').css('margin-left', '0px');
        }
    } else if (winWidth <= 320) {
        fixHeight = fixHeight - 60.2;
        padding = 50;
        paddingTop = padding / 2;
        if (window.orientation == 0) {
            $('#wheel-blue').css('margin-left', '50px');
        } else {
            $('#wheel-blue').css('margin-left', '0px');
        }
    }

    paddingHeight = fixHeight - padding;
    halfPaddingHeight = paddingHeight / 2;

    $('#wheel-game').css('height', fixHeight);
    $('.wheel-inner.wheel-blue').css('height', fixHeight);
    $('#wheel-blue').css('height', paddingHeight);
    $('#wheel-blue').css('margin-top', paddingTop);
    $('.wheel-button').css('width', paddingHeight);
    $('.wheel-button').css('height', paddingHeight);
    $('.wheel-button').css('top', '50%');
    $('.wheel-button').css('left', '50%');
    $('.wheel-button').css('margin-top', -halfPaddingHeight);
    if (winWidth <= 414 && winWidth > 375) {
        $('.wheel-button').css('margin-left', '-136px');
    } else if (winWidth <= 375 && winWidth > 360) {
        $('.wheel-button').css('margin-left', '-117px');
    } else if (winWidth <= 360 && winWidth > 320) {
        $('.wheel-button').css('margin-left', '-109px');
    } else if (winWidth <= 320 && winWidth > 0) {
        $('.wheel-button').css('margin-left', '-90px');
    } else {
        $('.wheel-button').css('margin-left', -halfPaddingHeight);
    }
    // $('#wheel-blue').css('display', 'inline');
    // $('.wheel-button').css('display', 'inline');

    $(window).resize(function () {
        var winWidth = $(window).width();
        var winHeight = $(window).height();
        var navHeight = $('.fixed-nav.bg-dark').height();
        var fixHeight = winHeight - navHeight;
        var padding = 0;
        var paddingTop = 0;
        var paddingHeight = 0;

        if (winWidth <= 2000 && winWidth > 1600) {
            padding = 90;
            paddingTop = padding / 2;
        } else if (winWidth <= 1600 && winWidth > 1300) {
            padding = 80;
            paddingTop = padding / 2;
        } else if (winWidth <= 1300 && winWidth > 768) {
            padding = 60;
            paddingTop = padding / 2;
        }

        if (window.orientation == 0) {
            if (winWidth <= 768 && winWidth > 414) {
                fixHeight = fixHeight - 68;
                padding = 50;
                paddingTop = padding / 2;
            } else if (winWidth <= 414 && winWidth > 375) {
                fixHeight = fixHeight - 68;
                padding = 50;
                paddingTop = padding / 2;
                $('#wheel-blue').css('margin-left', '50px');
            } else if (winWidth <= 375 && winWidth > 360) {
                fixHeight = fixHeight - 68;
                padding = 50;
                paddingTop = padding / 2;
                $('#wheel-blue').css('margin-left', '50px');
            } else if (winWidth <= 360 && winWidth > 320) {
                fixHeight = fixHeight - 68;
                padding = 50;
                paddingTop = padding / 2;
                $('#wheel-blue').css('margin-left', '50px');
            } else if (winWidth <= 320) {
                fixHeight = fixHeight - 60.2;
                padding = 50;
                paddingTop = padding / 2;
                $('#wheel-blue').css('margin-left', '50px');
            }
        } else {
            if (winWidth <= 768 && winWidth > 414) {
                fixHeight = fixHeight - 68;
                padding = 50;
                paddingTop = padding / 2;
                $('#wheel-blue').css('margin-left', '0px');
            } else if (winWidth <= 414 && winWidth > 375) {
                fixHeight = fixHeight - 68;
                padding = 50;
                paddingTop = padding / 2;
                $('#wheel-blue').css('margin-left', '0px');
            } else if (winWidth <= 375 && winWidth > 360) {
                fixHeight = fixHeight - 68;
                padding = 50;
                paddingTop = padding / 2;
                $('#wheel-blue').css('margin-left', '0px');
            } else if (winWidth <= 360 && winWidth > 320) {
                fixHeight = fixHeight - 68;
                padding = 50;
                paddingTop = padding / 2;
                $('#wheel-blue').css('margin-left', '0px');
            } else if (winWidth <= 320) {
                fixHeight = fixHeight - 60.2;
                padding = 50;
                paddingTop = padding / 2;
                $('#wheel-blue').css('margin-left', '0px');
            }
        }

        paddingHeight = fixHeight - padding;
        halfPaddingHeight = paddingHeight / 2;

        $('#wheel-game').css('height', fixHeight);
        $('.wheel-inner.wheel-blue').css('height', fixHeight);
        $('#wheel-blue').css('height', paddingHeight);
        $('#wheel-blue').css('margin-top', paddingTop);
        $('.wheel-button').css('width', paddingHeight);
        $('.wheel-button').css('height', paddingHeight);
        $('.wheel-button').css('top', '50%');
        $('.wheel-button').css('left', '50%');
        $('.wheel-button').css('margin-top', -halfPaddingHeight);
        if (winWidth <= 414 && winWidth > 375) {
            $('.wheel-button').css('margin-left', '-136px');
        } else if (winWidth <= 375 && winWidth > 360) {
            $('.wheel-button').css('margin-left', '-117px');
        } else if (winWidth <= 360 && winWidth > 320) {
            $('.wheel-button').css('margin-left', '-109px');
        } else if (winWidth <= 320 && winWidth > 0) {
            $('.wheel-button').css('margin-left', '-90px');
        } else {
            $('.wheel-button').css('margin-left', -halfPaddingHeight);
        }
    });
});