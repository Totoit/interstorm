let searchParams = new URLSearchParams(window.location.search);

var parameters =
{
	verificationCode: searchParams.get('key')//getQueryString('key') // read the key from url
};

c.conn.onopen = function (session) {
	$('.loading').show();
	console.log( 'Connection is established. Session ID = %o', session.id);
	 if ($('#progress_penguin').length >= 1){
         document.getElementById("progress_penguin").style.width= '0%';
      }

	session.call("/user/account#activate",[], parameters).then(
		function (result) {

		box = $('#verify-box');
 		if ($('#progress_penguin').length >= 1){
        	document.getElementById("progress_penguin").style.width= '100%';
    	}

		box.find('.loading').fadeOut(function() {
			box.find('.success').hide().fadeIn();
			//box.find('#succes-btn').hide().fadeIn();
			$('.loading').hide(); 
			$('#status_verify_account').append('Registration successful');
			swal({
				title: gettext('LANG_JS_VERIFIED'),
				text: gettext('LANG_JS_REGISTER_SUCCESSFULLY'),
				icon: "success",
				type: 'success',
				showCancelButton: false,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: gettext('LANG_JS_OK'),
				closeOnConfirm: false
			},function(){
				document.location.href = "/";
			});
		});
	}, function (err) {
		box = $('#verify-box');
		// err.desc contains error descriptin
		$('#status_verify_account').append(err.kwargs.desc);
		console.log(err.kwargs.desc);
		box.find('.loading').fadeOut(function() {
		box.find('.error p').text(err.kwargs.desc);
		box.find('.error').hide().fadeIn();
		$('.loading').hide();	
			swal({
				title: gettext("LANG_JS_SOMETHING_WRONG"),
				text: err.kwargs.desc,
				icon: "error",
				button: gettext("LANG_JS_OK"),
		  	});

		});
	});
}


c.conn.open();
