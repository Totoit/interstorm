/**
 * Created by Aum on 10/sep/2018.
 */
var userID = "";
var inbox_result = [];

function setDataShowInbox(response) {
  var value = response;
  console.log(value);
  var template_base = '/static/handlebars/dashboard/inbox.hbs';
  $.get(template_base, function(html) {
    var Template = Handlebars.compile(html);
    limitData = $.extend({}, value, '');
    Handlebars.registerHelper('trans', function(title) {
      var t = gettext(title);
      return t;
    });
    var HTML = Template(limitData);
    $("#inbox_result").append(HTML);
    $('#inbox_loading').hide();
    if (value.list.length > 0){
        $('#inbox_result').show();
        $('#inbox_noresult').hide();
    } else {
      $('#inbox_result').hide();
      $('#inbox_noresult').show();
    }

  });
}

function getInboxList() {
  $('#inbox_loading').show();
  $.ajax({
      url: '/wheel/get_bonus_code_inbox',
      type: 'POST',
      method: 'POST',
      data: {
          user_id: userID
      },
      success: function (result) {
          inbox_result.list = JSON.parse(result);
          setDataShowInbox(inbox_result);
      },
      error: function (xhr, errmsg, err) {
          console.log(err);
      }
  });
}

function getProfileSession(session) {
 session.call('/user#getSessionInfo', []).then(function(result) {
    userID = result.kwargs.userID;
    // userID = 3306955;
    getInboxList();
 }, function(e) {
   console.log(e);
   c.handleError(e);
 });
}

$(function () {
   c.doCall(getProfileSession);
});
