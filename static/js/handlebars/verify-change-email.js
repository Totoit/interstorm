/**
 * Created by autthasae on 1/13/2017.
 */

// Getting verification code
function getQueryString(name) {
	name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(location.search);
	return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}


$(function () {

	c.doCall(getVerifyNewEmail);
	var parameters =
	{
		key: getQueryString('key'),
		email: getQueryString('email')// read the key from url
	};

	function getVerifyNewEmail(session) {
		console.log('Connection is established. Session ID = %o', session.id);
		// console.log(parameters);
		$('.loading').show();
		session.call("/user/email#verifyNewEmail", [], parameters).then(
			function (result) {
				box = $('#verify-box');
				$('.loading').hide();
				if ($('#progress_penguin').length >= 1) {
					document.getElementById("progress_penguin").style.width = '100%';
				}
				
				box.find('.loading').fadeOut(function () {
					box.find('.success').hide().fadeIn();
					//box.find('#succes-btn').hide().fadeIn();
					$('#status_verify').append(gettext('LANG_JS_YOUR_NEW_EMAIL_ADDRESS_HAS_VERIFIED'));
					swal({
						title: gettext('LANG_JS_VERIFIED'),
						text: gettext('LANG_JS_REGISTER_SUCCESSFULLY'),
						type: "success",
						icon: "success",
						showCancelButton: false,
						confirmButtonColor: '#3085d6',
						cancelButtonColor: '#d33',
						confirmButtonText:  gettext('LANG_JS_OK'),
						closeOnConfirm: false
					  },
					  function(){
						document.location.href = "/";
					  });

				});
			}, function (err) {
				box = $('#verify-box');
				// err.desc contains error descriptin
				console.log(err.kwargs.desc);
				$('.loading').hide();
				box.find('.loading').fadeOut(function () {
					box.find('.error p').text(err.kwargs.desc);
					box.find('.error').hide().fadeIn();
					$('#status_verify').append(err.kwargs.desc);
					swal({
						title: gettext("LANG_JS_SOMETHING_WRONG"),
						text: err.kwargs.desc,
						icon: "error",
						button: gettext("LANG_JS_OK"),
					},
					function(){
					  document.location.href = "/";
					});

				});
			});
	}
});

// c.conn.open();





