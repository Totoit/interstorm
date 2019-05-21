$(function () {
    c.doCall(getProfile);
    $('#updateProfile').click(function(){
        $('.loading').show();
        updateProfileData();
    });

    $('#live-call:not(disabled)').click(function(){
        var windowParams = function() {
            var w = window.outerWidth * 0.7;
            var h = window.outerHeight * 0.8;

            return [
                'height=' + h,
                'width=' + w,
                'left=0',
                'fullscreen=yes',
                'scrollbars=no',
                'status=yes',
                'resizable=yes',
                'menubar=no',
                'toolbar=no',
                'addressbar=no',
                'location=no'
            ].join(',');
        }
        var chatWindow = window.open('/account/videocall/?streaming', 'liveAgentChat', windowParams());
    });

    $('#skype-call:not(disabled)').click(function(){
        var windowParams = function() {
            var w = window.outerWidth * 0.5;
            var h = window.outerHeight * 0.75;

            return [
                'height=450',
                'width=350',
                'left='+ (w - (350/2)),
                'fullscreen=yes',
                'scrollbars=no',
                'status=yes',
                'resizable=yes',
                'menubar=no',
                'toolbar=no',
                'addressbar=no',
                'location=no'
            ].join(',');
        }
        var chatWindow = window.open('/account/chat/?directChat', 'liveAgentChat', windowParams());
    });
});

var data = [];
var data_disabled = [];
var isFirstTime = false;

function getCountries(session) {
    var payload = {
        "expectRegions": true,
        "excludeDenyRegistrationCountry": true
    };
    session.call("/user/account#getCountries", [], payload).then(function (response) {
        // var $country = $('#create-country');
        var $phonePrefix = $('#mobilePrefix');
        $(response.kwargs.countries).each(function (index, value) {
            var $countrie = $("<option/>").attr("value", value.code).text(value.name);
            if (value.phonePrefix) {
                var $Prefix = $("<option/>").attr("value", value.phonePrefix).text(value.phonePrefix).attr("data-id", value.code);
                $phonePrefix.append($Prefix);
            }
        });
        return response

    }).then(function (response) {
        var options = $('select#mobilePrefix option');
        var arr = options.map(function (_, o) {
            return {t: $(o).text(), v: o.value, i: $(o).attr('data-id')};
        }).get();
        arr.sort(function (o1, o2) {
            return o1.t > o2.t ? 1 : o1.t < o2.t ? -1 : 0;
        });
        options.each(function (i, o) {
            o.value = arr[i].v;
            $(o).text(arr[i].t);
            $(o).attr('data-id', arr[i].i);
        });
        $("#mobilePrefix option[data-id='" + response.kwargs.currentIPCountry + "']").prop("selected", true);
    });
}

function getProfile(session) {
    session.call('/user#getSessionInfo', []).then( function (InfoResult) {
        console.log('getSessionInfo Roles : ',InfoResult.kwargs.roles.length);
        if(InfoResult.kwargs.roles.length == 0){
            // $('#identification-in-progress').css('display','inline');
            // $('#identification-method').css('display','inline');
            $('#dashboard_form').css('display','none');
        }else{
            $('#identification-in-progress').css('display','none');
            $('#identification-method').css('display','none');
            $('#dashboard_form').css('display','inline');
        }
        

        $('#dashboard_form').css('display','inline');
    }, function (e) {
        console.log(e);
        c.handleError(e);
    });

    session.call('/user/account#getProfile', []).then( //Validate credential validation
    function (result) {
        data_disabled = result.kwargs;
        data = result.kwargs.fields;
        // console.log('getProfile data',data);
        setFields();
        getCountries(session);

        
    }, function (e) {
        console.log(e);
        c.handleError(e);
    });
}

function setFields() {

    form = $('#dashboard_form');

    if(data) {
        form.find('#full-name').html(data.firstname + " " + data.surname);
        form.find('#nation-id span').html(data.personalId);
        form.find('#birth-date span').html(data.birthDate);
        form.find('#address-label span').html(data.address1 + " " + data.city + " " + data.postalCode);
        form.find('#phone-label span').html(data.mobilePrefix + "" + data.mobile);
        form.find('#email-label span').html(data.email);
    }

    $.each(data, function (key, value) {
        // console.log(key + "::" , value);
        // console.log('data',data);

        var input = form.find('#' + key);
        // console.log("input tagName",input);
        if (input.length != 0) { //Input exists
            if (input.hasClass('dropdown-toggle')) { //This is a dropdown button type


                //Crawls the list and puts the input and the data-value into the button
                input.next().find('li').each(function () {

                    if ($(this).attr('data-value') == value) {
                        input.html($(this).html() + '<span class="glyphicon glyphicon-menu-down"></span>');
                        input.attr('data-value', value);
                    }
                });
            }
            else if (input[0].tagName == "LABEL") {
                //console.log("lable");
                input.html(value);
            }
            else { //This is a text field
                var key_dis_name = 'is'+key.charAt(0).toUpperCase() + key.slice(1)+'Updatable';
                if(key == 'gender'){
                  if(value == 'F'){
                    input.val(gettext('LANG_JS_FEMALE'));
                  }else{
                    input.val(gettext('LANG_JS_MALE'));
                  }
                }else{
                  input.val(value);
                }
                if(typeof data_disabled[key_dis_name]  !== 'undefined'){
                    console.log('data',data_disabled[key_dis_name]);
                    if(!data_disabled[key_dis_name]){
                        input.prop('disabled',true);
                    }
                }
            }
            delete data[key];
            //console.log("reomove :",delete data[key]);
        }

    });

    //USERCONSENT
    $.each(data.userConsents, function (key, value) {
        $('input[name=' + key + ']').filter('[value="' + value + '"]').prop('checked', true);
    });
}

function validateFields() {

    var form = [];

    //Get data from form
    $('#dashboard_form input').each(function () {
        form[$(this).attr("id")] = $(this).val();
    });

    //Make sure all fields are filled out
    //console.log("from", form);
    for (var key in form) {

        //row = $('#' + key).parent().parent();
        //console.log("key", key);
        if (form[key] === "" && key != "password") {
            $('#' + key).popover({content: "Du mangler at udfylde et felt i denne række"});
            $('#' + key).popover('show');

            return false;
        } else {
            $('#' + key).popover('hide');
        }
    }

    return true;

}

function getFields() {


    //console.log(valid);

    if (validateFields()) {


        var form = {};


        //Get data from form
        $('#dashboard_form input').each(function () {
            form[$(this).attr("id")] = $(this).val();
        });

        $('.btn').each(function () {
            form[$(this).attr("id")] = $(this).attr("data-value");
        });


        //console.log("Data :", data);
        $.extend(form, data);
        //console.log("From :", form);
        //alert("Update Profile");
        if (isFirstTime) {
            c.doCall(updateFirsttimeProfile, form);
        }
        else {
            c.doCall(updateProfile, form);
        }

    } else {
        $('#submitinfo').removeClass('loader');
    }
}


function updateFirsttimeProfile(session, args) {
    //console.log(args);
    session.call('/user/account#updateProfile', [], args).then( //Validate credential validation
        function (result) {
            console.log(result);
        }, function (err) {
            console.log(err);
        });
}

function updateProfile(session, args) {
    //console.log(args);
    session.call('/user/account#updateProfile', [], args).then( //Validate credential validation
        function (result) {
            console.log(result);
        }, function (err) {
            console.log('error :', err);
        });

}

function updateProfileData(session) {
    var form = $('#dashboard_form');
    var payload = {
        title: 'Mr.',
        mobilePrefix: form.find('#mobilePrefix').val(),
        mobile: form.find('#mobile').val(),
        address1: form.find('#address1').val(),
        city: form.find('#city').val(),
        postalCode: form.find('#postalCode').val(),
        firstname: form.find('#firstname').val(),
        surname: form.find('#surname').val(),
        //referrerID:form.find('#create-currencies').val(),
        userConsents: {
            "termsandconditions": form.find('input[name=termsandconditions]:checked').val(),
            "sms": form.find('input[name=sms]:checked').val(),
            "emailmarketing": form.find('input[name=emailmarketing]:checked').val(),
            "3rdparty": form.find('input[name=3rdparty]:checked').val()
        },
    }
    // console.log(payload);
    c.doCall(function (session) {
        session.call('/user/account#updateProfile', [], payload).then(function (result) {
            $('.loading').hide();
            swal({
                title: gettext("LANG_JS_UPDATED_SUCCESSFULLY"),
                text: "",
                icon: "success", 
                button: gettext("LANG_JS_OK"),
                className: "success-alert"
            });
        }, function (err) {
            $('.loading').hide();
            swal({
                title: gettext("LANG_JS_ERROR"),
                text: err.kwargs.desc,
                icon: "error", 
                button: gettext("LANG_JS_OK"),
                className: "error-alert"
            });
        });
    });
}
