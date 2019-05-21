$(function() {

  $('body').on('click', '#submit-withdraw-step-1', function (event) {
    var currency = $('#withdraw-step-1 #ddlCurrency').val();
    var amount = $('#withdraw-step-1 #amount').val();

    var parameters = {
        "fields": {
            "currency": currency,
            "amount": amount,
            "returnURL": window.location+"/withdraw/status?pid={0}", 
            "cancelURL": window.location+"/withdraw/status?pid={0}", 
            "postbackURL": "",
        }
    };
    
    c.doCall(function (session) {
        // console.log('!! parameters !!',parameters);
        session.call('/user/hostedcashier#withdraw', [], parameters).then(function (result) {
            console.log('Result! : hostedcashier#withdraw', result);
            var cashierUrl = result.kwargs.cashierUrl;
            // var pid = result.kwargs.pid;

            if(cashierUrl){
                // $('.loader-page').show();
                $('#withdraw-i-box').append('<iframe id="i-withdraw" src="'+cashierUrl+'" style="border:none;overflow:hidden;height:100%;width:100%;min-height:650px;"></iframe>');
                $('#withdraw-i-box').removeClass('hidden');
                $('#withdraw-form').addClass('hidden');
            }

        }, function (err) {
            console.log('ERROR! : hostedcashier#withdraw', err.kwargs.desc, err.kwargs.detail);
        });
    });
});
});
