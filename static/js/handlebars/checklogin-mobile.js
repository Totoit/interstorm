

function checkMobileLogin(session, args) {
  $('.loading').show();
  session.call('/user/account#getProfile', []).then(
      function(result) {
          window.location.href = "/?ismob=1";
      }, function(e) {
          $('.loading').hide();
          $('#mobile_login_form').show();
          c.handleError(e);
      }
  );
}

$(function() {
  if (getParamUrl.get('ismob') == '1'){
    c.doCall(function(session) {
      checkMobileLogin(session, {});
    });
  } else {
    $('#mobile_login_form').show();
  }

});
