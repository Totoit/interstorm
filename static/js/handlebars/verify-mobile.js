$(document).ready(function () {
	var parameters =
	{
		verificationCode: getQueryString('key') // read the key from url
	};

	if(!c.conn.isConnected) {     
		c.conn.open();
	}
		
	c.doCall(getVerifyUser);

	function getVerifyUser(session) {
		session.call("/user/account#activate",[], parameters).then(
				
			function (result) {
			box = $('#verify-box');
			
			box.find('.loading').fadeOut(function() {
				box.find('.success').hide().fadeIn();
				box.find('#succes-btn').hide().fadeIn();
			});

		}, function (err) {
			box = $('#verify-box');
			// err.desc contains error descriptin
			console.log(err.kwargs.desc);
			box.find('.loading').fadeOut(function() {
			box.find('.error p').text(gettext(err.kwargs.desc));
			box.find('.error').hide().fadeIn();
			});

		});
		
		if($('#progress_penguin').length >= 1){
	        document.getElementById("progress_penguin").style.width= '100%';
	    }
	}
});
