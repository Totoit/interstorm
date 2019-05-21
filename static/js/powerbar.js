(function ($, c) {
    $(function () {
        // Get month
        var enddayofmonth = new Date();
        //enddayofmonth.setDate(1);
        var startdayofmonth = new Date();
        //startdayofmonth.setDate(1);
        //startdayofmonth.setMonth(enddayofmonth.getMonth() - 3);
        //startdayofmonth = startdayofmonth.setDate(1);
        //console.log("startdayofmonth :", startdayofmonth);
        var totalvalbymonth = 0;
        c.doCall(function (session) {
            getTranHistory(session, startdayofmonth, enddayofmonth, function (objvalue) {
                totalvalbymonth = objvalue;
                $('p.amount-of-campaings').html(totalvalbymonth + " " +c.currency);
                console.log("totalvalbymonth :", totalvalbymonth);
            });
        });
    });

    function getTranHistory(session, tran_date_start, tran_date_end, callback) {
        var _dateS = new Date(tran_date_start.valueOf());
        var _dateE = new Date(tran_date_end.valueOf());
        _dateS.setHours(0);
        _dateS.setMinutes(0);
        _dateS.setSeconds(0);
        _dateS.setMilliseconds(0);
        _dateS.setDate(1);
        _dateS.setMonth(5);
        _dateS.setFullYear(2018);
        _dateE.setHours(23);
        _dateE.setMinutes(59);
        _dateE.setSeconds(59);
        _dateS.setMilliseconds(0);


        var payload = {
            type: "deposit", //tran_type,
            startTime: _dateS,
            endTime: _dateE,
            pageIndex: 1,
            pageSize: 100000
        };
        var objvalue = 0;
        var r = 0;

        function sumvalue(value, index, array) {
            r++;
            objvalue += value.credit.amount;
            if (r === array.length) {
                callback(objvalue);
            }
        }

        session.call('/user#getTransactionHistory', [], payload).then( //Validate credential validation
            function (result) {
                if (result.kwargs.transactions.length > 0) {
                    result.kwargs.transactions.forEach(sumvalue);
                } else {
                    callback(0);
                }


            }), function (err) {
            return objvalue;
            c.conn.close();
            console.log(err);
        }

    }

})(jQuery, c);