//(function ($) {
var gettext = window.gettext || function (s) {
    return s;
};
var bonuscode;
var validating_bonus = false;


function bonus(session) {
    var form = $('#bonuscode-form');
    var parameters = {
        "bonusCode": form.find('#bonus_code').val()
    }

    $('.loading').show();

    session.call("/user/bonus#apply", [], parameters).then(function(result) {
        console.log('claim bonus RES !!',result);
        $('.loading').hide();

        // form[0].reset();
        // validating_bonus = false;

        // c.doCall(bonusHistory);
        c.doCall(getBonuses);
    }, function(err) {
        console.log('ciam bonus ERROR !!',err);
        $('.loading').hide();

        // swal({
        //     title: gettext("LANG_JS_WARNING"),
        //     text: err.kwargs.desc,
        //     icon: "warning",
        //     button: gettext("LANG_JS_OK"),
        // });
    });
}

function sumgamehistory(session, data) {
    if (parseFloat(data.initialWagerRequirementAmount) > 0) {

        var _percent = (parseFloat(((parseFloat(data.initialWagerRequirementAmount) - (parseFloat(data.remainingWagerRequirementAmount))) / parseFloat(data.initialWagerRequirementAmount)) * 100)).toFixed(2);
        //var _percent = "5.00";

        /*
        var show_percent = _percent.split(".");
        var show_n = show_percent[0];
        if (show_percent[1] != "00"){
            show_n = show_n +'.'+show_percent[1];
        }*/
        show_n = _percent;
        $('#card_number').attr('aria-valuenow', show_n).css('width', show_n + '%');
        $('#value_bar').html(show_n + '%');

    } else {
        $('#card_number').attr('aria-valuenow', 0).css('width', 0 + '%');
        $('#value_bar').html('0' + '%');

    }
    /*var vars = {
     type: 'gambling', //tran_type,
     startTime: tran_date_start,
     endTime: tran_date_end,
     pageIndex: 1,
     pageSize: 1000000
     };
     var gameamount = 0;
     session.call('/user#getTransactionHistory', [], vars).then( //Validate credential validation

     function (result) {
     console.log("sumgamehistory#2");
     for (i = 0, j = result.kwargs.transactions.length; i < j; i++) {
     var keys = Object.keys(result.kwargs.transactions[i]);
     if (keys[2].objectKeys()=='debit') gameamount += parseInt(keys[2].amount().val);
     }

     var show_percent = parseFloat(parseFloat(gameamount) * parseFloat(1 / 25));
     $('#card_number').attr('aria-valuenow', show_percent).css('width', show_percent + '%');
     $('#value_bar').html(show_percent + '%');
     $('#bonushistory').attr('data-id', id);
     }, function (err) {
     console.log("sumgamehistory#3");
     var show_percent = parseFloat(parseFloat(gameamount) * parseFloat(1 / 25));
     $('#card_number').attr('aria-valuenow', show_percent).css('width', show_percent + '%');
     $('#value_bar').html(show_percent + '%');
     $('#bonushistory').attr('data-id', id);
     console.log(err);
     })
     */
}

function getGamingAccounts(session) {
    session.call("/user/account#getGamingAccounts", [], {expectBalance: true, expectBonus: true}).then(
        function (result) {
            console.log("getGamingAccounts :", result);
        }
    )
}

function getApplicableBonuses(session) {
    var payload = {
        "type" : 'transfer',
        "gamingAccountID" : '9870002'
    };

    session.call("/user#getApplicableBonuses", [], payload).then(
        function (result) {
            // console.log("getApplicableBonuses :", result);
        }
    )
}

function bonusHistory(session) {
    var parameters = {
        "status": "active"
    }

    // if (!/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    //     $('#bonushistory').html('<h3 class="loading-text">' + gettext("LANG_JS_GETTING_BONUS_INFO") + '</h3>');
    // }

    session.call('/user/bonus#getGrantedBonuses', [], parameters).then(function (result) {
        // console.log("RESULT", result);
        var bonusData = result.kwargs.bonuses;

        if (!bonusData) {
            validating_bonus = false;
            c.endCallAnimation();
        }

        $.get('/static/handlebars/auth/bonus_new.hbs', function (data) {
            var Template = Handlebars.compile(data);
            
            for (var i = 0; i < bonusData.length; i++) {
                expiryDate = new Date(bonusData[i].expiryDate);
                bonusData[i].expiryDate = expiryDate.getFullYear() + " " + expiryDate.getDate() + " " + (expiryDate.getMonth() + 1);
            }
            
            Handlebars.registerHelper('trans', function(title) {
                var t = gettext(title);
                return t;
            });

            var HTML = Template({Bonus: bonusData});
            // console.log(HTML);
            $('#bonushistory').html(HTML);
            // Active forfeit function
            forfeitBonusListener();
        }, 'html');
    }, function (err) {
        c.conn.close();
        console.log(err);
    });
}

function forfeitBonusListener() {
    $('#bonushistory .forfeitBonus_btn').click(function () {
        var self = this;

        swal({
            title: gettext("LANG_JS_WARNING"),
            text: gettext("LANG_JS_ARE_YOU_SURE_FORFEIT"),
            icon: "warning",
            showCancelButton: true,
            buttons: { accept: gettext("LANG_JS_OK"), },
        }, function(value){
            $('.loading').show();

            var bonusID = $(self).attr("data-id");
            c.doCall(forfeitBonus, {bonusID: bonusID});
        });
    });
}

function forfeitBonus(session, parameters) {
    session.call('/user/bonus#forfeit', [], parameters).then(function (result) {
        $('.loading').hide();

        c.doCall(bonusHistory);
    }, function (err) {
        $('.loading').hide();

        swal({
            title: gettext("LANG_JS_WARNING"),
            text: err.kwargs.desc,
            icon: "warning",
            button: gettext("LANG_JS_OK"),
        });
    });
}

function getBonuses(session){
    var parameters = {
        // "skipRecords": 0,
        // "maxRecords": "100",
        // "type": "",
        // "status": "active",
        // "triggerType": ""
    }
    var _bonus_casino = 0,
        _bonus_sport = 0,
        _bonus = 0;
    var _bonus_currency = '';

    session.call("/user/bonus#getGrantedBonuses", [], parameters).then(function (result) {
        console.log("granted bonus::", result);
        $.each(result.kwargs.bonuses, function( index, value ) {
            if(value.type == 'freeRound'){
                _bonus_casino += value.amount;
            }else if(value.type == 'freeBet'){
                _bonus_sport += value.amount;
            }else{
                _bonus += value.amount;
            }
            _bonus_currency = value.currency;
          });
          $('.user_bonus_amount').html(_bonus.formatMoney(2, '.', ',')+' '+getSymbol(_bonus_currency))
        //   $('.txt_bonus_sport').html(_bonus_sport.formatMoney(2, '.', ',')+' '+getSymbol(_bonus_currency))
    });
}

$(function () {

    c.doCall(function (session) {
		session.call("/user#getSessionInfo", []).then(
			function (result) {
				if (result.kwargs.isAuthenticated) {
					c.doCall(bonusHistory);
                    c.doCall(getBonuses);
				}
			}
		, function (err) {
			console.log(err);
			c.conn.close();
		});
	});

    $("#active_bonus_submit").click(function (e) {
        var bonusCode = $('#bonuscode-form').find('#bonus_code').val();

        if(bonusCode != ""){
            c.doCall(bonus);
        }else{
            swal({
                title: gettext("LANG_JS_WARNING"),
                text: gettext("LANG_JS_PLEASE_ENTER_YOUR_BONUS_CODE"),
                icon: "warning",
                button: gettext("LANG_JS_OK"),
            });
        }
    });
    // c.doCall(getApplicableBonuses);

    

});
//})(jQuery);
