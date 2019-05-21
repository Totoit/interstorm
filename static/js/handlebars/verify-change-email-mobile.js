/**
 * Created by autthasae on 1/13/2017.
 */

$(document).ready(function () {
	var parameters =
	{
		key: getQueryString('key'),
		email:getQueryString('email')// read the key from url
	};

	if(!c.conn.isConnected) {     
		c.conn.open();
	}
		
	c.doCall(getVerifyUser);

	function getVerifyUser(session) {
		session.call("/user/email#verifyNewEmail",[], parameters).then(

			function (result) {
			box = $('#verify-box');
			console.log(result);


			console.log("good",box);
			box.find('.loading').fadeOut(function() {
			box.find('.success').hide().fadeIn();
			box.find('#succes-btn').hide().fadeIn();
			});

		}, function (err) {
				console.log("error",err);
			box = $('#verify-box');
			// err.desc contains error descriptin
			console.log(err.kwargs.desc);
			box.find('.loading').fadeOut(function() {
			box.find('.error p').text("Vi beklager, linket er udløbet eller ugyldigt");
			box.find('.error').hide().fadeIn();
			});
		});
	}
});






