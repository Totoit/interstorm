var isLogin = false;
var _firstname = "";
var _userID = "";
var _telephone = "";
var getParamUrl = new URLSearchParams(window.location.search);
var isUKGC = '';
var deposit_lv = 1;
var _firstLogin = "";
var CurrentSearchUrl = window.location.search;
//gameShowPerClick is parameter for show many game-box per Click Load More
var gameShowPerClick = 15;
var gameShowPerClickForPopular = 15;

if( $(window).width() <= 450 ){
    gameShowPerClick = 14;
    gameShowPerClickForPopular = 14;
} 

var gameIndex = [];
for(j = 0; j<4; j++){
    gameIndex[j]=gameShowPerClick;
}

gameindex = gameShowPerClick;
gameindexforPopoular = gameShowPerClickForPopular;


if (CurrentSearchUrl != '') {
    if (CurrentSearchUrl.includes("ismob")) {
        // document.cookie = "ismob=has";
        setCookie('ismob', 'has', 36500);
    }
}

//fucntion show games first by Tae 14-12-2018
function removeHiddenGame(boxID){
    for (i = 0; i < gameShowPerClick; i++) { 
        $('#'+boxID).find('.game-'+i).removeClass('hidden');
        // console.log(boxID,'--->>');
    }
    var maxGame = $('#'+boxID).find('.game-box:last-child').attr('game-count');
    console.log(boxID+' ---- Max Game =' + maxGame)
    // console.log('----- Game show per click' + gameShowPerClick);
    if (maxGame >= gameShowPerClick){
        $('#'+boxID+' .row-btn-load-more-game').removeClass('hidden');
    }
    if (maxGame < gameShowPerClick){
        $('#'+boxID+' .row-btn-load-more-game').addClass('hidden');
    }
    if (maxGame == undefined){
        $('#'+boxID+' .row-btn-load-more-game').addClass('hidden');
    }
}

// function removeHiddenGameFromPopular(currentID){
//     // var currentID = 'home-pop-slot';
//     for (i = 0; i < gameShowPerClickForPopular; i++) {
//         // currentID = 'home-pop-slot'
//         $('#' + currentID).find('.game-' + i).removeClass('hidden');
//     }

//     var maxGame = $('#' + currentID + ' .game-box:last-child').attr('game-count');

//     // console.log('maxGame P = '+ maxGame);
//     // console.log('----- Game show per click : ' + gameShowPerClickForPopular);

//     if (maxGame >= gameShowPerClickForPopular){
//         $('#' + currentID +' .row_loadmore_btn').removeClass('hidden');
//     }
//     if (maxGame < gameShowPerClickForPopular){
//         $('#' + currentID +' .row_loadmore_btn').addClass('hidden');
//     }
//     if (maxGame == undefined){
//         $('#' + currentID +' .row_loadmore_btn').addClass('hidden');
//     }
// }


$(document).ready(function () {
    
    $('.cookie-policy-close').click(function () {
        document.cookie = "cookie_policy=true";
        $('.cookie-policy').addClass('hidden');
    });
    // var fav_payload = {
    //     "filterByPlatform": getFilterByPlatform(),
    //     "filterByType": [],
    //     "anonymousUserIdentity": "",
    //     "expectedGameFields": 8201,
    //     "expectedTableFields": 67117064
    //   };
    //   console.log('fav_payload',fav_payload);
    // getFavGamesList('','',fav_payload);

    $(".loadmore_btn").click(function () {

        var boxID = $(this).attr('box-id');
        var allGameBoxCount = $('#'+boxID+ ' .game-box:last-child').attr('game-count');
        console.log('boxID: '+boxID);
        console.log('allGameBoxCount: '+allGameBoxCount);

        if (gameindexforPopoular <= allGameBoxCount) {
            for (i = (gameindexforPopoular); i < (gameindexforPopoular) + gameShowPerClickForPopular; i++) {
                $('#'+boxID+' .game-' + i).removeClass('hidden');
            }

            gameindexforPopoular = gameindexforPopoular + gameShowPerClickForPopular;
        }

        if (gameindexforPopoular > allGameBoxCount) {
            $('#'+boxID+' .row_loadmore_btn').addClass('hidden');
        }
    });

    var mobCokie = document.cookie.replace(/(?:(?:^|.*;\s*)ismob\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    // console.log('mobCokie: '+mobCokie);
    if (mobCokie == 'has') {
        $('.nav-item:last-child').css('display', 'none');
    } else {
        $('.nav-item:last-child').css('display', 'inline');
    }
});

checkVisbleColList();
navResponsiveAddHTML();

// if (location.hostname !== "localhost" && location.hostname !== "127.0.0.1" && location.hostname !== "stage.pwr.bet") {
//     console.log = function () {};
// }

var isUserChangelanguage = sessionStorage.getItem("user_changelang");

function setEachRow(className, eachRow) {
    if ($(className).length) {
        var i = 0;
        var maxHeight = 0;
        $(className).each(function () {
            i++;
            var height = $(this).height();
            if (height > maxHeight) {
                maxHeight = height;
            }
            if (i % eachRow == 0) {
                var index = i - 1;
                for (var j = 0; j < eachRow; j++) {
                    var eq = index - j;
                    $(className + ':eq(' + eq + ')').height(maxHeight);
                }
                maxHeight = 0;
            }
        });
    }
}

function UserChangelang() {
    sessionStorage.setItem("user_changelang", true);
    document.cookie = "user_changelang=true";
}

window.onresize = function () {
    checkVisbleColList();
    navResponsiveAddHTML();
}

function checkVisbleColList() {
    $('.footer-sitemap .item-sitemap').removeAttr('style');
    if ($(window).width() <= 736) {
        var footerMaxTime = 5000
        var footerStartTime = Date.now();
        var footerInterval = setInterval(function () {
            if ($('.footer-sitemap .item-sitemap').is(':visible')) {
                setEachRow('.footer-sitemap .item-sitemap', 3);
                clearInterval(footerInterval);
            } else {
                if (Date.now() - footerStartTime > footerMaxTime) {
                    clearInterval(footerInterval);
                }
            }
        }, 200);
    }
}

function navResponsiveAddHTML() {
    $('#navbarResponsive span.for-make-down').html("");
    if ($(window).width() < 1100) {
        var footerMaxTime = 5000
        var footerStartTime = Date.now();
        var footerInterval = setInterval(function () {
            if ($('#navbarResponsive span.for-make-down').is(':visible')) {
                $('#navbarResponsive span.for-make-down').html('<br>');
                clearInterval(footerInterval);
            } else {
                if (Date.now() - footerStartTime > footerMaxTime) {
                    clearInterval(footerInterval);
                }
            }
        }, 200);
    }
}

function superImage() {
    $('.square-box').each(function () {
        var parentThis = this;
        var image = new Image();
        image.src = $(parentThis).find('.square-thumbnail img').attr('src');
        image.onload = function () {
            var img_w = $(parentThis).find('.square-thumbnail img').width();
            var img_h = $(parentThis).find('.square-thumbnail img').height();
            var ratio_w = 1;
            var ratio_h = 1;
            if ($(parentThis).hasClass('box-4-3')) {
                ratio_w = 4;
                ratio_h = 3;
            } else if ($(parentThis).hasClass('box-3-2')) {
                ratio_w = 3;
                ratio_h = 2;
            } else if ($(parentThis).hasClass('box-16-9')) {
                ratio_w = 16;
                ratio_h = 9;
            } else if ($(parentThis).hasClass('box-2-1')) {
                ratio_w = 2;
                ratio_h = 1;
            } else if ($(parentThis).hasClass('box-12-5')) {
                ratio_w = 12;
                ratio_h = 5;
            } else if ($(parentThis).hasClass('box-21-9')) {
                ratio_w = 21;
                ratio_h = 9;
            } else if ($(parentThis).hasClass('box-4-1')) {
                ratio_w = 4;
                ratio_h = 1;
            } else {
                ratio_w = 1;
                ratio_h = 1;
            }
            if (ratio_w / ratio_h > img_w / img_h) {
                $(parentThis).find('.square-thumbnail img').addClass('portrait');
            }
            $(parentThis).find('.square-thumbnail img').removeClass('hide');
        }
    });
}

superImage();
setTimeout(function () {
    superImage();
}, 1000);

/* Manage Cookie */
function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
    $("#popup_acceptcookie").remove();
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999;';
}

if (getParamUrl.get('btag') != null && getParamUrl.get('btag') != '') {
    setCookie('pwr_btag', getParamUrl.get('btag'), 36500);
}
/* Manage Cookie End */

/* Show money */
function getSymbol(currency) {
    var returnvalue = "";
    if (currency == 'EUR') {
        returnvalue = "€";
    } else if (currency == 'NOK' || currency == 'SEK') {
        returnvalue = "kr";
    } else if (currency == 'GBP') {
        returnvalue = "£";
    }
    return returnvalue;
}

Number.prototype.formatMoney = function (c, d, t) {
    var n = this,
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
}


function getUserGlobal() {
    if (isLogin) {
        c.doCall(function (session) {
            session.call("/user/account#getProfile", [], {}).then(function (result) {
                _firstname = result.kwargs.fields.firstname;
                _userID = result.kwargs.fields.userID;
                _telephone = result.kwargs.fields.mobilePrefix + result.kwargs.fields.mobile;
                console.log('result.kwargs.fields.lastLogin', result.kwargs.fields);
                if (result.kwargs.fields.lastLogin == '0001-01-01T00:00:00') {
                    _firstLogin = true;
                    var login_count = 0;
                    if (localStorage.getItem("login-count") === null) {
                        login_count = 0;
                    } else {
                        login_count = parseInt(localStorage.getItem("login-count"));
                    }
                    console.log('login_count_g', login_count)
                    localStorage.setItem("login-count", (login_count + 1));
                } else {
                    _firstLogin = false;
                }
                console.log('_firstLogin', _firstLogin)
                $('._user_firstname').html(_firstname);
                callGetNotiPromotion(_userID);
                //   clearInterval(username_dots);
                $('#circle_usertname').hide();
                // $('#top_total_amount').show();
                $('#top_usertname').css('width', 'auto');
            });
            // session.call("/user#getCmsSessionID", [], {}).then(function (result) {
            //     setCookie('pwr_ss', result.kwargs.cmsSessionID, 36500);
            //     setFrameSport(getCookie("pwr_ss"));
            // });
        });
    }
}

function getMoney(session) {
    var _totalDeposits = 0;
    var _totalmoney = 0;
    var _totalall = 0;
    var _currencymoney = '';
    if (isLogin) {
        // $('.loading').show();

        session.call("/user/account#getGamingAccounts", [], {
            "expectBalance": true,
            "expectBonus": true,
            "expectBonus": true
        }).then(function (result) {
            //console.log("===getGamingAccounts===",result.kwargs);
            $.each(result.kwargs.accounts, function (index, value) {
                if (!value.isBonusAccount) {
                    _totalmoney += value.amount;
                    _currencymoney = value.currency;
                }
                _totalall += value.amount;
            });
            // $('.user_total_amount').html(_totalmoney.formatMoney(2, '.', ',') + ' ' + getSymbol(_currencymoney));

            if ($('.user_total_all_amount').length > 0) {
                $('.user_total_all_amount').html(_totalall.formatMoney(2, '.', ',') + ' ' + getSymbol(_currencymoney));
            }
            // clearInterval(dots);
            $('#circle_total_amount').hide();
            $('.user_total_amount').show();
            $('.m-btn-withdraw').css('width', 'auto');
        });

        session.call("/user#getNetDeposit", [], {}).then(function (result) {
            console.log("===getNetDeposit===",result.kwargs);
            var currencyWithdraw = "";
            var currencyTextDeposit = "";
            if (!result.kwargs.withdrawCurrency && result.kwargs.withdrawCurrency !== null) {
                currencyWithdraw = getSymbol(result.kwargs.withdrawCurrency);
            } else {
                currencyWithdraw = getSymbol(result.kwargs.depositCurrency);
            }
            _totalDeposits = result.kwargs.totalDeposits;
            if ($('.user_total_withdraws').length > 0) {
                $('.user_total_withdraws').html(_totalDeposits.formatMoney(2, '.', ',') + ' ' + getSymbol(result.kwargs.depositCurrency));
            }
            $('.user_total_amount').html(_totalDeposits.formatMoney(2, '.', ',') + ' ' + getSymbol(result.kwargs.depositCurrency));
            currencyTextDeposit = result.kwargs.depositCurrency;

            /* CONVERSE CURRENCY POWERBAR */
            var deposit_euro = 0;
            deposit_lv = 1;
            var deposit_lv_percent = 0;
            var payload = {
                "filterByPlatform": [],
                "expectedGameFields": 1106381
            };
            session.call("/casino#getJackpots", [], payload).then(function (result) {

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

                if (result.kwargs.jackpots.length > 0) {
                    if (result.kwargs.jackpots[0].amount.EUR > 0) {
                        if (currencyTextDeposit == 'NOK') {
                            deposit_euro = (_totalDeposits / (result.kwargs.jackpots[0].amount.NOK / result.kwargs.jackpots[0].amount.EUR));
                        } else if (currencyTextDeposit == 'SEK') {
                            deposit_euro = (_totalDeposits / (result.kwargs.jackpots[0].amount.SEK / result.kwargs.jackpots[0].amount.EUR));
                        } else if (currencyTextDeposit == 'GBP') {
                            deposit_euro = (_totalDeposits / (result.kwargs.jackpots[0].amount.GBP / result.kwargs.jackpots[0].amount.EUR));
                        } else {
                            deposit_euro = _totalDeposits;
                        }
                    }
                }
                //console.log(_totalDeposits+' '+currencyTextDeposit+" = "+deposit_euro+" EUR");
                if (deposit_euro < 500) {
                    deposit_lv = 1;
                    deposit_lv_percent = (deposit_euro / 500) * 100;
                } else if (deposit_euro >= 500 && deposit_euro < 2000) {
                    deposit_lv = 2;
                    deposit_lv_percent = ((deposit_euro - 500) / 1500) * 100;
                } else {
                    deposit_lv = 3;
                    deposit_lv_percent = 100;
                }
                // deposit_lv = 1;
                $('.user_level').html(deposit_lv);
                $('.user_level_percent').html(deposit_lv_percent.formatMoney(2, '.', ',') + "%");
                $('.lv_img').html('<img src="/static/images/lv/bar_lv' + deposit_lv + '.png" width="100">');
                $('.exp .inner').css('width', deposit_lv_percent + '%');
                $('#circle_lv_img').hide();
                $('#user_lv_img').css('height', 'auto');
            });
            /* END CONVERSE CURRENCY POWERBAR */
        });
    }
}

var isTabActive = true;

window.onfocus = function () {
    isTabActive = true;
    callGetMoney();
}

window.onblur = function () {
    isTabActive = false;
}

setInterval(function () {
    if (window.isTabActive && isLogin) {
        c.doCall(getMoney);
    }
}, 30000);

function callGetMoney() {
    if (window.isTabActive) {
        c.doCall(getMoney);
    }
}

/* Show money end */
function getcontent_ukgc() {
    if (isUKGC == '') {
        $.ajax('http://ip-api.com/json')
            .then(
                function success(response) {
                    console.log('response.countryCode', response.countryCode)
                    if (response.countryCode == 'GB') {
                        isUKGC = true;
                        $('.content-ukgc').show();
                    } else {
                        isUKGC = false;
                        $('.content-normal').show();
                    }
                },
                function fail(data, status) {
                    $('.content-normal').show();
                    console.log('Request failed.  Returned status of', status);
                }
            );
    } else {
        if (isUKGC) {
            $('.content-ukgc').show();
        } else {
            $('.content-normal').show();
        }
    }
}


function callGetNotiPromotion(_userID) {
    if ($(window).width() <= 768) {
        var promo = [];
        $.ajax({
            url: '/promotions/api/get_promotion_list/',
            type: 'POST',
            method: 'POST',
            data: {},
            success: function (data) {
                if (JSON.parse(data).length > 0) {
                    $.each(JSON.parse(data), function (index, value) {
                        promo.push(value.pk);
                    });
                    if (_userID == '') {
                        if (sessionStorage.getItem("pwr_noti_promo") != promo.join(',')) {
                            $('.promotion_noti_popup').show();
                        }
                    } else {
                        // console.log(sessionStorage.getItem("pwr_noti_promo_"+_userID)+"===="+promo.join(','));
                        if (sessionStorage.getItem("pwr_noti_promo_" + _userID) != promo.join(',')) {
                            $('.promotion_noti_popup').show();
                        } else {
                            $('.promotion_noti_popup').hide();
                        }
                    }
                }
            }
        });
    }
}

function showInputError(input, error) {
    $(input).addClass('is-invalid').after('<div class="invalid-feedback">' + error + '</div>');
}

function clearInputError() {
    $('.is-invalid').removeClass('is-invalid');
    $('.invalid-feedback').remove();
}

var gettext = window.gettext || function (s) {
    return s;
};

$(function () {
    callGetMoney();
    // getcontent_ukgc();
    var csrftoken = getCookie('csrftoken');
    $('[name="csrfmiddlewaretoken"]').val(csrftoken)
    $.ajaxSetup({
        beforeSend: function (xhr, settings) {
            if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
                // Only send the token to relative URLs i.e. locally.
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });
    callGetNotiPromotion('');
    var gettext = window.gettext || function (s) {
        return s;
    };

    $('.cookie-policy-close').on('click', function(){
        setCookie('ucc_cookie',1,36500);
        $('.cookie-policy').hide();
    });

    if (getCookie("ucc_cookie") == null || getCookie("ucc_cookie") != 1 ){
        $('.cookie-policy').show();
    }
    
    $(".menu-cate #dismiss").click(function () {
        $('.menu-cate').hide();
    });
});
